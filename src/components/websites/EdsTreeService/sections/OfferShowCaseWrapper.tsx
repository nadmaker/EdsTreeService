"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PromotionalCarousel } from "@/ui/components/PromotionalCarousel";
import {
  IconWrapper,
  FeatherChevronLeft,
  FeatherChevronRight,
} from "@subframe/core";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

type Offer = {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  /** Tracking suffix for this slide's CTA, e.g. "about-us" -> offers-cta-about-us. */
  ctaLabelSlug: string;
};

export interface OfferShowCaseWrapperProps {
  id?: string;
  className?: string;
  ctaHref?: string;
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

const ANIM_MS = 380;
const AUTOROTATE_MS = 4500;
const PAUSE_AFTER_INTERACTION_MS = 9000;

export default function OfferShowCaseWrapper({
  id,
  className,
  ctaHref = "#landing-contact",
  trackingSection = "hero-offers",
  trackingCity,
  trackingService,
  trackingPageType,
}: OfferShowCaseWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedSectionRef = useRef(false);

  /**
   * THREE SLIDES, ONLY THE FIRST OF WHICH IS AN OFFER.
   *
   * ⚠️ This array previously held three HARDCODED slides, none of them
   * EBS's, on all six city landings:
   *
   *   · "20% Off Your First Service" — a discount EBS does not offer. An
   *     invented price claim is the most costly kind of stale copy on the
   *     site; a visitor can hold the company to it.
   *   · "Pre-Spring Pruning — Returning Customers Get 15% Off All Pruning"
   *     — tree work, and a second invented discount.
   *   · "Dealing with an Emergency? Get a dependable expert immediately" —
   *     emergency framing, which the CLAIMS REGISTER bans outright because
   *     EBS has no emergency line.
   *
   * Slide 1 is now driven by `client.config.ts`, which has been the single
   * source of truth for offers all along (client CLAUDE.md §3.5) — this
   * section simply never read it. Adding an offer there adds a slide here
   * and a card on /offers, with no code change.
   *
   * Slides 2 and 3 are NOT offers and deliberately do not pretend to be.
   * EBS runs one promotion, so inventing two more to fill a three-slide
   * carousel is what produced the two fake discounts above. They are
   * editorial instead: one pointing at the company, one at the work.
   *
   * ⚠️ CLAIMS: every line below is drawn from the CLEARED list only —
   * family-run and locally owned, in business since yearFounded, licensed
   * bonded and insured, residential and commercial, free estimates. No star
   * rating, no review count, no BBB, no trade association, no emergency or
   * 24-7 language, and nothing from the UNVERIFIED CAPABILITIES list
   * (insurance claims, roof cleaning, storm tarping, membrane systems).
   *
   * ⚠️ The year is DERIVED from CLIENT.business.yearFounded, never typed.
   * A hardcoded "20 years" silently rots by one every January.
   */
  const offers: Offer[] = useMemo(() => {
    const offerSlides: Offer[] = CLIENT.offers.items.map((item) => ({
      /* Deliberately a photo NO city hero uses. The six heroes in
         cityLandingData take the other genuine EBS photographs; this section
         renders on the same six pages, so reusing one would put the same
         picture twice on one page — and, because both preload, would
         silently collapse the two preloads into one and mask the duplication
         in a preload audit. */
      image: "/images/edstree-gallery-4.jpg",
      title: item.title,
      subtitle: item.description,
      description: item.badge ? `${item.badge} — FIRST-TIME CUSTOMERS` : undefined,
      ctaLabel: "Get My Free Estimate",
      ctaHref,
      ctaLabelSlug: "free-estimate",
    }));

    return [
      ...offerSlides,
      {
        /* ⚠️ NOT ebs-services-bg.jpg, which is what this slide first used.
           That file and ebs-gallery-6-exterior-project.jpg on slide 1 are
           THE SAME PHOTOGRAPH under two names — different md5 (re-encoded)
           but identical scene, and both happen to be 376,513 bytes. Slides 1
           and 2 rendered the same picture and the thumbnail strip made it
           obvious. A hash check does NOT catch this pair; only looking does.
           ⚠️ Near-duplicate of the Goldsboro hero — same job, different
           angle — so that one route shows two views of one house. */
        image: "/images/edstree-gallery-5.jpg",
        title: `Family-Run Since ${CLIENT.business.yearFounded}`,
        /* "our own crews, start to finish" matches the wording already
           shipping in cityLandingData ("our own crews, OSHA-certified, start
           to finish"). An earlier draft here said "never subcontracted out",
           which is a STRONGER operations claim than anything in the register
           — the register clears family-run and locally owned, not a negative
           promise about subcontracting. Walked back rather than left to be
           discovered. */
        subtitle: `Locally owned and operated out of ${CLIENT.geo.hqCity}, with our own crews on the job start to finish.`,
        description: "LOCALLY OWNED — BONDED & INSURED",
        ctaLabel: "Get a Free Estimate",
        ctaHref,
        ctaLabelSlug: "free-estimate",
      },
      {
        /* ⚠️ REUSES THE WARSAW HERO, so that one route shows this photo
           twice. Accepted knowingly and it is a PHOTO-LIBRARY limit, not a
           design choice: the repo holds seven distinct genuine EBS scenes,
           six are taken by city heroes, and the seventh is the slide-1/
           slide-2 duplicate above. Every other ebs-*.jpg is the previous
           client's (ebs-hero-mobile-bg and ebs-service-area-mobile are
           Medrano's-branded crews; ebs-guarantee-bg carries their
           watermark). Commercial siding is the closest match to this
           slide's residential-and-commercial copy, which is why it is the
           one reused. One-line swap once more photography exists. */
        image: "/images/edstree-gallery-6.jpg",
        title: "Removal, Trimming & Storm Clean-Up",
        subtitle: `Tree removal, trimming, stump grinding and storm clean-up for homes and commercial properties across ${CLIENT.geo.serviceArea}.`,
        description: "RESIDENTIAL & COMMERCIAL",
        ctaLabel: "Our Services",
        /* ⚠️ ROOT-RELATIVE. This section renders on the six city landings,
           where #services does not exist — a bare fragment would scroll
           nowhere, the same dead-anchor bug just fixed in FooterSection. On
           the home page "/#services" is still a same-document navigation, so
           the smooth scroll and --site-nav-clearance scroll-padding behave
           exactly as they do today. */
        ctaHref: "/#services",
        ctaLabelSlug: "services",
      },
    ];
  }, [ctaHref]);

  const total = offers.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [animating, setAnimating] = useState(false);

  const pauseUntilRef = useRef<number>(0);
  const commitTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (hasTrackedSectionRef.current) return;

          hasTrackedSectionRef.current = true;

          (
            window as Window & {
              dataLayer?: Record<string, unknown>[];
            }
          ).dataLayer?.push({
            event: "view_section",
            section: trackingSection,
            city: trackingCity,
            service: trackingService,
            page_type: trackingPageType,
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [trackingSection, trackingCity, trackingService, trackingPageType]);

  const clearTimers = () => {
    if (commitTimerRef.current) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const pauseAuto = () => {
    pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
  };

  const startTransition = (nextIndex: number, direction?: 1 | -1) => {
    if (total <= 1) return;
    if (nextIndex === currentIndex) return;
    if (incomingIndex !== null) return;

    clearTimers();

    const computedDir: 1 | -1 =
      direction ??
      ((nextIndex - currentIndex + total) % total === 1 ? 1 : -1);

    setDir(computedDir);
    setIncomingIndex(nextIndex);
    setAnimating(false);

    rafRef.current = window.requestAnimationFrame(() => {
      setAnimating(true);
    });

    commitTimerRef.current = window.setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIncomingIndex(null);
      setAnimating(false);
    }, ANIM_MS);
  };

  const prev = () => {
    pauseAuto();
    startTransition((currentIndex - 1 + total) % total, -1);
  };

  const next = () => {
    pauseAuto();
    startTransition((currentIndex + 1) % total, 1);
  };

  const goTo = (i: number) => {
    pauseAuto();
    startTransition(i);
  };

  useEffect(() => {
    if (total <= 1) return;

    const id = window.setInterval(() => {
      if (incomingIndex !== null) return;
      if (Date.now() < pauseUntilRef.current) return;
      startTransition((currentIndex + 1) % total, 1);
    }, AUTOROTATE_MS);

    return () => window.clearInterval(id);
  }, [total, currentIndex, incomingIndex]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const current = offers[currentIndex];
  const incoming = incomingIndex != null ? offers[incomingIndex] : null;
  const activeIndex = incomingIndex ?? currentIndex;

  const transitionStyle: React.CSSProperties = {
    transitionProperty: "transform, opacity",
    transitionDuration: `${ANIM_MS}ms`,
    transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  const desktopArrowBtn = [
    "hidden md:flex",
    "h-12 w-12 items-center justify-center",
    "rounded-full border border-neutral-200 bg-white shadow-sm",
    "transition-colors hover:bg-neutral-50",
  ].join(" ");

  const mobilePrevBtn =
    "rounded-full border border-neutral-200 px-8 py-2 text-brand-primary";
  const mobileNextBtn = "rounded-full bg-brand-primary px-8 py-2 text-white";

  const ctaClassName = [
    "inline-flex items-center justify-center",
    "rounded-full bg-brand-primary",
    "px-10 py-3 text-white",
    "border border-transparent",
    "transition-all duration-200",
    "shadow-sm hover:-translate-y-0.5 hover:shadow-md",
    "hover:bg-white hover:text-brand-primary hover:border-brand-primary",
  ].join(" ");

  const carouselClassName = [
    "w-full !max-w-none !px-0 !py-0",
    "px-0 py-0",
    "sm:px-0 sm:py-0",
    "md:px-10 md:py-10",
    "lg:px-16 lg:py-16",
    "[&>div:first-child]:flex-col",
    "[&>div:first-child]:items-center",
    "[&>div:first-child]:gap-8",
    "md:[&>div:first-child]:flex-row",
    "md:[&>div:first-child]:items-center",
    "md:[&>div:first-child]:gap-12",
    "max-md:[&>div:first-child>div:nth-child(2)]:w-full",
    "max-md:[&>div:first-child>div:nth-child(2)]:max-w-[560px]",
    "max-md:[&>div:first-child>div:nth-child(2)_img]:h-[260px]",
    "md:[&>div:first-child>div:nth-child(2)_img]:h-96",
    "max-md:[&>div:first-child>div:nth-child(3)]:items-center",
    "max-md:[&>div:first-child>div:nth-child(3)]:text-center",
    "md:[&>div:first-child>div:nth-child(3)]:items-start",
    "md:[&>div:first-child>div:nth-child(3)]:text-left",
    "max-md:[&_.border-dashed]:mt-1",
    "max-md:[&_.border-dashed]:mb-1",
    "md:[&>div:first-child>div:first-child]:absolute",
    "md:[&>div:first-child>div:first-child]:left-0",
    "md:[&>div:first-child>div:first-child]:top-1/2",
    "md:[&>div:first-child>div:first-child]:-translate-x-1/2",
    "md:[&>div:first-child>div:first-child]:-translate-y-1/2",
    "md:[&>div:first-child>div:last-child]:absolute",
    "md:[&>div:first-child>div:last-child]:right-0",
    "md:[&>div:first-child>div:last-child]:top-1/2",
    "md:[&>div:first-child>div:last-child]:translate-x-1/2",
    "md:[&>div:first-child>div:last-child]:-translate-y-1/2",
    "md:[&>div:first-child]:px-10",
    "lg:[&>div:first-child]:px-14",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderCarousel = (offer: Offer) => (
    <PromotionalCarousel
      className={carouselClassName}
      image={offer.image}
      title={<span className="text-brand-primary">{offer.title}</span>}
      subtitle={
        offer.subtitle ? (
          <span className="text-default-font">{offer.subtitle}</span>
        ) : null
      }
      description={
        offer.description ? (
          /* ⚠️ CONTRAST FIX 2026-09-01. This was text-brand-secondary, i.e.
             the DISPLAY gold #DDA82C, which measures 2.16:1 on this white
             ground and FAILS BOTH the 4.5 normal-text and 3.0 large-text
             bars. Enlarging it could not rescue it either — 2.16 fails at
             any size, because contrast is a property of the colour PAIR.
             --color-brand-secondary-text (#8D6917) is the token that exists
             for gold on a light ground and measures 5.04:1 here. Found while
             measuring this section, not reported by anything. */
          <span className="font-semibold uppercase tracking-wide text-(--color-brand-secondary-text)">
            {offer.description}
          </span>
        ) : null
      }
      ctaButton={
        <a
          href={offer.ctaHref}
          className={ctaClassName}
          data-event="click_cta"
          /* Descriptive rather than positional. `offers-cta-1/2/3` said
             nothing about where a click went, and the three slides now have
             three DIFFERENT destinations (the form, /about, /#services), so
             an index would make the three indistinguishable in GA4 the
             moment a slide is reordered. Free to change today — no container
             exists, so there is no history to break (client §3.2). */
          data-label={`offers-cta-${offer.ctaLabelSlug}`}
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
        >
          {offer.ctaLabel}
        </a>
      }
      /* ⚠️ A ZERO-SIZE PLACEHOLDER, NOT null, AND THAT IS LOAD-BEARING.
         PromotionalCarousel renders each arrow as `{prevButton ? <div…> :
         null}`, so passing null DELETES the wrapper div — and the fifteen
         `[&>div:first-child>div:first-child]` / `:last-child` /
         `:nth-child(2)` / `:nth-child(3)` overrides in carouselClassName
         above are POSITIONAL. Removing the arrows re-indexed every one of
         them: the photograph inherited the prev arrow's
         `absolute left-0 -translate-x-1/2` and hung 160px off the left edge,
         taking document.scrollWidth to 1826 against a 1440 viewport — 386px
         of horizontal overflow at a width that was previously clean. Root
         §7.3's warning about over-specific selectors, in practice.
         An empty span keeps the wrapper div, so every index stays put and
         the arrows simply have nothing inside them. */
      prevButton={
        total < 2 ? (
          <span aria-hidden="true" />
        ) : (
        <button
          type="button"
          onClick={prev}
          aria-label="Previous offer"
          className={desktopArrowBtn}
          data-event="carousel_prev"
          data-label="offers-prev"
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
        >
          <IconWrapper className="h-5 w-5 text-brand-primary">
            <FeatherChevronLeft />
          </IconWrapper>
        </button>
        )
      }
      nextButton={
        total < 2 ? (
          <span aria-hidden="true" />
        ) : (
        <button
          type="button"
          onClick={next}
          aria-label="Next offer"
          className={desktopArrowBtn}
          data-event="carousel_next"
          data-label="offers-next"
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
        >
          <IconWrapper className="h-5 w-5 text-brand-primary">
            <FeatherChevronRight />
          </IconWrapper>
        </button>
        )
      }
      /* One offer needs no arrows and no dots — controls that cannot
         change anything are noise, and the dot row would render a single
         permanently-active dot. They return automatically if a second offer
         is ever added to client.config.ts. */
      indicators={
        total < 2 ? null : (
        <div className="flex items-center justify-center gap-2">
          {offers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to offer ${i + 1}`}
              className={[
                "h-2.5 w-2.5 rounded-full transition-all",
                i === activeIndex
                  ? "bg-brand-primary"
                  : "bg-neutral-300 hover:bg-neutral-400",
              ].join(" ")}
              data-event="carousel_dot"
              data-label={`offers-dot-${i + 1}`}
              data-section={trackingSection}
              data-city={trackingCity}
              data-service={trackingService}
              data-page-type={trackingPageType}
            />
          ))}
        </div>
        )
      }
    />
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full bg-white py-16 md:py-24"
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="relative overflow-visible">
          <div
            className={[
              "w-full transform-gpu",
              animating
                ? dir === 1
                  ? "-translate-x-10 opacity-0"
                  : "translate-x-10 opacity-0"
                : "translate-x-0 opacity-100",
            ].join(" ")}
            style={incoming ? transitionStyle : undefined}
          >
            {renderCarousel(current)}
          </div>

          {incoming ? (
            <div
              className={[
                "absolute inset-0 w-full transform-gpu",
                !animating
                  ? dir === 1
                    ? "translate-x-10 opacity-0"
                    : "-translate-x-10 opacity-0"
                  : "translate-x-0 opacity-100",
              ].join(" ")}
              style={transitionStyle}
            >
              {renderCarousel(incoming)}
            </div>
          ) : null}
        </div>

        {/* Thumbnail strip and the mobile Prev/Next row below it are both
            suppressed at a single offer, for the same reason as the arrows
            and dots: a control that cannot change anything is noise, and a
            lone thumbnail permanently ringed as "active" reads as a broken
            gallery. Both return automatically if a second offer is added to
            client.config.ts.
            ⚠️ TRACKING CONSEQUENCE: carousel_thumb was emitted ONLY here, so
            with EBS's single offer that event name now appears nowhere on
            the site. It is UX-ONLY (root §8.4), carries no conversion role,
            and comes back with a second offer — but a GA4 exploration
            filtered on it will return zero rows until then. */}
        {total < 2 ? null : (
        <div className="mt-6 flex items-center justify-center gap-3">
          {offers.map((offer, i) => {
            const isActive = i === activeIndex;

            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`View offer ${i + 1}`}
                className={[
                  "relative overflow-hidden rounded-lg",
                  "h-16 w-24 sm:h-20 sm:w-32",
                  "transition-all",
                  isActive
                    ? "ring-2 ring-brand-primary"
                    : "opacity-70 hover:opacity-100",
                ].join(" ")}
                data-event="carousel_thumb"
                data-label={`offers-thumb-${i + 1}`}
                data-section={trackingSection}
                data-city={trackingCity}
                data-service={trackingService}
                data-page-type={trackingPageType}
              >
                <img
                  src={offer.image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
        )}

        {total < 2 ? null : (
        <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={prev}
            className={mobilePrevBtn}
            data-event="carousel_prev"
            data-label="offers-prev-mobile"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            className={mobileNextBtn}
            data-event="carousel_next"
            data-label="offers-next-mobile"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
          >
            Next
          </button>
        </div>
        )}
      </div>
    </section>
  );
}