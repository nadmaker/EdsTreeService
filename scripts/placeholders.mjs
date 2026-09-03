// Generates the neutral, branded PLACEHOLDER images that stand in for every
// photograph slot on the Ed's Tree Service site until the owner supplies real
// photography (intake: "will be updated manually in the repo").
//
// Why generated rather than borrowed: the EBS photos are roofing, and the
// older tree photos in that repo belonged to the template's first client.
// Neither may ship here (CLAIMS REGISTER, handoff §3). A generated card
// cannot carry anyone else's work, and every required image field still
// resolves to a real file, so nothing 404s and React 19 preloads nothing
// broken (root §9.13).
//
// Run from the repo root:  node scripts/placeholders.mjs
// Same pipeline as the og:image route: Satori (element tree → SVG) → resvg
// (SVG → PNG) → sharp (→ JPEG/PNG). Uses the vendored Zilla Slab TTFs.
//
// Swap any output for a real photo by REPLACING THE FILE with the same name,
// or repointing the one path that references it; rerunning this script
// overwrites every placeholder, so delete a slot from OUTPUTS once its real
// image exists.

import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/images");
const FONT_DIR = path.join(ROOT, "src/components/websites/EdsTreeService/og/fonts");

const GREEN = "#187A26";
const GREEN_HOVER = "#14651F";
const INK = "#0B240E";
const PAPER = "#EDFAEF";
const AMBER = "#E68E1C";

const OUTPUTS = [
  // hero slides (home): 16:9
  ...[1, 2, 3].map((n) => ({ file: `edstree-hero-${n}.jpg`, w: 1600, h: 900, label: `Hero photo ${n}` })),
  // per-service heroes: wide band
  ...["tree-removal", "tree-trimming", "stump-grinding", "storm-clean-up"].map((s) => ({
    file: `edstree-service-${s}.jpg`, w: 1600, h: 640, label: `Service photo · ${s.replace(/-/g, " ")}`,
  })),
  // per-city heroes: 16:9
  ...["goldsboro", "clinton", "mount-olive", "warsaw", "faison", "kenansville"].map((c) => ({
    file: `edstree-city-${c}.jpg`, w: 1600, h: 900, label: `City photo · ${c.replace(/-/g, " ")}`,
  })),
  // gallery: 4:3
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ file: `edstree-gallery-${n}.jpg`, w: 1200, h: 900, label: `Gallery photo ${n}` })),
];

function el(type, props = {}, ...children) {
  return { type, props: { ...props, ...(children.length === 0 ? {} : { children: children.length === 1 ? children[0] : children }) } };
}

/** Branded card: green gradient, wordmark, slot label. White type on
 *  primary-hover measures 7.2:1, so the label is legible everywhere. */
function photoCard({ w, h, label }) {
  const scale = w / 1600;
  return el(
    "div",
    {
      style: {
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        width: w, height: h, position: "relative",
        backgroundImage: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_HOVER} 55%, ${INK} 100%)`,
        fontFamily: "Zilla Slab", color: PAPER,
      },
    },
    el("div", { style: { position: "absolute", top: 0, left: 0, width: w, height: h, backgroundImage: `radial-gradient(circle at 80% 15%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%)` } }),
    el("div", { style: { display: "flex", fontSize: Math.round(120 * scale), fontWeight: 700, lineHeight: 1, letterSpacing: -1 } }, "Ed's Tree Service"),
    el("div", { style: { display: "flex", marginTop: Math.round(28 * scale), fontSize: Math.round(40 * scale), fontWeight: 600, textTransform: "uppercase", letterSpacing: Math.round(6 * scale), color: AMBER } }, "Placeholder"),
    el("div", { style: { display: "flex", marginTop: Math.round(18 * scale), fontSize: Math.round(34 * scale), fontWeight: 600, opacity: 0.85 } }, label),
  );
}

/** Two-line wordmark on a transparent ground. `ink` = the type colour. */
function wordmark({ ink, accent }) {
  return el(
    "div",
    { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: 1600, height: 400, fontFamily: "Zilla Slab", paddingLeft: 40, paddingRight: 40 } },
    el("div", { style: { display: "flex", fontSize: 230, fontWeight: 700, lineHeight: 0.9, letterSpacing: -4, color: accent } }, "ED'S"),
    el("div", { style: { display: "flex", marginTop: 14, fontSize: 92, fontWeight: 600, lineHeight: 1, letterSpacing: 12, color: ink } }, "TREE SERVICE"),
  );
}

function favicon() {
  return el(
    "div",
    { style: { display: "flex", alignItems: "center", justifyContent: "center", width: 192, height: 192, borderRadius: 40, backgroundColor: GREEN, fontFamily: "Zilla Slab", color: "#FFFFFF" } },
    el("div", { style: { display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 1, marginTop: -8 } }, "E"),
  );
}

async function renderPng(tree, w, h, fonts) {
  const svg = await satori(tree, { width: w, height: h, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng();
}

const [bold, semi] = await Promise.all([
  fs.readFile(path.join(FONT_DIR, "ZillaSlab-Bold.ttf")),
  fs.readFile(path.join(FONT_DIR, "ZillaSlab-SemiBold.ttf")),
]);
const fonts = [
  { name: "Zilla Slab", data: bold, weight: 700, style: "normal" },
  { name: "Zilla Slab", data: semi, weight: 600, style: "normal" },
];

await fs.mkdir(OUT, { recursive: true });
for (const o of OUTPUTS) {
  const png = await renderPng(photoCard(o), o.w, o.h, fonts);
  await sharp(png).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT, o.file));
  console.log("wrote", o.file);
}
for (const [file, colors] of [
  ["edstree-logo.png", { ink: INK, accent: GREEN }],
  ["edstree-logo-white.png", { ink: "#FFFFFF", accent: "#FFFFFF" }],
]) {
  const png = await renderPng(wordmark(colors), 1600, 400, fonts);
  await sharp(png).trim().png().toFile(path.join(OUT, file));
  console.log("wrote", file);
}
{
  const png = await renderPng(favicon(), 192, 192, fonts);
  await sharp(png).png().toFile(path.join(ROOT, "public/favicon.png"));
  console.log("wrote favicon.png");
}
