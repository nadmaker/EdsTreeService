import React from "react";

import NavbarMainWrapper from "../sections/NavbarMainWrapper";
import HeroWrapper from "../sections/HeroWrapper";
import TrustBadgesWrapper from "../sections/TrustBadgesWrapper";
import AboutUsVariant1 from "../sections/AboutUsVariant1";
import BusinessStatisticsWrapper from "../sections/BusinessStatisticsWrapper";
import ReviewsCarouselWrapper from "../sections/ReviewsCarouselWrapper";
import ServiceGuaranteeAndFeaturesWrapper from "../sections/ServiceGuaranteeAndFeaturesWrapper";
import ServicesGridSectionWrapper from "../sections/ServicesGridSectionWrapper";
import PortfolioGalleryWrapper from "../sections/PortfolioGalleryWrapper";
import ContactFormWrapper from "../sections/ContactFormWrapper";
import FooterSection from "../sections/FooterSection";
import { CLIENT } from "../config/client.config";

/**
 * ExteriorBuilderServices — Home Page Builder
 * - Composition only (wrappers control layout + styling)
 * - Global typography + theme tokens handled via:
 *   Layout.astro bodyClass="theme-ebs ..."
 *   styles/global.css (VariantMaker1 token overrides + prose baseline)
 */
/*
  Page-level tracking context, spread into every tracked wrapper.
  Most wrappers do NOT default trackingCity, so omitting it here means
  the page emits no data-city at all and every event from it drops out
  of any city-keyed analytics join (client CLAUDE.md §3.7 defect 3).
*/
const TRACKING = {
  trackingCity: CLIENT.geo.trackingCity,
  trackingService: CLIENT.service.trackingSlug,
  trackingPageType: "home",
} as const;

export default function HomePage() {
  return (
    <main className="w-full">
      {/* Top navigation */}
      {/* heroBehind: the hero below is full-bleed and runs to y=0 behind the
          fixed navbar, padding its own copy clear of it — so the navbar must
          NOT render its desktop clearance spacer here. */}
      <header id="top" className="w-full">
        <NavbarMainWrapper heroBehind {...TRACKING} />
      </header>

      {/* Hero */}
      <section id="hero" className="w-full">
        <HeroWrapper {...TRACKING} />
      </section>

      {/*
        Section order is INTENT-ORDERED, not arbitrary. This page is both
        the home page and the paid-traffic landing page, so each section
        answers the next question a high-intent visitor actually has:

          hero          what is this / the offer
          trust-badges  why should I keep reading?
          about/guarantee who are you, what is my risk?
          services      what exactly do you do?
          portfolio     is your work any good?
          reviews       does anyone vouch for you?
          map+benefits  do you come to me, and why you?
          stats         are you established?
          contact       how do I start

        HISTORY, because this pair has now moved twice and the reasoning
        reversed:

        2026-08-27 — services and service-area exchanged places, so the
        page led with what EBS SELLS rather than where it travels. The
        argument was that on paid traffic the ad already implied the
        service, making "is this the right company" the first real
        question rather than "do you drive here".

        2026-08-30 — service-area moved back above the services grid by
        request. It now also carries the "20 Years / About Us" block, so it
        reads as the company introduction rather than purely a coverage
        answer, which is a better fit before the service list than after
        the proof sections.

        Surfaces were re-checked at the new positions rather than assumed,
        because they are positional here (see the notes on each block).
        Nothing needed repainting: service-area's photo bottom meets the
        services grid's white, and the grid's white still separates it from
        the off-white portfolio below.

        A "counties served" section used to sit under service-area. It was
        removed by request — it restated what service-area already answers.
        Nothing linked to its #counties anchor, so no links broke.
      */}

      {/* Trust badges — a scrolling strip of the four cleared claims.
          No id wrapper here: TrustBadgesWrapper defaults id="trust-badges"
          on its OWN root, so wrapping it would emit the anchor twice
          (root §6.6.1 direction 1) — the same bug this page already hit
          with #services and #home-contact. */}
      <TrustBadgesWrapper {...TRACKING} />

      {/* Company story / About / guarantee — answers "who are you".
          MOVED ABOVE THE SERVICES GRID 2026-08-30 by request.

          RENAMED 2026-08-31: this was ServiceAreaWrapper_v1_1, a name left
          over from content that moved out of it — the map, contact rows and
          benefit tiles all live in the section further down now. The file is
          AboutUsVariant1.tsx. ⚠️ It still EMITS data-section="service-guarantee";
          the tracking key was deliberately not renamed with the file.

          Surfaces still work at the new position, checked rather than
          assumed. The section opens on solid white and lets the photo
          emerge as you read down, so its BOTTOM edge is photo and meets
          the services grid's bg-white as a clear seam. Above it,
          trust-badges is bg-default-background, so the entry is off-white
          into white — a softer line than the hero photo this scrim was
          originally drawn against, but still a change of tone. */}
      {/* ⚠️ ANCHOR CORRECTED 2026-08-30. This was id="service-area", but
          FooterSection links "Service Area" at #service-area and this
          wrapper holds the COMPANY STORY — the map lives in the section
          below. The footer link therefore landed on the wrong block on
          every page. The two ids were swapped rather than the footer href
          changed, so the anchor still reads like the link that targets it.
          Nothing links to #guarantee, so taking that name here breaks
          nothing (checked: zero references). Root §6.6.1 — neither wrapper
          self-defaults an id, so these <section> wrappers ARE the anchors
          and cannot be dropped. */}
      <section id="guarantee" className="w-full">
        <AboutUsVariant1 {...TRACKING} />
      </section>

      {/* Services grid — answers "what exactly do you do".
          No id here: ServicesGridSectionWrapper already defaults
          id="services" on its OWN root, so wrapping it in a section with
          the same id emitted #services TWICE — invalid HTML, and the
          browser jumps to whichever comes first. Root §6.6.1 direction 1.
          Pre-existing; found by running the anchor inventory during the
          section reorder.

          Surface: this wrapper renders bg-white rather than its original
          off-white, because the two sections beneath it (portfolio,
          reviews) are both bg-default-background. Off-white here would
          have produced three identical bands with no seam.

          ⚠️ Its job changed on 2026-08-30 without its value changing. The
          white used to be the ONLY seam between the off-white badge strip
          above and the off-white portfolio below. Now service-area sits
          between the badges and this grid, so the white separates a photo
          edge from off-white instead. Still load-bearing, still white —
          but if this section moves again, re-derive that rather than
          trusting the old reasoning. */}
      <section className="w-full">
        <ServicesGridSectionWrapper {...TRACKING} />
      </section>

      {/* Portfolio gallery — proof of work before proof from people */}
      {/* ⚠️ md:pb-14 is passed HERE rather than changed in the wrapper, and
          that is the whole point of doing it this way. The gallery's own
          md:py-28 stacked against the reviews section's matching md:py-28 for
          a 224px desktop gap, which read as a hole in the page. This trims the
          gallery's half to 56px; ReviewsCarouselWrapper gives up the matching
          56px on its top edge.

          But PortfolioGalleryWrapper is also used on /contact, where it is the
          LAST section before the footer and its full bottom padding is doing
          real work. Editing the wrapper's default would have quietly tightened
          that page too, for a complaint that was only ever about the home
          page. Overriding at the call site keeps the fix where the problem is.

          This relies on Tailwind sorting side utilities (pb-*) after axis
          utilities (py-*), so the later rule wins — verified in the built CSS,
          not assumed. */}
      <section id="portfolio-gallery" className="w-full">
        <PortfolioGalleryWrapper
          className="md:pb-14"
          ctaHref="#home-contact"
          {...TRACKING}
        />
      </section>

      {/* Reviews */}
      <section id="reviews" className="w-full">
        <ReviewsCarouselWrapper {...TRACKING} />
      </section>

      {/* Guarantee + features */}
      {/* Holds the map, so this is what the footer's "Service Area" link
          should reach — see the swap note above. */}
      <section id="service-area" className="w-full">
        <ServiceGuaranteeAndFeaturesWrapper {...TRACKING} />
      </section>

      {/* Stats */}
      <section id="stats" className="w-full">
        <BusinessStatisticsWrapper {...TRACKING} />
      </section>

      {/* Contact.
          No id here either — ContactFormWrapper defaults
          id="home-contact" on its own root. Same duplicate-anchor bug as
          the services grid above; this one matters more because
          #home-contact is the most-linked anchor on the site. */}
      <section className="w-full">
        <ContactFormWrapper {...TRACKING} />
      </section>

      {/* Footer */}
      <footer className="w-full">
        <FooterSection {...TRACKING} />
      </footer>
    </main>
  );
}