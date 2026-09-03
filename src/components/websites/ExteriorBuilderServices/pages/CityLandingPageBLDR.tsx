"use client";

import NavbarMainWrapper from "../sections/NavbarMainWrapper";
import Landing1HeroWrapper from "../sections/Landing1-HeroWrapper";
import LandingContactForm from "../sections/LandingContactForm";
import CredentialBandWrapper from "../sections/CredentialBandWrapper";
import TallServicesBenefitsCards from "../sections/TallServicesBenefitsCards";
import CenteredCopyAreaWrapper from "../sections/CenteredCopyAreaWrapper";
import LandingServicesListWrapper from "../sections/LandingServicesListWrapper";
import ServiceGuaranteeAndFeaturesWrapper from "../sections/ServiceGuaranteeAndFeaturesWrapper";
import FooterSection from "../sections/FooterSection";

import type { CityLandingPageData } from "./cityLandingData";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

interface CityLandingPageBLDRProps {
  page: CityLandingPageData;
}

/**
 * Canonical tracking slug for a city: kebab-case city plus the state
 * suffix, e.g. "Mount Olive" -> "mount-olive-nc".
 *
 * The state suffix is NOT cosmetic. CLIENT.geo.trackingCity is
 * "faison-nc", so without it the site emitted two different city-slug
 * schemes at once — "faison-nc" from every non-landing page and a bare
 * "clinton" from the landings — and nothing keyed on city grouped
 * cleanly (client CLAUDE.md §3.7 defect 2).
 *
 * Safe to change right now ONLY because EBS has no GTM container yet and
 * therefore no history to break. Once traffic exists this slug is frozen:
 * changing it splits every city-keyed series at the deploy boundary.
 */
function normalizeTrackingCity(city: string) {
  const slug = city.trim().toLowerCase().replace(/\s+/g, "-");
  return `${slug}-${CLIENT.geo.hqState.toLowerCase()}`;
}

export default function CityLandingPageBLDR({
  page,
}: CityLandingPageBLDRProps) {
  const trackingCity = normalizeTrackingCity(page.city);
  const trackingService = CLIENT.service.trackingSlug;
  const trackingPageType = "city-landing";
  const contactHref = `#${page.contactAnchorId}`;

  return (
    <>
      {/* Global.
          heroBehind: Landing1HeroWrapper is full-bleed and runs to y=0 behind
          the fixed navbar, padding its own copy clear of it — so the navbar
          must NOT render its desktop clearance spacer here. */}
      <NavbarMainWrapper
        quoteHref={contactHref}
        heroBehind
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* Hero */}
      <Landing1HeroWrapper
        title={
          <>
            {page.heroTitleLine1} <br />
            {page.heroTitleLine2}
          </>
        }
        subtitle={page.heroSubtitle}
        backgroundImage={page.heroImage}
        imageAlt={page.heroImageAlt}
        primaryCtaHref={contactHref}
        trackingSection="hero"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* Conversion funnel */}
      <LandingContactForm
        id={page.contactAnchorId}
        formId={page.formId}
        formName={page.formName}
        siteKey={CLIENT.siteKey}
        trackingSection="contact-form"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
        pageSlug={page.slug}
      />

      {/* MOVED HERE 2026-09-01 by request — it previously sat between
          why-choose-us and landing-services, near the bottom of the page.
          It now introduces the city directly under the contact form and
          ahead of the offer carousel.

          ⚠️ THIS SEPARATED IT FROM landing-services, which was split
          off it earlier the same day and still carries the 720px measure
          that pairs with this section. They are no longer adjacent, so the
          "continuing column" reading is gone — deliberate, and the reason
          the split was worth doing: the two halves can now be placed
          independently. Both still share the measure, so a change to one
          still needs the same change to the other.

          SEAM: none needed. LandingContactForm above is white and this
          section is white, so the top edge carries no step — but the
          eyebrow/title stack reads as its own block without a rule. Below
          is now the credential band, whose brand-primary fill is the
          strongest luminance step on the page and needs no help.
          ⚠️ This note used to name OfferShowCase as the section
          below; that MIGRATED to /about on 2026-09-01. Re-check by LOOKING
          if either neighbour changes ground — a computed-style check
          cannot see a neighbour that paints its surface with child
          layers. */}
      <CenteredCopyAreaWrapper
        mainTitle={page.centeredCopyMainTitle}
        subtitle={page.centeredCopySubtitle}
        introDescription={page.centeredCopyIntroDescription}
        ctaHref={contactHref}
        trackingSection="centered-copy"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* Added 2026-09-01, by request. ⚠️ Its neighbour above is now
          centered-copy — this note used to say "the offer carousel", which
          MIGRATED to /about on 2026-09-01. SEAM: it needs none either way —
          brand-primary between a white section above and #F5F8FB below is
          the strongest luminance step on the page, which is the point of a
          band, and the section above is white in both arrangements. */}
      <CredentialBandWrapper
        trackingSection="credential-band"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* Added 2026-08-31, by request — the same benefit cards the service
          pages carry, directly beneath the offer carousel.

          SEAM: the credential band above and landing-services below
          bracket this section, and landing-services is bg-white, so this
          band would vanish into a continuous white run without a ground of
          its own. ⚠️ This comment used to name CenteredCopy as the
          section below; that moved above the offer carousel on 2026-09-01
          and landing-services took its place. The reasoning is unchanged —
          the neighbour below is still white — but check the actual
          neighbours before trusting a seam note after any reorder. bg-default-background is EBS's off-white
          (#F5F8FB) and is what the other tinted bands on the site use.

          LAYOUT: the service pages render this inside a ~720px column with
          no padding of its own, which is why the component defaults to
          max-w-[720px] and an empty padY. Here it is a full-width band, so
          the container, padding and a 3-up card grid are passed explicitly
          rather than being baked into the component — the service pages must
          not move. */}
      <TallServicesBenefitsCards
        /* WHITE + the folded-paper VARIANT, not the blue-tinted
           bg-default-background this used to carry. The tint is gone by
           request; the surface replaces it so the band still reads as its
           own step between the credential band above and centered-copy
           below.
           ⚠️ The cards inside are bg-white with a border and shadow, which
           is what keeps them legible on a white ground — the texture around
           them is interrupted by the card, which is the same way the
           contact-form card reads on its textured ground. Do not remove
           their border. */
        textured
        className="bg-white px-6 md:px-10"
        padYClassName="py-16 md:py-24"
        contentMaxWidthClassName="mx-auto max-w-[1280px]"
        /* LEFT-ALIGNED NARROW BLOCK, by request. The container stays 1280 and
           centred so the block's left edge lines up with every other section
           on the page; the block itself caps at 720 and sits against that
           edge, leaving the right half open.
           Cards are therefore STACKED, not 3-up: a 720px column would give
           three ~229px cards, and 219px already measured too tight for a
           48px icon plus its text when this was briefly a md:grid-cols-3. */
        blockMaxWidthClassName="w-full max-w-[720px]"
        cardsLayoutClassName="flex w-full flex-col gap-4"
        trackingSection="why-choose-us"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* SPLIT OUT of CenteredCopyAreaWrapper 2026-09-01 by request: that
          section carried a header block and a "Services We Offer" list below
          a hairline, and the two are now separate sections. This one is
          everything from that heading down.

          ⚠️ NO LONGER ADJACENT TO ITS OTHER HALF. An earlier version of
          this comment said the order was load-bearing and that this must sit
          immediately after the header section. That was superseded within the
          same day: centered-copy was moved above the offer carousel by
          request, which is precisely what splitting them made possible. The
          two still share the 720px measure, so a change to one still needs
          the same change to the other — but they no longer read as one
          continuing column and nothing requires them to be neighbours.

          Its top hairline now divides it from the TEXTURED why-choose-us band
          rather than from the header block it was drawn for. Kept because a
          rule still reads correctly there, but it is doing a different job.

          New section name, NOT a reuse of the home page's `services`: that
          grid is a set of links emitting select_service per card, while
          these are static <li> with no href and no events. */}
      <LandingServicesListWrapper
        trackingSection="landing-services"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      {/* ctaHref removed: this section's "Get a Free Estimate" button was
          deleted when its feature tiles were swapped into AboutUsVariant1
          (named ServiceAreaWrapper_v1_1 at the time).
          The section now renders the map / contact / service-areas block and
          has no CTA of its own. */}
      <ServiceGuaranteeAndFeaturesWrapper
        trackingSection="map-and-benefits"
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

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
