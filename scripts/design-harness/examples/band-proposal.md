# Topographic chevron band — plan-mode proposal (2026-09-03)

Prototype lives in this scratchpad (band-inject.js, topo.mjs, trace.mjs, captures band-E-*.png, topo-sheet2.png). No repo file written.

## 1. Tokens — confirmed
theme.css slots: --color-default-font, --color-default-background, --color-brand-primary, --color-brand-secondary (+ -hover, -secondary-tone). global.css body.theme-edstree carries the style-guide values: #0B240E, #EDFAEF, #187A26, #E68E1C. Ed's palette is live.
Naming differs from the brief: this repo already renamed every texture token to a client-neutral --site-* prefix (client CLAUDE.md §2.2), so: --site-tex-topo, --site-ground-rake-dark, --site-chevron-face/-lit/-shade/-ghost. The existing --site-ground-rake is a 0.9-white radial for LIGHT grounds and is not reused.

## 2. Layer stack (as prototyped in situ)
1 <section> relative isolate overflow-hidden; bg-default-background below md, bg-[var(--color-default-font)] from md
2 contour field  absolute inset-0 hidden md:block; bg-default-background; mask-image var(--site-tex-topo) 400px repeat; opacity .28
3 rake           absolute inset-0 hidden md:block; bg-[image:var(--site-ground-rake-dark)]
4 chevron        inline <svg viewBox 0 0 1000 1000>, absolute, left 44.5%, top 50%, height 130%, aspect 1, translate(-72%,-50%); hidden below md
5 light panel    absolute inset-0 hidden md:block; bg-default-background; clip-path polygon(48% 0, 100% 0, 100% 100%, 44.5% 100%)
6 content        the existing grid, relative z-10 — photo left (over the dark field), copy right (on the panel)
Layers 2–5 aria-hidden + pointer-events-none. Panel edge re-derived from the grid: copy column starts at 52.2% and the photo ends at 47.8% at every md+ width, so the diagonal runs 48%→44.5% (brief's 54→46 puts the top of the copy on the dark side).

## 3. global.css addition (body.theme-edstree)
--site-tex-topo: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='t' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.0084' numOctaves='3' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='2.4' intercept='-0.7'/%3E%3C/feComponentTransfer%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0.000 0.083 0.167 0.250 0.333 0.417 0.500 0.583 0.667 0.750 0.833 0.917 1.000'/%3E%3C/feComponentTransfer%3E%3CfeConvolveMatrix order='3' kernelMatrix='-1 -1 -1 -1 8 -1 -1 -1 -1' preserveAlpha='false' edgeMode='wrap'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='6' intercept='0'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23t)'/%3E%3C/svg%3E");
--site-ground-rake-dark: radial-gradient(62% 72% at 44.5% 50%, color-mix(in srgb, var(--color-default-background) 11%, transparent) 0%, color-mix(in srgb, var(--color-default-background) 4%, transparent) 46%, transparent 74%);
--site-chevron-face:  var(--color-brand-secondary);
--site-chevron-lit:   color-mix(in oklab, var(--color-brand-secondary) 72%, white);
--site-chevron-shade: color-mix(in oklab, var(--color-brand-secondary) 82%, black);
--site-chevron-ghost: color-mix(in oklab, var(--color-default-font) 55%, black);

Chevron SVG (wrapper, inline): base polyline 200,120 720,500 200,880 stroke 150 miter; shade polyline (outer, t=-66) 238.9,66.7 831.9,500 238.9,933.3 stroke 12; specular polyline (inner, t=62) 163.4,170 614.9,500 163.4,830 stroke 11; ghost = base translated (-40,-40) in --site-chevron-ghost at .85. Face gradient userSpaceOnUse (150,80)→(760,920): lit 0 / face .42 / shade 1. Specular gradient (200,500)→(720,500): lit α0 → α.95 at .45 → α.35.

## 4. Filter values and what each was tuned against
Recipe CHANGED from the brief: posterise-then-Laplacian instead of discrete bands. On the contact sheet (topo-sheet2.png) every discrete-band variant (B1–B4: 3/2 octaves, 80–120-entry tables, contrast stretch) gave slope-dependent blobs with ragged edges; the edge recipe (E1) gave thin uniform contours like the reference.
- baseFrequency 0.0084 on a 400px tile (= 0.006 × 560/400, same feature scale as the brief's 0.006 @ 560). Judged at section scale in situ.
- numOctaves 3 (2 is smoother but loses the small closed loops; 4 adds ragged edges and no visible benefit).
- stretch slope 2.4 / intercept −0.7: fractalNoise lives in ~0.3–0.7; stretched to 0–1 so all 12 levels are used.
- 12 levels: line spacing close to the reference; 16 too dense.
- gain 6: pushes the ±1/12 Laplacian response to full alpha; no dilate (dilate .5 doubled the weight and read heavy).
- opacity .28 on the background token (brief's .14 was set for wide bands; 1px lines vanish at .14). Alternate: brand-primary at .45 (3.03 on the ground) — greener, softer.
- seed 11.

## 5. Contrast (recomputed against global.css values)
amber/ground 6.48 ✓ (brief's load-bearing decision) · amber/primary 2.14 ✗ · amber/primary-hover 2.83 ✗ · amber/white 2.55 ✗ · amber/background 2.37 ✗ · primary/white 5.45 ✓ · primary/background 5.07 ✓ (the pair that applies: the panel IS the background token) · white/ground 16.50 · background/ground 15.34 · primary/ground 3.03 · body copy/panel 15.34 ✓. Derived stops vs ground: lit ≈ 8.5, shade ≈ 4.5. No copy over the texture (the photo sits over it; text is on the panel only).

## 6. Paint cost (headless Edge 1440×1000, --disable-gpu software raster, band scrolled into view, 1.6 s trace window after injecting the layers post-hydration; COLD via a fresh seed per run; medians of 4)
baseline idle 1.4 ms · ground+panel only 131 (raster 121) · full 560px oct3 582 (566) · full 560 oct4 532 (518) · full 560 oct2 498 (486) · full 400px oct3 373 (359) · full 320px oct3 243 (231).
Cost is compositor RasterTask (off main thread; Paint/Layout 2–3 ms in every mode) and scales with tile AREA, not octaves. Warm re-raster (cached URI, n=3): full ≈ panel-only (176 vs 192). Proposed 400px tile ≈ +240 ms cold over the bare ground; 320px is the next lever. Real-GPU numbers per §11.9 on a deployed preview after implementation.

## 7. Where it lands
Extends sections/AboutUsVariant2.tsx (the structure-only block from the previous prompt) — no new wrapper. Plus the global.css slots above and one line in client CLAUDE.md §2.2 recording amber-on-green-black as deliberate at 6.48. No JS, no hooks, no public/ files, no hex in the wrapper.

## Open questions before writing files
a) recipe swap (edge-detect) — ok?  b) 400px tile — ok?  c) heading: uppercase Zilla Slab + "Trusted Tree Service" in brand-primary — keep or drop the accent?  d) contour line colour: background token (.28) or primary green (.45)?  e) cut the reference's pale diagonals on the light side (recommended).
Pre-existing, unrelated: the amber line under the band is ServicesGridSectionWrapper's own border-t-brand-secondary.
