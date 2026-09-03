import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * EBS — Service page hero band. Renders on all seven /services/* routes.
 *
 * REBUILT 2026-08-31: the `RatingBadgesTruTemp` Subframe parent was DROPPED
 * and this file now imports only React and CLIENT. Same job as before — a
 * full-bleed per-service photograph with an optional ratings strip along the
 * bottom — with four things fixed that were properties of the parent rather
 * than of this section.
 *
 * 1. THE DARK STRIP CAME FROM THE PARENT, AND IT PAINTED WITH NO CONTENT.
 *    RatingBadgesTruTemp's inner div hardcodes
 *    `bg-neutral-900/40 backdrop-blur-sm`. Because that lives on the
 *    CONTAINER rather than on the badges, it rendered a 48px tinted, blurred
 *    bar across the bottom of every service hero even though
 *    CLIENT.reviews.platforms is [] and zero badges existed. It was not the
 *    overlay — that was removed separately — and it could not be removed by
 *    passing bg-transparent, because the class sits on an inner element the
 *    wrapper could only reach by fighting it. Root §7.1: className restyles,
 *    it does not restructure.
 *
 *    Now the scrim belongs to the badges: it renders ONLY when there are
 *    badges to make legible, so an empty ratings list produces an
 *    uninterrupted photograph instead of an empty bar.
 *
 * 2. FIVE ARBITRARY-VARIANT OVERRIDES DELETED. The old className carried
 *    `[&>div]:w-full`, `[&>div]:justify-center`, `[&>div]:px-6`,
 *    `md:[&>div]:px-10`, `[&>div]:py-5` and `md:[&>div]:py-6` — every one of
 *    them existing solely to force the parent's centred, gap-1 column into a
 *    full-width band. Root §7.8's CONFLICT case: the parent's own layout was
 *    being replaced wholesale, so the fix was to stop using it.
 *
 * 3. THE `mobile:` BREAKPOINT IS GONE. The parent stacked at Subframe's
 *    `mobile:` breakpoint while every other section on this site switches at
 *    768px (`md:`). That mismatch left the band changing shape at a
 *    different width from the page around it.
 *
 * 4. IT NOW EMITS TRACKING. This section previously received NO props at all
 *    from ServicePageBLDR and emitted no data-section — it was invisible to
 *    analytics on all seven service pages. Rebuilding it makes it a
 *    generated section, and generated sections carry the full contract
 *    (redesign handoff §2). Exactly the BusinessStatisticsWrapper precedent
 *    (client §3.7): that also gained tracking on rebuild, and the note there
 *    applies here too — this CREATES a new series rather than restoring a
 *    lost one, which is worth doing now because the cost of adding it after
 *    traffic exists is a permanent gap. Free today: EBS has no container.
 *
 * ⚠️ THE RATINGS STRIP IS DELIBERATELY STILL EMPTY, and that is not an
 * oversight to fix in passing. It reads CLIENT.reviews.platforms, which is
 * `[]`. It would be trivial to point it at CLIENT.reviews.trustBadge /
 * reviewCount ("5.0★", "3 Google reviews") — and that is exactly why it does
 * not. Those two values are the subject of an OPEN, WRITTEN DISAGREEMENT:
 * the CLAIMS REGISTER bans "any star rating, review count, or
 * aggregateRating" while client.config.ts documents them as a deliberate
 * restoration. Wiring them here would push a contested star claim onto seven
 * more routes and quietly settle an argument that is Ryan's to settle. When
 * it is settled, populate `platforms` (or pass `ratings`) and the strip
 * appears with no code change.
 *
 * No hooks, no "use client", no @subframe/core — this section ships zero
 * client JS, and view_section is Mechanism A (root §8.2).
 */

export interface RatingItem {
  label: string;
  value: string;
  note?: string;
}

export interface ServiceONEHeroWithRatingsWrapperProps {
  id?: string;
  className?: string;

  /** Per-service photo. Supplied by ServicePageBLDR from servicePageData. */
  backgroundImage?: string;
  /** Describes the photo. "" marks it decorative. */
  imageAlt?: string;
  /**
   * Scrim over the whole photo. DEFAULTS TO NONE as of 2026-08-31, by
   * request ("just remove the overlay for now, I'll fix it later"). The prop
   * is kept rather than deleted precisely because that is a "for now" —
   * re-enabling is passing a class again, not rebuilding the layer. Empty
   * renders no element at all, not a transparent one.
   *
   * ⚠️ Distinct from the badge scrim below, which is narrow, bottom-anchored
   * and tied to the badges' legibility. Turning this back on does not
   * duplicate that, and vice versa.
   */
  overlayClassName?: string;

  heightClassName?: string;

  /**
   * OVERLAY CONTENT, added 2026-09-01.
   *
   * `title` renders as the page's <h1>. Service pages had ZERO h1 before
   * this — TitleBlock1_1, which used to sit above this band, rendered a
   * <span> — so this closes a real gap on all seven routes rather than
   * moving a heading around.
   *
   * Per-service by data: ServicePageBLDR composes it from
   * `servicePageData[*].headingTitle`. That field and `headingSubtitle` had
   * just been left with NO READER when the title block was removed; they
   * are read again here rather than adding a third near-duplicate title
   * field to ServicePageData.
   *
   * Passing no `title` renders NO overlay content and no scrim — the band
   * degrades to the bare photograph it was before, rather than to an empty
   * navy rectangle.
   */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Small capability line under the subtitle. Omit to render nothing. */
  capabilities?: readonly string[];
  /** Cleared-claim chips along the bottom of the overlay. */
  assurances?: readonly string[];

  ratings?: readonly RatingItem[];

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/** Assurance tick. Inline SVG rather than an icon font or an <img>:
 *  invisible to React 19's preload pass (root §9.13) and it inherits
 *  currentColor, so it re-skins with the chip. */
function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 text-brand-secondary"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * One badge. White at 95% rather than solid so the photograph reads faintly
 * through it, which is what stops a row of these looking like paper stuck
 * onto the picture.
 */
function RatingBadge({ label, value, note }: RatingItem) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl text-center",
        "bg-white/95 shadow-[0_2px_10px_rgba(23,41,58,0.18)]",
        "min-w-[104px] px-3 py-2",
        "md:min-w-[140px] md:px-4 md:py-3",
      ].join(" ")}
    >
      {/* text-default-font, not neutral-900: this is client-customised
          neutral and belongs on the token (root §4.5's C2 pattern). */}
      <div className="w-full truncate text-sm font-semibold text-default-font">
        {label}
      </div>
      <div className="text-lg font-bold text-brand-primary md:text-xl">
        {value}
      </div>
      {note ? (
        <div className="w-full truncate text-[11px] text-neutral-600 md:text-xs">
          {note}
        </div>
      ) : null}
    </div>
  );
}

export default function ServiceONEHeroWithRatingsWrapper({
  id,
  className,
  /*
    NO DEFAULT PATH. This previously defaulted to "/images/services-bg.jpg",
    which does not exist in public/images/ — so every one of the seven
    service pages shipped a broken <img>, and React 19's SSR preloaded the
    404 at high priority on each. The photo is per-service data now
    (servicePageData[*].heroImage), and an absent value renders NO <img>
    rather than a broken one — the same degrade-don't-render-blank rule
    client §3.5 applies to the empty coupon path.
  */
  backgroundImage = "",
  imageAlt = "",
  /*
    NAVY SCRIM, on by default as of 2026-09-01 (it was "" — see the prop's
    note above, which recorded the removal as a "for now"). This is that
    later.

    ⚠️ WHY TWO LAYERS. The flat tint is what guarantees contrast; the
    gradient only adds depth. A gradient ALONE fails in the middle of the
    band, which is exactly where the h1 sits. The flat layer is the floor.

    ⚠️ WHY 72% AND NOT LESS. White over `default-font` navy (#17293A) at 72%
    composited on a WORST-CASE pure-white patch of photograph measures
    ~5.98:1. At 65% it drops to ~4.78:1 — still AA for normal text, but with
    no margin at all, and a hero photo is the one surface whose backdrop is
    not known in advance. Do not thin this below 70% without re-sampling
    actual PIXELS behind the text; getComputedStyle cannot see through
    composited layers over an image and will happily report the scrim's own
    colour as if the photo were not there.
  */
  overlayClassName = "bg-default-font/72",
  heightClassName = "h-[420px] md:h-[520px]",
  title,
  subtitle,
  capabilities,
  assurances,
  ratings,
  trackingSection = "service-hero",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "service",
}: ServiceONEHeroWithRatingsWrapperProps) {
  const items: readonly RatingItem[] =
    ratings?.length ? ratings : CLIENT.reviews.platforms;

  // Mobile shows only the first three; a fourth badge overflows 360px.
  const mobileItems = items.slice(0, 3);

  return (
    <section
      id={id}
      className={["w-full", className].filter(Boolean).join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className={["relative w-full overflow-hidden", heightClassName].join(" ")}>
        {/* Background photo, per service.

            loading="eager" is deliberate and must NOT be changed to lazy:
            this band sits directly under the title block and is the largest
            element above the fold on a service page, so it is the LCP
            candidate. React 19 preloading it (root §9.13) is the correct
            behaviour HERE, unlike every other image on the site.

            object-cover on a ~3.4:1 band crops hard vertically — see the
            per-file aspect notes in servicePageData.tsx. */}
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
          />
        ) : null}

        {/* Full-photo scrim. Rendered only when there is overlay content to
            make legible — a scrim over a bare photograph is just a darker
            photograph. Same conditional-on-content rule the ratings strip
            below follows, and the same reason. */}
        {title && overlayClassName ? (
          <>
            <div
              aria-hidden="true"
              className={["absolute inset-0", overlayClassName].join(" ")}
            />
            {/* Depth only. Never the contrast floor — see overlayClassName. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-default-font/35 via-transparent to-default-font/45"
            />
          </>
        ) : null}

        {/* ── Overlay content ────────────────────────────────────────────
            Centred, matching the supplied reference. `relative` lifts it
            above both scrim layers; `h-full` + flex centring keeps it
            vertically centred at every band height.

            ⚠️ CLAIMS. The reference's three chips were "24 Hour Estimates",
            "No Upfront Costs" and "Licensed & Insured". Only the THIRD is
            cleared. "24 Hour Estimates" is a response-time promise and sits
            directly against the register's MUST-NOT-SHIP ban on 24-7 /
            emergency / after-hours copy; "No Upfront Costs" is a
            payment-terms promise that appears nowhere in the intake or
            config. Both are OPERATIONS CLAIMS — the category that exists
            because they read as tone while being enforceable. The
            replacements passed by ServicePageBLDR are all cleared. */}
        {title ? (
          <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center md:px-10">
            <h1
              className={[
                "max-w-[22ch] font-heading-1 font-bold uppercase text-white",
                "text-[clamp(1.75rem,4.4vw,3.25rem)] leading-[1.08] tracking-[0.01em]",
                "[text-shadow:0_2px_18px_rgba(23,41,58,0.55)]",
              ].join(" ")}
            >
              {title}
            </h1>

            {capabilities?.length ? (
              /* ⚠️ FLEX-WRAP, NOT INLINE TEXT — and that is a bug fix, not a
                  preference. Written first as one <p> with the items and
                  <span>&bull;</span> separators concatenated, it rendered as a
                  SINGLE UNBREAKABLE WORD on mobile and was clipped at both
                  edges of the 390px viewport. The separators carried mx-2
                  margins but no actual whitespace CHARACTER between the text
                  nodes, and margins do not create line-break opportunities —
                  only whitespace does. Each capability is its own flex item
                  here, so wrapping needs no whitespace at all.

                  ⚠️ It did NOT show up as horizontal overflow: the hero
                  container is overflow-hidden, so document.scrollWidth read a
                  clean 390 while the line was visibly cut off. Found by
                  LOOKING at a screenshot, not by measuring. Bullets are
                  aria-hidden decoration — a screen reader should read the
                  list, not "roofing bullet siding bullet gutters". */
              <ul className="mt-4 flex max-w-[46ch] flex-wrap items-center justify-center text-sm font-semibold uppercase tracking-[0.14em] text-white/90 md:text-base">
                {capabilities.map((c, i) => (
                  <li key={c} className="flex items-center">
                    {i > 0 ? (
                      <span aria-hidden="true" className="mx-2 text-brand-secondary">
                        &bull;
                      </span>
                    ) : null}
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}

            {subtitle ? (
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-white/90 md:text-lg">
                {subtitle}
              </p>
            ) : null}

            {assurances?.length ? (
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-4">
                {assurances.map((a) => (
                  <li
                    key={a}
                    className={[
                      "inline-flex items-center gap-2 rounded-full",
                      "border border-white/25 bg-white/10 px-3.5 py-1.5",
                      "text-xs font-semibold uppercase tracking-[0.08em] text-white",
                      "md:text-sm",
                    ].join(" ")}
                  >
                    <CheckMark />
                    {a}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {/* Ratings strip. The whole block — scrim included — is conditional
            on there being badges, which is the fix described in the header:
            no badges, no bar, just the photograph.

            The scrim is a bottom-anchored gradient rather than a flat tint
            across a fixed-height bar. A flat tint has a visible top edge
            wherever it stops; a gradient fades out and reads as light
            falling off, so the badges get their legibility without drawing a
            band across the picture. It is taller than the badges for that
            reason and is decorative, hence aria-hidden. */}
        {items.length ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 via-black/25 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 px-6 py-5 md:px-10 md:py-6">
              {/* Mobile: three badges. */}
              <div className="flex justify-center gap-3 md:hidden">
                {mobileItems.map((r) => (
                  <RatingBadge key={`${r.label}-${r.value}`} {...r} />
                ))}
              </div>
              {/* Desktop: all of them. */}
              <div className="hidden justify-center gap-6 md:flex lg:gap-12">
                {items.map((r) => (
                  <RatingBadge key={`${r.label}-${r.value}`} {...r} />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
