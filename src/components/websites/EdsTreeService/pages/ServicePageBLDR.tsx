"use client";

import React from "react";

import NavbarMainWrapper from "../sections/NavbarMainWrapper";
import ServiceONEHeroWithRatingsWrapper from "../sections/ServiceONEHeroWithRatingsWrapper";

import TallContentTruTempWrapper from "../sections/serviceOnecaption-photoWrapper";
import TallServicesBenefitsCards from "../sections/TallServicesBenefitsCards";
import ServiceONEProcessAccordionWrapper from "../sections/ServiceONEProcessAccordionWrapper";
import ServiceONEtallLocationWrapper from "../sections/ServiceONEtallLocationWrapper";
import ServiceONEFaqWrapper from "../sections/ServiceONEFaqWrapper";

import RightRailContactFormStickyWrapper from "../sections/RightRailContactFormStickyWrapper";
import FooterSection from "../sections/FooterSection";

import type { ServicePageData } from "./servicePageData";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

interface ServicePageBLDRProps {
  page: ServicePageData;
}

/** Derived, never typed — a hardcoded year rots silently. */
const YEARS_IN_BUSINESS =
  new Date().getFullYear() - CLIENT.business.yearFounded;

/** Real EBS service lines, matching the seven /services/* routes. */
const HERO_CAPABILITIES = [
  "Residential",
  "Commercial",
  "Removal",
  "Trimming",
  "Stump Grinding",
] as const;

/**
 * Every one of these is CLEARED in the register
 * (EBS_HANDOFF_Step0-Step1.md §3): licensed/bonded/insured is
 * owner-confirmed, free estimates is the configured offer, and family-run
 * and locally owned since yearFounded is cleared.
 * ⚠️ Do NOT add a response-time, availability or payment-terms chip here.
 */
const HERO_ASSURANCES = [
  "Bonded & Insured",
  "Free Estimates",
  `Family-Run for ${YEARS_IN_BUSINESS}+ Years`,
] as const;

function normalizeTrackingService(service: string) {
  return service.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export default function ServicePageBLDR({ page }: ServicePageBLDRProps) {
  const trackingService = normalizeTrackingService(page.service);
  const trackingPageType = "service";
  const trackingCity = CLIENT.geo.trackingCity;
  const contactHref = `#${page.contactAnchorId}`;

  return (
    <>
      <NavbarMainWrapper
        quoteHref={contactHref}
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* TitleHeadingBlock REMOVED 2026-09-01 by request — the service page
          now opens directly on the photo hero. Safe to drop, checked against
          root §6.6.1 before removing: it was passed no `id`, so no anchor
          pointed at it, and it emitted no `data-section`, so no view_section
          series ends here.

          ⚠️ `TitleHeadingBlock.tsx` now has NO CONSUMER anywhere;
          the file is kept, same as CountiesServedWrapper.

          `headingTitle` and `headingSubtitle` were briefly left with no
          reader by this removal. They are READ AGAIN, by the hero overlay
          directly below — which is why no third title field was added to
          ServicePageData. Both are live data again; edit them and the hero
          changes.

          The h1 that TitleBlock1_1 never actually provided (it rendered a
          <span>, so service pages had ZERO h1) now lives on the hero. */}

      {/* Per-service hero photo. This wrapper previously took NO props at
          all, so all seven service pages rendered the same hardcoded
          background — which pointed at a file that does not exist. The
          photo is per-service data now (root §9.3: anything that varies per
          service belongs in servicePageData, not in a wrapper default). */}
      {/* H1 OVERLAY, 2026-09-01. This band now carries the page's only
          <h1>; there was none on any service route before, because the
          removed title block rendered a <span>.

          The h1 composes `headingTitle` with the SEO region label rather
          than reusing `captionTitle` ("Roof Replacement in Eastern North
          Carolina"), which is already the <h2> on the caption block below —
          reusing it would put the same string in both.

          ⚠️ `assurances` are CLEARED CLAIMS ONLY. The reference this was
          styled from offered "24 Hour Estimates" and "No Upfront Costs";
          both were dropped, not reworded — see the wrapper's header. Years
          are DERIVED from yearFounded, never typed. */}
      <ServiceONEHeroWithRatingsWrapper
        backgroundImage={page.heroImage}
        imageAlt={page.heroImageAlt}
        title={`${page.headingTitle} in ${CLIENT.seo.regionLabel}`}
        subtitle={page.headingSubtitle}
        capabilities={HERO_CAPABILITIES}
        assurances={HERO_ASSURANCES}
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[60%_40%]">
            <div className="order-2 min-w-0 space-y-16 lg:order-1">
              <TallContentTruTempWrapper
                headline={page.captionTitle}
                paragraph={page.captionDescription}
                trackingCity={trackingCity}
                trackingService={trackingService}
                trackingPageType={trackingPageType}
              />
              {/* Gains the tracking contract 2026-08-31. This rendered with
                  NO props at all and emitted no data-section, so it was
                  invisible to section-level analytics on all seven service
                  pages (client §3.3). Same section name as the city
                  landings, since it is the same block. */}
              <TallServicesBenefitsCards
                trackingSection="why-choose-us"
                trackingCity={trackingCity}
                trackingService={trackingService}
                trackingPageType={trackingPageType}
              />
              {/* Gains the tracking contract 2026-09-02, the same change and
                  for the same reason as TallServicesBenefitsCards above: it
                  rendered with NO PROPS AT ALL, so it emitted no data-section
                  and no view_section on any of the seven service routes.

                  ⚠️ Passing props here is ALSO what stops its defaults being
                  invisible content. While the builder passed nothing, root
                  §13.3.8's inverse held: the wrapper's own defaults were the
                  live copy, which is how the previous client's tree-service
                  process survived on this page type. Section name `process`
                  is new — no existing series to match. */}
              <ServiceONEProcessAccordionWrapper
                trackingSection="process"
                trackingCity={trackingCity}
                trackingService={trackingService}
                trackingPageType={trackingPageType}
              />
              {/* Gains the tracking contract 2026-09-02 — the LAST of the
                  three service-page wrappers that rendered with no props at
                  all, after TallServicesBenefitsCards and
                  ServiceONEProcessAccordionWrapper above.

                  ⚠️ Root §13.3.8's inverse was worst here. While the builder
                  passed nothing, this wrapper's defaults served the PREVIOUS
                  CLIENT's Google My Maps iframe of the Raleigh-Durham
                  Triangle, the label "RDU TRIANGLE, NC" and ten Triangle city
                  chips on all seven service routes. The iframe, the mid, the
                  label and the city array are gone; the map is now
                  ServiceAreaGoogleMap and the towns come from CLIENT.geo.

                  Section name `service-area` is new — the 2026-09-02 grep of
                  every existing trackingSection found no service-area series.
                  `map-and-benefits` is NOT a match: that is
                  ServiceGuaranteeAndFeaturesWrapper, a different block on
                  home and the city landings. */}
              <ServiceONEtallLocationWrapper
                trackingSection="service-area"
                trackingCity={trackingCity}
                trackingService={trackingService}
                trackingPageType={trackingPageType}
              />

              {/* FAQ, directly under the service-area map and inside the
                  same 60% column, so it left-aligns with every sibling
                  above it and clears the right-rail form. It renders no
                  width or padding of its own — the column owns both and
                  space-y-16 owns the gap.

                  Section name `faq` is REUSED from /about rather than
                  invented; page_type separates the two, same as
                  why-choose-us is shared across city landings and service
                  pages (client §3.3). Passing the context explicitly is
                  required, not optional: the wrapper emits NOTHING unless
                  trackingSection arrives. */}
              <ServiceONEFaqWrapper
                trackingSection="faq"
                trackingCity={trackingCity}
                trackingService={trackingService}
                trackingPageType={trackingPageType}
              />
            </div>

            <div className="order-1 min-w-0 lg:order-2">
              <div className="lg:hidden">
                <RightRailContactFormStickyWrapper
                  id={page.contactAnchorId}
                  formId={page.formId}
                  formName={page.formName}
                  trackingSection="service-contact-form"
                  trackingCity={trackingCity}
                  trackingService={trackingService}
                  trackingPageType={trackingPageType}
                  pageSlug={page.slug}
                />
              </div>

              {/* Sticky offset must clear the FIXED navbar, not just sit
                  below the old in-flow one. Was lg:top-24 (96px), which the
                  pinned bar now overlaps. Driven by the shared clearance
                  token plus 1rem of breathing room. */}
              <div className="hidden lg:block lg:sticky lg:top-[calc(var(--site-nav-clearance)+1rem)]">
                <RightRailContactFormStickyWrapper
                  formId={page.formId}
                  formName={page.formName}
                  trackingSection="service-contact-form"
                  trackingCity={trackingCity}
                  trackingService={trackingService}
                  trackingPageType={trackingPageType}
                  pageSlug={page.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection
        contactHref={contactHref}
        trackingSection="footer"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />
    </>
  );
}
