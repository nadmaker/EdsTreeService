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

Last updated: **2026-09-04 11:30** — close of the design session that ran
2026-09-03 16:40 → 2026-09-04 11:30 (two-tier sticky navbar, home hero shell,
three-step estimate form, AboutUsVariant2 and its topographic chevron band).
**ALL OF IT IS UNCOMMITTED:** 11 modified + 4 new files on top of `6b9a692`.
Session brief `EdsTreeService_HANDOFF_Session-2026-09-04b.md` ("b" because the
previous session's brief already took the 09-04 name although git dates its
commits 09-03 16:20).

---

## 1. What this work is

Standing up Ed's Tree Service on the Frame-Sites template as a fork of the
Exterior Builder Services build (same owner), then taking it from a
placeholder-imaged, verified-but-undeployed state to a launched site.
Everything generated must be Ed's-themed via tokens, never hardcoded values
(root §4), and every visitor-facing string passes the CLAIMS REGISTER
(`EdsTreeService_HANDOFF_Step0-Step1.md` §3) before it ships.

### Done so far

### Session close-out (2026-09-04, 11:30)

The design session that started 2026-09-03 16:40 closes here with the
working tree UNCOMMITTED: 11 modified files and 4 new wrappers on top of
`6b9a692`. `npm run build` and `npx tsc --noEmit` pass on this exact tree
(last run after the band landed). Nothing deployed, no container, every
photograph still a placeholder.

Dating: the previous session's entry and brief are labelled 2026-09-04
although git dates its commits 2026-09-03 16:20; this session's entries are
labelled "2026-09-03, second session" because that is when they were
written, and its brief is `EdsTreeService_HANDOFF_Session-2026-09-04b.md`
because the 09-04 name was taken. From here on, date by the machine clock.

What the next session inherits, in one place:
- Five new/changed blocks, all verified in the dev server and documented in
  the five entries below: NavbarTwoTierWrapper (sticky two-tier, replaces
  NavbarMainWrapper on all 14 routes), HeroFormCardWrapper + the three-step
  HeroEstimateFormWrapper in its slot (replaces HeroWrapper on /),
  AboutUsVariant2 (replaces AboutUsVariant1 on /) and its topographic
  chevron band (global.css tokens `--site-tex-topo`,
  `--site-ground-rake-dark`, `--site-chevron-*`).
- Three orphaned wrappers kept on disk by request: NavbarMainWrapper.tsx,
  HeroWrapper.tsx, AboutUsVariant1.tsx (plus edstree-hero-3.jpg with no
  consumer). Delete together once the new blocks are signed off.
- Owner review points created this session: contour-line colour (neutral
  now, green is a one-class change); the uppercase heading with the green
  accent phrase; the county-grouped Service Areas menu (flat is a one-line
  MENU edit); the social row (only Google, pointing at EBS's listing); all
  new copy (§7 of the Step0-Step1 handoff lists it); whether step
  navigation in the hero form should be tracked (`form_step` is a root
  §11.5 decision).
- The prototyping and measurement harness (CDP screenshot/eval harness,
  in-page injection, cold-raster tracing) is committed under
  `scripts/design-harness/` with a README and worked examples; §5.5 records
  the traps.

### Topographic chevron band on AboutUsVariant2 (2026-09-03, second session, after the two-column shell)

The styling pass for the About block, from a plan-mode brief: a dark,
textured left field with a large bevelled chevron meeting a light content
panel along a shallow diagonal, the reference's hex mesh replaced by a
PROCEDURAL topographic contour field. Everything drawn or generated — no
file added to public/ — so a fork recolours the band by changing tokens.
Proposal was presented and approved first (scratchpad `band-proposal.md`);
the five decisions taken: edge-detect recipe, 400px tile, keep the uppercase
heading with the brand-primary accent phrase, NEUTRAL contour lines for now
(review, then maybe green), cut the reference's pale light-side diagonals.

| | Before | Now |
|---|---|---|
| Ground | plain white | `--color-default-font` from md (light below md) |
| Layers | none | contour mask · dark-ground rake · inline-SVG chevron · clip-path panel · content z-10 |
| Tokens | — | `--site-tex-topo`, `--site-ground-rake-dark`, `--site-chevron-face/-lit/-shade/-ghost` (global.css) |
| Heading | mixed case | uppercase, "Trusted Tree Service" in brand-primary (5.07 on the panel) |
| Hooks / JS / public assets / hex | none / none / none / none | unchanged: none |

**Why (the parts that differ from the brief)**

- **Recipe: posterise → Laplacian, not discrete bands.** Every discrete-band
  variant on a contact sheet (2–4 octaves, 80–120-entry tables, contrast
  stretch) gave slope-dependent blobs with ragged edges; posterising the
  heightfield into 12 steps and marking each boundary with a 3×3 Laplacian
  gives thin UNIFORM lines like a real contour map. `edgeMode='wrap'` keeps
  the tile seamless.
- **400px tile, not 560.** Cold raster cost scales with tile AREA, not
  octaves (see Measured). baseFrequency 0.0084 = 0.006 × 560/400 keeps the
  feature scale.
- **mask-image, not background-image.** The other --site-tex-* layers
  recolour through mix-blend-multiply on a LIGHT ground; over a dark one
  that does nothing. The mask carries alpha only, the line colour is the
  div's background-color (token), no blend mode — and it is monochrome by
  contract.
- **Panel 48%→44.5%, not 54→46.** The copy column starts at 52.2% and the
  photo ends at 47.8% at every md+ width, so the diagonal must live inside
  that gap or the top of the copy lands on the dark side.
- **Chevron placed by its vertex** (`left:44.5%` + `translate(-72%)`, box
  130% of the section height): the arms bleed off top and bottom like the
  reference at every width instead of the chevron shrinking to a smudge.
  One polyline with a userSpaceOnUse gradient along the light direction
  (perfect miter for free; the arms still read as lit differently), an
  inner specular and an outer shade stroke, and a ghost offset (−40,−40).
  Colours via `style`, not presentation attributes, so var() resolves in
  every engine.
- **Amber on the green-black ground is deliberate at 6.48** — the guide's
  body-on-secondary pair read the other way; amber on primary/primary-hover
  is 2.14/2.83, which is why the ground is default-font. Recorded in the
  client CLAUDE.md §2.2 so it is not "fixed".
- **Opacity .28, not the brief's .14**, which was sized for wide bands;
  1px lines vanish at .14.

**Measured (2026-09-03)**

- Contrast, live tokens: amber/ground 6.48; amber/primary 2.14;
  amber/primary-hover 2.83; amber/white 2.55; amber/background 2.37;
  primary/background 5.07 (the accent, on the panel); background/ground
  15.34; primary/ground 3.03; copy/panel 15.34. No copy over the texture.
- Paint (headless Edge, software raster, band in view, 1.6 s trace after
  injecting the layers, COLD via a fresh seed per run, medians of 4): idle
  1.4 ms; ground+panel 131; full 560px oct4 532 / oct3 582 / oct2 498;
  **400px oct3 373**; 320px 243. Compositor RasterTask, main-thread Paint
  and Layout 2–3 ms in every mode. Warm re-raster of the full band equals
  the bare ground (176 vs 192, n=3) — Edge caches the decoded data URI.
- Built section, served HTML + computed styles at 1440: ground rgb(11,36,14),
  isolation isolate, overflow hidden; mask-image the data URI at 400px,
  opacity .28, line colour rgb(237,250,239); rake resolves through
  color-mix; chevron strokes resolve var() (oklab values); panel clip
  polygon(48% 0, 100% 0, 100% 100%, 44.5% 100%); content z-index 10; h2
  uppercase with the accent at rgb(24,122,38), left edge 752px (panel edge
  691 at the top); vertex at 640.8px; no hex anywhere in the section's
  markup; image preloads still two. 768: copy at 408 vs panel 369 (inside);
  photo right 360 vs panel bottom 342 (tucks under the photo). 390: ground
  rgb(237,250,239), all four decorative layers display:none, no horizontal
  overflow. `npx tsc --noEmit` clean; `npm run build` clean.
- Pre-existing and unrelated: the amber rule under the band is
  ServicesGridSectionWrapper's own `border-t-brand-secondary`.

**Depends on:** the grid staying 1fr/1fr with these gaps (the 48/44.5
diagonal is derived from it); `<main>`/`<body>` never gaining a transform
or filter that would change the stacking; the tile staying monochrome.

### About Us variant 2 — two-column founding story (2026-09-03, second session, after the hero form)

Built `sections/AboutUsVariant2.tsx` — STRUCTURE ONLY, by instruction: a
two-column block, photo placeholder left, a very large bold headline with
the intake founding story directly beneath it on the right, plain white
background (no texture, gradient or scrim — the styling pass is next). Laid
out from the HighPoint reference; its photo and copy were not reused.
Swapped in for AboutUsVariant1 in the home builder's existing
`<section id="guarantee">`; AboutUsVariant1.tsx stays on disk with no
consumer. Uncommitted, undeployed.

| | Before | Now |
|---|---|---|
| Home company-story block | AboutUsVariant1 — scrimmed photo ground, four labelled paragraphs, hooks | AboutUsVariant2 — plain white two-column grid, no hooks, Mechanism A |
| Copy | four regrouped paragraphs (cleared) | the intake's founding story (row 91) verbatim, three paragraphs; same headline line as before with the years derived |
| Photo | Variant 1's placeholder | edstree-hero-2.jpg (orphaned hero slide 2), lazy, aspect 4:5 |
| Emitted section | `service-guarantee` | `service-guarantee` (kept for series continuity) |

**Why**

- **Section key kept.** `service-guarantee` never described the content and
  the client CLAUDE.md records the mismatch as deliberate. Renaming is still
  free while no container exists, but it is a decision, not a side effect
  of swapping a variant.
- **Founding story verbatim.** The spec asked for "the founding story text
  from the intake", so row 91 is used as written apart from paragraph
  breaks and typographic dashes; the row's own claims check (bonded and
  insured, since 2006, written estimate) is all cleared. The trailing
  parenthetical claims note is bookkeeping and is omitted.
- **Placeholder reuse, not a new asset.** The hero swap orphaned slide 2;
  it is the temporary photo here rather than generating another file for a
  picture that will be replaced.
- **No id on the wrapper root**; the builder's `<section id="guarantee">`
  is the anchor, as before (root §6.6.1 — nothing links to it, nothing
  changes).

**Measured (2026-09-03, `astro dev` 4399, headless Edge)**

- / **200** at 318,739 bytes; `data-section="service-guarantee"` once;
  `#guarantee` once; zero duplicate ids; the story text present; zero
  Variant-1 residue ("satisfaction guaranteed" 0).
- 1440: grid `568px 568px`; photo 568×710 (4:5), `loading="lazy"`; h2 56px;
  three paragraphs; background rgb(255,255,255). 390: single column, h2
  36px, no horizontal overflow.
- Image preloads on / unchanged at two (logo, hero-1) — the lazy photo
  adds none (root §9.13).
- `npx tsc --noEmit` clean.

**Depends on:** the styling pass giving this block a ground of its own —
until then it is white against the white services grid below.

### Three-step estimate form in the hero card (2026-09-03, second session, after the hero shell)

Built `sections/HeroEstimateFormWrapper.tsx` (Variant C) to the spec and
passed it through HeroFormCardWrapper's `card` slot on the home page:
SERVICES (the four services as single-choice tiles) → DETAILS (full name,
phone, email, optional textarea) → ADDRESS (ZIP, address) → "Thank you,
{name}. Your submission has been received." Uncommitted, undeployed.

| | Before | Now |
|---|---|---|
| Hero card | dashed placeholder | three-step form, own surface |
| Forms on / | one (`contact-estimate`, #home-contact) | two — `hero-estimate-form` / section `hero-form` added; the bottom form untouched |
| `service_type` | — | the tile's label ("Tree Removal"), matching the sibling forms |
| `message` | — | textarea, optional; a composed one-liner is sent when empty because /api/contact REQUIRES message |
| Tracking | — | canonical chain (form_start → form_submit_attempt → success/error → generate_lead), ref-guarded; `select_service` via the click bridge with the declared slug |

**Why**

- **One always-mounted `<form>`, steps swap its children.** Keeps the
  data-form-scoped focusin listener attached across every state, and makes
  Enter do the right thing: implicit submission hits onSubmit, which
  ADVANCES on steps 1-2 (after per-step validation) and only POSTS on
  step 3. form_submit_attempt therefore fires once, at the real submit.
- **form_start counts CONTROLS only.** The step titles and the thank-you
  heading are focused programmatically (tabIndex -1) so the change is
  announced; that focus bubbles as focusin too, and the first cut fired a
  second form_start right after generate_lead because reset() had just
  cleared the guard. A "Submit another request" click DOES start a new
  lifecycle (it is a button) — that one is correct.
- **No "Other" tile** — the reference grid is services only; the
  textarea is the catch-all. No residential/commercial radios (intake: No)
  and no consent checkboxes, per the spec.
- **Message fallback rather than a required textarea.** The API rejects an
  empty message; "Additional details" is optional by name, so the wrapper
  composes "Free estimate request for {Service} — no additional details
  provided." instead of failing the lead.
- **NEXT/BACK untracked** — no taxonomy event describes step navigation
  and inventing one is a §11.5 decision (logged as 8.4.15).
- **Copy is cleared claims only:** "Request your free estimate", the two
  step titles, "We'll reach out shortly" (already used by the other forms).

**A harness "artefact" that was a real bug.** The CDP coordinate click on
BACK left the form on step 2 while `element.click()` went back correctly.
Tracing mousedown/mouseup/click/submit with the submitter showed:
click:Back → title "Request your free estimate" → `submit
submitter=BUTTON:Next:submit` in the SAME millisecond → step 2 again.
React reconciled the two button rows as the same `<div>` and the step-2
BACK (index 0, type=button) as the same DOM node as the step-1 NEXT
(index 0, type=submit); goBack() re-rendered synchronously inside the click
dispatch, so the browser's activation behaviour ran on a node that had
just BECOME a submit button. A real mouse does exactly the same. Fixed
with distinct keys on the two rows (forces a remount, so the clicked node
is detached rather than mutated) plus preventDefault on BACK; the comment
in the file says why the keys are load-bearing.

**Measured (2026-09-03, `astro dev` 4399, headless Edge over CDP, fetch mocked at the network boundary)**

- / **200** at ~322 KB; `data-form` values on the page: `contact-estimate`,
  `hero-estimate-form` (one each); zero duplicate ids; honeypot present.
- Success path: heading "Thank you, Ryan Lopez."; POST body
  `{ site:"edstree", name, email, phone, address, zip:"28341", message:<composed>,
  service_type:"Tree Trimming", company:"", started_at_ms }`; dataLayer
  `form_start, form_submit_attempt, form_submit_success, generate_lead`
  and nothing after it until the next control is touched.
- Error path (mocked 500 `server_misconfigured`): message shown inline on
  step 3, values retained, dataLayer ends `form_submit_error`.
- Validation: empty NEXT on step 1 → "Choose a service to continue."; on
  step 2 → "Full name is required."; focus lands on the step title after
  each transition (activeElement H2).
- BACK after the fix: returns to step 1 with the tile still selected.
- 390px: no horizontal overflow; tiles stack icon-over-label 2-up.
- `npx tsc --noEmit` clean.

**Depends on:** the API keeping `message` required (or the fallback becomes
dead code — harmless); the hero card column staying `max-w-[640px]`.

### Home hero shell with a form-card slot (2026-09-03, second session, after the navbar)

Built `sections/HeroFormCardWrapper.tsx` from the "We care for your
neighborhood" reference — STRUCTURE ONLY, by instruction: a background
layer, a centred serif h1, an uppercase strap, and a centred foreground card
column that hangs over the bottom of the image layer onto the page colour.
The card's CONTENTS (the interactive contact form) are not specified yet;
they arrive through a `card` slot prop, and until then the wrapper renders a
plainly structural placeholder. Swapped in on the home page in place of
HeroWrapper (the three-slide carousel), which stays on disk with no
consumer. Uncommitted, undeployed.

| | Before | Now |
|---|---|---|
| Home hero | HeroWrapper — 3-slide carousel, eyebrow + h1 + caption + split CTA, hooks | HeroFormCardWrapper — static shell, no hooks, `card` slot |
| Builder | `<section id="hero"><HeroWrapper/></section>` | `<HeroFormCardWrapper id="hero"/>` — the wrapper owns the section |
| Copy | draft h1 + caption | the SAME draft h1; strap = the four services + service-area label (all cleared) |
| Image preloads on / | 2 (logo + hero-1) | 2 (unchanged — slides 2/3 are gone with the carousel) |

**Why**

- **The overhang is self-contained.** The section's own background is the
  page colour; the image layer is `absolute inset-x-0 top-0 bottom-16
  md:bottom-24`; the card is the last in-flow child with nothing below it,
  so its bottom IS the section's bottom and its last 64/96px sit over a strip
  that is already the page colour. No negative margin, and nothing below the
  hero has to add padding — the reference's overhang without a cross-section
  dependency.
- **No "use client", no hooks** (root §6.2 exception): view_section is
  Mechanism A via `data-track-view`, section name `hero` reused (same block,
  same position). The form that lands in the slot brings its own wrapper and
  hooks.
- **LCP hygiene kept:** the background `<img>` is eager, `fetchPriority="high"`,
  never lazy, and is the SAME placeholder file HeroWrapper used as slide 1,
  so the og card and the page still show one photograph.
- **The h1 is 56px at md+** — the style guide's desktop cap (global.css) —
  where HeroWrapper had gone to text-7xl (72px).
- **Tint is tokens:** `bg-brand-primary-hover/85` over the photo (white on
  primary-hover 7.21:1 on the flat colour). Card surface is white with a
  shadow so it reads on both the green and the pale page colour; that is
  placeholder chrome and the slot owns it, so the form spec can replace it.

**Measured (2026-09-03, `astro dev` 4399, headless Edge)**

- / **200** at 314,813 bytes; `id="hero"` once; `data-section="hero"` once;
  `<section id="hero" … data-track-view>` in the served HTML.
- 1440: card 640px wide, centre x=720 (viewport centre); card bottom ==
  section bottom (898.6); image layer bottom 802.6 → **96px overhang**; h1
  56px. 390: **64px overhang**, h1 36px, no horizontal overflow.
- Preloads on /: `edstree-logo.png`, `edstree-hero-1.jpg` — two, as before.
- `npx tsc --noEmit` clean.
- Probe that lied: the first geometry eval threw on `.max-w-\\[640px\\]` — the
  bracketed-class-selector-through-CDP failure root §11.10 names. Rewritten
  to walk from the h1 instead.

**Depends on:** the card being taller than the strip (any form is); the
next section not relying on the hero for top padding.

### Two-tier sticky navbar (2026-09-03, second session)

Dating note: git dates EVERY commit so far 2026-09-03 (the machine clock
agrees), so the previous entry's "2026-09-04" was mislabelled. This entry
uses the real date; it is the session AFTER that one.

Built `sections/NavbarTwoTierWrapper.tsx` from the Imperium Roofing
reference — a dark info bar (phone, email, socials) over a white main bar
with the menu split around a CENTRED logo and a hard-shadowed CTA — and
swapped it in on all six builders. `NavbarMainWrapper.tsx` stays on disk by
request with no consumer. Nothing was deployed and nothing was committed in
this session (the user did not ask for a commit).

**What was true before → what is true now**

| | Before | Now |
|---|---|---|
| Header positioning | `fixed` floating inset bar; in-flow spacer; `heroBehind` prop; rAF scroll listener | `position: sticky` with `top: -44px` (the info bar's height) — IN FLOW, no spacer, no prop, no JS |
| Tiers | one | info bar scrolls away with the page; main bar pins at y=0 |
| Logo | left, 72px | centred (`grid-cols-[1fr_auto_1fr]`), same colour asset, 64px lg / 52px md / 48px mobile |
| Desktop menu | Home · About · Contact · Services ▾ · Locations ▾ · call · CTA | Home · Services ▾ · Service Areas ▾ ‖ logo ‖ About · Contact · CTA; phone and email moved to the info bar |
| Service Areas | flat six cities | grouped by county (from `CLIENT.geo`), each county a flyout — the reference's nested behaviour; flattening is a one-line MENU edit |
| Dropdowns | CSS hover only | hover (CSS named groups) + click (state, `aria-expanded`) + keyboard (focus-within); outside pointer / Escape close |
| Mobile row | logo · split call/contact · hamburger | amber call circle · centred logo · hamburger; the quote CTA moved into the overlay (same label) |
| `--site-nav-clearance` | 120px (88 bar + 16 inset + 16) | 100px (pinned main bar 84 + 16) |
| `--site-mobile-nav-clearance` | 97px | 88px (72 row + 16) |
| Hero clearance padding | HeroWrapper `md:pt-[calc(8rem+…)]`, Landing1 `md:pt-[…]` | removed — nothing runs behind the bar at rest |
| Mechanism-1 surface on mobile | none (icon-only header button) | `nav-topbar-call` renders the number as visible text at every width |
| Builders | `<header id="top"><NavbarMainWrapper/></header>` | `<NavbarTwoTierWrapper id="top"/>` — the wrapper IS the `<header>` landmark |

**Why each was done the way it was**

- **Sticky with a negative top, not fixed + JS collapse.** A sticky root
  whose `top` equals minus the info bar's height gives "info bar disappears
  on scroll, main bar stays" with zero script, zero layout shift and no
  spacer to keep in step with the bar's height. `--site-nav-topbar` is
  declared on the root and consumed by BOTH the negative top and the info
  bar's height, so they cannot drift. The cost is a structural rule: the
  root must be a direct child of `<main>` / the island, because sticky only
  travels inside its containing block — which is exactly why the previous
  wrapper rejected sticky and went fixed. The builders' own `<header>`
  wrappers were therefore removed rather than kept; `id="top"` moved onto
  the component (nothing links to it — checked — but it is preserved).
- **The heroes lost their clearance padding** because the header is in flow
  now: the former padding would only have shifted each centred stack ~50px
  below centre. `--site-nav-clearance` still exists for the two things that
  matter after a scroll (scroll-padding-top and the two sticky rails), sized
  to the PINNED main bar.
- **The md (768px) breakpoint was kept**, even though the reference's bar
  wants ~900px, because every clearance token, hero rule and
  scroll-padding media query on the site is keyed to 768. The bar is sized
  down at md (12px links, 52px logo, tighter gaps) and up at lg/xl; measured
  fit at 768: CTA right edge 752px, nav scrollWidth == clientWidth.
- **Colours are the reference's structure in this client's tokens.** Info
  bar `bg-default-font` (the home form's dark band) with amber icons (6.48:1
  there, already used on that band); tier rule `brand-primary`; main bar
  white so the colour logo keeps its ground; dropdown panels
  `brand-primary-hover` + `default-background` text (the guide's reverse-out
  band, 6.71:1); CTA amber gradient with a DARK label (rule 2) and a
  default-font block shadow standing in for the reference's pale one.
- **Tracking labels are byte-identical where the element survived.** The
  "Service Areas" group keeps tracking key `locations`, and leaf labels use
  the TOP key + leaf slug (never the county), so `nav-locations-warsaw`,
  `nav-services-tree-removal`, `nav-mobile-toggle-locations`,
  `nav-primary-get-a-quote`, `nav-mobile-call-icon`,
  `nav-mobile-primary-contact`, `nav-mobile-bottom-call-now` etc. all
  match. New labels: `nav-topbar-call` / `-email` / `-social-google`,
  `nav-toggle-{group}[-{sub}]` (desktop triggers now emit
  `toggle_nav_section` because they toggle state), `nav-mobile-email`.
  `close_menu` is still emitted — pre-existing, and still absent from root
  §8.4's table.
- **Only the Google icon renders in the social row.** No profiles exist
  (intake row 96), so Facebook/Instagram carry empty hrefs and are filtered
  out rather than shipped dead. Google points at `CLIENT.contact.mapsUrl`,
  the reused EBS listing — the same decision 7 the footer's directions link
  already makes.

**Measured (2026-09-03, `astro dev` on 4399, served HTML + headless Edge over CDP)**

- Six route patterns **200** at 227,242–315,124 bytes; **one** `<header>`
  per page; **zero** duplicate ids; `id="top"` exactly once on the four
  one-off pages (none on the BLDR routes, as before).
- Header at rest 128px (desktop) / 112px (mobile); after a scroll the root
  sits at top −44 / −40 with the main bar's top at exactly 0.
- Click on SERVICES → `aria-expanded="true"`, panel `display:block`;
  click on the hero → `"false"` / `none`. `focus()` on the trigger →
  `block` (keyboard path). Hover, nested county flyout, CTA press state
  and the mobile accordion (Service Areas → Duplin County → three cities)
  all screenshot-verified.
- Cold HTML with the menu closed: three `tel:` anchors in the nav,
  `phone-number` spans on `nav-topbar-call` and
  `nav-mobile-bottom-call-now`, overlay carrying `inert`.
- `npm run build` complete in 53s; `npx tsc --noEmit` clean, canary
  produced exactly 1 diagnostic.
- 768px document scrollWidth 1040 — PRE-EXISTING (the open overflow band):
  the marquee track and two hero SVGs, none inside the header.
- One probe that lied, briefly: every screenshot showed a dark pill at the
  bottom centre, over the mobile overlay. `elementFromPoint` returned
  `ASTRO-DEV-TOOLBAR` — dev tooling, not the page.

**Depends on:** `<main>` and `<body>` never gaining `overflow(-x): hidden`
(it would become sticky's scroll container); builders keeping the wrapper a
direct child of `<main>` / the island; the info bar staying 40/44px or
`--site-nav-topbar` being updated with it.

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

### 5.5 Prototype in the live page, then measure — over CDP, not by editing
Kept in the repo as `scripts/design-harness/` (README there; committed at the
close of the session). Headless Edge (`--headless=new --remote-debugging-port`)
driven from node's global WebSocket needs no dependency. One harness did all of this session's
verification: navigate, wait for `astro-island[ssr]` to drop to zero
(hydration), `Runtime.evaluate` probes, `Input.dispatchMouseEvent` for real
hover/click, `Page.captureScreenshot`. For a design proposal, INJECT the
candidate layers into the hydrated live page (a `<style>` plus DOM nodes
prepended into the real section) instead of writing repo files — the
tokens, fonts and grid are the real ones, and plan mode stays honest.
Traps met: (a) `Page.captureScreenshot` `clip` is PAGE-relative, so after a
scroll compute `y = scrollY + …` or the capture is blank; (b)
`elementsFromPoint` ignores `pointer-events:none` layers, so it cannot tell
you what a decorative layer painted; (c) bracketed Tailwind class selectors
(`.max-w-\[640px\]`) do not survive the protocol (root §11.10) — walk from a
tag instead; (d) a data-URI in an HTML `style="…"` attribute breaks on its
own double quotes — put it in a `<style>` block; (e) Edge caches a decoded
data-URI across navigations, so a raster cost is only COLD if the URI
differs — vary the SVG seed per run; (f) `RasterTask` durations from
`Tracing` (`devtools.timeline` categories) are compositor time, not main
thread, and `--disable-gpu` means software raster: report them as relative
levers, not absolute production numbers (root §11.9).

### 5.6 React reuses DOM nodes across conditional branches — key them
Two sibling button rows rendered by a ternary (`step === 1 ? <div><NEXT
submit/></div> : <div><BACK button/><NEXT submit/></div>`) reconcile as the
SAME `<div>` and the SAME first `<button>`. A click on BACK re-rendered
synchronously inside the click dispatch, the clicked node BECAME
type="submit", and the browser's activation step submitted the form —
straight back to the step just left. A real mouse does exactly the same;
the harness only made it reproducible. Fix: distinct `key`s on the rows (a
remount detaches the clicked node instead of mutating it) plus
`preventDefault` on BACK. Same family of trap: a JSX comment inside a
parenthesised expression (`cond ? ({/* … */} <div/>) : null`) is a syntax
error, not a comment.

## 6. Open items

⚠️ Current through the **design session closed 2026-09-04 11:30 (UNCOMMITTED)**.
Add rows; strike resolved rows with the date; never delete. The client
CLAUDE.md §8 mirrors the curated subset with stable numbers — keep the two
in step in the same commit.

| Item | Status |
|---|---|
| ~~**AboutUsVariant2 is STRUCTURE ONLY**~~ **styling landed 2026-09-03** (topographic chevron band). Still open from this row: placeholder photo (`edstree-hero-2.jpg`); intake story spells "storm cleanup" vs the site's "storm clean-up" — settle at sign-off. | Open — photo + spelling |
| **Band contour colour is NEUTRAL by choice, pending review.** Background token at opacity .28 on layer 2 of AboutUsVariant2; the greener alternative is brand-primary at ~.45 (3.03 on the ground) — a one-class change. | Open — owner review |
| **`AboutUsVariant1.tsx` is orphaned** (replaced by `AboutUsVariant2` on the home page); kept on disk. | Open — delete with the other orphans once signed off |
| ~~**Home hero is a SHELL.** `HeroFormCardWrapper`'s `card` slot has no consumer; the page shows the dashed placeholder card.~~ | ~~Open~~ **RESOLVED 2026-09-03** — `HeroEstimateFormWrapper` fills the slot |
| **Hero form step navigation is untracked.** NEXT/BACK carry no data-event; no taxonomy event exists and adding `form_step` is a root §11.5 decision. | Open — decide before a container exists |
| **Hero form copy without owner sign-off:** "Request your free estimate", "Enter your contact info", "Enter your address", "Thank you, {name}. Your submission has been received. We'll reach out shortly.", and the composed fallback message sent when the textarea is empty. Cleared claims only. | Open — content review |
| **`HeroWrapper.tsx` is orphaned** (three-slide carousel), replaced by `HeroFormCardWrapper` on the home page; kept on disk. `edstree-hero-2.jpg` / `-3.jpg` have no consumer now. | Open — delete with NavbarMainWrapper once signed off |
| **`NavbarMainWrapper.tsx` is orphaned.** Replaced by `NavbarTwoTierWrapper` on all fourteen routes; kept on disk by request. Its fixed-bar contract (120px/97px clearance, spacer, `heroBehind`, hero padding) no longer exists — do not re-compose it without restoring those. | Open — delete once the new bar is signed off |
| **Navbar social row renders only the Google icon**, pointing at EBS's reused listing (decision 7). Facebook/Instagram hrefs are empty in `NavbarTwoTierWrapper`'s `SOCIAL_LINKS` because no profiles exist (intake row 96). A `CLIENT.social` block is the right home once any exist. | Open — owner |
| **Navbar copy without owner sign-off:** the info-bar prompt "Need Tree Help? Call Us Now!" and the CTA "Get A Free Quote" (free estimates is cleared; neither is a claim). Service Areas grouped by county — flatten if the owner prefers one list. | Open — content review |
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
| **768–1024px horizontal overflow band** (EBS 8.5.3). Re-measured at 768px on 2026-09-03 during the navbar work: document scrollWidth 1040, from TrustBadgesWrapper's marquee track (right edge 4103px) and two hero SVGs — NOT the header, whose nav scrollWidth equals its clientWidth. | Open — clip the marquee's overflow |
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
