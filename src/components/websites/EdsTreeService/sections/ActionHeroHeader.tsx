"use client";

import React, { useEffect, useRef } from "react";
import { HeroSectionAlt2 } from "@/ui/components/HeroSectionAlt2";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

const PHONE_HREF    = CLIENT.contact.phoneTel;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

export interface ActionHeroHeaderProps {
  id?: string;
  className?: string;

  /** Content */
  backgroundImage?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  /** CTA */
  ctaHref?: string;
  ctaLabel?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ActionHeroHeader({
  id,
  className,
  /* ⚠️ EBS-About passes NO content props, only tracking — so every default
     below IS the live /about copy (root §13.3.8's inverse), not scaffolding.

     backgroundImage was "/images/About-page-1-hero.jpg", a file DELETED from
     this branch. It 404'd on every /about load, and because React 19 preloads
     every non-lazy <img> at high priority (root §9.13) it was a wasted
     top-priority request returning nothing — one of the four dead preloads
     that made /about the worst route on the site for this.

     Title and subtitle were the previous client's and carried three separate
     CLAIMS problems beyond the branding: "Arborists", a Durham / Chapel Hill /
     Raleigh service area, and "since 2007" (EBS is 2006). Rewritten from
     cleared facts only — family-run, 2006, licensed/bonded/insured, OSHA
     Certified Roofers, residential AND commercial, free estimates. */
  backgroundImage = "/images/edstree-hero-3.jpg",
  eyebrow = `ABOUT ${CLIENT.business.nameShort.toUpperCase()}`,
  title = "One family, three counties, twenty years",
  subtitle = `${CLIENT.business.nameShort} has been taking down and trimming trees for homes and businesses across ${CLIENT.geo.serviceArea} since ${CLIENT.business.yearFounded} — family-run, bonded and insured, with a free estimate on every job.`,
  ctaHref = "#footer",
  ctaLabel = "Get a Free Estimate",
  trackingSection = "hero",
  trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "about",
}: ActionHeroHeaderProps) {
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
      className={["w-full overflow-x-hidden", className]
        .filter(Boolean)
        .join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* SCRIM — a COPY-SIDE GRADIENT, matching the home hero
          (from-black/80 via-black/60 to-black/25) rather than a flat dim.

          The flat version this replaces ([&>img]:!opacity-40) passed contrast
          but paid for it by dimming the WHOLE photograph evenly, including the
          right side where no text sits. The gradient is better on both counts,
          measured on the real pixels (root §11.10 — getComputedStyle cannot
          see through a scrim over a photo):

            flat opacity-40      white 4.69:1, photo dim everywhere
            copy-side gradient   white 6.59:1, photo bright on the right

          Rendered as a ::before rather than a sibling div because
          HeroSectionAlt2 owns its subtree and a wrapper cannot insert one.
          z-[5] is load-bearing: the Subframe <img> is z-auto and the content
          box is z-10, so 5 is the only slot that sits between them.
          before:content-[''] is required or the pseudo-element never renders.

          ⚠️ GOLD IS NOT USABLE AS THE EYEBROW COLOUR HERE, and that is
          measured, not taste. Against the brightest pixel under the copy:
            gold #DDA82C   flat-40 2.17:1 · under this gradient 3.05:1 · FAIL
            gold tint      flat-40 2.78:1 · FAIL
          Gold only reaches 4.5:1 at roughly 15% image opacity, which erases the
          photograph. The eyebrow is 14–16px, so it needs the full 4.5 and not
          the 3.0 large-text bar. Same reason --color-brand-secondary-text
          exists: gold is GROUND-DEPENDENT, and this photograph (pale metal
          building against sky) is the brightest ground on the site. The house
          eyebrow rhythm is kept exactly — size, weight, uppercase, 0.22em
          tracking — and only the COLOUR changes, because the ground changed.
          To get gold back here, give it its own ground (a chip); more scrim
          only destroys the photo. */}
      <HeroSectionAlt2
className="
  w-full
  [&>img]:absolute
  [&>img]:inset-0
  [&>img]:h-full
  [&>img]:w-full
  [&>img]:object-cover
  [&>img]:object-center
  [&>img]:!opacity-100
  before:absolute before:inset-0 before:z-[5] before:content-['']
  before:bg-gradient-to-r before:from-black/80 before:via-black/60 before:to-black/25
"
        backgroundImage={backgroundImage}
        /* Eyebrow → title → caption — the same rhythm the services grid,
           stats band and who-we-serve section use, so /about reads as part of
           one system. The eyebrow rides in the TITLE slot because
           HeroSectionAlt2 has no eyebrow slot and a wrapper cannot add one
           (root §7.1's ceiling), but it stays a separate `eyebrow` PROP so
           overriding the title does not silently drop it. Sizes are set on the
           ⚠️ BOTH font-* CLASSES ARE LOAD-BEARING. Elsewhere on the site the
           eyebrow and caption are top-level <p> tags inheriting the body's
           font-body (Inter), while only the h2 opts into font-heading-1
           (Barlow Semi Condensed). Here they are NESTED inside Subframe spans
           that already set font-heading-1 / font-heading-3, so without an
           explicit font-body they INHERIT Barlow and this hero silently
           becomes the one place on the site with a condensed eyebrow and
           caption. The title is the opposite case: it carries NO font class
           on purpose, because inheriting font-heading-1 is what it wants.
           CHILDREN, overriding the text-heading-1 / text-heading-3 the Subframe
           spans apply. max-w-[20ch] is what breaks the headline to two lines,
           matching the reference. */
        title={
          <span className="block">
            {eyebrow ? (
              <span className="mb-4 block font-body text-sm font-semibold uppercase tracking-[0.22em] text-white md:text-base">
                {eyebrow}
              </span>
            ) : null}
            <span className="block max-w-[20ch] text-3xl font-bold leading-[1.12] md:text-5xl">
              {title}
            </span>
          </span>
        }
        subtitle={
          <span className="block max-w-[62ch] font-body text-base leading-relaxed text-white/90 md:text-lg">
            {subtitle}
          </span>
        }
        primaryAction={
          <a
            href={ctaHref}
            className="
              rounded-md
              border border-transparent
              bg-brand-primary
              px-6 py-3
              text-base font-medium
              text-white
              transition-colors
              hover:border-brand-primary
              hover:bg-white
              hover:text-brand-primary
            "
            data-event="click_cta"
            data-label="hero-primary-get-estimate"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
          >
            {ctaLabel}
          </a>
        }
        secondaryAction={
          <a
            href={PHONE_HREF}
            className="
              inline-flex items-center gap-2
              rounded-md
              border border-white
              px-6 py-3
              text-base font-medium
              text-white
              transition-colors
              hover:bg-white
              hover:text-brand-primary
            "
            data-event="click_call"
            data-label="hero-call-now"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
            aria-label={`Call now ${DISPLAY_PHONE}`}
          >
            <span>Call Now:</span>
            <span className="phone-number">{DISPLAY_PHONE}</span>
          </a>
        }
      />
    </section>
  );
}
