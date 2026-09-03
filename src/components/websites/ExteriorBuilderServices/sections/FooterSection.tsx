"use client";

import React from "react";
import FooterWrapper from "./FooterWrapper";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export interface FooterSectionProps {
  id?: string;
  className?: string;

  /** Page-specific CTA target */
  contactHref?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

function FooterLinksColumn({
  links,
  group,
  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: {
  links: Array<{ label: string; href: string }>;
  group: "company" | "services";
  trackingSection: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 md:items-start">
      {links.map((l) => (
        <a
          key={l.href + l.label}
          href={l.href}
          className="text-body font-body text-neutral-600 transition-colors hover:text-default-font"
          data-event="click_nav_link"
          data-label={`footer-${group}-${slugify(l.label)}`}
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function FooterCTAButton({
  contactHref,
  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: {
  contactHref: string;
  trackingSection: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}) {
  return (
    <a
      href={contactHref}
      className="
        inline-flex w-full items-center justify-center
        rounded-full border border-transparent bg-brand-primary px-8 py-3
        text-white transition-colors
        hover:border-brand-primary hover:bg-white hover:text-brand-primary
        md:w-auto
      "
      data-event="click_cta"
      data-label="footer-primary-get-free-estimate"
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <span className="font-bold">Get Free Estimate</span>
    </a>
  );
}

export default function FooterSection({
  id,
  className,
  contactHref = "#home-contact",
  trackingSection = "footer",
  trackingCity,
  trackingService,
  trackingPageType,
}: FooterSectionProps) {
  /* ⚠️ ROOT-RELATIVE, NOT BARE FRAGMENTS. #service-area, #reviews and
     #services exist only on the HOME page. This footer renders on all 18
     routes, so on the six city landings (and on /about, /contact, /offers,
     /privacy and the seven service pages) all three were dead anchors —
     verified 2026-08-31 by diffing every href="#…" in the served body
     against every id present: only the per-page contact anchor resolved. A
     dead fragment fails silently; the click just scrolls nowhere.

     "/#service-area" fixes it in one place rather than requiring every page
     type to grow matching ids, and it costs the home page nothing: a
     same-path fragment is still a same-document navigation there, so the
     smooth scroll and --ebs-nav-clearance scroll-padding behave exactly as
     before.

     `contactHref` stays a bare fragment on purpose — it is passed per page
     (#goldsboro-contact, #home-contact, …) and always names an id that
     exists on the page doing the rendering. */
  const companyLinks = [
    { label: "Home", href: "/" },
    { label: "Service Area", href: "/#service-area" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Contact", href: contactHref },
  ];

  /* Each label now opens its own service page instead of sending all four to
     the same anchor. That anchor was #services — the home services grid —
     so from any other route these dead-ended, and from the home page itself
     the visitor's choice of service was discarded on arrival. Same defect,
     and the same fix, as the services grid rebuild on 2026-08-27.

     ⚠️ Slugs MUST match src/pages/services/*.astro and
     servicePageData[*].slug. Nothing type-checks this — a wrong slug is a
     404, not a build error. */
  const servicesLinks = [
    { label: "Roof Replacement", href: "/services/roof-replacement" },
    { label: "Roof Repair", href: "/services/roof-repair" },
    { label: "Siding Installation", href: "/services/siding-installation" },
    { label: "Gutter Installation", href: "/services/gutter-installation" },
  ];

  return (
    <FooterWrapper
      id={id}
      className={className}
      trackingSection={trackingSection}
      trackingCity={trackingCity}
      trackingService={trackingService}
      trackingPageType={trackingPageType}
      logo="/images/ebs-logo.png"
      tagline={`Roofing and siding done right, across ${CLIENT.geo.serviceArea}.`}
      companyLinks={
        <FooterLinksColumn
          links={companyLinks}
          group="company"
          trackingSection={trackingSection}
          trackingCity={trackingCity}
          trackingService={trackingService}
          trackingPageType={trackingPageType}
        />
      }
      servicesLinks={
        <FooterLinksColumn
          links={servicesLinks}
          group="services"
          trackingSection={trackingSection}
          trackingCity={trackingCity}
          trackingService={trackingService}
          trackingPageType={trackingPageType}
        />
      }
      ctaTitle="Schedule Your Free Inspection Today!"
      ctaDescription="Click the button below to fill out a quick form, and we'll contact you within 24 hours."
      ctaButton={
        <FooterCTAButton
          contactHref={contactHref}
          trackingSection={trackingSection}
          trackingCity={trackingCity}
          trackingService={trackingService}
          trackingPageType={trackingPageType}
        />
      }
      email={
        <a
          href={CLIENT.contact.emailHref}
          className="text-body font-body text-default-font hover:underline"
          data-event="click_email"
          data-label="footer-email"
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
        >
          {CLIENT.contact.email}
        </a>
      }
      /*
        ⚠️ ALL THREE PARTS OF THIS ANCHOR ARE LOAD-BEARING for Google Ads
        call tracking (root §8.9's swap-compatibility rule, §13.5.6):

          1. <a href={CLIENT.contact.phoneTel}> — a <button> cannot hold an
             href and will not dial.
          2. <span className="phone-number">{CLIENT.contact.phoneDisplay}</span>
             — the number must be VISIBLE RENDERED TEXT. The "Calls from
             website" script scans text nodes; href, aria-label, sr-only and
             pseudo-element content are all invisible to it, so an icon-only
             or "Call Now"-only button silently drops the qualified-call
             signal with no error anywhere.
          3. Both values from CLIENT.contact, never hardcoded — the display
             string must match the number configured in the Ads conversion
             action EXACTLY or the swap does not fire.

        data-event="click_call" feeds the separate Secondary tap conversion
        via the global click bridge. The two are independent measurement
        systems for the same call and their counts do not reconcile (§8.9).
      */
      phone={
        <a
          href={CLIENT.contact.phoneTel}
          className="text-body font-body text-default-font hover:underline"
          data-event="click_call"
          data-label="footer-phone"
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
          aria-label={`Call now ${CLIENT.contact.phoneDisplay}`}
        >
          <span className="phone-number">{CLIENT.contact.phoneDisplay}</span>
        </a>
      }
      /*
        addressLine2 previously read "Available 24/7". REMOVED, not
        reworded — EBS has no emergency line and all 24-7 copy is on the
        CLAIMS REGISTER's MUST-NOT-SHIP list. This is the footer, so the
        claim was shipping on EVERY route. The slot now carries the
        service area, which is a fact config already holds.
      */
      addressLine1={`${CLIENT.geo.hqCity}, ${CLIENT.geo.hqState}`}
      addressLine2={CLIENT.geo.serviceArea}
      copyright={`© ${new Date().getFullYear()} ${CLIENT.business.name}. All rights reserved.`}
      designerName={
        <a
          href="https://nadmarketing.com"
          target="_blank"
          rel="noreferrer"
          className="underline"
          data-event="click_nav_link"
          data-label="footer-designer-nad-marketing"
          data-section={trackingSection}
          data-city={trackingCity}
          data-service={trackingService}
          data-page-type={trackingPageType}
        >
          NAD Marketing
        </a>
      }
    />
  );
}
