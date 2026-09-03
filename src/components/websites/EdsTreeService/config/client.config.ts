// src/components/websites/EdsTreeService/config/client.config.ts
//
// Single source of truth for all per-client identity values for Ed's Tree
// Service (siteKey edstree). Forked from the EBS config on 2026-09-03; every
// value below was set from EdsTreeService-INTAKE.csv and the owner decisions
// recorded in EdsTreeService_HANDOFF_Step0-Step1.md §1. The CLAIMS REGISTER
// in that file's §3 governs every string here that a visitor can read.
//
// What lives here: contact data, business identity, theme slug, tracking ID,
// geographic constants, review data, and offer definitions.
//
// What does NOT live here: brand colors (global.css), per-page SEO copy
// (servicePageData.tsx / cityLandingData.tsx), form instance IDs (wrapper
// props), and page content (wrapper defaults).
//
// Services and cities arrays are derived from the filesystem —
// src/pages/services/*.astro → service slugs
// src/pages/service-area/*.astro → city slugs

export const CLIENT = {

  // ─── Business Identity ────────────────────────────────────────────────────
  business: {
    nameShort:   "Ed's",
    name:        "Ed's Tree Service",             // marketing / most SEO contexts
    // ⚠️ OPEN (handoff §5): the legal form (LLC / Inc / sole proprietorship)
    // was not supplied. PrivacyPolicyWrapper prints this string as the
    // legal name; correct it here when the owner confirms.
    nameLegal:   "Ed's Tree Service",
    yearFounded: 2006,                            // CONFIRMED for the tree business 2026-09-03
    // No domain exists yet. The Vercel starter URL at least resolves; the
    // intake's "NONE" would have printed nothing on the privacy page.
    // Replace when a domain is registered — nothing else depends on it, since
    // canonical and og:image resolve from the request origin (root §4.6).
    // Confirm the project name at Vercel import.
    siteUrl:     "https://eds-tree-service.vercel.app",
    owner:       "Eduardo Jimenez",               // also the owner of Exterior Builder Services
    // Possessive form for headline use. "Ed's" ALREADY carries its apostrophe,
    // so any consumer that appends "'s" to nameShort renders "Ed's's" — use
    // THIS field instead. Not derivable from nameShort in general.
    nameShortPossessive: "Ed's",
    // Cleared 2026-09-03 together with same-day tree removal. There is NO
    // emergency line: "24/7", "emergency" and "after-hours" are MUST NOT SHIP
    // (handoff §3). ⚠️ "every day" is pending confirmation that it means
    // seven days including Sunday (handoff §5).
    hoursDisplay: "Open every day, 8 AM–7 PM",
  },

  // ─── Contact ──────────────────────────────────────────────────────────────
  // Same line, inbox and address as Exterior Builder Services — same owner.
  contact: {
    phoneTel:              "tel:+19102169714",       // href="tel:..."
    phoneSMS:              "sms:+19102169714",       // intake: "same as main"
    phoneDisplay:          "(910) 216-9714",         // visible in UI — must match awcc swap target EXACTLY (root §8.9)
    emergencyPhoneDisplay: "",                       // NO emergency line — see CLAIMS REGISTER
    // The owner's real inbox (shared with EBS). Used as the visible contact
    // email, the mailto: href, and the form DESTINATION
    // (EDSTREE_CONTACT_TO_EMAIL). It can NOT be the Resend FROM address —
    // Resend rejects free-mail domains as senders — so
    // EDSTREE_CONTACT_FROM_EMAIL still needs a Resend-verified domain.
    email:                 "exteriorbuilder121414@gmail.com",
    emailHref:             "mailto:exteriorbuilder121414@gmail.com",
    address:               "104 Johny B Tann Ln, Faison, NC 28341",  // as supplied; "Johny" spelling unconfirmed
    serviceAreaLabel:      "Duplin, Sampson & Wayne Counties",
    // ⚠️ DECISION 7 (2026-09-03): this is EBS's Google listing, reused until
    // Ryan updates it manually. The "get directions" anchor therefore points
    // at the roofing company's listing for now. NOT the embedded map.
    mapsUrl:               "https://maps.app.goo.gl/Ti8Mnc39VKA81MsZ9",
  },

  // ─── Certifications ───────────────────────────────────────────────────────
  // Ed's holds NO certification and NO licence: North Carolina does not
  // license tree work, and the owner confirmed no trade certifications.
  // "Licensed" and "Certified" are MUST NOT SHIP (handoff §3). Emptied
  // deliberately — any consumer of CLIENT.certifications.* fails to
  // typecheck, which is the point: the failing file is the one that needs the
  // sparse-data treatment (remove the section, don't render it blank).
  certifications: {},

  // ─── Map ──────────────────────────────────────────────────────────────────
  // Drives ServiceAreaGoogleMap.tsx, the Google Maps JS API map on the FOUR
  // /services/* routes. The inline-SVG ServiceAreaMap.tsx still draws the same
  // three counties on home + the six city landings — two implementations of
  // one service area, inherited from EBS and deferred rather than accidental.
  //
  // ⚠️ NOT the same as contact.mapsUrl above, which is a share link.
  map: {
    // Both PUBLIC_, so Vite inlines them at BUILD time — changing either in
    // Vercel does nothing until a redeploy. When either is absent the
    // component renders a static county fallback panel and never requests
    // Google's script. The key is the owner's existing Cloud project key
    // (shared with EBS); its referrer restriction must be extended to this
    // site's origin before the map renders here (.env.example).
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY_EDSTREE as string | undefined,
    mapId: import.meta.env.PUBLIC_GOOGLE_MAPS_MAP_ID_EDSTREE as string | undefined,
    // Dissolved + simplified polygon of geo.serviceZips — the same 29 ZIPs as
    // EBS, so the same polygon, copied and renamed. Served from public/, so
    // it must stay a root-relative path.
    geojsonPath: "/maps/edstree-service-area.geojson",
    // Dissolved-polygon centroid. INITIAL VIEW ONLY — fitBounds takes over
    // as soon as the GeoJSON loads, so this only governs the first frame.
    center: { lat: 35.0096, lng: -78.1431 },
    fillOpacity: 0.28,
  },

  // ─── Vocabulary (industry-specific terms) ─────────────────────────────────
  // Short standalone labels only (credential names, guarantee names, trade
  // name) — NOT full prose. Prose still needs a manual per-fork rewrite; see
  // DUPLICATE.md Step 6.
  vocabulary: {
    tradeName:             "Tree Service",
    // ⚠️ DELIBERATELY EMPTY (decision 4, 2026-09-03). Ed's has no credential
    // to name. Every former consumer of these two fields was re-authored
    // around the five cleared claims — bonded & insured, family-owned,
    // locally owned, since 2006, 1000+ served — rather than rendering an
    // empty string. Do NOT fill these with "Certified", "Licensed" or
    // "Arborist": all three are MUST NOT SHIP for this client (handoff §3).
    credentialTitle:       "",
    credentialTitlePlural: "",
    industryAssociation:   "",                      // member of NO trade association — badge rows deleted, not substituted
    guaranteeName:         "Ed's Service Guarantee",
  },

  // ─── Geography ────────────────────────────────────────────────────────────
  geo: {
    hqCity:          "Faison",
    hqState:         "NC",
    // Analytics tracking slug — PERMANENT once traffic exists.
    trackingCity:    "faison-nc",
    serviceArea:     "Duplin, Sampson & Wayne Counties",  // accepted Step 0 deviation, same as EBS
    serviceCounties: ["Duplin", "Sampson", "Wayne"],
    previewCities:   ["Clinton", "Goldsboro", "Mount Olive"], // ServiceAreaMap preview list

    /**
     * The six city-landing pages, ordered by market size (same six as EBS).
     *
     * ⚠️ `slug` MUST equal the src/pages/service-area/*.astro filename — the
     * route is /service-area/{slug}, NOT /{slug}. All six verified against
     * the filesystem and against NavbarMainWrapper's link list on 2026-09-03.
     * Nothing enforces this at build time: a typo here produces a chip and a
     * map pin that both 404, with no error anywhere.
     *
     * lat/lng are municipal centroids, used only to place map pins.
     */
    landingCities: [
      { name: "Goldsboro",   slug: "goldsboro-nc-tree-service",   county: "Wayne",   lat: 35.3849, lng: -77.9928 },
      { name: "Clinton",     slug: "clinton-nc-tree-service",     county: "Sampson", lat: 35.0002, lng: -78.3233 },
      { name: "Mount Olive", slug: "mount-olive-nc-tree-service", county: "Wayne",   lat: 35.1968, lng: -78.0664 },
      { name: "Warsaw",      slug: "warsaw-nc-tree-service",      county: "Duplin",  lat: 35.0035, lng: -78.0911 },
      { name: "Faison",      slug: "faison-nc-tree-service",      county: "Duplin",  lat: 35.1157, lng: -78.1372 },
      { name: "Kenansville", slug: "kenansville-nc-tree-service", county: "Duplin",  lat: 34.9621, lng: -77.9627 },
    ],

    /**
     * Towns served that have no landing page of their own. Copied from EBS
     * per the intake ("same as EBS"), overlap included: Warsaw, Kenansville
     * and Faison appear in both lists, so consumers that render BOTH must
     * dedupe (ServiceONEtallLocationWrapper does).
     *
     * ⚠️ CLAIMS. Only the six landing cities are owner-confirmed. The rest
     * were derived from county geography for EBS and carry the same
     * UNCONFIRMED caveat here. "We serve X" is a claim PER TOWN (handoff §3).
     */
    expandedCities: [
      "Warsaw",
      "Kenansville",
      "Wallace",
      "Rose Hill",
      "Beulaville",
      "Magnolia",
      "Faison",
      "Calypso",
      "Roseboro",
      "Newton Grove",
      "Garland",
      "Salemburg",
      "Fremont",
      "Pikeville",
      "Seven Springs",
    ],

    /**
     * The 29 ZCTAs dissolved into public/maps/edstree-service-area.geojson.
     * Kept here as the record of WHAT the polygon covers — nothing reads this
     * at runtime. Regenerating the polygon should read this list.
     */
    serviceZips: [
      "27530", "27531", "27533", "27534", "27830", "27863", "28318", "28325",
      "28328", "28333", "28341", "28349", "28365", "28366", "28382", "28385",
      "28393", "28398", "28441", "28444", "28447", "28453", "28458", "28464",
      "28466", "28508", "28518", "28521", "28578",
    ],
  },

  // ─── Service ──────────────────────────────────────────────────────────────
  // Default trackingService slug for wrappers/pages with no per-service context
  // (home, about, contact, privacy, city landings). Service pages derive their
  // own slug from servicePageData[*].slug instead.
  // ⚠️ Root §8.5: kebab-case, never derived from a display name, and
  // PERMANENT once traffic exists.
  service: {
    trackingSlug: "tree-service",
  },

  // ─── Theme ────────────────────────────────────────────────────────────────
  // Brand colors are NOT here — they live in src/styles/global.css only.
  // theme.slug is "edstree" while the client FOLDER is "EdsTreeService" —
  // the same deliberate deviation from root §4.6 that EBS made; siteKey and
  // theme.slug agree with each other, which is what Step 0 checks.
  theme: {
    slug:      "edstree",                   // → CSS selector .theme-edstree
    bodyClass: "theme-edstree font-body",   // → <Layout bodyClass={CLIENT.theme.bodyClass} />
  },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  // Separate from geo.serviceArea — SEO copy uses a broader regional framing
  // tuned for search volume, which may differ from the service-area label.
  seo: {
    regionLabel: "Goldsboro–Clinton, NC",
    // Site-wide social share image. ⚠️ NOT A FILE IN public/ — a PRERENDERED
    // ROUTE. src/pages/og/default.jpg.ts renders og/SocialShareCard.tsx to a
    // 1200x630 JPEG once per build (photo + logo from public/images, the
    // heading font vendored in og/fonts). Store a ROOT-RELATIVE path —
    // Layout.astro absolutizes it against the request origin (root §4.6).
    ogImage: "/og/default.jpg",
  },

  // ─── Site / API identity ──────────────────────────────────────────────────
  // Used in /api/contact payload as the routing discriminator (root §13.6.3).
  // Env var prefix derives from this: EDSTREE_CONTACT_TO_EMAIL, etc.
  siteKey: "edstree",

  // ─── Tracking ─────────────────────────────────────────────────────────────
  // Ed's is NOT launching with tracking — Step 8 does not run. The env var is
  // named for this client anyway so switching on later is ONE env var.
  // PUBLIC_GTM_ID_EDSTREE is undefined at runtime; Layout.astro no-ops
  // cleanly. All data-* click attributes and dataLayer pushes stay in place.
  tracking: {
    gtmId: import.meta.env.PUBLIC_GTM_ID_EDSTREE as string,
  },

  // ─── Reviews ──────────────────────────────────────────────────────────────
  // Ed's has NO reviews and NO rating on any platform (decision 5,
  // 2026-09-03). Every rating surface is removed from the builders — the home
  // reviews carousel, the hero Google badge and the /about ratings block — and
  // these stay EMPTY. Never a placeholder review or an invented count.
  reviews: {
    trustBadge: "",
    reviewCount: "",
    platforms: [],
  },

  // ─── Offers ───────────────────────────────────────────────────────────────
  // ONE offer. "Free tree removal" was STRUCK 2026-09-03 — there is no such
  // offer. There is NO /offers route (inherited from EBS, which deleted it).
  // `items[0]` is read by FullStretchFaqWrapper, ServiceONEFaqWrapper,
  // OurProcessStepsWrapper, ResidentialCommercialWrapper and
  // OfferShowCaseWrapper; deleting this block breaks all five.
  // ⚠️ validThrough is EMPTY on purpose: the intake has no real date and a
  // placeholder must not ship (handoff §5). Nothing renders it today.
  offers: {
    items: [
      {
        id:           "first-tree-service-10-off",
        title:        "10% Off Your First Tree Service",
        badge:        "10% OFF",
        description:  "New to Ed's? Take 10% off your first tree removal, trimming, stump grinding or storm clean-up job. Mention this offer when you book.",
        minimumLabel: "",                    // none stated
        validThrough: "",                    // OPEN — real rolling date needed
        couponPath:   "",                    // no coupon asset exists
      },
    ],
  },

} as const;

export type ClientConfig = typeof CLIENT;
