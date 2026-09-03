import React from "react";

import NavbarMainWrapper from "../sections/NavbarMainWrapper";
import ContactHeroHeader from "../sections/ContactHeroHeader";
import ConcreteGround from "../sections/ConcreteGround";
import ContactInfoColumnWrapper from "../sections/ContactInfoColumnWrapper";
import ContactRailFormWrapper from "../sections/ContactRailFormWrapper";
import OurProcessStepsWrapper from "../sections/OurProcessStepsWrapper";
import PortfolioGalleryWrapper from "../sections/PortfolioGalleryWrapper";
import OurOfficeWrapper from "../sections/OurOfficeWrapper";
import FooterSection from "../sections/FooterSection";
import { CLIENT } from "../config/client.config";

/**
 * ExteriorBuilderServices — Contact Page Builder
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
  trackingPageType: "contact",
} as const;

export default function ContactPage() {
  return (
    <main className="w-full">
      {/* Top navigation */}
      <header id="top" className="w-full">
        <NavbarMainWrapper {...TRACKING} />
      </header>

      {/* Hero */}
      <section id="hero" className="w-full">
        <ContactHeroHeader {...TRACKING} />
      </section>

      {/* ── CONTACT BAND + PROCESS, sharing ONE positioning context ──────

          ⚠️ THIS WRAPPER DIV IS THE WHOLE REASON THE STICKY FORM WORKS, and
          it is not cosmetic nesting. `position: sticky` can never escape its
          containing block. The form has to travel out of the contact section,
          down across the process section, and stop at the bottom of it — so
          the element it sticks inside must span BOTH. Two sibling <section>s,
          which is what this was, make that impossible at any amount of CSS.

          The two sections stay full-bleed so their grounds still reach the
          viewport edges (the process section paints a full-width texture).
          The form rides in an ABSOLUTELY POSITIONED TRACK laid over the right
          side of both. The track ends where this div ends, which is what
          makes the form stop at the bottom of the process section rather
          than continuing into the gallery below.

          ⚠️ BOTH SECTIONS MUST KEEP THEIR CONTENT IN THE LEFT COLUMN or it
          runs under the form. The process section is pinned to 560px by
          PROCESS_MEASURE in its own file; the contact band below uses the
          same measure. Widening either one is invisible in the diff and only
          shows up as prose sliding under the card.

          ⚠️ DESKTOP ONLY. Below lg the track is display:none and the form
          renders in flow inside the contact band instead — two DOM copies of
          the card, exactly as ServicePageBLDR does it. The anchor id is on
          the IN-FLOW copy only, so #contact-info-form always resolves to a
          form that is actually in the document flow at that breakpoint. */}
      <div className="relative">
        {/* ⚠️ data-track-view IS LOAD-BEARING. The wrapper this section
            replaced carried a React useEffect observer, and it went with it —
            leaving contact-info-form emitting NO view_section at all, with no
            build error and no console warning (root §8.2). Verified absent in
            the served HTML before this was added, and present after.
            Mechanism A rather than B: the vanilla observer in Layout.astro
            reads server-rendered DOM and fires ahead of hydration. It is safe
            here because NOTHING in this section carries a React observer any
            more — an observer alongside this attribute double-fires. */}
        <section
          id="contact-info-form"
          /* GROUND — the cast-concrete surface from the services grid, by
             request 2026-09-02. Was a flat `bg-neutral-600`.

             ⚠️ THIS INVERTED THE BAND'S POLARITY, and that is the whole
             substance of the change rather than a side effect. The old
             ground was DARK (#525252) carrying white copy; concrete is
             LIGHT (#F2F5F9). Every colour in ContactInfoColumnWrapper had
             to flip in the same commit — white text on this ground measures
             1.09:1, i.e. invisible, and nothing would have errored.

             ⚠️ `relative isolate overflow-hidden` are all three REQUIRED by
             ConcreteGround, not stylistic. Its three turbulence layers use
             mix-blend-multiply and blend with their BACKDROP; without a
             stacking context of its own that backdrop is whatever the page
             painted underneath, so the texture leaks onto the hero above.
             The content div below then needs `relative` to sit over them.

             overflow-hidden does NOT clip the sticky form: the track is a
             SIBLING of this section, further down inside the same relative
             parent, so it is outside this section's overflow box entirely.

             ⚠️ NO SEAM RULE AT THE BOTTOM, deliberately. Concrete (#F2F5F9)
             against the process section's #F5F8FB measures 1.03:1, so the
             two now read as ONE continuous wall — which is the point: the
             sticky card slides across a single surface for its whole
             travel. The services grid draws a gold `border-t` for exactly
             the opposite reason (it needs to separate from its neighbours).
             Adding one here would chop the form's travel in half. */
          className="relative isolate w-full overflow-hidden bg-[var(--color-ground-concrete)]"
          data-track-view
          data-section="contact-info-form"
          data-city={TRACKING.trackingCity}
          data-service={TRACKING.trackingService}
          data-page-type={TRACKING.trackingPageType}
        >
          <ConcreteGround />

          {/* `relative` lifts the copy above ConcreteGround's five absolute
              layers. Without it the section renders as bare concrete. */}
          <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
            <div className="w-full max-w-[560px]">
              <ContactInfoColumnWrapper {...TRACKING} />

              {/* In-flow copy, below lg only. */}
              <div className="mt-10 lg:hidden">
                <ContactRailFormWrapper id="contact-info-form-card" {...TRACKING} />
              </div>
            </div>
          </div>
        </section>

        {/* Our process steps */}
        <section id="our-process" className="w-full">
          <OurProcessStepsWrapper {...TRACKING} />
        </section>

        {/* The sticky track. inset-y-0 gives it the full height of BOTH
            sections; the sticky child then travels that whole distance and
            stops when the track scrolls past. The top offset clears the
            FIXED navbar via the shared clearance token — the same
            expression ServicePageBLDR uses, so the two sticky rails on this
            site cannot drift apart. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <div className="mx-auto flex h-full w-full max-w-[640px] justify-center px-6 md:px-10">
            <div className="pointer-events-auto sticky top-[calc(var(--ebs-nav-clearance)+1rem)] w-full self-start py-16 md:py-24">
              <ContactRailFormWrapper {...TRACKING} />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio gallery */}
      <section id="portfolio-gallery" className="w-full">
        <PortfolioGalleryWrapper {...TRACKING} />
      </section>

      {/* Office location */}
      <section id="our-office" className="w-full">
        <OurOfficeWrapper {...TRACKING} />
      </section>

      {/* Footer */}
      <footer id="footer" className="w-full">
        <FooterSection {...TRACKING} />
      </footer>
    </main>
  );
}
