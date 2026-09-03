import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * EBS — "How it works" process section. Contact page only.
 *
 * REBUILT 2026-08-31 to a reference Ryan supplied: light ground with a faint
 * diagonal pattern, a two-tone display headline on the left against intro
 * prose on the right, a row of five numbered step cards each wearing an
 * overlapping icon tile, then a supporting line and a centred CTA.
 *
 * The `OurProcessColumn6Step` Subframe parent was DROPPED, along with the
 * five arbitrary-variant overrides that existed only to force its centred
 * header-over-row layout into shape and repaint it brand-primary. Nothing
 * of the old composition survives: the previous version was a solid blue
 * band with a centred "What's Next" title, which is the opposite of the
 * reference's light, left-weighted header.
 *
 * FOUR THINGS THIS FIXES BEYOND THE LAYOUT
 *
 * 1. THE CONTENT WAS ENTIRELY THE PREVIOUS CLIENT'S. Five steps describing
 *    tree work — "Tree Assessment", "Removal and Pruning" (dismantling a
 *    tree, chipping branches), "Yard Clean-Up and Disposal" — opening with
 *    "Contact Medrano's for a free tree health and removal assessment" and
 *    closing on "our healthy tree guarantee". Two named the previous client
 *    outright. This was the whole section, not a stray phrase.
 *
 * 2. FIVE HIGH-PRIORITY IMAGE PRELOADS REMOVED. The step icons were PNGs
 *    (step-1-assessment.png … step-5--followup.png, ~65 KB) rendered
 *    without loading="lazy", so React 19's SSR emitted a preload for each
 *    (root §9.13). /contact carried SEVEN image preloads; it now carries
 *    two. The icons are inline SVG instead: no network request, invisible
 *    to the preload pass, and they inherit currentColor so a fork re-skins
 *    them by token rather than by redrawing artwork.
 *    ⚠️ All five PNGs are now ORPHANED — nothing else references them.
 *
 * 3. IT NO LONGER HYDRATES. The old wrapper ran a React IntersectionObserver
 *    (Mechanism B). There are no hooks left, so view_section is now opt-in
 *    via data-track-view (Mechanism A, root §8.2) and the file drops both
 *    "use client" and @subframe/core. This section now ships zero client JS.
 *
 * 4. IT HAD NO CTA AND NO CLICK TRACKING AT ALL. The section described a
 *    five-step process and then offered no way to start it. There is now one
 *    CTA pointing at this page's own form.
 *
 * ⚠️ CLAIMS — two things in the reference were deliberately NOT carried over.
 * The CLAIMS REGISTER (EBS_HANDOFF_Step0-Step1.md §3) is authoritative:
 *
 *   · Step 4 of the reference is "INSURANCE CLAIM SUPPORT (IF APPLICABLE)",
 *     and its intro prose leads with "Whether filing an insurance claim
 *     after a storm". Insurance-claim handling is UNVERIFIED for EBS — it
 *     appears nowhere in the intake, in client.config.ts, or as a service
 *     route. Not banned, simply unevidenced. Step 4 is scheduling and
 *     materials instead; add the insurance step once confirmed.
 *   · The reference's closing line is "We know roofing emergencies don't
 *     wait — that's why we answer calls 24/7". That is MUST NOT SHIP twice
 *     over: EBS has no emergency line (CLIENT.contact.emergencyPhoneDisplay
 *     is empty by design) and all 24-7 copy was stripped from this site on
 *     2026-08-27. Replaced with the free-estimate/no-obligation line, which
 *     IS cleared and is sourced from CLIENT.offers.items[0].
 *
 * ⚠️ PROP SHAPE CHANGED (root §13.3.4). The old `title` and `steps` props
 * are gone; the new surface is eyebrow / headlineAccent / headlineRest /
 * intro / steps / supportingLine / ctaHref / ctaLabel. Safe because
 * EBS-Contact is the ONLY consumer and passes none of them — it spreads
 * TRACKING and nothing else. tsc will catch any consumer added later.
 */

/* ── Icons ──────────────────────────────────────────────────────────────
   Inline SVG on one 24x24 grid at 1.6 stroke, matching the services grid
   and the About page's capability cards so the whole site's iconography
   reads as one family.

   TWO-TONE, like the reference. The svg root inherits brand-primary from
   the tile; paths that should read navy carry their own text-default-font
   class plus stroke="currentColor", which resolves against the PATH's own
   colour rather than the root's. That is the whole trick, and it is why
   these do not need fills, gradients or a second svg.
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

/** Handset with signal arcs — reaching out, by phone or form. */
function IconCall({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M5.2 3.9h3.1l1.5 3.9-1.9 1.4a11.4 11.4 0 0 0 5 5l1.4-1.9 3.9 1.5v3.1a1.7 1.7 0 0 1-1.9 1.7A15.8 15.8 0 0 1 3.5 5.8a1.7 1.7 0 0 1 1.7-1.9Z" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="M15.4 3.6a5.6 5.6 0 0 1 4.6 4.6M15 7.1a2.3 2.3 0 0 1 1.7 1.7"
      />
    </svg>
  );
}

/** Clipboard under a magnifier — the on-site inspection. */
function IconInspection({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M8.4 4.3H6.6a1.6 1.6 0 0 0-1.6 1.6v12.5a1.6 1.6 0 0 0 1.6 1.6h5.1" />
      <path d="M15.6 4.3h1.8A1.6 1.6 0 0 1 19 5.9v4.4" />
      <rect x="8.4" y="2.7" width="7.2" height="3.2" rx="1" />
      <circle className="text-default-font" stroke="currentColor" cx="16" cy="15.6" r="3.2" />
      <path className="text-default-font" stroke="currentColor" d="m18.4 18 2.3 2.3" />
    </svg>
  );
}

/** Document with ruled lines and a price — the written estimate. */
function IconEstimate({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M13.4 2.9H7a1.8 1.8 0 0 0-1.8 1.8v14.6A1.8 1.8 0 0 0 7 21.1h10a1.8 1.8 0 0 0 1.8-1.8V8.3Z" />
      <path d="M13.4 2.9v5.4h5.4" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="M8.6 12.6h3.1M8.6 15.6h6.8M8.6 18.1h4.6"
      />
    </svg>
  );
}

/** Calendar with a confirmed date — scheduling and materials. */
function IconSchedule({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="3.2" y="5.1" width="17.6" height="15.7" rx="1.8" />
      <path d="M3.2 9.9h17.6M8 3.2v3.8M16 3.2v3.8" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="m9.1 15.1 2 2 3.8-3.8"
      />
    </svg>
  );
}

/** Hard hat over shoulders — the crew on site, and the clean-up. */
function IconInstall({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M4.4 12.6a7.6 7.6 0 0 1 15.2 0" />
      <path d="M3.4 12.6h17.2a.9.9 0 0 1 .9.9v1a.9.9 0 0 1-.9.9H3.4a.9.9 0 0 1-.9-.9v-1a.9.9 0 0 1 .9-.9Z" />
      <path d="M10.2 5.6a7.6 7.6 0 0 1 3.6 0M12 5.3v7.3" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="M5.9 21.3a6.6 6.6 0 0 1 12.2 0"
      />
    </svg>
  );
}

export interface ProcessStep {
  label: string;
  icon: React.ReactNode;
}

/**
 * EBS's actual sequence, written from what the CLAIMS REGISTER clears:
 * free estimates with no charge and no obligation, a written estimate, and
 * EBS's own crews doing the work.
 *
 * ⚠️ Step 4 is scheduling, NOT the reference's insurance-claim step — see
 * the CLAIMS note in the header. Do not "restore" it to match the reference
 * without confirming EBS actually handles claims.
 */
/* ⚠️ THE WIDTH OF THIS WHOLE SECTION, in one place.

   Set 2026-09-02 because a contact form is taking the right-hand side of
   this section. Measured against the layout Ryan marked up rather than
   guessed: at a 1486px viewport the form's left edge lands at x=757, and
   this section's content box starts at x=143 (a 1280px container centred,
   plus md:px-10) — so the usable left column is 614px. 560 leaves a 54px
   gutter; 640 would overlap the form by 26px and 760 (the previous value)
   by 146px.

   It is a CONSTANT rather than four copies of the same class because four
   blocks share it — the header, the intro, the step grid, and the
   supporting line — and the failure mode when one drifts is silent: the odd
   one out simply slides under the form, with no error and no overflow.

   ⚠️ RE-MEASURE THIS when the form's real width is settled. 560 is derived
   from a marked-up screenshot, not from the built form. */
const PROCESS_MEASURE = "w-full max-w-[560px]";
const DEFAULT_STEPS: readonly ProcessStep[] = [
  { label: "Call or send a request", icon: <IconCall /> },
  { label: "Free on-site look at the job", icon: <IconInspection /> },
  { label: "Written estimate with options", icon: <IconEstimate /> },
  { label: "Date confirmed", icon: <IconSchedule /> },
  { label: "The work, done by our own crew", icon: <IconInstall /> },
];

export interface OurProcessStepsWrapperProps {
  id?: string;
  className?: string;

  /** Content */
  eyebrow?: string;
  /** Rendered italic in the accent colour, ahead of `headlineRest`. */
  headlineAccent?: string;
  headlineRest?: string;
  intro?: React.ReactNode;
  steps?: readonly ProcessStep[];
  supportingLine?: React.ReactNode;

  /** CTA */
  ctaHref?: string;
  ctaLabel?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function OurProcessStepsWrapper({
  id,
  className,
  eyebrow = "HOW IT WORKS",
  headlineAccent = `${CLIENT.vocabulary.tradeName} made`,
  headlineRest = "simple, clear, and honest",
  intro = `Choosing a tree crew should not feel overwhelming. Our process keeps you informed at every step — from the first look at the tree through to the final clean-up. Whether it is one limb or a whole lot, you get clear pricing and an honest plan.`,
  steps = DEFAULT_STEPS,
  /*
    Replaces the reference's "we answer calls 24/7" line, which is MUST NOT
    SHIP twice over. Sourced from CLIENT.offers.items[0].description, which
    is the cleared wording: "No charge to come out and no obligation."
  */
  supportingLine = "The estimate is free — no charge to come out, and no obligation to go ahead.",
  /*
    Points at THIS page's own form rather than /contact, since the visitor is
    already here. ⚠️ That anchor is currently emitted TWICE on /contact: the
    builder wraps ContactInfoFormWrapper in <section id="contact-info-form">
    and the component ALSO defaults the same id onto its own root (root
    §6.6.1 direction 1). The link still behaves correctly — the browser takes
    the first, which is the outer section — but the duplicate is invalid HTML
    and pre-dates this section. Fixing it means dropping the id from the
    builder's wrapper, not from here.
  */
  ctaHref = "#contact-info-form",
  ctaLabel = "Get a Free Estimate",
  trackingSection = "our-process",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "contact",
}: OurProcessStepsWrapperProps) {
  /*
    Spread rather than retyped per element: a partial set still fires through
    the click bridge but cannot be joined in analytics. Root §8.6, §13.3.5.
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
        // `isolate` gives the two decorative bands a stacking context of
        // their own; `overflow-hidden` keeps their rotation clipped to the
        // band rather than widening the document (this site already has a
        // known 768-1024px overflow — do not add to it).
        "relative isolate w-full overflow-hidden",
        "bg-[var(--color-default-background)]",
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
      {/* Two faint diagonal bands, echoing the reference's chevron ground.
          Drawn with a skew rather than an image or an SVG data URI: it is
          two divs and a transform, costs no request, and the angle is
          legible in the markup. Both are decorative and inert. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[15%] top-0 h-full w-[45%] -skew-x-[18deg] bg-white/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] top-0 h-full w-[50%] -skew-x-[18deg] bg-white/45"
      />

      {/* `relative` lifts the content above the two absolute bands. */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        {/* Header. WAS headline-left / intro-right, matching the reference.
            COLLAPSED to a single left column 2026-09-02: the right half of
            this section is being given over to a contact form, and the intro
            paragraph sat exactly where that form goes. Everything in this
            section now lives inside PROCESS_MEASURE.

            ⚠️ Keep this a single column while the form occupies the right
            side. Restoring md:flex-row would put the prose back underneath
            the form — which does not error, does not overflow, and is only
            visible by looking. */}
        <div className="flex flex-col gap-8">
          <div className={PROCESS_MEASURE}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
              {eyebrow}
            </p>
            {/*
              Two-tone display headline. The accent half is
              --color-brand-secondary-text (#8D6917), NOT --color-brand-secondary.
              This is that token's FIRST consumer — global.css has carried it
              since the theme was written, for exactly this case, with no
              user. The reason it has to be used here: brand-secondary gold
              measures 2.15:1 on a near-white ground and fails WCAG's 3:1
              even at large-bold sizes, so the site's own display gold cannot
              legally carry a headline. brand-secondary-text is the darkened
              companion and measures ~4.7:1.
            */}
            <h2 className="mt-4 font-heading-1 text-3xl font-bold uppercase leading-[1.1] tracking-[-0.01em] text-default-font md:text-[2.75rem]">
              <span className="italic text-[var(--color-brand-secondary-text)]">
                {headlineAccent}
              </span>{" "}
              {headlineRest}
            </h2>
          </div>

          {/* No md:pt-10 any more — that existed to drop the prose down beside
              a three-line headline. Stacked underneath, it would just be a
              stray 40px gap on top of the parent's gap-8. */}
          <div className={PROCESS_MEASURE}>
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              {intro}
            </p>
          </div>
        </div>

        {/* Steps. TWO PER ROW at every tier from sm up, by request
            (2026-09-02) — previously 1 / 2 / 3 / 5 across, which put all five
            on one line at lg and made each card a 150px column of wrapped
            two-word labels. Five over two columns runs 2 / 2 / 1, so the last
            row is deliberately half-empty; that reads as a list that ended
            rather than as a broken grid, which a ragged 5-across tier did not.

            ⚠️ max-w-[760px] + mr-auto is what makes this LEFT-ALIGNED rather
            than merely two-column. Without the cap, two columns across the
            1280px container give ~620px cards carrying four words each, and
            the section reads as two enormous empty boxes. The cap sets the
            card width; mr-auto is what pins the block left instead of letting
            the grid centre itself in the container.

            The supporting line and the CTA below moved left in the same pass.
            They were centred against a full-width grid; leaving them centred
            under a left-aligned block would read as a mistake rather than as a
            choice. */}
        <ol className={`mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 ${PROCESS_MEASURE}`}>
          {steps.map((step, i) => (
            <li key={step.label} className="relative pl-3 pt-8">
              {/* The card. pt-14 clears the tile overlapping its top-left
                  corner; h-full equalises the row when labels wrap to
                  different line counts. */}
              <div className="flex h-full flex-col rounded-sm bg-white/75 px-5 pb-6 pt-14 shadow-[0_1px_2px_rgba(23,41,58,0.04)]">
                <p className="flex items-start gap-2 text-sm font-semibold uppercase leading-snug tracking-[0.02em] text-default-font">
                  <span className="text-brand-primary">{i + 1}</span>
                  <span>{step.label}</span>
                </p>
              </div>

              {/* Icon tile, overlapping the card's top-left corner exactly as
                  the reference does. It sits AFTER the card in source order
                  so it paints on top without needing a z-index. */}
              <span className="absolute left-0 top-0 flex h-[72px] w-[72px] items-center justify-center rounded-sm bg-white text-brand-primary shadow-[0_4px_14px_rgba(23,41,58,0.13)]">
                {React.cloneElement(
                  step.icon as React.ReactElement<{ className?: string }>,
                  { className: "h-9 w-9" }
                )}
              </span>
            </li>
          ))}
        </ol>

        <p className={`mt-14 text-left text-base leading-relaxed text-neutral-600 ${PROCESS_MEASURE}`}>
          {supportingLine}
        </p>

        {/*
          Navy rather than brand-primary. This label is 16px semibold, which
          is NOT large text under WCAG, so white on #1685CC (3.99:1) would
          fail AA; on navy it is 14.84:1. Same reasoning as the services
          grid's CTA tile and the About page's capability section.
        */}
        <div className="mt-8 flex justify-start">
          <a
            href={ctaHref}
            className={[
              "inline-flex items-center gap-2 rounded-md px-8 py-4",
              "bg-[var(--color-default-font)] text-base font-semibold text-white",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-default-background)",
            ].join(" ")}
            data-event="click_cta"
            data-label="our-process-cta-free-estimate"
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
