"use client";

import React from "react";
import { Tall_LocalBenefitsSection } from "@/ui/components/Tall_LocalBenefitsSection";
import { FeatherZap, FeatherShield, FeatherCheckCircle } from "@subframe/core";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — "Why choose us" benefit cards.
 *
 * Consumed by ServicePageBLDR (all 7 /services/* routes) and, as of
 * 2026-08-31, by CityLandingPageBLDR (all 6 /service-area/* routes),
 * directly beneath the offer carousel.
 *
 * ⚠️ EVERY STRING BELOW WAS THE PREVIOUS CLIENT'S UNTIL 2026-08-31, and
 * ServicePageBLDR renders this component with NO PROPS AT ALL — so these
 * defaults are not a fallback, they are what all seven service pages
 * actually served: "WHY CHOOSE MEDRANO'S TREE SERVICE", "Licensed, insured,
 * and trusted across the RDU Triangle since 2007" (wrong region AND wrong
 * year — EBS is 2006), "Expert Arborist … ISA Certified Arborist", and a
 * "healthy tree guarantee". Adding this section to the city landings without
 * fixing them first would have put all of it onto six more routes.
 *
 * ⚠️ DO NOT look for this copy in servicePageData.tsx. `SHARED_BENEFITS`
 * there LOOKS like the source and has ZERO importers — editing it produces a
 * clean diff with no rendered effect (root §13.3.8). The two have already
 * diverged: it says "Expert Contractors" where this file served "Expert
 * Arborist". This file is the real one.
 *
 * ⚠️ CLAIMS: drawn from the CLEARED list only — licensed/bonded/insured,
 * in business since yearFounded, the credential title (an owner override,
 * see client.config.ts), and the service-guarantee name. The year and the
 * service area are DERIVED from config, never typed, so neither can rot.
 * Nothing here touches the UNVERIFIED CAPABILITIES list.
 *
 * ⚠️ ADJACENCY on the city landings: `map-and-benefits` further down the
 * same page carries a "Why Us" label over four tiles (Fast Response, Upfront
 * Pricing, Clean Worksite, Licensed & Insured). These three cards were
 * written to sit BESIDE those without restating them — crews, guarantee and
 * equipment, none of which appear in that set. If the tiles are ever
 * reworded, re-check the pair; two "why us" blocks on one page only work
 * while they say different things.
 */

export interface TallServicesBenefitsCardsProps {
  id?: string;
  className?: string;

  title?: React.ReactNode;
  description?: React.ReactNode;

  benefitCards?: React.ReactNode;

  padYClassName?: string;
  contentMaxWidthClassName?: string;

  /**
   * Layout of the card group. Default reproduces the Subframe parent's own
   * `flex flex-col gap-4`, so the service pages — where this sits in a
   * ~720px column — are unchanged.
   *
   * The city landings pass the same stacked value explicitly rather than
   * relying on the default, because the block there is also 720px wide: a
   * 3-up grid in that width gives ~229px cards, and 219px already measured
   * too tight for a 48px icon plus its text. Kept explicit so the coupling
   * to `blockMaxWidthClassName` is visible at the call site — widen the
   * block and this is the line that has to change with it.
   */
  cardsLayoutClassName?: string;

  /**
   * Width of the copy-and-cards BLOCK, inside `contentMaxWidthClassName`.
   *
   * Two width slots exist rather than one because they do different jobs:
   * the outer one positions the container (and is centred, which is what
   * fixes the block's left edge to the container's), while this one caps how
   * far the content itself runs. Collapsing them would work only until you
   * want a narrow block that still starts where a wide one would — which is
   * exactly the city-landing arrangement: 1280px container, 720px block,
   * left-aligned, open space to its right.
   */
  blockMaxWidthClassName?: string;

  /**
   * Render the folded-paper surface behind the section.
   *
   * OPT-IN, defaulting to false, because this component is shared: on the
   * seven service pages it sits inside a content column where a full-bleed
   * surface would be wrong, and only the city landings render it as a band.
   *
   * When true the section paints `--ebs-tex-creases-alt` — the VARIANT of
   * the sheet the service-area section wears, so the two bands on a city
   * landing read as one material rather than a repeated asset.
   */
  textured?: boolean;

  /** Tracking context (root §8.6). */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

function BenefitCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-neutral-900">{title}</div>
          <div className="mt-1 text-sm text-neutral-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

/*
 * ⚠️ NO h-6/w-6 HERE, and that is the FIX rather than an omission.
 *
 * `@subframe/core`'s Feather components render as an outer <span> wrapping
 * the <svg>, and a className lands on that SPAN — not on the glyph. The svg
 * itself is width="1em" height="1em", so at the inherited 16px font-size it
 * draws at 16px. `h-6 w-6` therefore built a 24px flex box around a 16px
 * icon, and because that span is `display:flex` with the default
 * `justify-content: flex-start`, the glyph sat flush LEFT inside it —
 * measured 4px off-centre, exactly (24 − 16) / 2.
 *
 * Dropping the size class lets the span shrink to its content, so the disc's
 * own `items-center justify-center` centres a 16×16 box exactly.
 *
 * ⚠️ Note this means the glyph is 16px, not the 24px the old class was
 * reaching for and never achieved. To actually enlarge it, set the
 * FONT-SIZE (the svg is 1em) — e.g. `text-2xl` — rather than a width/height,
 * which only resizes the wrapper and re-creates the offset.
 */
const iconClass = "text-brand-primary";

export default function TallServicesBenefitsCards({
  id,
  className,

  title = `WHY CHOOSE ${CLIENT.business.name.toUpperCase()}`,
  description = `Licensed, bonded, and insured across ${CLIENT.geo.serviceArea}, in business since ${CLIENT.business.yearFounded}.`,

  benefitCards = (
    <>
      <BenefitCard
        icon={<FeatherCheckCircle className={iconClass} />}
        title="Our Own Crews"
      >
        Every job is run start to finish by our own{" "}
        {CLIENT.vocabulary.credentialTitlePlural}, working to the best
        practices of quality workmanship.
      </BenefitCard>

      <BenefitCard
        icon={<FeatherShield className={iconClass} />}
        title="Guaranteed Service"
      >
        Peace of mind and quality workmanship are the priority. That is why we
        stand behind our work with the {CLIENT.vocabulary.guaranteeName}.
      </BenefitCard>

      <BenefitCard
        icon={<FeatherZap className={iconClass} />}
        title="Modern Equipment"
      >
        Our equipment selection and vehicle fleet let us arrive fully equipped
        and precise for any job, residential or commercial.
      </BenefitCard>
    </>
  ),

  padYClassName = "",
  contentMaxWidthClassName = "max-w-[720px]",
  cardsLayoutClassName = "flex w-full flex-col gap-4",
  blockMaxWidthClassName = "w-full",
  textured = false,

  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: TallServicesBenefitsCardsProps) {
  /* ⚠️ This section emitted NO data-section at all until 2026-08-31 — one of
     the four service-page wrappers client CLAUDE.md §3.3 records as invisible
     to section-level analytics. It gains the full contract here because
     handoff §2 requires it of any section being (re)generated, and because
     adding it to a new page type is the moment to do it.

     Emission is CONDITIONAL on trackingSection being passed. An unconditional
     data-section would start firing from any consumer that supplies no
     context, and a section whose city/service/page_type are all undefined
     cannot be joined to anything — worse than silence, because it looks like
     data. Both current consumers pass the full set.

     Mechanism A (root §8.2): this wrapper has no hooks, so the vanilla
     observer in Layout.astro handles view_section off server-rendered DOM.
     Do NOT add a useEffect observer alongside data-track-view — it would
     double-fire.

     ⚠️ This CREATES a new series rather than restoring a lost one, on 13
     routes at once. Same precedent as BusinessStatistics and service-hero;
     accepted because the cost of adding it after traffic exists is a
     permanent gap. */
  const tracking = trackingSection
    ? {
        "data-track-view": true,
        "data-section": trackingSection,
        "data-city": trackingCity,
        "data-service": trackingService,
        "data-page-type": trackingPageType,
      }
    : {};

  return (
    <section
      id={id}
      className={[
        "w-full",
        /* `relative isolate` is REQUIRED by the texture layers, not
           decoration: they blend with their BACKDROP, so without a stacking
           context of its own that backdrop is whatever the page painted
           beneath this section. `overflow-x-hidden` keeps the stretched
           sheet from widening the document. */
        textured ? "relative isolate overflow-x-hidden" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...tracking}
    >
      {textured ? (
        <>
          {/* ⚠️ NOT A TILE — preserveAspectRatio='none' plus
              bg-[length:100%_100%] bg-no-repeat, so ONE sheet stretches
              across the whole section however tall it gets. Giving it a
              pixel background-size turns it into a tile and the creases
              stop reaching the edges, which is the effect. Geometry and the
              full rationale live in global.css under body.theme-ebs. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[image:var(--ebs-tex-creases-alt)] bg-[length:100%_100%] bg-no-repeat opacity-[0.85] mix-blend-multiply"
          />
          {/* Grain. TECHNICAL, not decorative: the creases are large, very
              shallow gradients, exactly the case 8-bit displays render as
              visible banding across a band this wide. Remove it and banding
              appears on some monitors and not others. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[image:var(--ebs-tex-grain)] bg-[length:140px] opacity-[0.05] mix-blend-multiply"
          />
        </>
      ) : null}

      {/* `relative` lifts the content above the texture layers. */}
      <div
        className={["relative min-w-0", padYClassName]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={["w-full", contentMaxWidthClassName].join(" ")}>
          <Tall_LocalBenefitsSection
            className={blockMaxWidthClassName}
            title={title}
            description={description}
            /* Wrapped in one box so the card layout is ours rather than the
               Subframe parent's. Its own container is `flex flex-col gap-4`
               and the cards would be its direct children; giving it a single
               child instead means `cardsLayoutClassName` decides the
               arrangement, and the default reproduces exactly what that
               container did — so the service pages do not move. */
            benefitCards={
              <div className={cardsLayoutClassName}>{benefitCards}</div>
            }
          />
        </div>
      </div>
    </section>
  );
}
