"use client";

import React from "react";
import { TitleBlock1_1 } from "@/ui/components/TitleBlock1_1";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * Display domain, derived from config rather than hardcoded so a fork
 * cannot leave the previous client's domain in a legal document.
 */
const SITE_DOMAIN = CLIENT.business.siteUrl.replace(/^https?:\/\//, "");

export interface PrivacyPolicyWrapperProps {
  id?: string;
  className?: string;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function PrivacyPolicyWrapper({
  id = "privacy-policy",
  className,
  trackingSection = "privacy-policy",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "privacy",
}: PrivacyPolicyWrapperProps) {
  /*
    This wrapper has no hooks, so view_section uses the vanilla
    [data-track-view] observer in Layout.astro (root §8.2 Mechanism A).
    Before this, /privacy emitted NO tracking attributes at all — no
    data-section, no page_type — so the page was invisible to analytics
    (client CLAUDE.md §3.7 defect 4).
  */
  const linkTracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  return (
    <section
      id={id}
      className={className}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <TitleBlock1_1
        title="Privacy Policy"
        subtitle={`${CLIENT.business.nameLegal} — Last updated: April 11, 2026`}
      />
      <div className="flex w-full flex-col items-start gap-8 px-6 pb-12 max-w-3xl">

        {/* Who We Are */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">Who We Are</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            {CLIENT.business.nameLegal} ("we," "us," or "our") operates the website{" "}
            {SITE_DOMAIN} and associated advertising on platforms including Facebook,
            Instagram, and Google. We are committed to protecting the privacy of our
            customers and website visitors.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">Information We Collect</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            We may collect the following types of information:
          </p>
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Information you provide directly</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                When you fill out a contact form, lead form, or request a free estimate —
                whether on our website, through Facebook, or by phone — we collect your name,
                phone number, email address, and details about the tree service you need.
              </p>
            </div>
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Information collected automatically</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                When you visit our website, we may collect data such as your IP address,
                browser type, pages viewed, time spent on pages, and referring website. This
                data is collected through cookies and tracking technologies including Google
                Analytics, Google Tag Manager, and the Meta Pixel.
              </p>
            </div>
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Information from advertising platforms</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                When you interact with our ads on Facebook, Instagram, or Google, those
                platforms may share information about your interaction with us to help measure
                and improve our advertising.
              </p>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">How We Use Your Information</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="flex flex-col gap-1 mt-1 ml-5 list-disc">
            <li className="text-body font-body text-neutral-700">Contact you about the tree service estimate or inquiry you requested</li>
            <li className="text-body font-body text-neutral-700">Provide and improve our services</li>
            <li className="text-body font-body text-neutral-700">Send you follow-up communications related to your inquiry</li>
            <li className="text-body font-body text-neutral-700">Measure the effectiveness of our advertising</li>
            <li className="text-body font-body text-neutral-700">Improve our website and user experience</li>
            <li className="text-body font-body text-neutral-700">Send you promotional offers or seasonal reminders (only if you have opted in)</li>
          </ul>
          <p className="text-body font-body text-neutral-700 leading-relaxed mt-2">
            We will never sell your personal information to third parties. We do not share
            your data with unrelated businesses for their marketing purposes.
          </p>
        </div>

        {/* Cookies and Tracking */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">Cookies and Tracking Technologies</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            Our website uses cookies and similar technologies to improve your experience and
            measure site performance. These include:
          </p>
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Google Analytics (GA4)</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                Collects anonymous data about how visitors use our site. This helps us
                understand which pages are most useful and how people find us.
              </p>
            </div>
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Google Tag Manager (GTM)</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                Manages the tracking scripts on our site. It does not collect personal data
                itself but facilitates other tools.
              </p>
            </div>
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Google Ads</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                Tracks conversions from our Google search advertising to measure ad performance.
              </p>
            </div>
            <div>
              <p className="text-body-bold font-body-bold text-neutral-800">Meta Pixel</p>
              <p className="text-body font-body text-neutral-700 leading-relaxed">
                When installed, tracks conversions from our Facebook and Instagram advertising.
                This helps us show relevant ads and measure their effectiveness.
              </p>
            </div>
          </div>
          <p className="text-body font-body text-neutral-700 leading-relaxed mt-2">
            You can control cookies through your browser settings. Most browsers allow you to
            block or delete cookies. However, disabling cookies may affect your experience on
            our website.
          </p>
        </div>

        {/* How We Protect Your Information */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">How We Protect Your Information</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            We take reasonable measures to protect your personal information from unauthorized
            access, use, or disclosure. However, no method of transmission over the internet
            is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* Third-Party Links */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">Third-Party Links</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for
            the privacy practices of those sites. We encourage you to review their privacy
            policies before providing any personal information.
          </p>
        </div>

        {/* Your Rights */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">Your Rights</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            You have the right to:
          </p>
          <ul className="flex flex-col gap-1 mt-1 ml-5 list-disc">
            <li className="text-body font-body text-neutral-700">Request access to the personal data we hold about you</li>
            <li className="text-body font-body text-neutral-700">Request correction of inaccurate data</li>
            <li className="text-body font-body text-neutral-700">Request deletion of your data</li>
            <li className="text-body font-body text-neutral-700">Opt out of marketing communications at any time</li>
          </ul>
          <p className="text-body font-body text-neutral-700 leading-relaxed mt-2">
            To exercise any of these rights, contact us using the information below.
          </p>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-3 font-heading-3 text-neutral-900">Contact Us</h2>
          <p className="text-body font-body text-neutral-700 leading-relaxed">
            If you have questions about this Privacy Policy or how we handle your data, contact us at:
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-body-bold font-body-bold text-neutral-800">{CLIENT.business.nameLegal}</p>
            <p className="text-body font-body text-neutral-700">
              Email:{" "}
              <a
                href={CLIENT.contact.emailHref}
                className="text-brand-primary underline"
                data-event="click_email"
                data-label="privacy-contact-email"
                {...linkTracking}
              >
                {CLIENT.contact.email}
              </a>
            </p>
            <p className="text-body font-body text-neutral-700">
              Phone:{" "}
              <a
                href={CLIENT.contact.phoneTel}
                className="text-brand-primary underline"
                data-event="click_call"
                data-label="privacy-contact-phone"
                {...linkTracking}
                aria-label={`Call now ${CLIENT.contact.phoneDisplay}`}
              >
                {CLIENT.contact.phoneDisplay}
              </a>
            </p>
            <p className="text-body font-body text-neutral-700">
              Website:{" "}
              <a
                href={CLIENT.business.siteUrl}
                className="text-brand-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE_DOMAIN}
              </a>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
