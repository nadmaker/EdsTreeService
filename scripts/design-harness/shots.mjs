// Headless-Edge screenshot / eval / click harness over raw CDP.
// No dependencies: Node ≥ 22 (global WebSocket) and an Edge or Chrome binary.
//
//   node scripts/design-harness/shots.mjs <scenarios.json>
//
// Env:  EDGE_PATH   browser binary (default: Edge's usual install path)
//       CDP_PORT    remote-debugging port (default 9333)
//       HARNESS_OUT output dir for PNGs (default scripts/design-harness/out/)
//
// Scenario file: an array of
//   { name, url, width, height, mobile?, steps?: [...], clip?, clipEval? }
// steps, run in order (each wrapped in try/catch so a failing probe still
// leaves you a screenshot):
//   { hydrated: true }            wait until no <astro-island ssr> is left
//   { eval: "<js expression>" }   Runtime.evaluate, result printed as JSON
//   { click: "<selector>", index? }  real mouse press/release at the centre
//   { hover: "<selector>", index? }  real mouse move (CSS :hover engages)
//   { scroll: <y> }               window.scrollTo(0, y)
//   { wait: <ms> }
//   { script: "<path.js>" }       evaluate a file's source (e.g. an injector),
//                                 path relative to the scenario file
// clip: { x, y, width, height, scale? } — ⚠ PAGE coordinates, not viewport:
// after a scroll, y must include window.scrollY, or the capture is blank.
// clipEval: a JS expression returning that object (lets you compute it).
//
// Traps this harness has already met are listed in the README.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const EDGE = process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = Number(process.env.CDP_PORT || 9333);
const OUT = resolve(process.env.HARNESS_OUT || resolve(HERE, "out"));
mkdirSync(OUT, { recursive: true });

const scenarioPath = process.argv[2];
if (!scenarioPath) { console.error("usage: node shots.mjs <scenarios.json>"); process.exit(2); }
const scenarioDir = dirname(resolve(scenarioPath));
const scenarios = JSON.parse(readFileSync(scenarioPath, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const edge = spawn(EDGE, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--window-size=1440,900",
  "--hide-scrollbars",
  "--no-first-run",
  "--disable-gpu",
  `--user-data-dir=${resolve(OUT, "edge-profile")}`,
  "about:blank",
], { stdio: "ignore" });

try {
  let wsUrl;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      wsUrl = list.find((t) => t.type === "page")?.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  if (!wsUrl) throw new Error(`no page target on port ${PORT} — is another harness/Edge holding it?`);

  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) events.push(msg);
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (msg) => (msg.error ? rej(new Error(method + ": " + JSON.stringify(msg.error))) : res(msg.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error("eval: " + JSON.stringify(r.exceptionDetails).slice(0, 300));
    return r.result.value;
  };
  const rectOf = (selector, index = 0) =>
    evaluate(`(() => { const els = document.querySelectorAll(${JSON.stringify(selector)}); const el = els[${index}]; if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  const hover = async (selector, index) => {
    const r = await rectOf(selector, index);
    if (!r) throw new Error("hover: not found " + selector);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: r.x, y: r.y });
    await sleep(150);
  };
  const click = async (selector, index) => {
    const r = await rectOf(selector, index);
    if (!r) throw new Error("click: not found " + selector);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: r.x, y: r.y });
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: r.x, y: r.y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: r.x, y: r.y, button: "left", clickCount: 1 });
    await sleep(250);
  };

  await send("Page.enable");
  await send("Runtime.enable");

  for (const sc of scenarios) {
    const { name, url, width, height, mobile = false, steps = [], clip } = sc;
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
    await send("Page.navigate", { url });
    for (let i = 0; i < 100; i++) {
      if (events.some((e) => e.method === "Page.loadEventFired")) break;
      await sleep(100);
    }
    events.length = 0;
    await evaluate("document.fonts.ready.then(() => true)");
    await sleep(600);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: height - 5 });

    for (const st of steps) {
      try {
        if (st.hover) await hover(st.hover, st.index ?? 0);
        else if (st.click) await click(st.click, st.index ?? 0);
        else if (st.scroll !== undefined) { await evaluate(`window.scrollTo(0, ${st.scroll}); true`); await sleep(300); }
        else if (st.eval) console.log(name, "eval:", JSON.stringify(await evaluate(st.eval)));
        else if (st.script) {
          const p = isAbsolute(st.script) ? st.script : resolve(scenarioDir, st.script);
          await evaluate(readFileSync(p, "utf8") + "; true");
        }
        else if (st.hydrated) {
          // Astro 5 does NOT leave an `ssr` attribute to poll; each island
          // gains `client-render-time` once React has committed. Cold loads
          // measured ~2.5 s, so the bound is generous. Injecting BEFORE this
          // resolves lets hydration wipe the injected nodes.
          const t = await evaluate("new Promise((r) => { const t0 = Date.now(); const t = setInterval(() => { const isl = [...document.querySelectorAll('astro-island')]; if (!isl.length || isl.every((i) => i.hasAttribute('client-render-time'))) { clearInterval(t); r(Date.now() - t0); } else if (Date.now() - t0 > 15000) { clearInterval(t); r(-1); } }, 100); })");
          if (t < 0) console.log(name, "hydration: TIMED OUT after 15s");
        }
        else if (st.wait) await sleep(st.wait);
      } catch (err) { console.log(name, "STEP FAILED:", String(err.message).slice(0, 220)); }
    }

    let finalClip = clip ? { scale: 1, ...clip } : undefined;
    if (sc.clipEval) { const c = await evaluate(sc.clipEval); finalClip = { scale: 1, ...c }; console.log(name, "clip:", JSON.stringify(finalClip)); }
    const shot = await send("Page.captureScreenshot", { format: "png", clip: finalClip });
    writeFileSync(resolve(OUT, `${name}.png`), Buffer.from(shot.data, "base64"));
    console.log("saved", resolve(OUT, `${name}.png`));
  }
  ws.close();
} finally {
  edge.kill();
}
process.exit(0);
