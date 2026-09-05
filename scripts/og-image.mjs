// Generates the site-wide social share image (og:image) from the owner's
// supplied artwork.
//
// Run from the repo root:  node scripts/og-image.mjs
//
// THE OUTPUT MUST BE EXACTLY 1.91:1 AND MUST FILL IT. Link previews —
// iMessage, Facebook, LinkedIn, Slack — render the og:image edge-to-edge at
// the bubble's full width. An earlier version of this script fitted the card
// with `contain` on a brand-green pad to avoid cropping anything; that is
// what put visible green bars down each side of the iMessage thumbnail. Any
// padding you bake in shows up as bars. Fill the frame.
//
// WHAT GETS CUT, AND WHY THIS PARTICULAR CUT:
//
// The supplied card is 1153x771 (1.495:1) and splits into two bands — a flat
// green banner strip on top, and the main panel below it. Two useful facts
// fell out of measuring them:
//
//   · The PANEL ALONE is 1153x601 = 1.918:1. That is the og ratio almost to
//     the decimal, so the panel needs no cropping at all.
//   · Stacking the banner back on top at the same scale overflows 630 by
//     172px, and taking those 172px off the PANEL'S TOP removes exactly one
//     element: the email chip. The phone chip starts 10px below the cut.
//
// So the choice is one element, either way: drop the banner (panel alone,
// nothing else touched) or drop the email chip (banner kept). This ships the
// second — the "REMOVAL | TRIM | STUMP" strip is the card's most recognisable
// feature and carries the service list, the phone is worth more than the
// email in a link preview, and the email on the artwork is the
// exteriorbuilder121414@gmail.com address inherited from the fork's parent
// client. To ship the other one instead, set BANNER = false.
//
// ⚠ TWO MEASUREMENT TRAPS, both of which produced confident wrong numbers:
//
// 1. `sharp(src).extract(box).stats()` does NOT respect the extract —
//    `stats()` reads the SOURCE, so every region probed returns the
//    whole-image average and different boxes come back byte-identical.
//    Extract to a buffer FIRST, then call stats() on that buffer.
// 2. Finding the banner by looking for flat green stops at the first row of
//    white LETTERING (row 36 of a 170px band). The band is green OR white;
//    test for both, which is what detectBannerHeight does below.

import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "public/images");

/** The owner's artwork, as supplied. */
const SOURCE = path.join(IMAGES, "social Share for Ed's Tree Service.jpg");

/**
 * Output. Clean slug on purpose: the source filename contains spaces and an
 * apostrophe, which would reach crawlers percent-encoded as
 * `/images/social%20Share%20for%20Ed%27s%20Tree%20Service.jpg`. Some
 * scrapers handle that badly, and og:image is not a place to find out.
 */
const OUTPUT = path.join(IMAGES, "edstree-social-share.jpg");

/** The preview box every platform shares. */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/** Keep the banner strip (drops the email chip); false = panel only. */
const BANNER = true;

/** --color-brand-primary, and the artwork's own banner fill. */
const BRAND_PRIMARY = { r: 24, g: 122, b: 38 };

/**
 * Height of the top banner, found by scanning down for the first row that is
 * no longer overwhelmingly the banner's own colours. Measured rather than
 * hardcoded so a re-cut of the artwork does not silently slice the wrong row.
 */
async function detectBannerHeight(src) {
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const isBannerPixel = (x, y) => {
    const i = (y * width + x) * channels;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const green =
      Math.abs(r - BRAND_PRIMARY.r) < 30 &&
      Math.abs(g - BRAND_PRIMARY.g) < 30 &&
      Math.abs(b - BRAND_PRIMARY.b) < 30;
    const white = r > 200 && g > 200 && b > 200;
    return green || white;
  };
  const fraction = (y) => {
    let hits = 0;
    let total = 0;
    for (let x = 0; x < width; x += 3) {
      total++;
      if (isBannerPixel(x, y)) hits++;
    }
    return hits / total;
  };

  /*
   * A SUSTAINED transition, not the first dip. Scanning for the first row
   * below threshold stops at row 36, where one row of letterform antialiasing
   * reads 0.62 before recovering to 0.96 — a 36px "banner" instead of ~162.
   * The real edge is the first row that is low AND stays low.
   */
  const RUN = 10;
  let y = 0;
  for (; y < height; y++) {
    if (fraction(y) >= 0.5) continue;
    let sustained = true;
    for (let k = 1; k <= RUN && y + k < height; k++) {
      if (fraction(y + k) >= 0.5) {
        sustained = false;
        break;
      }
    }
    if (sustained) break;
  }
  if (y < 40 || y > height / 2) {
    throw new Error(
      `Banner detection returned ${y}px of ${height} — implausible. The ` +
        `artwork's layout changed; re-check this script before trusting it.`,
    );
  }
  return y;
}

const meta = await sharp(SOURCE).metadata();
const srcW = meta.width;
const srcH = meta.height;
const bannerH = await detectBannerHeight(SOURCE);
const panelTop = bannerH;
const panelH = srcH - panelTop;

const panelSource = { left: 0, top: panelTop, width: srcW, height: panelH };

if (!BANNER) {
  /* Panel alone — already 1.91:1, so this is a straight resize. */
  const out = await sharp(SOURCE)
    .extract(panelSource)
    .resize(OG_WIDTH, OG_HEIGHT)
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toFile(OUTPUT);
  console.log(
    `${path.relative(ROOT, OUTPUT)}  ${out.width}x${out.height}  ` +
      `${(out.size / 1024).toFixed(0)} KB  (panel only, banner dropped)`,
  );
} else {
  /* Both bands at ONE scale factor, so nothing is stretched relative to
     anything else; the panel gives up the overflow off its own top. */
  const scale = OG_WIDTH / srcW;
  const bannerOutH = Math.round(bannerH * scale);
  const panelOutH = OG_HEIGHT - bannerOutH;
  const panelFullH = Math.round(panelH * scale);

  const banner = await sharp(SOURCE)
    .extract({ left: 0, top: 0, width: srcW, height: bannerH })
    .resize(OG_WIDTH, bannerOutH)
    .png()
    .toBuffer();

  const panel = await sharp(SOURCE)
    .extract(panelSource)
    .resize(OG_WIDTH, panelFullH)
    .extract({ left: 0, top: panelFullH - panelOutH, width: OG_WIDTH, height: panelOutH })
    .png()
    .toBuffer();

  const out = await sharp({
    create: { width: OG_WIDTH, height: OG_HEIGHT, channels: 3, background: BRAND_PRIMARY },
  })
    .composite([
      { input: banner, left: 0, top: 0 },
      { input: panel, left: 0, top: bannerOutH },
    ])
    /* 4:4:4 keeps the wordmark's edges clean; the default 4:2:0 smears the
       saturated green/white boundaries this artwork is built from. */
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toFile(OUTPUT);

  console.log(
    `${path.relative(ROOT, OUTPUT)}  ${out.width}x${out.height}  ` +
      `${(out.size / 1024).toFixed(0)} KB\n` +
      `  banner ${bannerH}px → ${bannerOutH}px, panel cropped ` +
      `${panelFullH - panelOutH}px off its top (drops the email chip)`,
  );
}
