// src/components/websites/ExteriorBuilderServices/config/client.config.ts
//
// Single source of truth for all per-client identity values.
// When forking this template for a new client, this is the primary file to edit.
//
// What lives here: contact data, business identity, theme slug, tracking ID,
// geographic constants, review data, and offer definitions.
//
// What does NOT live here: brand colors (global.css), per-page SEO copy
// (servicePageData.tsx / cityLandingData.tsx), form instance IDs (wrapper props),
// and page content (wrapper defaults).
//
// Services and cities arrays are derived from the filesystem in Batch 3d —
// src/pages/services/*.astro → service slugs
// src/pages/service-area/*.astro → city slugs

export const CLIENT = {

  // ─── Business Identity ────────────────────────────────────────────────────
  business: {
    nameShort:   "EBS",                            // ⚠ DECISION 1 — see notes
    name:        "Exterior Builder Services",      // marketing / most SEO contexts
    nameLegal:   "Exterior Builder Services Inc.", // privacy policy, formal copy
    yearFounded: 2006,
    siteUrl:     "https://exteriorbuilderservices.com",  // no trailing slash (Step 2 rule)
    owner:       "Eduardo Jimenez",
    // Possessive form for headline use. NOT derivable from nameShort — an
    // acronym takes "'s", but a name already ending in s may not. Consumed by
    // headline slots such as FullStretchFaqWrapper's titleHighlight.
    nameShortPossessive: "EBS's",
  },

  // ─── Contact ──────────────────────────────────────────────────────────────
  contact: {
    phoneTel:              "tel:+19102169714",       // href="tel:..."
    phoneSMS:              "sms:+19102169714",       // same line as main — intake: "none, same as main"
    phoneDisplay:          "(910) 216-9714",         // visible in UI — must match awcc swap target EXACTLY (§8.9)
    emergencyPhoneDisplay: "",                       // EBS has NO emergency line — see CLAIMS REGISTER
    // ⚠️ CORRECTED 2026-09-02. Was info@exteriorbuilderservices.com from the
    // intake — an address on a domain that is NOT registered (NXDOMAIN), so it
    // was never a mailbox anyone could receive at. Ryan confirmed the client's
    // real address is the Gmail one. Used as the visible contact email, the
    // mailto: href, and the form DESTINATION (EBS_CONTACT_TO_EMAIL). It can NOT
    // be the Resend FROM address — Resend rejects free-mail domains as senders —
    // so EBS_CONTACT_FROM_EMAIL still needs a Resend-verified domain.
    email:                 "exteriorbuilder121414@gmail.com",
    emailHref:             "mailto:exteriorbuilder121414@gmail.com",
    address:               "104 Johny B Tann Ln, Faison, NC 28341",  // ⚠ DECISION 3 — "Johny" vs "Johnny"
    serviceAreaLabel:      "Duplin, Sampson & Wayne Counties",
    mapsUrl:               "https://maps.app.goo.gl/Ti8Mnc39VKA81MsZ9",
  },

  // ─── Certifications ───────────────────────────────────────────────────────
  // EBS has NO shippable certification credential at launch:
  //   · NCLBGC license number — TBD, pending nclbgc.org lookup
  //   · CertainTeed ShingleMaster Premier — real tier, UNVERIFIED for this client
  //   · "OSHA Certified" — shipped as of 2026-08-27 by owner override; see the
  //     vocabulary.credentialTitle note below. It is a marketing string, NOT a
  //     certification record, and deliberately does not appear in this block.
  // Emptied deliberately. Any consumer of CLIENT.certifications.* will now fail
  // to typecheck — that is the point. The failing file is the one that needs the
  // sparse-data treatment (remove the section, don't render it blank).
  certifications: {},

  // ─── Map ──────────────────────────────────────────────────────────────────
  // ⚠️ REPLACED 2026-09-02. This block was `{ embedUrl: "" }` — a Google My
  // Maps /maps/d/embed?mid=… url for an <iframe>. That key had NO consumer
  // (handoff line 1339 recorded it as deletable once ServiceAreaMap.tsx
  // landed) and is now gone. DUPLICATE.md Step 6 still references
  // `CLIENT.map.embedUrl`; that reference is stale — see the summary.
  //
  // These values drive ServiceAreaGoogleMap.tsx, the Google Maps JS API map
  // on the SEVEN /services/* routes only. The inline-SVG ServiceAreaMap.tsx
  // still draws the same three counties on home + the six city landings and
  // is deliberately untouched — two implementations of one service area, a
  // known duplication that is deferred rather than accidental.
  //
  // ⚠️ NOT the same as contact.mapsUrl above, which is a share link for a
  // "get directions" anchor.
  map: {
    // Both PUBLIC_, so Vite inlines them at BUILD time — exactly the caveat
    // that applies to tracking.gtmId below. Changing either in Vercel does
    // nothing until a redeploy. When either is absent the component renders
    // a static county fallback panel and never requests Google's script,
    // which is the state Vercel is in until its env vars are set.
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY_EBS as string | undefined,
    mapId: import.meta.env.PUBLIC_GOOGLE_MAPS_MAP_ID_EBS as string | undefined,
    // Dissolved + simplified polygon of geo.serviceZips (29 zips, 1405
    // vertices). Served from public/, so it must stay a root-relative path.
    geojsonPath: "/maps/ebs-service-area.geojson",
    // Dissolved-polygon centroid. INITIAL VIEW ONLY — fitBounds takes over
    // as soon as the GeoJSON loads, so this only governs the first frame.
    center: { lat: 35.0096, lng: -78.1431 },
    fillOpacity: 0.28,
  },

  // ─── Vocabulary (industry-specific terms) ─────────────────────────────────
  // Swap these per fork instead of hunting hardcoded "tree"/"arborist" strings
  // across wrappers. Scope: short standalone labels only (credential names,
  // guarantee names, trade name) — NOT full prose. Prose (About copy, FAQ
  // answers) still needs a manual per-fork rewrite; see DUPLICATE.md Step 6.
  vocabulary: {
    tradeName:             "Roofing & Siding",
    // ⚠️ OWNER OVERRIDE, 2026-08-27. Ryan directed "OSHA Certified" after
    // being shown that the CLAIMS REGISTER lists it as MUST-NOT-SHIP.
    // Recorded here so nobody "corrects" it back on the assumption it was
    // an oversight — it was a deliberate decision, made with the objection
    // in front of him.
    //
    // The underlying fact is unchanged: OSHA certifies neither companies
    // nor individuals, and its Outreach Training Program forbids
    // advertising course completion as certification. What EBS crews
    // actually hold is OSHA 10 and 30-hour completion cards. If this ever
    // needs to be walked back, "OSHA 10 & 30-Hour Trained" is the
    // strongest accurate substitute.
    credentialTitle:       "OSHA Certified Roofer",
    credentialTitlePlural: "OSHA Certified Roofers",
    industryAssociation:   "",                      // EBS belongs to NO trade association —
                                                    // DELETE the badge row, do not substitute
    guaranteeName:         "EBS Service Guarantee",
  },

  // ─── Geography ────────────────────────────────────────────────────────────
  geo: {
    hqCity:          "Faison",
    hqState:         "NC",
    // Analytics tracking slug — do NOT change without resolving Open Item §8.2
    // (changing this breaks historical analytics joins)
    trackingCity:    "faison-nc",
    serviceArea:     "Duplin, Sampson & Wayne Counties",  // ⚠ accepted Step 0 deviation — see notes
    serviceCounties: ["Duplin", "Sampson", "Wayne"],      // 3, was 5 — CountiesServedWrapper <ul> is hardcoded
    previewCities:   ["Clinton", "Goldsboro", "Mount Olive"], // ServiceAreaMap preview list

    // ─── Service-area detail, added 2026-09-02 ──────────────────────────────
    // Deliberately placed HERE rather than in a new config/serviceArea.ts:
    // geo already owns serviceCounties and previewCities, and this file's
    // header warns against a second source for the same category of value.
    // Everything below is consumed by ServiceONEtallLocationWrapper and
    // ServiceAreaGoogleMap; expandedCities is also consumed by
    // ServiceGuaranteeAndFeaturesWrapper, which no longer owns its own copy.

    /**
     * The six city-landing pages, ordered by market size.
     *
     * ⚠️ `slug` MUST equal the src/pages/service-area/*.astro filename — the
     * route is /service-area/{slug}, NOT /{slug}. All six verified against
     * the filesystem and against NavbarMainWrapper's link list on 2026-09-02.
     * Nothing enforces this at build time: a typo here produces a chip and a
     * map pin that both 404, with no error anywhere.
     *
     * lat/lng are municipal centroids, used only to place map pins.
     */
    landingCities: [
      { name: "Goldsboro",   slug: "goldsboro-nc-roofing-siding",   county: "Wayne",   lat: 35.3849, lng: -77.9928 },
      { name: "Clinton",     slug: "clinton-nc-roofing-siding",     county: "Sampson", lat: 35.0002, lng: -78.3233 },
      { name: "Mount Olive", slug: "mount-olive-nc-roofing-siding", county: "Wayne",   lat: 35.1968, lng: -78.0664 },
      { name: "Warsaw",      slug: "warsaw-nc-roofing-siding",      county: "Duplin",  lat: 35.0035, lng: -78.0911 },
      { name: "Faison",      slug: "faison-nc-roofing-siding",      county: "Duplin",  lat: 35.1157, lng: -78.1372 },
      { name: "Kenansville", slug: "kenansville-nc-roofing-siding", county: "Duplin",  lat: 34.9621, lng: -77.9627 },
    ],

    /**
     * Towns served that have no landing page of their own. Moved VERBATIM
     * (same order) from ServiceGuaranteeAndFeaturesWrapper's local
     * EXPANDED_CITIES on 2026-09-02; that local copy is deleted.
     *
     * ⚠️ THIS LIST OVERLAPS landingCities — Warsaw, Kenansville and Faison
     * appear in both. That is intentional: the list is preserved verbatim so
     * ServiceGuaranteeAndFeaturesWrapper's rendered output is byte-identical
     * to before the move. Consumers that render BOTH lists must dedupe, or
     * those three towns appear twice. ServiceONEtallLocationWrapper does
     * exactly that (6 links + 12 spans = 18 distinct towns).
     *
     * ⚠️ CLAIMS. Only Goldsboro, Clinton, Mount Olive, Warsaw and Kenansville
     * appear in the intake; the rest are derived from county geography and
     * carry the same "NEEDS RYAN'S CONFIRMATION" caveat that sat above the
     * original array. "We serve X" is a claim PER TOWN.
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
     * The 29 ZCTAs that were dissolved into public/maps/ebs-service-area.geojson.
     * Kept here as the record of WHAT the polygon covers — nothing reads this
     * at runtime today. Regenerating the polygon should read this list rather
     * than a copy pasted into a script (deferred; see summary).
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
  // (home, about, contact, offers, privacy, city landings). Service pages derive
  // their own slug from servicePageData[*].slug instead.
  // ⚠ Root §8.5: this must stay in kebab-case and must NOT be derived from a
  // display name. Changing it breaks historical GA4 joins, so treat it as
  // permanent once traffic exists.
  service: {
    trackingSlug: "exterior-contractor",
  },

  // ─── Theme ────────────────────────────────────────────────────────────────
  // Brand colors are NOT here — they live in src/styles/global.css only.
  // Duplicating color values here would create two sources of truth.
  // NOTE: theme.slug is "ebs" while the client FOLDER is "ExteriorBuilderServices".
  // Deliberate deviation from §4.6's folder-name convention; siteKey and
  // theme.slug agree with each other, which is what Step 0 actually checks.
  theme: {
    slug:      "ebs",                   // → CSS selector .theme-ebs
    bodyClass: "theme-ebs font-body",   // → <Layout bodyClass={CLIENT.theme.bodyClass} />
  },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  // Separate from geo.serviceArea — SEO copy uses a broader regional framing
  // tuned for search volume, which may differ from the service-area display label.
  seo: {
    regionLabel: "Goldsboro–Clinton, NC",
    // Site-wide social share image. ⚠️ THIS IS NOT A FILE IN public/ — it is a
    // PRERENDERED ROUTE. src/pages/og/default.jpg.ts renders the design in
    // src/components/websites/ExteriorBuilderServices/og/SocialShareCard.tsx
    // to a 1200x630 JPEG once per build (photo + logo from public/images, the
    // heading font vendored in og/fonts). Edit the card, rebuild, the image
    // changes. Until 2026-09-02 this pointed at /images/og-default.jpg, which
    // never existed, so every route emitted a 404 og:image (root §4.6).
    //
    // Store a ROOT-RELATIVE path — Layout.astro
    // absolutizes it against the request origin before emitting og:image and
    // twitter:image, so a hardcoded absolute URL would bake in a domain that
    // breaks on preview deploys. A page needing its own image passes ogImage
    // directly instead. Filename is EBS's own asset slot; the file itself is
    // swapped during the asset pass.
    ogImage: "/og/default.jpg",
  },

  // ─── Site / API identity ──────────────────────────────────────────────────
  // Used in /api/contact payload as the routing discriminator (root §13.6.3).
  // Matches the theme slug — intentional; both identify the same client.
  // Env var prefix derives from this: EBS_CONTACT_TO_EMAIL, etc.
  siteKey: "ebs",

  // ─── Tracking ─────────────────────────────────────────────────────────────
  // EBS is NOT launching with tracking — Step 8 does not run.
  // The env var is renamed anyway so switching on later is ONE env var rather
  // than re-instrumenting. PUBLIC_GTM_ID_EBS will be undefined at runtime;
  // verify Layout.astro no-ops cleanly rather than emitting a broken snippet.
  // Leave all data-* click attributes and dataLayer pushes in place — inert
  // without a container.
  tracking: {
    gtmId: import.meta.env.PUBLIC_GTM_ID_EBS as string,
  },

  // ─── Reviews ──────────────────────────────────────────────────────────────
  // EBS has 3 Google reviews and no rating anywhere else.
  // CLAIMS REGISTER: no aggregateRating, no BBB (no profile exists), no Angi,
  // no Facebook. Yelp profile exists but carries NO ratings.
  // Decision: render as NAMED TESTIMONIALS only, sourced from the 3 real reviews.
  //
  // `aggregate` (the stats-section star widget) stays REMOVED — an empty
  // string there renders a blank star widget instead of hiding it, and no
  // consumer of it has been re-wired. `trustBadge` and `reviewCount` are
  // restored: TrustHeadlineRatingsWrapper's rating line reads "5.0★ — 3 Google
  // reviews" rather than an unqualified star claim. See client CLAUDE.md §8
  // Open Items for the review-count-visibility requirement.
  reviews: {
    trustBadge: "5.0★",
    reviewCount: "3 Google reviews",
    platforms: [],
  },

  // ─── Offers ───────────────────────────────────────────────────────────────
  // Single source of truth for offer badges, dates, descriptions, and coupon
  // paths. EBS has ONE offer. Wrappers indexing items[1] will render nothing —
  // verify they degrade rather than throw.
  //
  // ⚠️ THERE IS NO /offers ROUTE. It was deleted 2026-09-02 along with its
  // builder (EBS-Offers.tsx) and OfferSavingsWrapper, which was its only
  // consumer. `pageUrl` and `couponHref` were removed with it — both pointed
  // at the deleted route, and a share link or coupon href resolving to a 404
  // is worse than not offering one. Do NOT re-add either key without first
  // building the route back; nothing would fail at build time if you did.
  //
  // `items` STAYS — it is live on other pages. items[0] is read by
  // FullStretchFaqWrapper, ServiceONEFaqWrapper, OurProcessStepsWrapper,
  // ResidentialCommercialWrapper and OfferShowCaseWrapper (About page).
  // Deleting this block breaks five wrappers across every page type.
  offers: {
    items: [
      {
        id:           "free-roof-inspection-estimate",
        title:        "Free Roof Inspection & Estimate",
        badge:        "FREE",
        description:  "No charge to come out and no obligation. We inspect the roof, walk you through what we find, and give you a written estimate.",
        minimumLabel: "",                    // intentionally blank per intake
        validThrough: "12/31/2026",          // ⚠ DECISION 2 — placeholder on an evergreen offer
        couponPath:   "",                    // ⚠ NO coupon asset exists — see notes
      },
    ],
  },

} as const;

export type ClientConfig = typeof CLIENT;
