"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { AssociationBadgeAreasslotter } from "@/ui/components/AssociationBadgeAreasslotter";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

type BadgeLogo = {
  src: string;
  alt?: string;
  /** Optional sizing per logo */
  className?: string;
};

export interface AssociationBadgeAreasslotterWrapperProps {
  heading?: React.ReactNode;

  /** Simple data-driven logos (recommended) */
  logos?: BadgeLogo[];

  /** Or pass custom JSX if you want total control */
  logosSlot?: React.ReactNode;

  /** Optional anchors / styling */
  id?: string;
  className?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function AssociationBadgeAreasslotterWrapper({
  heading = "Proudly Associated With Industry Leaders",

  logos = [
    {
      src: "/logos/isa.svg",
      alt: CLIENT.vocabulary.credentialTitle,
      className: "h-16 md:h-20 lg:h-24",
    },
    {
      src: "/logos/tcia.svg",
      alt: CLIENT.vocabulary.industryAssociation,
      className: "h-16 md:h-20 lg:h-24",
    },
    {
      src: "/logos/bbb.svg",
      alt: "Better Business Bureau Accredited Business",
      className: "h-16 md:h-20 lg:h-24",
    },
    {
      src: "/logos/angi.svg",
      alt: "Angi",
      className: "h-16 md:h-20 lg:h-24",
    },
  ],

  logosSlot,

  id,
  className,

  trackingSection = "associations",
  trackingCity,
  trackingService,
  trackingPageType,
}: AssociationBadgeAreasslotterWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedSectionRef = useRef(false);

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

  const renderedLogos = useMemo(() => {
    if (logosSlot) return logosSlot;
    if (!logos?.length) return null;

    return logos.map((logo, idx) => (
      <img
        key={`${logo.src}-${idx}`}
        src={logo.src}
        alt={logo.alt ?? `Association logo ${idx + 1}`}
        className={[
          "object-contain",
          "w-auto",
          logo.className ?? "h-16 md:h-20 lg:h-24",
        ].join(" ")}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    ));
  }, [logos, logosSlot]);

  const sectionClassName = ["w-full bg-neutral-50", className]
    .filter(Boolean)
    .join(" ");

  const subframeClassName = `
    py-0
    !bg-transparent
    [&_.container]:!max-w-none
    [&_.container]:!w-full
    [&_.container]:!px-0
    [&_[class*='max-w-\\[1280px\\]']]:!max-w-none
    [&_[class*='max-w-\\[1280px\\]']]:!w-full
  `;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={sectionClassName}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className="mx-auto w-full max-w-[1800px] px-6 py-12 sm:px-10 md:py-16 lg:px-16 xl:px-24">
        <AssociationBadgeAreasslotter
          className={subframeClassName}
          heading={
            heading ? (
              <span className="w-full text-center text-heading-1 font-heading-1 text-default-font">
                {heading}
              </span>
            ) : null
          }
          logos={renderedLogos}
        />
      </div>
    </section>
  );
}