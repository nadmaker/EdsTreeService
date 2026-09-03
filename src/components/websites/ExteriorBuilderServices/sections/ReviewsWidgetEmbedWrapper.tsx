"use client";

import React, { useEffect, useRef } from "react";
import { Html_Embed } from "@/ui/components/Html_Embed";

export interface ReviewsWidgetEmbedWrapperProps {
  id?: string;
  className?: string;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ReviewsWidgetEmbedWrapper({
  id,
  className,
  trackingSection = "reviews",
  trackingCity,
  trackingService,
  trackingPageType,
}: ReviewsWidgetEmbedWrapperProps) {
  const url =
    "https://sotellus.com/widgets/stu-react-reviews-grid/index.html?uid=medranos-tree-service";

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (hasTracked.current) return;

          hasTracked.current = true;

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

  return (
    <section
      id={id}
      ref={sectionRef}
      className={["reviews-embed-tune w-full bg-white", className]
        .filter(Boolean)
        .join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 pb-2 pt-10 md:max-w-[1360px] md:px-10 md:pb-0 md:pt-6">
        {/* Desktop */}
        <div className="hidden w-full md:block">
          <Html_Embed className="w-full">
            <iframe
              src={url}
              width="100%"
              height="500"
              frameBorder="0"
              style={{ border: 0, display: "block" }}
              title="Medrano's Reviews Desktop"
            />
          </Html_Embed>
        </div>

        {/* Mobile */}
        <div className="block w-full md:hidden">
          <Html_Embed className="w-full">
            <iframe
              src={url}
              width="100%"
              height="500"
              frameBorder="0"
              style={{ border: 0, display: "block" }}
              title="Medrano's Reviews Mobile"
            />
          </Html_Embed>
        </div>
      </div>
    </section>
  );
}