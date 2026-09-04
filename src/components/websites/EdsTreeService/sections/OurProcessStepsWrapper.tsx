import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * Ed's — "How it works" process section. TWO layouts, one component:
 * `column` (the default, /contact) and `row` (the home page).
 *
 * ── 2026-09-04, Ed's: tree steps, a row layout, and two owner overrides ──
 *
 * WHAT CHANGED
 *  · The five step ICONS and LABELS are now tree-specific and are SHARED by
 *    both pages (Ryan, 2026-09-04): tell us about the tree → free on-site
 *    look → you get the estimate → we set the date → our own crew does the
 *    work. The generic contractor set (handset, clipboard, document, hard
 *    hat) is gone.
 *  · A `layout` prop was added. `column` reproduces the /contact layout
 *    byte-for-byte — everything inside PROCESS_MEASURE, 2-up steps, left
 *    aligned — because a contact form still occupies that page's right half.
 *    `row` is the ORIGINAL pre-2026-09-02 design restored and taken further:
 *    full container width, headline left / intro right, five steps across on
 *    one connector rail, centred supporting line and CTA.
 *  · The home page mounts it between AboutUsVariant2 and the services grid
 *    with layout="row" on a WHITE ground. White is load-bearing: the About
 *    band above is --color-default-font at md+, and the services grid below
 *    is --color-ground-concrete (#E7F5E9). The page-background token here
 *    would be one step off the grid and produce no seam at all.
 *
 * ⚠️ OWNER OVERRIDE 1 — AMBER IS UNRESTRICTED IN THIS SECTION.
 * Ryan, 2026-09-04: "amber is allowed in this section; delete or bypass the
 * amber-cannot-be-used-as-text/border/divider rule for this component."
 * So the eyebrow, the connector rail, the icon tiles and the CTA are amber.
 * Recorded with the objection, per the log's §2 override discipline:
 * --color-brand-secondary (#E68E1C) measures 2.55:1 on white and 2.37:1 on
 * the page background. As TEXT that misses WCAG AA at every size (4.5:1
 * normal, 3:1 large). Where amber carries type here it is a FILL with
 * --color-default-font labels on it, which is 6.48:1 and passes — that is
 * the style guide's own body-on-secondary pair and is how the amber does
 * most of its work. The eyebrow is the one place amber is literally the
 * text colour, and it is the one element that does not meet AA.
 * Do not "fix" this back without asking; it is a decision, not a defect.
 *
 * ⚠️ OWNER OVERRIDE 2 — THE FREE / NO-OBLIGATION ESTIMATE COPY IS CLEARED.
 * Ryan, 2026-09-04: every string in this process flow describes the free,
 * no-obligation estimate Ed's actually offers, cleared for BOTH pages. That
 * moved "free estimate with no obligation to go ahead" out of the register's
 * banned sales-conduct family and into Cleared (handoff §3, dated). Three
 * strings that were flagged before the override are now legitimate. It does
 * NOT extend past the estimate: there is deliberately no clean-up or
 * haul-away step, because service-scope promises remain uncleared.
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
 *     2026-08-27. Replaced with the free-estimate/no-obligation line.
 *     ⚠️ CORRECTED 2026-09-04: this used to say the line was "sourced from
 *     CLIENT.offers.items[0]". It is not, and cannot be — that array was
 *     emptied on 2026-09-04 when the owner confirmed free estimates are the
 *     only offer. The line is a literal here, and it is cleared by owner
 *     override 2 above rather than by an offers record.
 *
 * ⚠️ PROP SHAPE CHANGED (root §13.3.4). The old `title` and `steps` props
 * are gone; the surface is layout / eyebrow / headlineAccent / headlineRest
 * / intro / steps / supportingLine / ctaHref / ctaLabel. `layout` was ADDED
 * 2026-09-04 and defaults to "column", so the existing /contact mount is
 * unchanged by its arrival. Every prop is optional; tsc catches any consumer
 * that passes something the interface does not carry.
 */

/* ── Icons ──────────────────────────────────────────────────────────────
   Inline SVG on one 24x24 grid at 1.6 stroke, matching the services grid
   and the About page's capability cards so the whole site's iconography
   reads as one family.

   TWO-TONE, and it costs nothing. The svg root inherits its colour from the
   tile; paths that should read as the accent carry their own
   text-default-font class plus stroke="currentColor", which resolves against
   the PATH's own colour rather than the root's. That is the whole trick, and
   it is why these need no fills, gradients or second svg.

   ⚠️ THE TWO LAYOUTS COLOUR THESE DIFFERENTLY, and the icons need no edit
   for it. In `column` the tile is white and its text colour is
   brand-primary, so the root strokes read green and the accent paths read
   near-black — genuinely two-tone. In `row` the tile is AMBER and its text
   colour is default-font, so root and accents resolve to the SAME near-black
   and the icon reads single-tone at 6.48:1 on the amber. That is deliberate:
   the only other tone available on an amber fill is brand-primary green,
   which measures ~2.2:1 against it and would be worse than no contrast at
   all. Do not add a third colour class to "restore" two-tone in row mode.

   ── 2026-09-04: all five redrawn for a TREE SERVICE ──
   The set used to be a generic contractor sequence inherited from a roofing
   build — handset, clipboard, document, calendar, hard hat — which described
   any trade and none. Every glyph below is specific to what actually happens
   on a tree job, and each maps to exactly one step.
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

/**
 * Step 1 — handset with a message bubble. Both ways in: the phone line and
 * the form. The bubble replaces the old signal arcs, which said "phone"
 * twice and never said "or send us a request".
 */
function IconCall({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M5.2 3.9h3.1l1.5 3.9-1.9 1.4a11.4 11.4 0 0 0 5 5l1.4-1.9 3.9 1.5v3.1a1.7 1.7 0 0 1-1.9 1.7A15.8 15.8 0 0 1 3.5 5.8a1.7 1.7 0 0 1 1.7-1.9Z" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="M14.8 2.4h6.1a1.2 1.2 0 0 1 1.2 1.2v2.9a1.2 1.2 0 0 1-1.2 1.2h-3.1l-2.3 1.8V7.7h-.7a1.2 1.2 0 0 1-1.2-1.2V3.6a1.2 1.2 0 0 1 1.2-1.2Z"
      />
    </svg>
  );
}

/**
 * Step 2 — a tree with a magnifier over it. The free on-site look. This is
 * the glyph that most distinguishes a tree service from any other trade, so
 * it is a real conifer with a trunk and a ground line, not a clipboard.
 */
function IconTreeLook({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      {/* ⚠️ The magnifier only GRAZES the canopy (its left edge lands at
          x≈13.9, the lower tier ends at x=14). The first draft centred it
          over the tree and the two shapes turned into one unreadable blob at
          36px — verified on a 3x capture, not guessed. Keep them touching,
          not overlapping. */}
      <path d="M9.5 3 6.6 8h5.8Z" />
      <path d="M9.5 7 5 13.6h9Z" />
      <path d="M9.5 13.6v4M6 17.6h7" />
      <circle className="text-default-font" stroke="currentColor" cx="17.2" cy="15.6" r="3.3" />
      <path className="text-default-font" stroke="currentColor" d="m19.6 18 2.4 2.4" />
    </svg>
  );
}

/**
 * Step 3 — the estimate sheet, marked with a small tree so it reads as an
 * estimate for THIS job rather than as a generic document icon.
 */
function IconEstimate({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M13.4 2.9H7a1.8 1.8 0 0 0-1.8 1.8v14.6A1.8 1.8 0 0 0 7 21.1h10a1.8 1.8 0 0 0 1.8-1.8V8.3Z" />
      <path d="M13.4 2.9v5.4h5.4" />
      {/* ⚠️ ONE BIG TREE, NOT A SMALL ONE PLUS THREE RULED LINES. The first
          draft drew a 3.4-wide conifer above three lines of "text"; at 36px
          the tree read as an arrowhead and the whole glyph read as a generic
          document. The canopy is now 5.4 wide with a single rule under it —
          fewer marks, each one big enough to survive the size. */}
      <path d="M12 10 9.3 14.2h5.4Z" />
      <path d="M12 14.2v2" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="M8.6 18.6h6.8"
      />
    </svg>
  );
}

/** Step 4 — calendar with a confirmed date. The one glyph that carried over
 *  unchanged: booking a date looks the same in every trade. */
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

/**
 * Step 5 — a hard hat: the crew on site.
 *
 * ⚠️ DO NOT REPLACE THIS WITH A CHAINSAW. It was tried THREE times on
 * 2026-09-04, verified each time on a 3x capture of the live disc, and it
 * never read at the 36px this icon is actually drawn at:
 *   1. Motor body + a semicircular top handle → an unmistakable PADLOCK.
 *   2. Arch removed, teeth along the top of a long bar → a KEY. A bow-ish
 *      body plus a toothed shaft IS the key silhouette.
 *   3. Chunkier body, thinner bar, teeth pointing DOWN → still a key. The
 *      body/bar proportion is what carries the read, and at this size there
 *      is not enough room to make a motor housing look like a motor housing.
 * A chainsaw needs roughly 48px before its silhouette separates from a key.
 * None of this is visible in the markup, in a class name, or in any computed
 * style — only in a capture, which is why the failures kept surviving into
 * "it looks fine" until the discs were actually zoomed.
 *
 * The hard hat is the other glyph Ryan named for this step. It is generic
 * across trades, which was the original objection to it — but the step's own
 * label is "Our own crew does the work", the surrounding set is already
 * strongly tree-specific (tree-and-magnifier, tree-marked estimate), and an
 * icon that reads wrong is worse than one that reads plainly.
 */
function IconCrew({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M4.8 13.8a7.2 7.2 0 0 1 14.4 0" />
      <path d="M2.6 13.8h18.8a1.1 1.1 0 0 1 1.1 1.1v1.3a1.1 1.1 0 0 1-1.1 1.1H2.6a1.1 1.1 0 0 1-1.1-1.1v-1.3a1.1 1.1 0 0 1 1.1-1.1Z" />
      <path
        className="text-default-font"
        stroke="currentColor"
        d="M12 6.7v7.1M8.9 7.6a7.2 7.2 0 0 0-1.1 6.2M15.1 7.6a7.2 7.2 0 0 1 1.1 6.2"
      />
    </svg>
  );
}

export interface ProcessStep {
  label: string;
  icon: React.ReactNode;
}

/**
 * Ed's actual sequence, rewritten for a tree service 2026-09-04 and SHARED
 * by both layouts — the home row and the /contact column show the identical
 * five steps, by request. One process, one description of it.
 *
 * Each label maps to a cleared claim: free estimates (register, Cleared),
 * the free/no-obligation estimate (owner override 2, header), and "our own
 * crews, start to finish" (register, Cleared).
 *
 * ⚠️ THERE IS NO CLEAN-UP OR HAUL-AWAY STEP, and that is deliberate rather
 * than an oversight. A sixth "we clear the yard" step is the obvious thing
 * to add to a tree-service process and it is exactly what the register bans:
 * "cleanup included" / "we leave your yard cleaner than we found it" are
 * uncleared service-scope promises. Owner override 2 cleared the ESTIMATE
 * copy, not the scope of the work. Do not add it without an owner answer.
 *
 * ⚠️ Step 4 is scheduling, NOT the reference's insurance-claim step — see
 * the CLAIMS note in the header. Insurance-claim help after storms is an
 * UNVERIFIED CAPABILITY for Ed's too, and sits next to the banned emergency
 * language, so it is doubly not a step to invent.
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

/* ⚠️ COLUMN LAYOUT ONLY. PROCESS_MEASURE above exists because a contact form
   occupies the right half of /contact; the `row` layout has no form beside
   it and uses the full container instead. `measure` in the component body is
   what picks between them — never hardcode PROCESS_MEASURE into the JSX
   again, or the row layout silently collapses to a 560px strip on a 1280px
   container and simply looks like a mistake. */
const DEFAULT_STEPS: readonly ProcessStep[] = [
  { label: "Tell us about the tree", icon: <IconCall /> },
  { label: "Free on-site look", icon: <IconTreeLook /> },
  { label: "You get the estimate", icon: <IconEstimate /> },
  { label: "We set the date", icon: <IconSchedule /> },
  { label: "Our own crew does the work", icon: <IconCrew /> },
];

export interface OurProcessStepsWrapperProps {
  id?: string;
  className?: string;

  /**
   * `column` (default) — everything inside PROCESS_MEASURE, steps 2-up, left
   * aligned, on the page-background ground. This is /contact, where a sticky
   * contact form owns the right half of the section.
   *
   * `row` — full container width, headline left / intro right, five steps
   * across one connector rail, centred supporting line and CTA, white ground.
   * This is the home page.
   */
  layout?: "column" | "row";

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

/* ── The two step shapes ────────────────────────────────────────────────
   Two sub-components rather than one <li> full of `isRow ?` ternaries. The
   column card and the row node share almost nothing structurally — one is a
   left-aligned card with a tile overlapping its corner, the other is a
   centred node sitting on a rail — so a single element trying to be both
   would carry a conditional on nearly every class. Single-use, so they live
   in this file (root §6.4).
   -------------------------------------------------------------------- */

/** `column` — the /contact card, with the icon tile overlapping its corner. */
function StepCard({ step, index }: { step: ProcessStep; index: number }) {
  return (
    <li className="relative pl-3 pt-8">
      {/* The card. pt-14 clears the tile overlapping its top-left corner;
          h-full equalises the row when labels wrap to different line
          counts. */}
      <div className="flex h-full flex-col rounded-sm bg-white/75 px-5 pb-6 pt-14 shadow-[0_1px_2px_rgba(11,36,14,0.05)]">
        <p className="flex items-start gap-2 text-sm font-semibold uppercase leading-snug tracking-[0.02em] text-default-font">
          <span className="text-brand-primary">{index + 1}</span>
          <span>{step.label}</span>
        </p>
      </div>

      {/* Icon tile. It sits AFTER the card in source order so it paints on
          top without needing a z-index. White tile + brand-primary root =
          the two-tone icon described in the Icons block. */}
      <span className="absolute left-0 top-0 flex h-[72px] w-[72px] items-center justify-center rounded-sm bg-white text-brand-primary shadow-[0_4px_14px_rgba(11,36,14,0.14)]">
        {React.cloneElement(
          step.icon as React.ReactElement<{ className?: string }>,
          { className: "h-9 w-9" }
        )}
      </span>
    </li>
  );
}

/**
 * `row` — the home page node: an amber disc on the connector rail, wearing a
 * numbered badge, with the label centred beneath it.
 *
 * The amber fill is owner override 1 (file header). It carries the icon in
 * --color-default-font at 6.48:1, which is the style guide's own
 * body-on-secondary pairing and passes AA — the amber is doing its work as a
 * FILL here, not as type.
 *
 * ⚠️ The disc must stay OPAQUE and z-10. The rail is drawn as one straight
 * line across the whole row and is hidden behind the discs; make the disc
 * translucent and the line reappears straight through every icon.
 */
function StepNode({ step, index }: { step: ProcessStep; index: number }) {
  return (
    <li className="relative flex flex-col items-center text-center">
      <span className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-secondary text-default-font shadow-[0_4px_14px_rgba(11,36,14,0.18)]">
        {React.cloneElement(
          step.icon as React.ReactElement<{ className?: string }>,
          { className: "h-9 w-9" }
        )}
        {/* Number badge. ring-2 ring-white cuts a gap out of the amber disc
            so the two circles read as separate objects rather than as one
            dented shape. White on the near-black ground is 15.34:1. */}
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-default-font)] text-[11px] font-bold text-white ring-2 ring-white">
          {index + 1}
        </span>
      </span>

      {/* max-w caps the label so a three-word step wraps to two tidy lines
          instead of stretching to the full column and pulling the row's
          rhythm apart. */}
      <p className="mt-5 max-w-[190px] text-sm font-semibold uppercase leading-snug tracking-[0.02em] text-default-font">
        {step.label}
      </p>
    </li>
  );
}

export default function OurProcessStepsWrapper({
  id,
  className,
  layout = "column",
  eyebrow = "HOW IT WORKS",
  headlineAccent = `${CLIENT.vocabulary.tradeName} made`,
  /*
    REWRITTEN 2026-09-04. Was "simple, clear, and honest": "clear" and
    "honest" are sales-conduct adjectives the register does not clear, and
    owner override 2 covers the free/no-obligation ESTIMATE, not Ed's
    character. This version says the same thing about the process itself.
  */
  headlineRest = "simple, from first call to finished job",
  /*
    REWRITTEN 2026-09-04. The previous intro carried three problems at once:
    "keeps you informed at every step" (the register's own tell for an
    invented absolute), "clear pricing and an honest plan" (the banned
    upfront-pricing / no-pressure family), and "through to the final
    clean-up" — a service-scope promise that owner override 2 does NOT
    cover, since the override is about the estimate. What is left is the
    three things that actually happen, all inside the override.
  */
  intro = `Choosing a tree crew should not feel overwhelming. You tell us about the tree, we come out and look at it, and you get an estimate — free, with no obligation to go ahead.`,
  steps = DEFAULT_STEPS,
  /*
    Replaces the reference's "we answer calls 24/7" line, which is MUST NOT
    SHIP twice over. ⚠️ CORRECTED 2026-09-04: this comment used to say the
    wording was sourced from CLIENT.offers.items[0].description. That array
    is empty — free estimates are the only offer Ed's makes, and they are
    carried in copy, not in an offers record. The line is cleared by owner
    override 2 (see the file header), which is what makes "no obligation"
    legitimate here when the register's sales-conduct row would otherwise
    ban it.
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

  const isRow = layout === "row";

  /*
    ⚠️ WHY THE ROW GROUND IS WHITE AND NOT THE PAGE BACKGROUND.
    Positional, so re-derive it if this section ever moves. On the home page
    it sits between AboutUsVariant2 — --color-default-font at md+, i.e. the
    dark chevron band — and ServicesGridSectionWrapper on
    --color-ground-concrete (#E7F5E9). White gives a hard edge against the
    dark band above and a real step down to the concrete below.
    --color-default-background (#EDFAEF) is ONE STEP off that concrete and
    would produce no visible seam with the grid at all: the two sections
    would read as one very long band. /contact keeps the page background
    because its neighbours there are different.
  */
  return (
    <section
      id={id}
      className={[
        // `isolate` gives the two decorative bands a stacking context of
        // their own; `overflow-hidden` keeps their rotation clipped to the
        // band rather than widening the document (this site already has a
        // known 768-1024px overflow — do not add to it).
        "relative isolate w-full overflow-hidden",
        isRow ? "bg-white" : "bg-[var(--color-default-background)]",
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
          legible in the markup. Both are decorative and inert.

          ⚠️ THE FILL HAS TO FOLLOW THE GROUND. In `column` these are white
          over the page background, which is what makes them visible. On the
          row layout's WHITE ground, white-on-white is nothing at all — the
          bands would still be in the DOM, still cost the same, and paint
          absolutely nothing. Row uses a very low-alpha amber instead (owner
          override 1), which reads as the same diagonal motif on white.

          ⚠️ A GROUND SWAP WITH ServiceGuaranteeAndFeaturesWrapper WAS TRIED
          AND REVERTED on 2026-09-04, at Ryan's request, the same day. The
          experiment moved this warm tint out to that section as a new
          `--color-ground-amber` token and left this one plain white. Both
          halves are undone: these wedges are amber again in row mode, that
          section is `bg-white` again, and the token is gone. Do not
          reintroduce it as a tidy-up. */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -left-[15%] top-0 h-full w-[45%] -skew-x-[18deg]",
          isRow ? "bg-brand-secondary/[0.07]" : "bg-white/70",
        ].join(" ")}
      />
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-[20%] top-0 h-full w-[50%] -skew-x-[18deg]",
          isRow ? "bg-brand-secondary/[0.04]" : "bg-white/45",
        ].join(" ")}
      />

      {/* `relative` lifts the content above the two absolute bands. */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        {/* Header. Headline-left / intro-right in `row` — the shape the
            reference had and the shape this section was built with.

            ⚠️ COLUMN MUST STAY A SINGLE COLUMN. It was collapsed on
            2026-09-02 because /contact gives the right half of this section
            to a sticky contact form, and the intro paragraph sat exactly
            where that form goes. Restoring md:flex-row there would put the
            prose back UNDERNEATH the form — which does not error, does not
            overflow, and is only visible by looking at the page. That is
            why the direction is bound to `isRow` and not to a breakpoint. */}
        {/* ⚠️ The split is lg, NOT md, and that was measured rather than
            chosen. At md the headline gets 55% of (768 − 48) = 396px and the
            44px display face breaks "…FROM FIRST CALL TO FINISHED JOB" over
            four lines against a three-line intro — top-heavy and lopsided.
            At lg the same column is ~519px and the pair balances. Between
            768 and 1024 the header simply stacks, which is what the 44px
            type actually has room for. */}
        <div
          className={
            isRow
              ? "flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-14"
              : "flex flex-col gap-8"
          }
        >
          <div className={isRow ? "lg:w-[55%]" : PROCESS_MEASURE}>
            {/*
              ⚠️ AMBER EYEBROW — OWNER OVERRIDE 1 (file header), 2026-09-04.
              --color-brand-secondary measures 2.55:1 on the row layout's
              white and 2.37:1 on the column layout's page background. Both
              miss WCAG AA for text at every size. Ryan asked for the amber
              rule to be bypassed in this section and this is the one element
              where amber is literally the text colour rather than a fill.
              Recorded, not silently "fixed": the compliant version is
              text-[var(--color-brand-secondary-text)], which on this client
              resolves to primary green at 5.07:1.
            */}
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
              {eyebrow}
            </p>
            {/*
              Display headline. The accent half is
              --color-brand-secondary-text, which on Ed's resolves to PRIMARY
              GREEN (5.07:1 on the page background, 5.45:1 on white), not to
              the darkened gold it held on the previous client. Deliberately
              left green under override 1: at 44px on white, amber's 2.55:1
              would read as washed-out rather than as an accent, so the
              override buys nothing here. The amber does its work below, as
              the rail, the discs and the CTA — where it is a fill carrying
              dark labels at 6.48:1.
            */}
            <h2 className="mt-4 font-heading-1 text-3xl font-bold uppercase leading-[1.1] tracking-[-0.01em] text-default-font md:text-[2.75rem]">
              {/* ⚠️ pr-[0.12em] is NOT decorative spacing. The word space
                  after this span is really there in the DOM (verified), but
                  the italic's overhang leans the last glyph into it and at
                  44px "…MADE simple" renders as "MADEsimple". The padding
                  gives the slant somewhere to go. Ems, not px, so it scales
                  with the heading's own breakpoint change. */}
              <span className="italic pr-[0.12em] text-[var(--color-brand-secondary-text)]">
                {headlineAccent}
              </span>{" "}
              {headlineRest}
            </h2>
          </div>

          {/* md:items-end on the parent sits this beside the headline's last
              line in row mode. In column mode there is no md:pt-10 — that
              existed to drop the prose down beside a three-line headline;
              stacked underneath, it would just be a stray 40px gap on top of
              the parent's gap-8. */}
          <div className={isRow ? "md:w-[45%]" : PROCESS_MEASURE}>
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              {intro}
            </p>
          </div>
        </div>

        {/* Steps.

            COLUMN — two per row at every tier from sm up, by request
            (2026-09-02). Five over two columns runs 2 / 2 / 1, so the last
            row is deliberately half-empty; that reads as a list that ended
            rather than as a broken grid, which a ragged 5-across tier did
            not. PROCESS_MEASURE is what makes it LEFT-ALIGNED rather than
            merely two-column: without the cap, two columns across the 1280px
            container give ~620px cards carrying four words each and the
            section reads as two enormous empty boxes.

            ROW — five across at lg on one connector rail. This is the layout
            the earlier note called "a ragged 5-across tier", and it is only
            workable now because the step shape changed with it: a 221px
            column is far too narrow for a card with a corner-mounted tile,
            but it is comfortable for a centred disc with a two-line label
            under it (see StepNode). Below lg it steps down to 2-up and then
            1-up and the rail is hidden, because a rail through a wrapped
            grid connects the wrong pairs. */}
        <ol
          className={
            isRow
              ? "relative mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5"
              : `mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 ${PROCESS_MEASURE}`
          }
        >
          {/* The connector rail, lg and up only.

              ⚠️ left-[10%] / right-[10%] is not a guess and is not padding:
              with five equal columns each is 20% wide, so 10% is exactly the
              CENTRE of the first and of the last. The rail therefore starts
              and stops under the end discs instead of running out to the
              container edges. top-9 is half of the 72px disc, so it crosses
              their centres. Change the column count and both numbers have to
              change with it. */}
          {isRow && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[10%] right-[10%] top-9 hidden border-t-2 border-dashed border-brand-secondary/70 lg:block"
            />
          )}

          {steps.map((step, i) =>
            isRow ? (
              <StepNode key={step.label} step={step} index={i} />
            ) : (
              <StepCard key={step.label} step={step} index={i} />
            )
          )}
        </ol>

        {/* Column keeps this left, under a left-aligned grid — centring it
            there would read as a mistake rather than as a choice. Row centres
            it under a full-width grid, for the same reason in reverse. */}
        <p
          className={[
            "mt-14 text-base leading-relaxed text-neutral-600",
            isRow
              ? "mx-auto max-w-[680px] text-center"
              : `text-left ${PROCESS_MEASURE}`,
          ].join(" ")}
        >
          {supportingLine}
        </p>

        {/*
          CTA. Column keeps the near-black fill with a white label (15.34:1)
          that /contact has shipped since 2026-08-31 — not changed here,
          because this pass was asked to change the STEPS on that page, not
          its button.

          Row takes the amber fill with a --color-default-font label, which
          is 6.48:1 and passes AA. That is the style guide's own canonical
          CTA treatment (the same pairing as the navbar's), and it is what
          owner override 1 is for. ⚠️ The label must NOT go white on amber:
          that is 2.55:1, and it is the specific mistake the guide's rule 2
          exists to prevent.

          The focus ring has to move with the fill. An amber ring on an amber
          button is invisible, so row rings in --color-default-font.
        */}
        <div className={["mt-8 flex", isRow ? "justify-center" : "justify-start"].join(" ")}>
          <a
            href={ctaHref}
            className={[
              "inline-flex items-center gap-2 rounded-md px-8 py-4",
              "text-base font-semibold",
              isRow
                ? "bg-brand-secondary text-default-font hover:bg-brand-secondary-hover"
                : "bg-[var(--color-default-font)] text-white",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2",
              isRow
                ? "focus-visible:ring-[var(--color-default-font)] focus-visible:ring-offset-white"
                : "focus-visible:ring-brand-secondary focus-visible:ring-offset-(--color-default-background)",
              "focus-visible:ring-offset-2",
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
