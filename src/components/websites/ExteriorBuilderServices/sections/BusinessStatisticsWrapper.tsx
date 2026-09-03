import React from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — Business statistics band.
 *
 * Fully wrapper-authored: the `StatisticsSection` Subframe parent was
 * dropped. It centres a heading/description pair above a horizontal
 * figure row, which is the opposite of the York reference layout used
 * across this redesign (left-aligned eyebrow → title → caption, figures
 * beside the copy rather than under it). Restructuring that is beyond
 * what className can reach — root §7.1's ceiling — and the old wrapper
 * was already carrying a nine-class `[&>div:nth-child(2)]:` cluster to
 * repaint the parent's inner box, which is root §7.8's escalation signal.
 * Dropping the parent deletes the whole cluster.
 *
 * It also removes a breakpoint conflict: `StatisticsSection` stacks on
 * Subframe's `mobile:` variant, while this site's nav and hero switch at
 * 768px (`md:`). The two did not agree, so the figure row and the header
 * above it reflowed at different widths.
 *
 * NO IMAGE. This band is a flat colour field, not a photo section, for
 * two reasons. Every genuinely-EBS photograph is already spent — the
 * three hero slides, the service-area background, the guarantee photo —
 * and the remaining `ebs-*` files are still the previous client's tree
 * photography under EBS filenames (handoff §6). Reusing a hero slide
 * here would make it the fourth photo band on one page. Costing zero
 * image bytes is the secondary win: React 19's SSR preloads every
 * non-lazy <img> at high priority (root §9.13), so the cheapest section
 * is the one with no <img> at all.
 *
 * TRACKING: this section emitted NOTHING before — no data-section, no
 * context, no observer — and `EBS-Home.tsx` was the only call site not
 * passing the page-level TRACKING spread. Client §3.3 recorded that as
 * deliberate. Rebuilding it makes it a generated section, so it now
 * carries the full contract. It has no hooks, so view_section is opt-in
 * via `data-track-view` and handled by the vanilla observer in
 * Layout.astro (root §8.2 Mechanism A) — no React observer, and no
 * "use client", because nothing here runs on the client.
 */

/**
 * Ground for the band. `--color-default-font` is the client's darkest
 * brand neutral (#17293A for EBS), used here as a surface rather than as
 * type. Reaching for the token instead of a raw navy keeps the band
 * re-skinning with the client per root §4.5 — a fork changes one value
 * in global.css and this section follows.
 *
 * Why not `bg-brand-primary`, which the old version used: white on EBS
 * blue measures 3.99:1, under the 4.5:1 AA needs for the caption and the
 * figure labels (handoff §6 tracks the same failure on the locations
 * tab), and the labels were white/80 on it — 3.12:1.
 *
 * Measured against this navy instead, every string below clears AA at
 * its real size and weight: white title 14.84:1, white/80 caption and
 * labels 9.98:1, brand-secondary gold eyebrow and figures 6.86:1.
 */
const BAND_SURFACE = "bg-[var(--color-default-font)]";

/**
 * Derived, never typed. The old wrapper hardcoded "18+" while
 * `yearFounded` is 2006 — an arithmetic error that had already been
 * copied into AboutUsVariant1 as a literal "18 Years". Deriving
 * it means the figure cannot drift from config again, and cannot go
 * stale each January.
 *
 * "In business since 2006" is CLEARED in the CLAIMS REGISTER
 * (EBS_HANDOFF_Step0-Step1.md §3); the count restates that same cleared
 * fact rather than adding a new claim.
 */
const YEARS_IN_BUSINESS = new Date().getFullYear() - CLIENT.business.yearFounded;

interface Stat {
  value: string;
  label: string;
}

/**
 * ⚠️ CLAIMS-CONTROLLED CONTENT. Read the CLAIMS REGISTER before editing.
 *
 * A fourth figure — "24/7 / Support Availability" — was removed here, not
 * reworded. EBS has no emergency line at all (`contact.emergencyPhoneDisplay`
 * is an empty string), and all 24-7 / after-hours copy is on the register's
 * MUST-NOT-SHIP list. Do not reintroduce an availability figure of any
 * kind unless an emergency number actually exists.
 *
 * "1000+ serviced" is owner-VERIFIED (confirmed by Ryan 2026-08-27).
 * Treat it as a cleared claim, not an estimate.
 */
const STATS: readonly Stat[] = [
  { value: `${YEARS_IN_BUSINESS}+`, label: "Years in business" },
  { value: "1000+", label: "Homes & businesses serviced" },
  { value: "$0", label: "Estimates — free, no obligation" },
] as const;

export interface BusinessStatisticsWrapperProps {
  id?: string;
  className?: string;

  eyebrow?: string;
  title?: React.ReactNode;
  caption?: React.ReactNode;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function BusinessStatisticsWrapper({
  id,
  className,
  eyebrow = "WHY EBS",
  title = "Two decades on roofs across eastern North Carolina",
  /*
    Previous copy read "They diagnose and cut with confidence no matter
    the size, scope, or complexity" — tree-service vocabulary carried
    over from the fork. Rewritten for the trade, and wired to CLIENT.*
    so the trade name and service area cannot drift from config.
  */
  /*
    tradeName is lowercased because it reads mid-sentence ("worked on
    roofing & siding"); credentialTitlePlural is NOT, because it leads
    with an acronym and .toLowerCase() would render "osha certified
    roofers". Do not add .toLowerCase() to it for symmetry.
  */
  caption = `${CLIENT.business.name} has worked on ${CLIENT.vocabulary.tradeName.toLowerCase()} across ${CLIENT.geo.serviceArea} since ${CLIENT.business.yearFounded}. Crews are led by ${CLIENT.vocabulary.credentialTitlePlural}, and every estimate is free.`,
  trackingSection = "stats",
  trackingCity = CLIENT.geo.trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "home",
}: BusinessStatisticsWrapperProps) {
  return (
    <section
      id={id}
      className={["w-full", BAND_SURFACE, className].filter(Boolean).join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* Taller than the template default (the dropped parent used py-16),
          per the York reference proportion. */}
      <div
        className={[
          "mx-auto w-full max-w-[1280px] px-6 py-20",
          "md:px-10 md:py-28",
        ].join(" ")}
      >
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-20">
          {/* LEFT — copy stack. Same eyebrow → title → caption rhythm as
              the hero, so the two read as one system. */}
          <div className="w-full md:flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
              {eyebrow}
            </p>

            <h2 className="mt-4 max-w-[20ch] font-heading-1 text-3xl font-bold leading-[1.12] text-white md:text-5xl">
              {title}
            </h2>

            <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-white/80 md:text-lg">
              {caption}
            </p>
          </div>

          {/* RIGHT — figures, stacked with hairline rules.
              Stacked rather than a horizontal row: the labels are full
              phrases, not one-word nouns, so three across would wrap to
              two or three lines each at any width the copy column leaves
              over. A vertical list lets each label sit on one line and
              gives the band its height. */}
          <dl className="w-full md:w-[380px] md:shrink-0">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "flex items-baseline gap-5 py-5",
                  // Rule between rows only — no trailing edge on the last.
                  i > 0 ? "border-t border-white/15" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Barlow's condensed numerals carry the large size
                    without eating the column width. */}
                <dt className="min-w-[3.5ch] font-heading-1 text-4xl font-bold leading-none text-brand-secondary md:text-5xl">
                  {stat.value}
                </dt>
                {/* Measured: white/80 composites to rgb(209,212,216) over
                    this navy = 9.98:1. The same white/80 over the old
                    brand-primary blue was 3.12:1 — an outright AA failure
                    at the 14px it was set in. */}
                <dd className="text-base leading-snug text-white/80">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
