"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * EBS — Home Hero
 *
 * Fully wrapper-authored: no Subframe parent is consumed. The previous
 * hero wrapped Updatedherowithoffers (video background + floating offer
 * cards + a mobile offer section); that whole composition was removed and
 * rebuilt as an image-backed statement hero — eyebrow, title, caption,
 * one CTA — per the York-style reference layout.
 *
 * TRACKING does not depend on hydration: view_section is opt-in via
 * data-track-view, handled by the vanilla observer in Layout.astro (§8.2
 * Mechanism A), and the CTAs are plain <a> elements caught by the global
 * click bridge (§8.1). Both work off server-rendered DOM.
 *
 * This section IS hydrated: index.astro renders the whole page builder
 * with client:load (§9.11's caveat). Anything that mutates these anchors
 * from outside React — e.g. a Google forwarding-number patch — must
 * therefore reapply AFTER hydration, not just on DOMContentLoaded.
 *
 * NOTE: this file used to be deliberately hook-free, which left open the
 * option of later rendering it as a zero-JS island to keep the LCP element
 * off the hydration path. The background carousel below spends that
 * option. It is still hydrated only because its PARENT is; nothing here
 * needs to run before first paint.
 */

/**
 * Background slides. The FIRST entry is the LCP element and is the only
 * one server-rendered — see useHeroCarousel for why that matters.
 *
 * Only genuinely-EBS photography belongs here. The ebs-gallery-* files are
 * NOT candidates: despite their filenames they are still the previous
 * client's tree-service photos (gallery-6 even carries a rival logo
 * watermark), left over from the fork.
 */
const HERO_SLIDES = [
  "/images/edstree-hero-1.jpg",
  "/images/edstree-hero-2.jpg",
  "/images/edstree-hero-3.jpg",
] as const;

/**
 * Delay before slides 2..n are fetched.
 *
 * The point is to be comfortably clear of LCP, not to be as late as
 * possible. Raising this to ~10s makes the carousel effectively invisible:
 * most visitors scroll or leave first, so nobody ever sees a transition
 * and the extra bytes buy nothing. 2.5s clears the LCP window on this
 * template while still letting the first transition land while a reader is
 * plausibly still looking at the hero.
 */
const PRELOAD_AFTER_MS = 2500;
const SLIDE_INTERVAL_MS = 6000;

const PHONE_HREF = CLIENT.contact.phoneTel;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

/**
 * Drives the hero background carousel without costing anything at load.
 *
 * The load-bearing detail is that this returns `ready: false` on the
 * server and on first client render, and the caller renders ONLY slide 1
 * until it flips. React 19's SSR emits a
 * `<link rel="preload" as="image">` for every <img> it renders that lacks
 * loading="lazy" (root §9.13) — so an <img> for slides 2..n present in the
 * server HTML would be fetched at HIGHEST priority, competing directly
 * with the LCP image for bandwidth. Keeping them out of the server output
 * entirely is what makes them free, and it is why `loading="lazy"` is not
 * a substitute: these slides sit IN the viewport (stacked, faded out), and
 * browsers fetch in-viewport lazy images anyway.
 *
 * Slides are decoded off-document via new Image() + decode() before being
 * mounted, so a transition never reveals a half-painted frame.
 */
function useHeroCarousel(slides: readonly string[], sectionRef: React.RefObject<HTMLElement | null>) {
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  /*
    Bumped on every slide change, including a manual pick of the slide
    already showing. The progress ring is keyed on it, so remounting is
    what restarts the ring animation — a CSS transition cannot, because on
    first mount there is no previous value to animate from.
  */
  const [cycle, setCycle] = useState(0);

  const inViewRef = useRef(true);
  const intervalRef = useRef(0);

  const advanceTo = useCallback((next: number | ((i: number) => number)) => {
    setIndex((i) => (typeof next === "function" ? next(i) : next));
    setCycle((c) => c + 1);
  }, []);

  const startInterval = useCallback(() => {
    window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      // Don't advance through frames nobody is looking at.
      if (document.hidden || !inViewRef.current) return;
      advanceTo((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
  }, [advanceTo, slides.length]);

  /** Manual pick — restarts the dwell so the choice gets a full cycle. */
  const goTo = useCallback(
    (i: number) => {
      advanceTo(i);
      startInterval();
    },
    [advanceTo, startInterval]
  );

  useEffect(() => () => window.clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (slides.length < 2) return;

    // Never spend a visitor's data against their stated preference.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const frugal = Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (reduceMotion || frugal) return;

    let cancelled = false;

    // "Still on screen?" — if the visitor scrolled past the hero before the
    // timer fired, the slides are never fetched at all. Held in a ref so the
    // interval callback reads the live value rather than a stale closure.
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    const timer = window.setTimeout(async () => {
      if (cancelled || !inViewRef.current) return;

      await Promise.all(
        slides.slice(1).map((src) => {
          const img = new Image();
          img.src = src;
          // A decode failure must not deadlock the carousel.
          return img.decode().catch(() => undefined);
        })
      );
      if (cancelled) return;

      setReady(true);
      startInterval();
    }, PRELOAD_AFTER_MS);

    return () => {
      cancelled = true;
      io.disconnect();
      window.clearTimeout(timer);
      window.clearInterval(intervalRef.current);
    };
  }, [slides, sectionRef, startInterval]);

  return { index, cycle, ready, goTo };
}

export interface HeroWrapperProps {
  id?: string;
  className?: string;

  /** Anchor the CTA points at. Defaults to the home contact form. */
  quoteHref?: string;

  eyebrow?: string;
  title?: React.ReactNode;
  caption?: React.ReactNode;
  ctaLabel?: string;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/**
 * Google "G" and the rating star, as INLINE SVG rather than image files.
 *
 * Deliberate: every <img> this hero renders server-side gets an automatic
 * `<link rel="preload" as="image">` from React 19 at highest priority
 * (root §9.13), competing with the LCP image. A trust badge is not worth
 * a critical-path fetch. Inline SVG costs one network request of zero.
 */
function GoogleGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function RatingStar({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

/**
 * Google rating badge, sat beside the hero CTA.
 *
 * Both figures come from CLIENT.reviews so there is ONE source of truth —
 * this badge and TrustHeadlineRatingsWrapper cannot drift apart, and
 * correcting the count is a single config edit.
 *
 * The COUNT is rendered alongside the rating, never a bare "5.0★". With a
 * small number of reviews an unqualified star average overstates the
 * evidence behind it; showing "5.0 · N Google reviews" is the honest form
 * and is the standing decision recorded in client.config.ts.
 *
 * No reviewer avatars: the only avatar files in public/images are carried
 * over from the previous client, so they depict people who never reviewed
 * EBS. Placeholder faces beside a real rating read as real reviewers.
 *
 * Shape is a PILL while the CTA beside it is a hard square block, and that
 * contrast is deliberate: the CTA is the action, this is evidence. Giving
 * them the same shape would make this read as a second, competing button.
 * It also matches the reference badge.
 */
function GoogleRatingBadge({
  href,
  tracking,
}: {
  href: string;
  tracking: Record<string, string | undefined>;
}) {
  // trustBadge bundles the glyph ("5.0★"); the star is drawn as SVG here,
  // so strip everything that is not part of the number.
  const rating = CLIENT.reviews.trustBadge.replace(/[^\d.]/g, "");
  const count = CLIENT.reviews.reviewCount;
  if (!rating && !count) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-4",
        "text-sm shadow-lg ring-1 ring-black/5",
        "transition-shadow duration-200 hover:shadow-xl",
        "md:px-7 md:py-5 md:text-base",
      ].join(" ")}
      aria-label={`Rated ${rating} on Google from ${count}. Opens Google in a new tab.`}
      data-event="click_cta"
      data-label="hero-google-rating"
      {...tracking}
    >
      <GoogleGlyph className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
      <RatingStar className="h-4 w-4 shrink-0 md:h-[18px] md:w-[18px]" />
      <span className="font-semibold text-neutral-900">{rating}</span>
      <span aria-hidden="true" className="h-4 w-px bg-neutral-300" />
      <span className="whitespace-nowrap text-neutral-600">{count}</span>
    </a>
  );
}

function SolidPhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.95 21c-2.08 0-4.74-.85-7.42-2.41-2.57-1.49-4.99-3.61-6.81-5.97C3.86 10.21 2.96 7.88 3 6.04c.02-1 .73-1.87 1.7-2.06l2.67-.53c.88-.18 1.75.27 2.15 1.07l1.24 2.49c.33.66.22 1.45-.27 2l-1.26 1.42a.75.75 0 0 0-.09.92c.78 1.19 1.77 2.27 2.95 3.22 1.16.94 2.41 1.7 3.71 2.28a.75.75 0 0 0 .89-.2l1.18-1.39c.52-.61 1.38-.84 2.13-.57l2.61.94c.88.32 1.41 1.22 1.28 2.15l-.38 2.71A2.12 2.12 0 0 1 19.95 21Z" />
    </svg>
  );
}


export default function HeroWrapper({
  id,
  className,
  quoteHref = "#home-contact",
  eyebrow = "WHAT WE DO",
  title = "Same-day tree removal, done safely",
  caption = `From tree removal and trimming to stump grinding and storm clean-up — ${CLIENT.business.name} keeps your property safe and clear across ${CLIENT.geo.serviceArea}. Bonded and insured, with free estimates.`,
  ctaLabel = "Get a Free Estimate",
  trackingSection = "hero",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "home",
}: HeroWrapperProps) {
  /*
    Tracking context shared by every tracked element in this section.
    Spread rather than retyped per element (matching the template's
    HeroWrapper) so a partial attribute set — which the click bridge
    would still fire, just without the context needed for analytics
    joins — is hard to write by accident. Root §8.6, §13.3.5.
  */
  const ctaTracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  const sectionRef = useRef<HTMLElement | null>(null);
  const { index, cycle, ready, goTo } = useHeroCarousel(HERO_SLIDES, sectionRef);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={["relative w-full overflow-hidden", className].filter(Boolean).join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* Background slides, stacked and cross-faded.

          Slide 0 is wrapper-authored so the LCP hint is ours to set
          (§7.1 ceiling / §9.13) — never loading="lazy" on it. Slides 1..n
          are omitted until `ready`, which keeps them out of the server
          HTML and therefore out of React 19's automatic preload set; see
          useHeroCarousel. They are already decoded by the time they mount,
          so they fade in without a flash. */}
      {HERO_SLIDES.map((src, i) => {
        const isLcp = i === 0;
        if (!isLcp && !ready) return null;

        return (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            {...(isLcp ? { fetchPriority: "high" as const } : {})}
            decoding="async"
            className={[
              "absolute inset-0 h-full w-full object-cover object-center",
              "transition-opacity duration-1000 ease-in-out",
              i === index ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        );
      })}

      {/* Scrim: heavier on the left where the copy sits, so the photo stays
          readable on the right. Second layer lifts contrast on mobile,
          where the copy spans the full width. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/25"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/25 md:bg-transparent" aria-hidden="true" />

      {/* Content — taller than the reference layout per request.

          The md+ top padding carries the fixed navbar's clearance on top of
          the section's own 8rem. The photo above deliberately runs to y=0
          behind the resting bar; only the COPY needs to clear it, so the
          clearance is padding here rather than a spacer above the section —
          a spacer would push the photo down and lose the effect.

          It is md-only because the bar is only fixed at >=768px; below that
          the mobile header is still in normal flow (see NavbarMainWrapper).
          The stack is justify-center, so on a tall viewport this mostly
          re-centres slightly lower; its real job is guaranteeing clearance
          on short viewports, where lg:min-h-[92vh] can leave the centred
          block close to the top. */}
      <div
        className={[
          "relative z-10 mx-auto flex w-full max-w-[1280px] flex-col justify-center",
          "min-h-[700px] px-6 py-24",
          "md:min-h-[880px] md:px-10 md:py-32",
          "md:pt-[calc(8rem+var(--site-nav-clearance))]",
          "lg:min-h-[92vh]",
        ].join(" ")}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
          {eyebrow}
        </p>

        <h1 className="mt-4 max-w-[18ch] font-heading-1 text-4xl font-bold leading-[1.08] text-white md:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-white/90 md:text-lg">
          {caption}
        </p>

        {/*
          Split CTA — reads as ONE button, is TWO anchors.

          It cannot be a single element: the two halves have different
          destinations (#home-contact vs tel:) and fire different events
          (click_cta vs click_call), and one <a> carries one href. Joining
          them visually costs nothing and keeps tracking exactly as it was —
          each half still carries its own data-event/data-label plus the
          full shared context.

          The seam between them is a real hit-target boundary, so each half
          hovers independently: that is deliberate affordance, not an
          oversight. Do not move the hover to the shared container.
        */}
        {/* CTA row. Column on mobile so the rating badge sits UNDER the
            button rather than beside it — side by side there would squeeze
            both on a 390px viewport. Row from md up.

            md:items-stretch, not items-center: the CTA is text-lg and the
            badge text-base, so their natural heights differ by 4px and
            centring leaves the two blocks visibly mismatched. Stretching
            makes the badge adopt the CTA's height; its own inline-flex
            items-center keeps the contents centred inside it. */}
        <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-stretch">
          <div className="inline-flex items-stretch bg-brand-primary">
            <a
              href={quoteHref}
              className={[
                "inline-flex items-center px-6 py-4 text-sm font-semibold uppercase",
                "tracking-wide text-white transition-colors duration-200",
                "hover:bg-brand-primary-hover",
                "md:px-8 md:py-5 md:text-lg",
              ].join(" ")}
              data-event="click_cta"
              data-label="hero-primary-contact-now"
              {...ctaTracking}
            >
              <span>{ctaLabel}</span>
            </a>

            {/* Divider. Decorative only — aria-hidden so it is not announced
                as content between two links. */}
            <span aria-hidden="true" className="w-px self-stretch bg-white/30" />

          {/*
            Call CTA — icon-only by design request.

            Qualified-call (60s) eligibility depends on WHICH swap mechanism
            the container uses. Root §8.9 describes only the first:

            · AUTOMATIC text-node swap — matches the configured number as
              VISIBLE RENDERED TEXT. This button renders none, so it is
              invisible to that mechanism and degrades to click_call /
              SECONDARY tap only. href and aria-label do not count.
            · phone_conversion_callback — Google hands the forwarding
              number to a JS callback as mobile_number, and we assign it to
              any element we like, text or not. The call still routes
              through the GFN, so Google telephony still measures duration
              server-side. This button IS eligible under that mechanism.

            EBS has no container yet, so neither is live. When one is built,
            prefer the callback: it is the only path that covers this button
            AND the conditionally-mounted call bar in NavbarMainWrapper.
            See client CLAUDE.md §3.6 for the implementation contract.

            Either way, do NOT "fix" this by hiding a number with sr-only —
            hidden text is invisible to the automatic swap and does nothing
            for the callback path either. It would only fake coverage.
          */}
            <a
              href={PHONE_HREF}
              className={[
                "inline-flex shrink-0 items-center justify-center px-5 text-white",
                "transition-colors duration-200 hover:bg-brand-primary-hover",
                "md:px-6",
              ].join(" ")}
              data-event="click_call"
              data-label="hero-call-icon"
              {...ctaTracking}
              aria-label={`Call now ${DISPLAY_PHONE}`}
            >
              <SolidPhoneIcon className="h-5 w-5 md:h-6 md:w-6" />
            </a>
          </div>

          <GoogleRatingBadge href={CLIENT.contact.mapsUrl} tracking={ctaTracking} />
        </div>
      </div>

      {/*
        Slide indicators — progress bars, bottom-centre per the reference.

        Rendered only once `ready`, which is deliberate: on a visit where
        the carousel never activates (reduced motion, save-data, or the
        visitor scrolled past before the timer), showing controls for a
        carousel that will never advance would be a lie. Zero markup in the
        server HTML also keeps them off the critical path with the slides.

        The bar is 3px but the button is 32px tall — the hit target is the
        button, not the bar, so these stay tappable on a phone.

        The fill is a scaleX animation rather than a width transition
        because a transition has no previous value to animate from on first
        mount. `key={cycle}` remounts it on every change (including a
        re-pick of the current slide), which is what restarts it.
      */}
      {ready && HERO_SLIDES.length > 1 ? (
        <div
          className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-3 md:bottom-10"
          role="group"
          aria-label="Hero background image"
        >
          {HERO_SLIDES.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className="flex h-8 w-10 items-center justify-center md:w-14"
                aria-label={`Show background image ${i + 1} of ${HERO_SLIDES.length}`}
                aria-current={active ? "true" : undefined}
                data-event="carousel_dot"
                data-label={`hero-slide-${i + 1}`}
                {...ctaTracking}
              >
                <span className="relative block h-[3px] w-full overflow-hidden bg-white/30">
                  {active ? (
                    <span
                      key={cycle}
                      className="absolute inset-y-0 left-0 w-full origin-left bg-brand-primary"
                      style={{
                        animation: `site-hero-progress ${SLIDE_INTERVAL_MS}ms linear forwards`,
                      }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
