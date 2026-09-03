import React from "react";

/*
 * Inline service icons, one per service slug plus "other".
 *
 * Feather has no tree, stump or storm-debris glyph, so these are drawn here
 * on the same 24x24 / 1.6px-stroke grid Feather uses, so they sit beside
 * Feather icons elsewhere on the site without a weight change. Consumed by
 * ServicesGridSectionWrapper (by name), ContactFormWrapper, LandingContactForm
 * and LandingServicesListWrapper (via SERVICE_ICONS, keyed by slug).
 *
 * ⚠️ Keys of SERVICE_ICONS MUST match servicePageData[*].slug and the
 * `key` values in every form's service option list. A missing key is not an
 * error — the consumer falls back to IconOther — so a renamed slug silently
 * loses its icon.
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

/** Conifer outline with felling wedges at the base. */
export function IconTreeRemoval({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M12 3 6.5 11.5h3.2L6.4 17h11.2l-3.3-5.5h3.2L12 3Z" />
      <path d="M12 17v4" />
      <path d="M3.5 20.5 7 19M20.5 20.5 17 19" />
    </svg>
  );
}

/** Round canopy on a trunk, with shears clipping a limb at the top right. */
export function IconTreeTrimming({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M7 9.5a5 5 0 1 1 10 0c0 2.6-2 4.3-5 4.5-3-.2-5-1.9-5-4.5Z" />
      <path d="M12 14v7" />
      <path d="M17 4.5 21 3M17.5 3l3 3.5" />
    </svg>
  );
}

/** A stump with its ring face showing, and grinder sparks above it. */
export function IconStumpGrinding({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M6 12v6.5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V12" />
      <ellipse cx="12" cy="12" rx="6" ry="2.4" />
      <ellipse cx="12" cy="12" rx="2.4" ry="0.9" />
      <path d="M12 6.5V4M7.5 8 6 6.5M16.5 8 18 6.5" />
    </svg>
  );
}

/** Storm cloud with a fallen limb beneath it. */
export function IconStormCleanUp({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M7.5 14.5a3.75 3.75 0 0 1-.4-7.5 5.25 5.25 0 0 1 10.1 1.3 3.1 3.1 0 0 1-.3 6.2H7.5Z" />
      <path d="M12.5 9.5 10.9 12h2.4l-1.6 2.5" />
      <path d="M4 20.5 20 18.5M9 19.6l1.5-2M14.5 19l1.3-1.9" />
    </svg>
  );
}

export function IconOther({ className }: { className?: string }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="6" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const SERVICE_ICONS: Record<
  string,
  (props: { className?: string }) => React.JSX.Element
> = {
  "tree-removal": IconTreeRemoval,
  "tree-trimming": IconTreeTrimming,
  "stump-grinding": IconStumpGrinding,
  "storm-clean-up": IconStormCleanUp,
  other: IconOther,
};
