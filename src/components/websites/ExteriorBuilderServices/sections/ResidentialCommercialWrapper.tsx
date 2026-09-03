import React from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — Residential & commercial capability section. About page.
 *
 * Built 2026-08-31 to a reference Ryan supplied (Shingle Hut's
 * residential/commercial pair): two cards side by side, each a coloured
 * header bar over prose and a grid of capability pills, with one shared CTA
 * beneath.
 *
 * Fully wrapper-authored, no Subframe parent. No hooks, no @subframe/core,
 * no "use client" — nothing here runs on the client, so view_section is
 * Mechanism A (root §8.2) and the CTA rides the vanilla click bridge. No
 * <img> either, so it adds nothing to React 19's preload set (root §9.13).
 *
 * WHY BOTH COLUMNS CARRY THE SAME LIST. Ryan's brief: "all the information
 * is the same because we also have all the same capabilities." That is the
 * substance of the section rather than an oversight, so the caption says so
 * out loud. Two identical lists with no explanation read as a copy-paste
 * bug; the caption turns the repetition into the point. If the two sides
 * ever diverge, give each card its own array AND rewrite that caption —
 * they are coupled.
 *
 * ⚠️ CLAIMS — four things in the reference were deliberately NOT carried
 * over. The CLAIMS REGISTER (EBS_HANDOFF_Step0-Step1.md §3) is
 * authoritative and lists all four as MUST NOT SHIP:
 *
 *   1. "24/7 Emergency" (a pill) and "24/7 responsiveness" (prose). EBS has
 *      NO emergency line — CLIENT.contact.emergencyPhoneDisplay is empty by
 *      design. Ten of eleven 24-7 strings were removed from this site on
 *      2026-08-27; re-adding one here would reverse that work.
 *   2. "emergency leak detection" in the commercial prose. Same reason.
 *   3. The Owens Corning badge. Manufacturer and trade-association badges
 *      are banned outright — the same class as the CertainTeed
 *      ShingleMaster tier, which is real but UNVERIFIED for this client.
 *   4. "Texas and Illinois" / "the Texas and Midwest climate". Replaced
 *      with CLIENT.geo.serviceArea so it cannot drift from config.
 *
 * Also NOT carried over, for a different reason — no evidence rather than a
 * ban: "Insurance Claims Support", "Roof Cleaning & Maintenance", "Storm
 * Damage Repair & Tarping", and the commercial membrane list (TPO, PVC,
 * EPDM, roof coatings, seamless drainage). None appear in the intake, in
 * client.config.ts, or as a service route. They are capabilities EBS may
 * well have — but nobody has confirmed it, and a capability list is a claim
 * per line. Add them once confirmed.
 *
 * CAPABILITIES are therefore EBS's seven real services — the same seven
 * with route files under src/pages/services/ and records in
 * servicePageData.tsx — plus the free-estimate offer, a cleared claim and
 * CLIENT.offers.items[0].
 *
 * ⚠️ Deliberately NOT imported from servicePageData, for the reason
 * ServicesGridSectionWrapper gives: no file in sections/ imports from
 * pages/, and starting now couples a section to the routing layer. If a
 * service is added it goes in both places. Nothing in the build catches a
 * mismatch here, because these pills are static text rather than links.
 */

/* ── Icons ──────────────────────────────────────────────────────────────
   Inline SVG, matching the services grid: zero network requests, invisible
   to React 19's preload pass, and inheriting currentColor so a fork
   re-skins them by token. One 24x24 grid at 1.6 stroke throughout.
   ------------------------------------------------------------------- */

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Pitched roof over a single dwelling. */
function IconHouse({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 11.2 12 4l9 7.2" />
      <path d="M5.4 12.9V20h13.2v-7.1" />
      <path d="M10.1 20v-4.4h3.8V20" />
    </svg>
  );
}

/** Flat-topped block with glazing — a commercial elevation. */
function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3.5 20V6.4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V20" />
      <path d="M13.5 20V10.6h6a1 1 0 0 1 1 1V20" />
      <path d="M2.4 20h19.2" />
      <path d="M6.6 9.1h3.8M6.6 13h3.8M16.4 14.2h1.6" />
    </svg>
  );
}

/** Filled disc with a check, matching the reference's pill markers. */
function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.03 7.83-6.2 6.2a1 1 0 0 1-1.42 0l-2.9-2.9a1 1 0 1 1 1.42-1.42l2.19 2.2 5.49-5.5a1 1 0 0 1 1.42 1.42Z" />
    </svg>
  );
}

interface Capability {
  label: string;
  /**
   * Drawn as a filled chip rather than an outlined one. The reference
   * emphasises exactly one pill per card, and a second would cancel the
   * emphasis — the same argument the trust-badge marquee makes about its
   * single foiled badge. It sits on the free-estimate pill because that is
   * the only entry that is an OFFER rather than a trade, and it is what the
   * CTA below asks for.
   */
  highlight?: boolean;
}

/**
 * The seven services EBS actually sells, plus the offer. Shared by BOTH
 * cards — see the header note. Order matches the services grid: roofing,
 * then siding, then gutters.
 */
const CAPABILITIES: readonly Capability[] = [
  { label: "Roof Replacement" },
  { label: "Roof Repair" },
  { label: "Roof Installation" },
  { label: "Metal Roof Installation" },
  { label: "Siding Installation" },
  { label: "Gutter Installation" },
  { label: "Gutter Cleaning" },
  { label: "Free Inspection & Written Estimate", highlight: true },
];

interface CapabilityCardProps {
  /**
   * Header-bar surface. Both options clear AA's 4.5:1 against white at
   * normal text weight, which is why neither is plain `brand-primary`:
   * white on #1685CC measures 3.99:1 and this bar's label is not large text
   * under WCAG, so it would fail. `brand-primary-hover` (#1376B4) is the
   * same blue one step deeper and measures 4.91:1; navy measures 14.84:1.
   */
  tone: "blue" | "navy";
  title: string;
  icon: React.ReactNode;
  paragraphs: readonly string[];
}

function CapabilityCard({ tone, title, icon, paragraphs }: CapabilityCardProps) {
  return (
    <div
      className={[
        "flex flex-col overflow-hidden rounded-lg bg-white",
        "border border-[rgba(23,41,58,0.08)]",
        // Navy-tinted rather than neutral black: a black shadow greys out
        // against this cool ground. Same two-stop shadow the services grid
        // uses, so cards across the site read as the same object.
        "shadow-[0_2px_4px_rgba(23,41,58,0.04),0_12px_28px_rgba(23,41,58,0.07)]",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-3 px-5 py-4",
          tone === "blue"
            ? "bg-brand-primary-hover"
            : "bg-[var(--color-default-font)]",
        ].join(" ")}
      >
        <span className="flex h-8 w-8 flex-none items-center justify-center text-white">
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            { className: "h-7 w-7" }
          )}
        </span>
        <h3 className="text-base font-bold uppercase tracking-[0.06em] text-white md:text-lg">
          {title}
        </h3>
      </div>

      {/* flex-1 on the prose block pushes both cards' pill grids onto the
          same line even though the paragraphs differ in length. Without it
          the two grids start at different heights and the cards stop
          reading as a pair. */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-6 md:px-6">
        <div className="flex flex-1 flex-col gap-4">
          {paragraphs.map((text) => (
            <p
              key={text}
              className="text-sm leading-relaxed text-neutral-600 md:text-base"
            >
              {text}
            </p>
          ))}
        </div>

        <ul className="mt-2 flex flex-wrap gap-2">
          {CAPABILITIES.map((cap) => (
            <li
              key={cap.label}
              className={[
                "inline-flex items-center gap-2 rounded-md px-3 py-2",
                "text-xs font-medium md:text-sm",
                cap.highlight
                  ? "bg-[var(--color-default-font)] text-white"
                  : "border border-neutral-200 bg-white text-default-font",
              ].join(" ")}
            >
              <IconCheck
                className={[
                  "h-4 w-4 flex-none",
                  cap.highlight ? "text-brand-secondary" : "text-brand-primary",
                ].join(" ")}
              />
              {cap.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export interface ResidentialCommercialWrapperProps {
  id?: string;
  className?: string;

  eyebrow?: string;
  title?: React.ReactNode;
  caption?: React.ReactNode;

  ctaHref?: string;
  ctaLabel?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ResidentialCommercialWrapper({
  id,
  className,
  eyebrow = "WHO WE SERVE",
  title = "Homes and businesses, same crews",
  /*
    The caption is load-bearing, not decoration — see the header note. It is
    what stops two identical capability lists reading as a duplication bug.
  */
  caption = `${CLIENT.business.nameShort} runs residential and commercial work out of one shop, with the same crews and the same trades on both sides. What changes is the building — not the standard, the materials, or who turns up.`,
  ctaHref = "/contact",
  ctaLabel = "Get a Free Estimate",
  trackingSection = "residential-commercial",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "about",
}: ResidentialCommercialWrapperProps) {
  /*
    Spread rather than retyped per element: a partial set still fires
    through the click bridge but cannot be joined in analytics.
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
        "w-full overflow-hidden",
        // Ground one step below --color-default-background, so this band
        // reads as its own surface.
        //
        // SEAM: info-image-column above is bg-white and the FAQ below is
        // transparent over the body's off-white, so a white section here
        // would run continuously into both — which is the empty-looking gap
        // this section was added to fill. The gold top rule makes the upper
        // edge explicit rather than relying on a luminance step alone: a
        // drawn line survives a reorder, where a luminance difference has to
        // be re-derived every time a section moves.
        "bg-[var(--color-ground-concrete)]",
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
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        {/* Same eyebrow → title → caption rhythm as the hero, services grid,
            stats band and reviews, so the sections read as one system. */}
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-[20ch] font-heading-1 text-3xl font-bold leading-[1.12] text-default-font md:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-neutral-600 md:text-lg">
          {caption}
        </p>

        {/* items-stretch (the grid default) is what lets each card's flex-1
            prose block equalise the two pill grids. */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <CapabilityCard
            tone="blue"
            title="Residential Roofing & Siding"
            icon={<IconHouse />}
            paragraphs={[
              "Our residential work protects the house and the way it looks from the road — roofing, siding and gutters fitted as complete systems rather than patched piece by piece.",
              `Homeowners across ${CLIENT.geo.serviceArea} get a written estimate before anything starts, a crew that cleans up behind itself, and an installation done to code. Family-run and locally owned since ${CLIENT.business.yearFounded}.`,
            ]}
          />

          <CapabilityCard
            tone="navy"
            title="Commercial Roofing & Siding"
            icon={<IconBuilding />}
            paragraphs={[
              "We take on commercial and light-industrial buildings with the same trades and the same crews, sized to the property instead of the house.",
              "Property managers and owners get the same written estimate up front and the same clean site at the end. Work is scheduled around your operation, so the building keeps running while we are on it.",
            ]}
          />
        </div>

        {/*
          Navy rather than brand-primary. This label is 16px semibold, which
          is NOT large text under WCAG, so white on #1685CC (3.99:1) would
          fail AA; on navy it is 14.84:1. Matches the services grid's closing
          CTA tile, for the same reason.
        */}
        <div className="mt-12 flex justify-center">
          <a
            href={ctaHref}
            className={[
              "inline-flex items-center gap-2 rounded-md px-8 py-4",
              "bg-[var(--color-default-font)] text-base font-semibold text-white",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-ground-concrete)",
            ].join(" ")}
            data-event="click_cta"
            data-label="residential-commercial-cta-free-estimate"
            {...tracking}
          >
            {ctaLabel}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
