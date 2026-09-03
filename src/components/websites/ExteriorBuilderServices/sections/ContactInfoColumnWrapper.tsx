/**
 * ContactInfoColumnWrapper — the STATIC left column of /contact's contact
 * band: heading, description, and the phone / email / office-hours rows.
 *
 * Split out of ContactInfoFormWrapper on 2026-09-02. That wrapper rendered
 * both halves inside the Subframe parent `Infoand_ContactForm`, which owned
 * the two-column layout AND the dark ground in one element. That made the
 * requested behaviour impossible rather than merely awkward: the form now has
 * to be `position: sticky` and travel out of this section into the process
 * section below, and a sticky child can never escape its containing block.
 * Both halves had to become independent siblings for that to work, so the
 * Subframe parent was dropped — the same call already made for
 * Info_Sec1_330, AltContactForm2, RatingBadgesTruTemp and Fullstretchfaq.
 *
 * ⚠️ NO "use client", NO HOOKS, ZERO CLIENT JS. This column is static text
 * and three links; the click bridge in Layout.astro is vanilla document-level
 * delegation and does not need hydration to catch them (root §9.11). Do not
 * add a React view_section observer here — the section root that carries
 * `data-track-view` lives in the builder alongside the form.
 *
 * ⚠️ THIS COLUMN READS ON A LIGHT GROUND, and it did not always. Until
 * 2026-09-02 the band was a flat dark `bg-neutral-600` and every string
 * here was white. It is now the cast-concrete surface from the services
 * grid (#F2F5F9 + ConcreteGround), so the palette is inverted:
 *
 *     headings / labels / links   text-default-font   13.57:1
 *     body + office hours         text-neutral-600     7.15:1
 *
 * Both measured against the flat ground; the rake layer only lightens it,
 * which raises both figures. These are the SAME two values the services
 * grid uses for its own heading and caption on this identical stack —
 * matched on purpose, so the two sections read as one material.
 *
 * ⚠️ DO NOT REINTRODUCE text-white HERE, and do not tint the links gold or
 * brand-primary. White measures 1.09:1 on this ground — invisible, with no
 * error of any kind. Gold is 1.98:1, brand-primary 3.65:1 and even
 * brand-primary-hover only 4.49:1, all under the 4.5:1 bar for text this
 * size. That is why hover is expressed as opacity rather than as a colour
 * change (the idiom ServiceGuaranteeAndFeaturesWrapper already uses).
 *
 * ⚠️ THE PHONE ROW IS A SWAP-ELIGIBLE CALL SURFACE (root §8.9, §13.5.6).
 * It is an <a href="tel:"> whose child is a .phone-number span rendering the
 * number as VISIBLE TEXT, and it is unconditionally mounted. All three parts
 * are required: Google Ads' "Calls from website" script matches rendered text
 * only, so an href, an aria-label or an icon-only button are invisible to it
 * and silently drop the qualified-call signal.
 */

import React from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

export interface ContactInfoColumnWrapperProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ContactInfoColumnWrapper({
  className,
  title = "Contact Our Team",
  /* ⚠️ EBS-Contact passes no content props, so these defaults ARE the live
     copy (root §13.3.8's inverse). This one closed on "…taking great care of
     you and your trees" until 2026-09-01. */
  description = "Use the form to tell us more about your project or ask us a question, and we'll be in touch as soon as possible. Or, if you prefer, give us a call or send an email. We look forward to talking with you about your roof, siding or gutters.",
  trackingSection = "contact-info-form",
  trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "contact",
}: ContactInfoColumnWrapperProps) {
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <h2 className="font-heading-1 text-3xl font-bold uppercase leading-[1.12] text-default-font md:text-4xl">
        {title}
      </h2>

      <p className="mt-5 max-w-[52ch] font-body text-base leading-relaxed text-neutral-600">
        {description}
      </p>

      <dl className="mt-10 flex flex-col gap-6">
        <div>
          <dt className="text-sm font-bold uppercase tracking-[0.08em] text-default-font">
            Phone
          </dt>
          <dd className="mt-1">
            <a
              href={CLIENT.contact.phoneTel}
              className="font-body text-base text-default-font underline underline-offset-4 transition-opacity hover:opacity-80"
              data-event="click_call"
              data-label="contact-info-phone"
              {...tracking}
              aria-label={`Call now ${CLIENT.contact.phoneDisplay}`}
            >
              <span className="phone-number">{CLIENT.contact.phoneDisplay}</span>
            </a>
          </dd>
        </div>

        <div>
          <dt className="text-sm font-bold uppercase tracking-[0.08em] text-default-font">
            Email
          </dt>
          <dd className="mt-1">
            <a
              href={CLIENT.contact.emailHref}
              className="font-body text-base text-default-font underline underline-offset-4 transition-opacity hover:opacity-80"
              data-event="click_email"
              data-label="contact-info-email"
              {...tracking}
            >
              {CLIENT.contact.email}
            </a>
          </dd>
        </div>

        {/* ⚠️ OFFICE HOURS ARE A CLEARED, SPECIFIC FACT — not an availability
            promise. Kept verbatim from the previous section. Do NOT extend
            this into "we answer every call" or any response-time wording:
            those are OPERATIONS CLAIMS on the register and sit against the
            same 24-7 ban that removed the emergency block from this page. */}
        <div>
          <dt className="text-sm font-bold uppercase tracking-[0.08em] text-default-font">
            Office Hours
          </dt>
          <dd className="mt-1 font-body text-base text-neutral-600">
            Mon-Fri 7am to 5pm ET (Excluding holidays)
          </dd>
        </div>
      </dl>
    </div>
  );
}
