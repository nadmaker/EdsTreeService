// WCAG 2.1 contrast for the live token values in global.css
// (body.theme-edstree). Edit T when the palette changes; add pairs freely.
//
//   node scripts/design-harness/contrast.mjs
//
// This is the FLAT-colour check. It cannot see a texture, scrim or gradient
// under text — for those use root CLAUDE.md §11.10 method 2 (hide the
// glyphs, screenshot the box, sample the extreme pixel).
const T = {
  "default-font (ground)": [11, 36, 14],
  "default-background": [237, 250, 239],
  "brand-primary": [24, 122, 38],
  "brand-primary-hover": [20, 101, 31],
  "brand-secondary (amber)": [230, 142, 28],
  "brand-secondary-hover": [210, 128, 23],
  white: [255, 255, 255],
};
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [h, l] = [L(a), L(b)].sort((x, y) => y - x); return ((h + 0.05) / (l + 0.05)).toFixed(2); };
const mix = (a, b, pa) => a.map((v, i) => Math.round(v * pa + b[i] * (1 - pa)));

const pairs = [
  ["brand-secondary (amber)", "default-font (ground)", "chevron on the dark ground — deliberate, cleared at 6.48"],
  ["brand-secondary (amber)", "brand-primary", "why the ground is NOT primary"],
  ["brand-secondary (amber)", "brand-primary-hover", "why the ground is NOT primary-hover"],
  ["brand-secondary (amber)", "white", "amber as text on white — fails"],
  ["brand-secondary (amber)", "default-background", "amber as text on the page — fails"],
  ["brand-primary", "white", "green text on white"],
  ["brand-primary", "default-background", "green text on the page / light panel"],
  ["white", "default-font (ground)", "white on the dark ground"],
  ["default-background", "default-font (ground)", "background token on the dark ground"],
  ["brand-primary", "default-font (ground)", "primary on the dark ground (contour alternate)"],
  ["default-font (ground)", "default-background", "body copy on the page"],
];
console.log("pair".padEnd(62), "ratio   note");
for (const [a, b, note] of pairs) console.log(`${a} / ${b}`.padEnd(62), ratio(T[a], T[b]).padStart(5), "  " + note);

const derived = {
  "chevron-lit  ≈ secondary 72% + white": mix(T["brand-secondary (amber)"], T.white, 0.72),
  "chevron-shade ≈ secondary 82% + black": mix(T["brand-secondary (amber)"], [0, 0, 0], 0.82),
};
console.log("\nderived chevron stops (sRGB approximation of the oklab color-mix):");
for (const [k, v] of Object.entries(derived)) console.log(" ", k.padEnd(40), `rgb(${v.join(",")})`, " vs ground", ratio(v, T["default-font (ground)"]));
