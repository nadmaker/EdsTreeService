"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * Ed's — two-tier site navigation (desktop + mobile).
 *
 * Replaces NavbarMainWrapper (kept on disk, no longer composed). Styled from
 * the Imperium Roofing reference: a dark INFO BAR (phone, email, socials)
 * over a MAIN BAR with the menu split around a centred logo and a hard-
 * shadowed CTA capping the right end. The reference's black + teal is mapped
 * to this client's tokens — near-black green band, white main bar, green
 * dropdown panels, amber CTA with a dark label (style guide rule 2).
 *
 * HOW THE TWO TIERS SCROLL — no JS, no spacer, no layout shift.
 * The root is `position: sticky` with a NEGATIVE top equal to the info
 * bar's height (--site-nav-topbar, declared on the root and consumed by the
 * info bar's own height, so the two cannot drift). At rest the whole header
 * is in normal flow at the top of the page, the hero starts BELOW it, and
 * the info bar simply scrolls away like any content; once the page has
 * scrolled by exactly the info bar's height the root pins with its top at
 * -44px, which leaves the main bar flush at y=0. Scrolling back up brings
 * the info bar back. This is why the previous wrapper's fixed-bar spacer,
 * `heroBehind` prop and rAF scroll listener are all gone: none of them has
 * a job when the header is in flow.
 *
 * ⚠️ STICKY NEEDS A TALL PARENT. A sticky element only travels inside its
 * containing block, so this root must be a direct child of something that
 * spans the page — <main> in the one-off builders, the island itself (an
 * <astro-island>, display:contents) in the BLDRs. Do NOT wrap it in a
 * <header> or <div> of its own height in a builder; it would have zero
 * distance to stick over and would scroll away with the page. This root IS
 * the <header> landmark, the same way FooterWrapper owns its <footer>.
 *
 * ⚠️ An `overflow: hidden` / `overflow-x: hidden` on <main> or <body> would
 * also defeat sticky by becoming its scroll container. None exists today;
 * do not add one for a horizontal-overflow fix without re-checking this.
 *
 * DROPDOWNS open on hover AND click. Hover/focus-within is pure CSS (named
 * groups), so a mouse user never waits on React; click toggles state so a
 * touch user at desktop width and a keyboard user get the same panel, and
 * `aria-expanded` follows that state. A nested level flies out to the right
 * (the reference's "Residential Roofing ▸" pattern) — used here for the
 * three service counties, whose cities are derived from CLIENT.geo. Panels
 * are absolute inside the sticky root, which must therefore never gain
 * overflow-hidden.
 *
 * BREAKPOINT. Desktop layout from md (768px), matching every clearance
 * token, hero padding and scroll-padding rule on the site, which are all
 * keyed to 768. The bar is sized down at md (12px links, 52px logo) and up
 * at lg/xl so it fits at 768 without moving that boundary.
 *
 * MOBILE keeps the previous header's verified always-mounted overlay
 * (root §8.9): slid off-canvas with a transform, pointer-events-none and
 * inert while closed, never conditionally rendered — the call bar inside
 * it has to exist at parse time for Google's number swap.
 */

/* ─── Constants ────────────────────────────────────────────────────────── */

const PHONE_HREF    = CLIENT.contact.phoneTel;
const DISPLAY_PHONE = CLIENT.contact.phoneDisplay;
const EMAIL_HREF    = CLIENT.contact.emailHref;
const DISPLAY_EMAIL = CLIENT.contact.email;

/**
 * The navbar mark — the owner's wordmark with the "ED'S" row centred over
 * "TREE SERVICE" instead of flush left. Derived from edstree-logo.png by
 * `node scripts/stack-logo.mjs`; regenerate rather than hand-editing if the
 * owner supplies new artwork.
 *
 * Why the stacked cut here: BOTH bars centre the logo — desktop between the
 * split menu groups, mobile between the call icon and the hamburger — and a
 * wordmark whose top row is flush left reads as mis-centred in either, even
 * when its box is perfectly centred. Same canvas as the source (725x269), so
 * every rendered width is unchanged and no layout shifts.
 *
 * edstree-logo.png is still the mark elsewhere (footer, credential band, the
 * og card generator), where it is NOT optically centred.
 */
const LOGO_URL = "/images/edstree-logo-stacked.png";

/** Info-bar prompt, left of the phone. Not a claim — no register entry. */
const TOPBAR_PROMPT = "Need Tree Help? Call Us Now!";

/** Main-bar CTA label. "Free estimates" is a CLEARED claim (handoff §3). */
const CTA_LABEL = "Get A Free Quote";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

/* ─── Menu model ───────────────────────────────────────────────────────── */

type MenuLeaf = {
  label: string;
  href: string;
  /** Tracking key when it must differ from slugify(label). */
  key?: string;
};

type MenuGroup = {
  label: string;
  key?: string;
  children: readonly MenuItem[];
};

type MenuItem = MenuLeaf | MenuGroup;

function isGroup(item: MenuItem): item is MenuGroup {
  return "children" in item;
}

function keyOf(item: MenuItem) {
  return item.key ?? slugify(item.label);
}

/**
 * Services are listed by hand, matching the four /services/*.astro routes —
 * the same list the previous wrapper carried (client CLAUDE.md names the
 * navbar MENU as one of the places to grep after the data files change).
 * servicePageData is deliberately NOT imported here: that module also
 * exports the import.meta.glob-derived SERVICE_SLUGS, which must not enter a
 * wrapper (root §13.3.7).
 */
const SERVICES_MENU: readonly MenuLeaf[] = [
  { label: "Tree Removal",   href: "/services/tree-removal" },
  { label: "Tree Trimming",  href: "/services/tree-trimming" },
  { label: "Stump Grinding", href: "/services/stump-grinding" },
  { label: "Storm Clean Up", href: "/services/storm-clean-up" },
];

/**
 * Service areas grouped by county, in CLIENT.geo.serviceCounties order, each
 * county flying out to its landing cities. Derived, not typed: a city added
 * to CLIENT.geo.landingCities appears here on the next build, and a county
 * with no landing page renders no group. Flatten this to
 * `CLIENT.geo.landingCities.map(...)` if the one-level list is preferred.
 */
const LOCATIONS_MENU: readonly MenuGroup[] = CLIENT.geo.serviceCounties
  .map((county) => ({
    label: `${county} County`,
    children: CLIENT.geo.landingCities
      .filter((c) => c.county === county)
      .map((c) => ({ label: c.name, href: `/service-area/${c.slug}` })),
  }))
  .filter((g) => g.children.length > 0);

/**
 * The tracking key "locations" is kept from the previous wrapper so every
 * label under it (nav-locations-warsaw, nav-mobile-toggle-locations, …) is
 * byte-identical to what that wrapper emitted; only the VISIBLE label is
 * "Service Areas". Leaf labels use the top-level key plus the leaf slug —
 * never the county in between — for the same reason.
 */
const LEFT_MENU: readonly MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", children: SERVICES_MENU },
  { label: "Service Areas", key: "locations", children: LOCATIONS_MENU },
];

const RIGHT_MENU: readonly MenuItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─── Social links ─────────────────────────────────────────────────────── */

type SocialLink = {
  key: string;
  label: string;
  href: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
};

/**
 * Ed's has NO social profiles (intake row 96; client CLAUDE.md §1). An
 * entry with an empty href is filtered out below rather than rendered dead,
 * so only the Google icon ships today. Its target is CLIENT.contact.mapsUrl
 * — the reused EBS Google listing (config decision 7), the same link the
 * footer's directions anchor already uses. Fill the hrefs here when
 * profiles exist; the reference's three-icon row then appears unchanged.
 */
function socialLinks(): readonly SocialLink[] {
  const all: SocialLink[] = [
    { key: "facebook",  label: "Facebook",  href: "",                      Icon: FacebookIcon },
    { key: "instagram", label: "Instagram", href: "",                      Icon: InstagramIcon },
    { key: "google",    label: "Google",    href: CLIENT.contact.mapsUrl,  Icon: GoogleIcon },
  ];
  return all.filter((s) => s.href);
}

const SOCIAL_LINKS = socialLinks();

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface NavbarTwoTierWrapperProps {
  id?: string;
  className?: string;

  /** Page-specific CTA target */
  quoteHref?: string;

  /** Tracking context */
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/* ─── Icons (wrapper-local, no icon chunk) ─────────────────────────────── */

function SolidPhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.95 21c-2.08 0-4.74-.85-7.42-2.41-2.57-1.49-4.99-3.61-6.81-5.97C3.86 10.21 2.96 7.88 3 6.04c.02-1 .73-1.87 1.7-2.06l2.67-.53c.88-.18 1.75.27 2.15 1.07l1.24 2.49c.33.66.22 1.45-.27 2l-1.26 1.42a.75.75 0 0 0-.09.92c.78 1.19 1.77 2.27 2.95 3.22 1.16.94 2.41 1.7 3.71 2.28a.75.75 0 0 0 .89-.2l1.18-1.39c.52-.61 1.38-.84 2.13-.57l2.61.94c.88.32 1.41 1.22 1.28 2.15l-.38 2.71A2.12 2.12 0 0 1 19.95 21Z" />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function TriangleDownIcon({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <path d="M1 3h8L5 8z" />
    </svg>
  );
}

function TriangleRightIcon({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <path d="M3 1v8l5-4z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 7.75L10 12.25L14.5 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HamburgerIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
    </svg>
  );
}

/* ─── Shared class strings ─────────────────────────────────────────────── */

type Tracking = {
  readonly "data-section": string;
  readonly "data-city"?: string;
  readonly "data-service"?: string;
  readonly "data-page-type"?: string;
};

/** Desktop top-level link/trigger. Sized down at md so the bar fits 768px. */
const desktopLinkBase = [
  "inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-2",
  "text-[12px] lg:text-[14px] xl:text-[15px] font-semibold uppercase tracking-[0.04em]",
  "text-default-font transition-colors hover:text-brand-primary",
  "focus-visible:outline-none focus-visible:text-brand-primary",
].join(" ");

/** Item inside a desktop dropdown panel (link or nested trigger). */
const panelItemBase = [
  "flex w-full items-center justify-between gap-4 whitespace-nowrap px-5 py-2.5 text-left",
  "text-[13px] font-semibold uppercase tracking-[0.04em] text-default-background",
  "transition-colors hover:bg-brand-primary focus-visible:bg-brand-primary focus-visible:outline-none",
].join(" ");

/** Dropdown panel surface — the guide's reverse-out band: primary-hover
 *  fill with default-background text (6.71:1). */
const panelSurface = "border border-white/10 bg-brand-primary-hover py-1 shadow-xl";

/* ─── Desktop dropdown item (recursive) ────────────────────────────────── */

function DesktopPanelItem({
  item,
  topKey,
  pathKey,
  openSub,
  setOpenSub,
  tracking,
}: {
  item: MenuItem;
  topKey: string;
  pathKey: string;
  openSub: string | null;
  setOpenSub: (key: string | null) => void;
  tracking: Tracking;
}) {
  if (!isGroup(item)) {
    return (
      <li>
        <a
          href={item.href}
          className={panelItemBase}
          data-event="click_nav_link"
          data-label={`nav-${topKey}-${slugify(item.label)}`}
          {...tracking}
        >
          {item.label}
        </a>
      </li>
    );
  }

  const key = `${pathKey}/${keyOf(item)}`;
  const open = openSub === key;

  return (
    /* group/sub scopes the hover to THIS row and its flyout; the flyout is a
       descendant, so moving the pointer into it keeps the row hovered. */
    <li
      className="group/sub relative"
      onMouseLeave={() => {
        if (open) setOpenSub(null);
      }}
    >
      <button
        type="button"
        className={panelItemBase}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpenSub(open ? null : key)}
        data-event="toggle_nav_section"
        data-label={`nav-toggle-${topKey}-${slugify(item.label)}`}
        {...tracking}
      >
        <span>{item.label}</span>
        <TriangleRightIcon className="h-2.5 w-2.5 opacity-80" />
      </button>

      {/* Flyout, flush to the parent panel's right edge at the row's top. */}
      <div
        className={[
          "absolute left-full top-0 min-w-[220px]",
          "group-hover/sub:block group-focus-within/sub:block",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <ul className={panelSurface}>
          {item.children.map((child) => (
            <DesktopPanelItem
              key={keyOf(child)}
              item={child}
              topKey={topKey}
              pathKey={key}
              openSub={openSub}
              setOpenSub={setOpenSub}
              tracking={tracking}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

/* ─── Desktop top-level item ───────────────────────────────────────────── */

function DesktopTopItem({
  item,
  openTop,
  setOpenTop,
  openSub,
  setOpenSub,
  tracking,
}: {
  item: MenuItem;
  openTop: string | null;
  setOpenTop: (key: string | null) => void;
  openSub: string | null;
  setOpenSub: (key: string | null) => void;
  tracking: Tracking;
}) {
  const key = keyOf(item);

  if (!isGroup(item)) {
    return (
      <a
        href={item.href}
        className={desktopLinkBase}
        data-event="click_nav_link"
        data-label={`nav-${key}`}
        {...tracking}
      >
        {item.label}
      </a>
    );
  }

  const open = openTop === key;
  const panelId = `nav-panel-${key}`;

  return (
    /*
      Full bar height so the panel's `top-full` resolves to the BOTTOM OF
      THE BAR, not the bottom of the button — and so there is no hover gap
      between the trigger and the panel for the pointer to fall through.
    */
    <div
      className="group/top relative flex h-full items-center"
      onMouseLeave={() => {
        if (open) {
          setOpenTop(null);
          setOpenSub(null);
        }
      }}
    >
      <button
        type="button"
        className={desktopLinkBase}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpenTop(open ? null : key);
          setOpenSub(null);
        }}
        data-event="toggle_nav_section"
        data-label={`nav-toggle-${key}`}
        {...tracking}
      >
        {item.label}
        <TriangleDownIcon className="h-2.5 w-2.5 text-brand-primary" />
      </button>

      <div
        id={panelId}
        className={[
          "absolute left-0 top-full z-10 min-w-[240px]",
          "group-hover/top:block group-focus-within/top:block",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <ul className={panelSurface}>
          {item.children.map((child) => (
            <DesktopPanelItem
              key={keyOf(child)}
              item={child}
              topKey={key}
              pathKey={key}
              openSub={openSub}
              setOpenSub={setOpenSub}
              tracking={tracking}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Mobile accordion (recursive) ─────────────────────────────────────── */

function MobileMenuItems({
  items,
  depth,
  topKey,
  pathKey,
  openSet,
  toggle,
  onNavigate,
  tracking,
}: {
  items: readonly MenuItem[];
  depth: number;
  topKey: string;
  pathKey: string;
  openSet: ReadonlySet<string>;
  toggle: (key: string) => void;
  onNavigate: () => void;
  tracking: Tracking;
}) {
  const rowBase =
    depth === 0
      ? "flex w-full items-center justify-between py-5 text-left text-heading-3 font-heading-3 text-default-font"
      : "flex w-full items-center justify-between py-3 text-left text-body font-body text-default-font";

  return (
    <>
      {items.map((item) => {
        if (!isGroup(item)) {
          return (
            <li key={keyOf(item)} className={depth === 0 ? "border-b border-neutral-border" : ""}>
              <a
                href={item.href}
                onClick={onNavigate}
                className={rowBase}
                data-event="click_nav_link"
                data-label={depth === 0 ? `nav-${keyOf(item)}` : `nav-${topKey}-${slugify(item.label)}`}
                {...tracking}
              >
                <span>{item.label}</span>
              </a>
            </li>
          );
        }

        const ownKey = keyOf(item);
        const key = depth === 0 ? ownKey : `${pathKey}/${ownKey}`;
        const nextTopKey = depth === 0 ? ownKey : topKey;
        const open = openSet.has(key);
        const panelId = `nav-mobile-panel-${key.replace(/\//g, "-")}`;

        return (
          <li key={ownKey} className={depth === 0 ? "border-b border-neutral-border" : ""}>
            <button
              type="button"
              onClick={() => toggle(key)}
              className={rowBase}
              aria-expanded={open}
              aria-controls={panelId}
              data-event="toggle_nav_section"
              data-label={
                depth === 0
                  ? `nav-mobile-toggle-${ownKey}`
                  : `nav-mobile-toggle-${topKey}-${slugify(item.label)}`
              }
              {...tracking}
            >
              <span>{item.label}</span>
              <ChevronDownIcon
                className={[
                  "h-5 w-5 shrink-0 text-brand-primary transition-transform motion-reduce:transition-none",
                  open ? "rotate-180" : "rotate-0",
                ].join(" ")}
              />
            </button>

            {open ? (
              <ul id={panelId} className={depth === 0 ? "pb-4 pl-4" : "pb-2 pl-4"}>
                <MobileMenuItems
                  items={item.children}
                  depth={depth + 1}
                  topKey={nextTopKey}
                  pathKey={key}
                  openSet={openSet}
                  toggle={toggle}
                  onNavigate={onNavigate}
                  tracking={tracking}
                />
              </ul>
            ) : null}
          </li>
        );
      })}
    </>
  );
}

/* ─── The wrapper ──────────────────────────────────────────────────────── */

export default function NavbarTwoTierWrapper({
  id,
  className,
  quoteHref = "#home-contact",
  trackingCity,
  trackingService,
  trackingPageType,
}: NavbarTwoTierWrapperProps) {
  /* Desktop dropdown state (click/keyboard path; hover is CSS). */
  const [openTop, setOpenTop] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);

  /* Mobile overlay state. */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<ReadonlySet<string>>(() => new Set());
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasMobileOpenRef = useRef(false);

  /*
    Tracking context shared by every tracked element in the info bar and
    the desktop bar. Spread rather than retyped per element so a partial
    attribute set — which the click bridge would still fire, just without
    the context needed for analytics joins — is hard to write by accident.
    Root §8.6, §13.3.5.
  */
  const ctaTracking: Tracking = {
    "data-section": "navbar",
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  };

  /* Same context for the mobile header + overlay, reporting as their own
     section, as the previous wrapper did. */
  const mobileTracking: Tracking = {
    "data-section": "navbar-mobile",
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  };

  const closeDesktop = useCallback(() => {
    setOpenTop(null);
    setOpenSub(null);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setOpenSections(new Set());
  }, []);

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /* Click-opened desktop panels close on an outside pointer or Escape.
     Hover-opened ones need nothing — the CSS state ends with the hover. */
  useEffect(() => {
    if (!openTop && !openSub) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = desktopNavRef.current;
      if (root && e.target instanceof Node && !root.contains(e.target)) closeDesktop();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDesktop();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openTop, openSub, closeDesktop]);

  /* Mobile overlay: Escape closes; focus moves in on open and back to the
     hamburger on close, so keyboard users are not stranded in an inert
     subtree. */
  useEffect(() => {
    if (mobileOpen) {
      wasMobileOpenRef.current = true;
      closeButtonRef.current?.focus();

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMobile();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }

    if (wasMobileOpenRef.current) {
      wasMobileOpenRef.current = false;
      openButtonRef.current?.focus();
    }
    return undefined;
  }, [mobileOpen, closeMobile]);

  return (
    <header
      id={id}
      ref={desktopNavRef}
      className={[
        /*
          STICKY WITH A NEGATIVE TOP — see the file header. --site-nav-topbar
          is declared HERE (40px mobile, 44px from md) and consumed twice: by
          this `top`, and by the info bar's height below. One value, so the
          bar that scrolls away and the distance the root is allowed to
          scroll before pinning cannot disagree.
        */
        "sticky z-50 w-full",
        "[--site-nav-topbar:40px] md:[--site-nav-topbar:44px]",
        "top-[calc(var(--site-nav-topbar)*-1)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-section="navbar"
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* ── TIER 1 — info bar. Near-black green band (the home contact
          form's dark-band colour), white text, amber icons: amber on
          #0B240E measures 6.48:1 (global.css), so it is a legitimate accent
          HERE even though it is banned as text on the page background.
          The 3px rule below it is the reference's brand-colour line. ── */}
      <div className="h-[var(--site-nav-topbar)] w-full border-b-[3px] border-brand-primary bg-default-font text-white">
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <span className="hidden whitespace-nowrap text-[13px] font-medium lg:inline">
              {TOPBAR_PROMPT}
            </span>

            {/*
              Visible number, not decoration: Google's automatic "Calls from
              website" swap matches the configured number as VISIBLE RENDERED
              TEXT (root §8.9, §13.5.6). This anchor is in the DOM at every
              width, which makes it the first mobile surface on the site that
              is eligible under Mechanism 1.
            */}
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 whitespace-nowrap text-[12px] md:text-[13px]"
              data-event="click_call"
              data-label="nav-topbar-call"
              {...ctaTracking}
              aria-label={`Call now ${DISPLAY_PHONE}`}
            >
              <span className="hidden text-white/80 md:inline">Phone:</span>
              <SolidPhoneIcon className="h-4 w-4 text-brand-secondary" />
              <span className="phone-number font-semibold">{DISPLAY_PHONE}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <a
              href={EMAIL_HREF}
              className="hidden items-center gap-2 whitespace-nowrap text-[13px] md:inline-flex"
              data-event="click_email"
              data-label="nav-topbar-email"
              {...ctaTracking}
            >
              <span className="text-white/80">Email:</span>
              <MailIcon className="h-4 w-4 text-brand-secondary" />
              <span className="font-medium">{DISPLAY_EMAIL}</span>
            </a>

            {SOCIAL_LINKS.length > 0 ? (
              <ul className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-default-font transition-colors hover:bg-brand-secondary"
                      aria-label={label}
                      data-event="click_social"
                      data-label={`nav-topbar-social-${key}`}
                      {...ctaTracking}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── TIER 2 — main bar. White so the colour logo keeps its own
          ground; menu split around the centred logo, CTA capping the right.
          Do NOT add overflow-hidden anywhere in this tier — the dropdown
          panels hang below it. ── */}
      <div className="w-full bg-white shadow-md">
        {/* Desktop (md+) */}
        <nav
          aria-label="Primary"
          className="mx-auto hidden h-[84px] w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 md:grid lg:px-8"
        >
          {/* Left group — flush left. Both side columns are 1fr, which is
              what keeps the logo on the true centre line regardless of how
              the two groups' widths differ. */}
          <div className="flex h-full items-center justify-start gap-1 lg:gap-3">
            {LEFT_MENU.map((item) => (
              <DesktopTopItem
                key={keyOf(item)}
                item={item}
                openTop={openTop}
                setOpenTop={setOpenTop}
                openSub={openSub}
                setOpenSub={setOpenSub}
                tracking={ctaTracking}
              />
            ))}
          </div>

          {/* Centred logo — the stacked colour mark, sized to the bar. */}
          <a
            href="/"
            className="flex items-center justify-center px-3 lg:px-6"
            data-event="click_nav_link"
            data-label="nav-home-logo"
            {...ctaTracking}
          >
            <img
              src={LOGO_URL}
              alt={CLIENT.business.name}
              className="h-[52px] w-auto object-contain lg:h-[64px]"
            />
          </a>

          {/* Right group — flush right, CTA last. */}
          <div className="flex h-full items-center justify-end gap-1 lg:gap-3">
            {RIGHT_MENU.map((item) => (
              <DesktopTopItem
                key={keyOf(item)}
                item={item}
                openTop={openTop}
                setOpenTop={setOpenTop}
                openSub={openSub}
                setOpenSub={setOpenSub}
                tracking={ctaTracking}
              />
            ))}

            {/*
              Primary CTA — amber fill, DARK label (style guide rule 2: amber
              labels are --color-default-font, never white), with the
              reference's offset block shadow drawn in the same dark tone.
              Hover presses the block into its shadow.
            */}
            <a
              href={quoteHref}
              className={[
                "ml-2 inline-flex h-11 items-center justify-center whitespace-nowrap px-4 lg:ml-4 lg:h-12 lg:px-6",
                "bg-gradient-to-r from-brand-secondary to-brand-secondary-secondary-tone",
                "text-[12px] font-semibold uppercase tracking-[0.06em] text-default-font lg:text-[13px] xl:text-[14px]",
                "shadow-[4px_4px_0_0_var(--color-default-font)]",
                "transition-[transform,box-shadow] duration-150 motion-reduce:transition-none",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-default-font)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
              ].join(" ")}
              data-event="click_cta"
              data-label="nav-primary-get-a-quote"
              {...ctaTracking}
            >
              {CTA_LABEL}
            </a>
          </div>
        </nav>

        {/* Mobile (<md): call button · centred logo · hamburger */}
        <div className="grid h-[72px] w-full grid-cols-[1fr_auto_1fr] items-center px-4 md:hidden">
          {/*
            Icon-only, so it is Secondary (tap) tracking only under Mechanism
            1 — root §13.5.6. That is acceptable HERE, and only here, because
            the info bar directly above renders the number as visible text at
            this width, so mobile now has a Mechanism-1-eligible surface that
            the previous header lacked.
          */}
          <div className="flex justify-start">
            <a
              href={PHONE_HREF}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary text-default-font transition-colors hover:bg-brand-secondary-hover"
              data-event="click_call"
              data-label="nav-mobile-call-icon"
              {...mobileTracking}
              aria-label={`Call now ${DISPLAY_PHONE}`}
            >
              <SolidPhoneIcon className="h-5 w-5" />
            </a>
          </div>

          <a
            href="/"
            className="flex items-center justify-center px-2"
            data-event="click_nav_link"
            data-label="nav-home-logo"
            {...mobileTracking}
          >
            <img src={LOGO_URL} alt={CLIENT.business.name} className="h-12 w-auto object-contain" />
          </a>

          <div className="flex justify-end">
            <button
              ref={openButtonRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="nav-mobile-overlay"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center text-default-font"
              data-event="open_menu"
              data-label="nav-mobile-open-menu"
              {...mobileTracking}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </div>

      {/*
        MOBILE OVERLAY — ALWAYS MOUNTED (root §8.9's always-mount rule).
        Slid off-canvas to the LEFT with a transform (display:none or
        visibility:hidden would be invisible to Google's number swap),
        pointer-events-none so it cannot intercept clicks while closed, and
        inert so its links leave the tab order and the accessibility tree.
        All four parts are load-bearing. md:hidden so it can never be
        opened at desktop width if state leaks across a resize.
      */}
      <div
        id="nav-mobile-overlay"
        className={[
          "fixed inset-0 z-[100] overflow-y-auto bg-default-background md:hidden",
          "transition-transform duration-200 motion-reduce:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        ].join(" ")}
        inert={!mobileOpen}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-neutral-border px-4">
          <img src={LOGO_URL} alt={CLIENT.business.name} className="h-12 w-auto object-contain" />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={closeMobile}
            className="inline-flex h-10 w-10 items-center justify-center text-default-font"
            data-event="close_menu"
            data-label="nav-mobile-close-menu"
            {...mobileTracking}
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile" className="px-6 pb-32">
          {/* The quote CTA that the previous header carried in its top row;
              same label and event, moved into the overlay because the row
              now centres the logo. */}
          <a
            href={quoteHref}
            onClick={closeMobile}
            className={[
              "mt-6 flex h-12 w-full items-center justify-center",
              "bg-gradient-to-r from-brand-secondary to-brand-secondary-secondary-tone",
              "text-[13px] font-semibold uppercase tracking-[0.06em] text-default-font",
              "shadow-[4px_4px_0_0_var(--color-default-font)]",
            ].join(" ")}
            data-event="click_cta"
            data-label="nav-mobile-primary-contact"
            {...mobileTracking}
          >
            {CTA_LABEL}
          </a>

          <ul className="mt-4">
            <MobileMenuItems
              items={[...LEFT_MENU, ...RIGHT_MENU]}
              depth={0}
              topKey=""
              pathKey=""
              openSet={openSections}
              toggle={toggleSection}
              onNavigate={closeMobile}
              tracking={mobileTracking}
            />
          </ul>

          {/* Email, mirroring the info bar entry that is hidden below md. */}
          <a
            href={EMAIL_HREF}
            className="mt-6 inline-flex items-center gap-2 text-body font-body text-default-font"
            data-event="click_email"
            data-label="nav-mobile-email"
            {...mobileTracking}
          >
            <MailIcon className="h-4 w-4 text-brand-primary" />
            <span className="break-all">{DISPLAY_EMAIL}</span>
          </a>
        </nav>

        {/* Bottom call bar — visible number, so Mechanism-1 eligible. Dark
            label on amber per style guide rule 2. */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-border bg-brand-secondary">
          <a
            href={PHONE_HREF}
            className="flex items-center justify-center gap-3 px-6 py-5 font-extrabold tracking-wide text-default-font"
            data-event="click_call"
            data-label="nav-mobile-bottom-call-now"
            {...mobileTracking}
            aria-label={`Call now ${DISPLAY_PHONE}`}
          >
            <SolidPhoneIcon className="h-6 w-6" />
            <span className="phone-number text-lg">{DISPLAY_PHONE}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
