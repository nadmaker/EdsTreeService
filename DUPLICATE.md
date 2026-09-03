# DUPLICATE — New Client Fork Checklist

Operational step-by-step for standing up a new client on this template.
**Methodology context:** root `CLAUDE.md` (architecture, conventions) and `src/components/websites/MedranosINC/CLAUDE.md §9` (what changes per fork, validation steps).
This file covers the sequenced "what to do." Those files cover the "why."

---

## Step -1 — Create the repo (local + GitHub)

Windows/PowerShell, since that's the working environment. This happens before "Before you start" — the fork doesn't have a repo yet.

1. From the folder that holds all repos, copy the whole template folder to `{NewClient}`.
2. **CRITICAL nesting guard** — before deleting anything, run `Get-ChildItem` in the new `{NewClient}` folder and confirm `src/`, `public/`, and `tracking/` are at the TOP level. If the copy nested the template one level down (a `{NewClient}\Frame-sites\` folder appears and the top level has no `src/`), the copy landed wrong — fix that before proceeding. Deleting a "stray" nested folder without checking is how you delete the actual site (root CLAUDE.md §13.10.6).
3. Remove the disposable/machine-specific directories that came along in the copy: `.git`, `node_modules`, `dist`, `.vercel`. These are correctly gitignored and never committed — this just clears the previous project's history and build artifacts before the folder becomes its own repo.
4. Run `npm install` to rebuild dependencies for this machine. Skipping this is why `npm run dev` fails with "astro is not recognized."
5. `git init`, `git add .`, initial commit.
6. `gh repo create {NewClient} --private --source=. --push` to create and push the private GitHub repo.
7. Open the folder in the editor.

Step 1 below (the client-folder copy inside `src/components/websites/`) happens INSIDE this new repo, once it exists.

---

## Before you start

- [ ] Copy `INTAKE_TEMPLATE.csv`, complete it with the client, and run Step 0 validation
- [ ] New Vercel project created
- [ ] Resend sender domain ready (client's own domain with DNS access, or use the template's sending domain — see Step 0 rule (g))
- [ ] GTM container created, if this client launches with tracking (Step 8)

Placeholder below: `{NewClient}` = the folder-slug for the new client (e.g. `SmithHVAC`). The completed intake copy lives at `src/components/websites/{NewClient}/{NewClient}-INTAKE.csv` so Step 10's generation step can read it.

**A sparse or incomplete intake is normal, not a blocker for the whole fork.** A small local-business client realistically arrives with no reviews yet, no certifications, no license number, no logo or photos, no domain, a TBD email, and no tracking setup. Step 0's rules only check format correctness (phone digits, siteKey shape, etc.) — they don't require completeness. A missing logo/hero-image/coupon asset blocks Step 5 specifically (a fork can't finish swapping assets it doesn't have); missing GTM/Ads credentials block Step 8 specifically. Every other step proceeds unaffected by gaps elsewhere in the intake. Track unanswered fields as Open Items in the generated client-scoped `CLAUDE.md` (Step 10) rather than inventing placeholder values — see "Forking for a sparse-data client" after Step 6 for what to do with the specific config fields (reviews, ratings, certifications, map) that go empty.

---

## Step 0 — Validate the intake

Before touching any files, the fork starts from a completed copy of `INTAKE_TEMPLATE.csv` (repo root). Do not proceed to Step 1 until the completed intake passes these rules:

- [ ] **Phone digit consistency** — the digits in `phoneTel` (E.164), `phoneDisplay`, and `phoneSMS` must be IDENTICAL. A digit mismatch between formats is a build-blocking error — fix it in the intake before continuing.
- [ ] **E.164 format** — `phoneTel` must match `+1XXXXXXXXXX` exactly.
- [ ] **No blanks on permanent fields** — `trackingCity` slug, `siteKey`, and `theme.slug` must not be blank. These are expensive to change post-launch.
- [ ] **siteKey / theme.slug format and correspondence** — `siteKey` = lowercase letters, digits, and underscores; must NOT start with a digit; no hyphens (see Step 7). A client whose name starts with a digit takes a letter prefix — e.g. client `7AC12` → siteKey `a7ac12` — while the display/business name stays unprefixed (`7AC12`). `theme.slug` = lowercase letters, digits, and hyphens; same client, matching `siteKey` aside from the digit prefix.
- [ ] **hqState is a 2-letter abbreviation.**
- [ ] **serviceAreaLabel is a display label, not a city list** — e.g. `"Charlotte–Concord"`, not `"Charlotte, Concord, Huntersville"`.
- [ ] **Sender email domain is Resend-verifiable** — free-mail domains (`gmail.com`, etc.) cannot be Resend FROM addresses. If the client has no domain of their own, use the template's own sending domain.
- [ ] **At least one offer, or an explicit opt-out** — the intake lists at least one real offer, or explicitly states "no offers surface." If opting out, Step 6 must document removing/hiding the offers page, the hero offer cards, and any coupon assets.

Any failed rule blocks the fork. Fix the intake, not the code.

---

## Step 1 — Copy the client folder, then delete the previous client's

```
src/components/websites/MedranosINC/ → src/components/websites/{NewClient}/
```

Copy the entire folder, then verify `src/components/websites/{NewClient}/` and its `pages/`, `sections/`, and `config/` subfolders landed correctly before deleting anything — same nesting-guard principle as Step -1, just one directory deeper.

Then **delete `src/components/websites/MedranosINC/`** from this fork. The reference implementation lives in the FRAME-SITES template repo — not in descendant client repos. A fork that keeps the previous client's folder is carrying dead code and doubles the "no old client values visible" grep surface in Step 9.

**Expect a broken build between this step and Step 4.** Every `.astro` route file under `src/pages/` hardcodes an import path containing `components/websites/MedranosINC/`. Once that folder is deleted, every route fails to resolve (`FailedToLoadModuleSSR`, HTTP 500) until Step 4 rewrites those import paths. This is normal — don't stop to debug a 500 in between; proceed to Step 1.5 and Step 4 before expecting the dev server to run cleanly. The dependency order that works in practice: Step 1 → Step 1.5 → Step 4 (import paths) → Step 2 → Step 3 → Step 6.

The copied folder contains:
- `config/client.config.ts` — edit this in Step 2
- `pages/` — page builders; rename files in Step 6
- `sections/` — wrappers; update content in Step 6
- `CLAUDE.md` — placeholder; generated at the end of the fork (Step 10)

---

## Step 1.5 — Encoding sweep (run before anything else)

Immediately after copying the client folder, run both PowerShell scripts below on the new folder before making any edits or running the dev server. Skipping this step causes esbuild JSX parse errors on first load.

**Why:** Copied files from prior clients or AI-generated content contain curly/smart quotes (U+201C/U+201D) and Mojibake em dashes that break JSX string parsing. Order matters — curly quote sweep must run first.

```powershell
# Step 1 — Curly/smart quote sweep
$dir = "C:\path\to\src\components\websites\{NewClient}"
$files = Get-ChildItem -Path $dir -Recurse -Include "*.tsx","*.ts","*.astro"
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $fixed = $content.Replace([char]0x201C, '"').Replace([char]0x201D, '"').Replace([char]0x2018, "'").Replace([char]0x2019, "'")
    if ($fixed -ne $content) {
        [System.IO.File]::WriteAllText($f.FullName, $fixed, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed curly quotes: $($f.Name)"
    }
}

# Step 2 — Mojibake em dash sweep (run AFTER curly quote sweep)
$brokenEmDash  = [string]([char]0x00E2) + [string]([char]0x20AC) + [string]([char]0x0022)
$brokenBoxDraw = [string]([char]0x00E2) + [string]([char]0x0022) + [string]([char]0x20AC)
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $fixed = $content.Replace($brokenEmDash, [string]([char]0x2014)).Replace($brokenBoxDraw, [string]([char]0x2500))
    if ($fixed -ne $content) {
        [System.IO.File]::WriteAllText($f.FullName, $fixed, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed Mojibake: $($f.Name)"
    }
}
```

---

## Step 2 — Update `client.config.ts`

File: `src/components/websites/{NewClient}/config/client.config.ts`

Replace every value in the config. Fields grouped by block:

### `business`
| Field | What to change |
|-------|---------------|
| `nameShort` | Short marketing name ("Smith's") |
| `name` | Full marketing name ("Smith's HVAC") |
| `nameLegal` | Legal entity name ("Smith's HVAC LLC") |
| `yearFounded` | Year the business was founded |
| `siteUrl` | Production URL (no trailing slash) |
| `owner` | Owner's full name |

### `contact`
| Field | What to change |
|-------|---------------|
| `phoneTel` | `tel:+1XXXXXXXXXX` in E.164 |
| `phoneSMS` | `sms:+1XXXXXXXXXX` in E.164 |
| `phoneDisplay` | Human-readable display ("XXX-XXX-XXXX") |
| `emergencyPhoneDisplay` | Emergency/after-hours display; leave blank if not applicable |
| `email` | Contact email address |
| `emailHref` | `mailto:...` for the contact email |
| `address` | Full street address |
| `serviceAreaLabel` | Display string for service area (used in UI) |
| `mapsUrl` | Google Maps search URL for the business |

### `certifications`
Update or remove certification fields. Add new ones as needed for the industry vertical.

### `vocabulary`
| Field | What to change |
|-------|---------------|
| `tradeName` | The trade descriptor used in headlines/taglines (e.g. "HVAC Service", "Plumbing Service") |
| `credentialTitle` | Full credential phrase, singular (e.g. "NATE-Certified Technician", "Licensed Master Plumber") |
| `credentialTitlePlural` | Plural form of the above — stored separately rather than derived, since pluralization isn't always a simple `+s` |
| `industryAssociation` | Name of the trade association whose logo appears in the badges section |
| `guaranteeName` | The branded guarantee name used across the guarantee/process/service-area sections (e.g. "Comfort Guarantee") |

**Scope note:** these tokens cover short, standalone labels only — credential names, guarantee names, the trade name itself. They do **not** cover full prose (About-page story copy, FAQ answers, capability paragraphs, reviews). That content still needs a manual rewrite per fork — see Step 6 below. Icon components (e.g. the tree icon in `InfoImageColumnWrapper`) are also not config-driven; swap those via the Subframe theme tab (root CLAUDE.md §5.4), not `client.config.ts`.

**Set this expectation before moving on:** once this step is done, headings and short labels across the site will already reflect the new client — that's the vocabulary tokens working. Every paragraph, FAQ answer, and description will still show the previous client's content until Step 6's full-prose rewrite happens. That gap between "labels updated" and "prose still stale" looks like a bug partway through the fork. It isn't — it's the expected midpoint state.

### `geo`
| Field | What to change |
|-------|---------------|
| `hqCity` | Primary business city |
| `hqState` | State abbreviation |
| `trackingCity` | Kebab-case analytics slug (e.g. `charlotte-nc`) — **do not change after launch without analytics plan** |
| `serviceArea` | Display-facing region label (e.g. `Charlotte–Concord`) |
| `serviceCounties` | Array of county names served |
| `previewCities` | 3 primary cities shown in the service area widget |

### `theme`
| Field | What to change |
|-------|---------------|
| `slug` | Client slug matching the CSS class (`smith-hvac`) |
| `bodyClass` | `"theme-{slug} font-body"` — must match the CSS block you add in Step 3 |

### `seo`
| Field | What to change |
|-------|---------------|
| `regionLabel` | Broader regional framing for SEO copy (may differ from `geo.serviceArea`) |

### `siteKey`
Change to the client slug string. Must match the `theme.slug`. Used as the routing discriminator in `/api/contact`.

### `tracking`
Change the env var name from `PUBLIC_GTM_ID_MEDRANOS` to `PUBLIC_GTM_ID_{CLIENT}`:
```ts
tracking: {
  gtmId: import.meta.env.PUBLIC_GTM_ID_{CLIENT} as string,
},
```

### `reviews`
| Field | What to change |
|-------|---------------|
| `aggregate.stars` | Overall star rating display string (e.g. `"4.9★"`) |
| `aggregate.label` | Label under the aggregate rating (e.g. `"Average Rating"`) |
| `trustBadge` | Short trust-badge string shown near ratings (e.g. `"5/5 Rating"`) |
| `platforms` | Replace all review platform data with the new client's ratings. Remove platforms the client isn't listed on; add new ones as needed. |

### `offers`
| Field | What to change |
|-------|---------------|
| `pageUrl` | Production URL of the offers page (e.g. `https://newclient.com/offers`) |
| `couponHref` | Shared print-trigger link used by hero offer card CTAs (e.g. `/offers?action=print`) |
| `items` | Replace all offer items with the new client's current promotions. Each item needs: `id`, `title`, `badge`, `description`, `minimumLabel`, `validThrough`, `couponPath`. Set `couponPath` to match the files you'll add in Step 5. |

---

## Step 3 — Update `src/styles/global.css`

Find the `body.theme-medranos { ... }` block. Copy it and rename the selector:

```css
body.theme-{slug} {
  /* replace every value below with the new client's brand */
  --color-brand-primary: rgb(...);
  --color-brand-primary-hover: rgb(...);
  --color-brand-secondary: rgb(...);
  --color-default-background: rgb(...);   /* C2 pattern — root §4.5 */
  --color-default-font: rgb(...);         /* C2 pattern — root §4.5 */
  /* keep or remove --color-subheading-text depending on whether wrappers use it */
  --font-body: "YourFont", ui-sans-serif, system-ui, ...;
  --font-heading-1: "YourFont", ui-sans-serif, system-ui, ...;
  --font-heading-2: "YourFont", ui-sans-serif, system-ui, ...;
  --font-heading-3: "YourFont", ui-sans-serif, system-ui, ...;
}
```

Leave the `body.theme-medranos` block intact. Do not edit it.

If the new client uses a Google Font, add the `<link>` to `src/layouts/Layout.astro` (there's a placeholder comment in the `<head>`).

---

## Step 4 — Update import paths in `src/pages/`

This step is what fixes the broken build flagged in Step 1 — every route 500s until these imports are rewritten. Do it right after Step 1.5, before Step 2 and Step 3, so the dev server has a working baseline to smoke-test against sooner.

Two kinds of imports need updating in every `.astro` file under `src/pages/`:

**Page builder import** — points to the page builder file:
```ts
// Before:
import HomePage from "../components/websites/MedranosINC/pages/Medranos-Home";
// After:
import HomePage from "../components/websites/{NewClient}/pages/{Client}-Home";
```

**CLIENT config import** — present in every route file:
```ts
// Before:
import { CLIENT } from "../components/websites/MedranosINC/config/client.config";
// After:
import { CLIENT } from "../components/websites/{NewClient}/config/client.config";
```

**Fastest approach:** global find-and-replace `MedranosINC` → `{NewClient}` scoped to `src/pages/`. Then verify each route file's import resolved to the new builder file name after the rename in Step 6.

---

## Step 5 — Swap public assets

Replace these assets in `public/`. Keep the same filenames if the wrappers reference them by path — otherwise update the `CLIENT` config or wrapper constants.

| Asset | Path | Notes |
|-------|------|-------|
| Favicon | `public/favicon.png`, `public/favicon.svg` | Both sizes |
| Logo files | `public/logos/` | Check wrapper import paths |
| Hero image (mobile) | `public/images/hero-mobile-bg.jpg` | HeroWrapper fallback |
| Hero poster | `public/images/hero-poster.jpg` | Video preload poster |
| Hero video | `public/videos/hero.mp4` | Desktop hero background |
| Service area image | `public/images/service-area-mobile-top.jpg` | ServiceAreaWrapper |
| Coupon images/PDFs | `public/coupons/` | Filenames must match `CLIENT.offers.items[*].couponPath` |

If the new client doesn't have a hero video, update `HeroWrapper.tsx` to use an image on desktop as well.

**A missing asset blocks only this step, not the whole fork.** Unlike most steps, Step 5 doesn't fail cleanly when an input is missing — a client who hasn't supplied a logo, hero image, or coupon files leaves this step indefinitely incomplete while every other step proceeds normally. Track every TBD asset as a named Open Item in the generated client-scoped `CLAUDE.md` (Step 10) rather than leaving it as a silent gap.

**Missing-logo failure modes are asymmetric — a stale logo is not the same failure as a broken one.** `NavbarMainWrapper.tsx`'s logo path (`logoUrl`) is a hardcoded local constant with no error handling: if the new client's logo file isn't actually swapped in at the same path, the navbar keeps rendering the *previous* client's logo — wrong, but visibly wrong, easy to catch on a smoke test. `FooterSection.tsx`'s logo, by contrast, is passed through `FooterWrapper.tsx`, which wraps the `<img>` in an `onError` handler that sets `display: none` on load failure — if the footer logo path doesn't resolve, it disappears silently with no visual error to notice. When verifying Step 5, don't just confirm the navbar logo looks right; confirm the footer logo is actually present, not just gracefully absent.

---

## Step 6 — Update page content and rename builders

**This step is too large to run as one pass.** In practice it splits cleanly into four sessions, each ending at a working build as a checkpoint before moving to the next:
- **6a — structure:** rename the page builders, fix internal `MedranosINC` imports, register the new client in `clientRegistry.ts`, remove any client-specific sections identified below.
- **6b — data + routes:** `servicePageData.tsx`, `cityLandingData.tsx`, create/delete the corresponding `.astro` route files.
- **6c — prose:** about-page and about-us story copy, FAQ questions/answers, guarantee copy, hero headlines/subheadlines, footer tagline, internal links (navbar/footer).
- **6d — per-route SEO:** the `seo` object in every route file under `src/pages/`.

Plan for four sessions rather than trying to clear the whole step in one sitting.

**Before editing content in any wrapper's default prop values, verify that value is actually what renders.** Check (a) whether the page builder that composes the wrapper passes an override for that prop, and (b) whether the value is a module-level export at all, and if so, whether anything imports it. This template has hit both failure modes: a wrapper default that's always overridden by the composing builder (`serviceOnecaption-photoWrapper.tsx`'s `headline`/`paragraph` defaults, always overridden by `ServicePageBLDR.tsx`'s `page.captionTitle`/`page.captionDescription`), and an exported array with no consumers at all (`SHARED_BENEFITS`/`SHARED_PROCESS`, below). Editing an unreachable default produces a correct-looking diff with zero rendered effect — root CLAUDE.md §13.3.8.

### Rename page builder files

Rename the five one-off builders in `src/components/websites/{NewClient}/pages/` to match the new client:

```
Medranos-Home.tsx    → {Client}-Home.tsx
Medranos-About.tsx   → {Client}-About.tsx
Medranos-Contact.tsx → {Client}-Contact.tsx
Medranos-Offers.tsx  → {Client}-Offers.tsx
Medranos-Privacy.tsx → {Client}-Privacy.tsx
```

Update the import in each `src/pages/*.astro` route file to match the new filename.

### Fix internal `@/components/websites/MedranosINC/...` imports

Inside the copied `{NewClient}/` folder, any file that imports using the absolute alias path still points to `MedranosINC`. Do a global find-and-replace:

```
@/components/websites/MedranosINC/ → @/components/websites/{NewClient}/
```

Scope to `src/components/websites/{NewClient}/`.

### Update `servicePageData.tsx`

Replace all 8 service entries with the new client's services. Each entry requires: `slug`, `service`, `seoTitle`, `seoDescription`, `headingTitle`, `headingSubtitle`, `captionTitle`, `captionDescription`, `formId`, `formName`, `contactAnchorId`.

**`SHARED_BENEFITS` and `SHARED_PROCESS` currently have zero consumers** — grep the codebase to confirm before editing them for a given fork; nothing imports them as of this template snapshot. What actually renders on every service page is the hardcoded default prop values inside `TallServicesBenefitsCards.tsx` and `ServiceONEProcessAccordionWrapper.tsx`, which `ServicePageBLDR.tsx` composes with no props. Edit content in those two wrapper files, not the arrays. (Both files are already listed under "Update wrapper defaults" below.) Leave the arrays in `servicePageData.tsx` in place — don't delete them — but don't spend fork time updating their content until something actually consumes them.

Create one `.astro` route file per service in `src/pages/services/` (copy an existing one and update imports + data key).

### Update `cityLandingData.tsx`

Replace city entries with the new client's service markets. Create one `.astro` route file per city in `src/pages/service-area/`.

### Update internal links after changing service/city routes

`NavbarMainWrapper.tsx` hardcodes a `MENU` array of real `/services/{slug}` and `/service-area/{slug}` hrefs — one array driving both the desktop and mobile menus in this wrapper. It does **not** derive from `servicePageData.tsx`/`cityLandingData.tsx`, so adding, removing, or renaming a service or city route does not propagate here automatically; every stale href silently 404s. Update `MENU` to match the routes created above.

`FooterSection.tsx` carries its own separate hardcoded `servicesLinks` list — currently anchor links (e.g. `#services`) rather than real routes, and not necessarily a complete list of every service. It won't 404 the way the navbar can, but its labels can still drift out of sync with the actual service set. Review it alongside the navbar.

After updating both, click through every nav and footer link (or grep for `href="/services/` and `href="/service-area/"` outside the route files) and confirm each resolves to a route created in this step.

### Update one-off page builder content

Each builder (`{Client}-Home.tsx`, `{Client}-About.tsx`, etc.) contains hardcoded copy. Replace:
- Hero headlines, subheadlines
- About/story copy
- FAQ questions and answers
- Service area description text
- Footer tagline and social links

### Update wrapper defaults (sections/)

Several wrappers have hardcoded copy in their default prop values or JSX. Key files to review:
- `HeroWrapper.tsx` — headline, subheadline (the dynamic offer cards pull from CLIENT) — Home
- `NavbarMainWrapper.tsx` — nav link labels (logo alt text now resolves automatically from `CLIENT.business.name`) — every page
- `FooterSection.tsx` — business description (tagline), social hrefs (copyright text now resolves automatically from `CLIENT.business.name`) — every page
- `CenteredCopyAreaWrapper.tsx` — paragraph copy — city landing pages
- `AboutUsVariant1.tsx` — guarantee copy, about-us expanded text (the map embed and its title now resolve automatically from `CLIENT.map.embedUrl` / `CLIENT.business.nameShort`) — Home
- `PortfolioGalleryWrapper.tsx` — gallery heading/caption copy — Home, /contact
- `ServiceONEtallLocationWrapper.tsx` — location/service-area copy — service pages
- `ActionHeroHeader.tsx` — hero headline and subtitle, composed with no override props — About (also a claims-audit target, see below)
- `ContactInfoFormWrapper.tsx` — form description copy, composed with no override props — /contact (also carries the ISA-specific certification field, see the tree-service-surfaces list below)
- `ServiceGuaranteeAndFeaturesWrapper.tsx` — guarantee/feature card copy, composed with no override props — Home, city landing pages

**Short labels vs. full prose:** short standalone labels (credential names, guarantee names, the trade name) are now pulled from `CLIENT.vocabulary.*` — set those once in Step 2 and they propagate. But full prose is NOT covered by vocabulary tokens and still needs a manual per-fork rewrite:
- `CertifiedArboristsWrapper.tsx` — body paragraphs
- `FullStretchFaqWrapper.tsx` — all FAQ questions and answers
- `InfoImageColumnWrapper.tsx` / `AboutUsVariant1.tsx` — about-page and about-us story paragraphs
- `ReviewsCarouselWrapper.tsx` — testimonials (replace with the new client's real reviews, don't edit Medrano's-specific ones)
- `TallServicesBenefitsCards.tsx` — description, benefit card copy (title now resolves automatically from `CLIENT.business.name`)
- `TrustHeadlineRatingsWrapper.tsx` — description, badge text (title now resolves automatically from `CLIENT.vocabulary.tradeName` / `CLIENT.business.nameShort`)
- `OurProcessStepsWrapper.tsx` / `ServiceONEProcessAccordionWrapper.tsx` — process step descriptions (business-name mentions now resolve automatically from `CLIENT.business.nameShort`/`.name`)
- `servicePageData.tsx` / `cityLandingData.tsx` — entire service/city objects (already covered below; this is wholesale data replacement, not a word swap)

### Sections that assume a tree-service client — evaluate for removal or rewrite on every fork

The template's only implemented client to date is a tree-care business, so a handful of sections bake in tree-industry assumptions that `CLIENT.vocabulary.*` doesn't reach. For a fork into a different trade, check each of these individually rather than discovering them one at a time:
- `CertifiedArboristsWrapper.tsx` (About) — ISA Certified Arborist is a tree-care-specific credential; the body paragraph needs a full rewrite or removal for a non-arborist trade, not just a vocabulary swap.
- `ReviewsWidgetEmbedWrapper.tsx` (city landing pages) — hardcodes `uid=medranos-tree-service` in the embed URL, pointing at the template client's own live review feed. Left unchanged, a new client's city landing pages display Medrano's reviews. Must be repointed to the new client's own review-widget UID or removed.
- `AssociationBadgeAreasslotterWrapper.tsx` (city landing pages, /contact) — default `logos` array hardcodes `/logos/isa.svg` and `/logos/tcia.svg`, tree-industry association badges. Swap for the new client's actual association logos (or remove the badges section if none apply).
- The ISA Certification Number field inside `ContactInfoFormWrapper.tsx` (/contact) — a hardcoded form-adjacent content block, not config-driven. Remove or replace for any client without an ISA credential.
- `CountiesServedWrapper.tsx` (Home) — hardcodes its own 5-county `<ul>` list independent of `CLIENT.geo.serviceCounties`; the county list in `client.config.ts` is not actually consumed here. Either wire the wrapper to read from config or edit the hardcoded list directly — don't assume updating `client.config.ts` alone is sufficient.

### Claims audit

Template copy carries factual claims about the reference client that read as generic boilerplate but are not — carried into a fork unchanged, they become false statements about the new client. Confirmed examples already in this template: `TallServicesBenefitsCards.tsx`'s description ("Licensed, insured, and trusted across the RDU Triangle since 2007"), `InfoImageColumnWrapper.tsx`'s "family-owned" and "since 2007" claims, `AboutUsVariant1.tsx`'s and `FooterSection.tsx`'s "Available 24/7" and "within 24 hours" response promises, `ActionHeroHeader.tsx`'s "Licensed & Insured" subtitle, `ReviewsCarouselWrapper.tsx`'s "190+ 5 Star Reviews" count, and `ServiceGuaranteeAndFeaturesWrapper.tsx`'s "Fast Response"/"Licensed & Insured" labels. The per-route SEO `description` in `contact.astro` also asserts a "licensed crew" in live meta — SEO copy is not exempt from this audit just because it's outside `sections/`.

Every factual claim in the copy — licensure, insurance, certifications, ratings, review counts, years in business, service area, availability/response times, crew size, warranty terms — must trace to the completed intake. Anything the intake doesn't support must be **removed**, not reworded or softened. Do this pass across both wrapper copy and every per-route `seo.description` in `src/pages/*.astro`. See root CLAUDE.md §13.10.7.

### Register the new client in `src/lib/clientRegistry.ts`

Add one entry to the `REGISTRY` object, keyed by the new client's `siteKey`:

```ts
smith_hvac: {
  businessName: "Smith's HVAC",   // used in user confirmation email subject + signature
  // fromName: "Smith's HVAC Team",  // optional: Resend sender display name
},
```

This is the only server-side file that needs updating for a new client. It controls the user confirmation email branding. The API routing (env vars by prefix) is automatic — no other changes to `api/contact.ts` are needed.

### Forking for a sparse-data client

The template's wrappers generally assume every client supplies reviews, certifications, an address, and a map — they pass `CLIENT.reviews`, `CLIENT.certifications`, and `CLIENT.map.embedUrl` straight through to Subframe slot props with no conditional check. A client who genuinely has none of these doesn't degrade gracefully by default:
- Empty `CLIENT.reviews.aggregate` values render blank star widgets and rating bands rather than hiding them.
- An empty `CLIENT.map.embedUrl` renders an empty `<iframe>`.
- Emptied `CLIENT.certifications` values still render their field (e.g. the ISA Certification Number block on `ContactInfoFormWrapper.tsx` — see the tree-service-surfaces list above) with nothing in it.

For a client missing any of these, suppress the section rather than shipping it empty: remove the section from the page-builder composition (the `<SectionWrapper />` line in `{Client}-Home.tsx`, `Medranos-Contact.tsx`, etc.) rather than leaving it wired up with blank data. Keep the wrapper file itself on disk — don't delete it — so it's a one-line change to re-add once the client supplies the missing data. Never fabricate placeholder ratings, testimonials, review counts, or certifications to fill the gap; an invented "4.9★" or a fake credential is worse than an absent section. Removing a section leaves a visible gap in the page's content flow (e.g. no reviews section between hero and FAQ) that's a content decision for the client, not something to paper over in code.

---

## Step 7 — Set environment variables

### How `api/contact.ts` routes to the right client

The API endpoint auto-routes using the `siteKey` value POSTed by the form. It uppercases the key and constructs the env var names dynamically:

```ts
// siteKey "smithhvac" → looks up SMITHHVAC_CONTACT_TO_EMAIL, SMITHHVAC_CONTACT_FROM_EMAIL
function envForSite(siteKey: string) {
  const prefix = siteKey.toUpperCase();
  return {
    to: env(`${prefix}_CONTACT_TO_EMAIL`),
    from: env(`${prefix}_CONTACT_FROM_EMAIL`),
    bcc: env(`${prefix}_CONTACT_BCC_EMAIL`),   // optional
  };
}
```

**Important:** `siteKey` may contain letters, digits, and underscores, but must NOT start with a digit — env var names cannot begin with a digit, and `siteKey.toUpperCase()` becomes the prefix of every env var name (`{SLUG}_CONTACT_TO_EMAIL`, `PUBLIC_GTM_ID_{SLUG}`). No hyphens — they're unreliable across shells and deployment platforms. Use `"smithhvac"` or `"smith_hvac"` (not `"smith-hvac"`); for a client whose name starts with a digit, prefix a letter — `"a7ac12"` is valid, `"7ac12"` is not.

### Variables to set

Set these in both `.env` (local) and the Vercel project settings (production). Replace `{SLUG}` with `siteKey.toUpperCase()` (e.g. `SMITHHVAC`).

| Variable | Value | Notes |
|----------|-------|-------|
| `PUBLIC_GTM_ID_{SLUG}` | GTM container ID (e.g. `GTM-XXXXXXX`) | Must match the env var name in `client.config.ts tracking.gtmId` |
| `RESEND_API_KEY` | Resend API key | Shared across clients if on the same Resend account |
| `{SLUG}_CONTACT_TO_EMAIL` | Destination email for form submissions | Must be verified in Resend |
| `{SLUG}_CONTACT_FROM_EMAIL` | Sender email address | Must be on a verified Resend domain |
| `{SLUG}_CONTACT_BCC_EMAIL` | BCC address for submissions (optional) | Leave unset if not needed |

### User confirmation email branding

Already handled by the `clientRegistry.ts` entry from Step 6 — no `api/contact.ts` edits needed.

### Update `.env.example`

Add the new client's variable names (without values) to `.env.example` so the next developer knows what's required.

---

## Step 8 — GTM + Google Ads setup (conditional)

Applies only if this client launches with tracking. If not, skip this entire step and record the skip as an open item in the generated client-scoped `CLAUDE.md` (Step 10).

### Import the template container

File: `tracking/gtm-container-template.json` (exported from `GTM-KN7RMV43` workspace 10; includes the corrected `DLV - page_type` variable, the GA4 Base/Event Router pattern, Conversion Linker, and the three Ads conversion tags).

In the new client's fresh GTM container: **Admin → Import Container → choose file → new workspace → Overwrite.**

### Mandatory post-import replacements

The export contains the template client's live values — these must be replaced before publishing, or the new client's traffic reports into Medrano's GA4/Ads accounts:

| Item | Replace with |
|------|-------------|
| `GA4 - Base` Measurement ID | New client's GA4 property |
| `generate_lead_gads` conversion ID + label | Form-lead conversion action created in the NEW client's Google Ads account |
| `GAds - Click Call Conversion` conversion ID + label | Click-call conversion action in the NEW client's Google Ads account |
| `gads - qualified_call_60s` conversion ID + label | Qualified-call conversion action in the NEW client's Google Ads account |
| `awcc` tag's `phoneConversionNumber` | New client's displayed number — must match `CLIENT.contact.phoneDisplay` EXACTLY (root §8.9 swap rule) |

### Google Ads side

Create the three conversion actions in the new client's account. Exactly one Primary per conversion type:
- Qualified call (≥60s) — Primary
- Form lead — Primary
- Click-call — Secondary (Include in Conversions: Off)

If GA4 also imports `generate_lead`, it stays Secondary — the direct GTM tag is the sole Primary (mirrors root §8.10).

### Verification

- [ ] GTM Preview — `DLV - page_type` resolves a real (non-empty) value on any event
- [ ] GCLID swap test per root §8.9 on every call surface (navbar, mobile sticky bar, hero, footer, service pages)
- [ ] Publish with a named container version

---

## Step 9 — Verification checklist

Run the dev server (`npm run dev`) and verify each item before pushing to production.

- [ ] **Theme colors apply** — every page renders the new client's brand colors, not Medrano's green
- [ ] **GTM loads** — view source on any page; confirm the GTM snippet contains the new container ID (skip if this client isn't launching with tracking — Step 8)
- [ ] **Page titles correct** — check `<title>` in browser dev tools on home, about, contact, a service page, a city page
- [ ] **Forms submit** — submit a test form; verify the email arrives at the correct destination with correct content
- [ ] **Tracking events carry new values** — open GTM preview mode; click any CTA; verify `city`, `service`, `page_type`, and `site` in the event payload match the new client — skip if tracking isn't configured yet
- [ ] **Tracking verified end-to-end (if Step 8 ran)** — `DLV - page_type` resolves a real value in GTM Preview; GCLID swap test passes on every call surface; container published with a named version
- [ ] **No old client values visible** — grep the codebase for `medranos` and `MedranosINC`; every hit must be ZERO now that the previous client's folder was deleted (Step 1). Any hit is a leftover to fix. This literal-name grep alone is not sufficient — see the next item.
- [ ] **Stale-content grep covers every rendered route, not a sample** — a grep scoped to a handful of pages can come back clean while a stale value still renders on a page you didn't check. Run the check against every route (`npm run build` and grep the built output, or view-source each route) rather than the codebase alone — a value can be correctly removed from source and still be a false negative if you only grepped source instead of what's actually rendered. Use word-boundary matching (a bare `tree` false-positives on `street`; a bare grep for a trade term should be `\btree\b` or similar). Terms that proved worth checking on past forks: the previous client's business name (short and legal forms), trade-specific terms, old city/county names, the old founding year, the old region label, "licensed"/"insured" and certification acronyms (see the claims audit above), and old route slugs (`/services/{old-slug}`, `/service-area/{old-slug}`).
- [ ] **Claims audit passes** — every factual claim in wrapper copy and per-route SEO descriptions (licensure, insurance, certifications, ratings, review counts, years in business, availability/response times, crew size, warranty terms) traces to the intake; anything unsupported has been removed. See Step 6's claims audit.
- [ ] **All routes resolve** — visit every route including service pages and city landing pages; verify no 404s; every navbar and footer link (including any hardcoded service/city hrefs) resolves to a route that exists
- [ ] **Coupon downloads work** — click "Get Coupon" on the offers page; verify the download resolves (or confirm offers are intentionally absent per Step 0 rule (h))
- [ ] **Mobile layout** — check hero, offer cards, service area section, and forms at mobile viewport
- [ ] **Generated client-scoped CLAUDE.md exists and matches actual config values** — see Step 10

---

## Step 10 — Generate the client-scoped CLAUDE.md

Run this LAST, after Step 9's verification checklist passes — not as you go. The generated file needs the final state of `client.config.ts`, `servicePageData.tsx`, `cityLandingData.tsx`, the route inventory, and (if Step 8 ran) the live GTM/Ads values. Writing it earlier means writing it twice.

This step is **not optional**. The fork is not complete until `src/components/websites/{NewClient}/CLAUDE.md` exists and is committed.

### Instruction block (paste into a Claude Code session)

> Generate `src/components/websites/{NewClient}/CLAUDE.md` for this fork. Use the CURRENT client's file — `src/components/websites/{PreviousClient}/CLAUDE.md` in the repo you forked from (in this repo, `EdsTreeService/CLAUDE.md`) — as the structural skeleton: same section numbering and depth (§1 Client Identity through §9 Future-Client Migration Notes). ⚠️ Skeleton means STRUCTURE ONLY. Every value, name, count, date and Open Item is the previous client's until replaced; a section that is copied and not rewritten ships that client's facts under this client's name. The EBS fork carried §1, §2, §5, §6, §8 and §9 as the previous client's for two weeks after launch prep began, with 68 lines naming them — the exit check below exists so that cannot recur. Populate every section from actual current-state sources, not from memory or assumption:
> - The completed `{NewClient}-INTAKE.csv` in this client's folder (Part C / Step 0)
> - The actual `src/components/websites/{NewClient}/config/client.config.ts` as committed
> - `servicePageData.tsx` and `cityLandingData.tsx` for the service/city page inventory
> - The route files under `src/pages/` for the route inventory
> - GTM container ID, GA4 property, and the three Google Ads conversion actions from Step 8 — if Step 8 was skipped, state that tracking is not yet configured and add it as an Open Item instead of inventing placeholder values
>
> Reset §8 Open Items to empty except: (a) any item explicitly deferred during this fork (e.g. "tracking skipped — Step 8 not run", TBD assets from the intake with their placeholder names), and (b) genuinely new open questions the fork surfaced.
>
> Do not copy any Medrano's-specific Open Items forward (root rule §13.10.2).

### Verification

- [ ] File exists at `src/components/websites/{NewClient}/CLAUDE.md`
- [ ] Every section reflects this client's actual values — grep the generated file for `medrano` (case-insensitive); zero hits
- [ ] Committed to the fork's repo

---

## Quick reference: what client.config.ts does NOT cover

These remain manual edits per-fork:

| Concern | Where it lives |
|---------|---------------|
| Brand colors | `src/styles/global.css` `body.theme-{slug}` block (Step 3) |
| Page-specific SEO copy | `servicePageData.tsx`, `cityLandingData.tsx`, per-route `seo` objects in `src/pages/` |
| Form instance IDs | `formId`/`formName` in wrapper default props and data files |
| Hero/section copy | Hardcoded in page builders and wrapper JSX |
| Static assets | `public/` (Step 5) |
| Server-side routing | `src/pages/api/contact.ts` env-var lookup by siteKey prefix (`envForSite()`, automatic) + `src/lib/clientRegistry.ts` entry for email branding (Step 6) |
| GTM configuration | Inside the GTM container UI — GA4, Ads, triggers, variables |
