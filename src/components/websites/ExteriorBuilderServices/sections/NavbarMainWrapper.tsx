"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";

/**
 * EBS — Site navigation (desktop + mobile).
 *
 * DESKTOP is a fully wrapper-authored bar with two states, per the York
 * reference: at rest it floats inset from the viewport edges over a hero
 * that runs to y=0 behind it; past PIN_THRESHOLD_PX it expands to full
 * width and pins flush to the top. Bar HEIGHT never animates — only the
 * insets, width, shadow and background opacity do.
 *
 * The previous desktop nav wrapped Subframe's NewmodernNav2_0. That was
 * removed rather than overridden: its root is a fixed
 * `flex … px-8 py-6 border-b shadow-md`, and neither a full-height
 * flush-right CTA nor scroll state is reachable from className (root
 * §7.1's ceiling). It was consumed only here, so dropping it needs no
 * theme-tab edit and no sync.
 *
 * WHY THE ROOT IS NOT THE FIXED ELEMENT: only the DESKTOP block leaves
 * the document flow. Mobile is deliberately untouched this pass and must
 * stay in flow, so `fixed` lives on the desktop child. The root stays in
 * flow carrying the section tracking attributes and collapses to zero
 * height on desktop — which is what lets the hero rise behind the bar.
 *
 * CLEARANCE: pages whose first section is NOT a full-bleed hero would
 * otherwise open underneath the bar. They get a desktop-only spacer of
 * --ebs-nav-clearance (defined in global.css, also driving
 * scroll-padding-top and the service-page sticky rail). Pass heroBehind
 * on pages whose hero is designed to run behind the bar and pads itself.
 */

/**
 * EBS nav structure (desktop + mobile). Single source of truth.
 */
const MENU = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  {
    label: "Services",
    children: [
      { label: "Roof Replacement", href: "/services/roof-replacement" },
      { label: "Roof Repair", href: "/services/roof-repair" },
      { label: "Roof Installation", href: "/services/roof-installation" },
      { label: "Metal Roof Installation", href: "/services/metal-roof-installation" },
      { label: "Siding Installation", href: "/services/siding-installation" },
      { label: "Gutter Installation", href: "/services/gutter-installation" },
      { label: "Gutter Cleaning", href: "/services/gutter-cleaning" },
    ],
  },
  {
    label: "Locations",
    children: [
      { label: "Goldsboro",   href: "/service-area/goldsboro-nc-roofing-siding" },
      { label: "Clinton",     href: "/service-area/clinton-nc-roofing-siding" },
      { label: "Mount Olive", href: "/service-area/mount-olive-nc-roofing-siding" },
      { label: "Warsaw",      href: "/service-area/warsaw-nc-roofing-siding" },
      { label: "Faison",      href: "/service-area/faison-nc-roofing-siding" },
      { label: "Kenansville", href: "/service-area/kenansville-nc-roofing-siding" },
    ],
  },
] as const;

export interface NavbarMainWrapperProps {
  id?: string;
  className?: string;

  /** Page-specific CTA target */
  quoteHref?: string;

  /**
   * True when the section immediately below is a full-bleed hero that
   * runs to y=0 behind the bar and pads its own content clear of it.
   * Suppresses the desktop clearance spacer. Home + city landings only.
   */
  heroBehind?: boolean;

  /** Tracking context */
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/** Scroll distance (px) past which the bar pins flush to the viewport top. */
const PIN_THRESHOLD_PX = 60;

const linkBase =
  "px-3 py-2 text-[15px] font-medium text-neutral-900 hover:underline underline-offset-4";

const dropdownItemBase =
  "block w-full px-4 py-2 text-sm text-neutral-900 hover:underline underline-offset-4 whitespace-nowrap";

const PHONE_HREF    = CLIENT.contact.phoneTel;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;

const LOGO_URL = "/images/ebs-logo.png";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

/**
 * True once the page is scrolled past `threshold`.
 *
 * rAF-throttled: a burst of scroll events collapses into one read per
 * frame, and the setter returns the previous value when the boolean has
 * not flipped, so React bails out and no re-render happens while
 * scrolling. The initial read on mount covers a restored scroll position
 * (back/forward navigation), which would otherwise render the rest state
 * over already-scrolled content until the first scroll event.
 */
function useScrolledPast(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled((prev) => {
        const next = window.scrollY > threshold;
        return next === prev ? prev : next;
      });
    };

    read();

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}

function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 7.75L10 12.25L14.5 7.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Solid-style phone icon for stronger CTA presence.
 * Safe to use in wrapper without touching Subframe files.
 */
function SolidPhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.95 21c-2.08 0-4.74-.85-7.42-2.41-2.57-1.49-4.99-3.61-6.81-5.97C3.86 10.21 2.96 7.88 3 6.04c.02-1 .73-1.87 1.7-2.06l2.67-.53c.88-.18 1.75.27 2.15 1.07l1.24 2.49c.33.66.22 1.45-.27 2l-1.26 1.42a.75.75 0 0 0-.09.92c.78 1.19 1.77 2.27 2.95 3.22 1.16.94 2.41 1.7 3.71 2.28a.75.75 0 0 0 .89-.2l1.18-1.39c.52-.61 1.38-.84 2.13-.57l2.61.94c.88.32 1.41 1.22 1.28 2.15l-.38 2.71A2.12 2.12 0 0 1 19.95 21Z" />
    </svg>
  );
}

function HamburgerIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NavbarMainWrapper({
  id,
  className,
  quoteHref = "#home-contact",
  heroBehind = false,
  trackingCity,
  trackingService,
  trackingPageType,
}: NavbarMainWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const scrolled = useScrolledPast(PIN_THRESHOLD_PX);

  /*
    Tracking context shared by every tracked element in the DESKTOP bar.
    Spread rather than retyped per element (matching HeroWrapper) so a
    partial attribute set — which the click bridge would still fire, just
    without the context needed for analytics joins — is hard to write by
    accident. Root §8.6, §13.3.5.
  */
  const ctaTracking = {
    "data-section": "navbar",
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  /* Same context for the mobile header, which reports as its own section. */
  const mobileTracking = {
    "data-section": "navbar-mobile",
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  const DesktopMenuItems = useMemo(() => {
    return (
      <>
        {MENU.map((item) => {
          const hasChildren = "children" in item;

          if (hasChildren) {
            return (
              /*
                Full bar height so the dropdown's `top-full` resolves to the
                BOTTOM OF THE BAR rather than the bottom of the button — a
                button-height wrapper drops the panel inside the bar.
              */
              <div key={item.label} className="group relative flex h-full items-center">
                <button
                  type="button"
                  className={`${linkBase} inline-flex items-center gap-1`}
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  {item.label} <ChevronDownIcon className="h-4 w-4 opacity-80" />
                </button>

                {/* pt-2 lives INSIDE the positioned box so the cursor can
                    cross the gap without dropping the group-hover. */}
                <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
                  <div className="min-w-[220px] rounded-lg border border-neutral-200 bg-white shadow-lg">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className={dropdownItemBase}
                        data-event="click_nav_link"
                        data-label={`nav-${slugify(item.label)}-${slugify(child.label)}`}
                        {...ctaTracking}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              className={linkBase}
              data-event="click_nav_link"
              data-label={`nav-${slugify(item.label)}`}
              {...ctaTracking}
            >
              {item.label}
            </a>
          );
        })}
      </>
    );
  }, [trackingCity, trackingService, trackingPageType]);

  return (
    <div
      id={id}
      className={className}
      data-section="navbar"
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/*
        DESKTOP — fixed overlay bar.

        The OUTER box animates its padding rather than the bar animating
        its own insets: one property carries the inset + width change
        together while the bar's height stays literally constant, which is
        the reference behaviour ("height never animates").

        Do NOT add overflow-hidden to either box — the dropdowns hang
        below the bar and would be clipped.
      */}
      <div
        className={[
          "fixed inset-x-0 top-0 z-50 mobile:hidden",
          "transition-[padding] duration-[250ms] ease-out",
          scrolled ? "p-0" : "p-4",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-[88px] w-full items-center pl-6 pr-0",
            "transition-[background-color,box-shadow] duration-[250ms] ease-out",
            scrolled ? "bg-white/95 shadow-lg" : "bg-white/90 shadow-md",
          ].join(" ")}
        >
          <a
            href="/"
            className="flex flex-none items-center"
            data-event="click_nav_link"
            data-label="nav-home-logo"
            {...ctaTracking}
          >
            {/* 72px in an 88px bar — 8px above and below, i.e. the mark fills
                ~82% of the bar height by request. It can sit this tight
                because the asset itself carries NO internal padding: it was
                trimmed to its own ink bounds (1733x877, ratio 1.976), so the
                rendered height IS the mark's height. Renders 142px wide.
                Anything larger starts touching the bar edges. */}
            <img
              src={LOGO_URL}
              alt="Exterior Builder Services"
              className="h-[72px] w-auto object-contain"
            />
          </a>

          <nav className="ml-auto flex h-full items-center">
            {DesktopMenuItems}
          </nav>

          <a
            className="ml-6 inline-flex flex-none items-center gap-2 rounded-md bg-brand-secondary px-4 py-2 text-sm font-medium text-white hover:bg-brand-secondary-hover"
            href={PHONE_HREF}
            data-event="click_call"
            data-label="nav-secondary-call-now"
            {...ctaTracking}
            aria-label={`Call now ${DISPLAY_PHONE}`}
          >
            <SolidPhoneIcon className="h-4 w-4" />
            {/*
              The visible number is load-bearing, not decoration. Google's
              automatic "Calls from website" swap matches the configured
              number as VISIBLE RENDERED TEXT; href and aria-label are
              invisible to it. This is one of only three Mechanism-1
              eligible surfaces on the site (client §3.6). Making this
              icon-only would silently drop the qualified-call signal —
              root §13.5.6.
            */}
            <span className="phone-number whitespace-nowrap">{DISPLAY_PHONE}</span>
          </a>

          {/*
            Primary CTA — flat block capping the bar's right end.
            `self-stretch` spans the full bar height and the bar's `pr-0`
            plus this element's lack of a right margin mean its right edge
            IS the bar's edge, so it meets the viewport edge when pinned.
          */}
          <a
            href={quoteHref}
            className={[
              "ml-6 inline-flex flex-none items-center self-stretch",
              "rounded-none bg-brand-primary px-8",
              "text-sm font-semibold uppercase tracking-wide text-white",
              "whitespace-nowrap transition-colors duration-200",
              "hover:bg-brand-primary-hover",
            ].join(" ")}
            data-event="click_cta"
            data-label="nav-primary-get-a-quote"
            {...ctaTracking}
          >
            Get A Quote
          </a>
        </div>
      </div>

      {/*
        Clearance for pages whose first section is not a full-bleed hero.
        Desktop only — the mobile header is still in flow and needs none.
      */}
      {heroBehind ? null : (
        <div
          aria-hidden="true"
          className="h-[var(--ebs-nav-clearance)] w-full mobile:hidden"
        />
      )}

      {/*
        Mobile clearance. Unconditional — unlike the desktop bar, the mobile
        header is opaque, so letting a hero run behind it would only hide the
        photo rather than produce the glass effect. `heroBehind` is
        deliberately not consulted here.
      */}
      <div
        aria-hidden="true"
        className="hidden h-[var(--ebs-mobile-nav-clearance)] w-full mobile:block"
      />

      {/* Mobile: custom header + fullscreen overlay menu */}
      <div className="hidden mobile:block">
        {/*
          FIXED, so the header travels with the viewport instead of
          scrolling away at the top of the document.

          Unlike the desktop bar this one is OPAQUE, so there is nothing to
          gain by letting content run underneath it — the spacer below is
          therefore unconditional and does not honour `heroBehind`.

          position: sticky would have avoided the spacer entirely, but it is
          not usable here: a sticky element can only travel within its own
          parent's box, and this wrapper is only as tall as the header, so
          it would have zero distance to stick over.
        */}
        <div className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between border-b border-neutral-border bg-white px-6 py-4">
          <a
            href="/"
            className="flex items-center"
            data-event="click_nav_link"
            data-label="nav-home-logo"
            {...mobileTracking}
          >
            {/*
              Mobile logo height is load-bearing for layout, not just taste.
              With px-6 padding plus the call/contact button and the
              hamburger, this row has roughly 143px of room for the mark on
              a 390px viewport — verified on a real iPhone, where h-24
              overflowed the row and h-20 did not.

              The button that replaced the old phone-number group is why the
              label is "Contact" rather than "Contact Now": at h-16 the logo
              renders 126px, and the row totals ~365px of 390 with the short
              label. The full label pushes it past 390.

              The height is h-16 (64px). It went h-20 -> h-16 when the first
              logo asset was trimmed, because trimming widened the aspect
              ratio and the same CSS height rendered a wider image.

              The logo was then REPLACED with a new stacked lockup (ratio
              1.976 trimmed, vs 2.166 before), so h-16 now renders 126px --
              17px NARROWER than the 143px that was verified on a real
              iPhone. Mobile therefore has headroom rather than a risk, and
              h-16 is kept deliberately: this pass is desktop-only, and
              growing the mobile mark is a change that needs its own
              real-device check.

              Verify changes here on a REAL device — headless Chrome renders
              this row with spurious horizontal clipping that does not
              reproduce on iOS Safari.
            */}
            <img
              src={LOGO_URL}
              alt="Exterior Builder Services"
              className="h-16 w-auto shrink-0 object-contain"
            />
          </a>

          <div className="flex items-center gap-4">
            {/*
              Split CTA, mirroring the hero's but in REVERSE order —
              phone first, then Contact. Two anchors styled as one button:
              they have different destinations (tel: vs the contact anchor)
              and fire different events, and one <a> carries one href.

              ⚠️ SWAP ELIGIBILITY CHANGED HERE. This replaced a group that
              rendered {DISPLAY_PHONE} as visible text, which is what made
              nav-mobile-call-icon one of only three surfaces eligible for
              Google's AUTOMATIC call-tracking number swap (client §3.6).
              That swap matches the configured number as visible rendered
              text; an icon has none, so under Mechanism 1 this button now
              degrades to click_call / Secondary tap tracking only.

              This is a deliberate trade, not an oversight: client §3.6.1
              records that EBS should use Mechanism 2
              (phone_conversion_callback), under which an icon-only anchor
              IS eligible because the forwarding number is assigned by JS
              rather than matched from text. Nothing is live yet — EBS has
              no container — so nothing is lost today. But if the container
              is ever built on the automatic swap instead, this surface
              silently stops feeding the qualified-call conversion.
              Root §8.9, §13.5.6.
            */}
            <div className="inline-flex items-stretch bg-brand-primary">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center px-3.5 text-white transition-colors duration-200 hover:bg-brand-primary-hover"
                data-event="click_call"
                data-label="nav-mobile-call-icon"
                {...mobileTracking}
                aria-label={`Call now ${DISPLAY_PHONE}`}
              >
                <SolidPhoneIcon className="h-5 w-5" />
              </a>

              {/* Decorative seam — aria-hidden so it is not announced
                  as content between two links. */}
              <span aria-hidden="true" className="w-px self-stretch bg-white/30" />

              <a
                href={quoteHref}
                className="inline-flex items-center whitespace-nowrap px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-brand-primary-hover"
                data-event="click_cta"
                data-label="nav-mobile-primary-contact"
                {...mobileTracking}
              >
                Contact
              </a>
            </div>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center text-brand-secondary"
              data-event="open_menu"
              data-label="nav-mobile-open-menu"
              {...mobileTracking}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[100] bg-default-background">
            <div className="flex items-center justify-between border-b border-neutral-border px-6 py-5">
              <img
                src={LOGO_URL}
                alt="Exterior Builder Services"
                className="h-16 w-auto object-contain"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  setMobileOpen(false);
                  setOpenSection(null);
                }}
                className="inline-flex items-center justify-center text-brand-primary"
                data-event="close_menu"
                data-label="nav-mobile-close-menu"
                {...mobileTracking}
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="px-6">
              {MENU.map((item) => {
                const hasChildren = "children" in item;
                const isOpen = openSection === item.label;

                if (!hasChildren) {
                  return (
                    <div key={item.label} className="border-b border-neutral-border">
                      <a
                        href={item.href}
                        onClick={() => {
                          setMobileOpen(false);
                          setOpenSection(null);
                        }}
                        className="flex w-full items-center justify-between py-6 text-left"
                        data-event="click_nav_link"
                        data-label={`nav-${slugify(item.label)}`}
                        {...mobileTracking}
                      >
                        <span className="text-heading-2 font-heading-2 text-default-font">
                          {item.label}
                        </span>
                      </a>
                    </div>
                  );
                }

                return (
                  <div key={item.label} className="border-b border-neutral-border">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenSection(isOpen ? null : item.label);
                      }}
                      className="flex w-full items-center justify-between py-6 text-left"
                      data-event="toggle_nav_section"
                      data-label={`nav-mobile-toggle-${slugify(item.label)}`}
                      {...mobileTracking}
                    >
                      <span className="text-heading-2 font-heading-2 text-default-font">
                        {item.label}
                      </span>

                      <svg
                        className={`h-6 w-6 transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5.5 7.75L10 12.25L14.5 7.75"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    {isOpen ? (
                      <div className="pb-5">
                        <div className="flex flex-col gap-3">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.href}
                              onClick={() => {
                                setMobileOpen(false);
                                setOpenSection(null);
                              }}
                              className="text-body font-body text-default-font"
                              data-event="click_nav_link"
                              data-label={`nav-${slugify(item.label)}-${slugify(child.label)}`}
                              {...mobileTracking}
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-border bg-brand-secondary">
              <a
                href={PHONE_HREF}
                className="flex items-center justify-center gap-3 px-6 py-5 font-extrabold tracking-wide text-white"
                data-event="click_call"
                data-label="nav-mobile-bottom-call-now"
                {...mobileTracking}
                aria-label={`Call now ${DISPLAY_PHONE}`}
              >
                <SolidPhoneIcon className="h-6 w-6" />
                <span className="phone-number text-lg">{DISPLAY_PHONE}</span>
              </a>
            </div>

            <div className="h-24" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
