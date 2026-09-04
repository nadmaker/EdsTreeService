// Builder for the procedural topographic contour MASK (monochrome by
// contract — alpha only, no colour in the SVG) and a contact-sheet
// generator for tuning its dials by eye.
//
//   import { topoSvg, topoUri } from "./topo.mjs";
//   node scripts/design-harness/topo.mjs        → out/topo-sheet.html
//   then screenshot it with shots.mjs (file:// URL, see the README).
//
// Two recipes:
//   mode: "band"  — the discrete-band recipe (keep narrow elevation bands;
//                   line width follows the slope → blobs in flat terrain).
//                   Kept for comparison; it lost on the contact sheet.
//   mode: "edge"  — posterise the heightfield into `levels` flat steps, then
//                   a 3×3 Laplacian marks every step boundary as a line of
//                   UNIFORM width; `gain` pushes the faint response to full
//                   alpha; `dilate` widens. This is what shipped in
//                   global.css as --site-tex-topo (400px, 0.0084, 3 octaves,
//                   12 levels, gain 6, stretch 2.4/-0.7, seed 11).
//
// Dials, in the order worth touching: freq (feature scale — scale it with
// the tile: 0.006 @ 560 ≡ 0.0084 @ 400), levels (line density), oct (2 is
// smoother, 4 is ragged), size (cold raster cost scales with tile AREA,
// not octaves), seed (reroll an ugly formation). Never animate freq.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function topoSvg({ size = 560, freq = 0.006, oct = 4, seed = 11, every = 8, n = 40, slope = 1, intercept = 0, mode = "band", levels = 10, gain = 6, dilate = 0 } = {}) {
  const stretch =
    slope !== 1 || intercept !== 0
      ? `<feComponentTransfer><feFuncA type="linear" slope="${slope}" intercept="${intercept}"/></feComponentTransfer>`
      : "";
  let shaping;
  if (mode === "band") {
    const table = Array.from({ length: n }, (_, i) => ((i + 1) % every === 0 ? 1 : 0)).join(" ");
    shaping = `<feComponentTransfer><feFuncA type="discrete" tableValues="${table}"/></feComponentTransfer>`;
  } else {
    const post = Array.from({ length: levels + 1 }, (_, i) => (i / levels).toFixed(3)).join(" ");
    shaping =
      `<feComponentTransfer><feFuncA type="discrete" tableValues="${post}"/></feComponentTransfer>` +
      `<feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="false" edgeMode="wrap"/>` +
      `<feComponentTransfer><feFuncA type="linear" slope="${gain}" intercept="0"/></feComponentTransfer>` +
      (dilate ? `<feMorphology operator="dilate" radius="${dilate}"/>` : "") +
      `<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>`;
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    // Filter region = the tile, or stitchTiles seams (default is -10%…120%).
    `<filter id="t" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/>` +
    // red channel → alpha, RGB forced white: the output is white-with-holes
    `<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0"/>` +
    stretch +
    shaping +
    `</filter><rect width="${size}" height="${size}" filter="url(#t)"/></svg>`
  );
}

/** CSS url("data:…") with < > # " escaped. Contains NO hex colours. */
export function topoUri(opts) {
  const enc = topoSvg(opts).replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23").replace(/"/g, "'").replace(/\n/g, "");
  return `url("data:image/svg+xml,${enc}")`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const OUT = resolve(process.env.HARNESS_OUT || resolve(dirname(fileURLToPath(import.meta.url)), "out"));
  mkdirSync(OUT, { recursive: true });
  const S = { slope: 2.4, intercept: -0.7 };
  const variants = [
    { label: "B1 band f.006 oct3 every8/80 +stretch", freq: 0.006, oct: 3, every: 8, n: 80, ...S },
    { label: "B2 band f.009 oct2 every8/80 +stretch", freq: 0.009, oct: 2, every: 8, n: 80, ...S },
    { label: "E1 edge f.006 oct3 12 levels gain6 (shipped recipe @560)", mode: "edge", freq: 0.006, oct: 3, levels: 12, gain: 6, ...S },
    { label: "E1 @400: f.0084 oct3 12 levels (as in global.css)", mode: "edge", size: 400, freq: 0.0084, oct: 3, levels: 12, gain: 6, ...S },
    { label: "E2 edge f.009 oct2 12 levels gain6", mode: "edge", freq: 0.009, oct: 2, levels: 12, gain: 6, ...S },
    { label: "E3 edge f.006 oct2 16 levels dilate.6 (too heavy)", mode: "edge", freq: 0.006, oct: 2, levels: 16, gain: 6, dilate: 0.6, ...S },
  ];
  // ⚠ URIs go in a <style> block, never in a style="…" attribute: the
  // url("…") quotes would terminate the attribute and every tile goes blank.
  const css = variants.map((v, i) => `.v${i}{mask-image:${topoUri(v)};-webkit-mask-image:${topoUri(v)};mask-size:${v.size || 560}px;-webkit-mask-size:${v.size || 560}px}`).join("\n");
  const tiles = variants.map((v, i) => `<figure><div class="tile v${i}"></div><figcaption>${v.label}</figcaption></figure>`).join("");
  const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:rgb(11,36,14);color:rgb(237,250,239);font:13px system-ui;padding:16px}
.grid{display:grid;grid-template-columns:repeat(3,560px);gap:16px} figure{margin:0}
.tile{width:560px;height:560px;background:rgb(237,250,239);opacity:.5;mask-repeat:repeat;-webkit-mask-repeat:repeat}
figcaption{padding:6px 0}
${css}
</style><div class="grid">${tiles}</div>`;
  writeFileSync(resolve(OUT, "topo-sheet.html"), html);
  console.log("wrote", resolve(OUT, "topo-sheet.html"), "— screenshot it with shots.mjs at ~1760×1250");
}
