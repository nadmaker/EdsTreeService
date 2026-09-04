# Ed's Tree Service — session brief for the next chat (2026-09-04b)

Written at the close of the DESIGN session that ran 2026-09-03 16:40 →
2026-09-04 11:30. Snapshot for the next chat; never edited after. "b"
because the previous session's brief already took the 09-04 name (git dates
that session's commits 09-03 16:20). The authoritative running record is
`EdsTreeService_HANDOFF_Log.md` (§1 close-out entry + the five design
entries, §5.5–5.6 techniques, §6 open items); current state is the client
`CLAUDE.md`; claims are `EdsTreeService_HANDOFF_Step0-Step1.md` §3, and its
§7 now lists every string this session put on screen.

---

## 1. Where things stand

| Item | State |
|---|---|
| Branch / commit | `main` @ the design-session commit on top of `6b9a692` (see `git log -1`), which also carries `scripts/design-harness/`. **NOT pushed.** |
| Build | `npm run build` and `npx tsc --noEmit` pass on this exact tree (tsc canary-checked earlier in the session) |
| Sweep | dev-server sweeps during the session: six route patterns 200 (227–325 KB), one `<header>` per page, zero duplicate ids, image preloads still two on `/`; the band verified by computed styles at 1440 / 1024 / 768 / 390 |
| Deployment | **STILL NOT DEPLOYED.** No Vercel project |
| Tracking | Still no GTM container. Renames still free. New this session: section `hero-form`, labels `nav-topbar-*`, `nav-toggle-*`, `nav-mobile-email`, `hero-form-service-*`; every previous navbar label preserved byte-for-byte |
| Photos | All placeholders. `edstree-hero-2.jpg` is now AboutUsVariant2's temporary photo; `edstree-hero-3.jpg` has no consumer |
| Offers | None (unchanged) |
| `.env` | Not committed (unchanged) |

---

## 2. What changed this session

| | Before | Now |
|---|---|---|
| Navbar | `NavbarMainWrapper` — fixed floating bar, spacer, `heroBehind` | `NavbarTwoTierWrapper` — sticky (`top: -44px`) two tiers: info bar (phone as visible text at EVERY width, email, Google icon) scrolls away; main bar with the logo centred, hover + click + keyboard dropdowns, county → city flyouts, amber hard-shadow CTA. `--site-nav-clearance` 120 → 100px, mobile 97 → 88px; the heroes lost their clearance padding |
| Home hero | `HeroWrapper` 3-slide carousel | `HeroFormCardWrapper` (background layer, h1 at the 56px cap, uppercase strap, card column overhanging 96/64px onto the page colour) carrying `HeroEstimateFormWrapper` in its `card` slot |
| Home form | one (`contact-estimate`, #home-contact) | two: the hero's three-step form (`hero-estimate-form`, section `hero-form`) — services tiles → details → ZIP + address → "Thank you, {name}…". Canonical event chain, honeypot, composed message when the textarea is empty (the API requires `message`) |
| About block | `AboutUsVariant1` scrimmed story | `AboutUsVariant2` — two columns (photo left, uppercase headline + intake founding story right) on the **topographic chevron band**: default-font ground, procedural contour MASK (400px tile, posterise + Laplacian, neutral lines at .28), dark-ground rake, inline-SVG bevelled amber chevron, 48%→44.5% clip-path light panel; below md a plain light band |
| global.css | — | `--site-tex-topo`, `--site-ground-rake-dark`, `--site-chevron-face/-lit/-shade/-ghost`; clearance tokens retuned |
| Orphans kept on disk | — | `NavbarMainWrapper.tsx`, `HeroWrapper.tsx`, `AboutUsVariant1.tsx` |

Full reasoning, measurements and the probes that lied are in the log's five
design entries. Do not re-derive them. Two findings worth carrying: the
BACK button bug (React reused the button node as the submit button inside
the click's own dispatch — log §5.6) and the contour recipe swap (the
brief's discrete-band recipe gave blobs; posterise → Laplacian gives real
contour lines — log's band entry).

---

## 3. Read these first, in this order

1. `EdsTreeService_HANDOFF_Log.md` — the §1 **close-out entry**, then §6
   (open items), then §2 (non-negotiables), then the five design entries.
2. `CLAUDE.md` (client) — §2.2 tokens (the amber-on-green-black note), §3.6
   surfaces, §5.1 compositions, §6.6 the hero form, §8 open items 8.4.13–16.
3. `EdsTreeService_HANDOFF_Step0-Step1.md` §3 — the CLAIMS REGISTER, still a
   gate — and **§7**, which now lists every string this session added, none
   of it owner-approved.
4. Root `CLAUDE.md`; its §11 plan-mode defaults apply, and this session ran
   the band as a plan-mode brief → proposal → build, which worked well.

---

## 4. Open, in priority order

1. **Push, then deploy.** The design session is committed (one coherent
   set; build + tsc passed on the tree). The deploy runbook from
   the 2026-09-03 brief §5 (unchanged: Vercel → `nadmaker/EdsTreeService` →
   `eds-tree-service` → delete every empty auto-detected env row → live
   status-AND-bytes sweep). Hobby production is public: placeholder photos
   and un-signed-off copy become indexable.
2. **Owner review points from this session:** contour-line colour (neutral
   now; green = one class on AboutUsVariant2 layer 2 + opacity ~.45);
   the uppercase headline with "Trusted Tree Service" in green; Service
   Areas grouped by county in the navbar (flat = one MENU edit); the social
   row (only the Google icon, pointing at EBS's reused listing; Facebook /
   Instagram hrefs empty because no profiles exist); every string in
   Step0-Step1 §7's new block, incl. "storm cleanup" vs "storm clean-up".
3. **Tracking decision, free while no container exists:** should the hero
   form's NEXT/BACK be tracked? No taxonomy event fits; `form_step` is a
   root §11.5 decision. Also still free: the `hero-offers` rename, and
   `service-guarantee` now names an About block (rename candidate).
4. **Photos, logo, favicon** — placeholders; same-name drops, then
   `npm run build` re-renders the og card. AboutUsVariant2 wants a
   portrait (4:5) photo over a dark ground.
5. **Email** — no Resend key, no sending domain, no domain.
6. **Google Maps key** — referrer list, Map ID, two PUBLIC_ vars, redeploy.
7. **Owner answers:** legal entity; "every day" = Sunday?; capabilities;
   guarantee terms; own Google listing vs EBS's (now also behind the navbar's
   Google icon).
8. **Delete the orphans once signed off:** NavbarMainWrapper.tsx,
   HeroWrapper.tsx, AboutUsVariant1.tsx, edstree-hero-3.jpg.
9. **Inherited, unchanged:** /about ships 4 image preloads; footer legal row
   `neutral-500`; city landings have no `<h1>`; the 768–1024 overflow is the
   trust-badge marquee track (re-measured this session — not the navbar);
   two service-area map implementations; EBS narration in some wrapper
   comments.
10. **Template-level:** backport shared files to `Frame-sites`; reconcile
    DUPLICATE.md Step −1; push EBS's `673bdd7` to `main`.

---

## 5. Working rules (unchanged, plus what this session added)

- Log every big change as a dated `###` entry under §1 **as you go**; update
  the log §6 and the client CLAUDE.md §8 in the same commit; never edit a
  dated session brief; date by the machine clock.
- Stage by explicit path. Never `git add -A`, stash or reset in the EBS
  checkout.
- **Plan-mode briefs work:** for a design pass, prototype by INJECTING the
  candidate layers into the hydrated live page over CDP, measure, propose,
  wait for the decisions, then write files (log §5.5).
- **Verify the probe before reporting a failure** — this session's liars:
  CDP `clip` is page-relative after a scroll; `elementsFromPoint` ignores
  `pointer-events:none` layers; bracketed class selectors do not survive the
  protocol; a data-URI inside `style="…"` breaks on its own quotes; Edge
  caches decoded data-URIs (vary the seed for a cold raster); the
  "remaining stray process" was PowerShell matching its own command line.
- **Key conditional button rows** (log §5.6) and never put a JSX comment
  inside a parenthesised expression.
- Scripted passes: exact literals, once-per-file assertion, replacement as a
  FUNCTION, normalise CRLF before matching. The client CLAUDE.md was MIXED
  (one stray CRLF) — it is plain LF now.
- Contrast on pixels, worst case; tokens, never literals; defaults are
  content in both directions; no hex in wrappers (the band is the proof it
  can be done); amber on the green-black ground is deliberate at 6.48.
- Kill the dev server you started (by PID on the port it reported) before
  closing.

---

## 6. Verification recipe

`npm run build`, then `npx tsc --noEmit` (canary-check it), then start
`npx astro dev --port 4399 --host 127.0.0.1 > log 2>&1` in the background,
confirm the port it bound to, curl every route for status + bytes, duplicate
ids, the `data-section` inventory, `data-form` values, the swap-eligibility
audit (`tel:` anchors with a visible `.phone-number` span in the COLD HTML),
and the banned-terms grep. For anything visual or interactive, use
`scripts/design-harness/` (README there): `node scripts/design-harness/shots.mjs
<scenarios.json>` for screenshots / evals / real clicks, `trace.mjs` for raster
cost, `examples/band-inject.js` to try a band dial in the live page; log §5.5
has the traps.

---

## 7. Suggested opening for the next chat

> Continuing Ed's Tree Service (repo `C:\Users\Ryan Lopez\Documents\EdsTreeService`,
> GitHub `nadmaker/EdsTreeService`, main @ the design-session commit after
> `6b9a692`, **not pushed**). Read, in this order: this
> brief (`EdsTreeService_HANDOFF_Session-2026-09-04b.md`), the log's close-out
> entry and §6, the client `CLAUDE.md`, and the Step0-Step1 handoff's §3
> claims register and §7 draft-copy queue. The site is verified locally and
> NOT deployed; no tracking container, no offer, every image a placeholder.
> Log every big change as a dated `###` entry under §1 of the log as you go,
> update §6 and the client CLAUDE.md §8 in the same commit, and write a new
> dated session brief at the end. Today's task: ______ (commit + deploy per
> §4.1 / owner review of the §4.2 points / the next section redesign: ______).
> The screenshot / click / trace harness is in `scripts/design-harness/`.
