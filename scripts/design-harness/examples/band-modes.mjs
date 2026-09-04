// Modes module for trace.mjs — the A/B that sized the topographic band's
// contour tile (2026-09-04). Every run gets its own SEED so the data URI
// differs and the tile is generated COLD each time; Edge caches the decoded
// data-URI otherwise, and a real visitor never benefits from that on first
// paint.
//
//   node scripts/design-harness/trace.mjs 4 scripts/design-harness/examples/band-modes.mjs
//
// Results recorded in the build log (medians of 4, software raster):
// ground+panel 131 ms · 560px tile 498–582 (octaves barely matter) ·
// 400px 373 · 320px 243 — cost scales with tile AREA.
import { topoUri } from "../topo.mjs";

export const url = "http://127.0.0.1:4399/";
export const prepare = "(() => { const s = document.querySelector('#guarantee'); window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 60); return true; })()";
export const injectFile = "./band-inject.js";
export const entry = "__band";

const E = { mode: "edge", levels: 12, gain: 6, slope: 2.4, intercept: -0.7 };
export const modes = {
  baseline: () => null,
  panel: () => ({ topoUri: "none", topoOpacity: 0, chevHeightPct: 0.0001 }),
  "full-oct3-560": (run) => ({ topoUri: topoUri({ ...E, freq: 0.006, oct: 3, seed: 100 + run }), topoOpacity: 0.28 }),
  "full-oct3-400": (run) => ({ topoUri: topoUri({ ...E, size: 400, freq: 0.0084, oct: 3, seed: 400 + run }), topoOpacity: 0.28, topoSize: 400 }),
  "full-oct3-320": (run) => ({ topoUri: topoUri({ ...E, size: 320, freq: 0.0105, oct: 3, seed: 500 + run }), topoOpacity: 0.28, topoSize: 320 }),
};
