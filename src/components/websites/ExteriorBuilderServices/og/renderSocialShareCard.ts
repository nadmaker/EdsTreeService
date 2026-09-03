import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { SocialShareCard, OG_WIDTH, OG_HEIGHT, LOGO_DRAW_HEIGHT } from "./SocialShareCard";

/**
 * renderSocialShareCard — turns SocialShareCard.tsx into JPEG bytes.
 *
 * Pipeline: read assets from disk → bake a white halo into the logo (sharp)
 * → Satori (element tree → SVG) → resvg (SVG → PNG) → sharp (PNG → JPEG).
 *
 * This runs at BUILD TIME ONLY. The route that calls it
 * (src/pages/og/default.jpg.ts) is `prerender = true`, so Astro executes this
 * once during `astro build` and writes the bytes out as a static file. Nothing
 * here runs on a Vercel function at request time, which is why reading from
 * the filesystem with process.cwd() is safe: during a build, cwd is the
 * project root, locally and on Vercel. Do NOT convert this to an on-demand
 * route without replacing the fs reads — the function's filesystem does not
 * contain public/.
 *
 * WHY JPEG. resvg emits PNG, and a 1200x630 PNG of a photograph is 1-2 MB.
 * The same card as an 88-quality JPEG is ~150 KB. Crawlers fetch this on
 * every share; smaller is better and the card has no transparency to lose.
 *
 * WHY THE HALO IS BAKED. The composite has a white glow around the buildings
 * and wordmark so the blue wordmark survives the blue gradient. Satori does
 * not support `filter: drop-shadow`, so the glow is pre-rendered into the
 * logo PNG here: pad the logo, take its alpha, blur it, boost it to solid,
 * use it as the alpha of a white layer, then composite the original logo on
 * top. The result is handed to Satori as an ordinary image.
 */

const ROOT = process.cwd();

/** The site's own assets — the same files the pages use. */
const PHOTO_PATH = path.join(ROOT, "public/images/ebs-hero-poster.jpg");
const LOGO_PATH = path.join(ROOT, "public/images/ebs-logo.png");

/**
 * Barlow Semi Condensed 700, the site's --font-heading-1, vendored as TTF
 * (Satori needs the font bytes; it cannot use the Google Fonts <link>). OFL
 * licence sits alongside it. Only one weight is loaded, so everything on the
 * card — strap and phone pill — is set in it.
 */
const FONT_PATH = path.join(
  ROOT,
  "src/components/websites/ExteriorBuilderServices/og/fonts/BarlowSemiCondensed-Bold.ttf",
);

/**
 * Halo geometry, in OUTPUT pixels — the logo is resized to LOGO_DRAW_HEIGHT
 * before any of this runs, so these numbers are what appears on the card.
 * Padding must exceed ~3 sigma or the glow clips at the image edge.
 *
 * With sigma 12 and gain 5 the glow is solid white for ~10px out from every
 * edge and fades over the next ~25px, which is what the composite's halo
 * measures. (Gain multiplies the blurred alpha: 0.5 at the edge x5 clamps to
 * solid; the tail stays soft.)
 */
const HALO_PAD = 44;
const HALO_BLUR_SIGMA = 12;
const HALO_ALPHA_GAIN = 5;

const JPEG_QUALITY = 88;

function toDataUri(mime: string, buf: Buffer) {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function buildHaloedLogo() {
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

  /*
    Resize the artwork to its final drawn height FIRST, so the halo below is
    computed in output pixels. Then pad so the blur has room to spread.
  */
  const sizedLogo = await sharp(LOGO_PATH)
    .ensureAlpha()
    .resize({ height: LOGO_DRAW_HEIGHT, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  const sized = await sharp(sizedLogo).metadata();
  if (!sized.width || !sized.height) {
    throw new Error(`Could not read logo dimensions from ${LOGO_PATH}`);
  }
  const width = sized.width + HALO_PAD * 2;
  const height = sized.height + HALO_PAD * 2;

  const paddedLogo = await sharp(sizedLogo)
    .extend({ top: HALO_PAD, bottom: HALO_PAD, left: HALO_PAD, right: HALO_PAD, background: transparent })
    .png()
    .toBuffer();

  /* Its alpha, blurred and boosted, becomes the halo mask. */
  const haloMask = await sharp(paddedLogo)
    .extractChannel("alpha")
    .blur(HALO_BLUR_SIGMA)
    .linear(HALO_ALPHA_GAIN, 0)
    .toBuffer();

  /*
    A white layer wearing that mask. This MUST be its own pipeline, ending in
    toBuffer(), before the composite below: sharp does not apply operations in
    call order, and `composite` runs BEFORE `joinChannel` inside a single
    pipeline — so chaining them fails with "images do not have same numbers of
    bands" because the base is still RGB when the RGBA logo is laid over it.
  */
  const whiteHalo = await sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .joinChannel(haloMask)
    .png()
    .toBuffer();

  /* The crisp logo composited on top of its own glow. */
  const haloed = await sharp(whiteHalo)
    .composite([{ input: paddedLogo, left: 0, top: 0 }])
    .png()
    .toBuffer();

  return { buf: haloed, width, height, pad: HALO_PAD };
}

export async function renderSocialShareCard(): Promise<Buffer> {
  const [photoBuf, fontBuf, logo] = await Promise.all([
    fs.readFile(PHOTO_PATH),
    fs.readFile(FONT_PATH),
    buildHaloedLogo(),
  ]);

  const photoMeta = await sharp(photoBuf).metadata();
  if (!photoMeta.width || !photoMeta.height) {
    throw new Error(`Could not read photo dimensions from ${PHOTO_PATH}`);
  }

  const svg = await satori(
    SocialShareCard({
      photoSrc: toDataUri("image/jpeg", photoBuf),
      photoWidth: photoMeta.width,
      photoHeight: photoMeta.height,
      logoSrc: toDataUri("image/png", logo.buf),
      logoWidth: logo.width,
      logoHeight: logo.height,
      logoPad: logo.pad,
    }),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: "Barlow Semi Condensed", data: fontBuf, weight: 700, style: "normal" },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } })
    .render()
    .asPng();

  return sharp(png).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
}
