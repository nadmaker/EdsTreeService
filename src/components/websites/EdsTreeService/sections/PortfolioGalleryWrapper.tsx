"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";
import ChevronBand from "./ChevronBand";

/**
 * EBS — Portfolio gallery.
 *
 * Third revision. Carousel → mosaic grid (2026-08-27) → CSS masonry
 * (2026-08-28) → CENTER-FOCUS CAROUSEL (2026-08-28, this one), to a
 * reference Ryan supplied. Consumed by EBS-Home and EBS-Contact.
 *
 * WHY THIS SHAPE. Masonry gave every photo its exact native aspect and
 * therefore varied tile heights — a ragged, scrapbook edge that read as
 * unserious. The brief is the opposite: every photo trimmed to the SAME
 * rectangle by its viewport, with the frames doing the composing rather
 * than the photographs. So each slide is a fixed 16:10 window and the
 * image is object-cover inside it.
 *
 * The cost, stated plainly: two of the seven files are PORTRAIT (0.75).
 * Covering a 0.75 source into a 1.6 window keeps the full width and
 * discards about 53% of the height, centred. On ebs-gallery-1 that is a
 * roofer at work, so check that the crop has not cut the subject in half
 * before shipping — object-position is the lever if it has. This is the
 * trade the uniform-rectangle brief buys; masonry was the version that
 * cropped nothing.
 *
 * HYDRATION RETURNS, deliberately. The previous two revisions ran on zero
 * client JS. Arrows, dots and active-slide emphasis cannot, so this file
 * is "use client" again. Kept as cheap as possible: the track is native
 * CSS scroll-snap, so touch swipe costs nothing and the JS only reads
 * scroll position and writes an index.
 *
 * view_section stays on Mechanism A (`data-track-view`). Root §8.2's
 * "Mechanism B when it hydrates anyway" note guards against DOUBLE-firing
 * during a migration; there is no React observer here to double with, and
 * the vanilla one fires earlier off server-rendered DOM. Do not add a
 * useEffect observer alongside it.
 *
 * Photographs are genuinely EBS's as of 2026-08-28 — see GALLERY_IMAGES.
 */

interface GalleryImage {
  src: string;
  alt: string;
  /**
   * Intrinsic pixel dimensions. Still required even though every slide is
   * a fixed-aspect window: they let the browser size the lazy image
   * before its bytes arrive, and they document which files are portrait
   * (and so crop hardest) without opening them.
   */
  w: number;
  h: number;
}

/**
 * The seven photographs selected by the owner, 2026-08-28, replacing the
 * previous client's tree-service photography. A pixel sample reads
 * 0.0-1.7% foliage across the set, against 60.6% for the file
 * ebs-gallery-6 used to be.
 *
 * ⚠️ THREE ALSO RENDER IN THE HERO on the home page: ebs-hero-poster
 * (slide 1, the LCP element), ebs-hero-2-roof-replacement and
 * ebs-hero-3-commercial-siding are HeroWrapper's background carousel, so
 * a visitor to `/` meets them twice. Explicitly requested, not an
 * oversight — deleting the last three entries leaves a four-photo gallery
 * of images that appear nowhere else. No extra download either way: the
 * hero has already fetched them and these tiles are lazy.
 *
 * PORTRAIT sources (w < h) crop hardest in the 16:10 window — noted per
 * entry so the next person does not have to work it out.
 */
const GALLERY_IMAGES: readonly GalleryImage[] = [
  /* ⚠️ GENERATED PLACEHOLDERS until the owner supplies photography (Open
     Item). alt is "" while they are decorative; describe each real photo
     when it lands — these are content, not decoration. */
  { src: "/images/edstree-gallery-1.jpg", alt: "", w: 1200, h: 900 },
  { src: "/images/edstree-gallery-2.jpg", alt: "", w: 1200, h: 900 },
  { src: "/images/edstree-gallery-3.jpg", alt: "", w: 1200, h: 900 },
  { src: "/images/edstree-gallery-4.jpg", alt: "", w: 1200, h: 900 },
  { src: "/images/edstree-gallery-5.jpg", alt: "", w: 1200, h: 900 },
  { src: "/images/edstree-gallery-6.jpg", alt: "", w: 1200, h: 900 },
];

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export interface PortfolioGalleryWrapperProps {
  id?: string;
  className?: string;

  /**
   * The section's ground treatment. ADDED 2026-09-04 so the home page can
   * match ServiceGuaranteeAndFeaturesWrapper without changing /contact, where
   * this wrapper is also mounted.
   *
   *   "page"  (default) — --color-default-background, no texture. /contact.
   *   "paper" — bg-white plus the folded-paper crease sheet and grain, the
   *             same treatment the map section wears. Home.
   *
   * ⚠️ ONE PROP CARRYING BOTH THE COLOUR AND THE TEXTURE, and NOT a
   * `className` override. Two reasons, and both have bitten elsewhere:
   *   · The root merges `[defaults, className]`, so a background passed
   *     through `className` leaves BOTH bg-* utilities in the attribute and
   *     the winner is whichever Tailwind emits later in the stylesheet, not
   *     the one written last — same property, same specificity, no guarantee.
   *     (The `md:pb-14` the home page passes through `className` is safe for
   *     a different reason: `pb-*` and `py-*` are different utilities whose
   *     sort order is stable and was verified in the built CSS.)
   *   · The colour and the texture are not independent. The crease layers are
   *     mix-blend-multiply and need `relative isolate` on this root; the
   *     ground supplies their hue. Splitting them across two props makes it
   *     possible to set one without the other and get a silently wrong band.
   */
  surface?: "page" | "paper";

  /**
   * The bevelled amber chevron band, ADDED 2026-09-04. Independent of
   * `surface` on purpose: it is a foreground object, not a ground, and it
   * would sit on either. Default off; the home page passes it, /contact
   * does not.
   *
   * It is the About band's chevron MIRRORED — vertex pointing left into
   * the section, arms exiting the right edge (sections/ChevronBand.tsx) —
   * placed with its vertex at 68% × 70% of the section (About: 44.5% ×
   * 50%): low enough that the vertex hides behind the centre slide and
   * the arms emerge to its right, and low enough that the upper arm
   * clears the header copy. That clearance is the load-bearing number:
   * the italic lead-in is brand-primary, which is 2.14 on amber, so NO
   * copy may ever sit over the chevron. Measured at the header's bottom:
   * 1440px ≈ 220px of clearance, 1024px ≈ 53px.
   *
   * Below lg the header copy spans the full width (subtitle right edge 366
   * of 390px), so the desktop rule cannot be used there. Instead the box is
   * sized from the section's WIDTH (115%) and sits low, vertex at 72% ×
   * 78%: it emerges from the right edge behind the carousel's lower-right
   * corner and the next-arrow, and the upper arm's ink at the right edge
   * stays ~210px below the header at 390px, ~110px at 768px (stroke edge,
   * not centreline). Same element, `lg:` variants switch the geometry.
   *
   * ⚠️ Turning it on also puts `overflow-hidden` on the root. The chevron
   * box is 130% of the section's height and hangs off the right edge;
   * unclipped it widened the DOCUMENT to 2088px at 1440 and painted into
   * the sections above and below. The carousel is unaffected — the track
   * clips its own overflow.
   */
  chevron?: boolean;

  /** Content */
  titleLeadIn?: string;
  titleEmphasis?: string;
  subtitle?: React.ReactNode;
  images?: readonly GalleryImage[];

  /**
   * Slide centred on load, zero-based. Defaults to 1 — the SECOND photo —
   * by request: the first source is portrait and crops hardest in the
   * 16:10 window, so opening on it is the weakest first impression the
   * set can give. Clamped to the array, so it degrades to slide 0 rather
   * than throwing if `images` is ever shortened past it.
   */
  initialSlide?: number;

  /** CTA */
  ctaHref?: string;
  ctaLabel?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function PortfolioGalleryWrapper({
  id,
  className,
  surface = "page",
  chevron = false,
  titleLeadIn = "See our tree work across",
  titleEmphasis = CLIENT.geo.serviceArea,
  subtitle,
  images = GALLERY_IMAGES,
  initialSlide = 1,
  /*
    ⚠️ These two defaults are REACHABLE and correct — do not "fix" them to
    home-page values. EBS-Contact renders this wrapper with no ctaHref, so
    the default is what /contact uses, and #contact-info-form is that
    page's form anchor. EBS-Home passes ctaHref="#home-contact" explicitly.
    trackingPageType matches the same /contact default. Root §13.3.8.
  */
  ctaHref = "#contact-info-form",
  ctaLabel = "Get a Free Quote",
  trackingSection = "portfolio-gallery",
  // Defaulted so a future call site that forgets the page-level TRACKING
  // spread still lands in city-keyed joins (client §3.7 defect 3).
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "contact",
}: PortfolioGalleryWrapperProps) {
  /*
    Shared context, spread rather than retyped per element — a partial set
    still fires through the click bridge but cannot be joined in
    analytics. Root §8.6, §13.3.5.
  */
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  const trackRef = useRef<HTMLDivElement | null>(null);

  /*
    Clamped once, then used for BOTH the initial dot state and the initial
    scroll position. Those two must agree or the ring lands on one slide
    while the track shows another.
  */
  const startIndex = Math.max(0, Math.min(images.length - 1, initialSlide));
  const [active, setActive] = useState(startIndex);

  /**
   * Distance from one slide's start to the next, MEASURED rather than
   * computed from the vw-based width. The slide width is a viewport
   * percentage set in CSS and the gap comes from a Tailwind class, so
   * re-deriving either in JS would duplicate the source of truth and
   * drift the moment a breakpoint changes. Reading two child rects cannot.
   */
  const stepPx = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const second = track?.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    if (second) return second.offsetLeft - first.offsetLeft;
    return first.getBoundingClientRect().width;
  }, []);

  /* Keep the active dot in step with wherever the track actually is —
     including after a touch swipe, which no button handler sees. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = stepPx();
        if (!step) return;
        const i = Math.round(track.scrollLeft / step);
        setActive(Math.max(0, Math.min(images.length - 1, i)));
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [images.length, stepPx]);

  /*
    Open on `startIndex` rather than slide 0. The track is a scroll
    container, so the opening slide is a SCROLL POSITION, not something a
    render can express — the only way to set it is to move the track once
    layout exists.

    `behavior: "instant"` is load-bearing twice over: the carousel must not
    appear to animate by itself on arrival, and "instant" explicitly
    overrides a CSS `scroll-behavior: smooth`, which a plain `scrollLeft`
    assignment would still obey.

    stepPx() measures two child rects, so it returns 0 until the track has
    been laid out — on a cold load that can be the first frame. Hence the
    bounded rAF retry: without it the gallery silently opens on slide 0
    whenever layout lags, which is the kind of intermittent failure that
    reads as "it works sometimes".

    Runs exactly once, guarded by a ref. Without the guard a later re-render
    could re-run this and yank the track back while the visitor is mid-swipe.
  */
  const hasInitialised = useRef(false);

  useEffect(() => {
    if (hasInitialised.current) return;
    const track = trackRef.current;
    if (!track) return;

    if (startIndex === 0) {
      hasInitialised.current = true; // already there; nothing to move
      return;
    }

    let frame = 0;
    let attempts = 0;

    const place = () => {
      const step = stepPx();
      if (!step) {
        if (attempts++ < 10) frame = requestAnimationFrame(place);
        return;
      }
      hasInitialised.current = true;
      track.scrollTo({ left: startIndex * step, behavior: "instant" });
    };

    place();
    return () => cancelAnimationFrame(frame);
  }, [startIndex, stepPx]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(images.length - 1, i));
      /*
        Plain scrollTo is enough. `scroll-snap-type: x mandatory` is
        sometimes reported to catch a programmatic smooth scroll on an
        intermediate snap point, which would make multi-step jumps land
        short — it does NOT happen here, verified by driving the track to
        its 2039px maximum four ways (instant, smooth with snap on,
        smooth with snap suspended, and scrollIntoView). All four landed
        exactly. Do not add a snap-suspension workaround for it.
      */
      track.scrollTo({ left: clamped * stepPx(), behavior: "smooth" });
    },
    [images.length, stepPx]
  );

  const arrowClass = [
    "flex h-12 w-12 items-center justify-center rounded-full",
    "border border-neutral-200 bg-white text-default-font shadow-md",
    "transition-colors duration-200",
    "hover:border-brand-primary hover:text-brand-primary",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-default-font",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
  ].join(" ");

  const isPaper = surface === "paper";

  /* Both the paper layers (mix-blend-multiply) and the chevron (absolute,
     oversized) need a stacking context of their own on the root; the
     chevron additionally needs the root to CLIP — see the prop comment. */
  const positioned = isPaper || chevron;

  return (
    <section
      id={id}
      className={[
        "w-full",
        // `relative isolate` is not decoration in the paper case — it is what
        // the texture layers below need. They are mix-blend-multiply, so they
        // blend with their BACKDROP; without a stacking context of its own
        // that backdrop is whatever the page painted underneath this section.
        // Same reasoning as ServiceGuaranteeAndFeaturesWrapper's root.
        isPaper ? "bg-white" : "bg-default-background",
        positioned ? "relative isolate" : "",
        chevron ? "overflow-hidden" : "",
        "py-20 md:py-28",
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
      {/* ── FOLDED-PAPER GROUND (paper surface only) ────────────────────────
          The same technique ServiceGuaranteeAndFeaturesWrapper wears: one
          stretched sheet plus grain, both mix-blend-multiply so the black
          fills take their hue from the ground beneath and nothing is frozen
          for a fork. The grain is technical rather than decorative — these
          are very large, very shallow gradients, which 8-bit displays render
          as visible banding without it.

          ⚠️ --site-tex-creases-ALT, DELIBERATELY NOT --site-tex-creases.
          global.css carries three crease arrangements for one stated reason:
          "two sections wearing the identical sheet read as a repeated asset."
          On the home page the map section wears `creases` and sits DIRECTLY
          BELOW this one with no seam between them (both bg-white), and the
          /about-and-now-home FAQ wears `creases-faq`. `creases-alt` is the
          one arrangement unused on this page, and it is only free here
          because TallServicesBenefitsCards — its other consumer — is mounted
          on the service and city routes, never on home. Check that before
          reusing it anywhere else.

          Two identical sheets stacked would not read as one continuous
          surface either: each is background-size 100% 100%, scaled to its own
          section's height, so the pattern restarts at the boundary. */}
      {isPaper && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-creases-alt)] bg-[length:100%_100%] bg-no-repeat opacity-[0.85] mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-grain)] bg-[length:140px] opacity-[0.05] mix-blend-multiply"
          />
        </>
      )}

      {/* ── CHEVRON BAND (opt-in) ─────────────────────────────────────────
          Above the paper layers, below the content (the header, track and
          controls are `relative` and later in DOM, so they stack over it).
          Mirrored: vertex points LEFT and sits at 28% of the box, so
          left-[…%] + -translate-x-[28%] puts it at that % of the section.

          TWO GEOMETRIES, one element. Below lg the box is sized from the
          section's WIDTH (115%) and sits low (72% × 78%); from lg it is
          sized from the HEIGHT (130%) at 68% × 70%. The desktop rule cannot
          simply be un-hidden on phones: 130% of a ~950px-tall section on a
          390px screen makes the arm ~200px thick and fills the whole right
          side with amber. See the prop comment for the copy clearance. */}
      {chevron && (
        <ChevronBand
          mirror
          idPrefix="gallery-chevron"
          className="left-[72%] top-[78%] aspect-square h-auto w-[115%] -translate-x-[28%] -translate-y-1/2 lg:left-[68%] lg:top-[70%] lg:h-[130%] lg:w-auto"
        />
      )}

      {/* Header — CENTRED here, unlike the left-aligned York stack used by
          the hero, services grid and stats band. That is a deliberate
          departure to match the reference: this section is a showcase
          rather than an argument, and centring lets the carousel below
          sit symmetrically under it. */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 text-center md:px-10">
        <h2 className="mx-auto max-w-[22ch] font-heading-1 text-3xl font-bold uppercase leading-[1.12] md:text-5xl">
          {/* Two-tone, mirroring the reference's italic/solid split.

              ⚠️ CORRECTED 2026-09-04. This comment read: "brand-primary
              measures 3.74:1 on this surface — under AA for body text, but
              this is 30px+ bold, which is WCAG large and needs only 3:1. Do
              NOT reuse this pairing at body size." Every number in that was
              the PREVIOUS CLIENT's: 3.74:1 is their blue #1685CC on their
              #F5F8FB, which this fork never had. Ed's brand-primary green is
              5.07:1 on --color-default-background and 5.45:1 on white, so the
              pairing clears AA for BODY text on either ground and the warning
              was discouraging a reuse that is in fact fine. Left as a
              measurement rather than deleted, because the next person to
              wonder should find the answer and not the question. */}
          <span className="italic text-brand-primary">{titleLeadIn} </span>
          <span className="text-default-font">{titleEmphasis}</span>
        </h2>

        <p className="mx-auto mt-6 max-w-[68ch] text-base leading-relaxed text-neutral-600 md:text-lg">
          {subtitle ?? (
            <>
              We would rather show you than tell you. These are recent{" "}
              {CLIENT.vocabulary.tradeName.toLowerCase()} jobs around{" "}
              {CLIENT.geo.serviceArea} —{" "}
              <strong className="font-semibold text-default-font">
                residential and commercial
              </strong>
              , from full replacements to repairs. Every one finished with a{" "}
              <strong className="font-semibold text-default-font">
                clean site
              </strong>
              .
            </>
          )}
        </p>
      </div>

      {/*
        TRACK. Sits OUTSIDE the max-w-[1280px] wrapper on purpose — that is
        what lets the neighbouring slides run off the edges of the screen
        the way the reference does. It is a plain block at 100% of the
        section, so it spans the viewport WITHOUT the horizontal-overflow
        risk that `w-screen` carries (w-screen ignores the scrollbar and
        would add ~15px of overflow on desktop).

        Centring the first and last slide is done with symmetric padding
        of (track − slide) / 2 rather than spacer elements, so there are no
        phantom children for stepPx() to trip over.

        `--slide` is declared once as an arbitrary property and consumed by
        both the padding and the slide width, so the two cannot disagree.
      */}
      <div
        ref={trackRef}
        className={[
          "relative mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth",
          "[--slide:82vw] md:[--slide:58vw] lg:[--slide:46vw]",
          "px-[calc((100%-var(--slide))/2)]",
          // Native swipe stays; the scrollbar itself would be noise here.
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Room for the active slide's shadow, which would otherwise clip.
          "py-6",
        ].join(" ")}
        role="group"
        aria-roledescription="carousel"
        aria-label="Recent work"
      >
        {images.map((image, i) => {
          const isActive = i === active;
          return (
            <figure
              key={image.src}
              className={[
                "w-[var(--slide)] shrink-0 snap-center",
                "transition-all duration-500 ease-out",
                // Centre slide is raised and framed; neighbours sit back.
                isActive
                  ? "scale-100 opacity-100"
                  : "scale-[0.93] opacity-60 md:opacity-70",
              ].join(" ")}
              aria-hidden={isActive ? undefined : "true"}
            >
              <div
                className={[
                  "overflow-hidden rounded-xl bg-neutral-200",
                  // The white frame from the reference, on the active
                  // slide only. ring rather than border so it does not
                  // change the box size and jog the scroll maths.
                  "transition-shadow duration-500",
                  isActive
                    ? "shadow-2xl ring-8 ring-white"
                    : "shadow-md ring-0",
                ].join(" ")}
              >
                {/*
                  THE UNIFORM WINDOW. Every slide is 16:10 and the photo is
                  object-cover inside it — this is the "viewport trims them
                  to rectangles" behaviour. object-center is the default
                  and is what to change if a portrait crops through its
                  subject.
                */}
                <div className="aspect-[16/10] w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.w}
                    height={image.h}
                    /*
                      Load-bearing. Without it React 19's SSR emits a
                      high-priority <link rel="preload"> per image (root
                      §9.13) — seven of them — competing with the hero's
                      LCP element. This section is below the fold on both
                      pages that render it.
                    */
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </figure>
          );
        })}
      </div>

      {/* Controls + CTA, back inside the padded container. */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className={arrowClass}
            aria-label="Previous photo"
            data-event="carousel_prev"
            data-label="portfolio-gallery-prev"
            {...tracking}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots. Buttons rather than decoration — they are the only
              direct way to reach slide 6 without six taps. */}
          <div className="flex items-center gap-2.5">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(i)}
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                  i === active
                    ? "w-7 bg-brand-primary"
                    : "w-2.5 bg-neutral-300 hover:bg-neutral-400",
                ].join(" ")}
                aria-label={`Go to photo ${i + 1} of ${images.length}`}
                aria-current={i === active ? "true" : undefined}
                data-event="carousel_dot"
                data-label={`portfolio-gallery-dot-${i + 1}`}
                {...tracking}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === images.length - 1}
            className={arrowClass}
            aria-label="Next photo"
            data-event="carousel_next"
            data-label="portfolio-gallery-next"
            {...tracking}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={ctaHref}
            className={[
              "inline-flex items-center justify-center",
              "bg-brand-primary px-10 py-4",
              "text-sm font-semibold uppercase tracking-wide text-white",
              "shadow-md transition-colors duration-200 hover:bg-brand-primary-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
            ].join(" ")}
            data-event="click_cta"
            data-label="portfolio-gallery-get-estimate"
            {...tracking}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
