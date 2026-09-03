"use client";

import React, { useEffect, useRef } from "react";
import ConcreteGround from "./ConcreteGround";
import { TrustHeadline_Ratings } from "@/ui/components/TrustHeadline_Ratings";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

export interface TrustHeadlineRatingsWrapperProps {
  id?: string;
  className?: string;

  /** Content */
  badgeText?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  rating?: React.ReactNode;
  ratingSubtext?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function TrustHeadlineRatingsWrapper({
  id,
  className,
  badgeText = "About Our Company",
  /* ⚠️ EBS-About passes NO content props here, only tracking, so these
     defaults ARE the live /about copy (root §13.3.8's inverse).
     Was "Trusted Tree Service in Your Area. Keep Calm & Call Medrano's!" —
     the previous client's own tagline. "Eastern North Carolina" reuses the
     framing already shipping in the home page's why-EBS band rather than
     inventing a fourth way of describing the same three counties.
     "More than a thousand" is the CLEARED 1000+ figure. */
  title = `Trusted ${CLIENT.vocabulary.tradeName} Across Eastern North Carolina`,
  description = "Twenty years of tree work, and more than a thousand homes and businesses served.",
  rating = CLIENT.reviews.trustBadge,
  ratingSubtext = CLIENT.reviews.reviewCount,
  trackingSection = "trust-headline-ratings",
  trackingCity,
  trackingService,
  trackingPageType,
}: TrustHeadlineRatingsWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedSection = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (hasTrackedSection.current) return;

          hasTrackedSection.current = true;

          (
            window as Window & { dataLayer?: Record<string, unknown>[] }
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

  return (
    <section
      id={id}
      ref={sectionRef}
      className={[
        /* CONCRETE GROUND, 2026-09-01 by request — the same procedural
           surface the home services grid uses. See ConcreteGround.tsx.

           ⚠️ `relative isolate` IS LOAD-BEARING, not decoration. The
           three turbulence layers blend with their BACKDROP via
           mix-blend-multiply; without a stacking context of its own that
           backdrop is whatever the page painted beneath this section, and
           the texture leaks onto the neighbour. `overflow-hidden` clips the
           tiles to the band. The content div below takes `relative` so it
           sits above the layers.

           ⚠️ bg-white REPLACED by --color-ground-concrete (#F2F5F9).
           ResidentialCommercialWrapper further down /about ALREADY uses that
           exact value, flat and untextured, so this section and that one now
           share a ground colour — see the seam note in EBS-About.tsx. */
        "relative isolate w-full overflow-hidden bg-[var(--color-ground-concrete)] px-6 md:px-10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <ConcreteGround />

      {/* `relative` lifts the content above the ground layers. */}
      <div className="relative mx-auto w-full max-w-[1280px]">
        <TrustHeadline_Ratings
  className="
    w-full mx-auto
    max-md:flex-col
    max-md:px-4
    max-md:py-10
    max-md:[&>div]:flex-col
    max-md:[&>div]:gap-8
    [&_svg]:!text-[var(--color-brand-secondary)]
  "
          badgeText={badgeText}
          title={title}
          description={description}
          rating={rating}
          ratingSubtext={ratingSubtext}
          /* ⚠️ AVATAR CLUSTER REMOVED 2026-09-01 — deliberately NOT repointed.
             It rendered four <Avatar image="/images/review-avatar-{1,2,3,4}.png">
             plus a "3+" pill. THREE of those four files do not exist, so /about
             shipped three broken avatars beside one real photograph, reading as
             a loading fault rather than as missing assets — and each 404 was a
             HIGH-PRIORITY React 19 preload returning nothing (root §9.13).

             ⚠️ THE OBVIOUS FIX IS WRONG. `review-avatar-*` and
             `ebs-review-avatar-*` are two DIFFERENT families, and a grep for
             "review-avatar" matches both, so the complete `ebs-` family looks
             like a drop-in replacement. It is not — those are ALSO the previous
             client's customers' faces. Repointing would swap one competitor's
             people for another's while making the page look fixed.

             Removing is also the honest reading of the CLAIMS REGISTER, whose
             recorded decision is "named testimonials only": four faces plus a
             "3+" pill implies seven reviewers against three real reviews. Same
             reason the home hero's Google badge carries no avatars.

             TrustHeadline_Ratings renders `{avatars ? <div>…</div> : null}`, so
             omitting the prop yields no empty box — verified in the component.
             Restore only with real EBS customer photos and permission. */

        />
      </div>
    </section>
  );
}
