import React from "react";

import NavbarTwoTierWrapper from "../sections/NavbarTwoTierWrapper";
import HeroFormCardWrapper from "../sections/HeroFormCardWrapper";
import HeroEstimateFormWrapper from "../sections/HeroEstimateFormWrapper";
import TrustBadgesWrapper from "../sections/TrustBadgesWrapper";
import AboutUsVariant2 from "../sections/AboutUsVariant2";
import OurProcessStepsWrapper from "../sections/OurProcessStepsWrapper";
import BusinessStatisticsWrapper from "../sections/BusinessStatisticsWrapper";
import ServiceGuaranteeAndFeaturesWrapper from "../sections/ServiceGuaranteeAndFeaturesWrapper";
import FullStretchFaqWrapper from "../sections/FullStretchFaqWrapper";
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
      {/* Top navigation — sticky two-tier header, IN FLOW: the hero below
          starts UNDER it rather than behind it, so the clearance spacer and
          the heroBehind prop that suppressed it are both gone. The wrapper
          renders its own <header> landmark and must be a direct child of
          <main> — a wrapper element of its own height would give
          position:sticky nothing to travel inside (see the file header).
          id="top" is kept from the <header> that stood here. */}
      <NavbarTwoTierWrapper id="top" {...TRACKING} />

      {/* Hero — background layer + heading + subheading + the centred
          foreground card, which is the three-step estimate form passed
          through the wrapper's `card` slot. The form owns the card surface
          and reports as its own section (hero-form) with its own formId, so
          it never collides with the page's bottom form (contact-form,
          #home-contact). The hero wrapper owns its own <section>, so
          id="hero" sits on it rather than nesting a section in a section
          (nothing links to #hero — checked). HeroWrapper.tsx (the
          three-slide carousel) is kept on disk, no longer composed. */}
      <HeroFormCardWrapper
        id="hero"
        card={<HeroEstimateFormWrapper {...TRACKING} />}
        {...TRACKING}
      />

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
          benefit tiles all live in the section further down now.

          REPLACED 2026-09-03 (second session): the file is now
          AboutUsVariant2.tsx — a plain two-column block, photo placeholder
          left, very large headline + the intake founding story right.
          STRUCTURE ONLY; the background/styling pass is next.
          AboutUsVariant1.tsx is kept on disk with no consumer.
          ⚠️ It still EMITS data-section="service-guarantee"; the tracking
          key was deliberately not renamed with the file, and not with the
          variant either.

          Surfaces, for now: trust-badges above is bg-default-background,
          this block is plain white, and the services grid below is ALSO
          white — so there is currently NO seam between this section and
          the grid. That is expected until the styling pass gives this
          block its own ground; re-check the seam then. */}
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
        <AboutUsVariant2 {...TRACKING} />
      </section>

      {/* How it works — the five-step process, HORIZONTAL.

          NEW 2026-09-04. The same component /contact uses, mounted a
          second time with layout="row": full container width, headline
          left / intro right, five steps across one connector rail, centred
          CTA, white ground. /contact keeps layout="column" (the default)
          because a sticky contact form owns the right half of the section
          on that page. The five STEPS and their icons are shared.

          Placed HERE, between the company story and the service list,
          because it answers the question those two create: the About band
          says who Ed is and the grid says what he sells — this says what
          actually happens if you call, which is the objection sitting
          between them on a paid-traffic landing page.

          NO id WRAPPER, and that is checked rather than assumed: nothing
          in src/ links to #our-process. The anchor exists only on the
          /contact builder wrapper, where it is likewise unreferenced.
          Adding one here would emit a second dead anchor — root §6.6.1.

          ctaHref points at this page own bottom form (#home-contact),
          the same anchor the gallery CTA uses, rather than the wrapper
          default of #contact-info-form which exists only on /contact.

          Surfaces: AboutUsVariant2 above is --color-default-font at md+,
          the grid below is --color-ground-concrete. The wrapper paints
          itself white in row mode for exactly that pair; if this section
          ever moves, re-derive the ground rather than trusting this note. */}
      <OurProcessStepsWrapper layout="row" ctaHref="#home-contact" {...TRACKING} />
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
        {/* surface="paper", NOT a className override, and the wrapper's prop
            comment carries the full reasoning. Short version: it sets the
            ground AND the folded-paper crease sheet together, because they
            are not independent — the crease layers are mix-blend-multiply and
            take their hue from the ground beneath, and they need
            `relative isolate` on the section root to blend against it rather
            than against whatever the page painted below.

            HOME ONLY — this wrapper is also mounted on /contact, which keeps
            the plain page background. Same reasoning as the md:pb-14 above.

            ⚠️ TWO CONSEQUENCES, both intended, both asked for on 2026-09-04:
            · There is now NO seam between this section and
              ServiceGuaranteeAndFeaturesWrapper directly below — both are
              bg-white and they run as one continuous field. Matching the map
              section's ground was the request.
            · The wrapper wears --site-tex-creases-ALT, not the `creases`
              sheet the map section wears, and that is deliberate: global.css
              keeps three arrangements precisely so two sections do not wear
              the identical sheet, and these two are adjacent with no seam,
              which is the worst case for it. `creases-alt` is free on this
              page only because its other consumer, TallServicesBenefitsCards,
              is mounted on the service and city routes and never on home. */}
        <PortfolioGalleryWrapper
          className="md:pb-14"
          surface="paper"
          ctaHref="#home-contact"
          {...TRACKING}
        />
      </section>

      {/* Reviews — REMOVED for this client (decision 5, 2026-09-03): Ed's
          has no reviews, and the register bans placeholders. Re-add
          ReviewsCarouselWrapper here (and the footer's "Reviews" link) only
          with real, permissioned reviews in its REVIEWS array. */}

      {/* Guarantee + features */}
      {/* Holds the map, so this is what the footer's "Service Area" link
          should reach — see the swap note above. */}
      <section id="service-area" className="w-full">
        <ServiceGuaranteeAndFeaturesWrapper {...TRACKING} />
      </section>

      {/* FAQ — the same accordion /about carries, mounted a second time.

          NEW 2026-09-04, placed directly under service-area by request. It
          answers the leftover objections ("are estimates free", "do you
          serve my address", "are you insured") at the point the coverage
          section has just made the visitor consider calling, and before the
          stats band closes the page out.

          NO id WRAPPER, and that is checked rather than assumed: nothing in
          src/ links to #faq — /about's own <section id="faq"> is itself an
          unreferenced anchor. The wrapper defaults `id` to undefined, so
          adding one here would only emit a second dead anchor (root
          §6.6.1). It DOES self-default trackingSection="faq", which is
          unique on this page.

          NO PROPS BEYOND TRACKING, deliberately: the wrapper's heading and
          `defaultFaqItems` read from CLIENT and ARE the live copy on both
          routes (root §13.3.8). Edit them in the wrapper, not here — and
          note that any edit there now changes /about and the home page
          together, which is the intent (one answer, two surfaces) but is
          worth knowing before rewording anything.

          Surfaces: service-area above is bg-white and the stats band below
          is --color-default-font (near-black), so this section's
          bg-default-background sits between a white ground and a dark one —
          the same white-above pairing it already has on /about, where
          OfferShowCaseWrapper is likewise bg-white. Both this section and
          service-area carry creases textures, but on different grounds, so
          the seam survives. If this block moves, re-derive that rather than
          trusting this note. */}
      <FullStretchFaqWrapper {...TRACKING} />

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