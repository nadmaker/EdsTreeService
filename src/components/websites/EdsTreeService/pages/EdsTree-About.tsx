import React from "react";

import NavbarMainWrapper from "../sections/NavbarMainWrapper";
import ActionHeroHeader from "../sections/ActionHeroHeader";
import InfoImageColumnWrapper from "../sections/InfoImageColumnWrapper";
import ResidentialCommercialWrapper from "../sections/ResidentialCommercialWrapper";
import OfferShowCaseWrapper from "../sections/OfferShowCaseWrapper";
import FullStretchFaqWrapper from "../sections/FullStretchFaqWrapper";
import FooterSection from "../sections/FooterSection";
import { CLIENT } from "../config/client.config";

/**
 * ExteriorBuilderServices — About Page Builder
 * - One-off page (not reusable landing page system)
 * - Composition only (wrappers control layout + styling)
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
  trackingPageType: "about",
} as const;

export default function AboutPage() {
  return (
    <main className="w-full">
      {/* Top navigation */}
      <header id="top" className="w-full">
        <NavbarMainWrapper {...TRACKING} />
      </header>

      {/* Hero */}
      <section id="hero" className="w-full">
        <ActionHeroHeader {...TRACKING} />
      </section>

      {/* Trust headline + ratings — REMOVED for this client (decision 5,
          2026-09-03): no rating, no review count exists. */}

      {/* Service info + framed image */}
      <section id="service-info" className="w-full">
        <InfoImageColumnWrapper ctaHref="#footer" {...TRACKING} />
      </section>

      {/* Residential + commercial capability pair.

          NO wrapping id here, deliberately. Nothing links to this section,
          and the component defaults `id` to undefined rather than to a
          literal — so adding one would create an anchor with no referrer,
          while omitting it cannot break a link that does not exist
          (root §6.6.1, checked in both directions). If a nav or footer link
          to it is ever added, put the id on the COMPONENT via the prop, not
          on a wrapper here, or the two would both emit it. */}
      <ResidentialCommercialWrapper {...TRACKING} />

      {/* MIGRATED FROM THE CITY LANDINGS 2026-09-01 by request. It rendered
          on all six of them (between the contact form and the credential
          band) and renders nowhere else now — this is a MOVE, not a copy.

          ⚠️ `ctaHref` MUST be passed here. The component defaults it to
          "#landing-contact", a city-landing anchor that does not exist on
          /about — the CTA would scroll nowhere and fail silently, since a
          dead fragment link neither errors nor warns. Pointed at /contact,
          matching the ResidentialCommercial CTA directly above.

          ⚠️ THE SECTION NAME IS STILL `hero-offers`, which is now doubly
          inaccurate: it is not a hero and /about has its own. The name is a
          leftover from the home hero's offer cards, removed 2026-08-20.
          Renaming is FREE while no GTM container exists and this is the
          natural moment — left alone only because it was not asked for.

          ⚠️ Its arrow slots take a ZERO-SIZE PLACEHOLDER rather than
          null when there is one offer: the eight
          [&>div:first-child>div:nth-child(n)] overrides inside it are
          POSITIONAL, and nulling an arrow re-indexes all of them and throws
          the photo 160px off-screen. Do not tidy the placeholder away.

          ⚠️ It HYDRATES (5 useState, 4 useEffect, 6 useRef, 2 useMemo)
          and is Mechanism B — a React observer, no data-track-view. Correct
          as-is; adding the attribute alongside the observer double-fires
          view_section (root §8.2).

          Its carousel_dot / _prev / _next / _thumb events are UNIQUE on this
          page — /about carries no other carousel — unlike the home page
          where three sections emit carousel_dot. */}
      <OfferShowCaseWrapper ctaHref="/contact" {...TRACKING} />

      {/* FAQ */}
      <section id="faq" className="w-full">
        {/* Title props dropped 2026-09-01 with the section rebuild: the
            three-segment titlePrefix/Highlight/Suffix API belonged to the
            Subframe parent that was removed. The wrapper now takes a
            two-line heading and its defaults read from CLIENT, so there is
            nothing page-specific left to pass. ⚠️ Those defaults ARE the
            live copy on this route (root §13.3.8) — edit them in the
            wrapper, not here. */}
        <FullStretchFaqWrapper {...TRACKING} />
      </section>

      {/* Footer */}
      <footer id="footer" className="w-full">
        <FooterSection {...TRACKING} />
      </footer>
    </main>
  );
}
