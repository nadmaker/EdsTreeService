import React from "react";

/**
 * EBS — the seven service glyphs, shared.
 *
 * Extracted from `ServicesGridSectionWrapper` on 2026-08-31, when the city
 * landings' contact form needed the same seven services and would otherwise
 * have carried a second copy of these paths. Two copies of an icon set drift;
 * one does not.
 *
 * WHY DRAWN RATHER THAN IMPORTED. `@subframe/core`'s Feather set has no roof,
 * no siding and no gutter glyph. That absence is what produced the icons this
 * replaces: the services grid reached for Axe / Scissors / Feather / Droplet,
 * and the landing form for TreePine / Scissors / AlertTriangle / Trash2 —
 * icons chosen for a tree company and left pointing at roofing work. Drawing
 * them means the glyph can actually depict the trade.
 *
 * Inline SVG also costs zero network requests and keeps both consumers free
 * of `@subframe/core`, so neither contributes to the JS bundle (handoff §2's
 * performance contract). Being markup rather than an <img>, these are also
 * invisible to React 19's preload pass (root §9.13).
 *
 * All seven share one 24×24 grid, 1.6 stroke, `currentColor`, so they sit at
 * a consistent weight beside each other and inherit whatever colour the
 * consuming section sets.
 *
 * ⚠️ Keys MUST match `servicePageData[*].slug` and the route filenames under
 * `src/pages/services/`. `SERVICE_ICONS` is keyed by slug precisely so a
 * consumer that has a slug cannot pick the wrong picture.
 */

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Two nested roof lines — an old roof and its replacement. */
export function IconRoofReplacement({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 12.75 12 5l10 7.75" />
      <path d="M6 17.6 12 13l6 4.6" />
    </svg>
  );
}

/** Roof line with a patch over the damaged run. */
export function IconRoofRepair({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 12.75 12 5l10 7.75" />
      <rect x="8.75" y="14.4" width="6.5" height="5.1" rx="1" />
      <path d="M8.75 17h6.5" />
    </svg>
  );
}

/** Roof line with a plus — a roof going on where there wasn't one. */
export function IconRoofInstallation({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 12.75 12 5l10 7.75" />
      <path d="M12 14.4v5.2M9.4 17h5.2" />
    </svg>
  );
}

/** Roof line over standing seams. */
export function IconMetalRoof({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 12.75 12 5l10 7.75" />
      <path d="M7 15.4v4.2M12 15.4v4.2M17 15.4v4.2" />
    </svg>
  );
}

/** Wall elevation with lap courses. */
export function IconSiding({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="3" y="4.75" width="18" height="14.5" rx="1.5" />
      <path d="M3 9.6h18M3 14.4h18" />
    </svg>
  );
}

/** Trough with a downspout carrying water away. */
export function IconGutterInstallation({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 6.5v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
      <path d="M17 12.5h2.5v5a2 2 0 0 1-2 2H15" />
    </svg>
  );
}

/** Trough shedding debris and water. */
export function IconGutterCleaning({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 5.5v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M7.5 14.5v2.2M12 14.5v3.4M16.5 14.5v2.2" />
    </svg>
  );
}

/**
 * Not a service — the "something else" option on the city-landing contact
 * form. Three dots, the conventional "more / other" glyph, drawn on the same
 * 24×24 grid so it sits at the weight of the six real service icons beside
 * it.
 *
 * ⚠️ Its key in SERVICE_ICONS is "other", which is deliberately NOT a
 * servicePageData slug — there is no /services/other route and there should
 * not be one. It exists so a visitor whose job is not on the list can still
 * submit, and so the lead email reads "Service: Other" rather than a wrong
 * service.
 */
export function IconOther({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="6" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Slug → glyph. Keyed by `servicePageData[*].slug` so a consumer holding a
 * slug cannot pair it with the wrong drawing.
 */
export const SERVICE_ICONS: Record<
  string,
  (props: { className?: string }) => React.JSX.Element
> = {
  "roof-replacement": IconRoofReplacement,
  "roof-repair": IconRoofRepair,
  "roof-installation": IconRoofInstallation,
  "metal-roof-installation": IconMetalRoof,
  "siding-installation": IconSiding,
  "gutter-installation": IconGutterInstallation,
  "gutter-cleaning": IconGutterCleaning,
  /* Not a service slug — see IconOther above. */
  other: IconOther,
};
