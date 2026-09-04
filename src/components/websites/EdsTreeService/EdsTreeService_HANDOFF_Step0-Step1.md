# Ed's Tree Service — Fork Handoff Brief (Step 0 → Step 1)
**For:** starting Step −1 → Step 1 of DUPLICATE.md, forking from the EBS repo
**Client:** Ed's Tree Service · Faison, NC · tree removal, trimming, stump grinding, storm clean-up
**Owner:** Eduardo Jimenez — the same owner as Exterior Builder Services (EBS). This is his second company on the template.
**Artifacts:** `EdsTreeService-INTAKE.csv` (111 rows, six-column template shape, answers as of 2026-09-03) · style guide received 2026-09-03 (titled "Guzman Brothers Tree Services", direction "Sawdust" — Ryan confirmed it is Ed's; see §6)

---

> ## ⚠️ READ THIS FIRST — what in here is live
>
> | Section | Status |
> |---|---|
> | **§3 CLAIMS REGISTER** | ✅ **LIVE AND AUTHORITATIVE.** Read it before writing ANY customer-facing copy, alt text, or SEO description. |
> | §2 Values decided outside the intake | Live until `client.config.ts` exists (Step 2). After that the config wins and this table is history. It deliberately does NOT duplicate the intake — EBS's equivalent table drifted from its config within days. |
> | §1, §4, §5, §6, §7, §8, §9 | Working notes for the fork. Superseded by the generated client CLAUDE.md at Step 10. |

---

## 1. What this covered

Discovery and intake only. **No repo forked yet.** Ryan supplied a questionnaire built from the v2 `INTAKE_TEMPLATE.csv` (commit 673bdd7), answered the seven review decisions on 2026-09-03, and asked for the intake to be re-authored on those decisions before the fork. The style guide is still to come and may revise the palette and fonts in §2.

The seven decisions, verbatim in substance:

| # | Question | Decision (2026-09-03) |
|---|---|---|
| 1 | "Same Day Tree Removal" vs availability "none" | **Cleared.** Same-day tree removal may be promised. Regular hours are 8 AM–7 PM, every day. No emergency line still — "24/7", "emergency" and "after-hours" stay banned. Raised as a response-time concern first; Ryan reaffirmed. |
| 2 | "Free Tree Removal" offer | **Struck.** There is no free tree removal. One offer remains: 10% off the first tree service. |
| 3 | "Licensed" | **Confirmed none.** NC does not license tree work. "Licensed" is MUST NOT SHIP. |
| 4 | Credential title "none" | **Confirmed.** Re-author every credential surface around: bonded & insured, family-owned, locally owned, since 2006, 1000+ served. |
| 5 | No reviews, no rating | **Confirmed.** Remove the review elements and sections in the fork. Never placeholders. |
| 6 | 2006 and "1000+" copied from EBS | **Confirmed true of the tree business.** |
| 7 | Maps link is EBS's listing | **Reuse it** until Ryan updates it manually. |
| 8 | Free estimates — surfaced by the review, since every template CTA says "Get A Free Quote" | **Cleared** 2026-09-03. |

---

## 2. Values decided outside the intake

Only what the intake could not hold. Everything else lives in `EdsTreeService-INTAKE.csv` until Step 2 moves it into `client.config.ts`.

| Item | Value | Why |
|---|---|---|
| Folder | `EdsTreeService` | Ryan's choice |
| GitHub repo | `nadmaker/EdsTreeService`, private | Name verified free 2026-09-03 |
| `siteKey` | `edstree` | The questionnaire had `ed'sTree`; apostrophes and capitals are invalid (Step 0 rule d). Identical to the theme slug, as EBS does |
| `theme.slug` / bodyClass | `edstree` / `theme-edstree font-body` | Same reasoning |
| Env prefix | `EDSTREE_` and `PUBLIC_GTM_ID_EDSTREE`, `PUBLIC_GOOGLE_MAPS_API_KEY_EDSTREE`, `PUBLIC_GOOGLE_MAPS_MAP_ID_EDSTREE` | `siteKey.toUpperCase()` |
| `business.siteUrl` | `https://eds-tree-service.vercel.app` until a domain exists | The questionnaire said NONE. EBS shipped an unregistered domain here and the privacy page printed it; the starter URL at least resolves. Confirm the Vercel project name at import |
| Service routes | `tree-removal`, `tree-trimming`, `stump-grinding`, `storm-clean-up` | Four services; EBS's seven routes are deleted. "Stump Removal" is a keyword variant of Stump Grinding |
| City routes | `goldsboro-nc-tree-service`, `clinton-nc-tree-service`, `mount-olive-nc-tree-service`, `warsaw-nc-tree-service`, `faison-nc-tree-service`, `kenansville-nc-tree-service` | Same six cities as EBS, same order |
| Tracking | city `faison-nc`; service default `tree-service`; city landings `{city}-nc` | Same scheme as EBS; no container, so all inert |
| Palette (style guide, confirmed) | primary `#187A26`, hover `#14651F`, secondary `#E68E1C`, secondary-hover `#D28017`, background `#EDFAEF`, text `#0B240E`; tertiary slot `#59755D` | Measured 2026-09-03 and matching the guide's own audit to the hundredth: white on primary 5.45:1, on hover 7.21:1, primary on background 5.07:1, text on background 15.34:1, **amber on background 2.37:1 and white on amber 2.55:1 → amber is fills-only with dark text, never type, never a border**. The guide proposes no tertiary; the slot is filled with its §5 fallback only because template wrappers already consume `--color-brand-tertiary`. The template's `--color-brand-secondary-text` slot maps to primary green (guide §4 rule 3) |
| Fonts (style guide, confirmed) | Zilla Slab 700 for H1/H2 and 600 for H3/H4; Public Sans 400/500/600 | Google Fonts embed per guide §6; desktop H1 capped at 56px; Zilla Slab Bold TTF (OFL) vendored under `og/fonts/` for the social card |
| Google Maps | reuse EBS's Cloud project; add the new referrer to the key; reuse or clone the Map ID | Same owner, same counties, same 29 ZIPs, same polygon |

---

## 3. CLAIMS REGISTER — read before writing any copy

Current through **2026-09-03**. Four categories, as EBS: **Cleared**, **MUST NOT ship**, **UNVERIFIED CAPABILITIES**, **OPERATIONS CLAIMS**. This client starts with FEWER cleared claims than EBS and a trade whose template copy is full of credentials it does not hold — the arborist/ISA copy that survives in orphaned EBS wrappers reads as *correct* on a tree site, which makes it more dangerous here than it was on EBS.

### Cleared to use
- **Bonded & Insured** *(owner-confirmed; carrier not supplied)*
- **Free estimates / free quote** *(confirmed 2026-09-03 — every template CTA depends on it)*
- **In business since 2006 / 20 years** *(confirmed for the tree business 2026-09-03)*
- **1000+ homes and businesses served** *(confirmed 2026-09-03)*
- **Family-owned / family-run** and **locally owned** *(owner-confirmed)*
- **Residential and commercial** — residential leads
- **Same-day tree removal** *(OWNER-CLEARED 2026-09-03 after the response-time concern was raised; keep it attached to removal and to the hours below)*
- **Open 8 AM–7 PM, every day** *(2026-09-03; confirm "every day" means seven days including Sunday before it is printed as "7 days a week")*
- **Our own crews, start to finish** *(cleared wording for the own-crews fact; see OPERATIONS CLAIMS)*
- **Storm clean-up** as a service *(a service, not a response promise)*
- **Ed's Service Guarantee** as a NAME, and "satisfaction guaranteed on our work" as its one-line meaning *(no terms beyond that — see below)*
- **"Insured Tree Service"** — the owner's signature phrase
- Service area: **Duplin, Sampson & Wayne Counties**; the six landing cities *(same as EBS, owner-confirmed there)*

### MUST NOT ship
| Claim | Why |
|---|---|
| **"Licensed"** in any form — "Licensed & Insured", "licensed crew", "licensed contractor" | NC does not license tree work; the owner confirmed none. **The EBS copy says it in 15 files, including two route SEO descriptions.** Every instance becomes "Bonded & Insured". |
| **"Certified" / "Certified Arborist" / "ISA" / "TCIA" / "arborist" as a credential** | No certifications. The template's original tree-service copy leans on ISA certification; CertifiedArboristsWrapper, the ISA form field and the association badges are all still on disk in the EBS folder as orphans. Delete them. "Arborist" as a job title is also out — nobody on the crew holds the credential the word implies. |
| **Any star rating, review count, testimonial, or `aggregateRating`** | No reviews exist anywhere. The reviews carousel, the hero Google badge, the /about ratings block and `reviews.trustBadge` / `reviewCount` all come out. Never a placeholder review. |
| **"24/7", "emergency", "after-hours", "rapid response", any minutes-or-hours promise** | No emergency line. Same-day and the 8–7 hours are the ONLY availability claims. "Emergency storm clean-up" is banned; "storm clean-up" is fine. |
| **"Free tree removal"** | Struck 2026-09-03 — there is no such offer. |
| **BBB, Angi, Facebook, Yelp mentions** | No profiles. |
| **Any trade-association badge** | Not a member of anything. Delete the row, don't substitute. |
| **Lifetime / multi-year warranty terms** | Only "satisfaction guaranteed" is defined. |
| **Roofing and siding vocabulary, EBS's OSHA line, EBS's photographs** | Different company. The OSHA override belonged to EBS's crews and its objection; it does not transfer. |
| **Medrano's residue**: "since 2007", "RDU Triangle", "Durham / Chapel Hill / Raleigh", "190+ reviews", "5-Star", "healthy tree guarantee", `uid=medranos-tree-service` | The template's first client was a tree service, so this residue is plausible here. It survives in EBS's orphaned wrappers and in comments; grep the served HTML, not just source. |

### Needs pinning down before launch
- **UNVERIFIED CAPABILITIES** — nobody has asked. One owner answer per line moves it to Cleared; until then it is a claim per pill and does not appear in any list, chip, FAQ or service page.

  | Capability | Where it will come up | Status |
  |---|---|---|
  | Crane-assisted removal | The intake's equipment-term row says "crane assisted tree removal" | Implied, not confirmed as a service. Confirm before it appears in copy |
  | Land / lot clearing | Every tree-service reference site | Unverified |
  | Tree planting, tree health / disease treatment, fertilisation | Reference sites, FAQ drafts | Unverified |
  | Cabling & bracing | Reference sites | Unverified |
  | Firewood / mulch / wood chips | Reference sites | Unverified |
  | Commercial maintenance contracts, HOA / municipal work | The "commercial" segment answer | Segment is cleared; contract work is not |
  | Insurance-claim help after storms | Storm clean-up copy | Unverified — and adjacent to the emergency ban |
  | Hazardous / dead tree assessment as a service | Service-page FAQ drafts | Unverified |

  ⚠️ Do NOT infer a capability from a competitor's site or from the template's original tree-service copy. The template's first client did crane work, cabling and land clearing; Ed's may not.

- **OPERATIONS CLAIMS** — the category most likely to be invented while writing prose. The tell is the absolute: *never, always, every, no, only*.

  | Pattern | Ruling |
  |---|---|
  | "never subcontracted" / "no subcontractors" | Banned absolute. Use "our own crews, start to finish" |
  | "same crew from start to finish" | Staffing promise, not in the intake |
  | "we answer every call" / "on site within X hours" | Response promise beyond same-day; banned |
  | "no hidden fees" / "no-pressure" / "upfront pricing" | Sales-conduct promises; not cleared |
  | "cleanup included" / "we leave your yard cleaner than we found it" | Service-scope promise; not cleared. The founding story's "every job leaves a yard behind…" is tone, not a guarantee — keep it descriptive |
  | Crew size, truck count, jobs per week | Numbers invite verification. Only "1000+" is cleared |

- **Legal entity form** — "Ed's Tree Service" with no LLC / Inc. The privacy policy prints `nameLegal`.
- **"Every day"** — seven days including Sunday, or Monday–Saturday?
- **Guarantee terms** — what "make it right" covers, for how long.
- **Offer expiration** — a real rolling date for the 10% offer; no placeholder ships.
- **The 15 expanded towns** inherit EBS's caveat: only the six landing cities are owner-confirmed.
- **Google Business Profile** — the reused link is EBS's roofing listing. Google discourages two listings sharing one phone and address; expect to need a separate listing with its own number eventually, and note that the get-directions anchor points at the roofing company until then.

---

## 4. Client-specific deviations from EBS

1. **No credential at all.** EBS had an owner-overridden "OSHA Certified" line consumed by nine wrappers. Ed's `credentialTitle` is empty, so each of those nine surfaces — AboutUsVariant1, ActionHeroHeader, BusinessStatisticsWrapper, CredentialBandWrapper, FullStretchFaqWrapper, ServiceONEProcessAccordionWrapper, TallServicesBenefitsCards, plus the orphaned AssociationBadge and CertifiedArborists wrappers — is re-authored around the five cleared claims, not left rendering an empty string.
2. **No reviews section.** The home reviews carousel, the hero Google badge and TrustHeadlineRatingsWrapper on /about are removed from the builders. `reviews.trustBadge` and `reviewCount` are empty strings; `platforms` is empty. Keep the wrapper files on disk; do not fabricate.
3. **One offer, no /offers route** (EBS deleted the route too). `offers.items[0]` still feeds five wrappers; it is the 10% offer.
4. **Four services, not seven.** Three EBS service routes and their data entries are deleted; `NavbarMainWrapper`'s MENU and the footer links are rewritten. Six city routes are renamed, not removed.
5. **No property-type field** — the EBS /contact form's dropdown is removed, which also closes EBS open item 8.2.8 for this fork. Fix the double-mount (EBS 8.5.12) in the same pass.
6. **Same-day is cleared** — the opposite of EBS. Hero and removal-page copy may say it; nothing else may promise time.
7. **Assets are all placeholders at fork.** EBS's photos are roofing; the older `ebs-` files are Medrano's tree photography. Neither may ship. Generated neutral placeholders fill every required slot (3 hero slides, 4 service heroes, 6 city heroes, gallery, wordmark logo, favicon) so nothing 404s and no other company's work appears; each is an Open Item.
8. **Shared contact details with EBS** — same phone, address, inbox and Maps link. Fine operationally; the `site: "edstree"` discriminator and the `clientRegistry` entry keep the confirmation emails branded correctly. See the GBP note in §3.
9. **Orphans are deleted, not kept.** EBS kept six importer-less wrappers by policy. On this fork their content is on-trade and MUST-NOT-SHIP, so they go: AssociationBadgeAreasslotterWrapper, CertifiedArboristsWrapper, ContactInfoFormWrapper, CountiesServedWrapper, ReviewsWidgetEmbedWrapper, TitleHeadingBlock, plus `public/logos/{isa,tcia,bbb,angi}.svg`.

---

## 5. Step 0 pre-check

| Rule | Status |
|---|---|
| Phone digits consistent across formats | **PASS** |
| E.164 format | **PASS** |
| No blanks on permanent fields (trackingCity, siteKey, theme.slug) | **PASS after correction** — siteKey/slug set to `edstree` |
| siteKey / theme.slug format and correspondence | **PASS after correction** (questionnaire had `ed'sTree` / `Ed's-Tree`) |
| hqState 2-letter abbreviation | **PASS** (`NC`) |
| serviceAreaLabel is a label, not a city list | **PASS** — same accepted county-list deviation as EBS |
| Sender domain Resend-verifiable | **FAIL — no domain.** Same blocker as EBS 8.1.1 / 8.1.2. Not fork-blocking; blocks the contact form at launch |
| At least one offer or explicit opt-out | **PASS** — 10% off first tree service |

### Blockers before LAUNCH (not before the fork)
1. A Resend-verified sending domain, or the template's sending domain — neither exists yet.
2. Vercel Hobby → Pro before handover (commercial use).
3. Real photography and a logo — the site ships placeholders until then.

### Open decisions carried into the fork
1. Legal entity form.
2. "Every day" = 7 days?
3. Capabilities list (§3).
4. Guarantee terms; offer expiration date.
5. Whether to reuse the EBS Map ID or create "Ed's Service Area".
6. Whether the new repo commits `.env` (EBS did, by owner override). Default for this fork is root §13.8.5: **not committed**; PUBLIC_ values go in the Vercel dashboard, and the empty auto-detected rows are deleted before the first deploy.

---

## 6. Style guide — received 2026-09-03, reconciled

The guide is titled "Guzman Brothers Tree Services — Website Style Guide", direction "Sawdust". Ryan confirmed it is Ed's; the title is a leftover. Its tokens match the intake exactly and add a derived secondary-hover (`#D28017`). Its contrast audit is computed against the ACTUAL background and reproduces §2's measurements to the hundredth — unlike EBS's guide, nothing here needed correcting.

**Adopted:** the token block (guide §8) mapped onto the template's slot names; the nine usage rules (guide §4) — green is text, amber is fill, amber CTA labels in body-text colour, amber never on the background as text or hairline, amber never inside green sections, reverse-out bands on primary-hover with background-colour text, captions `neutral-600` not `neutral-500`, cards white not `neutral-200`; the font weights and embed (guide §6); the 56px desktop H1 cap; the imagery direction (guide §7) as guidance for the photos Ryan will supply.

**NOT adopted — the guide is a STYLE document and carries claims the register bans, the same failure mode as EBS's reference sites:**
- Its example headlines "Certified Arborists Serving the Triangle" and "Emergency Storm Damage Removal", and its "emergency/24-7 banner" listed as a place amber "earns its place". Ed's has no certification, no emergency line, and is not in the Triangle. The width measurements stand as typography data; the strings never ship.
- Its typography rationale ("reads as licensed, insured, permitted"). The FONT may signal that; the COPY may not say "licensed".
- Its §9 market assumption (Triangle-area NC). Wrong — the market is Goldsboro–Clinton and the three counties.
- "Brothers" and "faces, at least once — it's Brothers". Family-run photo direction still applies; the Brothers framing does not.
- Its logo sampling is from a screenshot of a mark Ryan has not yet added to the repo. The placeholder wordmark ships until he does, and the guide's own open item (re-sample from vector) stands.

**Two template-specific decisions the guide forced:**
- `--color-brand-tertiary` — the guide proposes none, but EBS-era wrappers consume the slot. Set to the guide's §5 fallback `#59755D` (4.73:1) rather than left undefined, and only where a wrapper already reaches for it.
- `--color-brand-secondary-text` — EBS used a darkened gold for gold TYPE. The guide forbids amber as text at any size, so the slot maps to primary green; no amber text exists on the site.

The "Bitter" alternate heading face is on file if positioning shifts toward tree health; it lowers the H1 cap to ~52px.

---

## 7. DRAFT copy seeds — owner to approve, claim-checked against §3

**Service one-liners** (`captionDescription` seeds)
- *Tree Removal* — Same-day tree removal for trees that are dead, leaning, storm-damaged or simply in the way, taken down safely by our own crew.
- *Tree Trimming* — Trimming and pruning that keeps limbs off roofs and power lines and keeps the tree's shape and health.
- *Stump Grinding* — Stump grinding below grade so you can plant, mow or build over the spot.
- *Storm Clean Up* — Fallen trees and broken limbs cleared and hauled after a storm, with the property left safe to use.

**Why choose us** (TallServicesBenefitsCards, 13 routes)
- Bonded & Insured — Every job is covered before the first cut.
- Family-Owned, Locally Operated — Eduardo's own crews, start to finish, based in Faison.
- Serving Duplin, Sampson & Wayne Since 2006 — Twenty years of tree work in these three counties.
- 1000+ Homes & Businesses Served — Residential and commercial.

**Stats band** (BusinessStatisticsWrapper) — Since 2006 · 1000+ homes & businesses served · 3 counties · Open every day, 8 AM–7 PM

**Guarantee** — Ed's Service Guarantee: if you are not satisfied with our work, tell us and we will make it right.

**Availability line** — Open every day, 8 AM–7 PM. Same-day tree removal available. Free estimates.

**Offer** — 10% OFF · 10% Off Your First Tree Service · "New to Ed's? Take 10% off your first tree removal, trimming, stump grinding or storm clean-up job. Mention this offer when you book." · expiration OPEN

Not drafted here, deliberately: FAQ answers and process steps. Both need the owner's account of how a job runs; generic drafts would invent operations claims.

**Added by the design session (2026-09-03 → 2026-09-04) — cleared claims only, NONE owner-approved:**
- *Navbar info bar* — "Need Tree Help? Call Us Now!" · "Phone:" · "Email:" (the visible email is the shared inbox, per config).
- *Navbar CTA* — "Get A Free Quote" (desktop bar and the mobile overlay).
- *Home hero* — h1 unchanged ("Same-day tree removal, done safely"); new strap "Tree removal, trimming, stump grinding & storm clean-up in Duplin, Sampson & Wayne Counties".
- *Hero estimate form* — "Request your free estimate" · "Enter your contact info" · "Enter your address" · labels Full name / Phone number / Email / Additional details (optional) / ZIP code / Property address · validation lines ("Choose a service to continue." etc.) · "Thank you, {name}. Your submission has been received. We'll reach out shortly." · "Submit another request" · and the message the API receives when the textarea is left empty: "Free estimate request for {Service} — no additional details provided."
- *About (AboutUsVariant2)* — eyebrow "About Us"; headline "20 Years of TRUSTED TREE SERVICE in Goldsboro–Clinton, NC" (years derived from 2006; "trusted" was already live in the previous About block); the founding story is intake row 91 VERBATIM in three paragraphs — ⚠ it spells "storm cleanup" where the site says "storm clean-up"; settle at sign-off, do not silently normalise the owner's words.
- The **Offer** seed above was STRUCK on 2026-09-04 (previous session): no offer exists; free estimates is the only one the business makes.

---

## 8. EBS surfaces to strip or rewrite during the fork

Beyond DUPLICATE.md Steps 1–6 (folder is `ExteriorBuilderServices`, not `MedranosINC`):

- **"Licensed" sweep** — 15 files: `cityLandingData.tsx` (11 hits), `ServicePageBLDR.tsx`, `servicePageData.tsx`, `ActionHeroHeader`, `CertifiedArboristsWrapper` (deleted), `FullStretchFaqWrapper`, `InfoImageColumnWrapper`, `Landing1-HeroWrapper`, `OfferShowCaseWrapper`, `ServiceGuaranteeAndFeaturesWrapper`, `ServiceONEHeroWithRatingsWrapper`, `TallServicesBenefitsCards`, `TrustBadgesWrapper`, `contact.astro`, `index.astro`.
- **Credential consumers** — the nine wrappers in §4.1.
- **Rating consumers** — `HeroWrapper`, `ServiceONEHeroWithRatingsWrapper`, `TrustHeadlineRatingsWrapper`; plus `ReviewsCarouselWrapper` removed from `EBS-Home`.
- **Orphans + badges** — §4.9.
- **Photos** — every `public/images/ebs-*`, `public/maps/ebs-service-area.geojson` (rename), `public/favicon.png`, `public/images/ebs-favi.png`.
- **og card** — `og/SocialShareCard.tsx` colour literals, strap words, phone pill; `renderSocialShareCard.ts` asset paths; vendor the Zilla Slab 700 TTF.
- **Theme** — delete `body.theme-ebs` and ALL eleven `theme-medranos` rule blocks (two token blocks above, nine scoped rules below); add `body.theme-edstree` with the guide's tokens, `--color-brand-secondary-hover`, tertiary `#59755D`, `--color-brand-secondary-text` → primary green, amber-derived foil stops with body-text type.
- **Style-guide rules to sweep in the same pass** — `text-neutral-500` on the background → `neutral-600`; `bg-neutral-200` cards → white; full-bleed reverse-out bands on primary-hover with background-colour text; no amber inside green sections; amber CTA labels in body-text colour, never white.
- **Per-route SEO** — all four one-off `.astro` titles/descriptions; seven→four service entries; six city descriptions rewritten with six different sentence structures (EBS rule).
- **`clientRegistry.ts`** — replace `ebs` with `edstree: { businessName: "Ed's Tree Service" }`.
- **`.env.example`** — rename every `EBS` token to `EDSTREE`; `DEFAULT_SITE_KEY=edstree`.
- **Docs** — delete the three EBS handoff files, `EBS_HOME_ASSET_MAP.md`, `ExteriorBuilderServices-INTAKE.csv`; keep EBS's `CLAUDE.md` only as the Step 10 skeleton, then regenerate and run the exit grep for `exterior|ebs|medrano` (case-insensitive) — zero hits.
- **Inherited defects to fix in passing** — double-mounted /contact form (EBS 8.5.12), conditional mobile-menu mount (8.5.2), `TallServicesBenefitsCards` stray `"use client"` (8.5.5), `RightRail` kebab-case `service_type` in lead emails (8.3.3), `SHARED_BENEFITS`/`SHARED_PROCESS` unread exports (8.5.7), `ContactFormWrapper` legacy scoping (8.5.6).

---

## 9. Fork status — 2026-09-03

The fork RAN on 2026-09-03, in one session, from the EBS repo at 673bdd7:
Step −1 (`git archive` export, fresh history, `.env` excluded, `nadmaker/EdsTreeService` created private), Steps 1 → 1.5 → 4 → 2 → 3 → 5 → 6 → 7, then Step 9's checks and Step 10. Step 8 (tracking) did not run, by decision. Nothing is deployed to Vercel yet — that is the next manual step (§5 above, and the client CLAUDE.md §4.7).

What §8 above predicted held, with three additions worth recording:
- Some copied files carry CRLF line endings (the builders, the og card) while most are LF. A literal multi-line match silently fails across that boundary; the copy pass was rerun with EOL normalisation. Check `grep -rlI $'\r'` before any scripted edit on this repo.
- Reading a file with comment lines stripped hides comment lines INSIDE a block, so a literal built from that view does not match the file. Read the raw lines before writing an exact-match replacement.
- Every photo slot ships a generated placeholder (`scripts/placeholders.mjs`) rather than a borrowed photo; the same script regenerates the wordmark logo and favicon. Replacing a file with the same name is the whole swap.

The generated client CLAUDE.md (same folder) is now the current-state document; this file's §3 register stays authoritative for claims.
