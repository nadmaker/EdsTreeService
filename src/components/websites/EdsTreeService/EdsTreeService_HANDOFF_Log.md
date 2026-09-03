# Ed's Tree Service — Build Log (session handoff)

Running notes for the Ed's Tree Service build, one dated entry per session,
APPEND-ONLY. Started 2026-09-03 (the fork session, commit `3be18b1`).
Companion to `EdsTreeService_HANDOFF_Step0-Step1.md` (the fork handoff —
its §3 is the CLAIMS REGISTER) and to the dated session briefs
(`EdsTreeService_HANDOFF_Session-YYYY-MM-DD.md`), which are SNAPSHOTS
written at the end of a session for the next one and are never edited after.

This file holds what is NOT already captured in the CLAUDE.md files: the
per-session record of what changed and why, the measurements, the working
agreements, the verification workflow, the techniques that turned out to
matter, and the open decisions. Anything about tracking VALUES lives in the
client CLAUDE.md §3; the client CLAUDE.md §8 is the CURATED subset of §6
below — this file keeps the full history.

How to use it (instruction for every session):
1. At the start, read §6 (open items) and the previous entry under §1.
2. During the session, add an entry under §1 "Done so far" headed
   `### {what changed} ({date})` for each BIG change — a section rebuilt,
   a wrapper rewritten, an asset pass, a deploy, a decision made with the
   owner. Say what was true before, what is true now, what was measured,
   and what it depends on. Small edits go in the commit message only.
3. Update §6: add rows for anything the session surfaced; strike resolved
   rows with `~~…~~` and the date — never delete a row.
4. At the end, refresh the "last updated" line below, then write the
   dated session brief for the next chat.

Last updated: **2026-09-04** (free-renames and hygiene pass).

---

## 1. What this work is

Standing up Ed's Tree Service on the Frame-Sites template as a fork of the
Exterior Builder Services build (same owner), then taking it from a
placeholder-imaged, verified-but-undeployed state to a launched site.
Everything generated must be Ed's-themed via tokens, never hardcoded values
(root §4), and every visitor-facing string passes the CLAIMS REGISTER
(`EdsTreeService_HANDOFF_Step0-Step1.md` §3) before it ships.

### Done so far

### Free renames, the offer strike, and code hygiene (2026-09-04)

The first working session after the fork. Scope was deliberately the work
that is FREE NOW AND PERMANENT LATER — every section-name change stops being
free the moment a GTM container exists — plus the hygiene items that needed
no owner input. Two owner decisions arrived mid-session and changed it: no
offer/offer-card work in this repo, and **the only offer the business makes
is free estimates**. Nothing was deployed; the site is still undeployed and
untracked, and every photograph is still a placeholder.

**Owner decisions (2026-09-04), recorded where the value lives**

1. **The 10% offer is struck.** "10% Off Your First Tree Service" was the one
   entry in `CLIENT.offers.items` and the lead slide of the /about carousel.
   The owner's word is that free estimates — already a cleared claim — is the
   only offer. A discount the business does not give is a live false claim,
   so this was treated as a CLAIMS REGISTER fix rather than offer feature
   work. Recorded in `client.config.ts` and client CLAUDE.md §3.5.
2. **No offer/offer-card work in this repo.** Consequently the `hero-offers`
   rename (open item 8.4.9), which was in the session's original scope, was
   NOT done. Skipped deliberately, not forgotten: the /about carousel's
   future is undecided, and if the section is dropped the rename is moot. It
   is still free while no container exists.

**What was true before → what is true now**

| | Before | Now |
|---|---|---|
| Landing form section | `contact-form` — the SAME name the home form emits, separable only by `page_type` | `landing-contact-form` |
| Service-page form `view_section` | `data-section` present, NO observer of either mechanism — the conversion section never reported a view | Mechanism A (`data-track-view`), deduped by section name |
| Service-page lead email | "Service: **tree-removal**" — the kebab tracking slug reaching a human | "Service: **Tree Removal**" via a new optional `serviceLabel` prop |
| Home form scoping | `document.getElementById(id)` — the `#home-contact` anchor doubling as the form key | `data-form="contact-estimate"`; all four wrappers now canonical |
| Home services grid | 5 tiles in a 4-column grid; CTA alone on row two | 3-up at lg, CTA spans 2; both rows fill at every breakpoint |
| Hours | One /about FAQ answer | Footer, all 14 routes |
| Offers | One 10% discount | None; /about carousel is two editorial slides |

**Why each was done the way it was**

- **The landing-form rename was checked for style coupling first.** The six
  scoped `[data-section="contact-form"]` rules in `global.css` were in scope
  on the six city landings the whole time. They were inert only because
  LandingContactForm is Variant C and renders **zero `<label>` elements** for
  those selectors to match — verified by grep before renaming. So the rename
  is analytics-only with no visual consequence, and the "home only" comment
  in `global.css` became true rather than aspirational. If anyone later gives
  the landing form Subframe fields, it will no longer silently inherit the
  dark-band styling.
- **Mechanism A, not a React observer, on the service form.** ServicePageBLDR
  mounts that wrapper TWICE per service page (a mobile copy and a sticky
  desktop copy) under one section name. Mechanism A dedupes by section NAME,
  so the pair cannot double-fire; a React observer keys on the element and
  would have needed per-copy guard refs to reach the same place. Do not add
  a React observer alongside it — together they double-fire.
- **`service_type` was fixed additively.** A new OPTIONAL `serviceLabel` prop
  with the old chain kept as the fallback (`serviceLabel || trackingService
  || formName`), so a caller that passes no label behaves exactly as before.
  The kebab slug is untouched as the tracking value — verified in served HTML
  that service pages still emit `data-service="tree-removal"`. Only the API
  payload changed, and only that one line wants the human name.
- **No fifth service card was invented** to square the grid. A fifth service
  would be an UNVERIFIED CAPABILITY claim (client CLAUDE.md §8.2.3). The CTA
  tile spans instead. The span works only because the grid takes its children
  directly (root §6.5) — wrapping the tiles in per-child divs would silently
  break it, which is now a comment in the file.
- **Hours went to the footer only**, not also the /contact info column. One
  canonical placement rather than two to keep in step. The slot is optional
  and the column count follows the same condition, so a future client with no
  settled hours gets the 3-up contact row back rather than an empty cell.
  ⚠️ This raises the stakes on the open Sunday question: the string is the
  owner-cleared "Open every day, 8 AM–7 PM" printed VERBATIM and site-wide,
  and must not be reworded to "7 days a week" until §8.2.2 is answered.

**Measured (all 2026-09-04, dev server, served HTML)**

- All **14 routes 200**, 212,727–300,590 bytes (was 211,948–299,755 on
  2026-09-03; the ~800-byte rise is the footer hours cell on every route).
- **"10% off" → 0 occurrences** across all fourteen routes. /about carousel
  is 2 dots / 2 thumbs (was 3), and `edstree-gallery-4.jpg` — the offer
  slide's photo — no longer appears on the page at all.
- **Section inventory verified per route pattern**: the six landings emit
  `landing-contact-form`, only the home page emits `contact-form`, and
  `service-contact-form` appears **twice** on a service page, both carrying
  `data-track-view`.
- **Zero duplicate ids** on all six sampled route patterns.
- **Banned-term sweep clean**: word-boundary `ISA`, `certified`, `arborist`,
  `licensed`, `TCIA` all **0** across the concatenated HTML of all 14 routes.
- **Image preloads**: home 2, service 2, city landing 2, **/about 4** — the
  odd one out, logged as a new open item, not acted on.
- `/og/default.jpg` 200 at **65,369 bytes** (unchanged — hero and logo
  untouched); `/favicon.png` and the geojson 200; the must-404 set
  (`/offers`, roofing/siding/gutter slugs, `/service-area/durham`,
  `/reviews`) all 404.
- Contrast: the footer's two contact captions moved `neutral-500` →
  `neutral-600` for style-guide consistency beside the new hours caption.
  On the white footer `neutral-500` measures **4.74:1**, which passes AA at
  that size — so this was consistency, not a failure being fixed.
- `npm run build` and `npx tsc --noEmit` both pass. tsc was canary-checked
  (a deliberate type error produced exactly 1 diagnostic) per root §11.7,
  because a silent tsc is indistinguishable from a clean one.

**Two probes that lied, both worth remembering**

1. **`grep -rlI $'\r' src` reported NO CRLF files on a tree that is 102 of
   162 CRLF.** The fork session's note that "the four builders and the og
   card" are CRLF is wrong and has been corrected in client CLAUDE.md §7.4:
   it is all of `src/ui/`, `src/pages/api/contact.ts`, the og card, THREE of
   the four builders (`EdsTree-Contact.tsx` is LF) and five section wrappers.
   The symptom was a literal replacement failing with "found 0" against a
   file that visibly contained the text. Enumerate with node
   (`readFileSync(p,"utf8").includes("\r\n")`), never that grep.
2. **A stale dev server answered on the port `astro dev` had NOT bound to.**
   The new server reported port 4400 while 4399 also returned 200 — five
   orphaned `node` dev-server processes were still running from earlier
   sessions. Both happened to serve current code, but a sweep run against the
   wrong one would have silently measured a different build. Always check the
   port the server actually reports, and kill strays before sweeping.
3. **A "1,414 hit" ISA alarm was `:disabled` in the inlined CSS.** Substring
   grepping for short credential acronyms over served HTML is worthless;
   use `\b` word boundaries. This is the third distinct instance of the
   verify-the-probe rule paying for itself in this repo.

**One tooling trap fixed at the source.** The scripted-copy-pass helper used
`String.replace(find, replaceString)`, and a replacement containing `$'`
(here, the literal shell snippet `grep -rlI $'\r'`) is interpreted by
`String.replace` as "everything after the match" — it spliced the whole file
tail in. The once-per-file assertion caught it before anything was written.
The helper now passes a replacer FUNCTION (`() => replace`), which disables
`$` interpretation entirely. Any future scripted pass should do the same.

**Depends on / does not include**

- Nothing here is verified in production; the site is still undeployed, so
  the served-HTML evidence above is dev-server evidence (root §11.9: there is
  no local production-equivalent server under the Vercel adapter).
- All section renames remain free ONLY until a GTM container exists. The one
  still outstanding is `hero-offers`.
- The `service_type` fix cannot be end-to-end tested until Resend is
  configured — there is still no key, no verified sending domain and no
  domain. The fallback chain and the display name reaching the client were
  verified statically instead (island props carry `"service":"Tree Removal"`).

---

### The fork itself (2026-09-03)

DUPLICATE.md Steps −1 → 7, 9 and 10 in one session; Step 8 skipped by
decision. Full detail, in the order it happened, is in
`EdsTreeService_HANDOFF_Session-2026-09-03.md` §2; the current state is the
client `CLAUDE.md`. Recorded here so this log's history starts at the start:

- Source: the EBS repo @ `673bdd7`, exported with `git archive HEAD`
  (fresh history, `.env` excluded), NOT the stale template repo.
- Identity: folder `EdsTreeService`, siteKey/theme `edstree`.
- Config, theme (`body.theme-edstree`, style guide "Sawdust"), four
  service routes, six city routes, icon set, all copy re-authored against
  the register; the seven inherited EBS defects that could be closed here
  were closed (reviews/ratings removed, property_type removed, distinct
  formIds on /contact, always-mounted mobile menu, offer self-link, the
  unread shared arrays, six orphaned tree-claim wrappers deleted).
- Every photograph, both logos and the favicon are GENERATED PLACEHOLDERS
  from `scripts/placeholders.mjs`.
- Verified: build + tsc pass; dev-server sweep of all 14 routes clean
  (status, bytes, must-404s, assets, duplicate ids, banned terms).
- Not deployed. Not tracked. Photos pending.

Measurements worth keeping (all 2026-09-03): white on primary 5.45:1, on
primary-hover 7.21:1, primary on background 5.07:1, body text on background
15.34:1, amber on background 2.37:1, white on amber 2.55:1, body text on
amber 6.48:1 (so amber is fills-only with dark labels); home page ships two
image preloads; og card 65,369 bytes; route sizes 211,948–299,755 bytes.

---

## 2. Non-negotiables when changing a section

Inherited from the EBS redesign and still true here:

- The CLAIMS REGISTER is a gate, not a reference. Reference sites, style
  guides and the template's own defaults all carry claims; drop, do not
  reword, anything not on the cleared list. The tell is the absolute
  (never / always / every / no / only).
- Tokens, never literals (root §4). Ed's-only slots are consumed as
  `text-[var(--…)]`; the og card is the one place literals are allowed,
  and each one is labelled with the token it mirrors.
- Every generated section carries the full tracking contract
  (`data-section`, city, service, page_type, and `data-track-view` or a
  React observer — never both) and reuses an existing section name where
  the section is logically the same (root §8.5).
- Owner overrides are recorded where the value lives, dated, with the
  objection (client CLAUDE.md §7 / EBS §7.2 pattern).
- Defaults are content (root §13.3.8), in both directions: grep every
  call site before editing OR trusting a default.
- Amber is a fill, green is text (style guide §4). Amber CTA labels are
  `--color-default-font`; no amber text, borders or icons on light grounds;
  no amber inside primary-green sections.

## 3. Verification workflow

### 3.1 Static tracking check
No GTM container exists, so GTM Preview is unavailable. Curl the route,
grep the attribute set, and derive the payload the bridge would build.
Strip `<style>` first or grep for element roots — the inlined global.css
makes `contact-form` appear on every route.

### 3.2 Served-HTML sweep (the one that worked)
Start `npx astro dev --port 4399 --host 127.0.0.1 > log 2>&1` in the
background (NEVER piped into `head` — that kills the server when `head`
exits). Then, for every route: status + bytes + `<title>`; the must-404 set
(`/offers`, old service and city slugs); `/og/default.jpg`, `/favicon.png`,
the geojson and every `/images/…` path referenced in `src/`; duplicate ids
(`grep -oE ' id="[^"]+"' | sort | uniq -d`); the `data-section` inventory;
and a case-insensitive grep of the concatenated HTML for previous-client
names, trade terms, banned claims and old slugs. After deploy, repeat
against the live URL (root §11.8) and grep the served JS chunks for the
Maps key on a SERVICE page.

### 3.3 Contrast
Measure on pixels, never getComputedStyle (root §11.10). Any new scrim,
gradient or tinted ground gets its worst-case ratio recorded in the entry
that introduced it.

### 3.4 Always finish with
`npm run build` and `npx tsc --noEmit` (tsc only reports after a build has
produced `.astro/types.d.ts`), then the sweep, then this log, then the
session brief.

## 4. Working agreements

- Stage by explicit path in the EBS checkout (another session may be live
  there). The EdsTreeService repo has no other session.
- Verify the probe before reporting a failure (dead server, wrong tag,
  hidden half of a desktop/mobile pair, CSS text matching a section grep).
- Raise a concern once; if Ryan reaffirms, proceed and record it.
- Plan-mode defaults per root §11; content substitutions inside existing
  structure are accept-mode.
- `.env` is NOT committed on this repo. PUBLIC_ values go in the Vercel
  dashboard; the five runtime values ONLY work from the dashboard.

## 5. Techniques worth reusing

### 5.1 Scripted, asserted copy passes
For any edit touching more than a handful of files, write a node script
that replaces exact literals and asserts each occurs exactly once, so a
drifted file fails loudly. Normalise CRLF → LF before matching and restore on write. ⚠️ CORRECTED
2026-09-04: line endings are MIXED far more widely than the fork session
recorded — 102 of 162 tracked files under src/ are CRLF (all of src/ui/,
src/pages/api/contact.ts, the og card, THREE of the four builders — only
EdsTree-Contact.tsx is LF — and five section wrappers: FooterWrapper,
LandingServicesListWrapper, ServiceAreaGoogleMap, ServiceONEFaqWrapper,
ServiceONEtallLocationWrapper), not "the four builders and the og card".
The probe that produced the wrong number, `grep -rlI $'\r' src`, returns
NOTHING on this tree; enumerate with node instead:
`readFileSync(p,"utf8").includes("\r\n")`.
WHY the tree is mixed, established 2026-09-04: .gitattributes is
`* text=auto` and core.autocrlf is true, so git stores LF in the index and
checks files out as CRLF on Windows. A file is CRLF because git last wrote
it and LF because some other tool did. The endings therefore carry no
meaning and the COMMIT is LF either way — preserving them on write is
cosmetic, but normalising before matching is mandatory, because the literal
you compose in a script is LF and most of the tree is not.
⚠️ Pass the replacement as a FUNCTION, not a string. String.replace
interprets `$'`, `$&` and a dollar-backtick inside the REPLACEMENT text, so
a replacement that itself contained the literal `$'` spliced the entire
file tail back in. Use .replace(find, () => replace). The once-per-file
assertion caught it before anything was written; without that assertion it
would have shipped a doubled document.
Read the RAW lines before composing a literal — a comment-stripped view
hides comment lines inside a block.

### 5.2 Large files through the file tool
The shell tool truncates commands past ~8 KB. Write big files with the
Write tool to a NEW path in the scratchpad, then `cp` into place; Write and
Edit refuse a path that was not Read in the same conversation.

### 5.3 Placeholders, not borrowed photos
`scripts/placeholders.mjs` renders a branded card per image slot with the
same Satori → resvg → sharp pipeline the og route uses. Replacing a file
under the same name is the whole swap; delete the slot from OUTPUTS once
its real image exists so a rerun does not overwrite it.

### 5.4 One clearance token
`--site-nav-clearance` / `--site-mobile-nav-clearance` on `html:has(body.theme-edstree)`
feed the navbar spacer, the hero padding, scroll-padding-top and both
sticky rails. Change the bar height there and every consumer follows.

## 6. Open items

⚠️ Current through **2026-09-03** (commit `3be18b1`, the fork session).
Add rows; strike resolved rows with the date; never delete. The client
CLAUDE.md §8 mirrors the curated subset with stable numbers — keep the two
in step in the same commit.

| Item | Status |
|---|---|
| **Not deployed.** No Vercel project. Runbook in the session brief §5: name `eds-tree-service`, delete every empty auto-detected env row before deploying, then the live sweep. | Open — next manual step |
| **Every photo, both logos and the favicon are placeholders.** 3 hero slides, 4 service heroes, 6 city heroes, 6 gallery images, `edstree-logo.png`, `edstree-logo-white.png`, `favicon.png`. Style guide §7 has the shot list. | Open — owner supplies files; same-name drop-in |
| **Contact form cannot send.** No Resend key, no verified sending domain, no domain at all. All five runtime values go in the Vercel dashboard. | Open — same blocker as EBS |
| **Google Maps key.** Extend the owner's existing key's referrer list to the new origin (or issue a new key), choose/clone the Map ID, set the two `PUBLIC_GOOGLE_MAPS_*_EDSTREE` vars, redeploy. Service pages show the fallback panel until then. | Open |
| **Owner answers pending:** legal entity form (prints on /privacy); "every day" = 7 days?; capabilities list (crane implied, land clearing, tree health, cabling, firewood, commercial contracts — all UNVERIFIED, none shipping); offer expiry (`validThrough` empty, nothing renders it); guarantee terms beyond "satisfaction guaranteed"; own Google listing and number vs reusing EBS's. | Open |
| **Draft copy without owner sign-off:** FAQs (/about six, service pages five), process steps (both wrappers), why-us cards, stats band, hero headline "Same-day tree removal, done safely", service one-liners, six city descriptions. All cleared-claims-only. | Open — content review |
| ~~**Home services grid: four cards + the CTA tile in a four-column grid** — the tile sits alone on row two at desktop.~~ | ~~Open~~ **RESOLVED 2026-09-04** — 3-up at lg, CTA spans 2 |
| ~~**`contact-form` name collision.** LandingContactForm's `trackingSection` default is `contact-form`, the same as the home ContactFormWrapper.~~ | ~~Open~~ **RESOLVED 2026-09-04** — now `landing-contact-form` |
| **`hero-offers`** is still the wrong name for the /about carousel (EBS 8.2.6). ~~**`service-contact-form`** carries the attribute with no observer (EBS 8.6.2).~~ | `hero-offers` **still open** — deliberately skipped 2026-09-04 (no offer work in this repo, per owner); observer **RESOLVED 2026-09-04** |
| ~~**Hours** (`CLIENT.business.hoursDisplay`) shown only in the /about FAQ; footer and contact column do not show them.~~ | ~~Open~~ **RESOLVED 2026-09-04** — footer, all 14 routes. /contact column deliberately left out: one canonical placement |
| ~~**RightRail service-page form sends the kebab-case slug as `service_type`** ("Service: tree-removal" in lead emails) (EBS 8.3.3).~~ | ~~Open~~ **RESOLVED 2026-09-04** — new `serviceLabel` prop; emails read "Service: Tree Removal" |
| ~~**ContactFormWrapper scopes with `getElementById`**; `data-form` is canonical (EBS 8.5.6).~~ | ~~Open~~ **RESOLVED 2026-09-04** — all four wrappers canonical |
| **No promotional offer exists.** `CLIENT.offers.items` emptied 2026-09-04 on the owner's word that the only offer is FREE ESTIMATES. The /about carousel is two editorial slides. Never hardcode a third to fill it. | Closed as a decision — listed so it is not "fixed" back |
| **/about ships FOUR image preloads**, every other route two (root §9.13). Measured 2026-09-04, not acted on; the carousel is the likely source. | Open — first performance pass |
| **Footer legal row still `neutral-500`** (copyright, "Website Designed With") — 4.74:1 on the white footer, passes AA at body size. | Open — next style pass, deliberate choice |
| **City landings have no `<h1>`** (HeroSectionAlt2 renders a span) (EBS 8.5.4). | Open — theme tab or wrapper-authored hero |
| **768–1024px horizontal overflow band** (EBS 8.5.3) — not re-measured here. | Open — re-measure |
| **Two service-area map implementations** (inline SVG on home + landings; Google Maps on service pages) (EBS 8.5.8). | Deferred, deliberate |
| **Wrapper header comments still narrate EBS decisions** (roofing photos, OSHA, gold). Comments only; served HTML is clean. | Open — tidy when a file is edited anyway |
| **Template-level:** backport shared files to `nadmaker/Frame-sites`; reconcile DUPLICATE.md Step −1 with root §1 and the git-archive method (Steps 1/4/6 still say MedranosINC and `CLIENT.map.embedUrl`); add a "Free estimates?" row to `INTAKE_TEMPLATE.csv`; push/merge EBS's `673bdd7` (template v2) from `feat/ebs-section-redesign` to `main`. | Open — owed at the template, not here |
| **Tracking (Step 8) not run** by decision. When it runs: NEW container, swap the GA4 ID and all three Ads labels, three conversions per client CLAUDE.md §3.6, swap Mechanism 2, settle the free renames above first. | Deferred |
| **Vercel Hobby prohibits commercial use.** | Open — move to Pro before handover |

## 7. Where the authoritative detail lives

- Claims: `EdsTreeService_HANDOFF_Step0-Step1.md` §3.
- Current state, values, section inventory, forms, env: client `CLAUDE.md`.
- What happened in a given session, in order: that session's dated brief.
- Methodology: root `CLAUDE.md`; fork procedure: `DUPLICATE.md`.
