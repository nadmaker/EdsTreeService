# Ed's Tree Service — session brief for the next chat (2026-09-04)

Written at the end of the free-renames-and-hygiene session. Snapshot for the
next chat; never edited after. The authoritative running record is
`EdsTreeService_HANDOFF_Log.md` (§1 entry dated 2026-09-04, §6 open items);
current state is the client `CLAUDE.md`; claims are
`EdsTreeService_HANDOFF_Step0-Step1.md` §3.

---

## 1. Where things stand

| Item | State |
|---|---|
| Branch / commit | `main` @ **`6c70e97`** — working tree clean, **NOT pushed** |
| Previous commits | `4faca8c` log + first brief · `3be18b1` the fork · `d154fba` Step −1 |
| Build | `npm run build` and `npx tsc --noEmit` pass (tsc canary-checked) |
| Sweep | 2026-09-04 dev sweep: 14 routes 200 at 212,727–300,590 bytes; must-404 set 404; assets 200; zero duplicate ids; banned terms clean at word boundaries |
| Deployment | **STILL NOT DEPLOYED.** No Vercel project. Nothing verified in production |
| Tracking | Still no GTM container. All `data-*` inert. **Renames are still free — one is left** |
| Photos | Still all generated placeholders, both logos and the favicon |
| Offers | **NONE.** `CLIENT.offers.items` is empty (owner, 2026-09-04) |
| `.env` | Still not committed; PUBLIC_ values go in the Vercel dashboard |

---

## 2. What changed this session

Two owner decisions arrived mid-session and shaped it:

1. **No offer / offer-card work in this repo.**
2. **The only offer the business makes is FREE ESTIMATES.**

The second made the live "10% Off Your First Tree Service" a false claim, so
it was struck as a claims fix. Everything else was the free-now/permanent-
later cluster plus hygiene that needed no owner input.

| | Before | Now |
|---|---|---|
| Offers | 10% discount, live on /about | none; carousel is 2 editorial slides |
| Landing form section | `contact-form` (collided with home) | `landing-contact-form` |
| Service form `view_section` | no observer at all | Mechanism A (`data-track-view`) |
| Service lead email | "Service: tree-removal" | "Service: Tree Removal" |
| Home form scoping | `getElementById` | `data-form` (all four canonical) |
| Services grid | 5 tiles, 4 cols, CTA alone on row 2 | 3-up at lg, CTA spans 2 |
| Hours | one /about FAQ answer | footer, all 14 routes |

Full reasoning, the measurements and the three probe failures are in the log's
2026-09-04 entry. Do not re-derive them.

**Deliberately NOT done:** the `hero-offers` rename (open item 8.4.9). It was
in scope until the no-offer-work decision. Still free while no container
exists; moot if the /about carousel is dropped.

---

## 3. Read these first, in this order

1. `EdsTreeService_HANDOFF_Log.md` — §6 (open items), §2 (non-negotiables),
   then the **2026-09-04** entry under §1, then the fork entry.
2. `CLAUDE.md` (client) — current values, section inventory, forms, env,
   routes. §8 is the curated open-item subset.
3. `EdsTreeService_HANDOFF_Step0-Step1.md` §3 — the CLAIMS REGISTER. A gate,
   not a reference. Cleared: bonded & insured, free estimates, since 2006,
   1000+ served, family-owned, locally owned, residential & commercial,
   same-day tree removal, open 8 AM–7 PM every day, "our own crews, start to
   finish". MUST NOT SHIP: Licensed, Certified, Arborist, any rating or
   review or testimonial, 24/7 / emergency / after-hours / any response
   promise beyond same-day, free tree removal, **any discount offer**,
   BBB/Angi/Facebook/Yelp, association badges, roofing vocabulary. The tell
   is the absolute (never, always, every, no, only).
4. Root `CLAUDE.md` for methodology; its §11 plan-mode defaults apply.

---

## 4. Open, in priority order

1. **Deploy** — nothing can be checked in production until this happens.
   Runbook in the 2026-09-03 brief §5, unchanged and still correct: Vercel →
   Add New → `nadmaker/EdsTreeService` → name **`eds-tree-service`** →
   preset Astro, root `./`, production branch `main` → **delete every empty
   env row Vercel auto-detects from `.env.example` before deploying** → then
   the live status-AND-bytes sweep. ⚠️ Weigh first: Hobby production is
   public and crawlable, so placeholder photos and un-signed-off copy become
   indexable, and the form still cannot send. The Vercel CLI in this repo is
   installed and authenticated as `nadmaker`, so a deploy can be driven from
   a session rather than the dashboard — note that a CLI-created project does
   NOT auto-detect `.env.example`, which sidesteps the empty-row hazard.
2. **Photos, logo, favicon** — all placeholders. Same-name file drops, then
   `npm run build` re-renders the og card.
3. **Email** — no Resend key, no verified sending domain, no domain. This is
   also what blocks end-to-end testing of the `service_type` fix.
4. **Google Maps key** — extend the owner's key referrer list to the new
   origin, pick the Map ID, set the two PUBLIC_ vars, redeploy.
5. **Owner answers:** legal entity form; "every day" = 7 days including
   Sunday? (now printed site-wide in the footer, so it matters more than it
   did); capabilities list; guarantee terms; own Google listing vs reusing
   EBS's. The offer-expiry question is **closed** — there is no offer.
6. **Draft copy sign-off:** FAQs, process steps, why-us cards, stats, hero
   headline, service one-liners, city descriptions.
7. **Free while no container exists:** the `hero-offers` rename only.
8. **New this session:** /about ships 4 image preloads where every other
   route ships 2; the footer legal row is still `neutral-500`.
9. **Still inherited:** city landings have no `<h1>`; the 768–1024px overflow
   band (never re-measured); two service-area map implementations
   (deliberate); EBS narration in wrapper comments (four fixed this session).
10. **Template-level:** backport shared files to `Frame-sites`; reconcile
    DUPLICATE.md Step −1; add a "Free estimates?" row to
    `INTAKE_TEMPLATE.csv`; push EBS's `673bdd7` to `main`.

---

## 5. Working rules (unchanged, plus what this session added)

- Log every big change as a dated `###` entry under §1 of the log **as you
  go**, with what was true before, what is true now, and what was measured.
  Update the log §6 table and the client CLAUDE.md §8 in the same commit.
  Never edit a dated session brief.
- Stage by explicit path. The EBS checkout may have a live session — never
  `git add -A`, stash or reset there.
- **Verify the probe before reporting a failure.** Three lied this session:
  `grep -rlI $'\r' src` reported zero CRLF files on a tree that is 102/162
  CRLF; a stale dev server answered on a port `astro dev` had not bound to
  (five orphaned node processes were running — kill strays before sweeping,
  and trust the port the server itself reports); and a "1,414 hit" ISA alarm
  was `:disabled` in the inlined CSS (use `\b` boundaries).
- **Scripted passes: pass the replacement as a FUNCTION.**
  `String.replace(find, str)` interprets `$'`, `$&` and dollar-backtick in
  the replacement — one containing the literal `$'` spliced the whole file
  tail in. Only the once-per-file assertion caught it. Line endings are mixed
  because `.gitattributes` is `* text=auto` with `core.autocrlf` true, so the
  commit is LF either way; normalise before matching regardless.
- Contrast on pixels, never `getComputedStyle`; report the worst case.
- Tokens, never literals. The og card is the one exception.
- Defaults are content, in both directions.
- Owner overrides recorded where the value lives, dated, with the objection.

---

## 6. Verification recipe

`npm run build`, then `npx tsc --noEmit` (needs a build first for
`.astro/types.d.ts`; canary-check it by breaking a type deliberately), then:
start `npx astro dev --port 4399 --host 127.0.0.1 > log 2>&1` in the
background (never piped into `head`), **confirm the port it actually bound
to**, then curl every route for status + bytes + `<title>`, the must-404 set,
`/og/default.jpg`, `/favicon.png`, the geojson and every referenced image,
duplicate ids, the `data-section` inventory (strip `<style>` first, or match
element roots — the inlined global.css makes `contact-form` appear
everywhere), and a word-boundary grep for previous-client names, trade terms
and banned claims. After a deploy, repeat on the live URL and grep the served
JS chunks on a SERVICE page for the Maps key.

---

## 7. Suggested opening for the next chat

> Continuing Ed's Tree Service (repo `C:\Users\Ryan Lopez\Documents\EdsTreeService`,
> GitHub `nadmaker/EdsTreeService`, main @ `6c70e97`, clean, **not pushed**).
> Read, in this order: this brief
> (`EdsTreeService_HANDOFF_Session-2026-09-04.md`), the log's §6 and its
> 2026-09-04 §1 entry, the client `CLAUDE.md`, and the Step0-Step1 handoff's
> §3 claims register. The site is verified locally and NOT deployed; there is
> no tracking container, no offer, and every image is a placeholder. Log every
> big change as a dated `###` entry under §1 of the log as you go, update §6
> and the client CLAUDE.md §8 in the same commit, and write a new dated
> session brief at the end. Today's task: ______ (push `6c70e97` and deploy
> per §4.1 / swap in the real photos / apply the owner's answers to §4.5 /
> begin the redesign with section ______).
