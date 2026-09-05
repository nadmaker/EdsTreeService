// Generates the site-wide social share image (og:image) from the owner's
// supplied artwork.
//
// Run from the repo root:  node scripts/og-image.mjs
//
// WHY THIS EXISTS RATHER THAN POINTING og:image STRAIGHT AT THE ARTWORK:
//
// 1. Aspect ratio. The supplied card is 1153x771 — a 1.495:1 ratio. Facebook,
//    LinkedIn and X all present link previews at 1.91:1 (1200x630) and
//    CENTRE-CROP anything taller. On this artwork that crop cuts the
//    "REMOVAL | TRIM | STUMP" banner off the top AND slices through the
//    "TREE SERVICE" wordmark at the bottom — verified by rendering it.
//    So the file is fitted with `contain`, which loses nothing, rather than
//    letting each platform crop it differently.
//
// 2. The pad colour is the artwork's OWN banner green, measured rather than
//    guessed: the top band is a perfectly flat fill (stdev 0 across the
//    channels) of rgb(24,122,39), which is the brand primary token
//    rgb(24,122,38) plus one unit of JPEG rounding. Padding with the token
//    value makes the top band read as full-bleed and turns the side margins
//    into a deliberate frame instead of letterbox bars.
//
// 3. Width. 1153px is under the 1200px minimum the platforms ask for, so the
//    output is scaled up to the full 1200x630 rather than padded to it.
//
// ⚠ MEASURING COLOURS WITH SHARP: `sharp(src).extract(box).stats()` does NOT
// respect the extract — `stats()` reads the SOURCE image, so every region you
// probe returns the whole-image average and three different boxes come back
// byte-identical. Extract to a buffer FIRST, then call stats() on that
// buffer. This cost a wrong pad colour before it was spotted.

import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "public/images");

/** The owner's artwork, as supplied. */
const SOURCE = path.join(IMAGES, "social Share for Ed's Tree Service.jpg");

/**
 * Output. Clean slug on purpose: the source filename contains spaces and an
 * apostrophe, which would have to reach crawlers percent-encoded as
 * `/images/social%20Share%20for%20Ed%27s%20Tree%20Service.jpg`. Some
 * scrapers handle that badly, and og:image is not a place to find out.
 */
const OUTPUT = path.join(IMAGES, "edstree-social-share.jpg");

/** The platforms' shared preview box. */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/** --color-brand-primary, and the artwork's own banner fill. */
const BRAND_PRIMARY = { r: 24, g: 122, b: 38 };

const info = await sharp(SOURCE)
  .resize(OG_WIDTH, OG_HEIGHT, { fit: "contain", background: BRAND_PRIMARY })
  /* 4:4:4 keeps the wordmark's edges clean; the default 4:2:0 smears
     saturated green/white boundaries, which this artwork is made of. */
  .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
  .toFile(OUTPUT);

console.log(
  `${path.relative(ROOT, OUTPUT)}  ${info.width}x${info.height}  ` +
    `${(info.size / 1024).toFixed(0)} KB`,
);
