import React, { useId } from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — Trust badge marquee.
 *
 * A strip of badges that scrolls infinitely, sitting between the hero and
 * the services grid on the home page. Each of the four wears a DIFFERENT
 * silhouette -- roofline pentagon, shield, flat-top hexagon, chevron band --
 * while sharing one type treatment and one sheen. See SHAPES. The
 * tenure badge additionally wears a gold-FOIL field; see BadgeVariant.
 *
 * NO "use client", and that is not an oversight. `TrustBadge` calls
 * `useId`, but useId resolves during RENDER — including server render —
 * rather than in an effect, so nothing here needs the client. The section
 * ships zero interactive JS: the marquee is a CSS animation and
 * view_section is opt-in via `data-track-view`, handled by the vanilla
 * observer in Layout.astro (root §8.2 Mechanism A). Adding a React
 * observer here would be wrong on both counts.
 *
 * INLINE SVG, NOT <img>. An earlier plan for this section used four .svg
 * files. Inline is strictly better here: React 19's SSR emits a
 * high-priority `<link rel="preload">` for every non-lazy <img> it renders
 * (root §9.13), and inline SVG is invisible to that pass — so this section
 * costs ZERO network requests and cannot compete with the hero's LCP. It
 * also lets the badge text stay live text in the site's own webfont, which
 * an <img src="*.svg"> cannot do (an image cannot load a webfont, so the
 * text would have had to be converted to outlines).
 *
 * The trade is DOM weight: the marquee repeats the four badges enough
 * times to fill the widest viewport twice over. See MARQUEE_REPEATS.
 */

export type TrustBadgeProps = {
  /** Small gold qualifier in the roof peak, e.g. "SINCE 2006". */
  eyebrow: string;
  /** First main line, e.g. "20+ YEARS". */
  lineOne: string;
  /** Optional second main line, e.g. "EXPERIENCE". */
  lineTwo?: string;
  /**
   * Accessible name. Defaults to the three text lines joined.
   * Override when the visual line breaks read badly aloud.
   */
  label?: string;
  /** Silhouette. Defaults to the original roofline pentagon. */
  shape?: BadgeShape;
  /**
   * Surface treatment. "navy" is the standard badge; "foil" fills the
   * field with a gold gradient and flips the type to navy. Use it
   * sparingly — it is an accent, and every badge wearing it would make
   * none of them stand out.
   */
  variant?: BadgeVariant;
  className?: string;
};

export type BadgeVariant = "navy" | "foil";

export type BadgeShape = "pentagon" | "shield" | "hexagon" | "chevron";

interface ShapeSpec {
  /** Field outline. Doubles as the clip path for the sheen. */
  outline: string;
  /** Gold rule, inset inside the outline. */
  inner: string;
  /** Baselines for eyebrow, lineOne, lineTwo. */
  textY: [number, number, number];
}

/**
 * The four silhouettes, ALL drawn inside the same 140x162 viewBox.
 *
 * One shared viewBox is the load-bearing decision here. The marquee spaces
 * badges on a fixed pitch (measured at 232px on desktop), and that only
 * stays even if every badge occupies an identically sized box. Giving each
 * shape its own natural viewBox would make the strip's rhythm lurch as
 * different silhouettes scrolled past. So each shape is fitted to the box,
 * not the box to the shape.
 *
 * The SHEEN is deliberately not part of this table. It is two diagonal
 * slivers spanning the full height of the box, clipped to `outline` -- so
 * the same two polygons produce a correctly shaped highlight on every
 * silhouette, and adding a shape needs no sheen work at all.
 *
 * `textY` varies per shape because the usable area does. The pentagon
 * loses its top corners to the roof peak, so its text sits low; the shield
 * narrows toward its point, so its text sits high and clear of the taper.
 */
const SHAPES: Record<BadgeShape, ShapeSpec> = {
  /** Original: roof peak over a square body. */
  pentagon: {
    outline: "M70,0 L0,44 L0,162 L140,162 L140,44 Z",
    inner: "M70,15 L12,52 L12,150 L128,150 L128,52 Z",
    textY: [80, 110, 134],
  },
  /** Flat shoulders curving to a point -- reads as protection. */
  shield: {
    outline: "M8,4 L132,4 L132,90 C132,124 104,148 70,158 C36,148 8,124 8,90 Z",
    inner: "M20,16 L120,16 L120,88 C120,115 98,134 70,142 C42,134 20,115 20,88 Z",
    textY: [52, 82, 106],
  },
  /** Flat top and bottom, angled sides -- widest text area at the centre. */
  hexagon: {
    outline: "M26,6 L114,6 L140,81 L114,156 L26,156 L0,81 Z",
    inner: "M36,19 L104,19 L126,81 L104,143 L36,143 L14,81 Z",
    textY: [56, 86, 110],
  },
  /**
   * Banner with a downward chevron tail. Replaced a shingle-tab
   * silhouette on 2026-08-28 at Ryan's request; the shingle is one table
   * entry away in git history if it is ever wanted for a fifth badge.
   *
   * Like every other shape here, the inner rule ECHOES the outline rather
   * than being a plain inset rectangle — the pentagon's rule follows its
   * peak, the hexagon's its angles, and this one follows the tail. A
   * rectangle would have read as a mismatched box floating in a
   * chevron.
   */
  chevron: {
    outline: "M0,0 L140,0 L140,120 L70,162 L0,120 Z",
    inner: "M12,14 L128,14 L128,108 L70,142 L12,108 Z",
    textY: [46, 76, 100],
  },
};

/**
 * EBS trust badge — roofline pentagon with a gold inner rule and a
 * diagonal sheen whose angle matches the roof pitch.
 *
 * Colours and type come from CSS custom properties with literal
 * fallbacks, so this renders correctly even before tokens resolve and
 * re-skins automatically when they do (root §4.5).
 *
 * ⚠️ Both custom properties below are REAL tokens in `body.theme-ebs`.
 * An earlier draft referenced `--font-display` and `--color-badge-field`,
 * neither of which exists in this codebase — both silently fell through
 * to their literal fallbacks, so the badge looked correct while being
 * effectively hardcoded, and would have stopped matching the brand on the
 * next fork without anything failing. `--color-badge-field`'s fallback
 * was also #17293C against the site's actual #17293A. Verify a custom
 * property exists before relying on it; a wrong name is invisible.
 *
 * NAMED export, not default: this file's default is the section wrapper,
 * which is what page builders import. It arrived as a standalone module
 * with `export default` and had to change when it was co-located here per
 * root §6.4 (single use → same file).
 */
export function TrustBadge({
  eyebrow,
  lineOne,
  lineTwo,
  label,
  shape = "pentagon",
  variant = "navy",
  className,
}: TrustBadgeProps) {
  const { outline, inner, textY } = SHAPES[shape];
  const foil = variant === "foil";
  // Unique per instance. Every badge is its own <svg> carrying its own
  // <defs>, so a shared literal id would put N copies of the same id in
  // the document; url(#id) resolves to the FIRST match in document order,
  // and every badge after the first would clip against that one.
  const uid = useId();
  const clipId = `badge-clip-${uid}`;
  // Same duplicate-id hazard as clipId: six foil badges render in the
  // marquee, and a shared literal gradient id would have five of them
  // paint from the first one's gradient.
  const foilId = `badge-foil-${uid}`;

  const accessibleName =
    label ?? [eyebrow, lineOne, lineTwo].filter(Boolean).join(" ");

  // The site's heading face (Barlow Semi Condensed in body.theme-ebs).
  const displayFont = 'var(--font-heading-1, "Barlow Semi Condensed", sans-serif)';
  // The site navy — the same token the stats band uses as its surface.
  const field = "var(--color-default-font, #17293A)";
  const rule = "var(--color-brand-secondary, #DDA82C)";

  /*
    On foil the palette inverts: the field becomes the gradient, and
    everything drawn on top — rule, eyebrow, both text lines — becomes the
    navy that is normally the field. Gold-on-gold would be invisible.

    Navy on this gradient measures 5.08:1 at its deepest stop through
    13.34:1 at its lightest, so the 11px eyebrow clears AA across the
    whole sweep, not just the mid-tones. See the token block in
    global.css for why the deep stop is not darker.
  */
  const fieldPaint = foil ? `url(#${foilId})` : field;
  const rulePaint = foil ? field : rule;
  const eyebrowPaint = foil ? field : rule;
  const linePaint = foil ? field : "#FFFFFF";

  return (
    <svg
      viewBox="0 0 140 162"
      role="img"
      aria-label={accessibleName}
      className={className}
      style={{ fontFamily: displayFont }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={outline} />
        </clipPath>

        {/*
          Foil banding. The alternating deep/light stops are what read as
          metal — a plain two-stop ramp reads as a flat tint. The axis is
          tilted slightly off horizontal so the bands cross the sheen
          slivers rather than running parallel to them, which is what
          stops the two effects cancelling into a flat sheet.
        */}
        {foil ? (
          <linearGradient id={foilId} x1="0%" y1="0%" x2="100%" y2="38%">
            <stop offset="0%" stopColor="var(--color-brand-secondary-foil-deep, #C08F1E)" />
            <stop offset="14%" stopColor="var(--color-brand-secondary-foil-light, #FDE08D)" />
            <stop offset="30%" stopColor="var(--color-brand-secondary, #DDA82C)" />
            <stop offset="44%" stopColor="var(--color-brand-secondary-foil-peak, #FFF3C4)" />
            <stop offset="58%" stopColor="var(--color-brand-secondary, #DDA82C)" />
            <stop offset="72%" stopColor="var(--color-brand-secondary-foil-deep, #C08F1E)" />
            <stop offset="87%" stopColor="var(--color-brand-secondary-foil-light, #FDE08D)" />
            <stop offset="100%" stopColor="var(--color-brand-secondary, #DDA82C)" />
          </linearGradient>
        ) : null}
      </defs>

      <path d={outline} fill={fieldPaint} />

      {/* Sheen. Identical for every silhouette -- the clip is what gives it
          the right shape, so a new outline needs no work here. */}
      <g clipPath={`url(#${clipId})`} aria-hidden="true">
        <polygon points="0,162 48,0 98,0 50,162" fill="#FFFFFF" opacity="0.07" />
        <polygon points="60,162 104,0 126,0 82,162" fill="#FFFFFF" opacity="0.05" />
      </g>

      <path d={inner} fill="none" stroke={rulePaint} strokeWidth="1.5" />

      <text
        x="70"
        y={textY[0]}
        textAnchor="middle"
        fill={eyebrowPaint}
        fontSize="11"
        fontWeight="600"
        letterSpacing="1.8"
      >
        {eyebrow}
      </text>
      <text
        x="70"
        y={textY[1]}
        textAnchor="middle"
        fill={linePaint}
        fontSize="18"
        fontWeight="700"
      >
        {lineOne}
      </text>
      {lineTwo ? (
        <text
          x="70"
          y={textY[2]}
          textAnchor="middle"
          fill={linePaint}
          fontSize="18"
          fontWeight="700"
        >
          {lineTwo}
        </text>
      ) : null}
    </svg>
  );
}

/**
 * Derived rather than typed, matching BusinessStatisticsWrapper and
 * AboutUsVariant1. Those two both once carried a hardcoded "18+"
 * against a `yearFounded` of 2006; deriving is what stops the three
 * drifting apart.
 *
 * "20+" is additionally safe against time in a way a bare "20" would not
 * be: the plus makes it a FLOOR, so it can only ever become understated,
 * never false.
 */
const YEARS_IN_BUSINESS = new Date().getFullYear() - CLIENT.business.yearFounded;

/**
 * The four confirmed EBS badges, in the order they read best left to
 * right: tenure, credentials, scope, ownership.
 *
 * The two-line SPLITS live here rather than in client.config.ts because
 * they are a layout decision — the break points are tuned to the 116px
 * usable width inside the gold rule. The FIGURES are not layout, so they
 * come from config.
 *
 * ⚠️ CLAIMS-CONTROLLED. Every line is cleared in the CLAIMS REGISTER
 * (EBS_HANDOFF_Step0-Step1.md §3): "since 2006" and the derived tenure,
 * "licensed and insured" (owner-confirmed), "residential and commercial",
 * and "family-run / locally owned" (owner-confirmed 2026-08-28). Do not
 * add a fifth badge without checking the register first — the reference
 * design this was modelled on carried "24/7 EMERGENCY", "25+ YEARS",
 * "NATIONWIDE" and a "$500 REFERRAL BONUS", and all four are unshippable
 * for EBS.
 */
export const EBS_TRUST_BADGES: ReadonlyArray<TrustBadgeProps> = [
  {
    eyebrow: `SINCE ${CLIENT.business.yearFounded}`,
    lineOne: `${YEARS_IN_BUSINESS}+ YEARS`,
    lineTwo: "EXPERIENCE",
    shape: "pentagon",
    // The only foil badge, deliberately. Tenure is the strongest of the
    // four claims and the foil is what marks it as such; a second foil
    // badge would cancel the emphasis.
    variant: "foil",
  },
  // Shield carries the credential: it is the silhouette that reads as
  // protection, and it holds the narrowest lines, which suits a shape
  // that tapers toward its point.
  {
    eyebrow: "FULLY",
    lineOne: "LICENSED",
    lineTwo: "& INSURED",
    shape: "shield",
  },
  {
    eyebrow: "BOTH",
    lineOne: "RESIDENTIAL",
    lineTwo: "& COMMERCIAL",
    label: "Both residential and commercial",
    // Hexagon takes the LONGEST lines deliberately -- it is the only
    // silhouette at full width across its middle, so it gives
    // "& COMMERCIAL" the most room of the four.
    shape: "hexagon",
  },
  {
    eyebrow: "FAMILY-RUN",
    lineOne: "LOCALLY",
    lineTwo: "OWNED",
    shape: "chevron",
  },
] as const;

/**
 * How many times the four badges repeat to form ONE marquee set.
 *
 * The track holds two identical sets and slides by exactly -50%, which
 * lands on a frame pixel-identical to the start — that is what makes the
 * loop seamless. For it to also look continuous, a single set has to be
 * at least as wide as the viewport, or a bare gap crosses the screen once
 * per cycle.
 *
 * Sized so a desktop viewport shows SIX badges — the four distinct ones
 * and then the cycle starting again, which is the effect the reference
 * design has. That drives the badge height (lg:h-44) and the gap
 * (lg:gap-20) together: at 176px tall the badge is ~152px wide, so with
 * an 80px gap the pitch is ~232px and 1440/232 ≈ 6.2. The 0.2 is
 * deliberate — a badge clipped at the edge is what tells a reader the
 * strip is moving. Exactly six would read as a static row.
 *
 * REPEATS then only has to make ONE set wider than the widest viewport,
 * because the track holds two sets and slides by exactly -50%. Bigger
 * badges need fewer copies to get there:
 *
 *   badge size      pitch    4 badges   REPEATS   set width
 *   h-32 (old)      159px      636px       5       3172px
 *   h-44 (current)  232px      928px       3       2784px   ← covers 2560
 *
 * So scaling the badges up REDUCED the DOM: 40 badges to 24.
 *
 * Raising this costs nothing in bytes — the badges are inline SVG, so
 * there are no requests at any count — but each badge is ~12 SVG nodes
 * and the track renders TWO sets. Do not raise it without a viewport
 * that actually needs it.
 */
const MARQUEE_REPEATS = 3;

const MARQUEE_SET: ReadonlyArray<TrustBadgeProps> = Array.from(
  { length: MARQUEE_REPEATS },
  () => EBS_TRUST_BADGES
).flat();

export interface TrustBadgesWrapperProps {
  id?: string;
  className?: string;
  badges?: ReadonlyArray<TrustBadgeProps>;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function TrustBadgesWrapper({
  /*
    Defaults on THIS root rather than being wrapped in a <section id> by
    the builder — wrapping a component that already defaults its own id
    emits the anchor twice (root §6.6.1 direction 1), which is a bug this
    page has hit before with #services and #home-contact.
  */
  id = "trust-badges",
  className,
  badges = EBS_TRUST_BADGES,
  trackingSection = "trust-badges",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "home",
}: TrustBadgesWrapperProps) {
  // Rebuild the repeated set if a caller overrides `badges`; the
  // module-level MARQUEE_SET only covers the default four.
  const set =
    badges === EBS_TRUST_BADGES
      ? MARQUEE_SET
      : Array.from({ length: MARQUEE_REPEATS }, () => badges).flat();

  return (
    <section
      id={id}
      className={[
        "w-full overflow-hidden bg-default-background py-12 md:py-16",
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
      {/*
        The track is a plain 100%-width block inside an overflow-hidden
        section — deliberately NOT `w-screen`, which ignores the scrollbar
        and would add ~15px of horizontal document overflow on desktop.
        This page already carries one overflow bug at ~820px; it does not
        need a second.

        aria-hidden on the whole track: it renders 24 badges, so a screen
        reader would otherwise announce each claim six times. The sr-only
        list below carries them exactly once.
      */}
      <div
        className={[
          "flex w-max",
          "animate-[ebs-badge-marquee_45s_linear_infinite]",
          // Let a reader stop it to actually look at one.
          "hover:[animation-play-state:paused]",
          // Degrades to a static row — the layout is identical, it simply
          // stops moving, so nothing breaks for reduced-motion users.
          "motion-reduce:animate-none",
        ].join(" ")}
        aria-hidden="true"
      >
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            /*
              Trailing padding equal to the gap, so the space between the
              last badge of one set and the first of the next matches the
              interior spacing. Without it the seam shows as a tight join
              once per cycle — the loop would still be technically
              seamless, just visibly irregular.
            */
            className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12 lg:gap-20 lg:pr-20"
          >
            {set.map((badge, i) => (
              <TrustBadge
                key={`${setIndex}-${i}-${badge.lineOne}`}
                {...badge}
                className="h-28 w-auto shrink-0 md:h-36 lg:h-44"
              />
            ))}
          </div>
        ))}
      </div>

      {/* The accessible copy of the strip: each claim announced once. */}
      <ul className="sr-only">
        {badges.map((badge) => (
          <li key={badge.lineOne}>
            {badge.label ??
              [badge.eyebrow, badge.lineOne, badge.lineTwo]
                .filter(Boolean)
                .join(" ")}
          </li>
        ))}
      </ul>
    </section>
  );
}
