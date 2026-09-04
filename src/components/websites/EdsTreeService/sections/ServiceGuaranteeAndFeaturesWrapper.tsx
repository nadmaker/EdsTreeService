"use client";

import React, { useId, useState } from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";
import ServiceAreaMap from "./ServiceAreaMap";

/**
 * EBS — Map & benefits section.
 *
 * EMITS data-section="map-and-benefits". ⚠️ The FILENAME is unrelated to the
 * emitted name and to the content: this file is still called
 * ServiceGuaranteeAndFeaturesWrapper because the two service sections
 * exchanged their content during the redesign and only the section NAMES
 * were realigned. Trust data-section, not the filename. Renaming both files
 * is a tracked follow-up.
 *
 * FULLY WRAPPER-AUTHORED, rebuilt from scratch 2026-08-30. The
 * `ServiceGuaranteeAndFeatures` Subframe parent was dropped in an earlier
 * pass; this rebuild removes the LAST external dependency — `@subframe/core`
 * — so the file now imports nothing but React, CLIENT and the map.
 *
 * WHY THE ICONS ARE HAND-DRAWN. They were Feather components
 * (FeatherPhone, FeatherZap, FeatherDollarSign, FeatherTrash2,
 * FeatherShield, wrapped in IconWrapper). Inline SVG is the established
 * direction here — the trust badges and the services grid did the same —
 * because it costs no network request, is invisible to React 19's image
 * preload pass (root §9.13), and inherits `currentColor` so a fork re-skins
 * it by changing a token. Dropping the import also takes this section off
 * the shared subframe-core chunk.
 *
 * WHAT THIS SECTION CONTAINS, unchanged by the rebuild:
 *   header (eyebrow + title) · county map · phone + email · the expandable
 *   town list · "Why Us" and four benefit tiles.
 *
 * LAYOUT. Two columns at md. LEFT: map, then contact rows. RIGHT: the
 * locations panel, then Why Us + tiles. The header sits INSIDE column 1 as
 * `order-first`, and column 2 carries `md:mt-9` so it starts level with the
 * TITLE rather than the eyebrow.
 *
 * ⚠️ That 36px is the EYEBROW block only (24px line + the title's 12px
 * mt-3), which is why it is safe as a constant: the eyebrow is one short
 * line at every width, while the TITLE wraps to two lines at 1440 and could
 * be one or three elsewhere. Never derive this offset from the title.
 *
 * MOBILE ORDER is header → map → contact → locations → tiles, held by
 * absolute `order-*` values on children of two `display: contents`
 * wrappers. That is the whole reason this uses `contents` rather than
 * nesting: JSX can move between the columns to change the DESKTOP layout
 * without ever touching the single-column sequence. It has survived six
 * rearrangements this way.
 *
 * TRACKING. Mechanism A (`data-track-view`) — migrated from a React
 * IntersectionObserver in this rebuild. The component still hydrates for
 * the disclosure, so the client directive cannot be dropped, but the
 * vanilla observer in Layout.astro fires off server-rendered DOM ahead of
 * hydration, which is strictly earlier. ⚠️ Do NOT add a useEffect observer
 * alongside the attribute — it would double-fire (root §8.2).
 *
 * SURFACE: bg-white, positional. Do not repaint without checking neighbours.
 */

const PHONE_HREF = CLIENT.contact.phoneTel;
const EMAIL_HREF = CLIENT.contact.emailHref;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

/*
  Hand-drawn replacements for the Feather icons this section used to import.
  Feather's own geometry and stroke conventions (24 viewBox, 2px stroke,
  round caps and joins) so the set still reads as one family alongside the
  Feather icons other sections have not migrated yet. All inherit
  currentColor.
*/
type IconProps = { className?: string };

function Icon({ children, className = "h-5 w-5" }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </Icon>
);

const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </Icon>
);

const ZapIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </Icon>
);

const DollarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 1v22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Icon>
);

const BroomIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Icon>
);

const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </Icon>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <Icon className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

/* ── Local sub-components ─────────────────────────────────────────────── */

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-none text-brand-primary">{icon}</span>
      <span className="text-body font-body text-default-font">{children}</span>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
        {icon}
      </span>
      <div className="text-lg font-semibold text-neutral-900">{title}</div>
      <div className="text-sm leading-relaxed text-neutral-600">{description}</div>
    </div>
  );
}

/* ── Props ────────────────────────────────────────────────────────────── */

export interface ServiceGuaranteeAndFeaturesWrapperProps {
  id?: string;
  className?: string;

  /** York header, left column. */
  eyebrow?: string;
  title?: React.ReactNode;

  /** Label over the four benefit tiles in the right column. */
  benefitsHeading?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/*
  ⚠️ MOVED 2026-09-02 to CLIENT.geo.expandedCities. The array used to be
  declared here at module scope, and the note below ended "there is still no
  config home for it — if confirmed, it belongs in client.config.ts." It now
  has one, because ServiceONEtallLocationWrapper needs the same list and a
  second copy would have drifted. Order and contents are VERBATIM, so this
  section's rendered output is unchanged.

  ⚠️ NEEDS RYAN'S CONFIRMATION — unchanged by the move. Real municipalities
  inside Duplin, Sampson and Wayne — the counties CLIENT.geo.serviceCounties
  names and the intake confirms — so consistent with the cleared service-area
  claim rather than new territory. But "we serve X" is a claim PER TOWN, and
  only Goldsboro, Clinton, Mount Olive, Warsaw and Kenansville appear anywhere
  in the intake; the rest are derived from county geography.
*/
const EXPANDED_CITIES = CLIENT.geo.expandedCities;

export default function ServiceGuaranteeAndFeaturesWrapper({
  id,
  className,
  eyebrow = "SERVICE AREA",
  /*
    Reads CLIENT.geo rather than restating it, so it cannot drift from the
    map drawn directly beneath it — the two describe the same thing.
  */
  title = `Serving ${CLIENT.geo.serviceArea}`,
  benefitsHeading = "Why Us",
  trackingSection = "map-and-benefits",
  trackingCity,
  trackingService,
  trackingPageType,
}: ServiceGuaranteeAndFeaturesWrapperProps) {
  /*
    Expanded by default (by request). This REVERSED an earlier deliberate
    collapse, so the overridden reasoning is kept rather than deleted: it
    had been collapsed because expanding pushed the section down and showed
    the whole list unprompted. What changed is that the list is no longer
    alone in its column and its heading was removed, so it now fills space
    that would otherwise be dead.
  */
  const [locationsOpen, setLocationsOpen] = useState(true);

  /*
    useId is render-time, not an effect, so it resolves during SSR and does
    not add a hydration requirement of its own.
  */
  const panelId = `${useId()}-locations`;

  /*
    Shared context, spread rather than retyped per element — a partial set
    still fires through the click bridge but cannot be joined in analytics
    (root §8.6, §13.3.5). HeroWrapper is the reference.
  */
  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  const linkClass =
    "inline-flex items-center text-inherit underline underline-offset-4 transition-opacity hover:opacity-80";

  return (
    <section
      id={id}
      className={[
        // PLAIN --color-brand-50 (#F0F9F2), NO TEXTURE (2026-09-04, by
        // request: "the white shade from our theme style guide").
        // ⚠️ THE TOKEN, NOT THE HEX (root §13.2.2). #F0F9F2 is already in the
        // theme as --color-brand-50, the lightest tint of the derived brand
        // ramp, so `bg-brand-50` is the same colour that forks correctly;
        // writing bg-[#F0F9F2] would freeze this client's green into a
        // template-shared wrapper.
        // Contrast on it, measured: default-font 15.35:1, brand-primary
        // 5.07:1, neutral-600 7.03:1 — all pass. The amber eyebrow is 2.37:1
        // and still fails; that is the standing §8.4.20 item, unchanged by
        // this ground and not introduced by it.
        // What this replaced, so it is not "restored" by accident:
        // bg-white carrying a stretched folded-paper crease sheet plus grain,
        // two mix-blend-multiply layers. Both layers are gone and so is the
        // `relative isolate` that existed ONLY for them — those layers blended
        // with their backdrop, so without a stacking context of its own that
        // backdrop was whatever the page painted beneath this section. With
        // no blending left there is nothing to isolate.
        // `overflow-x-hidden` STAYS: it is about the content, not the layers.
        // ⚠️ NO mt-8 HERE — removed 2026-08-31, must not come back. A MARGIN
        // sits outside the background box, so it paints the PAGE colour
        // rather than this section's. That used to be loud, because the
        // texture layers (absolute inset-0) could not reach it either and it
        // rendered as a 32px untextured strip with a hard edge where the
        // creases began. It is now NEARLY SILENT — brand-50 (#F0F9F2) and the
        // page background (#EDFAEF) differ by 3/1/3 per channel, so a stray
        // top margin would add 32px while looking like almost nothing.
        // Nearly-invisible is worse than loud. If top breathing room is ever
        // wanted, it has to be PADDING, which is inside the background box;
        // pt-4 / md:pt-2 below already does that.
        "w-full overflow-x-hidden bg-brand-50 px-6 pt-4 md:px-10 md:pt-2",
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
      {/* ⚠️ THE FOLDED-PAPER GROUND WAS REMOVED HERE on 2026-09-04, by
          request: this section is a plain --color-default-background band
          with no texture at all. Two mix-blend-multiply layers used to sit
          here — one stretched --site-tex-creases sheet at 85% and
          --site-tex-grain at 5%.

          Recorded rather than silently deleted, because two things about
          them are easy to get wrong if they are ever restored:
          · The sheet was NOT a tile. preserveAspectRatio=none plus
            bg-[length:100%_100%] bg-no-repeat stretched ONE sheet over the
            whole section, so the creases skewed with the section aspect
            ratio — correct for a stretched sheet, and why the angles were
            shallow. A pixel background-size turns it into a tile and the
            creases stop reaching the edges, which was the whole effect.
          · The grain was TECHNICAL, not decorative. Those crease gradients
            are very large and very shallow, which is exactly what 8-bit
            displays render as visible banding; the noise dithered it away.
            Dropping the grain while keeping the creases reintroduces
            banding on some monitors and not others.
          --site-tex-creases is still consumed by LandingContactForm, so
          the token is not orphaned by this removal. */}
      {/* `relative` lifts the content above the two texture layers. */}
      <div className="relative mx-auto w-full max-w-[1280px]">
        <div className="flex w-full flex-col py-12 md:grid md:grid-cols-2 md:gap-x-16">
          {/* ── COLUMN 1: header, map, contact ── */}
          <div className="contents md:flex md:flex-col md:gap-6">
            {/* HEADER — the eyebrow → title rhythm the hero, services grid,
                stats band and reviews all use. Title caps at md:text-4xl,
                not their md:text-5xl, because they span the full 1280px
                container while this sits in a 608px half. */}
            <div className="order-first w-full">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-secondary md:text-base">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-heading-1 text-2xl font-bold leading-[1.15] text-default-font md:text-4xl">
                {title}
              </h2>
            </div>

            {/* MAP — inline SVG of the three counties, drawn from Census
                boundaries. See ServiceAreaMap for why it is not an iframe
                or an image. */}
            <div className="order-1 w-full md:order-1">
              <div className="h-64 w-full overflow-hidden rounded-lg border border-solid border-neutral-200 bg-white md:h-96">
                <ServiceAreaMap />
              </div>
            </div>

            {/* CONTACT */}
            <div className="order-2 mt-8 flex w-full flex-col items-start gap-5 md:order-2 md:mt-0">
              <span className="w-full text-heading-3 font-body font-semibold text-default-font">
                Contact Us
              </span>

              {/*
                An "Available 24/7" row sat here. REMOVED, not reworded: EBS
                has no emergency line and all 24-7 / after-hours copy is on
                the CLAIMS REGISTER's MUST-NOT-SHIP list. This section
                renders on the home page AND all six city landings, so the
                claim was shipping on seven routes. Do not reinstate an
                availability line unless an emergency number exists.
              */}
              <div className="flex w-full flex-col items-start gap-3">
                <ContactRow icon={<PhoneIcon />}>
                  {/*
                    ⚠️ The number MUST stay visible text inside an
                    <a href="tel:">. This is one of the surfaces eligible for
                    Google's automatic call-tracking number swap, which
                    matches RENDERED TEXT — an icon-only version silently
                    drops the qualified-call signal. Root §13.5.6.
                  */}
                  <a
                    href={PHONE_HREF}
                    className={linkClass}
                    data-event="click_call"
                    data-label="map-and-benefits-phone"
                    {...tracking}
                    aria-label={`Call now ${DISPLAY_PHONE}`}
                  >
                    <span className="phone-number">{DISPLAY_PHONE}</span>
                  </a>
                </ContactRow>

                <ContactRow icon={<MailIcon />}>
                  <a
                    href={EMAIL_HREF}
                    className={linkClass}
                    data-event="click_email"
                    data-label="map-and-benefits-email"
                    {...tracking}
                    aria-label={`Email ${CLIENT.business.name}`}
                  >
                    {CLIENT.contact.email}
                  </a>
                </ContactRow>
              </div>
            </div>
          </div>

          {/* ── COLUMN 2: locations panel, then Why Us + tiles ──
              md:mt-9 starts this column level with the TITLE rather than the
              eyebrow. See the header block at the top of this file for why
              that constant is safe. */}
          <div className="contents md:mt-9 md:flex md:flex-col md:gap-6">
            {/* LOCATIONS — button and panel share ONE bordered container, so
                the control and what it reveals read as a single object. The
                button used to be a solid brand-blue bar with the list
                floating loose beneath it; that made the least important
                control the loudest element in the section. */}
            <div className="order-3 mt-8 w-full md:order-1 md:mt-0">
              <div className="w-full overflow-hidden rounded-lg border border-solid border-neutral-200">
                <button
                  type="button"
                  onClick={() => setLocationsOpen((v) => !v)}
                  aria-expanded={locationsOpen}
                  aria-controls={panelId}
                  /*
                    TWO-TONE PANEL, by request. The header takes
                    `bg-default-background` — the same faint blue the reviews
                    section uses as its surface — and the town list below
                    takes `bg-neutral-100`, the grey the map fills its
                    context counties with. Both are TOKENS already in use
                    elsewhere on the page rather than new literals, so the
                    panel stays in step with those two surfaces if either
                    moves.

                    Text stays `brand-primary-hover`, not `brand-primary`:
                    same blue a step deeper, and it is what keeps this legal
                    at 14px semibold. On white it measured 4.91:1 against
                    brand-primary's 3.99:1; on the tinted header it drops to
                    ~4.6:1, so the margin over AA's 4.5:1 is now thin. Do not
                    lighten either the text or this background further
                    without re-measuring.
                  */
                  className="flex w-full items-center justify-between gap-4 bg-default-background px-4 py-3 text-left text-brand-primary-hover transition-colors hover:bg-brand-primary/10"
                  data-event="toggle_nav_section"
                  data-label="map-and-benefits-toggle-locations"
                  {...tracking}
                >
                  {/* No colour of its own — inherits the button's, so there
                      is one source of truth. It previously hardcoded
                      text-white, which left it invisible when the button
                      stopped being blue. */}
                  <span className="text-body-bold font-body font-semibold">
                    {locationsOpen ? "See Fewer Locations" : "See More Locations"}
                  </span>
                  <ChevronIcon open={locationsOpen} />
                </button>

                {locationsOpen ? (
                  <div
                    id={panelId}
                    className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-solid border-neutral-200 bg-neutral-100 px-4 py-4 text-body font-body text-default-font sm:grid-cols-3"
                  >
                    {EXPANDED_CITIES.map((city) => (
                      <span key={city}>{city}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {/* BENEFITS — labelled because the section header promises
                GEOGRAPHY while these answer how the work is done. Styled as
                a peer of "Contact Us", deliberately not a second gold
                eyebrow: the section already has one and two would compete. */}
            <div className="order-4 mt-10 flex w-full flex-col items-start gap-6 md:order-2 md:mt-0">
              <span className="w-full text-heading-3 font-body font-semibold text-default-font">
                {benefitsHeading}
              </span>

              <div className="grid w-full grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-2">
                <FeatureItem
                  icon={<ZapIcon />}
                  title="Same-Day Removal"
                  description="Same-day tree removal available, depending on the job and the day."
                />
                <FeatureItem
                  icon={<DollarIcon />}
                  title="Free Estimates"
                  description="A written estimate before anything starts, at no charge."
                />
                <FeatureItem
                  icon={<BroomIcon />}
                  title="Our Own Crews"
                  description="Family-run and locally owned, on the job start to finish."
                />
                {/*
                  CLAIMS: "Licensed, Bonded & Insured" is CLEARED and
                  owner-confirmed (EBS_HANDOFF_Step0-Step1.md §3). What is
                  missing is the NCLBGC licence NUMBER, which is why
                  CLIENT.certifications is empty — a number must not be
                  quoted, but the phrase is fine.
                */}
                <FeatureItem
                  icon={<ShieldIcon />}
                  title="Bonded & Insured"
                  description="Fully covered and committed to safe, professional practices."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
