"use client";

import React, { useEffect, useRef } from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

export interface CertifiedArboristsWrapperProps {
  id?: string;
  className?: string;

  /** Content */
  headline?: React.ReactNode;
  paragraphs?: React.ReactNode[];

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function CertifiedArboristsWrapper({
  id,
  className,
  headline = `We Are ${CLIENT.vocabulary.credentialTitlePlural}`,
  paragraphs = [
    "There's a real difference between someone who owns a chainsaw and a certified professional who understands trees. Medrano's is an ISA Certified Arborist business, licensed and fully insured — independently certified for our expertise, not just our equipment.",
    "Backed by nearly 20 years of hands-on experience, our certification means we don't just cut trees; we read them. We understand tree biology, structural risk, and how to do demanding work without damage to your property. Today, Medrano's proudly serves homeowners and property owners in Chapel Hill, Durham, Cary, and across the Triangle — including west and north Raleigh.",
    "At Medrano's, we genuinely care about the appearance, health, and safety of every tree on your property. With our certification and our experience, you get the very best in tree care paired with an unmatched level of personal service.",
  ],
  trackingSection = "certified-arborists",
  trackingCity,
  trackingService,
  trackingPageType,
}: CertifiedArboristsWrapperProps) {
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
      className={["w-full overflow-x-hidden bg-white px-6 py-12 md:py-16", className]
        .filter(Boolean)
        .join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center gap-6 text-center">
        <h2 className="text-heading-1 font-heading-1 text-default-font">
          {headline}
        </h2>

        <div className="flex flex-col gap-4 text-body font-body text-subtext-color">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
