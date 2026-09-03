# Ed's Tree Service fork — session brief for the next chat

Written 2026-09-03 at the end of the session that ran the fork. Paste this into the next chat before doing anything. It records what changed, what was decided, what was verified, and what is still open. The two files it defers to are in this same folder: `CLAUDE.md` (current state, generated per DUPLICATE.md Step 10) and `EdsTreeService_HANDOFF_Step0-Step1.md` (§3 is the CLAIMS REGISTER — read it before writing any copy).

---

## 1. Where things stand

| Item | State |
|---|---|
| Client | **Ed's Tree Service** — Eduardo Jimenez's second company (same owner, phone, inbox, address, counties and Google listing as EBS) |
| Folder / repo | `C:\Users\Ryan Lopez\Documents\EdsTreeService` → GitHub **`nadmaker/EdsTreeService`**, private, branch `main` |
| Commits | `d154fba` Step −1 (export of the EBS repo @ 673bdd7, `.env` excluded) · `3be18b1` Steps 1–7, 9, 10 (everything below). Both pushed. |
| Identity | folder `EdsTreeService`, `siteKey` **`edstree`**, `theme.slug` `edstree`, class `theme-edstree`, env prefix `EDSTREE_` |
| Fork source | The EBS repo, by `git archive HEAD` — NOT `nadmaker/Frame-sites` (stale; backport still owed) |
| Build | `npm run build` and `npx tsc --noEmit` pass |
| Sweep | Dev-server sweep 2026-09-03: all 14 HTML routes 200 at 212–300 KB; `/offers`, old roofing and old city slugs 404; `/og/default.jpg` 200 at 65 KB; favicon, geojson, every referenced image 200; zero duplicate ids; zero previous-client or banned terms in served HTML |
| Deployment | **NOT deployed.** No Vercel project exists yet (§5 below) |
| Tracking | Step 8 skipped by decision. No GTM container, GA4 or Ads. All `data-*` inert. Renames are free until a container exists |
| Photos | **Every photograph, both logo variants and the favicon are GENERATED PLACEHOLDERS** (`scripts/placeholders.mjs`). Ryan supplies the real files |
| `.env` | NOT committed on this repo (root §13.8.5 applies; EBS's owner override was EBS-only). A local `.env` was created from `.env.example` and is gitignored |

Also touched outside this repo:
- **EBS repo** (`Documents/ExteriorBuilderServices`): commit `673bdd7` "regenerate INTAKE_TEMPLATE.csv as v2 (110 rows)" + the root CLAUDE.md count fix, on branch **`feat/ebs-section-redesign`**, **not pushed and not on `main`**. The other session's uncommitted `Landing1-HeroWrapper.tsx` edit was left alone and did NOT travel into the fork.
- Memory notes for this project were updated (fork done, tooling lessons).

---

## 2. Everything that changed in this chat, in order

### 2.1 Intake and claims (before the fork)
- Reviewed the July `INTAKE_TEMPLATE.csv` (76 rows) against the EBS build; found a stale `map.embedUrl` pointer, a wrong guarantee pointer, a video-hero assumption, and four rows the EBS intake had grown that the template lacked. Wrote **v2 (110 rows)** with a 13-row Claims block, landing-cities-with-county, other towns, ZIPs, per-route hero photos, gallery/logo/favicon rows, process/why-us/testimonial rows, form-option rows, heading vs body font, folder slug. Committed to the EBS repo as `673bdd7`.
- Ryan's questionnaire came back in a 5-column layout; it was normalised back to the six-column template shape as **`EdsTreeService-INTAKE.csv`** (111 rows — a "Free estimates?" row was added by hand; the template still lacks it). 15 rows remain OPEN.
- Step 0: passed after `ed'sTree` / `Ed's-Tree` were corrected to `edstree`; sender domain unanswered (same blocker as EBS).
- Wrote **`EdsTreeService_HANDOFF_Step0-Step1.md`** in the EBS handoff shape: §1 decisions, §2 values decided outside the intake, §3 CLAIMS REGISTER (Cleared / MUST NOT SHIP / UNVERIFIED CAPABILITIES / OPERATIONS CLAIMS), §4 deviations from EBS, §5 Step 0 pre-check + open decisions, §6 style-guide reconciliation, §7 draft copy seeds, §8 surfaces to strip, §9 fork status.
- Style guide received (titled "Guzman Brothers", Ryan confirmed it is Ed's): tokens and rules adopted; its example strings ("Certified Arborists", "Emergency Storm Damage Removal", the "emergency/24-7 banner", the Triangle market) refused as claims. Recorded in handoff §6.

### 2.2 Owner decisions (2026-09-03), all recorded where the value lives
1. Same-day tree removal CLEARED; hours **8 AM–7 PM every day** CLEARED (raised as a response-time concern first, Ryan reaffirmed). Still NO emergency line — "24/7", "emergency", "after-hours" stay banned.
2. NO free tree removal (offer struck). One offer remains: **10% Off Your First Tree Service** (no expiry yet).
3. NO licence, NO certification — "Licensed", "Certified", "Arborist", ISA, TCIA are MUST NOT SHIP.
4. Copy built around: bonded & insured, family-owned, locally owned, since 2006, 1000+ served.
5. NO reviews or ratings anywhere — reviews carousel, hero Google badge and /about ratings block REMOVED.
6. 2006 and "1000+" CONFIRMED for the tree business.
7. Maps link stays EBS's until Ryan updates it manually.
8. Free estimates CONFIRMED (surfaced by review; every "Get a Free Estimate" CTA depends on it).

### 2.3 Step −1 (repo)
- `mkdir EdsTreeService`; `git archive --format=tar HEAD | tar -x` from the EBS repo at 673bdd7 (222 files = 223 tracked minus `.env`); nesting guard passed; `.env` deleted; `npm ci`; `git init -b main`; commit; `gh repo create EdsTreeService --private --source=. --push`.

### 2.4 Steps 1 / 1.5 / 4 (structure)
- `src/components/websites/ExteriorBuilderServices/` → `EdsTreeService/`; original deleted; EBS handoff docs, asset map and intake removed from the copy; new intake + handoff dropped in; builders renamed `EdsTree-Home/About/Contact/Privacy.tsx`.
- Encoding sweep: 57 files, 1 curly-quote fix (ActionHeroHeader), 0 mojibake.
- Import paths rewritten in 56 files; every `--ebs-*` CSS variable and the two keyframes renamed to `--site-*` / `site-*` across `src/`.

### 2.5 Step 2 — `config/client.config.ts` (rewritten)
`business` (Ed's / Ed's Tree Service / nameLegal same, form OPEN / 2006 / owner / possessive "Ed's" / NEW `hoursDisplay` / siteUrl `https://eds-tree-service.vercel.app` as an assumption) · `contact` (same phone, SMS, inbox, address, label, Maps link as EBS; emergency "") · `certifications: {}` · `map` (EDSTREE env names; `geojsonPath /maps/edstree-service-area.geojson`) · `vocabulary` (tradeName "Tree Service"; credentialTitle/plural/industryAssociation ""; guaranteeName "Ed's Service Guarantee") · `geo` (same counties, preview cities, 15 expanded towns, 29 ZIPs; landingCities slugs `{city}-nc-tree-service`) · `service.trackingSlug "tree-service"` · `theme edstree` · `seo.regionLabel "Goldsboro–Clinton, NC"` · `siteKey "edstree"` · `tracking PUBLIC_GTM_ID_EDSTREE` · `reviews` all empty · `offers.items` = the one 10% offer, `validThrough ""`, `couponPath ""`.

### 2.6 Step 3 — `src/styles/global.css` (rewritten)
- `body.theme-edstree`: primary `#187A26`, hover `#14651F`, secondary (amber) `#E68E1C`, secondary-hover `#D28017`, tertiary `#59755D` (guide's fallback, only because wrappers consume the slot), tones, brand-50…700 green ramp, background `#EDFAEF`, text `#0B240E`, **`--color-brand-secondary-text` → primary green** (guide forbids amber text), amber-foil stops, concrete/crease textures under `--site-*` names, Public Sans body / Zilla Slab headings.
- All eleven `theme-medranos` blocks and the `theme-ebs` block deleted; shingle tokens deleted (no consumer). `html:has(body.theme-edstree)` clearance block and the two keyframes kept under the new names. Six scoped `[data-section="contact-form"]` rules re-derived for the green palette.
- `Layout.astro`: Google Fonts link → Public Sans 400;500;600 + Zilla Slab 600;700.
- Measured (matches the guide's own audit): white on primary 5.45, on hover 7.21, primary on bg 5.07, text on bg 15.34, amber on bg 2.37 and white on amber 2.55 → amber is fills-only with dark labels.

### 2.7 Step 5 — assets
- Deleted: all `public/images/ebs-*`, `offer-1.jpg`, `review-avatar-2.png`, `step-5--followup.png`, `favicon.svg`, `videos/ebs-hero.mp4`, `public/logos/{isa,tcia,bbb,angi}.svg`. Geojson renamed `edstree-service-area.geojson` (name properties rewritten).
- Vendored `og/fonts/ZillaSlab-Bold.ttf` + `ZillaSlab-SemiBold.ttf` + OFL (from google/fonts); Barlow removed.
- NEW **`scripts/placeholders.mjs`** (Satori → resvg → sharp): 3 hero slides, 4 service heroes, 6 city heroes, 6 gallery images, `edstree-logo.png`, `edstree-logo-white.png`, `public/favicon.png`. Run from the repo root; rerunning overwrites.

### 2.8 Step 6 — content (scripted, asserted literal replacements)
- **Data:** `servicePageData.tsx` → four entries (tree-removal, tree-trimming, stump-grinding, storm-clean-up), `SHARED_BENEFITS/SHARED_PROCESS` deleted; `cityLandingData.tsx` → six entries with `{city}-nc-tree-service` slugs and six distinct description structures.
- **Routes:** `services/` → the four tree routes (three deleted, four renamed/re-keyed); `service-area/` six files renamed; one-off `.astro` descriptions rewritten; `contact.astro`'s stale EBS comment replaced.
- **Icons:** `serviceIcons.tsx` → IconTreeRemoval / IconTreeTrimming / IconStumpGrinding / IconStormCleanUp / IconOther, keyed by the new slugs.
- **Wrappers edited:** NavbarMainWrapper (MENU, logo, alt from config, amber call buttons → dark labels, hamburger → primary, mobile bottom bar → dark label, **overlay always-mounted** with translate + pointer-events-none + inert), FooterSection (links, logo, tagline, "Reviews" link removed, CTA copy, "within 24 hours" removed), HeroWrapper (slides, headline "Same-day tree removal, done safely", caption, CTA "Get a Free Estimate"), ServicesGridSectionWrapper (four cards, title, caption uses `nameShortPossessive`), ContactFormWrapper / ContactRailFormWrapper / LandingContactForm (four services + Other; **property_type removed** from the rail form), LandingServicesListWrapper, AboutUsVariant1 (images, Mission/Vision prose, alts), ActionHeroHeader, ContactHeroHeader, ContactInfoColumnWrapper, BusinessStatisticsWrapper, CenteredCopyAreaWrapper, CredentialBandWrapper (claims list, white wordmark, CLIENT import added), FullStretchFaqWrapper (six Q&As incl. hours), ServiceONEFaqWrapper (five tree Q&As), InfoImageColumnWrapper, Landing1-HeroWrapper default, OfferShowCaseWrapper (images, slide 2 self-link → `/contact` estimate, slide 3 copy), OurProcessStepsWrapper (intro, steps, supporting line), PortfolioGalleryWrapper (six placeholders), ResidentialCommercialWrapper (pills, titles, four paragraphs), ServiceGuaranteeAndFeaturesWrapper (four tiles → Same-Day Removal / Free Estimates / Our Own Crews / Bonded & Insured), ServicePageBLDR (capabilities + assurance chips), ServiceONEProcessAccordionWrapper (step 3 title/body, step 4 body), serviceOnecaption-photoWrapper (defaults were the template's original Medrano copy — rewritten), TallServicesBenefitsCards (`"use client"` dropped, description, three cards), TrustBadgesWrapper (LICENSED → BONDED; `EBS_TRUST_BADGES` → `TRUST_BADGES`), ReviewsCarouselWrapper (REVIEWS emptied — it held the template client's customers — and returns null when empty), TrustHeadlineRatingsWrapper (orphan description).
- **Builders:** Home — reviews section + import removed; About — ratings section + import removed; Contact — inline copy gets `formId="contact-page-form-inline"` (root §10.6).
- **og card:** `SocialShareCard.tsx` colours mirror the new theme, strap "REMOVAL | TRIMMING | CLEANUP" at 64px, Zilla Slab; `renderSocialShareCard.ts` reads `edstree-hero-1.jpg`, `edstree-logo.png`, `ZillaSlab-Bold.ttf`.
- **Deleted orphans:** AssociationBadgeAreasslotterWrapper, CertifiedArboristsWrapper, ContactInfoFormWrapper, CountiesServedWrapper, ReviewsWidgetEmbedWrapper, TitleHeadingBlock.

### 2.9 Step 7 — env
- `.env.example` rewritten with the `EDSTREE_` names and a note that `.env` is not committed; `src/lib/clientRegistry.ts` entry `edstree: { businessName: "Ed's Tree Service" }`.

### 2.10 Docs
- Root `CLAUDE.md` §1: this repo's client and fork source updated. `DUPLICATE.md` Step 10 skeleton pointer → `EdsTreeService/CLAUDE.md`.
- Client `CLAUDE.md` regenerated (§1–§9), from the committed files and the sweep. Handoff §9 rewritten as fork status.

---

## 3. Verified during the fork (do not re-derive)

- Contrast table above; four-column services grid now holds four cards + the CTA tile (layout not eyeballed — see §4).
- `contact-form` appearing on every route in a `data-section` grep is the inlined global.css selector text, not a section. On city landings it IS LandingContactForm's real section name, which collides with the home form's name (open item 8.4.8 in the client CLAUDE.md).
- Only two image preloads on the home page (hero slide 1 + logo).

---

## 4. Open items, in priority order (full list: client CLAUDE.md §8)

1. **Deploy** — see §5. Nothing else can be checked in production until this is done.
2. **Photos, logo, favicon** — all placeholders. Same-name file drops; then `npm run build` re-renders the og card.
3. **Email** — no Resend key, no verified sending domain, no domain at all. Same blocker as EBS 8.1.1/8.1.2.
4. **Google Maps** — extend the owner's existing key's referrer list to the new origin (or issue a new key), pick/clone the Map ID, set `PUBLIC_GOOGLE_MAPS_API_KEY_EDSTREE` / `_MAP_ID_EDSTREE` in Vercel, redeploy. Until then the service-page map is the fallback panel.
5. **Owner answers:** legal entity form; "every day" = 7 days?; capabilities list (crane, land clearing, tree health, cabling, firewood, commercial contracts — all UNVERIFIED, none on the site); offer expiry; guarantee terms; whether Ed's gets its own Google listing and number (two listings on one phone/address is a GBP risk).
6. **Draft copy needs owner sign-off:** FAQs, process steps, why-us cards, stats, hero headline, service one-liners, city descriptions (all cleared-claims-only).
7. **Code hygiene (new):** services grid tile balance; hours shown only in the /about FAQ; landing form section name collides with `contact-form`; many wrapper comments still narrate EBS decisions (comments only).
8. **Inherited, still true:** RightRail form sends the kebab slug as `service_type`; ContactFormWrapper uses `getElementById`; city landings have no `<h1>`; 768–1024 overflow band; two map implementations; `hero-offers` misnamed; `service-contact-form` has no observer.
9. **Template-level:** backport shared files to Frame-sites; reconcile DUPLICATE.md Step −1 with root §1 and the git-archive method (its Steps 1/4/6 still say MedranosINC and `CLIENT.map.embedUrl`); add a "Free estimates?" row to INTAKE_TEMPLATE.csv; push/merge EBS's `673bdd7` to `main`.

---

## 5. Deploy runbook (next manual step)

1. Vercel → Add New → Project → `nadmaker/EdsTreeService` → name **`eds-tree-service`** (what `CLIENT.business.siteUrl` assumes; change the config if the name differs) → preset Astro, root `./`, production branch `main`.
2. **Delete every empty env row Vercel auto-detects from `.env.example` before deploying** — an empty dashboard `PUBLIC_*` value overrides the build (this blanked the EBS map).
3. Deploy. Then root §11.8's status-AND-bytes sweep on the live URL, fetch `/og/default.jpg` and `/favicon.png`, and grep the served JS chunks (not the HTML) on a SERVICE page for the Maps key once it is set.
4. Enter the five runtime values (`RESEND_API_KEY`, `EDSTREE_CONTACT_TO/FROM/BCC_EMAIL`, `DEFAULT_SITE_KEY=edstree`) in the dashboard when they exist, then redeploy.
5. Hobby is public and crawlable; previews 401 to crawlers; move to Pro before handover.

---

## 6. How to work in the next session

- Same rules as before: stage by explicit path in the EBS checkout (another session may be live there); in the EdsTreeService repo nothing else is running. Verify the probe before reporting a failure. Owner overrides are recorded where the value lives, dated, with the objection. Plan-mode defaults per root §11; content substitutions are accept-mode.
- **Tooling lessons from this session, all cost time:**
  - Some files are **CRLF** (the four builders, the og card) while most are LF — normalise before any literal multi-line match and restore on write. `grep -rlI $'\r' src` lists them.
  - A comment-stripped read of a file hides comment lines INSIDE a block; read the raw lines before composing an exact-match replacement.
  - The Bash tool truncates commands past roughly 8 KB — write big files with the Write tool to a NEW path, then `cp` into place (Write/Edit refuse a path not previously Read).
  - Never pipe a dev server into `head`; it kills the server when `head` exits. Log to a file.
  - `tsc --noEmit` needs Astro's generated `.astro/types.d.ts` — run a build (or `astro sync`) first on a fresh checkout, or every `import.meta.env` reads as an error.
  - The sweep that worked: start `npx astro dev --port 4399 --host 127.0.0.1 > log 2>&1` in the background, then curl each route for status + bytes + `<title>`, the must-404 set, the assets, duplicate ids, and a case-insensitive grep of the concatenated HTML for previous-client names and banned terms.

---

## 7. Suggested opening for the next chat

> Continuing the Ed's Tree Service fork (repo `C:\Users\Ryan Lopez\Documents\EdsTreeService`, GitHub `nadmaker/EdsTreeService`, main @ 3be18b1). Read, in this order: `src/components/websites/EdsTreeService/EdsTreeService_HANDOFF_Session-2026-09-03.md` (this brief), `EdsTreeService_HANDOFF_Log.md` §6 (open items) and its last §1 entry, the client `CLAUDE.md`, and the Step0-Step1 handoff's §3 claims register. The fork is complete through DUPLICATE.md Step 10 and verified locally; it is not deployed. LOG EVERY BIG CHANGE as a dated `###` entry under §1 of `EdsTreeService_HANDOFF_Log.md` as you go (what was true before, what is true now, what was measured), update its §6 and the client CLAUDE.md §8 together in the same commit, and write a new dated session brief at the end. Today's task: ______ (deploy to Vercel per §5 / swap in the real photos / apply the owner's answers to §4.5 / …).
