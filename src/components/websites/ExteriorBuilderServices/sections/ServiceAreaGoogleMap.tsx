"use client";

/**
 * ServiceAreaGoogleMap — interactive Google Maps JS API map of the EBS
 * service area, for the SEVEN /services/* routes only.
 *
 * NEW 2026-09-02. Replaces the previous client's Google **My Maps** iframe
 * inside ServiceONEtallLocationWrapper. That iframe showed the Raleigh-Durham
 * Triangle on every service page, because the builder passed the wrapper no
 * props and its defaults were therefore the live content (root §13.3.8
 * inverted — the same failure already fixed on TallServicesBenefitsCards and
 * ServiceONEProcessAccordionWrapper).
 *
 * ⚠️ THIS IS THE SECOND SERVICE-AREA MAP IN THE CODEBASE, DELIBERATELY.
 * `ServiceAreaMap.tsx` (inline SVG, Census county paths, zero JS, zero
 * network) still draws the same three counties on the home page and the six
 * city landings via ServiceGuaranteeAndFeaturesWrapper, and is untouched.
 * The duplication is known and DEFERRED, not accidental: two components draw
 * one service area in two visual languages, and a service-area change means
 * regenerating both. Do not "consolidate" them without deciding which of the
 * two properties matters more — the SVG's zero-JS/zero-preload cost (root
 * §9.13), or this one's pan/zoom and real basemap. Unifying was explicitly
 * deferred on 2026-09-02.
 *
 * DEGRADATION IS THE DEFAULT, NOT AN ERROR PATH. With `apiKey` or `mapId`
 * absent — which is Vercel's state until its env vars are set — this renders
 * a static county panel and NEVER requests Google's script. Same outcome if
 * the key is rejected at runtime (`gm_authFailure`). A grey broken map must
 * never ship, so there is no state in which Google's tiles half-load.
 *
 * ⚠️ BRAND TOKENS ARE READ FROM THE CONTAINER, NOT document.documentElement.
 * EBS's brand values live on `body.theme-ebs` (global.css:122), not `:root`.
 * Reading from documentElement returns theme.css's placeholder chain and the
 * polygon renders the WRONG COLOUR with no error at all. The container
 * inherits from body, so it is the correct place to read.
 *
 * ⚠️ The Google logo and the "Map data / Terms" strip stay. They are required
 * by Google's terms — do not crop, cover, or overlay them.
 */

import React, { useEffect, useRef, useState } from "react";
import { FeatherMapPin } from "@subframe/core";

/* ── Module-level script loader ───────────────────────────────────────────
 *
 * Seven routes, and StrictMode double-invokes every effect in dev, so this
 * has to be safe under many concurrent callers. The promise is cached at
 * MODULE scope: the first caller injects exactly one <script>, everyone else
 * awaits the same promise. A second <script> tag would make Google log
 * "You have included the Google Maps JavaScript API multiple times".
 */

const CALLBACK_NAME = "__ebsGmapsReady";

declare global {
  interface Window {
    [CALLBACK_NAME]?: () => void;
    gm_authFailure?: () => void;
    google?: typeof google;
  }
}

let mapsPromise: Promise<void> | null = null;

/** Notified when Google rejects the key. Instances subscribe so every mounted
 *  map can swap to the fallback, not just whichever one triggered the load. */
const authFailureListeners = new Set<() => void>();

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise<void>((resolve, reject) => {
    // Another bundle may have loaded Maps already.
    if (typeof window !== "undefined" && window.google?.maps) {
      resolve();
      return;
    }

    // Registered BEFORE injection: Google calls this on an invalid or
    // referrer-rejected key. It is the only signal for that failure —
    // the script itself still resolves.
    window.gm_authFailure = () => {
      authFailureListeners.forEach((fn) => fn());
    };

    window[CALLBACK_NAME] = () => {
      delete window[CALLBACK_NAME];
      resolve();
    };

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      loading: "async",
      libraries: "marker",
      callback: CALLBACK_NAME,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      // Network/blocked failure. Reset so a later mount can retry rather
      // than awaiting a permanently rejected promise.
      mapsPromise = null;
      reject(new Error("Failed to load the Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}

/* ── Component ────────────────────────────────────────────────────────────*/

export interface ServiceAreaGoogleMapMarker {
  name: string;
  slug: string;
  lat: number;
  lng: number;
}

export interface ServiceAreaGoogleMapProps {
  /** From CLIENT.map.apiKey. ⚠️ Never read import.meta.env in this file. */
  apiKey?: string;
  /** From CLIENT.map.mapId. Carries the "EBS Muted" cloud style. */
  mapId?: string;
  geojsonPath: string;
  center: { lat: number; lng: number };
  fillOpacity?: number;
  markers: readonly ServiceAreaGoogleMapMarker[];
  ariaLabel?: string;
  className?: string;
}

/** Brand fallbacks, used only if the CSS token resolves empty. */
const BRAND_PRIMARY_FALLBACK = "#1685CC";
const BRAND_SECONDARY_FALLBACK = "#DDA82C";

function readToken(el: HTMLElement, name: string, fallback: string): string {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value || fallback;
}

export default function ServiceAreaGoogleMap({
  apiKey,
  mapId,
  geojsonPath,
  center,
  fillOpacity = 0.28,
  markers,
  ariaLabel = "Service area map",
  className,
}: ServiceAreaGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapTargetRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  /** Both values are required before a single byte is requested. */
  const configured = Boolean(apiKey && mapId);

  const [failed, setFailed] = useState(false);
  const showFallback = !configured || failed;

  useEffect(() => {
    if (!configured) return;

    const onAuthFailure = () => setFailed(true);
    authFailureListeners.add(onAuthFailure);

    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const init = async () => {
      try {
        await loadGoogleMaps(apiKey!);
        if (cancelled) return;

        const target = mapTargetRef.current;
        // Guard re-entry: StrictMode runs this effect twice against the same
        // DOM node, and a second `new google.maps.Map` on it would stack.
        if (!target || mapRef.current) return;

        const fillColor = readToken(
          container,
          "--color-brand-primary",
          BRAND_PRIMARY_FALLBACK,
        );
        const pinColor = readToken(
          container,
          "--color-brand-secondary",
          BRAND_SECONDARY_FALLBACK,
        );

        const map = new google.maps.Map(target, {
          mapId,
          center,
          zoom: 9,
          // Two-finger / ctrl-scroll only. Page scroll is never hijacked by
          // a map that occupies most of the viewport on mobile.
          gestureHandling: "cooperative",
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          clickableIcons: false,
        });
        mapRef.current = map;

        map.data.setStyle({
          fillColor,
          fillOpacity,
          strokeColor: fillColor,
          strokeWeight: 2,
          clickable: false,
        });

        map.data.loadGeoJson(geojsonPath, undefined, (features) => {
          if (cancelled) return;
          const bounds = new google.maps.LatLngBounds();
          features.forEach((feature) => {
            feature.getGeometry()?.forEachLatLng((latLng) => {
              bounds.extend(latLng);
            });
          });
          if (!bounds.isEmpty()) {
            // fitBounds supersedes `center`/`zoom` above; 24px keeps the
            // polygon off the container edge.
            map.fitBounds(bounds, 24);
          }
        });

        const { AdvancedMarkerElement, PinElement } =
          (await google.maps.importLibrary(
            "marker",
          )) as google.maps.MarkerLibrary;
        if (cancelled) return;

        markerRefs.current = markers.map((city) => {
          const pin = new PinElement({
            background: pinColor,
            borderColor: fillColor,
            glyphColor: fillColor,
          });
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: city.lat, lng: city.lng },
            title: city.name,
            content: pin.element,
            gmpClickable: true,
          });
          marker.addListener("click", () => {
            // Route shape is /service-area/{slug} — verified against
            // src/pages/service-area/*.astro, NOT assumed.
            window.location.assign(`/service-area/${city.slug}`);
          });
          return marker;
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    // Below the fold on every service page, so nothing loads until the user
    // is near it. 400px of lead time means it is usually ready on arrival.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void init();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      authFailureListeners.delete(onAuthFailure);
      markerRefs.current.forEach((m) => {
        m.map = null;
      });
      markerRefs.current = [];
    };
  }, [configured, apiKey, mapId, geojsonPath, center, fillOpacity, markers]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={[
        "relative w-full pb-[75%] overflow-hidden rounded-lg shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showFallback ? (
        /* Cleared claim only — the three counties. No "unavailable" wording:
           this is a legitimate rendering of the service area, not an error. */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-50 px-6 text-center">
          <FeatherMapPin className="h-8 w-8 text-brand-primary" />
          <span className="text-sm font-semibold text-default-font">
            Serving Duplin, Sampson &amp; Wayne Counties
          </span>
        </div>
      ) : (
        <div ref={mapTargetRef} className="absolute inset-0" />
      )}
    </div>
  );
}
