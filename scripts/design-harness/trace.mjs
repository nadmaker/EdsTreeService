// Raster / paint cost A/B over CDP tracing.
//
//   node scripts/design-harness/trace.mjs [runs=3] [modes.mjs=examples/band-modes.mjs]
//
// The modes module exports { url, prepare, injectFile, entry, modes }:
//   url         page to load
//   prepare     JS expression run after hydration and before tracing
//               (typically: scroll the section under test into view)
//   injectFile  a script that defines window[entry](cfg) — the in-page
//               prototype injector (see examples/band-inject.js)
//   entry       that function's name
//   modes       { name: (run) => cfg | null } — null = inject nothing
//
// For each mode × run: load, wait for hydration, prepare, settle, START
// tracing, inject, wait 1.5 s, END tracing, and sum the durations of the
// paint/layout/raster events. RasterTask is COMPOSITOR time (off the main
// thread); Paint/Layout/PrePaint are main-thread. With --disable-gpu this is
// software raster — treat the numbers as relative levers, not production
// truth (root CLAUDE.md §11.9).
//
// ⚠ Edge caches a decoded data-URI across navigations. If a mode's cost is
// dominated by generating an SVG tile, give every RUN a different seed (see
// band-modes.mjs) or you will measure a warm cache from run 2 onward.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const EDGE = process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = Number(process.env.CDP_PORT || 9334);
const OUT = resolve(process.env.HARNESS_OUT || resolve(HERE, "out"));
mkdirSync(OUT, { recursive: true });

const RUNS = Number(process.argv[2] || 3);
const modesPath = resolve(process.argv[3] || resolve(HERE, "examples/band-modes.mjs"));
const { url, prepare, injectFile, entry, modes } = await import(pathToFileURL(modesPath).href);
const INJECT = readFileSync(resolve(dirname(modesPath), injectFile), "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,1000", "--hide-scrollbars", "--no-first-run", "--disable-gpu", `--user-data-dir=${resolve(OUT, "edge-profile-trace")}`, "about:blank"], { stdio: "ignore" });

try {
  let wsUrl;
  for (let i = 0; i < 50 && !wsUrl; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); wsUrl = l.find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {} await sleep(200); }
  if (!wsUrl) throw new Error(`no page target on port ${PORT}`);
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); let traceEvents = []; let tracingDone = null; let loaded = false;
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.method === "Tracing.dataCollected") traceEvents.push(...msg.params.value);
    else if (msg.method === "Tracing.tracingComplete") tracingDone?.();
    else if (msg.method === "Page.loadEventFired") loaded = true;
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (r) => (r.error ? rej(new Error(method + ": " + JSON.stringify(r.error))) : res(r.result))); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error("eval: " + JSON.stringify(r.exceptionDetails).slice(0, 300)); return r.result.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  const SUMMED = new Set(["Paint", "RasterTask", "PrePaint", "Layout", "UpdateLayerTree", "ImageDecodeTask", "DecodeImage", "HitTest", "UpdateLayoutTree"]);
  const results = {};
  for (const mode of Object.keys(modes)) {
    results[mode] = [];
    for (let run = 0; run < RUNS; run++) {
      loaded = false;
      await send("Page.navigate", { url });
      for (let i = 0; i < 100 && !loaded; i++) await sleep(100);
      for (let i = 0; i < 50; i++) { if ((await evaluate("document.querySelectorAll('astro-island[ssr]').length")) === 0) break; await sleep(100); }
      if (prepare) await evaluate(prepare);
      await evaluate("document.fonts.ready.then(() => true)");
      await sleep(700);
      traceEvents = [];
      await send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
      await sleep(120);
      const cfg = modes[mode](run);
      if (cfg) {
        await evaluate(INJECT + "; true");
        await evaluate(`window.${entry}(${JSON.stringify(cfg)}); true`);
      }
      await sleep(1500);
      const done = new Promise((r) => (tracingDone = r));
      await send("Tracing.end");
      await done;
      const sums = {};
      for (const e of traceEvents) {
        if (e.ph !== "X" || !SUMMED.has(e.name)) continue;
        sums[e.name] = (sums[e.name] || 0) + (e.dur || 0) / 1000;
      }
      const total = Object.values(sums).reduce((a, b) => a + b, 0);
      results[mode].push({ total: +total.toFixed(1), ...Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, +v.toFixed(1)])) });
      console.log(mode.padEnd(14), `run ${run + 1}`, JSON.stringify(results[mode].at(-1)));
    }
  }
  console.log("\nSUMMARY (ms; main-thread paint/layout + compositor raster; 1.6 s window after injection)");
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  for (const [mode, rs] of Object.entries(results)) {
    const t = rs.map((r) => r.total);
    console.log(mode.padEnd(14), `total median ${med(t)} (min ${Math.min(...t)}, max ${Math.max(...t)})   raster median ${med(rs.map((r) => r.RasterTask || 0))}   paint median ${med(rs.map((r) => r.Paint || 0))}`);
  }
  ws.close();
} finally {
  edge.kill();
}
process.exit(0);
