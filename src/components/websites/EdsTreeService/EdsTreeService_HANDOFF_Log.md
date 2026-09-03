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

Last updated: **2026-09-03** (fork session, commit `3be18b1`).

---

## 1. What this work is

Standing up Ed's Tree Service on the Frame-Sites template as a fork of the
Exterior Builder Services build (same owner), then taking it from a
placeholder-imaged, verified-but-undeployed state to a launched site.
Everything generated must be Ed's-themed via tokens, never hardcoded values
(root §4), and every visitor-facing string passes the CLAIMS REGISTER
(`EdsTreeService_HANDOFF_Step0-Step1.md` §3) before it ships.

### Done so far

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
drifted file fails loudly. Normalise CRLF → LF before matching and restore
on write: the four builders and the og card are CRLF, most files are LF.
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
| **Home services grid: four cards + the CTA tile in a four-column grid** — the tile sits alone on row two at desktop. Not eyeballed during the fork. | Open — check in the first design pass |
| **`contact-form` name collision.** LandingContactForm's `trackingSection` default is `contact-form`, the same as the home ContactFormWrapper. Separable only by page_type. Rename the landing form's section before a container exists. | Open — free now, permanent later |
| **`hero-offers`** is the wrong name for the /about carousel (EBS 8.2.6); **`service-contact-form`** carries the attribute with no observer (EBS 8.6.2). | Open — free renames until Step 8 |
| **Hours** (`CLIENT.business.hoursDisplay`) shown only in the /about FAQ; footer and contact column do not show them. | Open — copy decision |
| **RightRail service-page form sends the kebab-case slug as `service_type`** ("Service: tree-removal" in lead emails) (EBS 8.3.3). | Open — one wrapper, one builder |
| **ContactFormWrapper scopes with `getElementById`**; `data-form` is canonical (EBS 8.5.6). | Open — opportunistic |
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
