// In-page prototype of the topographic chevron band (the injector that
// proposed it before any repo file existed). Injected over CDP into
// the live dev page's `#guarantee > section` (AboutUsVariant2) AFTER
// hydration. Plain CSS here; the real wrapper maps this 1:1 onto Tailwind
// arbitrary values + global.css tokens. No repo file is touched.
window.__band = function (cfg) {
  const c = Object.assign(
    {
      topoUri: "",
      topoOpacity: 0.14,
      topoSize: 560,
      lineToken: "--color-default-background",
      rakeAt: "44% 50%",
      panelTop: "48%",
      panelBottom: "44.5%",
      chevHeightPct: 130,   // chevron box height as % of section height
      chevVertexPct: 44.5,  // where the vertex lands, as % of section width (= the panel's bottom edge)
      ghostOffset: -40,
      accent: true,
      uppercase: true,
    },
    cfg || {}
  );

  const sec = document.querySelector("#guarantee > section");
  if (!sec) throw new Error("no #guarantee > section");
  document.getElementById("band-style")?.remove();
  sec.querySelectorAll(".band-layer, .band-chevron").forEach((n) => n.remove());

  const style = document.createElement("style");
  style.id = "band-style";
  style.textContent = `
body.theme-edstree {
  --site-tex-topo: ${c.topoUri};
  --site-ground-rake-dark: radial-gradient(62% 72% at ${c.rakeAt},
    color-mix(in srgb, var(--color-default-background) 11%, transparent) 0%,
    color-mix(in srgb, var(--color-default-background) 4%, transparent) 46%,
    transparent 74%);
  --site-chevron-face:  var(--color-brand-secondary);
  --site-chevron-lit:   color-mix(in oklab, var(--color-brand-secondary) 72%, white);
  --site-chevron-shade: color-mix(in oklab, var(--color-brand-secondary) 82%, black);
  --site-chevron-ghost: color-mix(in oklab, var(--color-default-font) 55%, black);
}
.band { position: relative; isolation: isolate; overflow: hidden; background: var(--color-default-font); }
.band-layer { position: absolute; inset: 0; pointer-events: none; }
.band-topo { mask-image: var(--site-tex-topo); -webkit-mask-image: var(--site-tex-topo);
  mask-size: ${c.topoSize}px; -webkit-mask-size: ${c.topoSize}px; mask-repeat: repeat; -webkit-mask-repeat: repeat;
  background-color: var(${c.lineToken}); opacity: ${c.topoOpacity}; }
.band-rake { background-image: var(--site-ground-rake-dark); }
.band-chevron { position: absolute; top: 50%; left: ${c.chevVertexPct}%; height: ${c.chevHeightPct}%; aspect-ratio: 1 / 1; width: auto; pointer-events: none; transform: translate(-72%, -50%); }
.band-panel { background: var(--color-default-background); clip-path: polygon(${c.panelTop} 0, 100% 0, 100% 100%, ${c.panelBottom} 100%); }
.band > .band-content { position: relative; z-index: 1; }
.band h2 { ${c.uppercase ? "text-transform: uppercase; letter-spacing: 0.01em;" : ""} }
.band h2 .accent { color: var(--color-brand-primary); }
@media (max-width: 767px) {
  .band { background: var(--color-default-background); }
  .band-layer, .band-chevron { display: none; }
}`;
  document.head.appendChild(style);

  sec.classList.add("band");
  sec.firstElementChild.classList.add("band-content");

  // ── chevron geometry (1000×1000 viewBox) ──
  // base polyline P0(200,120) V(720,500) P2(200,880); arm half-angle to the
  // bisector α: tan α = 380/520 → sin α = 0.590; unit normal into the angle
  // for the upper arm n = (-0.590, 0.807), mirrored for the lower arm.
  const off = (t) => {
    const vx = 720 - t / 0.59;
    return `${(200 - 0.59 * t).toFixed(1)},${(120 + 0.807 * t).toFixed(1)} ${vx.toFixed(1)},500 ${(200 - 0.59 * t).toFixed(1)},${(880 - 0.807 * t).toFixed(1)}`;
  };
  const base = off(0);
  const g = c.ghostOffset;
  const svg = `
<svg class="band-chevron" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="band-face" gradientUnits="userSpaceOnUse" x1="150" y1="80" x2="760" y2="920">
      <stop offset="0" stop-color="var(--site-chevron-lit)"/>
      <stop offset="0.42" stop-color="var(--site-chevron-face)"/>
      <stop offset="1" stop-color="var(--site-chevron-shade)"/>
    </linearGradient>
    <linearGradient id="band-spec" gradientUnits="userSpaceOnUse" x1="200" y1="500" x2="720" y2="500">
      <stop offset="0" stop-color="var(--site-chevron-lit)" stop-opacity="0"/>
      <stop offset="0.45" stop-color="var(--site-chevron-lit)" stop-opacity="0.95"/>
      <stop offset="1" stop-color="var(--site-chevron-lit)" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <polyline points="${base}" transform="translate(${g} ${g})" fill="none" stroke="var(--site-chevron-ghost)" stroke-width="150" stroke-linejoin="miter" stroke-miterlimit="10" opacity="0.85"/>
  <polyline points="${base}" fill="none" stroke="url(#band-face)" stroke-width="150" stroke-linejoin="miter" stroke-miterlimit="10"/>
  <polyline points="${off(-66)}" fill="none" stroke="var(--site-chevron-shade)" stroke-width="12" stroke-linejoin="miter" stroke-miterlimit="10" opacity="0.9"/>
  <polyline points="${off(62)}" fill="none" stroke="url(#band-spec)" stroke-width="11" stroke-linejoin="miter" stroke-miterlimit="10"/>
</svg>`;

  const topo = document.createElement("div"); topo.className = "band-layer band-topo"; topo.setAttribute("aria-hidden", "true");
  const rake = document.createElement("div"); rake.className = "band-layer band-rake"; rake.setAttribute("aria-hidden", "true");
  const panel = document.createElement("div"); panel.className = "band-layer band-panel"; panel.setAttribute("aria-hidden", "true");
  const tpl = document.createElement("template"); tpl.innerHTML = svg.trim();
  const chev = tpl.content.firstElementChild;

  sec.prepend(panel); sec.prepend(chev); sec.prepend(rake); sec.prepend(topo);

  // Vertex sits at 72% of the box width; `left: <pct>%` + translate(-72%)
  // puts it at chevVertexPct of the section with no JS measurement.
  const boxW = sec.offsetHeight * (c.chevHeightPct / 100);

  if (c.accent) {
    const h2 = sec.querySelector("h2");
    if (h2 && !h2.querySelector(".accent")) {
      h2.innerHTML = h2.textContent.replace("Trusted Tree Service", '<span class="accent">Trusted Tree Service</span>');
    }
  }
  return { sectionH: sec.offsetHeight, boxW };
};
