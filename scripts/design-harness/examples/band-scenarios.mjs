// Generates out/band-scenarios.json: the in-page band prototype at several
// dial settings and widths, for shots.mjs. This is how the topographic
// band was proposed BEFORE any repo file was written — the layers are
// injected into the live, hydrated page (band-inject.js) and screenshotted.
//
//   node scripts/design-harness/examples/band-scenarios.mjs
//   node scripts/design-harness/shots.mjs scripts/design-harness/out/band-scenarios.json
//
// Now that the band is built, the injector re-styles the LIVE band's
// section; use it to try a different dial (e.g. green contour lines) without
// touching AboutUsVariant2.tsx.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { topoUri } from "../topo.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(process.env.HARNESS_OUT || resolve(HERE, "..", "out"));
mkdirSync(OUT, { recursive: true });
const HOME = "http://127.0.0.1:4399/";
const INJECT = resolve(HERE, "band-inject.js");

const scrollTo = "(() => { const s = document.querySelector('#guarantee'); window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 60); return 'scrolled'; })()";

function scenario(name, cfg, extra = {}) {
  return {
    name, url: HOME, width: extra.width || 1440, height: extra.height || 1000, mobile: !!extra.mobile,
    steps: [{ hydrated: true }, { eval: scrollTo }, { script: INJECT }, { eval: `window.__band(${JSON.stringify(cfg)}); 'injected'` }, { wait: 500 }],
  };
}

const tuned = { mode: "edge", size: 400, freq: 0.0084, oct: 3, levels: 12, gain: 6, slope: 2.4, intercept: -0.7 };
const scenarios = [
  scenario("band-neutral-op28", { topoUri: topoUri(tuned), topoOpacity: 0.28, topoSize: 400 }),
  scenario("band-primary-op45", { topoUri: topoUri(tuned), topoOpacity: 0.45, topoSize: 400, lineToken: "--color-brand-primary" }),
  scenario("band-1024", { topoUri: topoUri(tuned), topoOpacity: 0.28, topoSize: 400 }, { width: 1024, height: 900 }),
  scenario("band-390", { topoUri: topoUri(tuned), topoOpacity: 0.28, topoSize: 400 }, { width: 390, height: 1200, mobile: true }),
];
writeFileSync(resolve(OUT, "band-scenarios.json"), JSON.stringify(scenarios, null, 1));
console.log("wrote", resolve(OUT, "band-scenarios.json"));
