"use client";

import React, { useEffect, useRef } from "react";
import { OurOffice_S_ } from "@/ui/components/OurOffice_S_";
import { FeatherExternalLink } from "@subframe/core";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/* ⚠️ THIS CONSTANT POINTED AT THE PREVIOUS CLIENT'S BUSINESS LISTING until
   2026-09-01. It was a Google Maps SEARCH for "Medrano's Tree Service Raleigh
   NC", wired to the "Get directions" button on EBS's own contact page — so a
   visitor trying to find EBS was sent to a competitor's location. Worse than
   stale copy, because the button did exactly what it promised.

   Now reads CLIENT.contact.mapsUrl, which config already held. That value is a
   share link (maps.app.goo.gl/…), which is correct for an anchor href — do NOT
   confuse it with CLIENT.map.embedUrl, the /maps/d/embed?mid=… form, which is
   for an <iframe src> and will not render as a link (see client.config.ts). */
const GOOGLE_MAPS_HREF = CLIENT.contact.mapsUrl;

export interface OurOfficeWrapperProps {
  id?: string;
  className?: string;

  /** Content */
  sectionTitle?: React.ReactNode;
  officeName?: React.ReactNode;
  addressLine1?: React.ReactNode;
  addressLine2?: React.ReactNode;
  directionsHref?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function OurOfficeWrapper({
  id,
  className,
  /* ⚠️ EBS-Contact passes NO content props, only tracking — so every default
     below IS the live /contact copy (root §13.3.8's inverse).

     ALL FOUR WERE THE PREVIOUS CLIENT'S, and this was the most harmful block
     of stale content left on the site: EBS's contact page published
     "Medrano's Headquarters" at "1716 Medrano Ct, Chapel Hill, NC 27514" — a
     competitor's NAME and STREET ADDRESS — above a directions button that
     searched for their listing.

     `sectionTitle` went from "Our offices" to the singular deliberately: EBS
     has ONE location, and a plural implies a branch network that does not
     exist. "Headquarters" was dropped for the same reason — it only means
     something when there are satellites.

     All three values now read from CLIENT, so a fork re-skins them by editing
     config rather than this file. */
  sectionTitle = "Our office",
  officeName = CLIENT.business.name,
  addressLine1 = CLIENT.contact.address,
  addressLine2 = CLIENT.geo.serviceArea,
  directionsHref = GOOGLE_MAPS_HREF,
  trackingSection = "our-office",
  trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "contact",
}: OurOfficeWrapperProps) {
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
      <OurOffice_S_
        className="w-full mx-auto max-md:px-6 max-md:py-10"
        sectionTitle={sectionTitle}
        /* ⚠️ font-body IS LOAD-BEARING, not tidy-up. OurOffice_S_ hardcodes
           font-['Work_Sans'] on the office-name span with NO generic fallback,
           and Work Sans is not in Layout.astro's font request (Inter + Barlow
           Semi Condensed only) — so without an explicit face this line falls
           back to the browser's default SERIF. Third instance of the same
           Subframe defect, after Fullstretchfaq and Info_ImageColumn; found by
           grepping the served DOM for Work_Sans rather than by reading source.
           Rung 1 (root §7.1) — the slot is ReactNode, so a child span wins. */
        officeName={<span className="font-body">{officeName}</span>}
        addressLine1={addressLine1}
        addressLine2={addressLine2}
        directionsLink={
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-primary font-medium hover:opacity-80 transition-opacity"
            data-event="click_cta"
            data-label="office-get-directions"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
          >
            Get directions
            <FeatherExternalLink className="h-4 w-4" />
          </a>
        }
      />
    </section>
  );
}
