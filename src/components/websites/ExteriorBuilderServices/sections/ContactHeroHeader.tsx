"use client";

import React, { useEffect, useRef } from "react";
import { HeroSectionAlt2 } from "@/ui/components/HeroSectionAlt2";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

const PHONE_HREF    = CLIENT.contact.phoneTel;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

export interface ContactHeroHeaderProps {
  id?: string;
  className?: string;

  backgroundImage?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  ctaHref?: string;
  ctaLabel?: React.ReactNode;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ContactHeroHeader({
  id,
  className,
  /* SWAPPED 2026-09-02, by request. Was /images/Contact-page-1-hero.jpg —
     which loaded fine, so nothing flagged it, but was almost certainly the
     PREVIOUS CLIENT'S: it measured 24.3% foliage-ish pixels against 0.0-1.7%
     for the confirmed EBS roofing photos and 60.6% for the old Medrano's
     gallery shot, and it shares a filename family with About-page-1-hero.jpg,
     which was deleted from this branch on exactly those grounds. Circumstantial
     rather than proven — the call was Ryan's.

     ⚠️ Contact-page-1-hero.jpg is now ORPHANED (~1.1 MB) and still ships to
     the CDN. It belongs on the deletion list in EBS_HOME_ASSET_MAP.md.

     ⚠️ THIS PHOTO ALSO RENDERS IN PortfolioGalleryWrapper, which is on this
     same route — so /contact now shows it twice, once as the hero and once as
     a gallery slide. Accepted knowingly and it is a PHOTO-LIBRARY limit rather
     than a design choice: only seven distinct genuine EBS photographs exist,
     two of those seven are the same picture re-encoded, and every other
     candidate is either already in this page's gallery or is that duplicate.
     A one-line swap once more photography exists. */
  backgroundImage = "/images/ebs-hero-2-roof-replacement.jpg",
  title = `Contact Us | ${CLIENT.business.name}`,
  /* ⚠️ EBS-Contact passes NO content props, only tracking — so this default
     IS the live /contact copy (root §13.3.8's inverse).

     It read "…for a free estimate, EMERGENCY SERVICE, or any TREE CARE
     questions." Two CLAIMS problems in one sentence: emergency service is
     MUST-NOT-SHIP outright (EBS has no emergency line), and the rest was the
     previous client's trade. Replaced with cleared facts only — free
     estimates, residential AND commercial, the three-county service area. */
  subtitle = `Get in touch for a free estimate on roofing, siding or gutters — for homes and businesses across ${CLIENT.geo.serviceArea}.`,
  ctaHref = "#contact-info-form",
  ctaLabel = "Get a Free Estimate",
  trackingSection = "hero",
  trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "contact",
}: ContactHeroHeaderProps) {
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
      {/* SCRIM — a COPY-SIDE GRADIENT, matching the /about hero and the home
          hero (from-black/80 via-black/60 to-black/25).

          ⚠️ THE SUBFRAME DEFAULT FAILS AA HERE, and did before this photo:
          HeroSectionAlt2 grounds on bg-neutral-900 and drops the image over it
          at 60%, so the real backdrop is a COMPOSITE that getComputedStyle
          cannot see through (root §11.10). Measured by compositing the actual
          pixels and taking the brightest in the copy band:

            opacity-60 (the Subframe default)   2.55:1  FAILS even large text
            flat opacity-40                     4.69:1  passes, photo dim all over
            copy-side gradient (this)           6.17:1  passes, photo kept bright

          The gradient wins on both counts — higher contrast AND the photograph
          survives on the right, where no text sits. Identical numbers-shape to
          /about (2.55 → 4.69 → 6.59 there), because the failure belongs to the
          Subframe default rather than to either photograph.

          Rendered as ::before because HeroSectionAlt2 owns its subtree and a
          wrapper cannot insert a sibling. z-[5] is load-bearing: the Subframe
          <img> is z-auto and the content box is z-10, so 5 is the only slot
          between them. before:content-[''] is required or the pseudo-element
          never renders at all.

          ⚠️ RE-MEASURE if the photo is swapped again — the number belongs to
          this image, not to the layout. */}
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
        /* ⚠️ THE FONT CLASSES BELOW ARE LOAD-BEARING, AND THEY ARE NOT
           SYMMETRICAL — read before 'tidying' either one.

           Everywhere else on this site an eyebrow or a body paragraph is a
           top-level <p> inheriting the body's font-body (Inter), and only a
           heading opts into font-heading-1 (Barlow Semi Condensed). Inside
           HeroSectionAlt2 that is INVERTED: the parent wraps the title slot in
           `text-heading-1 font-heading-1` and the subtitle slot in
           `text-heading-3 font-heading-3`, so a child with no font class
           inherits BARLOW.

           Consequence, live on /contact until 2026-09-02: the subtitle — plain
           body copy — was rendering in condensed Barlow at 16px, the only body
           text on the site doing so. Nothing errors; it just reads as a
           different typeface from every other paragraph.

             subtitle → font-body EXPLICITLY, to escape the inherited Barlow.
             title    → NO font class ON PURPOSE, because inheriting
                        font-heading-1 is exactly what it wants.

           Sizes are set on the CHILDREN for the same reason, overriding the
           30px / 16px the Subframe spans apply. Matched to the /about hero so
           the two one-off page heroes read as one system. Same fix, same
           reasoning, same numbers. */
        title={
          <span className="block max-w-[20ch] text-3xl font-bold leading-[1.12] md:text-5xl">
            {title}
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
