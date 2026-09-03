import React from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — city-landing copy + service list.
 *
 * REBUILT 2026-08-31: the `Info_Sec1_330` Subframe parent is gone and this
 * section is now fully wrapper-authored and LEFT-ALIGNED.
 *
 * ⚠️ THE NAME IS NOW WRONG AND IS KEPT ON PURPOSE. "CenteredCopyArea"
 * described the old layout, which is exactly what was replaced — nothing is
 * centred any more. The FILE and the emitted `data-section="centered-copy"`
 * both keep the old word because the section name is a tracking key, and the
 * file is named after it. Renaming is free today (no GTM container, client
 * §3.2) but would be a third name to keep in step, so it is left as a known
 * mismatch — trust `data-section`, not the filename, the same way
 * ServiceGuaranteeAndFeaturesWrapper emits `map-and-benefits`.
 *
 * WHAT DROPPING THE SUBFRAME PARENT FIXED, beyond the alignment:
 *
 * 1. `Info_Sec1_330` hardcoded `items-center` and `text-center` at every
 *    level, so left alignment was not reachable from a wrapper at all — the
 *    old file's `!items-center` override was pushing the same way the
 *    component already went.
 * 2. It hardcoded `font-['Inter']` and pixel type — 36/28/32px with literal
 *    line-heights — bypassing the type tokens entirely, so this section did
 *    not re-skin with the rest of the site (root §4).
 * 3. It painted its own `bg-default-background`, which is what produced the
 *    tinted panel inset in a white section. That panel was ALSO the only
 *    thing separating this section from `map-and-benefits` below it, which
 *    is white — see the seam note on the section element.
 * 4. It used `text-brand-600`, a slot EBS's theme block never defines.
 *
 * No hooks, no `@subframe/core`, no "use client": this ships zero client JS
 * of its own. view_section moved from a React `useEffect` observer
 * (Mechanism B) to `data-track-view` (Mechanism A, root §8.2), which fires
 * off server-rendered DOM ahead of hydration. ⚠️ Do NOT add an observer back
 * alongside that attribute — the two together double-fire.
 *
 * ⚠️ CLAIMS: the five service entries reuse `servicePageData[*]
 * .captionDescription` verbatim so a city landing and the service page it
 * describes say the same thing, and the copy inherits a review that has
 * already happened. "most of them handled the same day" is cleared ONLY
 * because it is attached to REPAIR — do not move it onto another entry.
 */

export interface CenteredCopyAreaWrapperProps {
  id?: string;
  className?: string;

  mainTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  introDescription?: React.ReactNode;

  ctaLabel?: React.ReactNode;
  ctaHref?: string;
  ctaFollowupText?: React.ReactNode;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;

}

export default function CenteredCopyAreaWrapper({
  id,
  className,

  mainTitle = `Expert ${CLIENT.vocabulary.tradeName} in ${CLIENT.geo.hqCity}, ${CLIENT.geo.hqState}`,
  subtitle = `Residential & Commercial ${CLIENT.vocabulary.tradeName}`,
  /* ⚠️ Was the previous client's ("At Medrano's, we take pride in…").
     Unreachable — CityLandingPageBLDR always passes the per-city
     centeredCopyIntroDescription — but a trap for any new consumer that
     omits it (root §13.3.8). */
  introDescription = `${CLIENT.business.name} handles roofing and siding for homes and businesses across ${CLIENT.geo.serviceArea}, with a written estimate before anything starts.`,

  ctaLabel = "Schedule Service",
  ctaHref = "#landing-contact",
  ctaFollowupText = "quick response, free estimate",

  trackingSection = "centered-copy",
  trackingCity,
  trackingService,
  trackingPageType,

}: CenteredCopyAreaWrapperProps) {
  /* Shared context, spread rather than retyped per element — a partial set
     still fires through the click bridge but cannot be joined in analytics
     (root §8.6, §13.3.5). HeroWrapper is the reference. */
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  return (
    <section
      id={id}
      /* SEAM — carried by the NEIGHBOUR, so nothing is drawn here.
         Measured grounds on a city landing at 1440: why-choose-us above is
         #F5F8FB and this section is white, so the top edge reads on its own
         luminance step. The bottom edge is handled by map-and-benefits,
         which paints procedural shingle texture over its white root — the
         white-to-texture boundary is clearly visible without help.

         ⚠️ PROBE CAVEAT, worth keeping. A first pass added a `border-b`
         here because getComputedStyle reported map-and-benefits' root as
         rgb(255,255,255) — "white against white, no seam". That reading was
         incomplete: the texture is painted by layers INSIDE that section,
         not by the root's background-color, so a computed-style check on the
         root cannot see it. A screenshot showed the boundary immediately.
         Measure a ground by LOOKING as well as by computing whenever the
         neighbouring section is known to draw its own surface.

         If this section is ever moved beside a plain-white neighbour the
         seam does have to come back — it is only free because of what
         happens to sit below it today.
      */
      className={[
        "w-full bg-white",
        "px-6 py-16 md:px-10 md:py-24",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-track-view
      {...tracking}
    >
      {/* ⚠️ SPLIT 2026-09-01. The "Services We Offer" block that used
          to sit below the hairline here is now its own section,
          LandingServicesListWrapper (`landing-services`), rendered
          immediately after this one by CityLandingPageBLDR.

          ⚠️ THE 720px MEASURE IS NOW SHARED ACROSS TWO SECTIONS and
          both set their own containers. Everything in the combined
          section ended at x=800 at 1440 and that alignment was asked for
          explicitly — so the geometry below (max-w-[1280px] outer,
          max-w-[720px] inner, px-6 md:px-10) is duplicated verbatim in
          that file. Change one and you must change both. */}
      <div className="mx-auto w-full max-w-[1280px]">
        {/* ONE MEASURE for the whole section, and everything inside is
            `max-w-full` so nothing can outrun it. Previously the header was
            capped in `ch` while the services list spanned the full 1280px,
            so the section had two different right edges and the list ran
            well past where the caption stopped.

            720px rather than a `ch` value on purpose: `ch` scales with
            font-size, and the caption is `md:text-lg` (18px) where the
            service copy is `text-base` (16px) — the same `62ch` on both
            resolves to 704px and 620px, which is exactly the kind of
            near-miss that reads as a mistake. A pixel measure makes the
            edge exact.

            720 also matches the why-choose-us block directly above, so the
            two adjacent sections share one left column width. */}
        <div className="w-full max-w-[720px]">
        {/* Header — the same eyebrow → title → caption rhythm the hero, the
            services grid and the stats band use, so the sections read as one
            system. LEFT-ALIGNED throughout: no `items-center`, no
            `text-center`, and the measures are capped in `ch` so the lines
            stay readable rather than running the full 1280px. */}
        {subtitle ? (
          /* brand-secondary-TEXT, not brand-secondary. The plain gold
             measures 2.15:1 on white and fails WCAG at any size; the -text
             variant is the darkened pair at 4.73:1, which clears AA for
             normal text. OurProcessStepsWrapper's two-tone headline is the
             other consumer. Written in the canonical
             `text-(--slot)` shorthand to match AboutUsVariant1, which is
             how this slot is already consumed. */
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-(--color-brand-secondary-text) md:text-base">
            {subtitle}
          </p>
        ) : null}

        {mainTitle ? (
          <h2 className="mt-4 max-w-[20ch] font-heading-1 text-3xl font-bold leading-[1.12] text-default-font md:text-5xl">
            {mainTitle}
          </h2>
        ) : null}

        {introDescription ? (
          <p className="mt-6 text-base leading-relaxed text-neutral-600 md:text-lg">
            {introDescription}
          </p>
        ) : null}

        {ctaLabel && ctaHref ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={ctaHref}
              className={[
                "inline-flex items-center justify-center rounded-full",
                "bg-brand-primary px-7 py-3",
                "text-base font-semibold text-white",
                "border border-transparent transition-colors",
                "hover:border-brand-primary hover:bg-white hover:text-brand-primary",
              ].join(" ")}
              data-event="click_cta"
              data-label="centered-copy-cta"
              {...tracking}
            >
              {ctaLabel}
            </a>

            {ctaFollowupText ? (
              <span className="text-base text-neutral-600">
                {ctaFollowupText}
              </span>
            ) : null}
          </div>
        ) : null}

        </div>
      </div>
    </section>
  );
}
