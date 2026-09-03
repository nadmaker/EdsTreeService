import type { APIRoute } from "astro";
import { renderSocialShareCard } from "../../components/websites/ExteriorBuilderServices/og/renderSocialShareCard";

/**
 * /og/default.jpg — the site-wide social share image.
 *
 * PRERENDERED. Astro runs this once at build time and writes the bytes to
 * dist as a static file; on Vercel it lands in .vercel/output/static/og/ and
 * is served by the CDN like any image in public/. No function runs when a
 * crawler fetches it. That is deliberate: the renderer reads the photo, logo
 * and font from disk, which is only guaranteed to work during a build (see
 * renderSocialShareCard.ts). Do not remove `prerender` to "make it dynamic".
 *
 * CLIENT.seo.ogImage points here as a root-relative path; Layout.astro
 * absolutizes it against the request origin (root §4.6), so this works on
 * production and on preview deploys without a hardcoded domain.
 *
 * The design lives in ../og/SocialShareCard.tsx. Edit that, rebuild, and this
 * file's output changes — there is no image to hand-edit.
 */
export const prerender = true;

export const GET: APIRoute = async () => {
  const jpeg = await renderSocialShareCard();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
};
