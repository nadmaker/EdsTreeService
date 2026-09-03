"use client";

/**
 * ServiceONEtallLocationWrapper — service-area map + town chips for the
 * service-page left column.
 *
 * ⚠️ REWRITTEN 2026-09-02. Until this date every one of the SEVEN /services/*
 * routes served the PREVIOUS CLIENT's content from this file:
 *   · a Google My Maps iframe (`mid=1iZruq-…`) showing the Raleigh-Durham
 *     Triangle,
 *   · the label "RDU TRIANGLE, NC",
 *   · ten Triangle city chips (Raleigh, Durham, Cary, Apex, …).
 * None of it was overridden anywhere, because ServicePageBLDR rendered
 * `<ServiceONEtallLocationWrapper />` with NO PROPS AT ALL. Root §13.3.8 cuts
 * both ways: defaults that read as unreachable placeholder data were the live
 * copy on seven routes. Same failure, same week, as TallServicesBenefitsCards
 * and ServiceONEProcessAccordionWrapper.
 *
 * REMOVED, not reworded: `mapSrc`, the My Maps `mid`, the `<iframe>`, the RDU
 * label, and the ten-city array. No <img> was introduced in their place.
 *
 * The map is now ServiceAreaGoogleMap (Google Maps JS API, drawing the
 * dissolved 29-zip polygon). ⚠️ That is the SECOND service-area map in the
 * codebase — the inline-SVG ServiceAreaMap.tsx still serves home + the six
 * city landings and is untouched. Unifying them is deferred; see that file's
 * header for what each one buys.
 *
 * ⚠️ COPY IS A CLAIM SURFACE HERE. Chips assert "we serve this town" and the
 * map asserts a covered area. Only the three COUNTIES are cleared outright.
 * `locationName` defaults to "Duplin, Sampson & Wayne Counties, NC" — cleared,
 * but a default Ryan may want to override. Of the towns, only Goldsboro,
 * Clinton, Mount Olive, Warsaw and Kenansville appear in the intake; the rest
 * are derived from county geography (see CLIENT.geo.expandedCities). Do NOT
 * add response-time, availability, review or credential language to this
 * section — none of it is cleared.
 *
 * TRACKING. Section name `service-area`, newly introduced: the grep of every
 * existing name on 2026-09-02 found no service-area series. `map-and-benefits`
 * is NOT a match — that belongs to ServiceGuaranteeAndFeaturesWrapper, a
 * different block (guarantee + features + map + contact) on home and the city
 * landings. Emission is CONDITIONAL on `trackingSection` arriving, implemented
 * exactly as ServiceONEFaqWrapper does it, so a consumer supplying no context
 * emits nothing rather than a section whose city/service/page_type are all
 * undefined.
 */

import React, { useState } from "react";
import { Pg_Service_Locations } from "@/ui/components/Pg_Service_Locations";
import { CLIENT } from "../config/client.config";
import ServiceAreaGoogleMap from "./ServiceAreaGoogleMap";

type LandingCity = (typeof CLIENT.geo.landingCities)[number];

export interface ServiceONEtallLocationWrapperProps {
  id?: string;
  className?: string;

  /** Max readable width in left column */
  contentMaxWidthClassName?: string; // default "max-w-[720px]"

  /** Location label shown on the accordion bar */
  locationName?: React.ReactNode;

  /** Towns with their own landing page — rendered as links. */
  landingCities?: readonly LandingCity[];
  /** Towns without a landing page — rendered as plain chips. */
  expandedCities?: readonly string[];

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

const CHIP_BASE =
  "inline-flex items-center rounded-sm border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-[0_1px_0_rgba(0,0,0,0.02)]";

/** Town with a landing page: a real link to /service-area/{slug}. */
function CityChipLink({
  city,
  tracking,
}: {
  city: LandingCity;
  tracking: Record<string, string | undefined>;
}) {
  return (
    <a
      href={`/service-area/${city.slug}`}
      className={`${CHIP_BASE} transition-colors hover:border-brand-primary hover:text-brand-primary`}
      data-event="click_nav_link"
      data-label={`service-area-city-${city.slug}`}
      {...tracking}
    >
      {city.name}
    </a>
  );
}

/** Town without a landing page: unchanged from the pre-rewrite chip. */
function CityChip({ name }: { name: string }) {
  return <span className={CHIP_BASE}>{name}</span>;
}

/** Expanded-by-default accordion bar that shows ONE group of cities */
function CityChipsAccordion({
  locationName,
  landingCities,
  expandedCities,
  tracking,
  defaultOpen = true,
}: {
  locationName: React.ReactNode;
  landingCities: readonly LandingCity[];
  expandedCities: readonly string[];
  tracking: Record<string, string | undefined>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  /* ⚠️ CLIENT.geo.expandedCities is preserved VERBATIM for
     ServiceGuaranteeAndFeaturesWrapper, so it still contains Warsaw,
     Kenansville and Faison — all three of which have landing pages. Rendering
     both lists raw would show those towns twice, once as a link and once as a
     span. Deduped here rather than in config, so the other consumer's output
     stays byte-identical. 6 links + 12 spans = 18 distinct towns. */
  // Explicitly Set<string>: CLIENT is `as const`, so inferring would give a
  // Set of the six literal names and `.has()` would reject any wider string.
  const landingNames = new Set<string>(landingCities.map((c) => c.name));
  const spanOnly = expandedCities.filter((name) => !landingNames.has(name));

  return (
    <div className="w-full">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md bg-neutral-50 px-4 py-4 text-left transition-colors duration-200 ease-out hover:bg-neutral-100"
        aria-expanded={open}
        data-event="toggle_nav_section"
        data-label="service-area-cities"
        {...tracking}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/10">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
          </span>
          <span className="truncate text-sm font-semibold text-neutral-900">
            {locationName}
          </span>
        </div>

        {/* + / - animation */}
        <span className="relative ml-4 h-6 w-6 shrink-0">
          {/* horizontal */}
          <span className="absolute left-1/2 top-1/2 h-[3px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary" />
          {/* vertical (hidden when open => shows "-") */}
          <span
            className={[
              "absolute left-1/2 top-1/2 h-5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary",
              "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100",
            ].join(" ")}
          />
        </span>
      </button>

      {/* Expanded content */}
      <div
        className={[
          "mt-4 grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-4 pt-2">
            {landingCities.map((c) => (
              <CityChipLink key={c.slug} city={c} tracking={tracking} />
            ))}
            {spanOnly.map((name) => (
              <CityChip key={name} name={name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceONEtallLocationWrapper({
  id,
  className,

  contentMaxWidthClassName = "max-w-[720px]",

  /* ⚠️ Cleared claim — the three counties. See the header before editing. */
  locationName = "Duplin, Sampson & Wayne Counties, NC",

  landingCities = CLIENT.geo.landingCities,
  expandedCities = CLIENT.geo.expandedCities,

  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: ServiceONEtallLocationWrapperProps) {
  /* Identical mechanics to ServiceONEFaqWrapper: nothing is emitted unless a
     section name arrives, and the attribute set travels together because a
     partial set still fires but cannot be joined. */
  const tracking = trackingSection
    ? {
        "data-track-view": true,
        "data-section": trackingSection,
        "data-city": trackingCity,
        "data-service": trackingService,
        "data-page-type": trackingPageType,
      }
    : {};

  const itemTracking = trackingSection
    ? {
        "data-section": trackingSection,
        "data-city": trackingCity,
        "data-service": trackingService,
        "data-page-type": trackingPageType,
      }
    : {};

  return (
    <section
      id={id}
      className={["w-full", className].filter(Boolean).join(" ")}
      {...tracking}
    >
      <div className={["w-full min-w-0", contentMaxWidthClassName].join(" ")}>
        <Pg_Service_Locations
          className="w-full"
          contentArea={
            <ServiceAreaGoogleMap
              apiKey={CLIENT.map.apiKey}
              mapId={CLIENT.map.mapId}
              geojsonPath={CLIENT.map.geojsonPath}
              center={CLIENT.map.center}
              fillOpacity={CLIENT.map.fillOpacity}
              markers={landingCities}
            />
          }
          cityFooter={
            <CityChipsAccordion
              locationName={locationName}
              landingCities={landingCities}
              expandedCities={expandedCities}
              tracking={itemTracking}
            />
          }
        />
      </div>
    </section>
  );
}
