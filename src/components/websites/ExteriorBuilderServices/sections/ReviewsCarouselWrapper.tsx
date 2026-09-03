"use client";

import React, { useEffect, useState } from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — Reviews carousel.
 *
 * Rebuilt 2026-08-30. There was no Subframe parent to drop here; the
 * section was already wrapper-authored. What changed:
 *
 * 1. THREE cards per set on desktop (was two), by request. That is what
 *    drives most of the rest of this file — three across makes each card
 *    roughly a third narrower, so the long-form testimonials that fitted a
 *    two-up grid no longer do. The six texts were trimmed to a comparable
 *    length (~35-40 words) so no card runs ragged against its neighbours.
 *    Six reviews over three-up also yields exactly TWO sets, so the dot
 *    row drops from three to two.
 *
 *    Breakpoints are 1 / 2 / 3 at <768 / 768-1023 / >=1024. The middle
 *    tier is deliberate: the 768-1024 band already carries a known
 *    horizontal-overflow problem (handoff §6), so this section stays at
 *    two across there rather than pushing a third card into it.
 *
 * 2. York header treatment — eyebrow, title, caption, left-aligned,
 *    matching the services grid and the stats band so the three read as
 *    one system. The old centred header did not.
 *
 * 3. FULL TRACKING CONTRACT. The carousel controls previously emitted
 *    NOTHING — no data-event on the arrows or the dots — so every
 *    interaction with this section was invisible. They now emit
 *    carousel_prev / carousel_next / carousel_dot (root §8.4) with the
 *    four context attributes, matching PortfolioGalleryWrapper.
 *    carousel_dot is now emitted by THREE sections on the home page —
 *    hero, portfolio and this one. They separate by data-section plus
 *    data-label, but scope any probe to the section: a document-wide
 *    selector hits the hero's dots first (client §3.3).
 *
 * 4. Mechanism B to Mechanism A. The React IntersectionObserver was
 *    removed in favour of data-track-view (root §8.2), matching the other
 *    tracked sections on this page. This component still hydrates for the
 *    carousel, so the client directive cannot be dropped — but the vanilla
 *    observer fires off server-rendered DOM ahead of hydration, which is
 *    strictly earlier. PortfolioGalleryWrapper is the in-repo precedent
 *    for "hydrates, but tracks via Mechanism A". There must be no
 *    useEffect observer alongside this attribute or it double-fires.
 *
 * 5. Avatars are loading="lazy" with intrinsic dimensions. React 19
 *    preloads every non-lazy img at high priority (root §9.13), so the two
 *    avatars in the first set were costing two of the four preloads on the
 *    home page — and going three-up would have made it three. Lazy takes
 *    them to zero.
 *
 * SURFACE: bg-default-background, unchanged and load-bearing in both
 * directions. The services grid above renders bg-white specifically
 * because portfolio and this section are both off-white, and the
 * service-area section below opens on a top-down white scrim tuned to meet
 * this off-white. Repainting this section breaks two documented seams at
 * once (see EBS-Home.tsx).
 *
 * CONTENT IS THE PREVIOUS CLIENT'S. All six testimonials are Medrano's
 * customers writing about tree removal — the crew, the hickory, the pines,
 * the Asheville storm. Ryan's decision 2026-08-30 was to trim them in
 * place and leave replacement to the copy sweep, so the shortening above
 * is a LENGTH EDIT, NOT A FIX. This section is not shippable until the
 * real EBS testimonials replace these; the intake CSV records 3 real
 * Google reviews but their text exists nowhere in the repo. The avatar
 * images are likewise the previous client's people (handoff §6).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "google" | "facebook";

interface Review {
  name: string;
  initials: string;
  platform: Platform;
  rating: number;
  avatar: string;
  text: string;
}

// ─── Review data ──────────────────────────────────────────────────────────────
// PLACEHOLDER — previous client's reviews, see the header block above.
// Trimmed to ~35-40 words each so three cards sit level against each other.
// Replace wholesale with the real EBS testimonials; the carousel sets
// recompute from REVIEWS.length, so the count can change freely.

const REVIEWS: Review[] = [
  {
    name: "Leith Brown",
    initials: "LB",
    platform: "google",
    rating: 5,
    avatar: "/images/ebs-review-avatar-1.png",
    text: "Responded to our text within hours, on a weekend, and gave us a fair price. The crew dropped a large tree carefully, avoiding all our sheds and fences. No hidden fees. Professional, safe and methodical throughout.",
  },
  {
    name: "Obrien Maples",
    initials: "OM",
    platform: "google",
    rating: 5,
    avatar: "/images/ebs-review-avatar-2.png",
    text: "Every member of the crew was an expert in their role, and they made quick work of the large trees looming over our home. Communication was fluid and delightful, and cleanup was quick and thorough. I trust this team.",
  },
  {
    name: "Tony Farlow",
    initials: "TF",
    platform: "google",
    rating: 5,
    avatar: "/images/ebs-review-avatar-3.png",
    text: "After the disaster in the Asheville area, with people telling you they will be there next week and never showing up, these guys were a blessing. They arrived when they said, did an amazing job, and cleaned up everything.",
  },
  {
    name: "Daniel Crummett",
    initials: "DC",
    platform: "google",
    rating: 5,
    avatar: "/images/ebs-review-avatar-4.png",
    text: "Three large pines removed, hedges trimmed and ivy cleared, all done in half a day. The crew never stopped moving, laid safety mats to protect my driveway, and left the yard looking better than before they started.",
  },
  {
    name: "Thom H",
    initials: "TH",
    platform: "google",
    rating: 5,
    avatar: "",
    text: "He personally examined the tree and explained his exact plan to protect our septic system, roof and driveway. The crew arrived early, laid plywood, wore full safety gear and cleaned the site thoroughly. Outstanding care.",
  },
  {
    name: "Lily",
    initials: "L",
    platform: "google",
    rating: 5,
    avatar: "/images/ebs-review-avatar-6.png",
    text: "After a storm sent several pines crashing into my backyard, I was panicking. The crew brought order to the chaos, clearing the fallen trees and taking down others still at risk. Reliable, efficient and genuinely compassionate.",
  },
];

/*
  Cards visible per set, by breakpoint. Six reviews over three-up gives
  exactly two sets on desktop; the middle tier stays at two because of the
  768-1024 overflow band (see the header block).
*/
const PER_SET_DESKTOP = 3; // >= 1024
const PER_SET_TABLET = 2; // 768 - 1023
const PER_SET_MOBILE = 1; // < 768

const AVATAR_PX = 80; // matches h-20 w-20; declared so the box reserves space

// ─── Icons ────────────────────────────────────────────────────────────────────

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Avatar (image with initials fallback) ────────────────────────────────────

function Avatar({ src, initials, alt }: { src: string; initials: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const showInitials = !src || imgError;

  return (
    <div className="relative h-20 w-20 flex-none">
      {showInitials ? (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          /*
            loading="lazy" is REQUIRED here, not an optimisation. React 19's
            SSR emits a high-priority <link rel="preload"> for every non-lazy
            img it renders (root §9.13), and this section sits well below the
            fold, so those preloads compete with the hero's LCP for bandwidth
            while buying nothing. Width/height reserve the box so the
            deferred load costs no CLS.
          */
          loading="lazy"
          decoding="async"
          width={AVATAR_PX}
          height={AVATAR_PX}
          className="h-full w-full rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col items-center gap-5 rounded-2xl bg-white p-8 text-center shadow-md">
      <div className="relative">
        <Avatar src={review.avatar} initials={review.initials} alt={review.name} />
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
          {review.platform === "google" && <GoogleIcon />}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-base font-semibold text-default-font">{review.name}</span>
        <div className="flex items-center gap-0.5 text-[rgb(234,179,8)]">
          {Array.from({ length: review.rating }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4" />
          ))}
        </div>
        <span className="text-xs capitalize text-neutral-400">{review.platform} Review</span>
      </div>

      <p className="text-sm leading-relaxed text-neutral-600">{review.text}</p>
    </div>
  );
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export interface ReviewsCarouselWrapperProps {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  caption?: React.ReactNode;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ReviewsCarouselWrapper({
  id,
  className,
  eyebrow = "WHAT PEOPLE SAY",
  title = "Homeowners who called us back",
  /*
    The old caption read "Real reviews from Triangle homeowners" — the
    previous client's service area, not EBS's. Wired to CLIENT.geo rather
    than restated, so a fork cannot strand it again (handoff §4).
  */
  caption = `Work we have done for people around ${CLIENT.geo.hqCity}, in their words.`,
  trackingSection = "reviews",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType,
}: ReviewsCarouselWrapperProps) {
  const [activeSet, setActiveSet] = useState(0);
  const [reviewsPerSet, setReviewsPerSet] = useState(PER_SET_DESKTOP);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const perSet =
        w < 768 ? PER_SET_MOBILE : w < 1024 ? PER_SET_TABLET : PER_SET_DESKTOP;
      setReviewsPerSet(perSet);
      setActiveSet(0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSets = Math.ceil(REVIEWS.length / reviewsPerSet);

  /*
    Shared context, spread rather than retyped per control — a partial set
    still fires through the click bridge but cannot be joined in analytics
    (root §8.6, §13.3.5). HeroWrapper is the reference.
  */
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  const visibleReviews = REVIEWS.slice(
    activeSet * reviewsPerSet,
    (activeSet + 1) * reviewsPerSet
  );

  const goToPrev = () => setActiveSet((s) => Math.max(0, s - 1));
  const goToNext = () => setActiveSet((s) => Math.min(totalSets - 1, s + 1));

  const arrowClass =
    "flex h-14 w-14 items-center justify-center rounded-full border-2 border-neutral-200 bg-white text-neutral-600 shadow-sm transition-colors hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40";

  /*
    The arrow pair, defined once and rendered in TWO places: in the header
    row at lg and up (the reference site puts them beside the heading,
    above the cards), and in the bottom control row below lg. Only one is
    ever visible — the other is display:none — so a click can only ever
    come from one of them and the click bridge cannot double-fire.

    Consequence to know when auditing: `reviews-prev` / `reviews-next` now
    appear TWICE in the served HTML per page. That is the same
    desktop/mobile duplication HeroWrapper uses for its offer cards. Count
    the visible one, not the grep total.
  */
  const NavArrows = ({ className: wrapClass }: { className?: string }) => (
    <div className={["flex items-center gap-4", wrapClass].filter(Boolean).join(" ")}>
      <button
        type="button"
        onClick={goToPrev}
        disabled={activeSet === 0}
        aria-label="Previous reviews"
        data-event="carousel_prev"
        data-label="reviews-prev"
        {...tracking}
        className={arrowClass}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        disabled={activeSet === totalSets - 1}
        aria-label="Next reviews"
        data-event="carousel_next"
        data-label="reviews-next"
        {...tracking}
        className={arrowClass}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );

  return (
    <section
      id={id}
      className={["w-full bg-default-background", className]
        .filter(Boolean)
        .join(" ")}
      /*
        Mechanism A. This component hydrates for the carousel, so the client
        directive cannot be dropped — but the vanilla observer in
        Layout.astro fires off server-rendered DOM ahead of hydration, which
        is earlier than a useEffect observer could manage. Do NOT add a
        React observer alongside this attribute (root §8.2).
      */
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* md:pt-14 rather than the md:py-28 that used to sit here — the TOP
          padding only, and only on desktop.

          It is half of a seam fix made on 2026-08-31. This section follows the
          portfolio gallery, which also carried md:py-28, so the desktop gap
          between them was 112px + 112px = 224px of stacked padding and read as
          a hole in the page. Each side now gives up half: 56 + 56 = 112px.

          ⚠️ Only the TOP is reduced. md:pb-28 is kept explicitly, because the
          bottom of this section is a different seam entirely — it meets the
          About Us section below, which brings its own photographic background,
          and that boundary was not the complaint. Collapsing this back to a
          symmetric md:py-* would silently tighten a seam nobody asked about.

          Mobile is untouched at py-20: the request was desktop-only, and at
          80px the mobile gap was never the problem. */}
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 md:px-10 md:pt-14 md:pb-28">
        {/* Header — same eyebrow, title, caption rhythm as the hero, the
            services grid and the stats band, so they read as one system.

            At lg the arrows join this row on the right, sitting above the
            cards rather than under them. `items-end` bottom-aligns them
            with the caption's last line, which is what keeps them level
            with the copy instead of floating against the title. Below lg
            the row collapses and the arrows fall back to the control row
            under the grid, where they are within thumb reach. */}
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div className="lg:min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
              {eyebrow}
            </p>

            <h2 className="mt-4 max-w-[20ch] font-heading-1 text-3xl font-bold leading-[1.12] text-default-font md:text-5xl">
              {title}
            </h2>

            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-neutral-600 md:text-lg">
              {caption}
            </p>
          </div>

          <NavArrows className="hidden flex-none lg:flex" />
        </div>

        {/* Cards — 1 / 2 / 3 up. items-stretch plus h-full on the card keeps
            all three the same height when the trimmed texts differ by a
            line. */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        {/* Controls — dots left, arrows right at md, stacked and centred on
            mobile. At lg the arrows are gone from this row (they sit in the
            header above), leaving the dots alone on the left. Every control
            carries the full six-attribute set; before this rebuild they
            carried none, so the whole carousel was invisible to analytics. */}
        <div className="mt-12 flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            {Array.from({ length: totalSets }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSet(i)}
                aria-label={`Go to review set ${i + 1} of ${totalSets}`}
                aria-current={i === activeSet ? "true" : undefined}
                data-event="carousel_dot"
                data-label={`reviews-dot-${i + 1}`}
                {...tracking}
                className={[
                  "h-4 rounded-full transition-all duration-300",
                  i === activeSet
                    ? "w-10 bg-brand-primary"
                    : "w-4 bg-neutral-300 hover:bg-neutral-400",
                ].join(" ")}
              />
            ))}
          </div>

          <NavArrows className="lg:hidden" />
        </div>
      </div>
    </section>
  );
}
