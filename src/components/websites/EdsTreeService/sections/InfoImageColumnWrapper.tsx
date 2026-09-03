"use client";

import React, { useEffect, useRef } from "react";
import ConcreteGround from "./ConcreteGround";
import { Info_ImageColumn } from "@/ui/components/Info_ImageColumn";
import { FeatherHardHat } from "@subframe/core";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

export interface InfoImageColumnWrapperProps {
  id?: string;
  className?: string;

  /** Content */
  image?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;

  /** CTA */
  ctaHref?: string;
  ctaLabel?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function InfoImageColumnWrapper({
  id,
  className,
  /* The previous default, /images/about-service-photo.jpg, DOES NOT EXIST in
     public/images/ — it was the previous client's path and shipped as a 404
     on every /about load. That is why this section rendered as two bare
     dashed lines: the image container collapsed to zero height, leaving only
     the Subframe parent's border-4 border-dashed rule.

     ⚠️ CEILING (root §7.1). This <img> is rendered INSIDE Info_ImageColumn,
     so its ATTRIBUTES are unreachable from here — className can restyle it,
     but nothing in a wrapper can add loading="lazy", alt, width or height.
     Two real consequences, neither fixable at this rung:
       · React 19's SSR emits a high-priority <link rel="preload" as="image">
         for this file on /about (root §9.13). It was already doing that for
         the 404; it now preloads a real 255 KB image instead of nothing.
       · The img carries no alt attribute at all, so it is an unlabelled
         image rather than a decorative one.
     Both close only via the Subframe theme tab, or by rebuilding this
     section wrapper-authored the way the home page's nine sections were.

     ⚠️ ASPECT IS LOAD-BEARING HERE, because the Subframe parent constrains
     neither the frame's height nor the img's object-fit — whatever is
     pointed at renders at its NATURAL aspect, and the copy column beside it
     is a fixed ~350px tall.

     This was briefly ebs-gallery-1-roof-replacement.jpg, which is PORTRAIT
     (765x1020, 0.750) and measured 616x819 against that 350px copy column —
     a 469px hole. Swapped to the landscape source below (1360x1020, 1.333)
     on request, which is the cheaper fix than cropping: no CSS, and the
     photo keeps its whole frame instead of losing ~53% of its height to a
     window. Re-measured figures are in the handoff.

     If a PORTRAIT source is ever wanted here, the two levers are CSS and so
     ARE reachable from this wrapper, unlike the attributes above:
     [&_.border-dashed]:h-[...] plus [&_img]:h-full [&_img]:object-cover.

     ⚠️ COST: this file is 368 KB against the previous 255 KB, and per the
     ceiling note above it CANNOT be lazy — so /about's preload set gets
     113 KB heavier. Worth a recompression pass; it is displayed at ~608px
     wide and is 1360px, so it is carrying about 2.2x the pixels it needs
     even at 2x retina. */
  image = "/images/edstree-gallery-3.jpg",
  /* ⚠️ EBS-About passes only ctaHref and tracking, so every content default
     below IS the live /about copy (root §13.3.8's inverse).

     REWRITTEN 2026-09-01. Was the previous client's company story in full:
     "Medrano's Tree Service", "the Triangle", "Founded in Chapel Hill in 2007
     by Dimas Medrano", and "every single day since 2007".

     ⚠️ IT ALSO CARRIED TWO CLAIMS-REGISTER VIOLATIONS, which is why this was
     not merely a branding fix:
       · "a 5.0 star rating across more than 190 reviews" — a star rating AND
         a review count, both banned outright, and 190 is the previous
         client's figure. It also CONTRADICTED TrustHeadlineRatingsWrapper
         one screen above, which renders "3 Google reviews": the same page
         stated two review counts two orders of magnitude apart.
       · "after servicing thousands" — the cleared figure is 1000+, so this
         overstated it independently of the review count.

     The icon was <FeatherTreeDeciduous /> — a TREE, sitting beside the section
     title. A text sweep does not catch a glyph; check icons separately.

     "every single day since 2007" lost the absolute as well as the year: the
     register's OPERATIONS CLAIMS tell is *every* / *always* / *never*. */
  icon = <FeatherHardHat />,
  title = `${CLIENT.vocabulary.tradeName} In Your Area`,
  subtitle = `Bonded & Insured ${CLIENT.vocabulary.tradeName}`,
  description = (
    <span className="block space-y-4">
      <span className="block">
        For two decades, {CLIENT.business.name} has handled tree removal, trimming, stump grinding, and
        storm clean-up across {CLIENT.geo.serviceArea} — built on safety, quality
        work, and honest value. Founded in {CLIENT.geo.hqCity},{" "}
        {CLIENT.geo.hqState} in {CLIENT.business.yearFounded} by{" "}
        {CLIENT.business.owner}, the company now serves homeowners and business
        owners across eastern North Carolina, with more than a thousand homes
        and businesses serviced.
      </span>
      <span className="block">
        {CLIENT.business.name} is family-owned and operated, and{" "}
        {CLIENT.business.owner.split(" ")[0]} is on the job, not just in the
        office. That personal, hands-on approach shows up in the work — and
        it is the same standard we have held to since{" "}
        {CLIENT.business.yearFounded}.
      </span>
    </span>
  ),
  ctaHref = "#home-contact",
  ctaLabel = "Get a Free Estimate",
  trackingSection = "info-image-column",
  trackingCity,
  trackingService,
  trackingPageType,
}: InfoImageColumnWrapperProps) {
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
        "relative isolate w-full overflow-hidden bg-[var(--color-ground-concrete)] px-6 py-12 md:px-10 md:py-16",
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
        <Info_ImageColumn
          /* Recolouring two hardcoded previous-client greens that the
             Subframe parent bakes in. Both are COLOURS, so they sit at rung
             3 of root §7.1's hierarchy (arbitrary variant) and need no
             theme-tab edit — unlike the img attributes noted above, which
             no className can reach at any rung.

             Each selector matches EXACTLY ONE element inside this component,
             verified in the rendered DOM rather than assumed:
               .border-dashed  — 1 match, the photo frame. Was rgb(132,204,22)
                                 lime (previous client), then default-font
                                 navy, now brand-secondary GOLD by request
                                 2026-09-01. Gold is the display token used
                                 for every other accent on the site (the
                                 credential band, the hero ticks, the
                                 capability bullets) — NOT
                                 brand-secondary-text, which is the darkened
                                 pair that exists only so gold can be
                                 READABLE TEXT. A border is not text, so the
                                 4.5:1 bar does not apply to it.
               svg             — 1 match, the corner icon, was rgb(5,122,50)
                                 green; now brand-primary blue

             Tokens, not literals, so a fork re-skins them (root §13.2.2).
             The icon rule sets `color` on the <svg> itself rather than on
             the IconWrapper span above it; Feather glyphs are
             stroke="currentColor", so stroke follows colour. */
          className="
            w-full mx-auto
            max-md:[&>div:last-child>span:first-child]:hidden
            max-md:[&>div:last-child>span:nth-child(2)]:hidden
            [&_.border-dashed]:!border-brand-secondary
            [&_svg]:!text-brand-primary
          "
          image={image}
          icon={icon}
          /* TWO MORE PREVIOUS-CLIENT GREENS, fixed 2026-09-01. The Subframe
             parent bakes literal hex into these two slots
             — title as text-[#057a32] and subtitle as text-[#16a34a],
             both Medrano greens — so they shipped green on an EBS page
             whose brand-primary is rgb(22,133,204). Verified from computed
             style, not from reading the component.

             Fixed at RUNG 1 of root §7.1 (slot content), not rung 3: both
             slots are ReactNode, so wrapping the value in a span that sets
             its own colour simply overrides what it would inherit from the
             parent span. That avoids an escaped-bracket arbitrary variant
             like [&_.text-\[\#057a32\]] — which works, but pins the
             override to a literal hex that a theme-tab edit would silently
             invalidate.

             ⚠️ The COPY in these slots is still the previous client's
             ("Tree Care In Your Area"). Colour and copy are separable: this
             fix survives the copy rewrite, and the rewrite does not depend
             on it. */
          /* ⚠️ font-heading-1 / font-body ARE LOAD-BEARING, not tidy-up.
             Info_ImageColumn hardcodes font-['Work_Sans'] on both slot spans
             with NO generic fallback, and Work Sans is not in Layout.astro's
             font request (Inter + Barlow Semi Condensed only) — so without an
             explicit face here these two lines INHERIT it and fall back to the
             browser's default SERIF. Identical defect to the one that forced
             the FAQ rebuild on the same page; found 2026-09-01 by grepping the
             served DOM for Work_Sans after fixing that one.
             The colour spans were already here for the same class of reason:
             the parent bakes in text-[#057a32] / text-[#16a34a], both previous-
             client greens. Rung 1 in each case (root §7.1) — both slots are
             ReactNode, so a child span simply wins. */
          title={<span className="font-heading-1 text-brand-primary">{title}</span>}
          subtitle={<span className="font-body text-brand-primary">{subtitle}</span>}
          description={description}
          ctaButton={
            <a
              href={ctaHref}
              className="
                rounded-md
                border border-transparent
                bg-brand-primary
                px-6 py-3
                text-white
                transition-colors
                hover:border-brand-primary
                hover:bg-white
                hover:text-brand-primary
              "
              data-event="click_cta"
              data-label="info-image-primary-cta"
              data-section={trackingSection}
              data-city={trackingCity}
              data-service={trackingService}
              data-page-type={trackingPageType}
            >
              {ctaLabel}
            </a>
          }
        />
      </div>
    </section>
  );
}
