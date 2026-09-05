import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * Ed's — home hero with a foreground form card. STRUCTURE ONLY for now.
 *
 * Styled from the "We care for your neighborhood" reference: a full-bleed
 * background layer, a centred serif heading, an uppercase tracking
 * subheading, and — centred below them — a foreground card that hangs over
 * the bottom edge of the background onto the page colour. The card's
 * CONTENTS (the interactive contact form) are not designed yet; they arrive
 * through the `card` slot prop, and until something is passed the wrapper
 * renders a plainly structural placeholder so the geometry can be seen.
 *
 * Replaces HeroWrapper (the three-slide carousel) on the home page.
 * HeroWrapper.tsx stays on disk with no consumer.
 *
 * THE OVERHANG is self-contained, not a negative margin. The section's own
 * background is the page colour (bg-default-background); the image layer
 * is absolutely positioned to stop `bottom-16 md:bottom-24` short of the
 * section's bottom edge; the card sits in normal flow at the end of the
 * content with no bottom padding after it. So the last 64/96px of the card
 * overlap a strip that is already the page colour, and the next section
 * starts flush under the card. Nothing below this wrapper has to know
 * about it — no negative margin to counter, no padding to add elsewhere.
 * The card must simply be taller than the strip, which any form is.
 *
 * NO "use client" and no hooks: the shell is static and view_section is
 * opt-in via data-track-view (root §8.2 Mechanism A). The form that lands
 * in the slot brings its own hooks and its own wrapper.
 *
 * The background <img> is this page's LCP element: eager, fetchPriority
 * high, and never loading="lazy" (root §9.13). Its default is the SAME
 * generated placeholder HeroWrapper used as slide 1, so the og card and
 * the page still agree on one photograph.
 */

const BACKGROUND_IMAGE = "/images/edstree-hero-1.jpg";

export interface HeroFormCardWrapperProps {
  id?: string;
  className?: string;

  /** The <h1>. Default is the same draft headline HeroWrapper carried —
   *  still pending owner sign-off (client CLAUDE.md §8.2). */
  title?: React.ReactNode;
  /** Uppercase strap under the heading. Default is cleared claims only:
   *  the four services and the service-area label. */
  subtitle?: React.ReactNode;

  /** Full-bleed background photograph; a generated placeholder by default. */
  backgroundImage?: string;
  /** Empty while the image is a decorative placeholder (see servicePageData). */
  imageAlt?: string;

  /**
   * The foreground card's contents — the contact form, once specified.
   * Rendered inside the centred card column; the slot owns the card
   * surface too, so a future form wrapper can bring its own chrome.
   */
  card?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/**
 * PLACEHOLDER card, shown only while nothing is passed to `card`. It is
 * structure, not design: the title is a cleared claim so nothing false can
 * ship if this is ever seen, and the dashed box just holds the form's
 * eventual height so the overhang and the section rhythm are visible.
 */
function PlaceholderCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-10">
      <h2 className="text-center font-heading-2 text-2xl font-bold text-brand-primary md:text-3xl">
        Get your free estimate
      </h2>
      <div
        aria-hidden="true"
        className="mt-6 min-h-[280px] rounded-xl border-2 border-dashed border-neutral-200"
      />
    </div>
  );
}

export default function HeroFormCardWrapper({
  id,
  className,
  // Title case by request (2026-09-04); the words are the same cleared draft.
  title = "Same-Day Tree Removal, Done Safely",
  subtitle = `Tree removal, trimming, stump grinding & storm clean-up in ${CLIENT.geo.serviceArea}`,
  backgroundImage = BACKGROUND_IMAGE,
  imageAlt = "",
  card,
  trackingSection = "hero",
  trackingCity,
  trackingService,
  trackingPageType,
}: HeroFormCardWrapperProps) {
  return (
    <section
      id={id}
      className={["relative w-full bg-default-background", className].filter(Boolean).join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* ── BACKGROUND LAYER ──
          Stops short of the section's bottom edge by the overhang strip
          (see the file header). The tint is the brand's primary-hover
          green at 85% over the photograph — white type on primary-hover
          measures 7.21:1 on the flat colour; the photograph shows through
          only faintly, so the heading keeps its contrast across it.
          aria-hidden while the image is decorative (empty alt). */}
      <div
        className="absolute inset-x-0 top-0 bottom-16 overflow-hidden md:bottom-24"
        aria-hidden={imageAlt ? undefined : true}
      >
        {/* object-position pulls the crop UP from the default 50% centre.
            The photograph is portrait (1322×1984) inside a wide, short
            layer, so object-cover throws away ~1500px of height at 1440w
            and the centred band landed on the climber's legs and boots.
            30% raises the visible band to roughly source rows 413–1021 —
            helmet, shoulders and the cut log face — which is the subject.
            Percentages, so the framing holds as the layer's width changes;
            on phones the layer is height-constrained (the crop is
            horizontal there) and this value has no effect. */}
        <img
          src={backgroundImage}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-brand-primary-hover/85" />
      </div>

      {/* ── CONTENT ── heading, strap, then the card, all centred. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pt-20 text-center md:px-10 md:pt-28">
        {/* Desktop H1 caps at 56px (style guide §6, global.css). */}
        <h1 className="max-w-[20ch] font-heading-1 text-4xl font-bold leading-[1.05] text-white md:text-[56px]">
          {title}
        </h1>

        <p className="mt-5 max-w-[60ch] text-[13px] font-semibold uppercase tracking-[0.14em] text-white md:text-[15px]">
          {subtitle}
        </p>

        {/* ── FOREGROUND CARD ──
            In flow, last child, no padding below it: its bottom IS the
            section's bottom, which is what makes it overhang the image
            layer onto the page-colour strip. */}
        <div className="mt-10 w-full max-w-[640px] md:mt-14">
          {card ?? <PlaceholderCard />}
        </div>
      </div>
    </section>
  );
}
