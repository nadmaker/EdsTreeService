# Exterior Builder Services Inc. — Fork Handoff Brief
**For:** starting Step 0 → Step 1 in a fresh session
**Client:** Exterior Builder Services Inc. (EBS) · Faison, NC · roofing & siding
**Artifacts produced:** `INTAKE_ExteriorBuilderServices_v4.csv` (80 rows, 5 blank) · EBS Website Style Guide

---

> ## ⚠️ READ THIS FIRST — what in here is still live
>
> This file is a **historical intake record** from the Step 0/1 fork chat
> (2026-08-19/20). Most of it is a snapshot, not a source of truth.
>
> | Section | Status |
> |---|---|
> | **§3 CLAIMS REGISTER** | ✅ **LIVE AND AUTHORITATIVE.** The one reason this file still matters. Read it before writing any customer-facing copy. It is actively maintained and was used throughout the 2026-08-27/28/30 design sessions. |
> | §2 Confirmed config values | ⚠️ **NOT a source of truth — `client.config.ts` is.** Every field here is duplicated there. It HAS already drifted: its OSHA rows contradicted §3 for two days until 2026-08-30. Treat as history; if the two disagree, the code wins. |
> | §1, §5, §6, §7, §8 | Historical. §5's blockers and §8's "opening for the next chat" refer to the fork, which is long done. See §9 for what actually closed. |
> | §4 Client deviations | Mostly still true, except item 2 ("no logo file exists") — closed, see §9. |
>
> For the CURRENT state of the build, read `EBS_HANDOFF_Redesign.md`.
> For assets, `EBS_HOME_ASSET_MAP.md`. For tracking, client `CLAUDE.md` §3.

---

## 1. What this chat covered

Discovery and intake only. **No code written, no repo forked.** We:

1. Read `CLAUDE.md` (methodology), `DUPLICATE.md` (fork playbook), and `gtm-container-template.json` — all still Medrano's tree-service reference implementation, treated as placeholder.
2. Turned `INTAKE_TEMPLATE.csv` into plain client-facing questions.
3. Extracted client facts from a Google Local Guide screenshot and a B2B directory listing.
4. Verified geography, licensing law, and credential claims against external sources.
5. Reviewed the EBS style guide and **corrected its contrast math**.
6. Built and filled the intake through four revisions.

---

## 2. Confirmed config values

Ready for `client.config.ts`:

| Field | Value |
|---|---|
| `business.nameLegal` | Exterior Builder Services Inc. |
| `business.name` | Exterior Builder Services |
| `business.nameShort` | EBS |
| `business.nameShortPossessive` | EBS's *(see Open Decision #1)* |
| `business.owner` | Eduardo Jimenez |
| `business.yearFounded` | 2006 |
| `business.siteUrl` | https://exteriorbuilderservices.com/ |
| `contact.phoneTel` | `+19102169714` |
| `contact.phoneDisplay` | (910) 216-9714 |
| `contact.phoneSMS` | none — same as main |
| `contact.emergencyPhoneDisplay` | **none** |
| `contact.email` | exteriorbuilder121414@gmail.com ⚠️ **CORRECTED 2026-09-02** — the intake gave info@exteriorbuilderservices.com, a domain that is not registered, so it was never a working mailbox. Ryan confirmed the Gmail address is the client's real one. Also the form destination (`EBS_CONTACT_TO_EMAIL`). Cannot be the Resend FROM address (free-mail sender). |
| `contact.address` | 104 Johny B Tann Ln, Faison, NC 28341 |
| `contact.mapsUrl` | https://maps.app.goo.gl/Ti8Mnc39VKA81MsZ9 |
| `vocabulary.tradeName` | Roofing & Siding |
| `vocabulary.credentialTitle` | **OSHA Certified Roofer** ⚠️ |
| `vocabulary.credentialTitlePlural` | **OSHA Certified Roofers** ⚠️ |
| | ⚠️ These two were "OSHA-**Trained**" until 2026-08-28, when Ryan directed "Certified" after being shown §3's reasoning. This table said "Trained" while §3 recorded the override — the same document disagreeing with itself. §3 is authoritative; this row now matches it. |
| `vocabulary.industryAssociation` | **none — delete badge row** |
| `vocabulary.guaranteeName` | EBS Service Guarantee |
| `geo.hqCity` / `hqState` | Faison / NC |
| `geo.trackingCity` | `faison-nc` |
| `geo.serviceArea` | Duplin, Sampson & Wayne Counties |
| `geo.serviceCounties` | Duplin, Sampson, Wayne |
| `geo.previewCities` | Clinton, Goldsboro, Mount Olive |
| `seo.regionLabel` | Goldsboro–Clinton, NC |
| `theme.slug` / `siteKey` | `ebs` / `ebs` |
| `tracking.gtmId` | **N/A — not launching with tracking** |

**Theme tokens** (all in one `body.theme-ebs` block in `global.css`, never `theme.css`):

```
--color-brand-primary:         rgb(22, 133, 204)   /* #1685CC */
--color-brand-primary-hover:   rgb(19, 118, 180)   /* #1376B4 */
--color-brand-secondary:       rgb(221, 168, 44)   /* #DDA82C */
--color-brand-secondary-hover: rgb(206, 155, 34)   /* #CE9B22 */
--color-default-background:    rgb(245, 248, 251)  /* #F5F8FB */
--color-default-font:          rgb(23, 41, 58)     /* #17293A */
--color-brand-tertiary:        rgb(88, 116, 138)   /* #58748A */
--font-heading-*:  "Barlow Semi Condensed"
--font-body:       "Inter"
```

**Pages:** service pages from a flat 10-item list (3 are SEO keyword variants — recommend no routes). City pages: Goldsboro, Clinton, Mount Olive, Warsaw, Faison, Kenansville.

---

## 3. CLAIMS REGISTER — read before writing any copy

⚠️ **This section is CURRENT through 2026-09-01** and is authoritative, unlike the rest of this file (see the banner at the top). Four categories now: **Cleared**, **MUST NOT ship**, **UNVERIFIED CAPABILITIES** (what EBS may or may not do) and **OPERATIONS CLAIMS** (how EBS works) — the last added 2026-09-01, both under "Needs pinning down before launch" below.

This is the highest-risk area of this build. Several claims were corrected during intake.

### Cleared to use
- Licensed, Bonded & Insured *(owner-confirmed)*
- In business since 2006 (20 years)
- OSHA Certified Roofers *(OWNER OVERRIDE 2026-08-27 — see below)* / crews hold OSHA 10 & 30-hour cards
- Free estimates — no charge, no obligation
- Lifetime warranty on full roof replacements EBS installs *(pending definition — see below)*
- Residential **and** commercial
- Family-run and locally owned *(owner-confirmed 2026-08-28; added when the trust-badge marquee shipped. Was NOT in the original register — it appeared nowhere in the intake CSV or config, and was flagged before use.)*

### MUST NOT ship
| Claim | Why |
|---|---|
| ~~"OSHA Certified"~~ — **OVERRIDDEN, NOW SHIPPING** | ⚠️ **Ryan directed on 2026-08-27 that the site say "OSHA Certified", after being shown this row and its reasoning.** Deliberate decision, not an oversight — do not "correct" it back without asking him. `vocabulary.credentialTitle` is now "OSHA Certified Roofer" and renders in 4 wrappers (BusinessStatistics, CertifiedArborists, ServiceArea, AssociationBadge). **The underlying fact is unchanged and the exposure is real:** OSHA certifies neither companies nor individuals, and its Outreach Training Program forbids advertising course completion as certification. What EBS crews actually hold is OSHA 10 & 30-hour completion cards. If this is ever walked back, "OSHA 10 & 30-Hour Trained" is the strongest accurate substitute. |
| "OSHA Trusted Company" | Still MUST NOT SHIP. The override above covers the word "Certified" only. |
| "BBB A+" | No BBB profile exists. Owner's original answer contradicted his own BBB row. |
| "CertainTeed ShingleMaster Premier" | **Real and top-tier** (highest tier of Contractor's EDGE, replaced SELECT ShingleMaster in 2026) — but **unverified**. Verify via CertainTeed Find a Pro or 800-782-8777, then add to the licensed descriptor. Biggest single upside available. |
| Any star rating, review count, or `aggregateRating` | Only 3 Google reviews exist. Decision: render as **named testimonials only**. ⚠️ **THIS ROW IS CURRENTLY VIOLATED IN PRODUCTION CODE** — `CLIENT.reviews.trustBadge` / `reviewCount` render a `5.0★ · 3 Google reviews` badge in the hero and in TrustHeadlineRatingsWrapper, verified in served HTML 2026-08-30. `client.config.ts` documents that as a deliberate restoration, so the two files disagree in writing. Unresolved — see the Redesign handoff §6. |
| ~~"1000+ homes/businesses serviced"~~ — **CLEARED** | Was carried as unverified. Ryan confirmed VERIFIED 2026-08-27. Renders in `BusinessStatisticsWrapper`. |
| Any trade-association badge | Not a member of anything. Delete the row, don't substitute. |
| Emergency / 24-7 / after-hours copy | No emergency number. Template ships with these surfaces — remove all of them. |

### Needs pinning down before launch

- **UNVERIFIED CAPABILITIES — a third category, added 2026-08-31.** These are
  neither cleared nor banned: nobody has asked whether EBS does them. They
  are listed because they have now been dropped from TWO sections on
  evidence grounds, and the same judgement will otherwise be re-derived
  every time a competitor reference is used as a design source.

  | Capability | Where it came up | Status |
  |---|---|---|
  | Insurance claim support / storm claim filing | About capability pills; Contact process step 4 (the reference's own step 4) | Dropped — absent from intake, `client.config.ts`, and the service routes |
  | Roof cleaning & maintenance | About capability pills | Dropped — same |
  | Storm damage repair & tarping | About capability pills | Dropped — same. NB "storm damage" is close to, but not the same as, the banned emergency/24-7 copy: repair work after a storm is fine, a 24-7 response promise is not |
  | Commercial membrane systems — TPO, PVC, EPDM, roof coatings, seamless drainage | About commercial card | Dropped — same |

  The bar is low: one answer from the owner moves any of these to CLEARED,
  and each is a real revenue line. Until then, a capability list is a claim
  per line — a pill saying "Insurance Claims Support" is a promise, not
  decoration. EBS's seven actual service routes are the safe substitute and
  are what both sections now use.

  ⚠️ Do NOT infer a capability from a competitor's site. All four above came
  from Shingle Hut references supplied as LAYOUT direction; the layout was
  the ask, the capability list came along with it.

- **OPERATIONS CLAIMS — a FOURTH category, added 2026-09-01.** The three
  categories above all describe *what EBS does*. This one describes *how EBS
  works*, and it is the category most likely to be invented accidentally,
  because it reads as tone rather than as a claim while writing prose.

  The case that prompted it: on 2026-09-01 the phrase **"never subcontracted
  out"** was written into city-landing copy and walked back to **"our own
  crews, start to finish"**, which is the wording already shipping in
  `cityLandingData`. The register clears *family-run* and *locally owned*; it
  does **not** clear a negative promise about subcontracting. Those are
  different claims: one describes ownership, the other is an absolute
  operational guarantee a competitor could hold him to, and a single
  subcontracted crew on a single job makes it false.

  | Pattern | Why it is a claim, not tone |
  |---|---|
  | "never subcontracted" / "no subcontractors, ever" | An absolute. One exception falsifies it. Use "our own crews, start to finish" — already shipping, already approved. |
  | "same crew from start to finish" | Staffing promise. Not in the intake. |
  | "we answer every call" / response-time promises | Adjacent to the banned 24-7 / emergency copy, and fails for the same reason: there is no emergency line. |
  | "no-pressure" / "no hidden fees" / "no upsells" | Sales-conduct promises. Cheap to write, enforceable in a complaint. |
  | crew size, truck count, jobs-per-week figures | Numbers invite verification. Only "1000+ homes/businesses serviced" is cleared. |

  ⚠️ **The tell is the absolute.** *Never*, *always*, *every*, *no*
  and *only* turn a description into a guarantee. If a sentence would still
  be true after one bad day on one job, it is description; if one exception
  breaks it, it is a claim and needs the owner. When in doubt, restate as
  what EBS *does* rather than what it *never* does — that is exactly the
  edit that fixed the case above.

- **What "lifetime warranty" means** — lifetime of the roof, of the original owner, transferable? It appears in FAQ Q8 and the guarantee terms. Customers will hold him to it.
- **"Same-Day Roofing"** is the owner's chosen signature phrase. Credible for **repair**; not for replacement. Keep it attached to repair/response/estimates in body copy.

---

## 4. Client-specific deviations from the template

Things this fork does differently from Medrano's:

1. **No tracking at launch.** Step 8 does not run. **Leave the `data-*` click attributes and dataLayer pushes in place** — inert without a container, and keeping them means switching on later is one env var instead of re-instrumenting every wrapper.
2. **No logo file exists.** Needs a text wordmark in both navbar and footer, or a named placeholder + Open Item. Asymmetric failure: navbar path is a hardcoded constant with no error handling (renders Medrano's logo if unswapped); footer hides itself silently on load failure.
3. **No social profiles.** Delete `FooterSection.tsx` social hrefs. Google and Yelp are review platforms, not social.
4. **No property-type field on forms.** Accepted trade-off: commercial leads arrive unqualified.
5. **Residential leads the hero**, commercial stays visible but secondary.
6. **Two distinct photo sets** — residential (single-family, warm daylight) vs commercial (flat roofs, larger buildings). Don't blend them in one section.

---

## 5. Step 0 pre-check

| Rule | Status |
|---|---|
| Phone digits consistent across formats | **PASS** |
| E.164 format | **PASS** |
| `siteKey` lowercase letters, no hyphens, no leading digit | **PASS** (`ebs`) |
| `siteKey` and `theme.slug` refer to same client | **PASS** |
| `hqState` 2-letter abbreviation | **PASS** (`NC`) |
| `serviceAreaLabel` is a label, not a city list | **PASS** |
| Exactly 3 `previewCities` | **PASS** |
| At least one offer or explicit opt-out | **PASS** — Free Roof Inspection & Estimate |
| Sender domain Resend-verifiable | **FAIL — DNS access unconfirmed** |

### Blockers to clear before Step 1
1. **DNS access to `exteriorbuilderservices.com`.** Determines whether email sends from his domain or the template's. A Gmail address cannot be the sender.
2. **Logo decision** — wordmark or placeholder. Blocks Step 5.
3. **License number** — NCLBGC public lookup at nclbgc.org by license name returns number, classification, and tier. Tier caps commercial bid size.
4. **Hero headline** — 8 options in the intake, owner to pick.

### Open decisions
1. **`nameShort` / possessive must agree.** Currently EBS + "EBS's". If "Exterior Builder's" is preferred, `nameShort` becomes "Exterior Builder".
2. **Offer expiration** — `12/31/2026` is a placeholder on an evergreen offer. Set a real rolling date or opt out of the offers surface.
3. **Verify "Johny" vs "Johnny"** in the street address against the Google listing.
4. **`service.trackingSlug`** is `exterior-contractor` but `tradeName` is "Roofing & Siding" — align before tracking is ever switched on.

---

## 6. Style guide correction — carry this forward

The EBS style guide's §3 contrast table was **computed against pure white (`#FFFFFF`), not the actual `--color-default-background` (`#F5F8FB`)**. Corrected values:

| Pairing | Guide said | Actual |
|---|---|---|
| Navy on background | 14.8 | **13.93** |
| Steel `#58748A` on background | 4.9 | **4.60** |
| Primary `#1685CC` on background | 4.0 | **3.74** |
| Gold on background | 2.2 | **2.03** |

All verdicts survive, but **steel blue passes AA normal by only 0.10** — and it's specified for eyebrows and captions, which is small text. Darken it a step or restrict to ≥18.66px. The button rows (white on primary / primary-hover) were correct as written.

Also unchanged and still true: buttons use `--color-brand-primary-hover` as their **resting** fill; gold is never a text color on light.

---

## 7. Medrano surfaces to strip during the fork

From `DUPLICATE.md`, plus what we found:

- ISA arborist wrapper and `/logos/isa.svg` badges → **delete outright** (no association)
- Hardcoded `uid=medranos-tree-service` review embed → replace with testimonials
- The county `<ul>` → Duplin, Sampson, Wayne
- `bodyClass` on **every** route → `theme-ebs font-body`
- SEO title + description in **every** `.astro` route — hardcoded per route, not derived from config
- All tree-service vocabulary throughout
- Run **both encoding sweeps** before `npm run dev` — copied source throws esbuild JSX parse errors otherwise
- Verify Vercel env vars in the new project before pushing to main

---

## 8. Suggested opening for the next chat

> Forking Frame-Sites for Exterior Builder Services Inc. (EBS), a roofing and siding contractor in Faison, NC. Attached: `CLAUDE.md`, `DUPLICATE.md`, `INTAKE_ExteriorBuilderServices_v4.csv`, the EBS style guide, and this handoff brief. Intake is complete except for photo assets. Start at Step 0 validation, then Step 1. Dependency order is 1 → 1.5 → 4 → 2 → 3 → 6; expect a broken build in between.

**Still blank in intake (owner-supplied):** hero image/video, before/after photos, coupon files, BCC address. Offer minimum label is intentionally blank.

---

## 9. Status update — 2026-08-23

This file is a **historical intake record** and is deliberately left as
written. §3's CLAIMS REGISTER is still the authoritative source for what
EBS may and may not say — the redesign handoff defers to it. What follows
is only the delta, so the blockers above are not read as still-open.

### Resolved since Step 0/1
- **Logo.** No longer a blocker. `ebs-logo.png` exists — a real stacked
  lockup, trimmed to its ink bounds and recompressed to 23 KB. §4's
  "no logo file exists" and §5's "logo decision blocks Step 5" are closed.
- **Theme tokens.** All of §2's values are live in `body.theme-ebs` and
  match this file exactly. Verified against `client.config.ts`.
- **Config values.** §2's table matched `client.config.ts` field for field
  when this was written. ⚠️ It no longer reliably does — see the
  2026-08-30 delta below. `client.config.ts` is authoritative.

### Delta — 2026-08-30 (end of the section-redesign sessions)

- **§2 DRIFTED and was reconciled.** Its `credentialTitle` rows still read
  "OSHA-Trained" while §3 recorded the owner override to "OSHA Certified"
  that had already shipped — the same document contradicting itself for two
  days. Fixed, but the episode is the argument for not treating §2 as a
  source of truth at all: it duplicates 19 fields that `client.config.ts`
  already owns, so it can only ever rot.
- **§3 gained three entries** during the design sessions: the OSHA override
  (2026-08-27), "1000+ serviced" cleared (2026-08-27), and "family-run and
  locally owned" added after being flagged as undocumented (2026-08-28).
- **§3 gained a live violation warning.** The "no star rating / review
  count" row is currently CONTRADICTED by shipping code — see that row and
  Redesign handoff §6. Unresolved, needs a decision.
- **§5's hero-headline blocker is closed** — `HeroWrapper` ships a chosen
  headline. DNS access and the NCLBGC licence number remain genuinely open.
- **§7 is only partly done.** `AssociationBadgeAreasslotterWrapper.tsx` and
  `/public/logos/{isa,tcia,bbb,angi}.svg` are still on disk — orphaned, not
  deleted. Tracked as an asset orphan in the Redesign handoff §6.

- **TWO LIVE MUST-NOT-SHIP VIOLATIONS WERE REMOVED FROM THE HOME PAGE**, both
  as a side effect of deleting the About Us disclosure in
  `ServiceAreaWrapper_v1_1` rather than as a claims pass:
  - "5-Star Certified Tree Experts" — a star claim, banned by the register's
    "any star rating, review count or aggregateRating" row.
  - "see what our clients are saying on Google, Facebook, and **Angi**" — EBS
    has neither a Facebook nor an Angi profile (intake rows 52 and 54).
  Verified absent from the served HTML 2026-08-30. ⚠️ This does NOT resolve
  the star-rating row: `CLIENT.reviews.trustBadge` / `reviewCount` still
  render in the hero badge and TrustHeadlineRatingsWrapper, and that
  contradiction remains open and needs Ryan's decision.

### Still open, unchanged
- DNS access to `exteriorbuilderservices.com` (Resend sender domain)
- NCLBGC licence number — `CLIENT.certifications` stays empty until it lands
- Offer expiration date (`12/31/2026` placeholder)
- "Johny" vs "Johnny" in the street address
- `service.trackingSlug` (`exterior-contractor`) vs `tradeName`
  ("Roofing & Siding") — must be settled BEFORE a container exists

### New, found during the redesign
- **`/images/og-default.jpg` does not exist**, but `CLIENT.seo.ogImage`
  points at it on all 18 routes. Every social share preview is broken.
  See `EBS_HOME_ASSET_MAP.md`. This is the exact post-fork failure root
  §4.6 warns about, and nothing surfaces it locally or in the build.
- **§3's "24-7 / after-hours" prohibition is being violated in code.**
  `BusinessStatisticsWrapper` renders "24/7 Support Availability" and the
  guarantee section's contact block renders "Available 24/7". No emergency
  line exists.
- **"18+ Years" contradicts `yearFounded: 2006`** (= 20 years, which §3
  clears). Arithmetic error rather than an unsupported claim.
- **Two distinct photo sets (§4.6) is not yet achievable** — only three
  genuinely-EBS photos exist. Everything else is still the previous
  client's tree-service imagery under EBS filenames.

### Where redesign work is tracked
`EBS_HANDOFF_Redesign.md` — start there for the current build.
