// Generates the CENTRED-STACK variant of the wordmark: the "ED'S" row moved
// so it is horizontally centred over "TREE SERVICE" instead of flush left.
//
// Why generated rather than hand-edited: the source PNGs are the owner's
// artwork, and the only change wanted is a translation of one row. Deriving
// it keeps the two files provably identical in colour, weight and antialias,
// and it re-derives correctly if the owner ever supplies a new wordmark —
// rerun the script rather than redoing the edit by eye.
//
// Run from the repo root:  node scripts/stack-logo.mjs
//
// The row split is MEASURED, not hardcoded: the script profiles the alpha
// channel for fully-transparent rows, which cleanly separates the two words
// (the source has a ~52px clear gutter between them). It then re-composites
// the upper row centred on the lower row's own ink centre — not on the
// canvas centre, so it stays correct if a future wordmark is not itself
// centred in its canvas. Canvas size is preserved, so nothing that already
// sizes the logo by height changes its rendered width and no layout shifts.
//
// Fails loudly if a source does not split into exactly two rows, rather than
// silently emitting a copy of the input.

import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/images");

/** [source, output] pairs — the colour mark and its white knockout. */
const PAIRS = [
  ["edstree-logo.png", "edstree-logo-stacked.png"],
  ["edstree-logo-white.png", "edstree-logo-white-stacked.png"],
];

/** Alpha above this counts as ink; anything lower is antialias fringe. */
const INK_ALPHA = 16;

/** Rows of consecutive ink, as [firstRow, lastRow] pairs. */
function inkRows(data, width, height, channels) {
  const bands = [];
  let start = null;
  for (let y = 0; y <= height; y++) {
    let hasInk = false;
    if (y < height) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * channels + 3] > INK_ALPHA) {
          hasInk = true;
          break;
        }
      }
    }
    if (hasInk && start === null) start = y;
    if (!hasInk && start !== null) {
      bands.push([start, y - 1]);
      start = null;
    }
  }
  return bands;
}

/** Horizontal ink extent within a row range, as [firstCol, lastCol]. */
function inkColumns(data, width, channels, top, bottom) {
  let min = width;
  let max = -1;
  for (let y = top; y <= bottom; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > INK_ALPHA) {
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
  }
  return [min, max];
}

async function stack(sourceName, outputName) {
  const sourcePath = path.join(OUT, sourceName);
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const rows = inkRows(data, width, height, channels);
  if (rows.length !== 2) {
    throw new Error(
      `${sourceName}: expected 2 rows of text, found ${rows.length} ` +
        `(${JSON.stringify(rows)}). The wordmark's layout changed — ` +
        `re-check this script's assumptions before trusting its output.`,
    );
  }

  const [[upperTop, upperBottom], [lowerTop, lowerBottom]] = rows;
  const [upperLeft, upperRight] = inkColumns(data, width, channels, upperTop, upperBottom);
  const [lowerLeft, lowerRight] = inkColumns(data, width, channels, lowerTop, lowerBottom);

  const upperWidth = upperRight - upperLeft + 1;
  const lowerCentre = (lowerLeft + lowerRight) / 2;
  /* Left edge that puts the upper row's centre on the lower row's centre. */
  const newLeft = Math.round(lowerCentre - (upperWidth - 1) / 2);
  const shift = newLeft - upperLeft;

  /* The upper row's ink, lifted out of the source at its own bounding box. */
  const upper = await sharp(sourcePath)
    .ensureAlpha()
    .extract({ left: upperLeft, top: upperTop, width: upperWidth, height: upperBottom - upperTop + 1 })
    .png()
    .toBuffer();

  /* The lower row, taken full-width so its own position is untouched. */
  const lower = await sharp(sourcePath)
    .ensureAlpha()
    .extract({ left: 0, top: lowerTop, width, height: lowerBottom - lowerTop + 1 })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: lower, left: 0, top: lowerTop },
      { input: upper, left: newLeft, top: upperTop },
    ])
    .png()
    .toFile(path.join(OUT, outputName));

  console.log(
    `${outputName}  ${width}x${height}  ` +
      `upper row x ${upperLeft}-${upperRight} → ${newLeft}-${newLeft + upperWidth - 1} ` +
      `(shift ${shift > 0 ? "+" : ""}${shift}px, centred on ${lowerCentre})`,
  );
}

for (const [source, output] of PAIRS) {
  await stack(source, output);
}
