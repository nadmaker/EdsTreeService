"use client";

import React from "react";
import {
  FeatherAtSign,
  FeatherGlobe,
  FeatherHousePlug,
  FeatherPhone,
} from "@subframe/core";

export interface FooterWrapperProps {
  id?: string;
  className?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;

  logo?: string;
  tagline?: React.ReactNode;
  companyLinks?: React.ReactNode;
  servicesLinks?: React.ReactNode;
  ctaTitle?: React.ReactNode;
  ctaDescription?: React.ReactNode;
  ctaButton?: React.ReactNode;
  email?: React.ReactNode;
  /** Phone anchor. MUST be an <a href="tel:"> rendering the number as
   *  VISIBLE text — see the contact row below for why. */
  phone?: React.ReactNode;
  addressLine1?: React.ReactNode;
  addressLine2?: React.ReactNode;
  copyright?: React.ReactNode;
  designerName?: React.ReactNode;
}

export default function FooterWrapper({
  id,
  className,
  trackingSection = "footer",
  trackingCity,
  trackingService,
  trackingPageType,
  logo,
  tagline,
  companyLinks,
  servicesLinks,
  ctaTitle,
  ctaDescription,
  ctaButton,
  email,
  phone,
  addressLine1,
  addressLine2,
  copyright,
  designerName,
}: FooterWrapperProps) {
  return (
    <footer
      id={id}
      className={["w-full bg-white", className].filter(Boolean).join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className="w-full py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16 xl:px-24">
          <div
            className="grid grid-cols-1 gap-10 md:grid-cols-[260px_1fr_1fr_420px] md:gap-16"
            data-group="footer-top"
          >
            <div
              className="order-2 flex flex-col items-center gap-4 text-center md:order-1 md:items-start md:text-left"
              data-group="footer-brand"
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Footer logo"
                  className="h-24 w-auto object-contain md:h-48"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}

              {tagline ? (
                <p className="max-w-[22rem] text-body-bold font-body-bold text-default-font md:max-w-none">
                  {tagline}
                </p>
              ) : null}
            </div>

            <div
              className="order-3 flex flex-col items-center gap-6 md:order-2 md:items-start"
              data-group="footer-company"
            >
              <h4 className="text-heading-3 font-heading-3 text-default-font">
                Company
              </h4>
              <div className="flex flex-col items-center gap-3 md:items-start">
                <div data-group="footer-company-links">{companyLinks}</div>
              </div>
            </div>

            <div
              className="order-4 flex flex-col items-center gap-6 md:order-3 md:items-start"
              data-group="footer-services"
            >
              <h4 className="text-heading-3 font-heading-3 text-default-font">
                Services
              </h4>
              <div className="flex flex-col items-center gap-3 md:items-start">
                <div data-group="footer-services-links">{servicesLinks}</div>
              </div>
            </div>

            <div
              className="order-1 text-center md:order-4 md:text-left"
              data-group="footer-cta"
            >
              {ctaTitle ? (
                <h3 className="text-heading-3 font-heading-3 text-default-font">
                  {ctaTitle}
                </h3>
              ) : null}

              {ctaDescription ? (
                <p className="mt-3 text-body font-body text-neutral-600">
                  {ctaDescription}
                </p>
              ) : null}

              {ctaButton ? (
                <div className="mt-6 flex justify-center md:justify-start">
                  <div className="w-full md:w-auto [&_*]:w-full md:[&_*]:w-auto [&_*]:rounded-full">
                    {ctaButton}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="my-10 h-px w-full bg-neutral-200" />

          {/* Contact row — three stacks: email left, phone centre, address
              right. Was TWO columns with the email centred inside its own
              half, which left a hole in the middle of the row and made the
              email look arbitrarily placed rather than aligned to anything.
              Each cell now declares its own alignment, so the row reads as
              left / centre / right instead of relying on the column split.
              Stacks to one centred column below md. */}
          <div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            data-group="footer-contact-row"
          >
            <div
              className="flex items-center justify-center gap-3 md:justify-start"
              data-group="footer-email"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-primary">
                <FeatherAtSign className="text-white" />
              </div>
              <div>
                <div className="text-caption font-caption text-neutral-500">
                  Connected With Us Now!
                </div>
                <div className="text-body font-body text-default-font">{email}</div>
              </div>
            </div>

            {/* ⚠️ SWAP-ELIGIBLE CALL SURFACE (root §8.9, §13.5.6). The
                consumer passes an <a href="tel:"> whose child is a
                .phone-number span carrying the number as VISIBLE TEXT,
                because Google Ads' "Calls from website" script matches
                rendered text only — an href, an aria-label or an icon-only
                button are all invisible to it and silently drop the
                qualified-call signal.

                It is also always mounted and never conditionally rendered,
                which is the other half of that rule: the scanner only sees
                what exists at parse time. The footer renders on all 18
                routes, so this adds a swap-eligible surface site-wide —
                add it to client CLAUDE.md §3.6's eligible list when the
                GTM container is built. */}
            <div
              className="flex items-center justify-center gap-3"
              data-group="footer-phone"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-primary">
                <FeatherPhone className="text-white" />
              </div>
              <div>
                <div className="text-caption font-caption text-neutral-500">
                  Call Us Today!
                </div>
                <div className="text-body font-body text-default-font">{phone}</div>
              </div>
            </div>

            <div
              className="flex items-center justify-center gap-3 md:justify-end"
              data-group="footer-address"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary">
                <FeatherGlobe className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-body font-body text-default-font">
                  {addressLine1}
                </div>
                <div className="text-body font-body text-default-font">
                  {addressLine2}
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 h-px w-full bg-neutral-200" />

          <div
            className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left"
            data-group="footer-legal"
          >
            {copyright ? (
              <div className="text-body font-body text-neutral-500">
                {copyright}
              </div>
            ) : null}

            <div className="flex items-center gap-2" data-group="footer-designer">
              <span className="text-body font-body text-neutral-500">
                Website Designed With
              </span>
              <span className="cursor-pointer text-body font-body text-default-font underline hover:text-neutral-600">
                {designerName}
              </span>
              <FeatherHousePlug className="text-error-600" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
