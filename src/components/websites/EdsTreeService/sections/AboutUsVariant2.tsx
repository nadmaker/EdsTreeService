import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";
import ChevronBand from "./ChevronBand";

/**
 * Ed's — About Us, variant 2: the topographic chevron band.
 *
 * Two columns over a decorative ground built from the HighPoint reference:
 * a dark, textured left field carrying a large bevelled chevron, meeting a
 * light content panel along a shallow diagonal. The reference's hex mesh
 * is replaced by a PROCEDURAL topographic contour field. Everything is
 * drawn or generated — no image file was added to public/ — so a fork
 * re-colours the whole band by changing tokens, never by re-making art.
 *
 * LAYER STACK, bottom to top (2–5 are aria-hidden, pointer-events-none,
 * and hidden below md — see RESPONSIVE):
 *   1  <section>       relative isolate overflow-hidden, dark ground
 *   2  contour field   mask-image: var(--site-tex-topo), 400px tile
 *   3  rake light      var(--site-ground-rake-dark)
 *   4  chevron         inline <svg>, token fills
 *   5  light panel     background token, clip-path diagonal
 *   6  content         the two-column grid, relative z-10
 * `isolate` is load-bearing (same reason as ServicesGridSectionWrapper):
 * without a stacking context of its own, z-index and any blending would
 * reach whatever the page painted underneath the band.
 *
 * WHY mask-image AND NOT background-image for the contours: the
 * --site-tex-* layers get their per-fork recolour from mix-blend-multiply
 * against a LIGHT ground, which does nothing over a dark one. A mask
 * carries alpha only; the colour is this div's background-color, so the
 * line colour is a token like everything else. The SVG in the token is
 * monochrome by contract (global.css).
 *
 * CONTRAST DECISIONS, load-bearing (measured against the live tokens):
 * · The dark ground is --color-default-font (the near-black green), NOT a
 *   primary green. Amber on it is 6.48 — the guide's own body-on-secondary pair
 *   read the other way — where amber on primary is 2.14 and on
 *   primary-hover 2.83. The guide's "no amber inside green sections" rule
 *   is about the primary greens; this pairing is deliberate and cleared
 *   (client CLAUDE.md §2.2). Precedent: ServicesGridSectionWrapper's CTA
 *   tile on the same ground.
 * · No amber in the heading: amber on the panel is 2.37. The accent phrase
 *   is --color-brand-primary, 5.07 on the panel.
 * · No copy over the texture. Every word sits on the light panel; the only
 *   thing over the dark field is the photograph.
 *
 * GEOMETRY that was re-derived rather than copied from the brief:
 * · The light panel runs 48% → 44.5% (brief: 54 → 46). The copy column
 *   starts at 52.2% and the photo ends at 47.8% at EVERY md+ width (grid
 *   maths), so the diagonal has to stay inside that gap or the top of the
 *   copy lands on the dark side.
 * · The chevron is placed by its VERTEX: `left: 44.5%` plus
 *   `translate(-72%)` (the vertex sits at 72% of the 1000-unit box), with
 *   the box 130% of the section's height. The arms therefore bleed off the
 *   top and bottom edges like the reference at every width, instead of
 *   the whole chevron shrinking to fit — a shrunken chevron is a smudge.
 *   No JS measurement: the percentages are the section's, the translate is
 *   the box's own.
 * · The chevron itself is the shared ChevronBand (sections/ChevronBand.tsx,
 *   extracted 2026-09-04 when the gallery became its second consumer);
 *   geometry and gradient reasoning live there. This file owns placement.
 * · One polyline for the chevron body, not two arms: a miter join gives
 *   the sharp vertex for free, and the userSpaceOnUse gradient runs along
 *   the light direction, so the two arms still read as lit differently.
 *
 * RESPONSIVE: the reference is a desktop composition. Below md the split,
 * chevron and contour field are hidden (`hidden md:block`) and the band is
 * simply bg-default-background with the columns stacked (copy at 15.34).
 *
 * PERFORMANCE (measured before this was written, root §11.9 caveats):
 * the only real cost is generating the contour tile the first time it
 * rasterises. Headless software raster, cold, medians of 4: bare ground +
 * panel 131 ms, 560px tile 530–580 ms, 400px tile 373 ms, 320px 243 ms.
 * Cost scales with tile AREA, not numOctaves, which is why the tile is
 * 400px here and why the next lever is 320px, not fewer octaves. It is
 * compositor raster, off the main thread, once, below the fold.
 *
 * No hooks, no "use client", no @subframe/core: the band must not hydrate.
 * view_section is Mechanism A (data-track-view). The emitted section key
 * stays `service-guarantee` for series continuity (client CLAUDE.md §3).
 *
 * PHOTO: still the TEMPORARY placeholder (edstree-hero-2.jpg, the orphaned
 * hero slide 2). Lazy — below the fold (root §9.13).
 */

const PHOTO_PLACEHOLDER = "/images/edstree-hero-2.jpg";

/** Derived, never typed — a hardcoded year rots silently. */
const YEARS_IN_BUSINESS = new Date().getFullYear() - CLIENT.business.yearFounded;

/**
 * Founding story — the owner's raw material from the intake (row 91,
 * "Founding story / about raw material"), VERBATIM apart from splitting it
 * into paragraphs and setting the dashes typographically. The row's own
 * claims check: bonded and insured, since 2006, written estimate — all
 * cleared (handoff §3). The parenthetical claims note at the end of the row
 * is bookkeeping, not copy, and is omitted. Owner sign-off is still pending
 * on everything visitor-facing (client CLAUDE.md §8.2).
 */
const FOUNDING_STORY: readonly string[] = [
  "Ed's Tree Service is led by owner Eduardo Jimenez, who has been taking down trees around homes and businesses across eastern North Carolina since 2006.",
  "Based in Faison and serving Duplin, Sampson, and Wayne counties, the company handles removals, trimming, and storm cleanup — the work that keeps a limb out of a roof and decides how a place looks from the road.",
  "Eduardo's approach is straightforward: safety first, bonded and insured, and a written estimate before anything starts. Every job leaves a yard behind that carries the company name long after the trucks pull out, and it gets done that way.",
];

export interface AboutUsVariant2Props {
  id?: string;
  className?: string;

  /** Small label above the headline. */
  eyebrow?: React.ReactNode;
  /**
   * The very large headline. Default is the same cleared line
   * AboutUsVariant1 carried, with the years derived and the reference's
   * accent-phrase treatment in --color-brand-primary (5.07 on the panel).
   * Set uppercase by the wrapper; pass mixed case and it still renders
   * uppercase.
   */
  title?: React.ReactNode;
  /** Paragraphs under the headline. Default is the intake founding story. */
  story?: readonly string[];

  /** Left-column photo. Temporary placeholder by default. */
  photo?: string;
  /** Empty while the photo is a placeholder; describe the real one. */
  photoAlt?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

const DEFAULT_TITLE = (
  <>
    {YEARS_IN_BUSINESS} Years of{" "}
    <span className="text-brand-primary">Trusted Tree Service</span> in {CLIENT.seo.regionLabel}
  </>
);

export default function AboutUsVariant2({
  id,
  className,
  eyebrow = "About Us",
  title = DEFAULT_TITLE,
  story = FOUNDING_STORY,
  photo = PHOTO_PLACEHOLDER,
  photoAlt = "",
  trackingSection = "service-guarantee",
  trackingCity,
  trackingService,
  trackingPageType,
}: AboutUsVariant2Props) {
  return (
    <section
      id={id}
      className={[
        /* 1 — the ground. Light below md (no decoration there), the
           near-black green from md. `isolate` per the file header. */
        "relative isolate w-full overflow-hidden",
        "bg-default-background md:bg-[var(--color-default-font)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* 2 — contour field. The div's background-color IS the line colour
          (neutral: the background token, 15.34 on the ground; brand-primary
          at ~0.45 is the greener alternative, 3.03). Opacity is the tuning
          dial and lives here, not in the SVG. -webkit- pair for older
          Safari. */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 hidden md:block",
          "bg-default-background opacity-[0.28]",
          "[mask-image:var(--site-tex-topo)] [-webkit-mask-image:var(--site-tex-topo)]",
          "[mask-size:400px] [-webkit-mask-size:400px]",
          "[mask-repeat:repeat] [-webkit-mask-repeat:repeat]",
        ].join(" ")}
      />

      {/* 3 — rake light, OVER the contours (reversed, the effect flattens).
          Hot spot at the chevron's inner vertex. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[image:var(--site-ground-rake-dark)] md:block"
      />

      {/* 4 — chevron. The shared ChevronBand (sections/ChevronBand.tsx)
          since 2026-09-04 — geometry, bevels and gradients live there; this
          wrapper owns only the placement. Vertex at 72% of the box, so
          left-[44.5%] + -translate-x-[72%] lands it on the panel's bottom
          edge. */}
      <ChevronBand
        idPrefix="about2-chevron"
        className="left-[44.5%] top-1/2 hidden aspect-square h-[130%] w-auto -translate-x-[72%] -translate-y-1/2 md:block"
      />

      {/* 5 — light panel. Shallow diagonal: 48% at the top, 44.5% at the
          bottom (see the file header for why not steeper). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-default-background [clip-path:polygon(48%_0,100%_0,100%_100%,44.5%_100%)] md:block"
      />

      {/* 6 — content */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-12 md:px-10 md:py-24 lg:gap-16">
        {/* ── LEFT — photo, over the dark field like the reference ── */}
        <figure className="w-full">
          <img
            src={photo}
            alt={photoAlt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover"
          />
        </figure>

        {/* ── RIGHT — copy, entirely on the light panel ── */}
        <div className="w-full">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-primary">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="mt-4 font-heading-2 text-4xl font-bold uppercase leading-[1.05] tracking-[0.01em] text-default-font md:text-5xl lg:text-[56px]">
            {title}
          </h2>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-default-font md:text-lg">
            {story.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
