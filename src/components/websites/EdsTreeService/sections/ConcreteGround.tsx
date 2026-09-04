/**
 * ConcreteGround — the procedural cast-concrete / troweled-plaster surface,
 * as a reusable layer stack.
 *
 * NEW 2026-09-01. The technique originated inline in
 * ServicesGridSectionWrapper (home page, section `services`), which is
 * still where the full design rationale lives. It was lifted here when a
 * second and third consumer appeared on /about, rather than pasting a
 * five-div stack a third time.
 *
 * ⚠️ UPDATED 2026-09-04 — the duplicate is GONE, but not by adoption.
 * ServicesGridSectionWrapper used to carry an inline copy of this stack,
 * and this note used to warn that the two had to be kept in step. The
 * services grid's texture was REMOVED by request on 2026-09-04 (it is now
 * a flat --color-ground-concrete band), taking the inline copy with it. So
 * this component is now the ONLY implementation of the technique, and
 * there is no longer a second set of opacities to match.
 *
 * WHY PROCEDURAL AT ALL. The surface it replaced on the services grid was
 * `ebs-services-bg.jpg` — 590 KB, and from the same import batch as files
 * suspected of being the previous client's photography under EBS
 * filenames. A texture generated from a filter cannot carry someone else's
 * photo, so the no-photograph constraint is met structurally rather than by
 * restraint. It also costs ZERO network requests, ~1.3 KB of CSS across all
 * five tokens, is resolution-independent, and ships no JavaScript.
 *
 * ⚠️ THE HOST SECTION MUST SET `relative isolate` AND A GROUND COLOUR.
 * `isolate` is load-bearing, not decoration: the three turbulence layers
 * blend with their BACKDROP via mix-blend-multiply, and without a stacking
 * context of its own that backdrop is whatever the page painted beneath the
 * section — so the texture leaks onto the neighbour's surface. Add
 * `overflow-hidden` too, to clip the tiles to the band. The host's content
 * then needs `relative` to sit above these layers.
 *
 * Usage:
 *   <section className="relative isolate overflow-hidden bg-[var(--color-ground-concrete)]">
 *     <ConcreteGround />
 *     <div className="relative">…content…</div>
 *   </section>
 *
 * ⚠️ Opacity and tile size live HERE, on the layer divs, not in global.css
 * with the data URIs. That split is deliberate: the texture stays tunable
 * against the live page without anyone having to edit a URI-encoded SVG.
 *
 * The tokens themselves (`--site-tex-cloud`, `--site-tex-vein`,
 * `--site-tex-grain`, `--site-course-lines`, `--site-ground-rake`) are defined
 * in global.css under body.theme-ebs, where their own rationale sits —
 * including why the vein layer's baseFrequency is ANISOTROPIC (`0.0035
 * 0.08`, two values). That horizontal stretch is the entire reason this
 * reads as troweled plaster rather than a field of speckle; collapsing it
 * to one value silently turns it back into grain.
 */

import React from "react";

export interface ConcreteGroundProps {
  /**
   * Draw the set-out lines (lap-siding / shingle course rhythm, 82px).
   * Off for a plain plaster surface with no trade geometry.
   */
  lines?: boolean;
  /**
   * Daylight raking across the wall from the top right. Without it the
   * texture reads as an even field of noise rather than a lit surface.
   */
  rake?: boolean;
  /** Per-layer opacity, matching the services grid's values by default. */
  cloudOpacity?: number;
  veinOpacity?: number;
  grainOpacity?: number;
}

export default function ConcreteGround({
  lines = true,
  rake = true,
  cloudOpacity = 0.3,
  veinOpacity = 0.14,
  grainOpacity = 0.08,
}: ConcreteGroundProps) {
  return (
    <>
      {/* Bottom-to-top: grain under vein under cloud, then the lines, then
          the light. All decorative — aria-hidden and pointer-events-none.

          These are DIVS rather than pseudo-elements because there are up to
          five and an element only has ::before and ::after. Merging them
          would mean baking the opacities into the SVGs and losing the
          dials. */}
      <div
        aria-hidden="true"
        style={{ opacity: cloudOpacity }}
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-cloud)] bg-[length:640px] mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        style={{ opacity: veinOpacity }}
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-vein)] bg-[length:900px] mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        style={{ opacity: grainOpacity }}
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-grain)] bg-[length:140px] mix-blend-multiply"
      />

      {/* ⚠️ ORDER: the rake goes ON TOP of the lines. Reversing the two
          flattens the effect — the light is what stops the lines reading as
          a hard drafting grid at the top right. */}
      {lines ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[image:var(--site-course-lines)]"
        />
      ) : null}
      {rake ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[image:var(--site-ground-rake)]"
        />
      ) : null}
    </>
  );
}
