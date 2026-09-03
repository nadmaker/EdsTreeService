import React from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * EBS — scrolling credential band.
 *
 * NEW 2026-09-01, by request; made a MARQUEE the same day to a supplied
 * reference (an orange strip alternating a mark with two uppercase claims,
 * running continuously edge to edge). A full-bleed brand-primary strip on
 * the six city landings, between the offer carousel and why-choose-us.
 *
 * Fully wrapper-authored — no Subframe parent, no `@subframe/core`, no
 * hooks, no "use client". Ships ZERO client JS: the motion is a CSS
 * animation, not a script. view_section is Mechanism A (`data-track-view`,
 * root §8.2); ⚠️ do NOT add a React observer alongside it or view_section
 * double-fires.
 *
 * MARQUEE MECHANICS — the same technique as TrustBadgesWrapper, and it
 * deliberately REUSES that section's `site-badge-marquee` keyframe rather
 * than declaring a second one. The keyframe is generic (translateX 0 →
 * -50%); only its name mentions badges. Two identical sets sit side by side
 * and the track slides by exactly half its own width, so the -50% frame is
 * pixel-identical to 0% and the loop repeats with no seam and no JS.
 *
 * `translateX` rather than `left`/margin: transforms run on the compositor,
 * so a strip animating for the life of the page costs no layout or paint.
 *
 * ⚠️ CONTRAST — the reason the type is this large.
 * White on `--color-brand-primary` (#1685CC) measures **3.99:1**. That FAILS
 * WCAG AA for normal text (4.5:1) and PASSES only as LARGE text (3:1), which
 * needs ≥24px at any weight or ≥18.66px BOLD. `text-xl` bold is 20px/700 and
 * clears it; `text-lg` (18px) would NOT, which is why the mobile size is not
 * stepped down. Same 3.99:1 pair the locations disclosure hit — contrast is
 * a property of the COLOUR PAIR, so inverting to blue-on-white changes
 * nothing. If smaller type is ever wanted here, the ground must go darker.
 *
 * ⚠️ CLAIMS. Both strings are CLEARED, and one is contested:
 * · "Residential & Commercial" — cleared.
 * · "OSHA Certified" — the OWNER OVERRIDE of 2026-08-27. Ryan directed this
 *   wording after being shown that the CLAIMS REGISTER lists it as
 *   MUST-NOT-SHIP, because OSHA certifies neither companies nor individuals
 *   and its Outreach Training Program forbids advertising course completion
 *   as certification. What EBS crews hold is OSHA 10 & 30-hour cards. It is
 *   deliberate — do not "correct" it back without asking. It is the SHORT
 *   FORM of CLIENT.vocabulary.credentialTitle ("OSHA Certified Roofer"), so
 *   they are the SAME CLAIM: if the override is walked back, BOTH change,
 *   and the accurate substitute is "OSHA 10 & 30-Hour Trained".
 */

const LOGO_SRC = "/images/edstree-logo-white.png";

/** One pass of the strip: each claim preceded by the mark. */
const CLAIMS = [
  "Bonded & Insured",
  `Family-Owned Since ${CLIENT.business.yearFounded}`,
  "Free Estimates",
  "Same-Day Tree Removal",
  "Residential & Commercial",
] as const;

/**
 * How many times CLAIMS repeats to form ONE marquee set.
 *
 * The track holds two identical sets and slides by exactly -50%, which is
 * what makes the loop seamless. For it to also look CONTINUOUS, a single
 * set must be at least as wide as the viewport — otherwise a bare gap
 * crosses the screen once per cycle.
 *
 * At 20px bold uppercase the pair measures roughly 750px (≈310 + ≈180 for
 * the two labels, two 48px marks, four 40px gaps), so four repeats give a
 * set near 3000px. That covers ultra-wide desktops with margin; three would
 * leave a 2560px monitor short.
 */
const MARQUEE_REPEATS = 4;

export interface CredentialBandWrapperProps {
  id?: string;
  className?: string;

  /** Claims to cycle. Each is rendered preceded by the EBS mark. */
  claims?: readonly string[];

  /** Tracking context (root §8.6). */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function CredentialBandWrapper({
  id,
  className,
  claims = CLAIMS,

  trackingSection = "credential-band",
  trackingCity,
  trackingService,
  trackingPageType,
}: CredentialBandWrapperProps) {
  const set = Array.from({ length: MARQUEE_REPEATS }, () => claims).flat();

  return (
    <section
      id={id}
      /* `overflow-hidden` is what turns an over-wide track into a strip.
         The band is short on purpose — the reference is a rule between two
         sections, not a section of its own. */
      className={[
        "w-full overflow-hidden bg-brand-primary py-5 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/*
        The track is a plain block inside the overflow-hidden section —
        deliberately NOT `w-screen`, which ignores the scrollbar and would
        add ~15px of horizontal document overflow on desktop. These pages
        already carry one overflow bug in the 768-1024 band; they do not
        need a second.

        aria-hidden on the whole track: it renders the two claims eight
        times each, so a screen reader would otherwise announce them
        sixteen times. The sr-only list below carries them exactly once.
      */}
      <div
        className={[
          "flex w-max",
          "animate-[site-badge-marquee_40s_linear_infinite]",
          // Let a reader stop it to actually read one.
          "hover:[animation-play-state:paused]",
          // Degrades to a static row — identical layout, it simply stops
          // moving, so nothing breaks for reduced-motion users.
          "motion-reduce:animate-none",
        ].join(" ")}
        aria-hidden="true"
      >
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            /* Trailing padding equal to the gap, so the space between the
               last item of one set and the first of the next matches the
               interior spacing. Without it the seam shows as a tight join
               once per cycle — still seamless, just visibly irregular. */
            className="flex shrink-0 items-center gap-8 pr-8 md:gap-10 md:pr-10"
          >
            {set.map((claim, i) => (
              <React.Fragment key={`${setIndex}-${i}-${claim}`}>
                {/*
                  The mark, not the wordmark — buildings and swoosh only,
                  which is what lets it punctuate the strip rather than
                  compete with the words.

                  alt="" and the aria-hidden track above mean this is never
                  announced; the sr-only list is the accessible copy.

                  loading="lazy" is REQUIRED, not optional. React 19's SSR
                  emits a high-priority <link rel="preload" as="image"> for
                  every <img> that lacks it (root §9.13). This band is far
                  below the fold on all six landings, and it renders the
                  same file 16 times — without this it would preload at
                  highest priority against the hero.

                  ⚠️ The source is 946×946 / ~90 KB rendering at 40-48px.
                  One file, so one request, and lazy — but a resize to
                  ~96px would take it to a few KB and is worth doing in the
                  next image pass (handoff §5.2).
                */}
                <img
                  src={LOGO_SRC}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={725}
                  height={269}
                  className="h-10 w-auto shrink-0 md:h-12"
                />
                <span className="whitespace-nowrap text-xl font-bold uppercase tracking-[0.08em] leading-none text-white">
                  {claim}
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* The accessible copy of the strip — each claim exactly once. */}
      <ul className="sr-only">
        {claims.map((claim) => (
          <li key={claim}>{claim}</li>
        ))}
      </ul>
    </section>
  );
}
