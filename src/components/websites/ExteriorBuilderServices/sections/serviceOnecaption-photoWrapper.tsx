"use client";

import React from "react";
import { TallContentTruTemp } from "@/ui/components/TallContentTruTemp";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

const PHONE_HREF    = CLIENT.contact.phoneTel;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

function SolidPhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.95 21c-2.08 0-4.74-.85-7.42-2.41-2.57-1.49-4.99-3.61-6.81-5.97C3.86 10.21 2.96 7.88 3 6.04c.02-1 .73-1.87 1.7-2.06l2.67-.53c.88-.18 1.75.27 2.15 1.07l1.24 2.49c.33.66.22 1.45-.27 2l-1.26 1.42a.75.75 0 0 0-.09.92c.78 1.19 1.77 2.27 2.95 3.22 1.16.94 2.41 1.7 3.71 2.28a.75.75 0 0 0 .89-.2l1.18-1.39c.52-.61 1.38-.84 2.13-.57l2.61.94c.88.32 1.41 1.22 1.28 2.15l-.38 2.71A2.12 2.12 0 0 1 19.95 21Z" />
    </svg>
  );
}

export interface ServiceOneCaptionPhotoWrapperProps {
  id?: string;
  className?: string;

  image?: string;
  /**
   * Alt text for the photo above the caption.
   *
   * Added 2026-09-02 alongside the image swap. This was a HARDCODED
   * alt="" in the JSX, i.e. every service page declared the photo
   * decorative. That was defensible while `image` pointed at a file that
   * did not exist, and stopped being defensible the moment it pointed at
   * a real photograph of real work.
   *
   * ⚠️ ONE STRING SERVES ALL SEVEN ROUTES, because the builder passes no
   * `image` and therefore no alt either. So this describes the PICTURE and
   * not the service — the same photo sits on the roof-repair page and the
   * gutter-cleaning page, and an alt naming either trade would be false on
   * six of the seven. Pass "" to mark a genuinely decorative image.
   */
  imageAlt?: string;
  headline?: React.ReactNode;
  paragraph?: React.ReactNode;

  /** Optional extra spacing controlled by page layout */
  padYClassName?: string;

  /** keeps content from stretching across the full 60% column */
  contentMaxWidthClassName?: string;

  /** image height cap */
  imageHeightClassName?: string;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ServiceOneCaptionPhotoWrapper({
  id,
  className,

  /* ⚠️ THIS DEFAULT IS THE LIVE PHOTO ON ALL SEVEN SERVICE ROUTES, not
     scaffolding. ServicePageBLDR passes `headline` and `paragraph` but
     NOT `image`, so root §13.3.8's inverse applies: no consumer overrides
     it, which makes it content rather than a fallback.

     Was "/images/service-1-about.jpg" — a file that DOES NOT EXIST in
     public/images/. Seven routes rendered a broken <img> with no build
     error, no console warning and no 404 in the page's own status. It
     survived because alt="" and loading="lazy" between them made the
     failure completely silent: nothing preloads it, nothing announces it,
     and a crawl of the served HTML shows a perfectly well-formed tag.

     ⚠️ WHAT THIS PHOTO ACTUALLY SHOWS, because the repo disagrees with
     itself about it: a row of new townhomes at the housewrap stage —
     bare TYPAR, no siding, unfinished garage openings, bare dirt. The
     same file is described three OTHER ways elsewhere in this repo, and
     all three are wrong:
       PortfolioGalleryWrapper  "Finished exterior on a commercial building"
       cityLandingData          "...crew at work on a residential roof"
       servicePageData          "A completed EBS roof and gutter line..."
     Nothing here is finished, no crew is visible, and no gutters are in
     frame. Those three are NOT corrected by this edit — they are on other
     sections and belong to their own pass.

     ⚠️ IT ALSO CARRIES ANOTHER COMPANY'S BRANDING. The housewrap is
     printed with DAN RYAN BUILDERS perhaps fifteen times across the frame.
     Ordinary for a sub photographing his own work on a builder's site, but
     it is a competitor's logo repeated across an EBS marketing page, and
     this file already appears as home hero slide 1, a city-landing hero and
     the gutter-cleaning hero. Chosen by Ryan on 2026-09-02 with that
     flagged. A one-line swap when better photography exists. */
  image = "/images/ebs-hero-poster.jpg",
  imageAlt = "A row of new townhomes wrapped in weather-resistive housewrap, ready for siding installation.",
  headline = "Best Tree Removal in RDU Triangle NC",
  paragraph = (
    <>
      <p>
        Our team is the heart of Medrano&apos;s Tree Service. Led by {CLIENT.business.owner},
        a seasoned ISA certified tree expert with many years of experience, our crew
        is composed of skilled professionals and passionate individuals.
      </p>
      <p>
        We&apos;ve been guaranteeing quality service at every job for local residence,
        businesses and municipalities since 2007. Providing exceptional tree services,
        focusing on quality, safety, &amp; satisfaction.
      </p>
    </>
  ),

  padYClassName = "",
  contentMaxWidthClassName = "max-w-[720px]",
  imageHeightClassName = "h-[240px] sm:h-[320px] lg:h-[400px]",

  trackingSection = "service-caption",
  trackingCity,
  trackingService,
  trackingPageType,
}: ServiceOneCaptionPhotoWrapperProps) {
  return (
    <section
      id={id}
      className={["w-full", className].filter(Boolean).join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className={["min-w-0", padYClassName].filter(Boolean).join(" ")}>
        <div className={["w-full", contentMaxWidthClassName].join(" ")}>
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className={[
                "w-full rounded-lg shadow-lg object-cover",
                imageHeightClassName,
              ].join(" ")}
              loading="lazy"
            />
          ) : null}

          <TallContentTruTemp
            image={undefined}
            className="mt-6 w-full [&_button]:!hidden"
            paragraphs={
              <div className="flex w-full flex-col gap-6">
                <h2 className="text-lg font-semibold text-neutral-900">{headline}</h2>

                <div className="space-y-4 leading-relaxed text-neutral-700">
                  {paragraph}
                </div>

                <a
                  href={PHONE_HREF}
                  className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-brand-primary bg-brand-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-300 hover:bg-white hover:text-brand-primary hover:shadow-none hover:ring-2 hover:ring-brand-primary hover:ring-offset-2"
                  data-event="click_call"
                  data-label="service-caption-call"
                  data-section={trackingSection}
                  data-city={trackingCity}
                  data-service={trackingService}
                  data-page-type={trackingPageType}
                  aria-label={`Call now ${DISPLAY_PHONE}`}
                >
                  <SolidPhoneIcon className="h-4 w-4" />
                  <span className="phone-number">{DISPLAY_PHONE}</span>
                </a>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
