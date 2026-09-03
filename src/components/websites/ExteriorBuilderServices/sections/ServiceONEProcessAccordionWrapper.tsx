/**
 * ServiceONEProcessAccordionWrapper — the "OUR PROCESS" accordion in the
 * left column of all seven /services/* routes.
 *
 * ⚠️ EVERY DEFAULT IN THIS FILE IS LIVE COPY, NOT SCAFFOLDING.
 * ServicePageBLDR renders this wrapper with NO CONTENT PROPS, so root
 * §13.3.8's inverse applies in full: nothing overrides these values, which
 * makes them the shipping content on seven routes.
 *
 * That is how the PREVIOUS CLIENT's copy survived here until 2026-09-02.
 * Served on all seven pages, it read:
 *     "Here's what to expect when you work with Medrano's Tree Service."
 *     Step 1: Tree Assessment — "Contact Medrano's for a free tree health
 *                                 and removal assessment..."
 *     Step 2: Removal and Pruning — "Crew dismantles tree safely, chips
 *                                     branches..."
 *     Step 3: Healthy Tree Guarantee
 * — a competitor's trading name twice, and an entire tree-care process, on
 * a roofing and siding site.
 *
 * ⚠️ servicePageData.tsx's SHARED_PROCESS array looks like this content's
 * source. IT IS NOT — it has zero consumers. Editing it produces a clean,
 * plausible diff with no rendered effect. THIS FILE is the one to edit.
 *
 * ⚠️ THE STEPS MUST STAY TRADE-NEUTRAL. One accordion serves roofing,
 * siding AND gutters, so anything naming a single trade is wrong on the
 * other six routes. That constraint is why the steps describe the
 * ENGAGEMENT — estimate, scope, install, walkthrough — rather than the work.
 *
 * ⚠️ CLAIMS. Every step below is cleared in EBS_HANDOFF_Step0-Step1.md §3:
 * "free estimates — no charge, no obligation" is verbatim from the register,
 * and "our own crews, start to finish" is the exact wording the register
 * approved when "never subcontracted out" was walked back. Do NOT add a
 * response time, an arrival window, an availability promise or a
 * no-hidden-fees line — those are OPERATIONS CLAIMS (register category 4)
 * and the tell is the absolute: never, always, every, no, only.
 *
 * ⚠️ NO GUARANTEE STEP, deliberately. The old step 3 was one, but
 * TallServicesBenefitsCards renders a "Guaranteed Service" card naming the
 * EBS Service Guarantee DIRECTLY ABOVE this section on the same page.
 * Restating it here duplicates the only claim on the page carrying real
 * weight, and the register marks the lifetime warranty "pending
 * definition" — so naming that instead would be worse, not better.
 */
"use client";

import React, { useState } from "react";
import { ProcessAccordionforService } from "@/ui/components/ProcessAccordionforService";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

export interface ServiceONEProcessAccordionWrapperProps {
  id?: string;
  className?: string;

  title?: React.ReactNode;
  description?: React.ReactNode;

  callToAction?: React.ReactNode;

  contentMaxWidthClassName?: string;

  /* Tracking context, threaded down from ServicePageBLDR (root §8.6).
     This section emitted NO data-section and NO view_section at all before
     2026-09-02 — one of four service-page sections client CLAUDE.md §3.3
     records as invisible to section-level analytics. */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

function CollapsibleRow({
  index,
  activeIndex,
  onToggle,
  title,
  trackingLabel,
  tracking,
  children,
}: {
  index: number;
  activeIndex: number | null;
  onToggle: (i: number) => void;
  title: string;
  trackingLabel: string;
  tracking: Record<string, string | undefined>;
  children: React.ReactNode;
}) {
  const open = activeIndex === index;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => onToggle(index)}
        className={[
          "group flex w-full items-center justify-between py-4 text-left",
          "transition-colors duration-200 ease-out",
          "hover:bg-neutral-50",
          "rounded-md px-2 -mx-2",
        ].join(" ")}
        aria-expanded={open}
        /* ⚠️ NO onClick TRACKING HANDLER, on purpose. This is a real DOM
           click on a <button>, so the global delegated bridge in
           Layout.astro catches it from these attributes alone (root §8.1).
           Adding a manual pushToDataLayer here would DOUBLE-FIRE — §13.5.4
           reserves manual pushes for portaled content and synthetic events.

           `toggle_nav_section` is the correct EXISTING event name, not an
           invented one: §8.4 records that its description was broadened to
           cover content accordions precisely because the mechanic is
           identical to the mobile-nav one. Reusing it is right; minting a
           new name for the same mechanic would trip §11.5. */
        data-event="toggle_nav_section"
        data-label={trackingLabel}
        {...tracking}
      >
        <span className="font-semibold text-neutral-900">{title}</span>

        {/* Animated + / - */}
        <span className="relative ml-4 h-6 w-6 shrink-0">
          {/* horizontal bar */}
          <span className="absolute left-1/2 top-1/2 h-[3px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary" />

          {/* vertical bar */}
          <span
            className={[
              "absolute left-1/2 top-1/2 h-5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary",
              "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100",
            ].join(" ")}
          />
        </span>
      </button>

      {/* Smooth expand */}
      <div
        className={[
          "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pt-1 text-sm leading-relaxed text-neutral-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceONEProcessAccordionWrapper({
  id,
  className,
  title = "OUR PROCESS",
  /* Reads from config rather than naming the company inline — the string
     this replaced named the PREVIOUS client, and a config read cannot rot
     that way on the next fork. */
  description = `Here's what to expect when you work with ${CLIENT.business.name}.`,
  callToAction,
  contentMaxWidthClassName = "max-w-[720px]",

  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: ServiceONEProcessAccordionWrapperProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (i: number) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  /* ⚠️ EMISSION IS CONDITIONAL on trackingSection arriving, matching
     TallServicesBenefitsCards directly above this section. An
     unconditional data-section would start firing from any consumer that
     passes no context, and a row whose city/service/page_type are all
     undefined cannot be joined to anything — worse than silence, because
     it looks like data.

     Mechanism A (root §8.2): data-track-view, handled by the vanilla
     observer in Layout.astro off server-rendered DOM. This wrapper has
     useState for the accordion so it hydrates either way, but it has NO
     existing IntersectionObserver — which is what makes adding the
     attribute safe here. Do NOT also add a useEffect observer; the two
     mechanisms double-fire.

     ⚠️ This CREATES a new series rather than restoring a lost one, on
     seven routes at once. Same precedent as why-choose-us and
     service-hero. */
  const tracking = trackingSection
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
      className={["w-full", className].filter(Boolean).join(" ")}
      {...(trackingSection ? { "data-track-view": true } : {})}
      {...tracking}
    >
      <div className={["w-full min-w-0", contentMaxWidthClassName].join(" ")}>
        <ProcessAccordionforService
          className="w-full"
          /* ⚠️ FONT THEME MATCHED TO TallServicesBenefitsCards, by request
             2026-09-02, and it has to be done from HERE rather than with a
             className override.

             The two sections sit one above the other in the same column and
             were rendering their titles at different sizes, because their
             Subframe parents disagree:

               Tall_LocalBenefitsSection  text-heading-1  30px / 600
               ProcessAccordionforService text-heading-2  20px / 400

             Both resolve to Barlow Semi Condensed under theme-ebs, so the
             TYPEFACE already matched — what differed was size and weight,
             which read as two unrelated systems stacked together.

             The override goes in the SLOT, not on the component's
             className, because the parent renders title and description as
             ADJACENT SIBLING SPANS with no distinguishing class between
             them. Any [&_span]: variant hits both, and :first-child breaks
             the moment Subframe regenerates with different nesting (root
             §7.3). A child span carrying its own classes is immune to both.

             ⚠️ STILL A <span>, NOT AN <h2>. The parent's own element is a
             span, and a span cannot legally contain a heading — so this is
             typography only. Promoting the service-page section titles to
             real headings is theme-tab work (§7.1's ceiling: a tag name is
             not reachable from a wrapper) and is tracked separately. */
          title={
            <span className="text-heading-1 font-heading-1">{title}</span>
          }
          description={description}
          accordionItems={
            <div className="mt-4 w-full bg-white px-4 shadow-sm rounded-lg">
              <CollapsibleRow
                index={0}
                activeIndex={activeIndex}
                onToggle={handleToggle}
                title="Step 1: Free On-Site Estimate"
                trackingLabel="process-step-1-free-estimate"
                tracking={tracking}
              >
                {/* "No charge, no obligation" is the register's own wording
                    for the cleared free-estimate offer, used verbatim. */}
                We come out and look at the actual job rather than quoting
                from a photo, then put the scope and the price in writing.
                No charge and no obligation.
              </CollapsibleRow>

              <CollapsibleRow
                index={1}
                activeIndex={activeIndex}
                onToggle={handleToggle}
                title="Step 2: Written Scope and Schedule"
                trackingLabel="process-step-2-scope-and-schedule"
                tracking={tracking}
              >
                {/* ⚠️ Deliberately says nothing about HOW SOON work starts.
                    A start-date promise is an OPERATIONS CLAIM (register
                    category 4) and sits against the same ban that removed
                    the 24-7 copy from this build. */}
                You get the materials, the work and the price set out in
                writing before anything begins, and we agree a start date
                with you rather than around you.
              </CollapsibleRow>

              <CollapsibleRow
                index={2}
                activeIndex={activeIndex}
                onToggle={handleToggle}
                title="Step 3: Installation by Our Own Crews"
                trackingLabel="process-step-3-installation"
                tracking={tracking}
              >
                {/* ⚠️ "our own crews, start to finish" is the EXACT wording
                    the register approved when "never subcontracted out" was
                    walked back on 2026-09-01. Keep the positive form: the
                    negative version is an absolute one exception falsifies.

                    Says "crews" rather than CLIENT.vocabulary
                    .credentialTitlePlural ("OSHA Certified Roofers") for two
                    reasons — the benefit card immediately above already uses
                    that exact phrase, and "Roofers" reads wrong on the
                    siding and gutter routes this same accordion serves. */}
                Our own crews run the job start to finish, working to the
                best practices of quality workmanship, residential or
                commercial.
              </CollapsibleRow>

              <CollapsibleRow
                index={3}
                activeIndex={activeIndex}
                onToggle={handleToggle}
                title="Step 4: Cleanup and Final Walkthrough"
                trackingLabel="process-step-4-cleanup-walkthrough"
                tracking={tracking}
              >
                We clear the site and haul the old material away, then walk
                the finished work with you so you can see what was done
                before we call it complete.
              </CollapsibleRow>
            </div>
          }
          callToAction={callToAction}
        />
      </div>
    </section>
  );
}