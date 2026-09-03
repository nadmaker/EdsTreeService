/**
 * ServiceONEFaqWrapper — FAQ accordion for the service-page left column.
 *
 * NEW 2026-09-01. Sits directly under ServiceONEtallLocationWrapper (the
 * service-area map) inside ServicePageBLDR's 60% left column, so it is
 * left-aligned and shares that column's width with every sibling above it.
 * It renders no width constraint and no horizontal padding of its own —
 * the column owns both, and the builder's `space-y-16` owns the gap.
 *
 * ⚠️ NO "use client", NO HOOKS, NO CLIENT JS. The accordion is native
 * <details>/<summary>, not React state, which is the whole reason this can
 * use Mechanism A (`data-track-view`, root §8.2) rather than a React
 * observer. The open row's fill, the chevron rotation and the body reveal
 * are all CSS `group-open:` variants. Do NOT "upgrade" this to a stateful
 * React accordion — it would force hydration, and it would then need its
 * observer migrated back to Mechanism B to avoid double-firing.
 * (FullStretchFaqWrapper on /about is the opposite case and is correct as
 * it stands: it wraps a Radix-backed Subframe Accordion, so it hydrates
 * regardless and keeps its React observer.)
 *
 * ⚠️ DESIGN REFERENCE, and what was deliberately NOT taken from it. Ryan
 * supplied a competitor's dark FAQ block as LAYOUT direction. Taken: the
 * full-width stacked bars, the first row open by default, the filled
 * active header, the circular chevron affordance. NOT taken:
 *   · The near-black ground. This section sits in a white column beside a
 *     white form; a black block would fight both, and surfaces on this
 *     site are positional (handoff §1). Built on the page's existing white
 *     ground with the brand fill carrying the active row instead.
 *   · Its questions. TWO of the reference's five are unshippable for EBS
 *     and no rewording fixes either — "GOT A ROOFING EMERGENCY? YES, WE DO
 *     EMERGENCY REPAIRS!" is MUST-NOT-SHIP (EBS has no emergency line;
 *     `CLIENT.contact.emergencyPhoneDisplay` is deliberately empty), and
 *     "HOW LONG WILL MY ROOF REPLACEMENT TAKE?" is a duration promise with
 *     no source in the intake or config. A third, the Austin-heat material
 *     question, was re-pointed at what `servicePageData` actually
 *     documents. This is the same trap that put insurance claims and the
 *     TPO/PVC/EPDM list into the UNVERIFIED CAPABILITIES table: the layout
 *     was the ask, the claims came along with it.
 *
 * ⚠️ CONTRAST. The open row is `brand-primary-HOVER` (#1376B4, 4.91:1 on
 * white), NOT `brand-primary` (#1685CC, 3.99:1). 3.99 fails AA for normal
 * text and passes only at ≥24px or ≥18.66px bold, and these question
 * labels are 16–18px. Same reason the service cards use the hover fill and
 * the credential band runs 24px/600. Contrast is a property of the colour
 * PAIR, so inverting the polarity does not help — if this ever needs
 * smaller type, the ground has to get darker.
 *
 * TRACKING. Section name `faq`, reused rather than invented: this is the
 * same logical section as /about's FAQ and page_type separates them. Same
 * precedent as `why-choose-us`, which is shared across city landings and
 * service pages. Emission is CONDITIONAL on `trackingSection` being passed,
 * so a consumer that supplies no context emits nothing rather than a
 * section whose city/service/page_type are all undefined.
 *
 * ⚠️ `toggle_nav_section` is reused for the row toggles. Root §8.4 lists it
 * as "Mobile nav accordion section expanded/collapsed" — the mechanic is
 * identical (accordion expand/collapse) but the description is nav-specific
 * and now under-describes it. Reused rather than adding a `toggle_faq`,
 * because a NEW event name is a §11.5 stop-and-discuss taxonomy change and
 * this is not the moment for one. ✅ The §8.4 DESCRIPTION was broadened on
 * 2026-09-01 to "Accordion section expanded/collapsed — navigation OR
 * content", so root now describes what this section emits. The event NAME is
 * unchanged.
 *
 * ⚠️ THE DEFAULTS BELOW ARE THE LIVE COPY. `ServicePageBLDR` passes no
 * `items`, exactly as it passed no props to TallServicesBenefitsCards and
 * no `image` to serviceOnecaption. Root §13.3.8 cuts both ways: a default
 * that reads as unreachable placeholder data is what all seven service
 * pages actually serve. Edit here, not somewhere that looks more official.
 */

import React from "react";
import { CLIENT } from "../config/client.config";

export interface ServiceONEFaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface ServiceONEFaqWrapperProps {
  id?: string;
  className?: string;

  eyebrow?: string;
  /** Heading, split so the trailing words can carry the accent colour. */
  titleLead?: string;
  titleAccent?: string;

  items?: ServiceONEFaqItem[];

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/**
 * Every claim below is CLEARED in the register (EBS_HANDOFF_Step0-Step1 §3)
 * or sourced from `servicePageData` / `client.config.ts`:
 *   · free inspections + no obligation — `CLIENT.offers.items[0]`
 *   · tear-off, deck inspection, underlayment, haul-away — roofReplacement
 *   · leaks / wind damage / missing shingles / failed flashing, same day —
 *     roofRepair (and "Same-Day Roofing" is the owner's own phrase, which
 *     the register clears for REPAIR specifically, not replacement)
 *   · standing seam, metal panel, service life past asphalt — metal roof
 *   · residential and commercial — cleared
 * Nothing here states a duration, an insurance-claim capability, an
 * emergency/after-hours promise, or a subcontracting absolute.
 */
const defaultFaqItems: ServiceONEFaqItem[] = [
  {
    question: "How often should I have my roof inspected?",
    answer:
      "Once a year is a sensible baseline, plus a look after any storm that brings high wind or hail. Most roof problems start small — a lifted shingle, a bit of failed flashing — and catching one early is usually the difference between a repair and a replacement.",
  },
  {
    question: "Do I need a repair or a full replacement?",
    answer:
      "It depends on how much of the roof is affected and how much life it has left. Isolated leaks, wind damage, missing shingles and failed flashing are usually repairs. Once the deck or underlayment is involved, or the roof is near the end of its service life, a full tear-off and rebuild is the better value. We will tell you which one you are looking at after we have been up there.",
  },
  {
    question: `What roofing materials does ${CLIENT.business.nameShort} install?`,
    answer:
      "Asphalt shingle and metal. On the metal side that means standing seam and metal panel systems built for eastern North Carolina weather, with a service life well past asphalt. We will walk you through the trade-offs for your roof and your budget rather than pointing you at one option.",
  },
  {
    question: "Do you work on commercial buildings as well as homes?",
    answer:
      "Yes — residential and commercial both. The estimate process is the same either way: we come out, look at the actual roof, and put the scope in writing before anything is scheduled.",
  },
  {
    question: "Is the estimate really free?",
    answer: `Yes. ${CLIENT.offers.items[0].description}`,
  },
];

/** Chevron. Inline SVG, not an icon font or an <img> — invisible to React
 *  19's preload pass (root §9.13) and it inherits `currentColor`, so it
 *  re-skins with the row rather than needing a second asset. */
function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function ServiceONEFaqWrapper({
  id,
  className,
  eyebrow = "FAQ",
  titleLead = "Answers to your",
  /* Service-NEUTRAL by default. This one wrapper renders on all seven
     service routes, so "roofing questions" would read wrong on
     /services/gutter-cleaning and /services/siding-installation. Per-service
     wording is a one-prop override from ServicePageBLDR if it is ever
     wanted; it needs no change here. */
  titleAccent = "common questions",
  items = defaultFaqItems,
  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: ServiceONEFaqWrapperProps) {
  const tracking = trackingSection
    ? {
        "data-track-view": true,
        "data-section": trackingSection,
        "data-city": trackingCity,
        "data-service": trackingService,
        "data-page-type": trackingPageType,
      }
    : {};

  /* Spread onto each interactive element. Handoff §2: a partial attribute
     set still fires but cannot be joined, so these travel together. */
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
      className={["w-full min-w-0", className].filter(Boolean).join(" ")}
      {...tracking}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-(--color-brand-secondary-text)">
        {eyebrow}
      </p>

      <h2 className="mt-4 max-w-[20ch] font-heading-1 text-3xl font-bold leading-[1.12] text-default-font md:text-4xl">
        {titleLead}{" "}
        <span className="text-(--color-brand-secondary-text)">
          {titleAccent}
        </span>
      </h2>

      <div className="mt-8 flex w-full flex-col gap-3">
        {items.map((item, i) => (
          <details
            key={i}
            open={i === 0}
            /* `group` is what lets the summary and the chevron respond to
               the OPEN state without any JS. */
            className="
              group w-full overflow-hidden rounded-lg
              border border-neutral-200 bg-white
              transition-colors duration-200
              open:border-brand-primary-hover
              motion-reduce:transition-none
            "
          >
            <summary
              data-event="toggle_nav_section"
              data-label={`faq-toggle-${i + 1}`}
              {...itemTracking}
              /* `list-none` + the webkit marker rule remove the native
                 disclosure triangle; without BOTH, Safari keeps drawing it
                 and the row gets a stray glyph before the text. */
              className="
                flex w-full cursor-pointer list-none items-center justify-between
                gap-4 px-5 py-4
                text-left text-base font-semibold uppercase tracking-[0.02em]
                text-default-font
                transition-colors duration-200
                hover:bg-neutral-50
                group-open:bg-brand-primary-hover group-open:text-white
                group-open:hover:bg-brand-primary-hover
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-[-2px]
                focus-visible:outline-brand-primary-hover
                motion-reduce:transition-none
                [&::-webkit-details-marker]:hidden
              "
            >
              <span className="min-w-0">{item.question}</span>

              <span
                aria-hidden="true"
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                  bg-brand-primary-hover text-white
                  transition-transform duration-200
                  group-open:rotate-180 group-open:bg-white
                  group-open:text-brand-primary-hover
                  motion-reduce:transition-none
                "
              >
                <Chevron />
              </span>
            </summary>

            <div className="px-5 pb-5 pt-4">
              <p className="max-w-[68ch] text-base leading-relaxed text-neutral-600">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
