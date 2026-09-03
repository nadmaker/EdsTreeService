/**
 * FullStretchFaqWrapper — the FAQ accordion on /about (section `faq`).
 *
 * ⚠️ REBUILT 2026-09-01 (second pass, same day). The Subframe parent
 * `Fullstretchfaq` and the Radix-backed `Accordion` were BOTH DROPPED. Four
 * separate defects made overriding them the wrong call, and three of the
 * four were invisible from the wrapper:
 *
 *   1. THE TITLE RENDERED IN A SERIF. `Fullstretchfaq` hardcodes
 *      font-['Work_Sans'] on all three title spans with NO generic fallback,
 *      and Work Sans is not in Layout.astro's font request (Inter + Barlow
 *      Semi Condensed only). So every /about visitor got the browser's
 *      default serif on the one heading meant to carry the brand face.
 *      Nothing errors — it just looks like a different site.
 *   2. It hardcodes text-[#cc0000] on the highlight span. The old wrapper
 *      fought that with an arbitrary variant PINNED TO A LITERAL HEX, which
 *      stops matching the moment Subframe regenerates the component.
 *   3. It hardcodes text-[36px] leading-[42px], bypassing the type tokens.
 *   4. ⚠️ ONLY THE FIRST ANSWER REACHED THE SERVED HTML. Radix does not
 *      render collapsed panels server-side, so four of five answers were
 *      invisible to crawlers on a page whose whole job is answering
 *      questions. Recorded in client CLAUDE.md §3.3 as pre-existing.
 *
 * All four are gone. The accordion is now native <details>/<summary> with
 * CSS `group-open:` variants — the same technique as ServiceONEFaqWrapper on
 * the seven service pages, so both FAQ surfaces share one mechanic. All five
 * answers are now in the served HTML.
 *
 * ⚠️ TRACKING MIGRATED B → A IN THIS EDIT, and the two halves are not
 * separable. Removing Radix removed the only reason this file hydrated, so
 * the React useEffect observer would never run again — view_section would
 * stop firing SILENTLY, with no build error and no console warning. The
 * observer was therefore DELETED and `data-track-view` added in the same
 * change (root §8.2); leaving both would double-fire. The old header said
 * "do NOT migrate it to data-track-view" — correct while Radix was here,
 * obsolete now. Consequence: no hooks, no "use client", ZERO client JS.
 *
 * DESIGN. Rebuilt to a reference supplied as LAYOUT direction: big two-line
 * centred heading with an accent second line, full-width stacked bars with
 * gaps, first row open and filled, circular chevron affordance. Layout only
 * — the reference's questions and claims are not EBS's, which is the trap
 * that put insurance claims and the TPO/PVC/EPDM list into the UNVERIFIED
 * CAPABILITIES table.
 *
 * ⚠️ CONTRAST, measured rather than eyeballed (root §11.10):
 *   · The open row is brand-primary-HOVER (#1376B4), NOT brand-primary.
 *     White on brand-primary is 3.99:1 and fails AA for normal text; on the
 *     hover tone it is 4.91:1. Same decision as ServiceONEFaqWrapper and the
 *     city-landing service cards. Do not "correct" it back.
 *   · The accent heading line is --color-brand-secondary-text (#8D6917,
 *     4.73:1 here). The DISPLAY gold #DDA82C is 2.03:1 on this ground and
 *     fails even the 3:1 large-text bar — which is precisely why that third
 *     gold token exists. The reference's accent is its vivid brand colour;
 *     ours cannot be, on white.
 *   · The reference sets its accent line in ITALIC. NOT reproduced: the font
 *     request loads no italic axis for Barlow Semi Condensed, so `italic`
 *     would synthesise a faux oblique on a condensed face. Adding `ital` to
 *     the Layout.astro font URL is the real fix if that flourish is wanted.
 *
 * COPY HISTORY (unchanged by this pass, kept because it is still true).
 * Everything below the title was the previous client's until earlier the
 * same day: five tree-service Q&As naming Medrano's in every question.
 * EBS-About renders this with NO `items` prop, so `defaultFaqItems` — which
 * reads like unreachable placeholder data — WAS the live copy (root
 * §13.3.8, the fourth instance in this redesign).
 *
 * ⚠️ TWO QUESTIONS WERE DROPPED, NOT REWORDED — both banned by the CLAIMS
 * REGISTER, and no rewording makes either shippable:
 *   · insurance-claim support — an UNVERIFIED CAPABILITY. One answer from
 *     the owner moves it to CLEARED and it can come back.
 *   · emergency / 24-7 work — MUST-NOT-SHIP outright. EBS has no emergency
 *     line (`CLIENT.contact.emergencyPhoneDisplay` is deliberately empty).
 * A third, "how long does it take", was dropped as a DURATION PROMISE with
 * no source in the intake or config.
 *
 * Everything asserted below is CLEARED: family-run and locally owned, in
 * business since `yearFounded`, the credential title (an owner override),
 * residential and commercial, free estimates, and the three-county area.
 */

import React from "react";
import { CLIENT } from "../config/client.config";

/** Derived, never typed — a hardcoded year silently rots (client §1). */
const YEARS_IN_BUSINESS =
  new Date().getFullYear() - CLIENT.business.yearFounded;

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface FullStretchFaqWrapperProps {
  id?: string;
  className?: string;

  /** Two-line heading. Line 2 renders in the accent colour. */
  titleLine1?: React.ReactNode;
  titleLine2?: React.ReactNode;

  /** FAQ data — array of { question, answer } */
  items?: { question: string; answer: React.ReactNode }[];

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

const defaultFaqItems = [
  {
    question: `What makes ${CLIENT.business.nameShort} different from other tree companies?`,
    answer: `${CLIENT.business.name} is family-run and locally owned, and has been taking down and trimming trees across ${CLIENT.geo.serviceArea} since ${CLIENT.business.yearFounded} \u2014 ${YEARS_IN_BUSINESS}+ years in the same community. Our own crews do the work, bonded and insured, and every estimate is written and free.`,
  },
  {
    question: `What areas does ${CLIENT.business.nameShort} serve?`,
    answer: `${CLIENT.geo.serviceArea}, including ${CLIENT.geo.previewCities.join(", ")}. If you are not sure whether your address is in range, call ${CLIENT.contact.phoneDisplay} and ask.`,
  },
  {
    question: "Are estimates free?",
    answer:
      "Yes. There is no charge to come out and no obligation. We look at the tree, talk you through what we would do, and give you a written estimate.",
  },
  {
    question: `What ${CLIENT.vocabulary.tradeName.toLowerCase()} work does ${CLIENT.business.nameShort} do?`,
    answer:
      "Tree removal, tree trimming, stump grinding and storm clean-up \u2014 for both residential and commercial properties. Each service has its own page with more detail on what the work involves.",
  },
  {
    question: `What are ${CLIENT.business.nameShortPossessive} hours?`,
    answer: `${CLIENT.business.hoursDisplay}. Same-day tree removal is available depending on the job and the crew's schedule that day — call ${CLIENT.contact.phoneDisplay} and we will tell you straight.`,
  },
  {
    question: `Is ${CLIENT.business.nameShort} insured?`,
    answer:
      "Yes \u2014 bonded and insured, and our own crews do the work. North Carolina does not license tree services, so proof of insurance is the thing to ask any tree company for.",
  },
];

export default function FullStretchFaqWrapper({
  id,
  className,
  titleLine1 = `${CLIENT.vocabulary.tradeName.toUpperCase()} FAQS, ANSWERED BY`,
  titleLine2 = "YOUR LOCAL EASTERN NC TREE CREW",
  items = defaultFaqItems,
  trackingSection = "faq",
  trackingCity,
  trackingService,
  trackingPageType,
}: FullStretchFaqWrapperProps) {
  /* The context spread is repeated onto each <summary> so a
     toggle_nav_section click carries the same city/service/page_type the
     section root does — the click bridge walks up to the nearest
     data-event, not to the section root. */
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  return (
    <section
      id={id}
      /* ⚠️ `relative isolate` IS LOAD-BEARING, not decoration. The two
         texture layers below use mix-blend-multiply, which blends against
         whatever backdrop is beneath them — without a stacking context of
         its own this section darkens its NEIGHBOUR as well as itself. Same
         requirement ConcreteGround documents and every other textured
         section on this site sets. `overflow-x-hidden` keeps the stretched
         sheet from widening the document. */
      className={[
        "relative isolate w-full overflow-x-hidden bg-default-background",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-track-view
      {...tracking}
    >
      {/* ⚠️ NOT A TILE — preserveAspectRatio='none' plus
          bg-[length:100%_100%] bg-no-repeat, so ONE sheet stretches across
          the section however tall it gets. A pixel background-size turns it
          into a tile and the creases stop reaching the edges, which is the
          effect. Geometry and the full rationale live in global.css under
          body.theme-ebs (--site-tex-creases-faq). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-creases-faq)] bg-[length:100%_100%] bg-no-repeat opacity-[0.85] mix-blend-multiply"
      />
      {/* Grain. TECHNICAL, not decorative: the creases are large, very
          shallow gradients — exactly the case 8-bit displays render as
          visible banding across a band this wide. Remove it and banding
          appears on some monitors and not others. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-grain)] bg-[length:140px] opacity-[0.05] mix-blend-multiply"
      />
      {/* `relative` lifts the content out of the texture layers' flow so it
          paints above them; without it the multiply layers sit on top of the
          rows and grey the white cards. */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        {/* Two-line centred heading, per the reference. `block` on both
            spans is what forces the break, rather than leaving it to the
            measure to wrap in roughly the right place. */}
        <h2 className="text-center font-heading-1 text-3xl font-bold uppercase leading-[1.08] text-default-font md:text-5xl">
          <span className="block">{titleLine1}</span>
          <span className="mt-2 block text-(--color-brand-secondary-text)">
            {titleLine2}
          </span>
        </h2>

        <div className="mt-10 flex w-full flex-col gap-5 md:mt-14">
          {items.map((item, i) => (
            <details
              key={i}
              open={i === 0}
              /* `group` is what lets the summary and the chevron respond to
                 the OPEN state with no JS at all. */
              className="
                group w-full overflow-hidden rounded-lg bg-white
                shadow-sm ring-1 ring-neutral-200
                transition-shadow duration-200
                open:shadow-md
                motion-reduce:transition-none
              "
            >
              <summary
                data-event="toggle_nav_section"
                data-label={`faq-toggle-${i + 1}`}
                {...tracking}
                /* `list-none` AND the webkit marker rule are BOTH required —
                   without both, Safari keeps drawing the native disclosure
                   triangle and the row gets a stray glyph before the text. */
                className="
                  flex w-full cursor-pointer list-none items-center
                  justify-between gap-4 px-6 py-5 md:px-8 md:py-6
                  text-left font-heading-1 text-xl font-bold uppercase
                  tracking-[0.01em] text-default-font md:text-2xl
                  transition-colors duration-200
                  hover:bg-neutral-50
                  group-open:bg-brand-primary-hover group-open:text-white
                  group-open:hover:bg-brand-primary-hover
                  focus-visible:outline-2 focus-visible:outline-offset-[-2px]
                  focus-visible:outline-brand-primary-hover
                  motion-reduce:transition-none
                  [&::-webkit-details-marker]:hidden
                "
              >
                <span className="min-w-0">{item.question}</span>

                <span
                  aria-hidden="true"
                  className="
                    flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-full bg-brand-primary-hover text-white
                    transition-transform duration-200
                    group-open:rotate-180 group-open:bg-white
                    group-open:text-brand-primary-hover
                    motion-reduce:transition-none
                  "
                >
                  <Chevron />
                </span>
              </summary>

              <div className="px-6 pb-6 pt-5 md:px-8 md:pb-8">
                <p className="max-w-[80ch] font-body text-base leading-relaxed text-neutral-600 md:text-lg">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
