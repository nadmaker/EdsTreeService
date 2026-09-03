# EBS Redesign — Session Handoff

Working notes for the in-progress full redesign of the EBS site. Started
2026-08-20, last updated 2026-09-01 (city-landing session, commit
`433fab0`). Companion to
`EBS_HANDOFF_Step0-Step1.md` (the fork handoff).

This file holds what is NOT already captured in the CLAUDE.md files: the
working agreements, the verification workflow, the techniques that turned
out to matter, and the open decisions. Anything about tracking VALUES
lives in client CLAUDE.md §3.

---

## 1. What this work is

Rebuilding the site's sections one at a time, generating them ourselves
rather than wrapping Subframe parents. The reference direction is the
York Properties site (yorkproperties.com): full-bleed photo background,
left-aligned copy stack, eyebrow → big title → caption → CTA, and
sections noticeably taller than the template's defaults.

Everything generated must be EBS-themed via tokens, never hardcoded
values (root §4).

### Done so far

**HeroWrapper.tsx** — rebuilt. Deleted the `Updatedherowithoffers`
Subframe composition. Now a wrapper-authored `<section>`: photo
background with `fetchPriority="high"`, two-layer scrim, gold eyebrow,
Barlow title, caption, split CTA (Contact Now + phone icon). Since gained:
- **3-slide background carousel**, deferred. Slides 2–3 are NOT in the
  server HTML — see §5.1 for why that is the whole trick. Costs 0 bytes at
  load. Bails on `prefers-reduced-motion` / `saveData` / 2g; pauses when
  the tab is hidden or the hero scrolls away.
- **Progress-bar indicators**, bottom-centre, clickable, `carousel_dot`.
- **Google rating badge** beside the CTA (right on desktop, stacked below
  on mobile). Inline SVG, zero network requests, wired to
  `CLIENT.reviews.*` and `CLIENT.contact.mapsUrl`.
- Slides are `ebs-hero-poster.jpg`, `ebs-hero-2-roof-replacement.jpg`,
  `ebs-hero-3-commercial-siding.jpg` — the only genuinely-EBS photos.

**NavbarMainWrapper.tsx** — fully rebuilt, `NewmodernNav2_0` dropped.
- Desktop: York float→pin bar. Fixed overlay; at rest inset 16px over the
  hero, past 60px scroll it goes flush and full width. Bar height constant
  at **88px**; only padding/width/shadow/opacity animate (250ms).
- Logo 72px in the bar; "Get A Quote" is a flat square block capping the
  bar's right edge (`pl-6 pr-0` + `self-stretch`).
- Mobile: header is now **fixed** too, and the phone-number group was
  replaced by a reversed split CTA `[☎] │ CONTACT` in brand-primary.
- Breakpoint is **768px** (`mobile:`), NOT `lg` — see §6.

**ServiceAreaWrapper_v1_1.tsx** — `ServiceAreaSection2` dropped, fully
wrapper-authored. Deleted 23 arbitrary-variant overrides that existed only
to fight it. Now: photo background + top-down white scrim, left column
(headline, copy, About Us disclosure), right column (guarantee callout +
the four feature tiles, vertically centred).

**ServiceGuaranteeAndFeaturesWrapper.tsx** — `ServiceGuaranteeAndFeatures`
dropped, fully wrapper-authored. Left column contact details, right column
map + service areas. The "Get a Free Estimate" CTA was deleted.

**Photo block deleted 2026-08-30** by request — the left column's photo and
the badge PNG overlaid on its corner. Both files were the previous
client's: `ebs-guarantee-bg.jpg` carried a visible MEDRANO'S logo
watermark and `ebs-guarantee-badge.png` read "HEALTHY TREE GUARANTEE". This
section renders on home AND all six city landings, so that took a
competitor's mark off seven routes. The section now contains NO `<img>` at
all (one iframe, the map). Nothing else referenced either file, so both are
orphaned (~278 KB).

**Map moved to the LEFT column, above the contact rows** — same session,
by request. Desktop columns are now LEFT: map + contact rows; RIGHT:
service areas + locations disclosure. Mobile is untouched (map → contact →
service areas), because the `order-*` values are absolute: moving a child
between the two `display: contents` wrappers changes which DESKTOP column
it lands in without touching the single-column sequence. That is the whole
reason this layout uses `contents` rather than nesting.

**A York header was added above the map**, in the left column — gold
`SERVICE AREA` eyebrow over a `Serving {CLIENT.geo.serviceArea}` title, the
same eyebrow → title rhythm the hero, services grid, stats band and reviews
use. `order-first` places it above the map on desktop AND at the top of the
mobile stack without renumbering the three absolute order values below it.
Title caps at `md:text-4xl` rather than the `md:text-5xl` those sections
use, because they span the full 1280px container while this sits in a 606px
column and 48px wraps the county list onto four lines. Both are props.

⚠️ **The empty column keeps moving, and is now at its worst.** Measured at
1440 across four states:

| state | col 1 content / box | col 2 content / box | hole |
|---|---|---|---|
| guarantee photo deleted | 96 / 557 | 557 / 557 | 461px, LEFT |
| map moved to col 1 | 504 / 504 | 149 / 504 | 355px, RIGHT |
| header added above map | 647 / 647 | 149 / 647 | **498px, RIGHT** |

Each change was individually right and each one made the imbalance worse,
because everything keeps landing in column 1 while column 2 still holds
only the service-areas list. `md:justify-center` on column 2 is the
one-class mitigation; the real fix is probably to give column 2 something
to hold, or to stop treating this as a 50/50 grid. Left open deliberately —
it is a design call, and Ryan has been making them per-step.

**Column 2 restructured, and the imbalance largely closed.** Three changes
2026-08-30, by request: the locations disclosure now opens EXPANDED by
default (reversing an earlier deliberate collapse — the reasoning that was
overridden is kept in the code comment); the "Service Areas" heading and
its three-city preview row were DELETED, since the map's new title names
the area a column away and said the same thing twice; and the contact block
moved from column 1 into column 2, beneath the list.

Measured at 1440 across five states — the gap is content height, not box
height, since grid stretches both boxes and always reports 0:

| state | col 1 | col 2 | gap |
|---|---|---|---|
| guarantee photo deleted | 96 | 557 | 461px LEFT |
| map moved to col 1 | 504 | 149 | 355px RIGHT |
| header added above map | 647 | 149 | 498px RIGHT |
| contact moved to col 2, heading deleted | 527 | 164 | 363px RIGHT |
| locations expanded by default | 527 | 320 | 207px RIGHT |
| contact moved BACK under the map | 647 | 200 | **447px RIGHT** |

| four benefit tiles moved into col 2 | 647 | 528 | 119px RIGHT |
| **header lifted out of the grid** | 504 | 528 | **24px** |

Final arrangement 2026-08-30 — LEFT: header, map, contact rows. RIGHT: the
locations disclosure (expanded) then the four benefit tiles. The contact
block went to column 2 and straight back the same session ("i didnt mean to
say that earlier"), so the 207px row above was never a shipped state.

**The four benefit tiles (Fast Response / Upfront Pricing / Clean Worksite /
Licensed & Insured) moved here from `ServiceAreaWrapper_v1_1`**, which is
what finally closed the gap — 447px to 119px. `order-4` keeps the mobile
sequence intact (header → map → contact → locations → tiles).

⚠️ **SCOPE CHANGE, not just a relocation.** ServiceAreaWrapper renders on
the HOME PAGE ONLY; this section renders on home AND all six city landings.
The tiles therefore went from 1 route to 7. Nothing in them is
home-specific, but it is a real change in what the city landings claim.

**The header was then LIFTED OUT of column 1** to sit above the grid, by
request — the right column was starting level with the eyebrow and should
start level with the MAP. Sitting above the grid it pushes both columns
down equally, so their first row aligns BY CONSTRUCTION. Deliberately not
done with a top offset on column 2: the title wraps to a different number
of lines at different widths, so any constant would drift.

`md:max-w-[calc(50%-2rem)]` keeps the header occupying the left half so it
still reads as the map's header and still wraps to two lines (2rem is half
the grid's `gap-x-16`). Full width would put the title on one line.

Padding was retuned to preserve both breakpoints exactly: the stack went
`py-12` → `pb-12 pt-0 md:pt-6`, with `pt-12` moving onto the header.
Mobile's header→map gap stays 0 as before; desktop's 24px reproduces what
the old column `gap-6` gave.

Verified: `col0Top === col1Top` at **1440 and 1024** (5381/5381 and
5462/5462), header bottom 24px above both. At 390 they differ by design —
one flex column, no alignment to make. Mobile order still map → contact →
locations → tiles.

⚠️ PROBE NOTE: this move BROKE the layout probe, which reached the grid by
walking up three parents from the `<h2>`. The h2 left the grid, so the
traversal landed on the section wrapper and reported one column of two
children — which reads exactly like a collapsed layout. Find the columns by
their own `contents md:flex` class instead. Second time this session a
probe failure looked like a site failure.

**Three finishing changes 2026-08-30**, after Ryan asked whether the section
needed anything:

1. **"Why Us" label over the benefit tiles.** The section header promises
   GEOGRAPHY while the right half answers how the work is done, and nothing
   marked the shift. Styled as a PEER OF "Contact Us" (`text-heading-3`,
   semibold, navy) rather than a second gold eyebrow — the section already
   has one at the top and two would compete. Verified identical computed
   size/weight/colour to "Contact Us" (16px / 600 / rgb(23,41,58)).

2. **The locations disclosure went ghost.** It was a full-width solid
   brand-blue bar — the loudest element in the section, for its least
   important control, competing with the map. It got louder when the
   "Service Areas" heading above it was deleted. Now bordered on white with
   navy text: bg `rgb(255,255,255)`, border `rgb(229,229,229)`, colour
   `rgb(23,41,58)`.

3. **SECTION NAMES REALIGNED TO CONTENT — a tracking change, not cosmetics.**
   The two sections had swapped their content across this redesign and the
   `data-section` values never followed, so they were backwards:
   `service-area` held the company story, `service-guarantee` held the
   service-area map. They are now swapped back to match, and the
   `service-guarantee-phone/-email/-toggle-locations` labels became
   `service-area-*`. `CityLandingPageBLDR` also passed the old name
   explicitly and was updated — without that, the six city landings would
   have kept emitting the stale value.

   Free to do only because no GTM container exists (client §3.2); these
   freeze permanently once traffic starts.

   ⚠️ **THE FILENAMES WERE INVERTED. HALF-FIXED 2026-08-31.**
   `ServiceAreaWrapper_v1_1.tsx` was RENAMED to **`AboutUsVariant1.tsx`**
   (commit `991b023`), retiring the `_v1_1` suffix root §13.3.6 discourages
   and giving the file a name that matches its content. Every OTHER mention
   of `ServiceAreaWrapper_v1_1` in this document is HISTORY — it was the
   name at the time — and is deliberately left alone rather than back-dated.

   The other half is untouched: `ServiceGuaranteeAndFeaturesWrapper.tsx`
   still emits `map-and-benefits`, so THAT filename is still unrelated to
   what it emits. Trust `data-section`, not the filename.

   ⚠️ The emitted name did NOT move with the rename.
   `AboutUsVariant1.tsx` still emits `data-section="service-guarantee"`, and
   its anchor id is `#guarantee`. File, section name and anchor are now
   THREE different words for the same block. Survivable, but one more than
   before — and renames are still free only until a container exists.

   Verified by segmenting the served HTML per section root: `service-area`
   contains the map + Why Us + tiles + Contact Us and no About prose;
   `service-guarantee` contains the About prose and none of those.

⚠️ PROBE NOTE (third this session). The first attempt at that verification
searched the WHOLE document for `data-section="service-area"` and matched a
CSS SELECTOR in the inlined stylesheet, which sits before any DOM. The
segment boundaries came out wrong and the check reported that one section
held everything and the other held nothing. Strip everything up to the last
`</style>` before locating section roots in served HTML.

**Header returned INSIDE column 1, and column 2 nudged to the title line**
(2026-08-30, final). Lifting the header above the grid had pushed both
columns down to the map's top edge, which read as the right column starting
too low. It is back as `order-first` inside column 1, and column 2 carries
`md:mt-9`.

Why 36px is safe where a title-derived offset would not be: the offset is
the EYEBROW block only (24px line + the title's 12px `mt-3`). The eyebrow is
one short line at every width; the TITLE wraps to two lines at 1440 and
could be one or three elsewhere. Offsetting by the stable element is what
makes the constant legitimate rather than a magic number.

Measured at 1440: eyebrow top 5238, title top 5274, **column 2 top 5274 —
exactly level with the title**, 36px below the eyebrow. Mobile unaffected
(`display: contents` discards the margin; the wrappers have no box there).

The disclosure label is now `rgb(22,133,204)` on white, 140px wide and
visible. See §6 for its contrast, which did not improve by inverting.

---

**SECTION REBUILT FROM SCRATCH 2026-08-30** at Ryan's request ("remake this
section without a Subframe parent and completely yourself"). There was no
Subframe parent left to drop — that happened in an earlier pass — so the
rebuild removed the LAST external dependency instead: **`@subframe/core` is
gone**, and the file now imports only React, CLIENT and ServiceAreaMap.

- **Six Feather icons replaced by hand-drawn inline SVG** (phone, mail, zap,
  dollar, broom, shield) plus the chevron, on Feather's own geometry so the
  set still reads as one family alongside sections not yet migrated. Same
  reasoning as the trust badges and services grid: no network request,
  invisible to React 19's preload pass, inherits `currentColor` so a fork
  re-skins it by token. Also takes this section off the shared
  subframe-core chunk.
- **Mechanism B → A.** The React IntersectionObserver is gone in favour of
  `data-track-view`. The component still hydrates for the disclosure, so
  the directive stays — but the vanilla observer fires off server-rendered
  DOM ahead of hydration.
- **The locations button and its panel now share ONE bordered container**,
  so the control and what it reveals read as a single object rather than a
  bordered button with a list floating loose beneath it.
- **Real disclosure semantics**: `aria-expanded` plus `aria-controls`
  pointing at a `useId`-generated panel id. Verified the id resolves.
- `expandedCities` moved from `useMemo` to module scope — it is a constant
  and never depended on props, so memoising per render bought nothing.

Verified after the rebuild: all 15 towns render, every tile and label
present exactly once, tracking attributes and labels unchanged, the `tel:`
anchor still carries the number as VISIBLE TEXT (call-swap eligibility,
root §13.5.6), image preloads still 2. Geometry: column 2 still starts
exactly on the title line at 1440 (`col1_minus_title: 0`); mobile sequence
still TITLE → MAP → Contact Us → LOCATIONS → Why Us; column gap 49px;
`scrollWidth` clean at 1440 and 390.

⚠️ The dev server died mid-verification and `curl` failed with exit 7. That
is what a dead server looks like — not a page error. Restart before
concluding anything about the markup.

**The locations panel went two-tone 2026-08-30**, by request: the header
takes the faint blue the REVIEWS section uses as its surface, and the town
list below takes the grey the MAP fills its context counties with. Both are
existing tokens (`bg-default-background` and `bg-neutral-100`) rather than
new literals, so the panel stays in step with those two surfaces if either
ever moves.

Verified as exact matches rather than eyeballed: button background
`rgb(245,248,251)` === the reviews section's computed background; panel
background `rgb(245,245,245)` === the map's context-county fill.

⚠️ CONTRAST GOT THINNER. The label is `brand-primary-hover` at 14px/600,
which measured **4.91:1** on white but **4.61:1** on the tinted header. AA
needs 4.5:1, so it still passes — with far less headroom than before. Do
not lighten the text or that background any further without re-measuring.
Town text on the grey panel is 13.62:1 and is not a concern.

---

### ServiceAreaWrapper_v1_1 — scrim reshaped to a reference (2026-08-30)

Ryan supplied Shingle Hut's reviews band: near-solid white behind the
heading, photograph clearly visible by the bottom edge. The old ramp was
`from-white via-white/96 to-white/88` — so flat the photo never exceeded 12%
anywhere and read as noise rather than an image. Now a five-stop
`linear-gradient`: 0.97 / 0.94 / 0.90 / 0.80 / 0.40 at 0 / 30 / 65 / 82 /
100%.

**The stops were calibrated against MEASURED text positions, not eyeballed.**
Body prose occupies **28%–80%** of the section's height and is neutral-500
grey — the weakest text in the section. So the ramp holds ≥0.80 white across
that whole band and does its real opening in the bottom ~18%, which carries
only the About Us control (which has its own solid white background).

Verified by SAMPLING RENDERED PIXELS — screenshot the section, crop to its
box, take the 90th-percentile luminance per row so glyph pixels are excluded
and only the paper between letters is measured:

| band | bg luminance | vs grey prose | vs blue heading |
|---|---|---|---|
| 10–88% | 0.976 – 1.000 | **4.63 – 4.74** | 4.82 – 4.93 |
| 95% | 0.814 | 3.90 | 4.05 |
| 99% | 0.614 | 3.00 | 3.11 |

Every band carrying unbacked text clears AA's 4.5:1; the two that do not are
below where text ends (91.1%).

⚠️ **THE MIDDLE CANNOT OPEN FURTHER AS THINGS STAND.** The prose bands sit at
4.63–4.74 — roughly 0.15 of headroom over AA. That is why this does not
match the reference across the full height: the reference puts its middle
content on SOLID WHITE CARDS and leaves its bottom third empty, so its scrim
can fall away far earlier. Ours has unbacked grey paragraphs there.

**The unlock, if a closer match is wanted:** darken the prose from
neutral-500 to `text-default-font` (navy, luminance 0.025 against grey's
0.171). At a background luminance of 0.70 — far more photo than today — navy
still measures ~10:1. That single colour change would let the scrim drop to
roughly 0.5 white through the middle and land much closer to the reference.
Re-measure after, do not assume.

**Then the About Us disclosure was deleted (2026-08-30, by request) and the
ramp had to be re-cut.** The sub-heading that read
`CLIENT.vocabulary.guaranteeName` now reads a plain "About Us" — it
duplicated the guarantee callout in this section's own right column, and it
is a structural label for the prose beneath it rather than a brand name, so
it deliberately is NOT a token.

⚠️ **PERCENTAGE STOPS ARE COUPLED TO CONTENT HEIGHT.** Deleting the
disclosure shortened the section **673px → 588px**, and because the stops
are percentages the prose slid DOWN into the opening zone: the last
paragraph went from ending at 80% to ending at **91.8%**. Pixel sampling
caught the worst band at **4.49:1**, just under AA — a regression introduced
by a content deletion that never touched the gradient. Stops were re-cut to
0.97 / 0.95 / 0.93 / 0.90 / 0.40 at 0 / 35 / 70 / 88 / 100%. Re-measured:
every text-carrying band now passes, worst **4.55:1** at 70%. Re-measure
after ANY content change in this section.

**Deleting the disclosure also removed real liabilities**, verified absent
from the served HTML: "5-Star Certified Tree Experts" (a star claim on the
MUST-NOT-SHIP list), a Raleigh/Cary/Apex/Hurdle Mills town list belonging to
the previous client, and "see what our clients are saying on Google,
Facebook, and **Angi**" — EBS has neither a Facebook nor an Angi profile.

⚠️ It also removed the only in-body link to **/about** from the home page,
and this section now emits `view_section` and nothing else — it has no
interactive elements left. Two consequences: the nav is the sole route to
/about from home, and the section is now HOOK-FREE apart from its React view
observer, so migrating it to Mechanism A is newly available if the home page
ever splits its islands.

**Then the ramp was opened properly (2026-08-30, final).** Ryan judged the
fade "too low" after the deletion, which it was — protecting grey prose had
squeezed the whole reveal into the bottom sliver. Both halves of the
blocker were fixed together, because they are coupled:

1. **Prose darkened from `text-subtext-color` to `text-default-font`.** Grey
   measured 4.55:1 at its worst band, sitting on the AA line, which is what
   pinned the gradient. Navy measures **12.71–13.94:1** across every prose
   band — roughly three times the headroom, and the constraint moves off the
   prose entirely. ⚠️ Reverting to grey REQUIRES pulling the stops back up.
2. **Stops reopened** to 0.96 / 0.93 / 0.80 / 0.62 / 0.42 at 0 / 18 / 45 /
   75 / 100%.

Photo visibility, sampled as a MEDIAN across each row (what the eye sees) —
note this is a different statistic from the 90th-percentile sampling used
for contrast, which deliberately measures only the paper between glyphs:

| band | left column | right half |
|---|---|---|
| 5% | 0.982 | 0.930 |
| 45% | 0.794 | 0.618 |
| 75% | 0.748 | 0.438 |
| 97% | 0.694 | **0.219** |

**Dialled back to a FINAL ramp** — 0.97 / 0.95 / 0.91 / 0.76 / 0.42 at 0 /
32 / 62 / 84 / 100%. Ryan compared the wide-open version against an earlier,
whiter state and preferred the whiter one: the house was reading through the
copy. White now holds to ~62% and the fade does its work in the last third.

| band | left (final / wide-open) | right (final / wide-open) |
|---|---|---|
| 30% | 0.956 / 0.896 | 0.922 / 0.807 |
| 45% | 0.929 / 0.794 | 0.784 / 0.618 |
| 60% | 0.939 / 0.802 | 0.847 / 0.554 |
| 75% | 0.875 / 0.748 | 0.703 / 0.438 |
| 97% | 0.713 / 0.694 | **0.253** / 0.219 |

⚠️ The stops below the heading are now a PURELY VISUAL choice, not an
accessibility-constrained one — navy prose measures **13.27:1** at its worst
band even here. If this is reopened later the limit is taste, not contrast.

**A single-left-stack variant was built and then REVERTED (2026-08-30).**
Four ASCII layouts were sketched for Ryan to compare; he picked one in the
selection UI and it was implemented immediately. That was a MISREAD — he had
asked for sketches to look at, not for the winner to be built. Reverted at
his request: the two-column row is back and the guarantee callout is again a
bordered card in the right column, `md:self-center`.

Worth keeping from the episode:
- **Picking an option in a comparison is not approval to build it.** When
  the request is to sketch, ask before implementing the choice.
- **Two findings from that pass are still true and unacted on.** The body
  measure runs **86 characters per line** at 608px (Inter 14px, average
  glyph 7.01px, measured via canvas in the element's own computed font —
  not inferred from font-size), against a readable range of 45-75. And the
  guarantee card sits over the region where the photograph reads most
  strongly (~0.25 luminance, right side).
- The hand-drawn `StarIcon` was KEPT when the card returned, in place of the
  original `FeatherStar` + `IconWrapper`: visually identical, and it avoids
  re-adding `@subframe/core` to this file purely to redraw the same shape.

Restored state verified at 1440: card at x=752 in the right column, 608px
wide, centred at 42% of the section, one star inside; inline rule gone;
prose back to 608px; section height back to 588px. Two columns at 1440,
stacked at 390, `scrollWidth` clean at both.

⚠️ **PRE-EXISTING ACCESSIBILITY FINDING, surfaced by this work and NOT caused
by it.** The headline's "20 Years" is `brand-secondary` gold, which measures
**2.15:1** — against a background luminance of 0.992, i.e. essentially
white. WCAG needs 3:1 even at large-bold sizes. Gold at that luminance
cannot reach 3:1 on white at all, so this has never passed on any
background. Worse, gold is mid-luminance, so it DEGRADES as the backdrop
darkens rather than improving — which is why the ramp is kept whitest at the
top. Fixing it means a darker gold for text use; `--color-brand-secondary-text`
already exists in global.css for exactly this reason (L32, measured 4.73 on
background) and has no consumer yet.

Two bugs surfaced while doing it, both fixed in place:
- `"EBS's EBS Service Guarantee"` rendered in TWO places, from a
  `${nameShort}'s ${guaranteeName}` template. `guaranteeName` already
  carries the brand. The possessive template is a FORK HAZARD — it only
  reads correctly when the guarantee name does not start with the company
  name, which was true of the previous client and is not true here.
- The guarantee callout said "our healthy tree guarantee" — previous-client
  wording, live on the home page. Now reads the config token.

⚠️ STILL STALE, not touched: the service-area section's About prose opens
"Since 2007, Medrano's has proudly served the Raleigh–Durham Triangle…".
Wrong company, wrong region, and wrong year (EBS is 2006). It is a
paragraph-scale rewrite with claims implications, so it belongs to the copy
sweep rather than a layout pass.

The gap is therefore back to 447px and this section is **left-heavy by
design now**: column 2 holds one element. Closing it means either giving
that column something to hold or abandoning the 50/50 grid — still Ryan's
call, still deliberately not guessed at.

⚠️ **MOBILE ORDER SURVIVED ALL OF IT** — still header → map → contact →
locations, verified by computed `order` (-9999 / 1 / 2 / 3) at 390. That is
the payoff of `display: contents`: JSX moved between the two column
wrappers changes only the DESKTOP column, never the single-column sequence.
Deliberately NOT renumbering, because putting contact after `order-3` would
bury the phone number under a now-expanded 15-town list on phones.

⚠️ PROCESS NOTE. Two edits to this file in one session did not land as
reported: a scripted cut-and-paste of the contact block silently no-opped
while its surrounding asserts passed, and a `useState(true)` hunk was later
found reverted on disk (the editor has this file open; Claude Code twice
reported "modified on disk since you last read it"). BOTH were caught only
by re-reading the file and re-probing the DOM — `tsc` and `npm run build`
passed throughout, because every intermediate state was valid TypeScript.
Verify structural edits to this file by grepping the result, not by
trusting the edit's exit status.

⚠️ Measurement trap worth keeping: comparing the two column BOXES reports
`deadSpace: 0` in every one of those states, because grid stretches both.
Only content height reveals the hole.

**The Google My Maps iframe was replaced by `ServiceAreaMap.tsx`** — inline
SVG, same session. Two problems were solved at once: the embed was the
PREVIOUS CLIENT's map (Raleigh-Durham Triangle) AND carried My Maps' black
title bar, which is part of that product. The bar can be cropped with CSS
but not removed, and the bottom "Map data © Google / Terms" strip has to
stay for Google's terms — so an embed could never reach the clean reference
Ryan supplied. His reference was not My Maps at all; it was a map with a
polygon layer.

Geometry is US Census TIGERweb county polygons (public domain), projected
equirectangular with a cos(lat) correction and simplified Douglas-Peucker —
the three service counties at a tight tolerance to keep their real jagged
edges, 25 surrounding context counties harder. Total path data ~11 KB of
text, which gzips well and is the whole cost: **zero network requests, zero
preloads, no API key, no third-party script, no attribution strip**, on the
7 routes this section renders on.

Why SVG and not an image: `<img src="*.svg">` outlines the text and freezes
the colours. Inline, the labels render in the SITE WEBFONT and the fills
read the theme tokens, so a fork re-skins the map by changing
`--color-brand-primary`. Verified in computed style: service fill and
stroke both `rgb(22,133,204)` (`--color-brand-primary`, not a fallback),
labels Inter at `rgb(23,41,58)` (`--color-default-font`).

The viewBox aspect (1000x630, 1.587) was chosen to MATCH the measured
container (606x382, 1.586) — bbox of the three counties padded 10%, then
widened on the short axis to hit that ratio. `preserveAspectRatio` is
`slice`, so an aspect change crops outer context rather than letterboxing.
⚠️ Regenerate rather than hand-edit the path data, and note that nothing
warns you if `CLIENT.geo.serviceCounties` changes — the map goes stale
silently.

Also fixed in the same edit, because it sat directly beside the map and
would have contradicted it: the "Service Areas" lists were still the
previous client's Triangle towns (Raleigh / Durham / Chapel Hill, then 15
more). The preview row now reads `CLIENT.geo.previewCities`. ⚠️ The
expanded list is real municipalities in Duplin/Sampson/Wayne but is
**derived from county geography, not confirmed** — see §6.

**BusinessStatisticsWrapper.tsx** — rebuilt, `StatisticsSection` dropped
(its centred header-over-row layout is the opposite of the York stack, and
it carried a 9-class `[&>div:nth-child(2)]:` cluster to repaint the parent's
inner box). Now a full-bleed **navy band** — `--color-default-font` used as
a surface — with the copy stack left and the figures right, stacking at
`md`. No `<img>` at all, so it adds nothing to the preload set.
- Gained the **full tracking contract**: it emitted NOTHING before, and was
  the only wrapper on the home page not receiving the page-level `TRACKING`
  spread. Mechanism A (`data-track-view`) — the wrapper is hook-free.
- **"24/7 Support" removed** (MUST-NOT-SHIP) and **"18+ Years" → derived**
  from `yearFounded`, so it now reads 20+. See §6.
- Contrast fixed as a side effect: labels were white/80 on brand-primary
  blue at **3.12:1**; they are now white/80 on navy at **9.98:1**.

**ServicesGridSectionWrapper.tsx** — rebuilt, `ServicesGrid` dropped with
its 11-class `[&>div:nth-child(2)]:` cluster. Off-white surface, York
header, 8 tiles (7 services + a navy CTA tile) at 4/2/1 columns. Fixes
five things beyond layout — the cards listed TREE SERVICES; every card
linked to `#home-contact` instead of its service page; the grid
contributed no links to `/services/*`; tracking labels were
`slugify(title)`-derived rather than declared; and it no longer hydrates
(parallax scroll listener + React observer both removed, now Mechanism A).
Icons are 7 hand-drawn inline SVGs — Feather has no roof/siding/gutter
glyph, which is why the old version used Axe and Scissors on roofing work.

**PortfolioGalleryWrapper.tsx** — rebuilt three times. Carousel → mosaic
grid → CSS masonry → **CENTER-FOCUS CAROUSEL** (current), to a reference
Ryan supplied. Masonry's natural-height tiles read as "kidish"; the brief
is every photo trimmed to the SAME rectangle by its window. So each slide
is a fixed **16:10** viewport with object-cover, active slide raised with
a white ring, neighbours bleeding off the screen edges, arrows + dots +
centred CTA below.

Track sits OUTSIDE the max-w-[1280px] wrapper so slides reach the viewport
edges; it is a 100%-width block, NOT `w-screen`, which would ignore the
scrollbar and add ~15px of overflow. First/last slide centring is
`px-[calc((100%-var(--slide))/2)]` — measured centring error **0px at
every position, both viewports**.

Trade-off accepted: 2 of the 7 files are portrait (0.75), so a 1.6 window
discards ~53% of their height. Masonry was the version that cropped
nothing. `object-position` is the lever if a crop cuts a subject.

**Opens on slide index 1** (the second photo) as of 2026-08-30, by request
— slide 0 is one of the two portrait sources and so shows the heaviest
crop in the set, which is a weak first impression. Added as an
`initialSlide` prop defaulting to 1, clamped to `images.length`.

The subtlety worth keeping: the opening slide is a SCROLL POSITION, not
render state, so it cannot be expressed by a prop alone — a one-shot mount
effect scrolls the track, and `active`'s initial state is seeded from the
same clamped index so the ring and the track cannot land on different
slides. `behavior: "instant"` (not `"auto"`) so it neither animates on
arrival nor inherits a CSS `scroll-behavior: smooth`. `stepPx()` measures
child rects and returns 0 before layout, so the effect retries on rAF up
to 10 frames — without that it opens on slide 0 whenever layout lags,
which presents as "works sometimes".

Measured at 1440 and 390: `scrollLeft === step` (682 / 340), centred slide
index 1, **centring error 0px**, `ebs-gallery-2-roof-repair.jpg` centred,
active dot `portfolio-gallery-dot-2`, prev arrow enabled from load. Prev
lands exactly on slide 0; two nexts return to 1.

Biggest win was never the layout: the carousel shipped **six non-lazy
`<img>`**, so React 19 preloaded all six at high priority including two
that 404'd. Preloads on `/` went **10 → 4**. Also de-hydrated (Mechanism
A), dropped `@subframe/core`, added intrinsic width/height to every tile
(CLS), and fixed "across the Triangle" in the subtitle.

**TrustBadgesWrapper.tsx** — NEW section, home only, between hero and
services. An infinite CSS marquee of four badges built from a `TrustBadge`
component Ryan supplied.

Each badge wears a DIFFERENT silhouette — roofline pentagon, shield,
flat-top hexagon, chevron band — driven by a `SHAPES` table keyed on a
`shape` prop. (A shingle-tab silhouette held the fourth slot briefly on
2026-08-28 before Ryan swapped it for the chevron; it is one table entry
away in git history if a fifth badge ever wants it.)

The TENURE badge additionally wears a gold-FOIL field — an eight-stop
gradient with alternating deep/light banding, which is what reads as metal
where a two-stop ramp reads as a flat tint. On foil the palette inverts:
field becomes the gradient, and rule/eyebrow/lines all become the navy that
is normally the field. Only one badge is foiled on purpose; a second would
cancel the emphasis.

⚠️ The foil's deep stop is `#C08F1E`, NOT the darker `#A67C18` that reads
better as metal. Navy text measures **3.90:1** on the darker and **5.08:1**
on the one shipped, and the badge's 11px eyebrow needs 4.5:1. Because text
crosses every stop, the whole gradient has to clear AA rather than just its
mid-tones — measured 5.08 / 6.86 / 11.47 / 13.34. Three new tokens carry
the stops (`--color-brand-secondary-foil-deep/-light/-peak`) so a fork
re-skins the foil instead of stranding one badge in EBS gold. All four are drawn inside the SAME 140x162 viewBox, which is
what keeps the marquee pitch even; per-shape viewBoxes would make the
strip's rhythm lurch as different silhouettes scrolled past. The sheen is
NOT part of that table — it is two fixed diagonal slivers clipped to
`outline`, so it takes the right shape automatically and a new silhouette
needs no sheen work. Only `textY` varies, because the usable area does
(the pentagon loses its top corners to the peak; the shield tapers). **Zero network requests and
zero preloads** — the badges are inline SVG, so React 19's preload pass
never sees them, and unlike `<img src="*.svg">` the text stays live in the
site webfont instead of being outlined. Zero client JS too: the marquee is
CSS and `useId` is render-time, so Mechanism A still applies.

Sized so a desktop viewport shows **six** badges — the four distinct ones
then the cycle restarting, matching the reference. Measured at 1440: badge
152x176, pitch 232px, **6 fully visible + 1 clipped at the edge** reading
`SINCE | FULLY | BOTH | FAMILY-RUN | SINCE | FULLY | BOTH`. The clipped
seventh is deliberate — a badge cut by the edge is what signals motion;
exactly six would read as a static row.

Scaling the badges up REDUCED the DOM: bigger badges fill the width with
fewer copies, so `MARQUEE_REPEATS` went 5 → 3 and the track went 40 → 24
badges while still covering a 2560 display (set width 2785px, A and B
identical so the -50% loop is seamless).

Also measured: all 12 text runs sit inside the gold rule, no document
overflow attributable to this section at any width, and
`prefers-reduced-motion` degrades to a static row.

Two token references in the supplied component were fixed: `--font-display`
and `--color-badge-field` **do not exist in this codebase**. Both fell
through to literal fallbacks, so the badge looked right while being
effectively hardcoded and would have stopped matching the brand on the next
fork. Now `--font-heading-1` and `--color-default-font`; verified resolving
to rgb(23,41,58) and rgb(221,168,44).

**ReviewsCarouselWrapper.tsx** — rebuilt 2026-08-30. No Subframe parent to
drop; this one was already wrapper-authored. Now **three cards per set** on
desktop by request (1 / 2 / 3 at <768 / 768-1023 / >=1024), so six reviews
give exactly **two** sets instead of three. The middle tier deliberately
stays at two — the 768-1024 band already carries the known overflow (§6),
and measured `document.scrollWidth` after the change is **identical** to the
pre-existing figures (768→1056, 900→1056, 1024→1080), so this did not move
it either way.

Gained the York header (eyebrow → title → caption, left-aligned; measured
`eyebrowX === titleX` at all six widths). **At lg and up the arrows sit in
that header row on the right, above the cards**, to a reference Ryan
supplied (Walton Contractors). `items-end` on the header flex bottom-aligns
them with the caption — measured `arrowBottom === captionBottom` exactly at
1024 / 1280 / 1440, and 40px of gap to the content column's right edge at
every width ≥768. Below lg they fall back under the grid, within thumb
reach. The pair is defined once as a local `NavArrows` and rendered in both
slots, so `reviews-prev` / `reviews-next` appear TWICE in the served HTML;
exactly one pair has a layout box at any width (measured), so no
double-fire. Also gained the **full tracking contract**:
the arrows and dots previously carried NO `data-event` at all, so every
interaction with this carousel was invisible. Migrated **Mechanism B → A**
— the React observer is gone; it still hydrates for the carousel, so this
is the PortfolioGallery arrangement, not a de-hydration.

Avatars are now `loading="lazy"` with intrinsic 80×80. That was forced by
the change rather than optional: two avatars were already consuming two of
the four image preloads on `/`, and going three-up would have made it
three. **Preloads on `/` went 4 → 2** (logo + hero poster only).

⚠️ **The copy is still the previous client's.** All six testimonials are
Medrano's customers writing about tree removal. Ryan's decision 2026-08-30,
after being shown this, was to TRIM them in place and leave replacement to
the copy sweep — so the shortening is a length edit, not a fix, and the
section is not shippable as-is. See §6.

**PrivacyPolicyWrapper.tsx** — tracking props, `data-track-view`, click
events on contact links.

**All one-off page builders** — declare a page-level `TRACKING` const.

**Home page reordered** to intent order. The counties section was deleted
entirely. Current order as of **2026-08-30**:

```
navbar → hero → trust-badges → service-area → services → portfolio →
reviews → guarantee → stats → contact → footer
```

The service-area / services pair has now moved twice — swapped on
2026-08-27 so the page led with what EBS sells, then service-area moved
back above the grid on 2026-08-30 by request, since that section also
carries the "20 Years / About Us" block and so reads as the company
introduction rather than purely a coverage answer.

**Surfaces are positional and must be re-derived on every reorder**, not
carried over. Checked at the new positions: service-area opens on solid
white and lets its photo emerge downward, so its BOTTOM edge is photo and
meets the services grid's `bg-white` as a clear seam; the grid's white
still separates it from the off-white portfolio below. Nothing needed
repainting. The one softened transition is trust-badges
(`bg-default-background`) into service-area's white top — the scrim was
originally drawn against the hero photo, so that entry is now a subtler
line than designed.

⚠️ `#service-area` is defined ONLY on EBS-Home's wrapping `<section>`, not
on the component (root §6.6.1 direction 2), so that element has to travel
with the component on any move — the footer links to it. Verified after
the move: all eight home anchors appear exactly once in the served HTML.

**Image pass** — preloaded image weight on `/` went **8.19 MB → 1.29 MB**.
See §5.2; this was the single largest performance lever on the site.

**ABOUT PAGE — `InfoImageColumnWrapper.tsx` (2026-08-31).** The framed photo
defaulted to `/images/about-service-photo.jpg`, **which does not exist**, so
every `/about` load shipped a broken `<img>` and the dashed frame collapsed
to two bare lines. Now `ebs-gallery-6-exterior-project.jpg`.

⚠️ ASPECT IS THE WHOLE STORY in that frame: the Subframe parent
constrains neither frame height nor `object-fit`, so the source renders at
natural aspect against a fixed ~350px copy column. The portrait first pick
(`ebs-gallery-1-roof-replacement.jpg`, 0.750) measured **616x819 against
616x350 — a 469px hole**; the landscape swap (1.333) took that to **114px**
and the section from **947px to 592px**. No CSS needed — cheaper than
cropping, and the photo keeps its whole frame.

Also recoloured the parent's two hardcoded previous-client greens — dashed
frame lime `#84cc16` → `default-font` navy, corner icon green `#057a32` →
`brand-primary` blue — via `[&_.border-dashed]:` and `[&_svg]:` arbitrary
variants. Both are COLOURS, so rung 3 of root §7.1; no theme-tab edit.

⚠️ THREE THINGS THERE ARE STILL UNFIXED, all Subframe-parent-owned: the
`<img>` can take no `loading` or `alt` from a wrapper (root §7.1's ceiling —
those are ATTRIBUTES, not styles), so `/about` preloads a real 368 KB image
at high priority; the icon is still a **deciduous tree glyph**, recoloured
but not replaced; and both headings are still hardcoded green. All three
close only via the theme tab or a wrapper-authored rebuild.

**ABOUT PAGE — `ResidentialCommercialWrapper.tsx`, NEW (2026-08-31).**
Residential/commercial capability pair over one shared CTA, to a Shingle Hut
reference, between `info-image-column` and `faq`. Fully wrapper-authored,
hook-free, zero client JS, no `<img>` so it adds nothing to the preload set.
Section name `residential-commercial`.

Both cards carry the **same eight pills**, by request ("all the information
is the same because we also have all the same capabilities"). The caption
says so explicitly — load-bearing, not filler: two identical lists with no
explanation read as a copy-paste bug. If the two sides ever diverge, give
each its own array AND rewrite the caption; they are coupled.

Measured at five widths: card tops and pill-grid tops identical at every
desktop width (each card's `flex-1` prose block equalises them), contrast
4.91:1 blue bar / 14.84:1 navy bar / 14.84:1 chip and CTA, `scrollWidth`
clean at 1440 and 390 and byte-identical to the pre-existing figures at
768/900/1024.

**CONTACT PAGE — `OurProcessStepsWrapper.tsx` rebuilt (2026-08-31).**
`OurProcessColumn6Step` dropped. Light ground with two skewed diagonal
bands, two-tone display headline left against intro prose right, five
numbered step cards each wearing an overlapping 72x72 icon tile, supporting
line, centred CTA. Four things fixed beyond layout:

1. **The content was entirely the previous client's** — five tree-work steps
   opening "Contact Medrano's for a free tree health and removal assessment"
   and closing on "our healthy tree guarantee".
2. **Five high-priority image preloads removed.** The step icons were PNGs
   rendered without `loading="lazy"`. Image preloads on `/contact` went
   **7 → 2**. ⚠️ The five `step-*.png` files are now ORPHANED.
3. **Mechanism B → A**, dropping `"use client"` and `@subframe/core`: the
   section ships zero client JS.
4. **It had no CTA and no click tracking at all** — it described a five-step
   process and then offered no way to start it.

⚠️ **FIRST CONSUMER OF `--color-brand-secondary-text`.** The headline's
accent half uses it (measured **4.73:1**). It had to: display
`brand-secondary` gold is **2.15:1** and fails even the large-text 3:1 bar,
so the site's own display gold cannot legally carry a headline. §6 has
carried that token as "exists, no consumer" since it was written — it now
has one, and this is the pattern to copy for any future gold-on-light text.

⚠️ CLAIMS: the reference's step 4 is "Insurance Claim Support" and its
closing line is "we answer calls 24/7". Neither shipped — see the CLAIMS
REGISTER's new UNVERIFIED CAPABILITIES table. Step 4 is scheduling; the
closing line is the free-estimate/no-obligation wording from
`CLIENT.offers.items[0]`.

**SERVICE PAGES — per-service hero photos + hero rebuild (2026-08-31).**
`heroImage` and `heroImageAlt` added to `ServicePageData`: seven independent
paths, one per service. **Required fields with no default**, so omitting one
on a new service is a TypeScript error rather than a silent fallback.

Same class of bug as the About photo: the wrapper hardcoded
`/images/services-bg.jpg`, **which does not exist**, so all seven service
pages shipped a broken `<img>` AND preloaded the 404 at high priority.

⚠️ THE VALUES ARE STAND-INS. The structure was the deliverable; swapping
one is a one-line edit to that record and touches nothing else. Two of the
seven (**both gutter services**) are flagged GENERIC in-file because the
repo contains no gutter photograph at all, and `metal-roof-installation`
uses a portrait 0.750 source in a ~3.4:1 band, so it crops hardest.

`ServiceONEHeroWithRatingsWrapper` was then rebuilt and `RatingBadgesTruTemp`
dropped. **That parent is what drew the dark strip** at the bottom of the
hero: it hardcodes `bg-neutral-900/40 backdrop-blur-sm` on its CONTAINER, so
it painted a 48px tinted bar even with zero badges, and no `className` could
reach it (root §7.1). Also deleted five arbitrary-variant overrides and the
stray Subframe `mobile:` breakpoint (the rest of this site switches at
768px). The full-photo overlay is off by default by request; the prop is
kept, so re-enabling is passing a class rather than rebuilding the layer.

⚠️ `loading="eager"` on that image is DELIBERATE and must not be "fixed"
to lazy. This band is the LCP candidate on a service page, so React 19
preloading it is correct HERE — the one place on the site where root §9.13's
lazy rule does not apply.

**It also gained the tracking contract, as section `service-hero`.** It
previously received NO props from `ServicePageBLDR` and emitted nothing on
all seven routes. Same precedent as `BusinessStatisticsWrapper` (client
§3.7): this CREATES a new series rather than restoring a lost one, done now
because it is free without a container.

⚠️ Its ratings strip is deliberately left EMPTY. It reads
`CLIENT.reviews.platforms`, which is `[]`. Pointing it at
`trustBadge`/`reviewCount` would make it appear instantly — and would push
the contested `5.0★ / 3 Google reviews` claim onto seven more routes,
settling an argument §6 records as open. Once settled, populate `platforms`
and the strip appears with no code change.


**CITY LANDING PAGES — the whole route pattern, all six routes
(2026-09-01, commit `433fab0`).** The largest single block of previous-client
content on the site, and the last route pattern still carrying it. All four
audited defects fixed, two further sections rebuilt, one new section added.
Verified by crawling all six routes: ZERO occurrences of Medrano, tree,
arborist, Durham, Raleigh, Triangle, 24-7, pruning or stump in the served
HTML.

`LandingContactForm` — the tree services are gone; six real EBS options
ending in **Other**. ⚠️ Gutter Installation and Gutter Cleaning were
removed BY REQUEST, so gutter leads now arrive as "Other" (§6 carries
this as an open decision, not an oversight). This was the highest-harm defect
of the four: the selection feeds `service_type` into `/api/contact`, so a
Goldsboro roofing lead was arriving by email reading "Service: Tree Removal".
⚠️ Tracking labels now use the **DECLARED slug**, not
`slugify(display name)` — that closes root §8.5's documented drift
locally, where a marketing copy edit silently moves a GA4 dimension with
nothing in the diff to show it. `AltContactForm2` dropped for a
wrapper-authored two-column card; migrated Mechanism B → A, observer
deleted in the same edit. Defaults are now EBS-generic (client §3.4).

**Landing hero** — the `/images/services-bg.jpg` 404 is fixed.
`heroImage` and `heroImageAlt` are now **required fields with no default** on
`CityLandingPageData`, one photo per city, so omitting one on a new city is a
TypeScript error rather than a silent broken LCP. Same shape as the
service-page fix the day before. The wrapper now owns the `<img>`: the
Subframe parent emitted one with no `alt` and no way to pass one, which is
root §7.1's ceiling — an attribute on Subframe-rendered markup is
unreachable from a wrapper at any rung. All preloads on a city landing now
resolve. ⚠️ The COUNT dropped from three to TWO later the same day, when
OfferShowCase was migrated to /about and took its slide image with it. ⚠️ Its `eager` load is DELIBERATE, like the service
hero: this image IS the LCP element on these routes.

`CenteredCopyAreaWrapper` — rebuilt. `Info_Sec1_330` dropped;
left-aligned on one 720px measure; services as two-up cards with a hover fill
flip. ⚠️ **Nothing in this section is centred any more, and the file
and section name were kept anyway.** `data-section="centered-copy"` is a
tracking key; renaming would make it a THIRD name to keep in step alongside
the filename and the anchor id. Trust `data-section`, not the filename —
this is now the third such mismatch on the site (see also `AboutUsVariant1`
→ `service-guarantee` and `ServiceGuaranteeAndFeaturesWrapper` →
`map-and-benefits`). ⚠️ Everything in the section shares the 720px
measure and ends at **x=800 at 1440**; that alignment was asked for
explicitly and widening any one child breaks it silently.

`OfferShowCase` — three INVENTED previous-client offers replaced. Slide 1
reads `client.config.ts`; slides 2 and 3 are editorial (About Us, Our
Services → `/#services`). ⚠️ Its arrow slots take a **zero-size
placeholder** rather than `null` when there is only one offer: the fifteen
`[&>div:first-child>div:nth-child(n)]` overrides are POSITIONAL, so nulling
an arrow re-indexed all of them and threw the photo 160px off-screen. Do not
tidy the placeholder away.

`FooterSection` — `#reviews`, `#service-area` and `#services` are now
root-relative, so they resolve from all 18 routes rather than only from home;
the four service links open their own pages; the "Keep Calm and Let Medrano's
Handle It." tagline is gone site-wide.

**NEW `CredentialBandWrapper`** — full-bleed brand-primary marquee,
section `credential-band`, reusing `TrustBadgesWrapper`'s technique and its
`ebs-badge-marquee` keyframe. Zero client JS; degrades to a static row under
`prefers-reduced-motion`. ⚠️ Its type is **24px/600 deliberately**:
white on `--color-brand-primary` is **3.99:1**, which fails AA for normal text
and clears it only as large text. Softer body tints on that fill were measured
and all rejected — brand-100 4.17:1, brand-200 3.56:1, white/90 4.28:1.
If smaller type is ever wanted the GROUND has to darken; polarity does not
help, because contrast is a property of the colour pair.

**NEW `serviceIcons.tsx`** — the seven service glyphs extracted from
`ServicesGridSectionWrapper` plus an `IconOther`, keyed by slug. Inline SVG,
so invisible to React 19's preload pass and able to use the site webfont,
which an `<img src="*.svg">` cannot.

**NEW `--ebs-tex-creases-alt`** in `global.css` — a second fold
arrangement of the folded-paper sheet, so the benefits band carries the same
material as the service-area section without being a copy of it.

`TallServicesBenefitsCards` — rebuilt, and this one was the expensive
find. Its copy was the previous client's ("WHY CHOOSE MEDRANO'S TREE
SERVICE", "ISA Certified Arborist", "healthy tree guarantee", "RDU Triangle
since 2007") **and `ServicePageBLDR` renders it with NO PROPS AT ALL**, so
those "unreachable defaults" were exactly what all seven service pages
served. Root §13.3.8 in its most expensive form: the rule warns that
editing an unreachable default yields a clean diff with zero effect, and the
mirror case is that a default nobody reads as live copy IS the live copy.
Fixed, gained the tracking contract as section `why-choose-us`, and gained an
opt-in textured prop.

⚠️ **`why-choose-us` landed on THIRTEEN routes at once** — all
6 city landings and all 7 service pages — which is the widest single
addition of the redesign and the reason its emission is **conditional on
`trackingSection` being passed**. A shared component that gains the contract
must emit conditionally and every builder that renders it must be updated in
the same edit: a section whose `city`/`service`/`page_type` are all
`undefined` is worse than silence, because it looks like data. Both consumers
pass it today.

**Section order on a city landing is now:** navbar → hero →
contact-form → hero-offers → credential-band → why-choose-us
→ centered-copy → map-and-benefits → footer. The surface run is
white → brand-primary band → white+creases-alt → white →
white+creases. The blue band is the strongest step on the page and is doing
the seam work on BOTH sides of it, so it is positional, not decorative
— re-check its neighbours before reordering anything here.

**FAQ — /about copy rebuilt, and a NEW service-page section (2026-09-01).**

`/about`'s FAQ was still five Medrano's tree-service Q&As. The title slots
were already tokenised, so the heading read "FAQ ABOUT EBS'S ROOFING &
SIDING" over questions naming a competitor — which is exactly what made it
survive this long. Cause: `EBS-About` passes no `items`, so
`FullStretchFaqWrapper`'s `defaultFaqItems` were the live copy. Root
§13.3.8, FOURTH instance. ⚠️ **TWO questions were DROPPED rather
than reworded** — "Does Medrano's help with insurance claims?"
(UNVERIFIED CAPABILITY) and "Does Medrano's handle emergency tree removal?"
(MUST-NOT-SHIP). A third, a tree-removal DURATION question, went because no
timeline is recorded anywhere. Also fixed in passing: `/about`'s meta
description, which was "serving the Durham, Chapel Hill, and the Triangle
… tree removal, trimming, and expert arborist care" and claimed
"thousands of homeowners" against a cleared figure of 1000+.

**NEW `ServiceONEFaqWrapper`** — service pages, in the 60% left column
directly under `ServiceONEtallLocationWrapper`, to a supplied competitor
reference. Left-aligned with its siblings and clearing the right rail:
measured at 1440, left edge **120** matching `service-caption` and
`why-choose-us` exactly, right edge **840** against the visible form's left
edge of **880**.

⚠️ **Native `<details>`/`<summary>`, not a React accordion.** The
open fill, chevron rotation and body reveal are all CSS `group-open:`
variants, so the wrapper has no hooks, no `"use client"` and ships ZERO
client JS — which is what lets it use Mechanism A. It also means all five
answers are in the served HTML, where `/about`'s Radix accordion ships only
the first. Do not "upgrade" it to a stateful accordion.

⚠️ **What was NOT taken from the reference.** Its near-black ground
was dropped — this sits in a white column beside a white form. Its
"GOT A ROOFING EMERGENCY? YES, WE DO EMERGENCY REPAIRS!" is MUST-NOT-SHIP,
and its "HOW LONG WILL MY ROOF REPLACEMENT TAKE?" is a duration promise with
no source. Same trap that produced the UNVERIFIED CAPABILITIES table: the
layout was the ask, the claims came along with it.

Contrast measured from computed style: open row **4.91:1**
(white on `brand-primary-hover`, NOT `brand-primary`'s 3.99), closed row
14.84:1, body 7.81:1, gold heading and eyebrow 5.04:1.

⚠️ The heading is service-NEUTRAL ("Answers to your common
questions") because one wrapper serves all seven routes — "roofing
questions" reads wrong on `/services/gutter-cleaning`.

⚠️ **THREE probe defects during this verification, all mine, none
the site** — the running total is now seventeen. (1) `querySelector` for
the contact form grabbed the `lg:hidden` MOBILE copy, which has no layout
box at 1440, so the form read as `left: 0` and the FAQ looked like it
overlapped. Two copies exist; take the one with width > 0. (2) Tailwind v4's
`rotate-180` sets the standalone CSS **`rotate`** property, not `transform`
— reading `.transform` returns "none" on a correctly rotated element.
(3) A closed `<details>` still reports a non-zero rect for its inner `<p>`;
the container is what is clipped (66px vs the open row's 180px). Measure the
`<details>`, not its child.

Overflow re-measured after the layout work: **1056 / 1056 / 1080 at
768 / 900 / 1024, clean from 1100** — identical to the documented
pre-existing figures, so this section added none, and it never overflows its
own container at any width from 375 to 1440.


**ABOUT PAGE — offers carousel migrated in, concrete ground, brand fixes
(2026-09-01, close-out).**

`OfferShowCase` MOVED here from the six city landings, between
residential-commercial and faq. A move, not a copy: it renders on no city
landing now. ⚠️ Its `ctaHref` default is `#landing-contact`, a
city-landing anchor, so every consumer must pass one — `/about` passes
`/contact`. A dead fragment link neither errors nor warns, so this fails
silently if forgotten.

⚠️ **Slide 2 now self-links.** Its "About Us" CTA points at `/about`,
which is the page it renders on. Introduced by the migration; needs a new
destination or a different slide, which is a copy decision.

**Concrete ground** applied to `trust-headline-ratings` and
`info-image-column`, the same procedural surface the home services grid
uses. Extracted into a shared **`ConcreteGround.tsx`** rather than pasting
the five-div stack a third time. ⚠️ `ServicesGridSectionWrapper` STILL
CARRIES THE INLINE ORIGINAL and was deliberately not switched over — two
implementations now exist, so keep their opacities in step or the home page
and /about will read as different materials.

⚠️ The host section must set `relative isolate`. The turbulence layers
blend with their BACKDROP via mix-blend-multiply, so without a stacking
context of its own that backdrop is whatever the page painted beneath the
section, and the texture leaks onto the neighbour.

⚠️ `ResidentialCommercialWrapper` below already used
`--color-ground-concrete` FLAT, so three consecutive sections on /about now
share that ground colour, the first two textured. It reads correctly because
that section draws its own gold top rule, but the run is worth knowing about
before anything moves.

**Two hardcoded previous-client greens fixed** in `InfoImageColumnWrapper`.
The Subframe parent bakes literal `text-[#057a32]` and `text-[#16a34a]` into
the title and subtitle slots, so they shipped GREEN on a page whose
brand-primary is blue — found by measuring computed style, not by reading
the component. Fixed at rung 1 (both slots are `ReactNode`, so wrapping the
value overrides what it inherits) rather than an escaped-bracket variant
pinned to a literal hex a theme-tab edit could invalidate. The dashed photo
frame was recoloured to `brand-secondary` gold in the same pass.

### Consequences to remember
- The home page no longer shows hero offer cards; `hero-offers` is not
  emitted on `/`. ⚠️ NOR ON CITY LANDINGS ANY MORE — OfferShowCase was
  MIGRATED to `/about` on 2026-09-01 (between residential-commercial and
  faq), a move rather than a copy. It remains Mechanism B (it hydrates for
  the carousel) and is correct as such. Its `ctaHref` default is a
  city-landing anchor, so every consumer must pass one; `/about` passes
  `/contact`.
  ⚠️ Its three offers were the previous client's and INVENTED — replaced
  2026-09-01. Slide 1 now reads `client.config.ts`; slides 2 and 3 are
  editorial (About Us, Our Services → `/#services`). ⚠️ Its arrow slots
  take a ZERO-SIZE PLACEHOLDER rather than `null` when there is only one
  offer, because the fifteen `[&>div:first-child>div:nth-child(n)]`
  overrides are POSITIONAL: nulling an arrow re-indexes every one of them
  and threw the photo 160px off-screen. Do not "tidy" the placeholder away.
- **The guarantee section renders on home AND all 6 city landings.** When
  the service-area/guarantee content swap happened, the map + contact +
  service-areas block therefore landed on 7 pages, and the city landings
  lost their mid-page "Get a Free Estimate" CTA. Deliberate but worth
  re-deciding — a `showServiceArea` prop would scope it to home.
- **`nav-mobile-call-icon` is no longer swap-eligible under Mechanism 1.**
  It used to render the number as visible text; it is now icon-only. See
  client CLAUDE.md §3.6 — this is fine under Mechanism 2 and EBS has no
  container yet, but it constrains which mechanism the container must use.

---

## 2. Non-negotiables when generating a section

**Tracking contract.** Every generated section must carry:
- On the section root: `data-section`, `data-city`, `data-service`,
  `data-page-type`. Add `data-track-view` ONLY if the component has no
  hooks (Mechanism A); if it hydrates for other reasons, keep a React
  observer (Mechanism B). Root §8.2.
- On every interactive element: the four above plus `data-event` and
  `data-label`.
- Use a `ctaTracking` / `tracking` const spread rather than retyping the
  four attributes per element — a partial set still fires but cannot be
  joined. HeroWrapper is the reference.
- Reuse section names from client CLAUDE.md §3.3. Do not invent one
  without adding it there.

**Never** hardcode a phone number, email, domain, or company name — wire
to `CLIENT.*` in `config/client.config.ts`.

**Claims discipline.** The authoritative source is the CLAIMS REGISTER in
`EBS_HANDOFF_Step0-Step1.md` §3 — read it before writing copy. Summary:

CLEARED: Licensed, Bonded & Insured (owner-confirmed) · in business since
2006 · OSHA-**Trained** roofers (OSHA 10/30 cards) · free estimates ·
residential and commercial · lifetime warranty on full replacements EBS
installs (pending definition).

MUST NOT SHIP: "OSHA **Certified**" (OSHA certifies nobody) · "BBB A+"
(no profile) · CertainTeed ShingleMaster (real tier, UNVERIFIED for this
client) · any star rating / review count / aggregateRating · any trade
association badge · emergency / 24-7 / after-hours copy (no emergency
line).

Two things the register does NOT cover, both open:
- The NCLBGC **licence number** is still TBD, which is why
  `CLIENT.certifications` is deliberately empty. "Licensed & Insured" as a
  phrase is cleared; a specific number is not available to quote.
- `yearFounded` is 2006, so "in business since 2006" is 20 years — but
  `BusinessStatisticsWrapper` renders **"18+ Years"**. Arithmetic error,
  not an unsupported claim. Needs Ryan's call before changing a displayed
  figure.

Root §13.10.7, client §1.

**Performance contract.** React 19's SSR emits a high-priority
`<link rel="preload" as="image">` for every `<img>` it renders that lacks
`loading="lazy"` (root §9.13). So:
- The LCP image (hero slide 1) keeps `fetchPriority="high"`, never lazy.
- **Every other image gets `loading="lazy"`.** Section backgrounds
  especially — a background is not "free because it's below the fold" on
  this template.
- Prefer inline SVG over image files for icons and badges.

---

## 3. Verification workflow

There is no GTM container, so GTM Preview cannot be used. Verify
statically and behaviourally instead.

### 3.1 Static tracking check

```bash
PUBLIC_GTM_ID_EBS=GTM-TEST0000 npx astro dev --port 4341

curl -s http://localhost:4341/ > /tmp/page.html
grep -c 'GTM-TEST0000'              /tmp/page.html   # GTM snippet
grep -c 'findTrackEl'               /tmp/page.html   # click bridge
grep -c 'data-track-view-threshold' /tmp/page.html   # view observer

# the section's attributes
grep -oE '<a[^>]*data-label="THE-LABEL"[^>]*' /tmp/page.html
```

**Full-site vocabulary audit** — the important one. Crawl all 8 route
patterns before AND after a change and diff. A pure refactor must produce
**no new or missing values**; only counts should move, and you should be
able to explain every count delta.

```bash
for p in / /about /contact /offers /privacy \
         /services/roof-replacement /service-area/clinton-nc-roofing-siding; do
  curl -s "http://localhost:4341$p"
done > /tmp/after.txt

diff <(grep -oE 'data-(section|event|city|page-type)="[^"]*"' /tmp/before.txt | sort -u) \
     <(grep -oE 'data-(section|event|city|page-type)="[^"]*"' /tmp/after.txt  | sort -u)
```

### 3.2 Behavioural checks over CDP

`astro preview` does not work under the Vercel adapter, and there is no
Puppeteer/Playwright in the repo. **Node 24's built-in `WebSocket` speaks
CDP directly** — that is the verification loop used for everything in
§1. Launch:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --hide-scrollbars \
  --remote-debugging-port=9222 --user-data-dir=/tmp/ebsnav/prof \
  --window-size=1440,1100 about:blank
```

then connect to `http://127.0.0.1:9222/json`, take the page target's
`webSocketDebuggerUrl`, and drive `Page.navigate`, `Runtime.evaluate`,
`Emulation.setDeviceMetricsOverride`, `Page.captureScreenshot`,
`Performance.getMetrics`.

**Assert on measured geometry and computed style, not on screenshots.**
Every layout claim in §1 was confirmed with `getBoundingClientRect()` and
`getComputedStyle()`. Screenshots are for the human; numbers are for the
check.

Gotchas that cost time:
- **Lazy images/iframes are not painted yet** when you scroll and shoot
  immediately. Wait 2.5–6s, or scroll past and back. A blank column in a
  screenshot is usually this, not a layout bug.
- `element.className` on an **SVG** is an `SVGAnimatedString`, not a
  string — `.includes()` throws. Use `getAttribute('class') || ''`.
- Node on Windows resolves `/tmp/...` to `C:\tmp\...`. Use the full
  `C:/Users/RYANLO~1/AppData/Local/Temp/...` path when writing files.
- Running several CDP suites back-to-back against one browser target makes
  timing-sensitive checks flake. Re-run a failure in isolation before
  believing it.
- `/tmp/ebsnav` gets wiped by Windows temp cleanup. Keep durable scripts in
  the session scratchpad.
- **SCOPE EVERY SELECTOR TO THE SECTION.** A document-wide
  `querySelectorAll('[data-event="carousel_dot"]')` hits HeroWrapper's
  dots first, because the hero renders earlier. That produced a completely
  convincing false failure during the gallery work — indexing `[6]` landed
  on the gallery's 4th dot, so a probe "proved" a scroll bug that did not
  exist, and a fix was written for it before a direct diagnostic showed all
  four scroll methods working. Cost a full debugging cycle.
- **Verify the probe before believing the failure.** Two separate scares this
  session were the harness, not the site: the above, and reading
  `fill: rgb(0,0,0)` off a badge because the selector grabbed the `<defs>`
  clip shape rather than the painted field.
- The dev server does NOT survive between sessions, and a probe against a
  dead server fails as `Cannot read properties of null` — which reads like a
  markup bug. Check the server responds before debugging the page.

### 3.3 Mobile
Headless Chrome **lies about mobile layout on this site** — it renders the
mobile nav row with spurious horizontal clipping that does not reproduce
on iOS Safari. Geometry assertions (rendered widths, line-box counts) are
still useful; a visual verdict is not. Confirm on a **real device**. Ryan
tests via phone hotspot — `npm run dev -- --host` works; the office WiFi
(`NoRa-Cafe-5G`) appears to run AP client isolation, so LAN access fails
there.

### 3.4 Always finish with
`npx tsc --noEmit` and `npm run build`. `tsc` must exit 0 **and actually
run** — root §11.7. It has already caught one real break this session (a
prop removed from a wrapper while a builder still passed it).

---

## 4. Working agreements

- **Stale previous-client copy**: fix in place when encountered during
  other work; wire to a `CLIENT.*` token where one fits. Do NOT run a
  proactive audit — a full copy sweep is a separate planned pass.
- **Renames are free right now.** No container means no history and no GA4
  joins to break. Section names, labels and slugs freeze once traffic
  starts, so get them right while it is cheap.
- Client CLAUDE.md will be **fully rewritten at the end of the build**. §3
  is current; §1, §2, §4–§9 are still Medrano's content.
- **Step summary format** — Ryan asks for "the standard six-part step
  summary". The working shape: 1. What changed · 2. Why (spec item →
  decision) · 3. Files touched · 4. Verification run + actual results ·
  5. Risks / follow-ups · 6. Open items moved or added.
  Used for every step across the 2026-08-27/28/30 sessions without
  correction, so treat it as settled rather than provisional.

---

## 5. Techniques worth reusing

### 5.1 Deferring images so they cost nothing
React 19 preloads any `<img>` in the SSR output that lacks
`loading="lazy"`. For the hero carousel, `loading="lazy"` was NOT enough —
the slides sit *in* the viewport (stacked, faded out) and browsers fetch
in-viewport lazy images anyway. The fix that works: **do not render them
server-side at all.** Mount slides 2..n from an effect after a delay, and
`new Image()` + `.decode()` them off-document first so the transition
never shows a half-painted frame.

### 5.2 The image pass
Resize each asset to the largest size it is actually DISPLAYED at (×2 for
retina), then re-encode. `sharp` 0.34.5 is in `node_modules`; ImageMagick
is not on PATH. `.trim()` + `.extend()` replace `-trim +repage`. Read the
input into a Buffer first — on Windows sharp holds the input file open and
writing back to the same path fails. Biggest single win was
`ebs-guarantee-badge.png`: 2048×2048 / 3.9 MB rendering at 192px → 30 KB.

### 5.3 Interleaving two columns that stack differently on mobile
`display: contents` on each column wrapper. On mobile the wrappers have no
box, so their children become direct flex items of the parent stack and
`order-*` can interleave the columns; at `md` the wrappers become real
flex columns in a grid. This beats explicit grid row placement, which
forces both columns onto shared row tracks and leaves dead space under the
shorter one.

### 5.4 Framing a background photo
`object-position` does nothing when the container is wider in ratio than
the image — `object-cover` fits by width and crops only vertically, so
there is no horizontal overflow to shift along. Scaling does not help
either (it grows both axes). Use `scale-*` plus `translate-x-*` on the
image box instead. Note Tailwind v4 emits the standalone `scale` /
`translate` properties, so `getComputedStyle(el).transform` reads `none` —
check `.scale` and `.translate`.

### 5.5 One clearance token
`--ebs-nav-clearance` (desktop, 120px) and `--ebs-mobile-nav-clearance`
(97px) in `global.css` feed the nav spacer, hero top padding,
`scroll-padding-top`, and the service-page sticky rail. **Declared on
`html:has(body.theme-ebs)`, not on `body`** — custom properties inherit
downward only, and `scroll-padding-top` must sit on the scroll container.
Declaring it on `body` made the property invalid at computed-value time
and every anchor silently scrolled under the navbar.

### 5.6 `text-body-bold` is not bold
`theme.css` sets `--text-body-bold--font-weight: 400` and
`--text-heading-3--font-weight: 400`. Any element using those size tokens
renders at 400 regardless of the name. Add an explicit `font-semibold`.

---

## 6. Open items

⚠️ Current through **2026-09-01** (commit `433fab0`, the city-landing session).


| Item | Status |
|---|---|
| **Review count conflict.** `client.config.ts` says `3 Google reviews`; Ryan's GBP screenshot says **2**. Feeds the hero badge AND TrustHeadlineRatingsWrapper. | Open — one-line config fix, needs Ryan's answer |
| ⚠️ **A star rating IS shipping, against the CLAIMS REGISTER.** The register's MUST-NOT-SHIP list bans "any star rating, review count, or aggregateRating" and records the decision as "named testimonials only". But `CLIENT.reviews.trustBadge` (`5.0★`) and `reviewCount` (`3 Google reviews`) render live on `/` — verified in served HTML 2026-08-30, in the hero's Google badge (`aria-label="Rated 5.0 on Google from 3 Google reviews"`) and in TrustHeadlineRatingsWrapper. | **Open — needs Ryan's decision.** This is a documented contradiction, not an accident: `client.config.ts` carries a comment saying both values were RESTORED deliberately so the line reads "5.0★ — 3 Google reviews" rather than an unqualified star claim. So config and register disagree in writing, and config is what ships. Resolve by either (a) amending the register to permit a count-qualified rating, or (b) removing both values and falling back to named testimonials. Compounded by the count conflict directly above — if the real number is 2, the site is currently overstating it. |
| ~~**Locations tab contrast.**~~ | **RESOLVED 2026-08-30.** The tab was white-on-brand-primary (3.99:1), went ghost with a brand-primary label (still 3.99:1 — contrast is a property of the colour PAIR, so inverting the polarity changed nothing), and during the section rebuild the label moved to `brand-primary-hover` (#1376B4). Measured from computed style: **4.91:1** on white at 14px/600, which clears AA's 4.5:1. Visually the same blue one step deeper. ⚠️ Keep the lesson: the button's own `text-*` class was not the only colour in play — the label span hardcoded `text-white` and rendered invisible when the button stopped being blue. |
| ~~**Rival-client media still live.** `ebs-guarantee-badge.png` reads "HEALTHY TREE GUARANTEE"; `ebs-guarantee-bg.jpg` has a MEDRANO'S logo watermark.~~ | **RESOLVED 2026-08-30.** Narrowed first on 2026-08-28, when all four `ebs-gallery-*` files were REPLACED by Ryan with genuine EBS roofing photos (pixel sampling 0.0–1.7% foliage, against 60.6% for the old gallery-6). The last two — the guarantee photo and badge — were DELETED from `ServiceGuaranteeAndFeaturesWrapper` on 2026-08-30 by request, along with the photo block that carried them. That section renders on home AND all six city landings, so this removed a competitor's watermark from seven routes; verified absent from the served HTML on `/` and on a city landing. Both files are now orphaned (~278 KB) and belong in the deletion list below. ⚠️ Review avatars are a separate row and are NOT resolved. |
| **⚠️ THE REVIEW TEXT ITSELF IS THE PREVIOUS CLIENT'S — not just the avatars.** All six testimonials in `ReviewsCarouselWrapper` are Medrano's customers writing about tree removal: the crew name, an 80-foot hickory, 115-foot pines, Asheville storm cleanup. Two named Medrano's outright until the 2026-08-30 trim. | **Open — content blocker, section not shippable.** Found 2026-08-30 while rebuilding the section; it is a larger problem than the avatar row below, which had masked it. Ryan's decision that day was to TRIM the texts in place (done) and defer replacement to the copy sweep. **Nothing in the repo holds the real EBS review text** — the intake CSV records "3 reviews — present as NAMED TESTIMONIALS" plus a Google Maps URL, but no copy. Resolving this needs Ryan to paste the real reviews; `REVIEWS.length` drives the set count, so any number works without code changes. Compounded by the 3-vs-2 count conflict above. |
| **Review avatars are the previous client's people.** `ebs-review-avatar-{1,2,3,4,6}.png` render in `ReviewsCarouselWrapper` beside the review text. | Open. Same class of problem as the gallery photos were, and not yet swapped. The hero's Google badge already avoids avatars for this reason. ⚠️ They are no longer preloaded (lazy as of 2026-08-30), so they now cost nothing until scrolled to — but they still render. |
| **Home page `<title>` and `og:title` are still Medrano's.** `/` serves `Durham-Chapel Hill NC Tree Service \| Medrano's INC Certified Arborist` in `<title>`, `og:title` and `twitter:title`. | **Open — found 2026-08-30**, incidentally, while grepping the served HTML for previous-client strings. Root §13.10.5 calls per-route SEO a launch blocker, and this is the most-shared route on the site. Not fixed on sight because the SEO fields are per-route literals in `src/pages/*.astro` and belong to the copy sweep's scope, not to a section rebuild — but it is a one-line-per-route fix and worth pulling forward. Unknown how many of the 18 routes are affected; only `/` was checked. |
| **Orphaned assets shipping to CDN.** ⚠️ RE-COUNTED 2026-08-31 and it moved in BOTH directions. **REMOVED from the orphan list:** `ebs-services-bg.jpg` (368 KB) is no longer orphaned — it is now the `roof-installation` hero. Its provenance was checked before use, because the services-grid note flagged it as being from the same import batch as the old tree photography: it is a genuine EBS re-roof in progress. **ADDED to the orphan list:** the five `step-*.png` step icons (`step-1-assessment`, `-2-preparation`, `-3-removal`, `-4-cleanup`, `-5--followup`, ~65 KB total), orphaned when `OurProcessStepsWrapper` was rebuilt with inline SVG. Plus the previously-recorded `ebs-guarantee-bg.jpg` / `ebs-guarantee-badge.png` (~278 KB) and `public/logos/{angi,isa,bbb,tcia}.svg` (72 KB). ⚠️ Do NOT delete `about-service-photo.jpg` or `services-bg.jpg` from any list — they were never orphans, they never existed at all; both were dangling references, now removed. | Open — deletion offered. Full table in EBS_HOME_ASSET_MAP.md, which is now one session stale. |
| ~~Two gallery images 404 on every home page load.~~ | **Resolved 2026-08-27** — both removed when the gallery was rebuilt as a mosaic. Zero references remain in served HTML across all 7 crawled routes. |
| **Guarantee section renders on 7 pages**, so the Medrano's map + Triangle cities + "Available 24/7" now appear on all city landings, which also lost their mid-page CTA. | Open — decide scope |
| `BusinessStatisticsWrapper`: 18+ Years / 24/7 Support / 1000+ Homes Serviced. | **Mostly resolved 2026-08-27.** Years now DERIVED from `yearFounded` (renders 20+), in this wrapper and in `ServiceAreaWrapper_v1_1`, which had copied the same literal. 24/7 tile REMOVED. "1000+" CONFIRMED VERIFIED by Ryan 2026-08-27 — cleared claim, no longer an open item. **Row fully resolved.** |
| **All 24-7 copy site-wide.** Was 11 occurrences across the 7 crawled routes: footer `addressLine2` (×7 — every page), guarantee contact block (×2), stats tile (×1), `CenteredCopyAreaWrapper` (×1). | **RESOLVED 2026-09-01 (commit 433fab0). Row fully closed.** 10 of 11 went on 2026-08-27. The last one — `CenteredCopyAreaWrapper`'s "emergency hotline is available 24/7" on the six city landings — went when that section was rebuilt, which is why it needed a rewrite rather than a deletion. Verified by crawling all six city landings plus the home page: ZERO occurrences of 24/7, 24-7, emergency or after-hours in the served HTML. ⚠️ The claim stays MUST-NOT-SHIP — EBS has no emergency line — so this row is closed as "site is clean today", not as "the ban is lifted". |
| ~~`ServicesGridSectionWrapper` still lists tree services.~~ | **Resolved 2026-08-27** — section rebuilt against the 7 real EBS services, each card linking to its own `/services/{slug}` route. |
| Mobile menu overlay is `{mobileOpen ? … : null}` | Violates root §8.9's always-mount rule. Tracking consequence disappears under swap Mechanism 2. |
| ~~Root §8.5 lists `city` as a page_type; the code emits `city-landing`~~ | **RESOLVED 2026-09-01.** Root §8.5 corrected to `city-landing`, matching §9.4, the CityLandingPageBLDR code and the served HTML — root had been contradicting itself, and a fork copying that vocabulary would have keyed GA4 explorations on a value nothing emits. Fixed in root rather than in the code, per the standing rule that when this file and an EMITTED value disagree the code wins. |
| **Horizontal overflow in the 768–1024px band.** Offenders are the navbar's "Get A Quote" block and a footer column. Measured `document.scrollWidth`: 820→1056, 900→1056, 1024→1080. Clean from **1100** up, and clean on mobile. | **Open, pre-existing.** ⚠️ RANGE CORRECTED 2026-08-28 — previously recorded as "768–~1000px"; it actually reaches 1024, which is Tailwind's `lg` breakpoint and so is easy to trip over. Proven not-caused-by twice now, each time by A/B: stashing the services-grid rebuild (identical 1056), and toggling `display:none` on the trust-badge section (identical 1056 / 1080). Affects iPad portrait and small laptops. |
| **`carousel_dot` is emitted by two sections on `/`** — PortfolioGallery (7) and Hero (3), hero first in DOM. | Not a defect; `data-section` + `data-label` separate them. Recorded because a document-wide `querySelectorAll('[data-event="carousel_dot"]')` indexes into the HERO's dots and manufactures a convincing false failure — it did exactly that during verification, costing a full debugging cycle chasing a scroll-snap bug that did not exist. Scope probes by section. |
| **19 dead `.theme-medranos` rules in `src/styles/global.css`.** They scope to the previous client's body class, which EBS never sets (`theme-ebs`), so none of them can ever match — but they ship in the inlined stylesheet on every route. Two of them target `[data-section="trust-headline-ratings"]` and `[data-section="service-area"]`, i.e. sections EBS still renders, so they would start applying the moment anyone reused that class. | **Open — found 2026-08-30**, incidentally: a `grep` for `data-section` in the served HTML matched them as CSS SELECTORS and put two sections in the wrong apparent DOM order, which looked briefly like a reorder bug. Worth knowing as a probe hazard as well as dead weight — scope section-order greps to the document body. Deletion is safe but belongs with the global.css pass, not a section change. |
| **Expanded "See More Locations" town list is unconfirmed.** `ServiceGuaranteeAndFeaturesWrapper` lists 15 municipalities in Duplin/Sampson/Wayne. | **Open — needs Ryan's confirmation, added 2026-08-30.** The previous list was the previous client's Triangle towns and had to go, because it now sits beside a map drawing EBS's real counties. The replacements are genuine towns inside the three cleared counties, so they are consistent with the confirmed service-area claim — but "we serve X" is a claim per town and only Goldsboro, Clinton, Mount Olive, Warsaw and Kenansville appear anywhere in the intake. Once confirmed the list belongs in `client.config.ts` beside `previewCities`; there is no config home for it today. |
| ~~Hardcoded previous-client Google My Maps embed.~~ | **RESOLVED 2026-08-30** — replaced by `ServiceAreaMap.tsx` (inline SVG, real Census boundaries for Duplin/Sampson/Wayne). `CLIENT.map.embedUrl` now has NO consumer and can be deleted from config. |
| **Footer nav links are dead anchors on the 6 city landings.** ⚠️ AUDITED 2026-08-31 — it is **THREE anchors, not one**. The footer links `#reviews`, `#service-area` AND `#services`; none of those ids exist on a city landing, because `CityLandingPageBLDR` wraps its sections without ids. Verified by extracting every `href="#…"` in the served body and diffing it against every `id="…"` present: only `#{city}-contact` resolves. Confirmed identical on 4 of the 6 routes before the crawl timed out, and it is structural — the builder is shared and no record varies — so it applies to all six. | **RESOLVED 2026-09-01 (commit 433fab0).** Fixed footer-wide with the root-relative option: `#reviews`, `#service-area` and `#services` are now `/#reviews`, `/#service-area` and `/#services`, so they resolve from any of the 18 routes rather than only from home. The four service links now open their own `/services/{slug}` pages. The "Keep Calm and Let Medrano's Handle It." tagline went with the same edit, from all 18 routes. ⚠️ Root §6.6.1's anchor inventory applies to the reverse direction too: those three ids exist ONLY on the home page's builder wrappers, so dropping one of those wrappers now breaks a link from every route, not just from home. |
| ⚠️ **CITY LANDING PAGES ARE THE LARGEST REMAINING BLOCK OF PREVIOUS-CLIENT CONTENT.** Audited 2026-08-31, not yet touched. Four distinct problems on all six routes. **(1) The hero image is a 404.** `Landing1-HeroWrapper.tsx:45` defaults `backgroundImage = "/images/services-bg.jpg"` — the same non-existent file just removed from the service pages — and the builder passes nothing. It is the LCP element, and React 19 preloads it at high priority, so one of the three preloads on every city landing fetches nothing. **(2) `LandingContactForm`'s service cards are tree services** — Tree Removal, Tree Pruning and Trimming, Emergency Tree Service, Stump Removal. **This one is not cosmetic:** the selection feeds `service_type` into `/api/contact`, so a Goldsboro roofing lead currently arrives by email reading "Service: Tree Removal". It also emits `select_service` with labels like `landing-contact-select-service-tree-removal`. **(3) `CenteredCopyAreaWrapper` is wholesale previous-client copy** — four blocks (Tree Removal, Tree Pruning, Stump Removal, Emergency Response), plus "Medrano's offers expert landscape installation and maintenance in the Raleigh-Durham Triangle", plus **"Our emergency hotline is available 24/7"** — the LAST surviving 24-7 string on the site, MUST-NOT-SHIP on two counts. **(4)** The footer row above. | **RESOLVED 2026-09-01 (commit 433fab0).** All four fixed, plus two sections rebuilt that were not in the original audit. Verified by crawling all six routes: ZERO occurrences of Medrano / tree / arborist / Durham / Raleigh / Triangle / 24-7 / pruning / stump in the served HTML. **(1)** `heroImage` and `heroImageAlt` are now REQUIRED fields on `CityLandingPageData` — one photo per city, no default, so omitting one is a TypeScript error rather than a silent 404. The wrapper took ownership of the `<img>` because the Subframe parent emitted one with no `alt` and no way to pass one. All three preloads on a city landing now resolve. ⚠️ THAT COUNT IS NOW TWO, not three — OfferShowCase was migrated to /about later the same day and took its slide image with it. Three was correct when this row was closed, and both remaining preloads still resolve; the figure is kept as written so the record matches what was verified at the time. **(2)** The service cards are the six real EBS options ending in "Other"; Gutter Installation and Gutter Cleaning were removed BY REQUEST, so gutter leads now arrive as "Other" (see the new open row below). Tracking labels use the DECLARED slug rather than `slugify(display name)`, closing the root §8.5 drift where a copy edit silently moves a GA4 dimension. `AltContactForm2` dropped for a wrapper-authored two-column card; migrated B → A. **(3)** `CenteredCopyAreaWrapper` rebuilt — `Info_Sec1_330` dropped, left-aligned on one 720px measure, services as two-up cards with a hover fill flip. ⚠️ Everything in that section shares the measure and ends at x=800 at 1440; that alignment was asked for explicitly and widening any one child breaks it. **(4)** Footer anchors fixed — see the row above. Also rebuilt: `OfferShowCase` (three invented previous-client offers replaced) and NEW `CredentialBandWrapper`. |
| ✅ **RESOLVED 2026-09-02 — now ZERO.** `ServiceONEtallLocationWrapper` was rewritten and gained the conditional tracking contract, emitting `service-area`; `ServicePageBLDR` passes it city/service/page_type like every sibling. Crawling the served HTML of /services/roof-replacement returns twelve section names (contact-form, faq, footer, navbar, navbar-mobile, process, service-area, service-caption, service-contact-form, service-hero, trust-headline-ratings, why-choose-us) with no wrapper unaccounted for, so the PROBE HAZARD below is also gone — nothing now sits between `service-caption` and `service-contact-form` without a root. ⚠️ The "THREE" count was already stale when written: `ServiceONEProcessAccordionWrapper` was given `trackingSection="process"` earlier the same day and `TitleHeadingBlock` had been removed from the builder entirely, so the real remaining count was ONE. Superseded text follows. ⚠️ **THREE SERVICE-PAGE WRAPPERS EMIT NO `data-section` AT ALL.** ⚠️ NARROWED 2026-09-01 — was FOUR. `TallServicesBenefitsCards` gained the full contract when it was rebuilt (now section `why-choose-us`, on 13 routes), so it is off this list. The remaining three are `TitleHeadingBlock`, `ServiceONEProcessAccordionWrapper` and `ServiceONEtallLocationWrapper` — verified by grepping each file and by crawling the served HTML. Together they are still most of a service page's body copy. | **Open — found 2026-08-31.** Client CLAUDE.md §3.3 claimed "Sections that render but emit no data-section at all: NONE as of 2026-08-27"; that line has been corrected. The error was generalising a home-page audit to every route pattern. ⚠️ Also a PROBE HAZARD: because these sit between `service-caption` and `service-contact-form` with no root of their own, any script attributing text to "the nearest preceding `data-section`" files all of it under `service-caption`, overstating that section and hiding the gap. |
| ⚠️ **NARROWED AGAIN 2026-09-02 — `ServiceONEtallLocationWrapper` is CLEAN.** Its rewrite removed, rather than reworded, the previous client's Google My Maps iframe (`mid=1iZruq-…`, Raleigh-Durham Triangle), the label "RDU TRIANGLE, NC" and the ten Triangle city chips. The map is now `ServiceAreaGoogleMap` drawing the dissolved 29-zip EBS polygon; the towns come from `CLIENT.geo.landingCities` + `CLIENT.geo.expandedCities`. Verified by crawling the served HTML: zero `<iframe>` on the page, no "RDU TRIANGLE", no `maps/d/embed`. ⚠️ STILL OPEN in `ServiceONEProcessAccordionWrapper`: "Here's what to expect when you work with Medrano's Tree Service", "Step 1: Tree Assessment", "Crew dismantles tree safely, chips branches", "Step 3: Healthy Tree Guarantee". That wrapper now emits `process` but its COPY is untouched — tracking and copy were separate fixes, and only tracking has landed. ⚠️ "Licensed, insured, and trusted across the RDU Triangle since 2007" is gone with the city chips. Superseded text follows. ⚠️ **SERVICE PAGES STILL SERVE PREVIOUS-CLIENT COPY**, in the wrappers above. ⚠️ NARROWED 2026-09-01: "WHY CHOOSE MEDRANO'S TREE SERVICE" and "Expert Arborist … ISA Certified Arborist" are GONE — they were `TallServicesBenefitsCards`, now rebuilt. Still shipping, in `ServiceONEProcessAccordionWrapper` and `ServiceONEtallLocationWrapper`: "Here's what to expect when you work with Medrano's Tree Service", "Step 1: Tree Assessment", "Crew dismantles tree safely, chips branches", "Step 3: Healthy Tree Guarantee", "RDU TRIANGLE, NC", "Licensed, insured, and trusted across the RDU Triangle since 2007" (wrong region AND wrong year — EBS is 2006). | **Open.** ⚠️ **DO NOT FIX THIS IN `servicePageData.tsx`.** `SHARED_BENEFITS` and `SHARED_PROCESS` look like the source and are NOT — verified 2026-08-31 to have ZERO importers, so editing them yields a clean diff with zero rendered effect (root §13.3.8). The two copies have already DIVERGED: `SHARED_BENEFITS[0]` says "Expert Contractors" while the page serves "Expert Arborist". DUPLICATE.md Step 6 says leave the arrays in place; a warning block now sits above them naming the three real files. ⚠️ DUPLICATE.md names only two of those three — `ServiceONEtallLocationWrapper` is missing from its list. |
| **`--color-brand-secondary-text` now HAS a consumer.** | **Resolved 2026-08-31.** §6 carried it as "exists in global.css (4.73:1) and has no consumer yet". `OurProcessStepsWrapper`'s two-tone headline is the first, measured at 4.73:1 on the section ground. ⚠️ The underlying finding is UNCHANGED and still open: the gold "20 Years" headline in `AboutUsVariant1` still measures **2.15:1** and still fails WCAG's 3:1 for large text. This token is the fix; that headline has simply not been migrated to it yet. |
| **`/about` now preloads a real 368 KB image it cannot lazy-load.** | Open, low priority. `InfoImageColumnWrapper`'s photo is rendered by the Subframe parent, so `loading` is unreachable from a wrapper (root §7.1's ceiling). It replaced a 404, so the request count is unchanged and the bytes are new. It displays at ~608px wide but ships 1360px — a recompression pass (handoff §5.2) would take it below the old figure. Closing it properly means the theme tab or a wrapper-authored rebuild of that section. |
| **`ServiceONEHeroWithRatingsWrapper`'s ratings strip renders nothing.** | **Open, deliberate — do not "fix" by wiring it up.** It reads `CLIENT.reviews.platforms`, which is `[]`, and the strip is conditional so an empty list yields a clean photograph rather than an empty bar. Pointing it at `trustBadge`/`reviewCount` would put the contested `5.0★ / 3 Google reviews` claim on seven more routes and silently settle the star-rating dispute two rows up. Populate `platforms` once that is decided and the strip appears with no code change. |
| **Gutter work is no longer directly selectable on the landing form.** | **Open — needs Ryan's decision, added 2026-09-01.** Gutter Installation and Gutter Cleaning were removed from `LandingContactForm`'s six service cards BY REQUEST during the rebuild, so a gutter enquiry from a city landing now arrives as **"Other"** in `service_type` and in the `select_service` label. Both gutter services still have their own `/services/{slug}` pages and still appear in the home services grid, so the site sells work the landing form cannot name. Consequence if left: gutter demand is invisible in the form data and lands in the same bucket as genuinely unclassifiable leads. Reversing it is one entry in the form's service list. |
| **`/images/og-default.jpg` does not exist.** `CLIENT.seo.ogImage` (`client.config.ts:139`) points at it and `Layout.astro` absolutizes it into `og:image` and `twitter:image` on **all 18 routes**. | **RESOLVED 2026-09-02 — but NOT by adding a file.** `CLIENT.seo.ogImage` now points at `/og/default.jpg`, a **prerendered route** (`src/pages/og/default.jpg.ts`) that renders a design-as-code card at build time: `og/SocialShareCard.tsx` (Satori element tree, inline styles) → `og/renderSocialShareCard.ts` (sharp bakes a white halo into the logo, Satori → SVG, resvg → PNG, sharp → JPEG). Output verified 1200×630, ~93 KB, in `.vercel/output/static/og/` after `astro build`; `og:image` verified resolving to a 200 `image/jpeg` on all four page patterns. The card is a rebuild of `SOCIAL_SHARE_FOR_ebs.png` (strap / gradient over `ebs-hero-poster.jpg` / haloed `ebs-logo.png`) plus the phone pill. ⚠️ Ryan's original ask was to "connect og:image to the section" — that is not possible (crawlers fetch bytes, never render HTML), and this is the nearest thing that is: the design stays code and regenerates every build. New deps: `satori`, `@resvg/resvg-js`; `sharp` was already present via Astro. Font vendored under `og/fonts/` (OFL). ⚠️ Colours in the card are LITERALS mirroring `body.theme-ebs` — Satori cannot read CSS vars — so a brand-token change in `global.css` needs a matching edit there. Was previously described here as "no code change"; it became one because a generated card can carry the phone number and re-render when the number, logo or photo changes, where a static file silently goes stale. |
| **`/about` serves SEVEN image preloads and FOUR of them are 404s.** `About-page-1-hero.jpg` plus `review-avatar-1/3/4.png`. | **Open — worst single-route figure on the site.** Verified absent from disk 2026-09-01. Because React 19 preloads every non-lazy `<img>` at HIGH priority (root §9.13), these four are not merely missing pictures — they are four high-priority requests competing with the real LCP and returning nothing. ⚠️ **`review-avatar-*.png` and `ebs-review-avatar-*.png` are two DIFFERENT families**, and a grep for "review-avatar" matches both, reading as if the files exist. ⚠️ CORRECTED 2026-09-01 (close-out): an earlier version of this row said the first family was "missing entirely". It is not — **`review-avatar-2.png` EXISTS** (36 KB). Only 1, 3 and 4 are absent, which is why this row says FOUR 404s (three avatars plus the About hero) rather than five. The partial family is worse than a wholly missing one: the section renders three broken avatars beside one real photograph, so it looks like a loading fault rather than missing assets. The second family (1,2,3,4,6) is all present. |
| ⚠️ **The `ebs-` filename prefix means NOTHING about provenance.** | **Open, added 2026-09-01 — record it as a rule, not just two files.** `ebs-hero-mobile-bg.jpg` is a green **Medrano's-branded** crew photo carrying THEIR phone number and two fabricated "5.0 Top Rated Service" badges; `ebs-service-area-mobile.jpg` is a Medrano's team photo with their logo watermarked across it. Both are orphans today and belong on the deletion list. The general lesson is the one that matters: the prefix was applied at import time to a batch that included the previous client's media, so it is not evidence of anything. Check the pixels before reusing any `ebs-*` file — that is how `ebs-services-bg.jpg` was cleared for use as the `roof-installation` hero. |
| **Only SEVEN distinct genuine EBS photographs exist**, and two of the seven are the same picture. `ebs-gallery-6-exterior-project.jpg` and `ebs-services-bg.jpg` are the SAME photograph re-encoded. | **Open — the single biggest unblocker on the design side.** ⚠️ **`md5` does NOT catch this.** The two files have different hashes (re-encoded) and, coincidentally, identical byte counts, so both a hash check and a size check report "different file". Only LOOKING caught it. Six of the seven are city heroes, so the offer carousel reuses Warsaw's photo and its About slide is a near-duplicate of Goldsboro's hero. Each is a one-line swap once more photography exists; nothing is blocked structurally. |
| **~9.2 MB of orphaned assets — and `public/images/` is not where most of it is.** | **Open, RE-COUNTED 2026-09-01.** `/videos/ebs-hero.mp4` alone is **8.0 MB**, i.e. ~89% of the total, and it survived THREE audits because every one of them scanned `public/images/` only. Scan `videos/` and `logos/` too. Newly orphaned 2026-09-01: `offer-{1,2,3}.jpg` (1.18 MB, confirmed zero references in `src/`), when `OfferShowCase`'s three invented offers were replaced. Plus the previously-recorded `step-*.png` (~65 KB), `ebs-guarantee-bg.jpg` / `ebs-guarantee-badge.png` (~278 KB), `public/logos/{angi,isa,bbb,tcia}.svg` (72 KB), and the two Medrano's-branded `ebs-*` files in the row above. |
| **`ebs-logo-white.png` is 946×946 / 88 KB and renders at 40–56px.** | **Open, low priority — added 2026-09-01.** It is `loading="lazy"`, so it costs nothing at load and is NOT a preload problem; this is bytes-on-scroll, not LCP. Belongs in the next image pass (handoff §5.2) rather than as its own task. It is load-bearing — the credential band references it — so it is not an orphan and must not reach any deletion list. |
| **Service-card labels wrap to two lines on the landing form.** | **Open, cosmetic — added 2026-09-01.** Diagnosed: it is **card width** (222px at 1440, zero slack), NOT the icon gap. Tightening the gap further will not fix it and has already been tried. Fixing it means fewer cards per row, a narrower icon, or shorter labels — all of which are design decisions rather than a tweak. |
| **`TallServicesBenefitsCards` carries `"use client"` with ZERO hooks.** | **Open, trivial — noticed 2026-09-01 while auditing Mechanism A coverage.** Root §6.2 says to omit the directive on a hook-free wrapper: Astro ignores it (the island boundary is the `client:*` directive in the `.astro` file), so it is harmless at runtime but advertises client-side behaviour the component does not have. One-line deletion; deliberately NOT done as part of a docs pass. |
| ⚠️ **All seven service pages render a broken `<img>`** — `/images/service-1-about.jpg` does not exist. | **Open — NEW, found 2026-09-01** while re-scanning assets by script. `serviceOnecaption-photoWrapper.tsx:45` defaults `image = "/images/service-1-about.jpg"`, and `ServicePageBLDR` passes `headline` and `paragraph` but **not `image`** — so the "unreachable default" is the shipping value on all seven routes. This is root §13.3.8 for the THIRD time in this redesign, after the landing hero and `TallServicesBenefitsCards`; the pattern is now well established enough to check for deliberately. **Mitigating and worth stating precisely:** the `<img>` carries `loading="lazy"`, so React 19 does NOT preload it (root §9.13). It is a broken picture when scrolled to, NOT a wasted high-priority request — unlike the `/about` 404s. Fix is the same shape as the other two: make `image` a required per-service field on `ServicePageData`, so omitting one is a TypeScript error. |
| ⚠️ **`AssociationBadgeAreasslotterWrapper.tsx` is a loaded gun** — it renders four MUST-NOT-SHIP credentials and is one import away from being live. | **Open, added 2026-09-01.** The wrapper has **no consumer**, so nothing ships today. But it hardcodes `/logos/{isa,tcia,bbb,angi}.svg`: two tree-industry bodies (ISA, TCIA — previous client's, and EBS is a roofer), a **BBB** badge for a profile that does not exist, and Angi. The CLAIMS REGISTER bans BBB and *any* trade-association badge outright. Rendering this wrapper anywhere would ship four banned claims in one line, with nothing in the diff to flag it. Deleting the wrapper and its four SVGs together is cleaner than leaving it as a trap; recorded rather than done because it is a code change, not a docs one. |
| ⚠️ **The same photograph now renders THREE times on `/about`.** `ebs-gallery-6-exterior-project.jpg` is `InfoImageColumnWrapper`'s photo AND the offer carousel's slide 1 (main image plus thumbnail). | **Open — NEW, found 2026-09-01 at close-out**, caused by migrating the carousel onto this page. ⚠️ It is ALSO why `/about`'s preload count did not rise from seven: the two consumers request the SAME URL, so React 19 emits one preload for both and the count looks unchanged while the page gained a duplicate picture. Do not read a flat preload count as "the migration cost nothing". Compounded by the fact that this file is itself the same photograph as `ebs-services-bg.jpg` re-encoded, so it is now the most-repeated image on the site. A one-line swap once more photography exists. |
| ⚠️ **`/about` states two contradictory review counts one screen apart.** `InfoImageColumnWrapper`'s prose says "a 5.0 star rating across more than **190 reviews**" while `TrustHeadlineRatingsWrapper` above it renders "**3 Google reviews**". | **Open — NEW, recorded 2026-09-01 at close-out.** 190 is the previous client's figure. Both are review counts, which the CLAIMS REGISTER bans outright, so this is not merely an inconsistency — it is the star-rating dispute appearing twice on one page in two different magnitudes. Resolving it depends on the same decision as the existing star-rating and 3-vs-2 rows above; listed separately because the 190 is a distinct string that a fix for those two would not catch. |
| Full copy sweep · client CLAUDE.md §1/§2/§4–§9 rewrite | Planned, not started |

---

## 7. Where the authoritative detail lives

- **Tracking values, section inventory, form IDs, defect history** —
  client `CLAUDE.md` §3.
- **Call-tracking model, both swap mechanisms, GCLID asymmetry** — root
  `CLAUDE.md` §8.9 and client §3.6.
- **Event taxonomy** — root §8.4.
- **Why a section looks the way it does** — the comment block at the top
  of the wrapper. Every rebuilt wrapper carries one explaining what was
  dropped and why.
