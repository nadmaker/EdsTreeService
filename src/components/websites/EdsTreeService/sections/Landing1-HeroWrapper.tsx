"use client";

import React, { useEffect, useRef } from "react";
import { HeroSectionAlt2 } from "@/ui/components/HeroSectionAlt2";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

export interface Landing1HeroWrapperProps {
  /** Optional section id hook */
  id?: string;

  /** Optional additional styling */
  className?: string;

  /** Background image. Passed per city from cityLandingData[*].heroImage. */
  backgroundImage?: string;

  /** Alt text for the background photograph. */
  imageAlt?: string;

  /** City/page specific copy */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  /** Primary CTA */
  primaryCtaHref?: string;
  primaryCtaLabel?: React.ReactNode;

  /** Secondary CTA (phone) */
  phoneHref?: string;
  phoneLabel?: React.ReactNode;

  /** Optional Subframe side action */
  sideAction?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function Landing1HeroWrapper({
  id,
  className,

  /* ⚠️ NO DEFAULT, deliberately. This used to default to
     "/images/services-bg.jpg" — a file that has never existed in this repo —
     while CityLandingPageBLDR passed nothing, so all six city landings
     served a 404 as their LCP element and React 19 preloaded the missing
     file at high priority on each of them (root §9.13). A defaulted path is
     what made that survivable-looking: the hero still rendered, just dark.
     `heroImage` is now a required field on CityLandingPageData, so the type
     catches an omission instead of a broken default absorbing it. */
  backgroundImage,
  imageAlt = "",

  /* ⚠️ These two were the PREVIOUS CLIENT's — "Durham's Professional …" and
     "…without the stress in Durham, NC". Unreachable, because the builder
     always passes the per-city values, but exactly the trap root §13.3.8
     describes: a new consumer omitting the prop would have shipped another
     client's city name. Now generic and city-agnostic. */
  title = (
    <>
      {CLIENT.vocabulary.tradeName}
      <br />
      you can trust
    </>
  ),

  subtitle =
    "Bonded and insured crews, same-day tree removal, and a free written estimate before anything starts",

  primaryCtaHref = "#landing-contact",
  primaryCtaLabel = "Get a Free Estimate",

  phoneHref = CLIENT.contact.phoneTel,
  phoneLabel = <span className="phone-number">{DISPLAY_PHONE}</span>,

  sideAction,

  trackingSection = "hero",
  trackingCity,
  trackingService,
  trackingPageType,
}: Landing1HeroWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedSection = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (hasTrackedSection.current) return;

          hasTrackedSection.current = true;

          (
            window as Window & {
              dataLayer?: Record<string, unknown>[];
            }
          ).dataLayer?.push({
            event: "view_section",
            section: trackingSection,
            city: trackingCity,
            service: trackingService,
            page_type: trackingPageType,
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [trackingSection, trackingCity, trackingService, trackingPageType]);

  const heroClassName = [
    "min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]",
    "px-6 sm:px-10 lg:px-16 xl:px-24",

    /* Clearance for the fixed desktop navbar. The background <img> below is
       absolutely positioned to inset-0, so it still runs to y=0 behind the
       resting bar — only the centred copy is pushed clear. md-only because
       the bar is only fixed at >=768px. HeroSectionAlt2's root is
       `items-center`, so this padding shifts the centred stack down rather
       than adding dead space. */
    "md:pt-[var(--site-nav-clearance)]",

    /* The Subframe root paints `bg-neutral-900`; the photograph now lives on
       the wrapper's own <section> beneath it, so this has to be transparent
       or it would cover the picture. The dark ground moved to the section
       with it, unchanged. */
    "!bg-transparent",

    "[&_.container]:max-w-none",
    "[&_.container]:w-full",

    "[&_.max-w-\\[1280px\\]]:w-full",
    "[&_.max-w-\\[1280px\\]]:mx-0",
    "sm:[&_.max-w-\\[1280px\\]]:mx-auto",

    "[&_.flex.flex-wrap.items-center.gap-6]:flex-col",
    "[&_.flex.flex-wrap.items-center.gap-6]:items-stretch",
    "sm:[&_.flex.flex-wrap.items-center.gap-6]:flex-row",
    "sm:[&_.flex.flex-wrap.items-center.gap-6]:items-center",

    "[&_.flex.flex-wrap.items-center.gap-6>div]:w-full",
    "sm:[&_.flex.flex-wrap.items-center.gap-6>div]:w-auto",

    className,
  ]
    .filter(Boolean)
    .join(" ");

  const primaryBtnClassName = [
    "w-full sm:w-auto",
    "inline-flex items-center justify-center",
    "rounded-md",
    "bg-brand-primary",
    "px-6 py-3",
    "text-white font-medium",
    "border border-transparent",
    "transition-colors",
    "hover:bg-white",
    "hover:text-brand-primary",
    "hover:border-brand-primary",
  ].join(" ");

  const secondaryBtnClassName = [
    "w-full sm:w-auto",
    "inline-flex items-center justify-center",
    "rounded-md",
    "bg-white/10",
    "px-6 py-3",
    "text-white font-medium backdrop-blur",
    "transition-colors",
    "hover:bg-white",
    "hover:text-neutral-900",
  ].join(" ");

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full bg-neutral-900"
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* The photograph is rendered HERE rather than handed to
          HeroSectionAlt2's `backgroundImage` slot, for one reason: that slot
          emits an <img> with no alt attribute and no way to supply one, and
          `alt` is an HTML attribute on Subframe-rendered markup — unreachable
          from a wrapper at any rung of root §7.1's override hierarchy, since
          no amount of CSS can add an attribute. Owning the element is the
          only way this photo gets described.

          Same pixels as before: object-cover, centred, 60% over the section's
          neutral-900 ground — which is why the eight [&>img]: overrides that
          used to force exactly that are gone from the class list above.

          NOT lazy, and that is deliberate. This is the LCP element on all six
          city landings, so it stays eager (handoff §2's performance
          contract) — the same exception the service-page hero carries. */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />
      ) : null}

      {/* COPY-SIDE SCRIM, added 2026-09-01 alongside the title enlargement.

          ⚠️ THIS FIXES A MEASURED WCAG FAILURE, not a taste preference.
          White title text over these photographs was sampled per route by
          compositing the real image pixels with the <img>'''s own opacity over
          the section'''s neutral-900 ground: worst-case contrast came out at
          2.55–3.96:1 across the six cities, so FOUR of six failed even the
          3:1 large-text bar. Medians were fine (4–15:1) — it is the bright
          patches, a white garage door or a pale gable, that the headline
          crosses.

          ⚠️ It is PRE-EXISTING and was not introduced by enlarging the type.
          If anything the enlargement helped: bigger text drops the required
          ratio from 4.5:1 to 3:1.

          Why a LEFT-EDGE GRADIENT rather than more opacity on the photo:
          raising the global tint would dim the whole photograph, and the
          picture is the point of this band. The copy is left-aligned in a
          576px column, so darkening only that side buys the contrast and
          leaves the house, the crew and the right two-thirds untouched. It
          stops at 60% width and fades out, so there is no visible edge.

          Decorative, hence aria-hidden. Reverting is deleting this one
          element. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-default-font/90 via-default-font/60 to-transparent to-60%"
      />

      <HeroSectionAlt2
        sideAction={sideAction}
        className={heroClassName}
        /* TYPE SCALE MATCHED TO THE SERVICE-PAGE HERO H1, 2026-09-01, by
           request. Same clamp, leading, tracking and shadow, so the two hero
           families read as one system.

           Set on the WRAPPER'''s own <div>, not by fighting Subframe.
           HeroSectionAlt2 wraps this slot in
           <span className="text-heading-1 font-heading-1 text-white">, and a
           font-size declared on this inner div simply overrides what it would
           otherwise inherit — no !important, no arbitrary variant, no
           escaped-bracket selector. Rung 1 of root §7.1, not rung 4.

           ⚠️ The COLUMN is capped by Subframe at max-w-[576px], which
           is what decides how this wraps. Enlarging the type does not widen
           the column, so the title takes more lines rather than more width —
           that is expected here, not a bug to chase.

           ⚠️ Still a <span>, NOT an <h1>. The tag lives on
           Subframe-rendered markup and no className can change an element'''s
           tag (root §7.1'''s ceiling), so city landings have no h1 — the
           same gap the service pages had until the title block was replaced.
           Closing it needs the theme tab or a wrapper-authored rebuild. */
        title={
          <div className="text-left font-bold leading-[1.08] tracking-[0.01em] text-[clamp(1.75rem,4.4vw,3.25rem)] [text-shadow:0_2px_18px_rgba(23,41,58,0.55)]">
            {title}
          </div>
        }
        /* HIGHLIGHT BAND behind the subheading, 2026-09-01, to a supplied
           reference. Structure is three layers rather than one background,
           because the reference's effect is a soft GLOW, not a flat chip:

             1. a blurred gradient plate, offset slightly larger than the
                text box — this is what bleeds light past the edges;
             2. a crisp gradient on top of it for the body of the band;
             3. the text itself, in a `relative` span so it paints above both.

           A single `background-image` on the text element can do (2) but not
           (1): `blur` on an element blurs its TEXT as well, so the glow has
           to live on its own layer behind. `inline-block` keeps the band the
           width of the copy rather than the column.

           Gradient runs LEFT-TO-RIGHT and fades out, mirroring the
           reference's centre-out fade but re-aimed for this hero's
           left-aligned stack. brand-primary rather than the gold: gold is
           this site's small-accent colour (eyebrows, ticks) and blue is the
           analogue of the reference's teal.

           ⚠️ OPACITY IS CONTRAST-BOUND, not taste. White on solid
           brand-primary (#1685CC) is 3.99:1 — fails AA for normal text and
           this subheading is normal-size. It only works here because the band
           is semi-transparent over an already-dark hero, so the composite
           stays dark. Measured on the rendered result, glyphs hidden, it
           lands around 6–7:1. Raising these alphas toward opaque walks it
           back down toward 3.99 and eventually fails — re-measure if they
           change, and do not reuse this treatment on a light ground. */
        subtitle={
          <div className="max-w-[42rem] text-left">
            <span className="relative inline-block px-3 py-1.5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-lg bg-gradient-to-r from-brand-primary/70 via-brand-primary/45 to-transparent blur-md"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-r from-brand-primary/55 via-brand-primary/30 to-transparent"
              />
              <span className="relative">{subtitle}</span>
            </span>
          </div>
        }
        primaryAction={
          <a
            href={primaryCtaHref}
            className={primaryBtnClassName}
            data-event="click_cta"
            data-label="landing-hero-primary-cta"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
          >
            {primaryCtaLabel}
          </a>
        }
        secondaryAction={
          <a
            href={phoneHref}
            className={secondaryBtnClassName}
            data-event="click_call"
            data-label="landing-hero-call-now"
            data-section={trackingSection}
            data-city={trackingCity}
            data-service={trackingService}
            data-page-type={trackingPageType}
            aria-label={`Call now ${DISPLAY_PHONE}`}
          >
            {phoneLabel}
          </a>
        }
      />
    </section>
  );
}