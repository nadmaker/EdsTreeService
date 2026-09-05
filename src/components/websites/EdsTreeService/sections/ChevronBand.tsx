import React from "react";

/**
 * ChevronBand — the bevelled amber chevron, shared.
 *
 * Extracted from AboutUsVariant2's local Chevron() on 2026-09-04 when the
 * gallery became its second consumer (root §6.4: single use stays local,
 * reuse gets its own file). It renders ONLY the chevron: the caller owns the
 * section, the ground, the layer order and the placement.
 *
 * Consumers:
 *   AboutUsVariant2        pointing RIGHT, from the left field  (mirror off)
 *   PortfolioGalleryWrapper pointing LEFT, from the right edge  (mirror on)
 *
 * WHY INLINE MARKUP, NOT A DATA-URI TOKEN: the fills resolve var() against
 * the DOM — --site-chevron-face / -lit / -shade / -ghost, all derived from
 * --color-brand-secondary and --color-default-font in global.css — which a
 * data URI cannot do. Colours are set through `style` (CSS properties), not
 * presentation attributes, so var() resolves in every engine. No hooks, no
 * state: static markup wherever it lands.
 *
 * GEOMETRY on a 1000×1000 viewBox. Base polyline P0(200,120) V(720,500)
 * P2(200,880), stroke 150. The bevel strokes are the same polyline offset
 * along the normals: for an offset t the vertex moves to (720 − t/sin α, 500)
 * with sin α = 0.590 (α = the arm's angle to the bisector, tan α = 380/520)
 * and each end moves by t·(−0.590, ±0.807).
 *   t = +62 (inside, the specular)  → 163.4,170   614.9,500  163.4,830
 *   t = −66 (outside, the shade)    → 238.9,66.7  831.9,500  238.9,933.3
 * The ghost is the base translated (−40, −40): the dark chevron behind,
 * offset up-left.
 *
 * MIRROR flips only the POINTS (x → 1000 − x) and the ghost's x-offset. The
 * face gradient stays in user space, so the light keeps coming from the
 * top-left on both orientations and the two bands read as one lit world:
 * the About chevron is lit at its arm ends, the mirrored one at its vertex.
 * The specular gradient runs arm-ends → vertex in both cases.
 *
 * PLACEMENT is the caller's, through `className`: position, size, translate
 * and the breakpoint gate. The component adds only `pointer-events-none
 * absolute`. The vertex sits at 72% of the box width unmirrored and 28%
 * mirrored — that is the number the caller's translate-x should use to put
 * the vertex where it wants it (About: left-[44.5%] -translate-x-[72%]).
 *
 * CONTRAST NOTE the caller owns: amber is 6.48 on the green-black ground
 * (deliberate, client CLAUDE.md §2.2) but 2.37 on the page and 2.14 under
 * brand-primary text, so copy must never sit over it. Both consumers keep
 * every word clear of the arms.
 */

export interface ChevronBandProps {
  /**
   * Prefix for the two gradient ids (`{prefix}-face`, `{prefix}-specular`).
   * Static ids rather than useId() so the band stays hook-free; ONE
   * ChevronBand per prefix per page.
   */
  idPrefix: string;
  /** Vertex points left and the arms exit to the right. Default: points right. */
  mirror?: boolean;
  /** Placement classes — position, size, translate, breakpoint gate. */
  className?: string;
}

/* Point sets as literals, both orientations, so nothing is derived at render
   time and the served markup is stable to the digit. */
const BASE = "200,120 720,500 200,880";
const SPECULAR = "163.4,170 614.9,500 163.4,830";
const SHADE = "238.9,66.7 831.9,500 238.9,933.3";

const BASE_MIRROR = "800,120 280,500 800,880";
const SPECULAR_MIRROR = "836.6,170 385.1,500 836.6,830";
const SHADE_MIRROR = "761.1,66.7 168.1,500 761.1,933.3";

export default function ChevronBand({ idPrefix, mirror = false, className }: ChevronBandProps) {
  const gradFace = `${idPrefix}-face`;
  const gradSpecular = `${idPrefix}-specular`;

  const base = mirror ? BASE_MIRROR : BASE;
  const specular = mirror ? SPECULAR_MIRROR : SPECULAR;
  const shade = mirror ? SHADE_MIRROR : SHADE;
  const ghostTransform = mirror ? "translate(40 -40)" : "translate(-40 -40)";
  const specX1 = mirror ? "800" : "200";
  const specX2 = mirror ? "280" : "720";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 1000"
      className={["pointer-events-none absolute", className].filter(Boolean).join(" ")}
    >
      <defs>
        {/* Face: lit at the top-left, shaded at the bottom-right, along the
            light direction — so the two arms read as lit differently, which
            is most of what makes it a solid object. User space: unchanged by
            `mirror` on purpose (see the file header). */}
        <linearGradient id={gradFace} gradientUnits="userSpaceOnUse" x1="150" y1="80" x2="760" y2="920">
          <stop offset="0" style={{ stopColor: "var(--site-chevron-lit)" }} />
          <stop offset="0.42" style={{ stopColor: "var(--site-chevron-face)" }} />
          <stop offset="1" style={{ stopColor: "var(--site-chevron-shade)" }} />
        </linearGradient>
        {/* Specular: brightest ~45% along the arm from its end, fading toward
            the vertex. Runs arm-ends → vertex in both orientations. */}
        <linearGradient id={gradSpecular} gradientUnits="userSpaceOnUse" x1={specX1} y1="500" x2={specX2} y2="500">
          <stop offset="0" style={{ stopColor: "var(--site-chevron-lit)", stopOpacity: 0 }} />
          <stop offset="0.45" style={{ stopColor: "var(--site-chevron-lit)", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "var(--site-chevron-lit)", stopOpacity: 0.35 }} />
        </linearGradient>
      </defs>

      {/* Ghost chevron — the dark one sitting behind, offset up and away
          from the vertex. */}
      <polyline
        points={base}
        transform={ghostTransform}
        fill="none"
        strokeWidth="150"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        opacity="0.85"
        style={{ stroke: "var(--site-chevron-ghost)" }}
      />
      {/* Body */}
      <polyline
        points={base}
        fill="none"
        stroke={`url(#${gradFace})`}
        strokeWidth="150"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
      {/* Outer bevel — shade along the outside edge */}
      <polyline
        points={shade}
        fill="none"
        strokeWidth="12"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        opacity="0.9"
        style={{ stroke: "var(--site-chevron-shade)" }}
      />
      {/* Inner bevel — specular along the inside edge */}
      <polyline
        points={specular}
        fill="none"
        stroke={`url(#${gradSpecular})`}
        strokeWidth="11"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
