"use client";

import React, { useEffect, useRef } from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — About Us (variant 1).
 *
 * RENAMED 2026-08-31, by request: this file was ServiceAreaWrapper_v1_1.tsx,
 * a name inherited from content that no longer lives here. It renders the
 * About Us block — eyebrow, headline, Mission and Vision — plus the photo
 * collage and the guarantee card. Nothing in it concerns the service area.
 *
 * The "variant 1" is Ryan's naming and anticipates alternates. Note it does
 * not carry the *Wrapper.tsx suffix root §6.10 asks of new wrappers: the name
 * was given explicitly, and this file no longer wraps a Subframe component at
 * all, so the suffix's signal ("this customises a Subframe parent") would be
 * false. Several legacy files here are already suffix-free for similar
 * reasons.
 *
 * ⚠️ data-section IS STILL "service-guarantee" and was deliberately NOT
 * renamed with the file. The two are different concerns: the filename is for
 * developers, data-section is an analytics key. Renaming the file cost
 * nothing; renaming the tracking key is a taxonomy edit that has to be made
 * in the client CLAUDE.md section inventory at the same time (root §13.5.2).
 * It is FREE to do right now — EBS has no GTM container, so there is no
 * history to break — and that window closes the moment one is installed.
 *
 * ⚠️ A RELATED INVERSION SURVIVES. ServiceGuaranteeAndFeaturesWrapper.tsx
 * emits data-section="map-and-benefits" and holds the map, contact rows and
 * feature tiles. Its filename is now the misleading one: it says "guarantee"
 * while the guarantee card lives HERE. The two sections exchanged content
 * across several passes on 2026-08-30 and only the emitted names were
 * realigned. Renaming that file is the remaining half of this cleanup.
 *
 * Fully wrapper-authored: the `ServiceAreaSection2` Subframe parent was
 * dropped. It could not be kept, because this section and
 * ServiceGuaranteeAndFeaturesWrapper exchanged content blocks and the moved
 * region here — the whole right column — was fixed Subframe markup wrapping
 * eight separate slots rather than a single slot that could be handed over.
 * Root §7.1's ceiling: className restyles, it does not restructure.
 *
 * Dropping it also deleted 23 arbitrary-variant overrides that existed only
 * to fight that component's internal layout (root §7.8 flags five as the
 * point to escalate).
 *
 * LEFT column keeps an "About Us" eyebrow, the headline and the copy.
 * RIGHT column now holds the four feature tiles that used to live in the
 * guarantee section. The map, contact rows, service areas and locations
 * list went the other way.
 *
 * ✅ CONTENT REWRITTEN FOR EBS 2026-09-01. The four Mission/Vision
 * paragraphs were the previous client's — tree removal, pruning and stump
 * grinding in the Raleigh–Durham Triangle, crediting "certified arborists"
 * and an "ISA Certified Tree Expert", with a "schedual" typo. That was the
 * wholesale per-fork replacement DUPLICATE.md Step 6 covers, not a token
 * swap. The structure is unchanged (two paragraphs per label, the fourth
 * still hidden on mobile), so the measured gradient ramp and the contrast
 * constraints below still hold.
 *
 * ⚠️ EBS-Home passes NO content props to this wrapper — only tracking — so
 * these defaults ARE the live home-page copy (root §13.3.8's inverse). Edit
 * them as shipping copy, not as placeholder.
 *
 * ⚠️ CLAIMS, checked against EBS_HANDOFF_Step0-Step1.md §3 while writing:
 * every fact here is cleared — since 2006, OSHA Certified Roofer (owner
 * override), residential AND commercial, free inspection + written estimate
 * (the one real offer in client.config.ts). "After a storm" is a TIME
 * reference, not an availability promise; the register bans 24-7 and
 * emergency framing but explicitly allows post-storm repair work. Two
 * absolutes were kept from the original prose and are Ryan's call to keep:
 * "Safety is ALWAYS our top priority" and "EVERY project". Deliberately
 * absent: "Same-Day Roofing" (credible for repair only, and this section
 * spans replacement), the lifetime warranty (cleared but still undefined),
 * and any insurance-claim, roof-cleaning or tarping language (UNVERIFIED).
 */

const BACKGROUND_IMAGE = "/images/ebs-service-area-bg.jpg";

/* ── Right-column collage (desktop only) ────────────────────────────────
   ⚠️ PLACEHOLDERS, chosen 2026-08-31 to be swapped. Ryan asked for "2
   random photos from my media" to hold the layout while the real pair is
   picked.

   They are NOT random. The ebs-gallery-* files were avoided deliberately:
   handoff §6 records that batch as still suspected of being the PREVIOUS
   CLIENT's tree photography under EBS filenames, which is the same reason
   the services grid refuses to carry a photograph at all. These two are
   HERO images instead — the most scrutinised surface on the site, so the
   likeliest to have been vetted — and they are also the two smallest
   relevant files (170 KB + 67 KB), which matters for the reason below.

   ⚠️ ALT TEXT DESCRIBES THESE SPECIFIC PHOTOS. Swapping the files without
   rewriting the alt leaves a screen reader announcing the wrong image —
   a silent failure, since nothing renders differently.
   ------------------------------------------------------------------- */
const COLLAGE_IMAGE_PRIMARY = "/images/ebs-hero-2-roof-replacement.jpg";
const COLLAGE_IMAGE_SECONDARY = "/images/ebs-hero-3-commercial-siding.jpg";

/**
 * Derived, never typed. This headline carried a hardcoded "18 Years"
 * while `yearFounded` is 2006 — the same arithmetic error that was in
 * BusinessStatisticsWrapper, copied. Deriving it in both places means the
 * two cannot disagree with each other or with config again.
 *
 * "In business since 2006" is CLEARED in the CLAIMS REGISTER
 * (EBS_HANDOFF_Step0-Step1.md §3).
 */
const YEARS_IN_BUSINESS = new Date().getFullYear() - CLIENT.business.yearFounded;

/*
  Hand-drawn star, replacing FeatherStar + IconWrapper. Those were this
  wrapper's ONLY @subframe/core imports and both lived inside the guarantee
  card that this pass deleted, so the dependency goes with them — the file
  now imports React and CLIENT and nothing else. Same reasoning as the map
  section: no network request, invisible to React 19's image preload pass,
  and it inherits currentColor so a fork re-skins it by token.

  aria-hidden because the text beside it carries the meaning; the star is
  decorative. That also keeps it clear of the contrast rule that the gold
  headline does not pass (see §6 of the redesign handoff).
*/
function StarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 5.88 6.49.95-4.7 4.58 1.11 6.46L12 17.33l-5.8 3.04 1.1-6.46-4.69-4.58 6.49-.95L12 2.5Z" />
    </svg>
  );
}

/* ── Mission / Vision icons ─────────────────────────────────────────────
   STROKED, not filled like StarIcon above. That is deliberate: these two
   sit inside outlined circles in the reference layout and read as line
   work, whereas the star is a solid badge mark. They follow the same
   24×24 / 1.6-stroke grid the services grid uses, so the two sections'
   icons sit at a consistent weight.

   Inline rather than @subframe/core, for the reason already recorded on
   StarIcon: importing Feather back into this file would re-add a
   dependency purely to redraw shapes that are four paths.
   ------------------------------------------------------------------- */

const strokeIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Concentric target — what the company aims at. */
function MissionIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} {...strokeIconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Eye — what the company is looking toward. */
function VisionIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} {...strokeIconProps}>
      <path d="M2.6 12S6.2 5.8 12 5.8 21.4 12 21.4 12 17.8 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="2.9" />
    </svg>
  );
}

export interface AboutUsVariant1Props {
  id?: string;
  className?: string;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;

}

export default function AboutUsVariant1({
  id,
  className,
  trackingSection = "service-guarantee",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "home",
}: AboutUsVariant1Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedSection = useRef(false);

  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

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
            window as Window & { dataLayer?: Record<string, unknown>[] }
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

  return (
    <section
      id={id}
      ref={sectionRef}
      className={["relative w-full overflow-hidden bg-white px-6 md:px-10", className]
        .filter(Boolean)
        .join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* Background photo.

          loading="lazy" is load-bearing, not a default: React 19's SSR
          emits a high-priority <link rel="preload"> for every <img> it
          renders WITHOUT it (root §9.13), which would put this background
          in direct bandwidth competition with the hero's LCP image. This
          section sits below the fold, so lazy keeps it off the critical
          path entirely. Do NOT copy the hero's fetchPriority="high" here.

          FRAMING — why `translate-x` and not `object-position`:
          this section is far wider in ratio (~1.71) than the photo (1.49),
          so object-cover fits it by WIDTH and crops only vertically. With
          no horizontal overflow there is nothing for object-position to
          shift along, and `object-[35%_center]` was silently a no-op.
          Scaling does not help either — it grows both axes, so the image
          stays width-constrained at any zoom.

          Translating the scaled box is what actually moves the framing.
          scale-125 gives 25% of overflow to work with; translate-x moves
          the image RIGHT, which reveals more of the photo's LEFT side. */}
      <img
        src={BACKGROUND_IMAGE}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-125 translate-x-[5%] object-cover object-center"
      />

      {/* White scrim, top-down: near-solid white at the top falling away
          toward the bottom, so the section blends out of what sits above it
          and the photograph emerges as you read down.

          One layer serves BOTH breakpoints here, which a horizontal
          gradient could not: desktop is two columns and mobile stacks them,
          so a left-to-right fade lands differently on each, but both
          layouts run top-to-bottom.

          See the stop-by-stop reasoning on the element itself — the ramp
          is calibrated against measured text positions, not chosen by
          eye. */}
      <div
        aria-hidden="true"
        /*
          Five-stop top-down white scrim, reshaped 2026-08-30 to a reference
          Ryan supplied (Shingle Hut's reviews band): near-solid white behind
          the heading, opening up so the photograph reads clearly at the
          bottom edge. The old ramp was from-white / via-white/96 /
          to-white/88 — so flat the photo never exceeded 12% anywhere and
          read as noise rather than an image.

          ⚠️ THE STOPS ARE CALIBRATED TO WHERE TEXT ACTUALLY SITS, measured
          rather than eyeballed. Two things gate them:

          1. The ramp stays whitest at the TOP because the headline's "20
             Years" is brand-secondary GOLD, which is mid-luminance and needs
             a light background — it gets WORSE, not better, as the backdrop
             darkens. The blue that follows it behaves the same way.
             ⚠️ As of 2026-08-31 the topmost element is the "About Us"
             eyebrow, also a gold (--color-brand-secondary-text, 4.73:1 on
             the background). It has the LEAST headroom of anything in this
             column, and it sits in the 0.97 band, which is the only reason
             it clears. This top stop is now load-bearing for two gold
             elements rather than one — do not lower it.
          2. Below that it can fall away, because the prose was darkened
             from grey to navy in the same pass. Grey capped this gradient;
             navy does not — the prose measures ~13:1 at every band, so the
             stops below are now a PURELY VISUAL choice, not an
             accessibility-constrained one.

          ⚠️ The steepness was dialled BACK on 2026-08-30 after Ryan compared
          two states side by side: an earlier, whiter ramp read better than
          the wide-open one, which showed too much of the house through the
          copy. White is held to ~62% and the fade does its work in the last
          third. If this is ever reopened, the limit is taste rather than
          contrast — measure the MEDIAN per row (what the eye sees), not the
          90th percentile (which measures only the paper between glyphs and
          will tell you the photo is barely there).

          Lesson worth keeping: percentage stops are coupled to the section's
          CONTENT HEIGHT. Deleting the About Us disclosure on 2026-08-30
          shortened the section 673px -> 588px and silently slid the prose
          down into the opening zone, taking the worst band to 4.49:1 without
          anyone touching the gradient. Re-measure after ANY content change
          here.

          Applied to the 2026-08-31 eyebrow move: it shortened this column
          by roughly 20px (heading-2 -> eyebrow type size, and the gap to the
          headline tightened 24px -> 12px). That moves the prose UP into
          whiter bands, which is the SAFE direction — contrast can only
          improve. Recorded rather than re-measured for that reason; a change
          that lengthens the column is the one that needs the measurement.

          This is where it differs from the reference and why it cannot
          simply be copied: the reference puts its middle content on SOLID
          WHITE CARDS and leaves its bottom third empty, so its scrim can
          fall away far earlier. Ours has unbacked grey paragraphs there.
          If the prose ever moves onto a card, or darkens to
          text-default-font, this ramp can open up much closer to the
          reference — re-measure before doing it.
        */
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.95)_32%,rgba(255,255,255,0.91)_62%,rgba(255,255,255,0.76)_84%,rgba(255,255,255,0.42)_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px]">
        {/* py-16 md:py-20, raised from a flat py-12 on 2026-08-31 by request.
            Still tighter than the services grid below (py-20 md:py-28), so
            the two read as different weights rather than one repeated rhythm.

            ⚠️ THIS IS A SCRIM CHANGE AS WELL AS A SPACING ONE, which is not
            obvious. The gradient overlay is inset-0 across the whole section,
            and its stops are PERCENTAGES — so growing the padding grows the
            section, and every piece of content lands on a different point of
            the ramp without the gradient being touched. The note on the
            gradient itself records a past incident where exactly this went
            unnoticed in the other direction.

            Worked through rather than assumed, because the two ends move
            OPPOSITE ways:

              · Content TOP shifts slightly later on the ramp (~8% -> ~12%),
                which sits inside the 0.97 -> 0.95 band. Change is under one
                percentage point of white. The gold eyebrow and gold headline,
                which have the least headroom on the page, are unaffected.
              · Content BOTTOM shifts EARLIER (~92% -> ~88%), so the backdrop
                behind the guarantee card goes from roughly 0.59 to 0.68 white.

            That second one is the one to know about, and it is a small COST,
            not a gain. The card is a 60% navy wash, so a whiter backdrop makes
            its composite lighter, which lowers white-on-card contrast from
            about 5.8:1 to about 5.0:1. Still clears AA comfortably — but it is
            a second, independent reason the fill sits at /60 rather than the
            /50 originally asked for: at /50 this padding change would have
            pushed that text under 4.5:1. The fill and this padding are now
            coupled; raise the padding much further and re-check the card. */}
        <div className="flex w-full flex-col gap-10 py-16 md:flex-row md:items-start md:gap-16 md:py-20">
          {/* LEFT — About Us eyebrow, headline, copy. */}
          <div className="flex w-full flex-col items-start gap-6 md:flex-1">
            {/* Eyebrow + headline are grouped in their own column so they sit
                at gap-3 rather than the parent's gap-6. An eyebrow has to hug
                the title it labels — at 24px it reads as a separate line of
                text instead. Grouping is deliberately used here in place of a
                negative margin on the eyebrow, which would have to be re-tuned
                every time the parent's gap changes. */}
            <div className="flex w-full flex-col items-start gap-3">
              {/* Reads "About Us" (2026-08-30, by request). It previously
                  rendered CLIENT.vocabulary.guaranteeName, which duplicated the
                  guarantee callout in the right column of this same section.
                  A plain string rather than a token: this is a structural
                  label for the prose beneath it, not a brand name, so it
                  should NOT change when a fork changes its guarantee wording.

                  ⚠️ MOVED ABOVE THE HEADLINE 2026-08-31, by request, and
                  RESTYLED as a consequence rather than as a separate decision.
                  It was text-heading-2 in brand-primary, which worked while it
                  sat BELOW the headline and read as a sub-heading for the
                  prose. Above the headline, that size competes with it — two
                  headings stacked, neither leading. It now uses the site's
                  established eyebrow treatment (small, uppercase, letterspaced),
                  the same rhythm the services grid, hero and stats band share.

                  ⚠️ COLOUR IS NOT A STYLE CHOICE — it is a contrast one.
                  brand-primary measures 3.74:1 on the background, which clears
                  AA only as LARGE text. That was fine at heading-2; at eyebrow
                  size it is normal text and would fail. --color-brand-secondary-text
                  (#8D6917, 4.73:1) is the token global.css defines for exactly
                  this case — the only gold that passes AA as body-sized text.
                  Do not "restore" brand-primary here without also restoring the
                  heading-2 size. */}
              <span className="w-full text-sm font-semibold uppercase tracking-[0.22em] text-(--color-brand-secondary-text) md:text-base">
                About Us
              </span>

              <span className="w-full text-heading-1 font-heading-1 text-default-font">
                <span className="font-heading-1 font-bold">
                  <span className="text-brand-secondary">
                    {YEARS_IN_BUSINESS} Years
                  </span>{" "}
                  <span className="text-brand-primary">
                    of Trusted {CLIENT.vocabulary.tradeName} in{" "}
                    {CLIENT.seo.regionLabel}
                  </span>
                </span>
              </span>
            </div>

            {/* ── MISSION / VISION ───────────────────────────────────────
                RESTRUCTURED 2026-08-31, by request, to the layout language
                of a supplied reference: a labelled block, a rule running
                out to a circled icon, then the prose — twice, with a
                divider between.

                The reference puts its label and icon to the RIGHT of the
                copy, in a two-column row. That is not reproduced literally
                and the difference is deliberate: this copy already sits in
                the LEFT column of a two-column section, so a further
                text|label split inside it would leave roughly 25% of the
                page width per sub-column and wrap the prose to three or
                four words a line. The reference's devices are kept — bold
                blue label, connecting rule, outlined circular icon — with
                the label ABOVE the prose, which is also what was asked for.
                The reference's between-row divider was tried and dropped;
                see the note where it used to sit.

                On 2026-08-31 the four paragraphs were only REGROUPED —
                1+2 under Mission, 3+4 under Vision, per the markup supplied
                — and were still the previous client's tree-care copy. They
                were REWRITTEN for EBS on 2026-09-01; see the header note for
                the claims that were checked. The 2+2 grouping and the
                mobile-hidden fourth paragraph were both preserved, so the
                geometry below is unaffected.

                text-default-font (navy) on the prose, NOT text-subtext-color
                (grey), and that is load-bearing. Grey measured 4.55:1 at its
                worst band over the photo — at the AA line — so the gradient
                could not fade any higher without failing. Navy's luminance is
                0.025 against grey's 0.171, roughly three times the headroom,
                which moves the constraint off the prose entirely.
                ⚠️ Reverting the prose to grey REQUIRES pulling the gradient's
                stops back up; the two are coupled.

                ⚠️ THE LABELS DO NOT INHERIT THAT HEADROOM. They are
                brand-primary, which measures 3.74:1 — it clears AA only as
                LARGE text, which is why they are set at 20/24px bold rather
                than at the body size the reference's labels appear to use.
                Shrinking them breaks AA. The lower ("Vision") label also sits
                further down the scrim than any coloured text did before, so
                it has the least headroom on the page — see the gradient note
                above before moving it down any further.

                The fourth paragraph stays hidden on mobile, as it was: the
                Subframe original shipped a duplicated mobile/desktop copy
                pair that differed only by that paragraph, sent both to every
                visitor, and had to be edited twice.
                ──────────────────────────────────────────────────────── */}
            <div className="flex w-full flex-col gap-8">
              {/* MISSION */}
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center gap-4">
                  <span className="flex-none font-heading-2 text-xl font-bold text-brand-primary md:text-2xl">
                    Mission
                  </span>
                  {/* Rule runs from the label out to the icon — the
                      reference's divider, turned horizontal. Decorative, so
                      it is aria-hidden and carries no semantics. */}
                  <span aria-hidden="true" className="h-px flex-1 bg-neutral-300" />
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-brand-primary/25 bg-brand-primary/10 text-brand-primary">
                    <MissionIcon className="h-5 w-5" />
                  </span>
                </div>

                <div className="w-full space-y-4 text-body font-body text-default-font">
                  <p>
                    Since {CLIENT.business.yearFounded}, {CLIENT.business.name}{" "}
                    has proudly served {CLIENT.geo.serviceArea} as the go-to
                    experts for roof replacement, roof repair, and siding
                    installation. Led by{" "}
                    {CLIENT.vocabulary.credentialTitle} {CLIENT.business.owner},
                    our team is known for being reliable, knowledgeable, and
                    genuinely committed to the safety of our community.
                  </p>

                  <p>
                    Homeowners, business owners, and property managers trust
                    our crews to deliver dependable, high-quality work. We
                    understand the importance of maintaining a clean and
                    professional exterior, and we work efficiently to minimize
                    disruption to your schedule.
                  </p>
                </div>
              </div>

              {/* ⚠️ NO full-width divider between the blocks. There was one —
                  the reference's row rule — and it was removed 2026-08-31 by
                  request. It read as a stray line: each label row already
                  carries its own rule out to its icon, so a third horizontal
                  line in the same column was one too many and separated
                  nothing the gap-8 below does not already separate.
                  Do not reinstate it without removing the label rules. */}

              {/* VISION */}
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center gap-4">
                  <span className="flex-none font-heading-2 text-xl font-bold text-brand-primary md:text-2xl">
                    Vision
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-neutral-300" />
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-brand-primary/25 bg-brand-primary/10 text-brand-primary">
                    <VisionIcon className="h-5 w-5" />
                  </span>
                </div>

                <div className="w-full space-y-4 text-body font-body text-default-font">
                  <p>
                    Whether you have a few damaged shingles after a storm or an
                    entire home that needs new roofing, siding, and gutters, we
                    provide exterior solutions that keep your property
                    protected and looking its best. Safety is always our top
                    priority. We communicate clearly, honor scheduled
                    appointments, and complete every project with precision and
                    care.
                  </p>

                  <p className="hidden md:block">
                    Before the next storm tests your roof, call{" "}
                    {CLIENT.business.nameShort} for a free inspection and a
                    written estimate from an{" "}
                    {CLIENT.vocabulary.credentialTitle}. Our skilled and
                    well-equipped crew handles both residential and commercial
                    work across {CLIENT.geo.serviceArea} — from a single repair
                    to a full replacement.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT — guarantee callout. RESTORED 2026-08-30: it had been
              replaced by an inline rule in the left stack, which was not
              what Ryan asked for.

              ⚠️ ALIGNMENT went through three states on 2026-08-31 before
              landing. Recorded because two of them look like reasonable
              choices and both were rejected for reasons the code cannot show:

                md:self-center      — original, correct while the column held
                                      a single card. Once the collage was added
                                      it left the card floating mid-column.
                md:justify-between  — pinned the collage to the top of the
                                      section and the card to the bottom. It
                                      stretched the pair apart, and the collage
                                      rose above the "About Us" eyebrow
                                      opposite it, losing any relation to the
                                      copy. Rejected.
                md:self-center
                  + md:mt-16        — lowered the pair together, correct
                                      direction, but the offset was by eye.
                md:justify-end      — CURRENT. Bottom-aligns the card with the
                                      left column's last paragraph as a
                                      RELATIONSHIP rather than a measurement.

              See the note on the column itself for why the last one survives a
              copy rewrite and the mt-16 version would not.

              ⚠️ The star is the local inline-SVG StarIcon, NOT the original
              FeatherStar + IconWrapper. Visually identical, and it keeps
              @subframe/core out of this file — restoring the import would
              have re-added a dependency purely to redraw the same shape. */}
          {/* md:self-stretch + md:justify-end is what makes this card's BOTTOM
              EDGE line up with the bottom of the left column's last paragraph,
              which is what was asked for.

              It replaced a md:self-center + md:mt-16 pair that was doing the
              same job by eye. The distinction matters and is why this is not
              simply a bigger margin: the row's height is set by its TALLEST
              child, which is the left column. self-stretch makes this column
              take that full height (the row is md:items-start, so children do
              not stretch by default), and justify-end drops its contents to
              the bottom of it. The two bottoms are therefore the same edge, by
              construction — not a number that happens to land there.

              That is the whole point, because the left column's prose is still
              the previous client's and is due to be rewritten. Any hand-tuned
              margin silently stops lining up the moment that copy changes
              length, with nothing in the diff pointing at this file. This does
              not.

              Contrast with the earlier md:justify-between attempt, which was
              reverted: that pinned the collage to the TOP and the card to the
              bottom, stretching them apart. justify-end moves the pair down
              together and keeps their 20px overlap intact.

              The collage sits one gap-10 above the card — the parent's own
              spacing, not an offset on either child. So BOTH of this column's
              vertical edges are derived: the card's bottom from the left
              column, the collage's bottom from the card. Nothing in here is a
              hand-placed number, which is why a copy rewrite on the left can
              only move the pair, never misalign it.

              ⚠️ The md:gap-0 that used to be here existed ONLY to let the card
              overlap the collage by a negative margin. Both went on
              2026-08-31; do not reintroduce one without the other, or the card
              lands flush against the photos with no separation at all.

              Desktop only — mobile ordering and spacing are untouched. */}
          <div className="flex w-full flex-col gap-10 md:flex-1 md:justify-end md:self-stretch">
            {/* ── PHOTO COLLAGE — DESKTOP ONLY ────────────────────────────
                Added 2026-08-31 by request, to a supplied reference: a wide
                photo top-left with a second overlapping its bottom-right
                corner. Its job here is also to push the guarantee card down
                the column, which is the other half of what was asked.

                `hidden md:block` is the whole desktop-only mechanism, and it
                pairs with loading="lazy" below to mean mobile never even
                FETCHES these files — a lazy image inside a display:none
                container is never in the viewport, so no request is made.
                Mobile is therefore unchanged in both layout AND bytes.

                ⚠️ loading="lazy" IS NOT OPTIONAL HERE. React 19's SSR emits
                a <link rel="preload" as="image"> for every <img> that lacks
                it (root §9.13), and this section is the third on the page —
                well below the fold. Without lazy, these two files would be
                fetched at HIGHEST priority during initial load, competing
                directly with the hero's LCP element for bandwidth. That is
                the exact mechanism that put ~2.6MB on the critical path of
                the template's first client. Do not remove it.

                ⚠️ BOTH photos carry a white ring; the reference gives one
                only to the overlapping photo. That is a deliberate
                adaptation, not a misread: the reference's collage sits on a
                flat near-white page, whereas this one sits on a PHOTOGRAPH
                of a house behind a white scrim. Without the ring the upper
                photo's edges dissolve into the background image and the
                collage reads as visual noise rather than as two cards. If
                the section background is ever flattened, drop the upper
                ring to match the reference.

                Sizing is percentage-based so the overlap holds at any column
                width: the container's pb-[22%] (22% of its WIDTH, since
                percentage padding resolves against width) is what creates
                the room the lower photo hangs into. Changing either aspect
                ratio without re-deriving that padding will either break the
                overlap or leave a gap under the collage.
                ─────────────────────────────────────────────────────────── */}
            <div className="relative hidden w-full pb-[22%] md:block">
              <img
                src={COLLAGE_IMAGE_PRIMARY}
                alt="An Exterior Builder Services crew replacing a residential roof"
                loading="lazy"
                decoding="async"
                className="aspect-16/11 w-[76%] rounded-2xl object-cover ring-[6px] ring-white shadow-[0_10px_30px_rgba(23,41,58,0.16)]"
              />
              <img
                src={COLLAGE_IMAGE_SECONDARY}
                alt="An Exterior Builder Services crew installing commercial siding"
                loading="lazy"
                decoding="async"
                className="absolute bottom-0 right-0 aspect-4/3 w-[56%] rounded-2xl object-cover ring-[6px] ring-white shadow-[0_14px_38px_rgba(23,41,58,0.22)]"
              />
            </div>

            {/* ⚠️ NO overlap with the collage, and nothing here positions this
                card. Its top edge is set by the parent's gap-10 and its bottom
                by the column's justify-end — both declared relationships, so
                the card cannot drift out of alignment when anything around it
                changes size.

                It briefly DID overlap: the collage sat 20px over this card via
                a md:-mt-5 here plus md:gap-0 on the parent, with z-10/z-0 to
                keep the photos painting on top (needed because this card comes
                later in the DOM and would otherwise cover them). All of that
                was removed 2026-08-31 by request. The z-indices went with it
                rather than being left inert — with nothing overlapping they
                controlled nothing, and a stray z-0 on a card reads as load-
                bearing to the next person.

                If an overlap is ever wanted again, it needs all four parts
                back, and the lower photo has to narrow first: at its current
                56% it reaches into the card's description text, so anything
                deeper than about 20px covers words rather than padding. */}
            {/* ── TRANSLUCENT NAVY ───────────────────────────────────────
                bg-(--color-default-font)/60 — navy, still see-through, so the
                house photo reads faintly behind the card. It was briefly
                solid, and briefly /10; both were rejected.

                ⚠️ 60 RATHER THAN THE 50 ASKED FOR, and the reason is contrast
                rather than taste. "At least 50%" permits it, and the margin is
                worth having:

                  /10  card is a light tint      -> needs DARK text
                  /50  card is a MID tone        -> dark ~2.8:1 (fail),
                                                    white ~5.0:1 (thin)
                  /60  card is mid-dark          -> white ~6:1 (comfortable)
                  /100 solid navy                -> white 14.84:1

                50% is the worst place on that scale to sit. It is dark enough
                to kill dark text outright and not dark enough to make white
                comfortable — and the exact figure moves with whatever the
                PHOTOGRAPH is doing behind the card, which is a driveway and
                lawn here, not a flat colour. 60 clears that trough while still
                reading as translucent. Going below ~55 puts white back under
                AA against the brighter parts of the photo.

                ⚠️ TEXT COLOUR IS COUPLED TO THE OPACITY. This has now flipped
                twice in one session. At /10 the text must be navy; at /60 it
                must be white. Change one without the other and the text does
                not go wrong, it goes INVISIBLE — and nothing errors, nothing
                warns, and it still looks like a card.

                Border stays brand-primary blue, as it always was — only the
                fill was asked to change. The icon tile is untouched
                throughout: it carries its own opaque background, so the card's
                surface has never reached it.
                ────────────────────────────────────────────────────────── */}
            <div className="flex w-full items-center gap-6 rounded-md border border-solid border-brand-primary bg-(--color-default-font)/60 px-6 py-4">
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-md bg-brand-primary-secondary-tone">
                <StarIcon className="h-8 w-8 text-brand-secondary-secondary-tone" />
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                <span className="w-full text-body-bold font-body font-semibold text-white">
                  {CLIENT.vocabulary.guaranteeName}
                </span>
                <span className="w-full text-body font-body text-white">
                  Peace of mind and quality workmanship are the priority. That
                  is why we stand behind our work with the{" "}
                  {CLIENT.vocabulary.guaranteeName}.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
