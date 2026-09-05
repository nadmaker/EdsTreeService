# design-harness

The headless-browser harness that verified the 2026-09-03/04 design session
(navbar, hero form, About band) and that PROPOSED the topographic band by
injecting it into the live page before any repo file was written. Raw Chrome
DevTools Protocol over Node's global `WebSocket` — **no dependencies**.

Rationale and the traps it has already met: build log
`src/components/websites/EdsTreeService/EdsTreeService_HANDOFF_Log.md` §5.5.

## Prerequisites

- Node ≥ 22 (global `WebSocket`, `fetch`). The repo runs Node 24.
- Microsoft Edge (default path) or any Chromium — set `EDGE_PATH` otherwise.
- For page scenarios: the dev server on 4399 —
  `npx astro dev --port 4399 --host 127.0.0.1` — and **confirm the port it
  actually bound to** (a stray server on 4399 answers with a different build).
- Output goes to `scripts/design-harness/out/` (gitignored); override with
  `HARNESS_OUT`.

## Tools

| script | what it does | run |
|---|---|---|
| `shots.mjs` | navigate → wait for hydration → evaluate / click / hover / scroll / inject → screenshot, per scenario | `node scripts/design-harness/shots.mjs <scenarios.json>` |
| `trace.mjs` | raster / paint cost A/B via `Tracing` (compositor `RasterTask` + main-thread paint), N runs per mode | `node scripts/design-harness/trace.mjs [runs] [modes.mjs]` |
| `topo.mjs` | builds the procedural contour mask SVG (`topoSvg` / `topoUri`) and, run directly, a contact sheet of dial variants | `node scripts/design-harness/topo.mjs` → `out/topo-sheet.html` |
| `contrast.mjs` | WCAG ratios for the live token values, flat colours only | `node scripts/design-harness/contrast.mjs` |

Examples in `examples/`: `form-scenarios.json` (the hero form's full
click-through with `fetch` mocked at the network boundary — the scenario
that caught the BACK-button bug), `band-inject.js` + `band-scenarios.mjs`
(the in-page band prototype; still works against the built band to try a
different dial such as green contour lines), `band-modes.mjs` (the tile-size
A/B for `trace.mjs`), `band-proposal.md` (the plan-mode deliverable).

## Scenario schema (`shots.mjs`)

```json
[{ "name": "home-1440", "url": "http://127.0.0.1:4399/", "width": 1440, "height": 900,
   "mobile": false,
   "steps": [
     { "hydrated": true },
     { "eval": "document.querySelector('h1').textContent" },
     { "click": "[data-label=hero-form-service-tree-removal]", "index": 0 },
     { "hover": "button[aria-controls=nav-panel-services]" },
     { "scroll": 500 },
     { "wait": 300 },
     { "script": "./band-inject.js" }
   ],
   "clip": { "x": 0, "y": 0, "width": 1440, "height": 400, "scale": 1 },
   "clipEval": "(() => ({ x: 0, y: window.scrollY + 900, width: 1440, height: 24, scale: 3 }))()" }]
```

- `eval` results print as JSON; a failing step logs `STEP FAILED` and the
  scenario continues, so you still get the screenshot.
- `click` / `hover` dispatch REAL mouse events at the element's centre, so
  CSS `:hover`, focus and activation behaviour all engage — which is how the
  React node-reuse submit bug surfaced (`element.click()` would have hidden
  it).
- `script` evaluates a file's source (relative to the scenario file); use it
  to define an injector, then call it from an `eval`.
- Set React-controlled inputs with the native setter, not `.value=`:
  `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el, v); el.dispatchEvent(new Event('input',{bubbles:true}))`.
- Mock the network inside the page: `window.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })`.

## Traps (each cost real time; do not re-learn them)

- **`clip` is PAGE-relative.** After a scroll, `y` must include
  `window.scrollY` (use `clipEval`) or the capture is blank white.
- **`elementsFromPoint` ignores `pointer-events:none`** layers — it cannot
  tell you what a decorative layer painted. Zoom a clip instead.
- **Bracketed Tailwind selectors** (`.max-w-\[640px\]`) do not survive the
  protocol; walk from a tag or an attribute (`[data-form=…]`).
- **A data-URI inside `style="…"`** breaks on its own `url("…")` quotes and
  every tile renders blank — put URIs in a `<style>` block.
- **Edge caches decoded data-URIs across navigations.** A raster cost is
  only cold if the URI differs: vary the SVG `seed` per run.
- **`--disable-gpu` means software raster.** `RasterTask` numbers are
  relative levers (tile area, layer count), not production truth; report
  medians and mins across runs, never a single run (root CLAUDE.md §11.9).
- **Astro hydration:** use the `hydrated` step before injecting DOM into an
  island, or React's hydration will replace what you injected. It waits for
  every `astro-island` to carry `client-render-time` (this Astro build never
  sets an `ssr` attribute — the first version of the step polled for it and
  was a no-op, which is how a cold-load capture came back blank). Cold
  hydration measured ~2.5 s; the step is bounded at 15 s.
- **A killed harness leaves headless Edge running** on its port; the next run
  then attaches to the OLD instance. Kill by command line
  (`remote-debugging-port=9333`) — and note that a PowerShell process whose
  command line contains that string will match itself.
- Two harnesses at once contend for CPU and skew traces; `trace.mjs` uses
  port 9334 so it can coexist with `shots.mjs` on 9333, but run them
  sequentially when measuring.
