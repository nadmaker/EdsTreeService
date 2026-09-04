import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";
import {
  IconTreeRemoval,
  IconTreeTrimming,
  IconStumpGrinding,
  IconStormCleanUp,
} from "./serviceIcons";

/**
 * EBS — Services grid.
 *
 * Fully wrapper-authored: the `ServicesGrid` Subframe parent was dropped,
 * along with the eleven-class `[&>div:nth-child(2)]:` cluster that existed
 * only to force its inner box into a 4-up grid (root §7.8's escalation
 * signal — and per root §7.8 these were CONFLICT overrides, not
 * duplication, since the parent's own layout was being replaced wholesale).
 * Dropping it also removes the `mobile:` breakpoint variant, which stacks
 * at Subframe's breakpoint while the rest of this site switches at 768px.
 *
 * FIVE THINGS THIS FIXES, beyond the layout:
 *
 * 1. The cards listed TREE SERVICES — Tree Removal, Stump Grinding, Lot
 *    Clearance and five more — carried over wholesale from the fork. None
 *    of them are things EBS does. This was the largest remaining block of
 *    previous-client content on the home page.
 *
 * 2. Every card linked to `#home-contact`. All eight went to the same
 *    anchor, so `select_service` fired with a different label but the
 *    visitor always landed in the same place, and the choice they had just
 *    expressed was thrown away. Cards now link to their real service page.
 *
 * 3. This section contributed no links to /services/*, despite being the
 *    page's services section. The navbar dropdown does link all seven on
 *    every route, so the pages were never orphaned — but the two surfaces
 *    a visitor is most likely to use to pick a service (this grid, and the
 *    footer's four service labels, which also point at "#services") both
 *    dead-ended on the home page. This grid is now a real entry point.
 *
 * 4. Slugs are DECLARED, not derived. The old version ran `slugify(title)`
 *    over the display name to build its tracking label — the exact pattern
 *    root §8.5 warns about, where a display name containing punctuation
 *    silently produces a slug that no longer matches
 *    `servicePageData[*].slug` ("Tree Trimming / Pruning" → the old code's
 *    literal case). Declaring the slug once and using it for BOTH the href
 *    and the label means the two cannot disagree, and removes one of the
 *    three slugify instances tracked in client §8.8.
 *
 * 5. It no longer hydrates. The old wrapper carried a scroll-listener
 *    parallax effect and a React view observer. Both are gone: the cards
 *    are plain <a> elements that the click bridge catches off
 *    server-rendered DOM (root §8.1), and view_section is opt-in via
 *    `data-track-view` (root §8.2 Mechanism A). No hooks, no
 *    `@subframe/core` import, no "use client" — nothing here runs on the
 *    client.
 *
 * NO PHOTOGRAPH, and that constraint still stands. The old background was
 * `ebs-services-bg.jpg` — 590 KB, and from the same import batch as the
 * `ebs-gallery-*` files, which handoff §6 records as still being the
 * previous client's tree photography under EBS filenames. Shipping it
 * risked putting a rival's photo behind EBS's own service list.
 *
 * SURFACE — FLAT GREEN, no texture (2026-09-04, by request).
 *
 * This band is `--color-ground-concrete` (#E7F5E9) and nothing else. The
 * ground COLOUR is unchanged; what was removed is the five-layer stack
 * that used to sit on top of it.
 *
 * HISTORY, because this surface has now been through three states and the
 * middle one left tokens behind that are still referenced elsewhere:
 *
 * Until 2026-08-31 it was flat `bg-white` — which met the seam
 * requirement below but gave the section no surface at all: white cards on
 * a white ground, nothing lifting.
 *
 * From 2026-08-31 it carried a procedural troweled-plaster ground — cloud,
 * vein and grain turbulence layers under set-out lines and a daylight
 * rake, five absolutely-positioned divs reading feTurbulence data URIs out
 * of global.css. It cost no network requests and no JavaScript; it was
 * removed because the flat colour was wanted, not because it was
 * expensive.
 *
 * ⚠️ NOTHING WAS DELETED OUTSIDE THIS FILE, deliberately. The five
 * --site-tex-* / --site-course-lines / --site-ground-rake tokens in
 * global.css and the ConcreteGround component still have live consumers on
 * /about and elsewhere — this section was simply the last one that also
 * held an INLINE copy of the stack. Do not tidy those tokens away on the
 * strength of this section no longer using them; grep for consumers first.
 * Re-adding texture here is `<ConcreteGround />` plus restoring
 * `relative isolate overflow-hidden` on the root and `relative` on the
 * content div — see that file's usage note. Do not paste the inline stack
 * back; the shared component is the current home of the technique.
 *
 * The 3px gold top rule is KEPT. It is not texture — it is the drawn seam
 * described below, and it is doing more work now that the ground either
 * side of it differs by less.
 *
 * SEAM — why this band has to differ from its neighbours at all.
 * This section was moved beneath the hero on 2026-08-27 (it and the
 * service-area section exchanged places), a trust-badge marquee was
 * inserted above it on 2026-08-28, and service-area moved back above it
 * on 2026-08-30. Through all of that, the sections either side have been
 * bg-default-background, so this band is the only thing preventing a
 * continuous off-white run.
 *
 * The gold rule now makes that seam EXPLICIT rather than implied, which is
 * the point: a luminance difference has to be re-derived every time this
 * section moves — and it has moved three times — whereas a drawn line
 * survives a reorder. The ground colour is still positional and still
 * worth re-checking, but it is no longer the only thing holding the edge.
 */

/** Where a card sends the visitor. Route files live at src/pages/services/. */
const SERVICE_BASE_PATH = "/services";

/* ── Icons ─────────────────────────────────────────────────────
   The seven glyphs moved to `./serviceIcons` on 2026-08-31, when the city
   landings' contact form needed the same set. They were authored here and
   the rationale for drawing rather than importing them lives in that file.
   ------------------------------------------------------------------- */

interface ServiceCard {
  /** MUST match servicePageData[*].slug and the route file name. */
  slug: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
}

/**
 * The seven services EBS actually sells, in the order the money runs:
 * roofing work first, then siding, then gutters.
 *
 * `slug`, `title` and `blurb` are kept in step with
 * `pages/servicePageData.tsx` — blurbs are that file's `headingSubtitle`
 * verbatim, so a card and the page it opens say the same thing.
 *
 * ⚠️ Deliberately NOT imported from servicePageData. No file in sections/
 * imports from pages/, and starting now would couple a section to the
 * routing layer for a list that changes about once a year (root §13.3.7
 * makes the same argument for the glob-derived slug arrays). If a service
 * is added, add it in both places — `npm run build` will not catch a
 * mismatch, but a card linking to a route that does not exist will 404,
 * so check the link.
 *
 * ⚠️ CLAIMS: "most handled same-day" on Roof Repair is cleared — the
 * register permits same-day language attached to REPAIR and response, but
 * not to replacement. Do not move that phrase onto another card.
 */
const SERVICES: readonly ServiceCard[] = [
  {
    slug: "tree-removal",
    title: "Tree Removal",
    blurb: "Dead, leaning, storm-damaged or in the way — taken down safely, same-day when we can.",
    icon: <IconTreeRemoval />,
  },
  {
    slug: "tree-trimming",
    title: "Tree Trimming",
    blurb: "Limbs off the roof and the lines, and the tree kept in shape.",
    icon: <IconTreeTrimming />,
  },
  {
    slug: "stump-grinding",
    title: "Stump Grinding",
    blurb: "Ground below grade so you can plant, mow, or build over it.",
    icon: <IconStumpGrinding />,
  },
  {
    slug: "storm-clean-up",
    title: "Storm Clean Up",
    blurb: "Fallen trees and broken limbs cleared and hauled.",
    icon: <IconStormCleanUp />,
  },
];

export interface ServicesGridSectionWrapperProps {
  id?: string;
  className?: string;

  /** Destination of the closing CTA tile, not of the service cards. */
  ctaHref?: string;

  eyebrow?: string;
  title?: React.ReactNode;
  caption?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ServicesGridSectionWrapper({
  /*
    `id` defaults on THIS root, not on a <section> wrapper in the builder —
    EBS-Home relies on that (a wrapper there would emit #services twice,
    root §6.6.1 direction 1). It is also load-bearing in the other
    direction: FooterSection links four service labels at "#services" on
    every page, so this id cannot be dropped. Root §6.6.1 direction 2.
  */
  id = "services",
  className,
  ctaHref = "#home-contact",
  /*
    "·" is U+00B7 MIDDLE DOT, not a period and not a bullet (U+2022). The
    middle dot is the separator glyph — it sits on the type's optical centre
    line, where a period sits on the baseline and would read as the sentence
    "WHAT WE DO. SERVICES". A bullet is heavier and reads as list marking.

    The spaces around it are ordinary spaces, so the pair can break to a new
    line on a narrow viewport rather than forcing the eyebrow to overflow.

    ⚠️ Whatever this string becomes, it must stay TEXT. The eyebrow is styled
    with tracking-[0.22em], which adds letter-spacing AFTER the final glyph
    too — that is why the separator is padded with real spaces rather than
    relying on the tracking to do the spacing for it.
  */
  eyebrow = "WHAT WE DO · SERVICES",
  title = "Tree removal, trimming, and storm clean-up",
  caption = `From a single limb to a whole lot, handled by ${CLIENT.business.nameShortPossessive} own crew. Pick the work you need and we will walk you through it.`,
  trackingSection = "services",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "home",
}: ServicesGridSectionWrapperProps) {
  /*
    Shared context, spread rather than retyped per element — a partial set
    still fires through the click bridge but cannot be joined in analytics.
    Root §8.6, §13.3.5. HeroWrapper is the reference.
  */
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  return (
    <section
      id={id}
      className={[
        // FLAT GROUND, no layers over it (2026-09-04, by request). The
        // `relative isolate overflow-hidden` trio that stood here existed
        // ONLY for the texture stack — `isolate` to stop the multiply
        // layers blending onto the neighbour's surface, `overflow-hidden`
        // to clip the tiles, `relative` to give the content something to
        // sit above. With no absolutely-positioned children left in this
        // section, all three were dead weight and were removed with the
        // layers. Restore all three together if any texture comes back.
        "w-full",
        // The ground colour is UNCHANGED — #E7F5E9, one step below
        // --color-default-background. Removing the texture removed what
        // sat ON this green, not the green.
        "bg-[var(--color-ground-concrete)]",
        // The seam, drawn rather than implied. See the SURFACE note above.
        "border-t-[3px] border-t-brand-secondary",
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
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 md:px-10 md:py-28">
        {/* Header — same eyebrow → title → caption rhythm as the hero and
            the stats band, so the three read as one system. */}
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
          {eyebrow}
        </p>

        <h2 className="mt-4 max-w-[20ch] font-heading-1 text-3xl font-bold leading-[1.12] text-default-font md:text-5xl">
          {title}
        </h2>

        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-neutral-600 md:text-lg">
          {caption}
        </p>

        {/* 5 tiles — 4 services plus the CTA. EBS had 8 (7 services + CTA),
            which divided evenly 4-up at lg and 2-up at sm; 5 does not divide
            evenly at any column count, so the CTA tile SPANS instead. 3-up at
            lg gives row 1 = three services and row 2 = the fourth service
            plus a 2-wide CTA; 2-up at sm gives a 2×2 service block with a
            2-wide CTA beneath. Both rows fill completely at every breakpoint.
            ⚠️ The span classes live on the CTA anchor below, and they only
            work because this grid takes its children DIRECTLY (root §6.5) —
            wrapping the tiles in per-child divs would silently break it. */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <a
              key={service.slug}
              href={`${SERVICE_BASE_PATH}/${service.slug}`}
              className={[
                "group flex flex-col rounded-lg bg-white p-6",
                // Hairline is softer than neutral-200 now that the card is
                // no longer white-on-white: the shadow does the separating,
                // so the border only has to define the edge.
                "border border-[rgba(23,41,58,0.08)]",
                // Two-stop shadow, tinted navy rather than black — a neutral
                // black shadow greys out against a cool ground. This is what
                // makes the card read as a panel resting ON the concrete
                // instead of a rectangle drawn on it.
                "shadow-[0_2px_4px_rgba(23,41,58,0.04),0_12px_28px_rgba(23,41,58,0.07)]",
                "transition-all duration-200",
                "hover:-translate-y-1 hover:border-brand-primary",
                "hover:shadow-[0_4px_8px_rgba(23,41,58,0.06),0_20px_44px_rgba(23,41,58,0.14)]",
                // Keyboard users get the same affordance as the mouse. The
                // ring offset has to be the ground, not Tailwind's default
                // white, or focus draws a white halo on the concrete.
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-ground-concrete)",
              ].join(" ")}
              data-event="select_service"
              data-label={`services-card-${service.slug}`}
              {...tracking}
            >
              <span
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-md",
                  "bg-brand-primary/10 text-brand-primary",
                  "transition-colors duration-200",
                  "group-hover:bg-brand-primary group-hover:text-white",
                ].join(" ")}
              >
                {/* Sized here rather than in each icon so all seven stay
                    in step from one place. */}
                {React.cloneElement(
                  service.icon as React.ReactElement<{ className?: string }>,
                  { className: "h-6 w-6" }
                )}
              </span>

              <h3 className="mt-5 text-lg font-semibold text-default-font">
                {service.title}
              </h3>

              {/* flex-1 pushes the arrow to the bottom edge, so the arrows
                  line up across a row even though the blurbs differ in
                  length. */}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                {service.blurb}
              </p>

              <span
                aria-hidden="true"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary"
              >
                Learn more
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}

          {/*
            Closing CTA tile. Navy rather than brand-primary: white on EBS
            blue measures 3.99:1 and this tile's label is 18px semibold,
            which is NOT large text under WCAG, so it would fail AA. On the
            navy surface token it is 14.84:1. It also rhymes with the stats
            band further down the page.

            Fires click_cta, not select_service — no service is being
            chosen here, and mixing the two would corrupt any funnel keyed
            on select_service.
          */}
          <a
            href={ctaHref}
            className={[
              "group flex flex-col rounded-lg bg-[var(--color-default-font)] p-6",
              // Fills the row the four service cards leave ragged — see the
              // grid comment above. Spans the full 2 at sm and 2 of 3 at lg.
              "sm:col-span-2 lg:col-span-2",
              "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2",
            ].join(" ")}
            data-event="click_cta"
            data-label="services-cta-free-estimate"
            {...tracking}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 4.5h8a2 2 0 0 1 2 2v13l-6-3-6 3v-13a2 2 0 0 1 2-2Z" />
                <path d="M9.5 9.5h5M9.5 13h3" />
              </svg>
            </span>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Not sure which you need?
            </h3>

            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/80">
              We will come out, look at it, and give you a written estimate.
              No charge and no obligation.
            </p>

            <span
              aria-hidden="true"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary"
            >
              Get a free estimate
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

