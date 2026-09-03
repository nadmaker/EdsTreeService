CLAUDE.md
This file is the methodology source of truth for the Frame-Sites multi-client lead-generation template. It documents the architecture, conventions, and constraints that apply to every client built on this template. Per-client values, content, and Open Items live in client-scoped CLAUDE.md files (e.g., src/components/websites/MedranosINC/CLAUDE.md).

1. Project Overview
Frame-Sites is a multi-client lead-generation template for local home-services businesses, built on Astro + React + Tailwind v4 + Subframe UI. The repo serves one or more clients; each client lives under src/components/websites/{ClientFolder}/ and renders through shared route infrastructure under src/pages/. The codebase's architecture is designed so that the same template can serve any client with minimal changes per project — most code is template-shared; only a thin per-client layer changes per fork.
The client built in THIS repo is Ed's Tree Service (siteKey `edstree`, theme `theme-edstree`), under src/components/websites/EdsTreeService/ — cut on 2026-09-03 from the Exterior Builder Services build (nadmaker/ExteriorBuilderServices @ 673bdd7), the template's second instance, whose learned methodology is folded into this file. The template's first instance was Medrano's Tree Service INC, a tree-care company in the Durham–Chapel Hill Triangle area of North Carolina, and the architecture decisions documented here were validated against Medrano's needs — which is why Medrano's appears throughout this file as the worked example, including the canonical wrappers in §12 and the measured performance findings in §9.11-§9.13. Those examples stay as-is: they are evidence, not configuration. Per-client values for THIS client live in the client-scoped CLAUDE.md, never here.
Stack
Astro as the framework. SSR mode (output: "server") so API routes can execute server-side code.
React for interactive components. Page builders and section wrappers are React; Astro is the routing/layout shell.
Tailwind v4 for styling. Configuration lives in CSS via @theme directives — there is no tailwind.config.ts file.
Subframe UI as the design system. UI components are generated in the Subframe theme tab and synced into src/ui/ via npx @subframe/cli sync.
Resend for transactional email. The /api/contact endpoint POST handler invokes Resend to send form submissions.
GTM as the analytics single source of truth. GA4, Google Ads, and any future destinations are configured inside the GTM container, not in code.
Vercel for hosting. Git push to the deployment branch triggers automatic production deploy.
TypeScript throughout, in strict mode (astro/tsconfigs/strict).
Project goals
The template encodes a specific architectural philosophy: the shape of the codebase is the source of truth for what's reusable across clients vs. what's per-client. Three categories of files exist:
Template-shared infrastructure — Astro config, TypeScript config, Tailwind/Subframe theme entry, layout shells, Subframe components. Identical across every client.
Template-shared wrappers — the React wrappers in each client's sections/ folder. Same wrapping methodology, same structural shape; what varies per-client is the content the wrappers carry and the values the wrappers reference.
Per-client values and content — token overrides in global.css, content data files, the per-client constant categories flagged in client-scoped CLAUDE.md Open Items (siteKey, bodyClass, contact constants, etc.).
This CLAUDE.md (the root file) documents the methodology — what the template-shared layer is, how it works, and what the constraints are. Client-scoped CLAUDE.md files (e.g., src/components/websites/MedranosINC/CLAUDE.md) document the specific per-client values, content, and Open Items for each client built on the template.
Audience
This file is read by:
Claude Code when working in this repo. Claude Code should treat this file as authoritative for methodology, conventions, and constraints. Where this file and an existing wrapper appear to conflict, the wrapper usually reflects the methodology documented here — verify before "fixing."
Future-you (the developer maintaining this template) when returning to the codebase after time away. The methodology in this file should match what the codebase actually does; if not, update the file.
Contractors or collaborators when contributing to a specific client. The root CLAUDE.md gives them the methodology; the client-scoped CLAUDE.md gives them the client-specific values.
What this file is NOT
This file is methodology, not implementation. Specific values (brand colors, GTM container IDs, contact constants) live in the client-scoped CLAUDE.md files. Specific code (wrapper bodies, page builder compositions, content) lives in the codebase itself.
If a question is "how does the codebase do X?" → this file. If a question is "what values does Medrano's use for X?" → Medrano's-scoped CLAUDE.md. If a question is "what does the file at path X say?" → read the file.
Template repo status
The template is published at `nadmaker/Frame-sites` on GitHub, configured as a GitHub template repository — it has an off-machine backup, where previously it lived only on one local machine. Forking a new client no longer means manually copying a local folder: the preferred flow is `gh repo create NewClientName --template nadmaker/Frame-sites --private --clone`, then `cd NewClientName` and `npm install` (see DUPLICATE.md Step -1 for the full sequence). Nuance: the original template working copy predates the template repo and still carries an `origin` remote pointed at the Medrano's client repo (`nadmaker/MedranosINC`), since that folder historically doubled as both the template source and the Medrano's build — a `git push origin` from there targets Medrano's, not the template. Forks created via the `--template` clone have `origin` correctly pointed at their own new repo from the start; that folder is the exception. THIS repo was NOT cut from the template repository: `nadmaker/Frame-sites` was ~1,100 lines behind on shared files at the time, so it was exported from the EBS repo with `git archive HEAD` (DUPLICATE.md Step −1 adapted — fresh history, `.env` excluded), and `origin` is `nadmaker/EdsTreeService`. The backport of the shared files to `Frame-sites` is still owed.

2. Directory Map
The repo's structure as of this CLAUDE.md draft. Paths are relative to the repo root.
.
├── astro.config.mjs                    # Astro config — SSR, Vercel adapter, React + Tailwind v4
├── tsconfig.json                       # TypeScript strict mode, path aliases (see §3 below)
├── package.json                        # Dependencies and scripts
├── .env.example                        # Environment variable inventory (without values)
├── .env                                # Local environment values (gitignored)
├── .gitignore
├── README.md                           # Minimal project README
├── public/
│   ├── favicon.png                     # Site favicon — per-client asset replacement
│   ├── images/                         # Static images (logos, hero backgrounds, photos)
│   ├── videos/                         # Static videos (hero backgrounds)
│   └── coupons/                        # Downloadable coupon PDFs/images
├── tracking/                           # GTM container export(s) — imported during fork Step 8
│   └── gtm-container-template.json     # Container export used as the import source for a new
│                                       # client's container. ⚠️ The checked-in copy is the
│                                       # TEMPLATE CLIENT's container (GA4 + Ads IDs included):
│                                       # swap the GA4 measurement ID and all three Ads
│                                       # conversion labels after importing, or this client's
│                                       # conversions land in the template client's account.
├── INTAKE_TEMPLATE.csv                 # Blank client intake — 110 questions mapped to config
│                                       # paths; completed copy drives DUPLICATE.md Steps 0/2/10
├── src/
│   ├── pages/                          # Astro routes — thin Layout + page builder shells (per §9.8)
│   │   ├── index.astro                 # Home route
│   │   ├── about.astro                 # About route
│   │   ├── contact.astro               # Contact route
│   │   ├── offers.astro                # Offers route
│   │   ├── privacy.astro               # Privacy route
│   │   ├── services/                   # Service page routes (one per service slug)
│   │   ├── service-area/               # City landing routes (one per city slug)
│   │   └── api/
│   │       └── contact.ts              # Form submission endpoint (Resend integration)
│   ├── layouts/
│   │   └── Layout.astro                # Site shell — meta tags, GTM, click bridge, bodyClass
│   ├── styles/
│   │   └── global.css                  # Tailwind entry, theme.css import, per-client token overrides
│   ├── ui/                             # Subframe-generated — NEVER edit directly (§5)
│   │   ├── theme.css                   # Subframe-generated token definitions
│   │   ├── components/                 # Subframe-generated React components
│   │   ├── utils.ts                    # Subframe-generated utilities
│   │   ├── layouts/                    # Subframe page-layout components (currently unused)
│   │   └── index.ts                    # Barrel export aggregator (not consumed by wrappers)
│   └── components/
│       └── websites/
│           └── MedranosINC/            # Client-scoped folder (Medrano's-specific code and content)
│               ├── CLAUDE.md           # Medrano's client-scoped CLAUDE.md
│               ├── pages/              # Page builders (per §9)
│               │   ├── Medranos-Home.tsx
│               │   ├── Medranos-About.tsx
│               │   ├── Medranos-Contact.tsx
│               │   ├── Medranos-Offers.tsx
│               │   ├── Medranos-Privacy.tsx
│               │   ├── ServicePageBLDR.tsx
│               │   ├── servicePageData.tsx
│               │   ├── CityLandingPageBLDR.tsx
│               │   └── cityLandingData.tsx
│               └── sections/           # Wrappers (per §6 methodology)
│                   ├── HeroWrapper.tsx
│                   ├── NavbarMainWrapper.tsx
│                   ├── ContactFormWrapper.tsx
│                   ├── FooterSection.tsx
│                   └── ...             # (many more wrapper files)
└── (other dotfiles and lockfiles)
Key directory roles
src/pages/ is the Astro routing layer. Files here are Astro components (.astro extension); each file becomes a URL route. Per §9.8, route files are thin SEO + Layout shells with a single page-builder child. No content, no tracking decisions, no wrapper composition.
src/layouts/Layout.astro is the site shell rendered around every route. It contains meta tag handling, the GTM snippet, the global click-tracking bridge (§8.1), and the bodyClass prop application. Only the Google Fonts link and favicon are per-client concerns; everything else is template-shared.
src/styles/global.css is the per-client styling layer. It imports @tailwindcss and src/ui/theme.css, then defines a body.theme-{client} block that overrides theme.css's slot defaults with the client's actual brand values. Per §4, this is the only CSS file that changes when the template forks.
src/ui/ is the Subframe-generated layer. Every file here is regenerated when npx @subframe/cli sync runs. Per §5, this directory is read-only from a code-edit perspective — changes to Subframe components happen in the Subframe theme tab, then propagate via sync.
src/components/websites/{ClientFolder}/ is the client-scoped layer. Each client gets its own folder containing:
CLAUDE.md — the client-scoped methodology and value file.
pages/ — page builders and data files for the client's pages.
sections/ — wrappers for the client's site sections.
When forking the template for a new client, this folder is copied and rewritten (§9). Multiple client folders can coexist in the same repo if multiple clients are served from one Git repository — though the established fork workflow (DUPLICATE.md Step 1) instead copies the whole template into a new, separate repo per client and removes the previous client's folder from that copy. See §1 for the template's repo status and the `gh repo create --template` flow.
public/ contains static assets served at the URL root. Images, videos, favicons, coupon files. Per-client assets are swapped per fork (§9.2).

3. Path Aliases
Two path aliases are configured in tsconfig.json:
json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/ui/*": ["src/ui/*"]
    }
  }
}
@/* → src/*
The general-purpose alias. Used for any import from src/ outside the Subframe-generated directory. Examples:
ts
import Layout from "@/layouts/Layout.astro";
import { servicePageData } from "@/components/websites/MedranosINC/pages/servicePageData";
The alias is purely a convenience — it shortens relative imports that would otherwise traverse multiple ../ segments.
@/ui/* → src/ui/*
The Subframe-generated directory alias. Used for every import from Subframe components and theme files:
ts
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Updatedherowithoffers } from "@/ui/components/Updatedherowithoffers";
The separate @/ui/* alias exists because Subframe imports are high-frequency in this codebase (every wrapper that consumes a Subframe component imports through it), and the alias makes the import lines shorter and easier to grep for. Searching the codebase for from "@/ui/ finds every Subframe consumption point in one pass.
When NOT to use the aliases
Astro route files (.astro) sometimes use relative imports (../layouts/Layout.astro, ../components/websites/.../pages/...) instead of aliased imports. This is mostly historical — both work. Either form is acceptable in new and existing .astro files; no migration policy applies.
@subframe/core imports
A separate concern from the path aliases above: @subframe/core is the Subframe runtime library, imported from node_modules via its package name. Used for icon components and core utilities:
ts
import {
  IconWrapper,
  FeatherMessageSquare,
  FeatherMail,
} from "@subframe/core";
Unlike @/ui/*, this is not a path alias — it's a normal package import. The two namespaces (@/ui/* for generated component files, @subframe/core for the runtime library) are distinct sources. Wrappers commonly import from both.

4. The Two-Layer Token System
This codebase uses a two-layer token system for colors and typography. Wrappers consume tokens through Tailwind utility classes; the tokens themselves are defined in two CSS files with strictly separated roles. The split exists so a single template repo can serve any client with minimal changes per project — change the per-client layer, leave the shared layer alone, and every wrapper re-themes automatically.
4.1 The two layers
Layer 1 — src/ui/theme.css (Subframe-generated, template-shared). Defines all the slot names the UI design system uses: brand color slots, neutral palette ramps, typography slots, spacing scales, etc. The values inside are deliberate placeholders — neutral, safe defaults that exist so the structure works but aren't meant to be the final look. Every client project that forks this template uses the same theme.css.
This file is auto-generated by npx @subframe/cli sync whenever the Subframe theme tab is edited. Direct edits get wiped on the next sync. Adding a slot, renaming a slot, or restructuring the palette happens in the Subframe theme tab and propagates through sync — not by hand.
Layer 2 — src/styles/global.css (per-client, manually authored). Overrides the slot defaults from theme.css with the actual brand RGB values and typography choices for the specific client, scoped under a client-specific body class (e.g. body.theme-medranos). This is the only file that changes when the template is forked for a new client.
Different clients get different theme class names (body.theme-medranos, body.theme-clientb, etc.) and different override values inside their respective blocks. The Layout (§2 directory map) applies the correct theme class via the bodyClass prop.
4.2 How a token resolves at runtime
A wrapper consumes a token through a Tailwind utility class. The resolution chain:
The wrapper's JSX has a class like bg-brand-primary, text-default-font, or font-body.
Tailwind v4 reads these utility names and looks for matching CSS custom properties defined via @theme directives.
src/ui/theme.css is the first CSS file imported in src/styles/global.css after the Tailwind v4 entry. It declares every slot the design system uses, with placeholder values:
css
   --color-brand-primary: rgb(99, 102, 241);
   --color-default-background: rgb(255, 255, 255);
   --color-default-font: rgb(15, 23, 42);
   --font-body: "Inter", ui-sans-serif, system-ui, ...;
After theme.css is imported, global.css declares a body.theme-{client} block that re-declares any slots the client overrides with the actual brand values:
css
   body.theme-medranos {
     --color-brand-primary: rgb(0, 130, 45);
     --color-default-background: rgb(252, 251, 248);
     --color-default-font: rgb(58, 58, 58);
     --font-body: "Inter", ui-sans-serif, system-ui, ...;
   }
CSS cascade rules apply: when a wrapper element is inside <body class="theme-medranos">, the body.theme-medranos block wins because of its later position in the cascade. The wrapper's bg-brand-primary utility resolves to Medrano's green, not the placeholder from theme.css.
If the body doesn't have a theme-{client} class, the wrapper's bg-brand-primary utility resolves to the placeholder from theme.css — the design system works visually, but doesn't match any client's brand.
The architecture means wrappers never reference client-specific values directly. They reference slots; the per-client layer fills in the values. Re-skinning the entire site for a new client is changing which theme-{client} block applies — the wrappers themselves don't need to change.
A consequence of how Tailwind v4 binds utilities to slots: Tailwind reads @theme directives from theme.css at build time to generate the utility classes that wrappers consume. Slots declared only in global.css's per-client block (per §4.3's second path) don't generate Tailwind utilities — wrappers consuming them have to use arbitrary-value syntax (text-[var(--color-subheading-text)]) rather than a generated utility. This is intentional: client-specific slots are exceptions, not first-class design system tokens.
4.3 Adding new slots
Both layers can be extended with new slots when a client's design needs something the existing palette doesn't carry. Two paths:
Add the slot to theme.css via the Subframe theme tab. This is the right path when the new slot is something the design system itself should support across all clients — a new typography weight, a new semantic color role, a new spacing scale. Edit in the theme tab, sync, and the slot lands in theme.css with a default value. Clients can then override the default in their global.css block.
Add the slot only to global.css's body.theme-{client} block. This is the right path when the slot is genuinely client-specific — a one-off design choice that doesn't generalize. The slot exists only for that client, only inside their theme block. Other clients don't see it.
The bar for promoting a slot to theme.css (template-shared) is seeing the pattern appear across multiple clients. If only Medrano's uses --color-subheading-text, it stays in Medrano's global.css block. If two or three future clients introduce their own subheading-text token, that's the signal that the design system itself should carry the slot, and the promotion to theme.css becomes the right move.
Premature promotion creates dead slots in the template — slots that exist in theme.css because one early client needed them, but that no other client uses. Late promotion is the safer error mode.
4.4 Sync safety and the theme.css boundary
The theme.css file is destructively regenerated by every npx @subframe/cli sync. Any hand-edits to theme.css are lost on the next sync. The boundary is strict: theme.css is read-only from the code's perspective; the Subframe theme tab is the source of truth for what's inside it.
For sync safety:
Commit before syncing. If a sync produces unexpected changes to theme.css (renamed slots, restructured palette, removed slots), the cleanest recovery is git checkout src/ui/theme.css to revert and then re-evaluate the theme tab changes.
Smoke test the dev server after syncing, before committing. The dev server compiles Tailwind and surfaces missing-slot errors immediately. A sync that removes a slot some wrapper still references will fail the build.
Commit the sync output separately from any global.css or wrapper changes that depended on the sync. Isolating sync diffs from manual edits makes Git history readable and makes bisecting future regressions tractable.
global.css is hand-authored and never regenerated. It's safe to edit at any time; sync doesn't touch it.
4.5 Subframe system token override pattern (also called the C2 pattern)
Two Subframe-defined slots in theme.css are tokens whose values are deliberately overridden in global.css to carry client-specific neutrals through the system:
--color-default-background — the page background and surface color that Subframe components consume internally.
--color-default-font — the body text color that Subframe components consume internally.
These slots are part of the design system's structural tokens, not brand color slots. But unlike most structural tokens (spacing scales, typography weights, border radii), they vary per client because each client's brand has its own background and text neutrals. The override pattern lets clients customize these without forking the design system itself.
Inside global.css's body.theme-{client} block, these two slots are re-declared alongside the brand color slots:
css
body.theme-medranos {
  --color-brand-primary: rgb(0, 130, 45);
  --color-default-background: rgb(252, 251, 248);
  --color-default-font: rgb(58, 58, 58);
  /* ...other slots */
}
Neutrals from Tailwind's built-in scale (bg-white, bg-neutral-50, text-neutral-600) are acceptable for wrapper-local UI chrome that doesn't vary per client. The token rule applies to anything that would need to change when the client changes — brand colors (always) and the two Subframe system tokens overridden via the C2 pattern (--color-default-background, --color-default-font), which carry the client's neutral palette through tokenization specifically because clients customize their neutrals.
The runtime rule for any color, font, or spacing value in a wrapper:
Does it vary per client?
Use
Yes (brand color, client-customized neutral)
Token via Tailwind utility (bg-brand-primary, text-default-font, font-body)
No (white, black, generic neutrals, gray scales)
Raw value (bg-white, bg-neutral-50, text-neutral-600)
Yes but no slot exists yet
Add slot per §4.3, then use the token

The principle replaces the more common framing of "brand colors = token, neutrals = raw" — that framing is partly correct but misses the C2 pattern, where --color-default-background and --color-default-font are neutrals that are tokenized because clients customize them. The accurate principle is about per-client variance, not about color-category labels.
Common applications:
Wrapper backgrounds that should be the client's brand → token (bg-brand-primary).
Wrapper text that should be the client's default body text → token (text-default-font).
Wrapper UI chrome (dividers, subtle backgrounds, hover states on neutrals) that doesn't change per client → raw (border-neutral-200, bg-neutral-50/60).
White or black backgrounds for cards, modals, overlays → raw (bg-white, bg-black).
Brand-colored borders, fills, or accents → token (border-brand-secondary, fill-brand-primary).
4.6 Forking the token system for a new client
When the template is forked for a new client, the token system changes happen entirely in global.css. The steps:
Pick a theme class name. Convention: theme-{client-slug}. Examples: theme-medranos, theme-clientb. The slug should match the client folder name under src/components/websites/.
Copy the existing body.theme-{previous-client} block in global.css and rename it to body.theme-{new-client}.
Replace every override value with the new client's brand colors, neutrals (C2 pattern slots), typography font stacks, and any client-specific slots. The slot names stay identical; only the values change.
Update CLIENT.theme.bodyClass in the new client's client.config.ts. Routes import CLIENT and pass bodyClass={CLIENT.theme.bodyClass}, so this is ONE edit, not one per route. Same for CLIENT.seo.ogImage — but confirm the file it points at actually exists in the new client's public/images/, because a copied config pointing at the previous client's asset yields a healthy 200 page serving a 404 image, and no social preview. Nothing surfaces that locally or in the build.
Update the SEO title and description in every .astro route file. Each route file defines a seo object with title and description fields. These are hardcoded per route and are not derived from client.config.ts — they must be manually updated for every route (home, about, contact, offers, privacy, each service page, each city landing page). Leaving them unchanged after a fork means the new client's site serves the previous client's SEO metadata in production, which is a launch-blocking error.
Smoke test the dev server. Every wrapper that consumes tokens should re-skin automatically. If any wrapper still shows placeholder colors from theme.css, either the theme class isn't applied to that route or the wrapper is hardcoding a value instead of consuming a slot — both are bugs to fix before deploying.
og:image absolutization is Layout's job, not the route's. Social crawlers will not reliably resolve a root-relative og:image, so Layout.astro resolves ogImage against the request origin (new URL(ogImage, Astro.url.origin)) before emitting og:image and twitter:image. Routes and CLIENT.seo.ogImage therefore store a short root-relative path (/images/foo.jpg); an already-absolute URL passes through unchanged. Do NOT hardcode absolute URLs per route — they bake in a domain that breaks on preview deploys and on every fork. And do not "simplify" the absolutization out of Layout.astro as redundant; nothing in local dev reveals what it prevents.

5. Subframe Component Rules
The codebase consumes Subframe UI as its design system. Subframe components are generated in the Subframe theme tab, downloaded into src/ui/ via npx @subframe/cli sync, and consumed by wrappers that compose around them. This section documents the rules for working with Subframe components in this codebase.
The single most important rule: src/ui/ is read-only from a code-edit perspective. Direct edits to anything in src/ui/ get overwritten by the next sync. The architecture exists precisely so that Subframe components stay regeneratable — the wrapping methodology in §6 is what allows customization without losing sync-compatibility.
5.1 What lives in src/ui/
Five categories of files, all Subframe-generated:
File / directory
Purpose
Edit through
Notes
src/ui/theme.css
Token slot definitions (colors, typography, spacing)
Subframe theme tab → sync
Per-client overrides happen in global.css (§4)
src/ui/components/
React components consumed by wrappers
Subframe theme tab → sync
Every wrapper imports from this path
src/ui/utils.ts
Utility functions used by Subframe components
Subframe theme tab → sync (rare changes)


src/ui/layouts/
Subframe page-layout components
Subframe theme tab → sync
Currently unused — Layout.astro is the active shell
src/ui/index.ts
Barrel export aggregator (re-exports from components/)
Auto-regenerated by sync
Not consumed by any wrapper in this codebase. Wrappers use granular @/ui/components/ paths instead

All five are regenerated on every npx @subframe/cli sync. Direct edits are wiped. The "edit through" column names the authorized path for changes — the Subframe theme tab is the source of truth for what's in src/ui/, not the files themselves.
Two of the five entries (layouts/ and index.ts) are currently unused by the codebase but are auto-managed by Subframe sync, so they remain in src/ui/ regardless. Documenting their unused status here prevents Claude Code from interpreting them as either dead code worth removing or hidden infrastructure to start consuming — both readings would be wrong.
5.2 The never-edit rule
Never edit any file inside src/ui/ directly. Specifically:
❌ Don't edit src/ui/theme.css to change a token value. Edit the slot in the Subframe theme tab, then sync. (For per-client overrides, the override layer is src/styles/global.css — see §4.)
❌ Don't edit src/ui/components/{ComponentName}.tsx to change the component's structure or styling. Edit the component in the Subframe theme tab, then sync.
❌ Don't edit src/ui/utils.ts to add helpers. Wrapper-local helpers go in the wrapper file; cross-wrapper helpers go in a client-scoped utils file (e.g., src/components/websites/{Client}/utils/).
If an apparent Subframe edit looks unavoidable, the answer is almost always one of:
Customize via wrapper (§6) — the wrapping methodology is the authorized customization layer. Slot props, className overrides, arbitrary variants, and ! important suffixes (§7) handle the vast majority of customization needs without touching src/ui/.
Customize via scoped global.css (§7.5) — for overrides that wrappers can't reach cleanly, scoped CSS rules in global.css are the escalation path.
Edit the Subframe theme tab (§5.4) — when the override is structural and recurring, modifying the component in the theme tab and re-syncing is the right answer.
5.3 What "edit the Subframe theme tab" means
The Subframe theme tab is a web-based UI at app.subframe.com where the design system is authored. Changes there flow into the codebase only after a sync. Workflow:
Open the Subframe theme tab in a browser.
Make the change (rename a slot, add a slot, modify a component's layout, change a token value, etc.).
Save in the Subframe UI.
Run npx @subframe/cli sync in the repo's terminal.
The sync writes updated files into src/ui/. The diff is visible via git diff src/ui/.
Smoke-test the dev server (§4.4) before committing.
Commit the sync output separately from any wrapper changes that depended on the sync.
Critical: the Subframe theme tab change doesn't take effect in the codebase until step 4. Skipping the sync means the change exists in Subframe but not in the running app.
5.4 When to edit the Subframe theme tab
Three legitimate triggers for theme tab work:
Token system changes. New brand slot needed. Existing slot needs renaming. Existing slot needs to be removed because no wrappers consume it anymore. All of these are theme tab work.
Component structural changes. Adding a new slot prop to an existing component (e.g., adding a secondaryAction slot to a hero component). Restructuring a component's layout (e.g., changing a 3-column grid to a 2-column grid). All theme tab work, then sync.
New component creation. When the design system needs a new component that no Subframe primitive provides, the component is authored in the theme tab and synced into the codebase.
What does NOT belong in the theme tab:
Wrapper-local styling tweaks — those go in the wrapper's className overrides (§6, §7), not the Subframe component.
Per-client brand colors — those go in global.css token overrides (§4), not the theme tab. The theme tab's color values are intentional placeholders; the per-client layer overrides them.
Content — Subframe components are content-agnostic. Content lives in wrappers (slot props), page builders, or data files. The theme tab doesn't hold copy.
5.5 The C2 override pattern (cross-reference to §4.5)
src/ui/theme.css defines two system tokens that the codebase intentionally overrides in global.css to carry per-client neutrals: --color-default-background and --color-default-font.
The Subframe system token override pattern is documented fully in §4.5. The §5 implication: do not change these system token values in the Subframe theme tab to match a client's neutrals. The theme tab values stay generic; the override happens in global.css. Changing the theme tab values would propagate the client-specific neutrals into the template-shared layer, breaking the fork workflow for any future client.
If a wrapper needs a body-text neutral different from what Subframe components should display, add a NEW slot in the theme tab (not modify the existing C2 slots).
5.6 Sync workflow safety
npx @subframe/cli sync is destructive — it overwrites whatever is in src/ui/. Two failure modes to guard against:
Uncommitted wrapper work depending on Subframe state pre-sync. If a wrapper override fights a Subframe component's internal structure, and a sync changes that structure, the wrapper's override may no longer have the right selector to target. Guard: smoke-test the dev server post-sync, pre-commit (§4.4).
Subframe theme tab divergence from local code. If someone edited the theme tab without syncing, then someone else syncs later, the sync may write unexpected changes (the accumulated theme tab work since the last sync, not just the change you were intending). Guard: commit before syncing (§4.4) so git checkout src/ui/ reverts cleanly if the sync output is unexpected.
The §4.4 safety workflow (commit → smoke-test → commit sync output separately) is the standard discipline. Following it makes Subframe sync a safe operation; skipping it occasionally produces hard-to-debug regressions.
5.7 What Claude Code should NOT do with src/ui/
Explicit list of failure modes:
❌ "Fix this Subframe component to support [new behavior]." The fix happens via wrapper composition (§6) or theme tab edit (§5.4), not direct file edit.
❌ "Refactor src/ui/components/{ComponentName}.tsx to be more consistent with [other component pattern]." Subframe-generated consistency is determined by the theme tab, not by post-hoc refactoring.
❌ "Inline the styles from theme.css into wrappers for better encapsulation." Token resolution depends on the theme.css → global.css cascade (§4). Inlining breaks templating.
❌ "Add types/interfaces to src/ui/utils.ts to improve type safety." Subframe's type generation reflects the theme tab; if the types are wrong, the fix is in the theme tab, not in the generated file.
❌ "Delete unused-looking files from src/ui/." Two specific categories of "unused-looking" content exist:
Components without a current wrapper consumer — may still be valid Subframe assets that haven't been wrapped yet, or may be orphaned variants flagged in client-scoped Open Items (see Medrano's-scoped §8.11). Removal happens through the Subframe theme tab cleanup workflow, not via file deletion.
The src/ui/layouts/ directory and src/ui/index.ts barrel file — auto-managed by Subframe sync. Currently unused by the codebase (§5.1), but neither is dead code in the deletable sense. Both will reappear on the next sync if deleted.
If a Subframe-edit request comes up that doesn't fit any of the authorized paths above, the right response is to ask: "What's the underlying need this is trying to address?" — usually the answer points to wrapper customization, scoped global.css, or new theme tab work, none of which require direct src/ui/ edits.

6. Wrapping Methodology
The wrapping methodology is the central pattern this codebase is built around. Every section that appears on a page — hero, navbar, footer, reviews, FAQs, service cards, contact forms — is a wrapper. Wrappers live at src/components/websites/MedranosINC/sections/ and are the only place where Subframe components meet client-specific content, tracking, and behavior.
The methodology exists because Subframe components are regenerated on sync (§5) and any direct edits get wiped. Wrappers are the override layer that survives sync. Everything project-specific — content, copy, tracking, behavior, conditional rendering, mobile/desktop variants — lives in wrappers, not in src/ui/.
6.1 The methodology in five rules
Wrap, don't edit. Never modify files in src/ui/components/ or src/ui/theme.css. Customization happens in a wrapper that imports the Subframe component and composes around it.
Compose via slot props. Subframe components expose slot props (title, description, form, headline, etc.). Fill them with wrapper-controlled JSX. Don't render Subframe components and then try to mutate their children through refs.
Override via className. Visual overrides go on the Subframe component's className prop using Tailwind utilities, including [&_selector]: arbitrary variants for nested elements and the ! important suffix when fighting Subframe's internal styles (§7).
Own the outer element. Wrappers render their own outer element. The Subframe component is rendered inside that element. The outer element is where id, ref, tracking attributes, and IntersectionObserver attachment live.
Consume tokens, not values. All brand colors and typography come through token classes (bg-brand-primary, text-default-font, text-heading-1, font-heading-1). Never hex literals (§4).
6.2 Wrapper file structure
Every Subframe-consuming wrapper follows this shape:
tsx
"use client";

import React, { useEffect, useRef } from "react";
import { SubframeComponent } from "@/ui/components/SubframeComponent";
// Subframe icons and utilities are fine to import here:
import { FeatherSomeIcon, IconWrapper } from "@subframe/core";

// 1. Module-level constants — hrefs, asset paths, display strings.
const PHONE_HREF = "tel:+19193573376";
const ASSET_PATH = "/images/example.jpg";

// 2. Local helpers — pure functions used only by this wrapper.
function slugify(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

// 3. Exported props interface — all tracking props optional.
export interface WrapperNameProps {
  id?: string;
  className?: string;
  headline?: React.ReactNode;
  quoteHref?: string;
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

// 4. Optional local sub-components — used only by this wrapper.
function LocalSubComponent({ /* props */ }) { /* ... */ }

// 5. The wrapper itself.
export default function WrapperName({
  id,
  className,
  headline = "Default Headline",
  quoteHref = "#contact",
  trackingSection = "section-name",
  trackingCity,
  trackingService,
  trackingPageType,
}: WrapperNameProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedSectionRef = useRef(false);

  useEffect(() => {
    /* ...fire-once observer pattern... */
  }, [trackingSection, trackingCity, trackingService, trackingPageType]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={["w-full", className].filter(Boolean).join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <SubframeComponent
        className="
          /* layout overrides via Tailwind utilities */
          /* [&_selector]: overrides for nested elements */
        "
        headline={headline}
      />
    </section>
  );
}
Sections in order: "use client" directive → imports → module constants → local helpers → props interface → local sub-components → main wrapper (refs → effects → return).
Exception — omit "use client" on a wrapper that is rendered with NO client directive. Astro ignores the directive entirely (it is a React Server Components convention, and the island boundary is set by the client:* directive in the .astro file, not by this line), so leaving it in place is harmless at runtime but actively misleading: it advertises client-side behavior on a component that ships as static HTML and has no hooks. HeroWrapper is the reference case (§12.1). Keep the directive on every wrapper that does hydrate, which is still most of them.
6.3 Module-level constants
Constants that don't depend on props or state live at the top of the file, above the props interface. This includes:
tel:, sms:, mailto: hrefs
Display-formatted phone numbers and email addresses
Asset paths (/images/..., /videos/...)
Future-route placeholders (/offers?action=print)
Constants are SCREAMING_SNAKE_CASE: PHONE_HREF, DISPLAY_PHONE, EMAIL_HREF, MOBILE_HERO_BG. Keep them at the top of the file even if used only once — it makes per-client values trivial to find when the template gets forked.
6.4 Local sub-components
If a piece of JSX is used only within one wrapper, define it as a local function-component inside that wrapper's file. Don't split it into its own file unless it's reused.
Examples from HeroWrapper.tsx: OfferActions, PercentBadge, OfferCard, OfferCards are all local sub-components. They handle hero offer-card rendering, are used nowhere else, and stay co-located with the wrapper that uses them.
The rule: single use → same file; reused → new wrapper file. Reuse is the only justification for promotion to a top-level export.
6.5 Slot prop composition
Subframe parent components expose slot props like headline, primaryActionButton, offerCards, form, description. Fill them with whatever JSX the wrapper needs.
Slot prop values can be:
✅ Plain strings or numbers
✅ Wrapper-controlled JSX (<a>, <span>, <div> with content)
✅ Local sub-components from §6.4
✅ Custom React forms (Variant A in §10.2)
✅ Nested Subframe components — though this is rare
A wrapper does not need to fill every slot. Optional slots (most are) can be omitted by not passing the prop, and the Subframe component renders nothing for them.
Before planning any layout override on slot children, check whether they are DIRECT children. Read the Subframe component and see how it renders the slot. If it drops {children} straight into its own flex or grid container, each element the wrapper passes IS a flex/grid item, so col-span-*, order-*, flex-* and grid placement all land on the right element and are ordinary wrapper work. If it wraps each child in its own <div>, the wrapper's elements are grandchildren — the span or order applies to the wrong box, the intended layout silently does not happen, and per-child placement becomes theme-tab-only (§7.1's ceiling).
ServicesGrid is the favorable case: it renders {services} as direct children of the grid container with no per-child wrapper, which is the only reason max-md:col-span-2 on a wrapper-authored <a> produces a full-width featured card. That fact is load-bearing in the other direction too — introducing a wrapper div around grid children would break spanning and force a sync. One grep of the component answers this in seconds and determines whether the work is possible at all.
6.6 The outer element
The wrapper's outermost rendered element is determined by how the wrapper fits in the page structure. Three patterns:
<section> for top-level page regions where the semantic HTML element matters: hero (HeroWrapper.tsx), content sections like reviews, FAQs, service grids. Used when the wrapper benefits from being identified as a page section element in the DOM.
<div> for self-contained component wrappers that don't need section semantics: form cards consumed inside larger layouts (RightRailContactFormStickyWrapper.tsx, ContactInfoFormWrapper.tsx, ContactFormWrapper.tsx), and structural wrappers like navigation that have their own semantic meaning beyond "page section" (NavbarMainWrapper.tsx).
Fragment (<>...</>) for wrappers that render multiple sibling sections. HeroWrapper.tsx is the canonical example — it renders the hero section plus a separate mobile-only offer section as siblings, each with its own <section> element inside the fragment. Multi-region wrappers apply the section-element pattern to each region, with separate refs and tracking attributes per observed section.
The principle: outer element reflects how the wrapper fits in the page structure. Page sections (hero, content blocks) use <section>. Self-contained components (form cards, navbars) use <div>. Multi-region wrappers use a fragment.
This section concerns the outermost element of wrapper files. Cards, sub-components, and elements rendered inside a wrapper follow standard HTML conventions for their role — typically <div> for visual containers, <article> for content cards, etc. The outer-element rules above are about how the wrapper fits in the page structure, not about composition inside the wrapper.
Whichever outer element a wrapper uses, that element owns:
id (if provided as a prop, used for anchor links)
ref (for IntersectionObserver)
className (combined wrapper-default + prop override via ["base-classes", className].filter(Boolean).join(" "))
The five tracking attributes: data-section, data-city, data-service, data-page-type, plus data-form for form wrappers
A separate ref + data-section per observed region when the wrapper renders multiple tracked sections
The Subframe component renders inside the outer element, not as the outer element itself. This separation matters: the outer element is yours, the Subframe component is regenerated.

6.6.1 The id question, in both directions — run an anchor inventory BEFORE restructuring
Anchor ids on this template come from two places: a wrapper's own id prop default, or a <section id="…"> wrapper that a page builder or route puts around it. Whether a given anchor has one source or the other is not visible from either file alone, and getting it wrong fails silently in opposite directions. This has now caused three separate defects, so treat it as a required check rather than a caution.

Direction 1 — wrapping a wrapper that self-defaults an id produces a DUPLICATE. ContactFormWrapper defaults id="home-contact" on its own root; the builder also wrapped it in <section id="home-contact">, so the served HTML carried two elements with the same id. Invalid HTML, and the browser jumps to whichever comes first. Same class of bug later appeared with #services and ServicesGridSectionWrapper. Nothing warns you: no build error, no console message, and the anchor still "works" because one of the two matches.

Direction 2 — dropping a wrapper whose id has NO other source silently breaks every link to it. ServiceAreaWrapper and ReviewsCarouselWrapper accept an id prop but default it to undefined, so #service-area and #reviews existed ONLY on the builder's section wrappers. Removing those wrappers as "redundant" during an island split would have broken two live footer links, again with no build error — a dead anchor just scrolls nowhere.

So before adding OR removing a <section id="…"> wrapper:
Grep the repo for the anchor: grep -rn '"#the-anchor"' src/ — including prop DEFAULTS, since most CTA hrefs are wrapper defaults (ctaHref = "#home-contact") rather than literals in a builder.
Check whether the wrapped component already defaults that same id on its own root. If it does, do not add a wrapper; pass the id to the component instead.
If it does not, and something links to the anchor, the wrapper is load-bearing — keep it.
After the change, confirm each id appears EXACTLY ONCE in the served HTML, not just at least once.
The same reasoning applies to landmark elements: FooterWrapper renders its own <footer>, so a builder wrapping FooterSection in another <footer> nests two landmarks. Check for that while checking ids — the two problems hide in the same redundancy.

6.7 className override patterns
Two layers of override happen at the className level:
Outer wrapper className — passed via prop, combined with wrapper defaults:
tsx
className={["w-full bg-white", className].filter(Boolean).join(" ")}
This is for page builders that need to add page-level layout context (margin, max-width constraints, ordering in a grid).
Subframe component className — applied to the Subframe component itself, where most overrides happen:
tsx
<Updatedherowithoffers
  className="
    relative z-10 min-h-[80vh] w-full pb-10 pt-24 md:pb-40
    [&_h1]:text-brand-primary
    max-md:[&_.cta-button]:w-full
  "
/>
This is where layout adjustments, breakpoint-specific tweaks, and nested-element overrides via [&_selector]: arbitrary variants go. See §7 for the full override toolkit.
6.8 Effects and refs
Wrappers commonly need three kinds of effects:
IntersectionObserver for view_section (§8.2). Standard pattern, fire-once via boolean ref, unobserve after fire. Required on any wrapper rendering a section meant to be tracked.
Form focusin listener (§10.3, §10.7). Only on form wrappers. Scopes itself via [data-form="${formId}"] selector.
Resize / scroll listeners. Rare. When required, follow standard cleanup discipline — remove the listener in the effect's return.
Wrappers should not:
❌ Subscribe to global state (no Zustand, Redux, Context outside React's built-in)
❌ Mutate the DOM outside their own subtree
❌ Add MutationObservers to Subframe components to "fix" their output — if the override needs to go that deep, escalate to scoped global.css (§7)
❌ Push to dataLayer from arbitrary handlers — see §8 for rules on when manual pushes are appropriate vs. when the global click bridge should handle the event
6.9 When a Subframe component doesn't fit
Sometimes a Subframe component doesn't expose the slot you need, or its internal structure makes the desired behavior impossible. Three escape hatches, in order of preference:
Add the slot in Subframe and re-sync. Open the Subframe theme tab, modify the component to expose the missing slot, sync. The regenerated theme.css and component file carry the change. Preferred when the new slot is a generally useful addition.
Use a different Subframe component. Sometimes a different parent layout exposes what you need. Check src/ui/components/ before assuming you have to fall through.
Drop to Variant B or C (§10.2 for form-specific variants; the same logic applies to non-form wrappers). Compose Subframe atoms inside a custom layout, or write fully custom React. Use sparingly — these break the regeneration safety net.
Never as an escape hatch: editing src/ui/components/* directly. That work gets wiped on the next sync.
6.10 Naming conventions
Wrapper files: PascalCase ending in Wrapper.tsx (e.g. HeroWrapper.tsx, NavbarMainWrapper.tsx). The Wrapper suffix is the strong signal that this file customizes a Subframe component. New wrappers always follow the convention. Legacy exceptions exist in the codebase (LandingContactForm.tsx, ContactHeroHeader.tsx, ActionHeroHeader.tsx, TallServicesBenefitsCards.tsx, TitleHeadingBlock.tsx) and stay unrenamed until the file is being substantially edited anyway — at which point the rename happens as part of the edit. Same opportunistic-upgrade policy as the data-form migration in §10.7.
Exported component name matches the filename without the extension.
Props interface: WrapperNameProps — the same name with Props appended.
Local sub-components: PascalCase, descriptive of role (OfferCard, not Card).
Local helpers: camelCase (slugify, normalizeTrackingService).
Tracking section defaults: kebab-case strings matching §8.5's controlled vocabulary.
7. Override Techniques
Wrappers customize Subframe components by applying Tailwind utilities through the className prop. Most overrides are unremarkable — width constraints, margins, breakpoint-specific stacking. The patterns below cover the cases that aren't obvious, and the rules for when to escalate beyond className.
7.1 The override hierarchy
When customizing a Subframe component's appearance or behavior, try these in order. Stop at the first one that works:
Slot prop content — pass the JSX you want rendered through the Subframe component's slot props (§6.5). No override needed; you're filling a designed-for extension point.
className utilities — standard Tailwind utilities applied to the Subframe component (bg-white, px-6, md:flex-row).
className arbitrary variants — [&_selector]: for targeting nested elements inside the Subframe component (§7.3).
className with ! important — when Subframe's internal classes have higher specificity than your override (§7.4).
Scoped rules in global.css — for persistent issues that className can't reach, scoped tightly to a data-section or id (§7.5).
A new slot in Subframe — if the override is structural and recurring, add a slot to the Subframe component itself and re-sync (§6.9). Beats fighting the same battle in multiple wrappers.
Working up the ladder reflects the cost of the override. Slot props are free. className is cheap. !important is a tax. Scoped global.css rules are technical debt with a memo attached. New Subframe slots are an investment.

The ceiling on rungs 2-5: className can only change CSS. Every rung from className through scoped global.css operates on styling and nothing else. An HTML ATTRIBUTE on a Subframe-rendered element is unreachable from a wrapper, at any rung, with any amount of specificity. So is the element's tag name. There is no CSS property for fetchPriority, loading, href, type, target, rel, inert, or aria-*, so no selector can add one. When the attribute you need is on markup Subframe emits, the hierarchy does not apply — jump straight to rung 6 (theme tab + sync) or restructure so the element is wrapper-authored.
This has bitten in four distinct forms, so recognize it early: a Subframe <button> cannot become an <a href="tel:…"> (§8.9's baked-in button pattern, which suppresses it and injects a wrapper-authored anchor into a slot instead); a Subframe-rendered <img> cannot receive fetchPriority for an LCP hint or loading="lazy" to stop React 19 preloading it (§9.13); and placeholder text inside a Subframe component cannot be removed by hiding it, only by editing the component — CSS-hidden text stays in the DOM and stays crawlable.
The diagnostic question, asked before planning any override: is the element I need to change authored in a wrapper, or emitted by Subframe? If it arrives through a slot prop, it is yours and every rung is available. If Subframe renders it, only rung 6 can change its attributes.
7.2 Tailwind utility basics
Standard Tailwind v4 utilities work as expected. A few project conventions:
Combine wrapper defaults with prop overrides using a filter+join pattern, not a template literal:
tsx
  className={["w-full bg-white", className].filter(Boolean).join(" ")}
The filter(Boolean) is the load-bearing part — it drops undefined className props without leaving stray whitespace in the rendered attribute.
Multi-line className strings use template literals when readability benefits, kept inside a single string with newlines for grouping:
tsx
  className="
    relative z-10 min-h-[80vh] w-full
    pb-10 pt-24 md:pb-40
    [&_h1]:text-brand-primary
  "
Tailwind reads whitespace-separated tokens, so the newlines are cosmetic. Long override strings should use this pattern; short ones stay on one line.
Token-based classes always win over hardcoded values. Use bg-brand-primary, not bg-[#00822d]. Use text-default-font, not text-[#3a3a3a]. See §4 for the token catalog.
7.3 Arbitrary variants for nested elements
Tailwind's arbitrary variant syntax [&_selector]: is the primary tool for overriding nested elements inside a Subframe component without touching its source. The & is the Subframe component's root; the selector after the underscore targets descendants via CSS selector syntax.
Examples from the codebase:
tsx
// Force every paragraph inside the component to use the brand color
className="[&_p]:text-brand-primary"

// Target a class on a nested element
className="[&_.pointer-events-none]:translate-y-[6px]"

// Combine with a breakpoint variant
className="max-md:[&_input]:w-full"

// Target a specific element type and pseudo-state
className="[&_button:hover]:bg-brand-primary-hover"

// Stack multiple nested-element overrides
className="
  [&_input]:bg-white
  [&_textarea]:bg-white
  [&_button]:!bg-brand-primary
"
Selector tips:
Single underscore between & and the selector. [&_p] not [& p]. The underscore becomes a space at the CSS layer.
Class selectors work: [&_.some-class]:...
Combinators work: [&_div>span]:... (child), [&_div+span]:... (adjacent sibling). Use sparingly — too-specific selectors break when Subframe regenerates the component with slightly different structure.
Don't target Subframe-internal class names when you can avoid it. Classes like .subframe-default-something are not part of a public API and may rename between sync versions. Prefer targeting semantic selectors (button, input, h1) or your own class names placed inside slot props.
7.4 The ! important suffix
Subframe components apply their own utility classes internally. When a plain override doesn't take effect, the internal class is winning on specificity or source order. The fix is the ! important suffix.
Leading-! syntax inside arbitrary variants:
tsx
// Forcing a token-based color through a Subframe internal class
className="!bg-brand-primary"
className="!text-white"

// Inside arbitrary variants
className="[&_*]:!text-white"
className="[&_button]:!bg-brand-primary"

// Combined with breakpoint variants
className="max-md:[&_input]:!w-full"
This codebase uses the leading-! syntax inside arbitrary variants because that's what the existing code uses and is known to compile. The trailing-! syntax is Tailwind v4's standalone-utility convention but its behavior inside arbitrary variants is uncodified here.
When ! is and isn't appropriate:
✅ Forcing a token-based value through a Subframe internal class. Example: a Subframe button paints text white via text-neutral-0; you need it to stay white even when other utilities try to recolor it → [&_*]:!text-white.
✅ Overriding a Subframe component's default background, padding, or border that the component declares internally.
❌ Forcing a hex literal through. If you're reaching for ! to make a hex value stick, you're skipping the token system. Use a token class instead.
❌ Applying ! to every utility "just in case." Each one is a debt marker — if a utility doesn't need ! to take effect, don't add it.
If you find yourself stacking three or more ! overrides on the same Subframe component, that's the signal to escalate to §7.5 (scoped global.css rule) or §7.6 (add a Subframe slot).
7.5 Scoped rules in global.css
Some overrides can't be expressed through className alone:
Styles that need to win against Subframe's <style> injection at a specificity that even ! can't reach
Rules that need to apply to multiple wrappers consistently and would duplicate ! overrides everywhere
Rules that depend on parent-element context the Subframe component doesn't expose
For these, write a scoped rule in src/styles/global.css. Always scope tightly:
css
/* Scoped by data-section — preferred when the override applies to one
   tracking section across multiple page types */
body.theme-medranos [data-section="hero"] .pointer-events-none {
  transform: translateY(6px);
}

/* Scoped by id — preferred when the override is for one specific
   element instance */
body.theme-medranos #home-contact button[type="submit"] {
  color: white !important;
}
Rules to follow:
Always nest under the client's theme class (body.theme-medranos). Unscoped rules in global.css affect every client when the template is forked.
Scope by data-section or id, not by Subframe internal class names. Subframe classes can rename on sync; your data attributes don't.
Every global.css override must have a comment explaining the problem it solves and why it couldn't be done in className. Future-you (and Claude Code) will read this comment when deciding whether the rule is still needed. The current global.css already follows this pattern for the C2 override, typography overrides, and trust-ratings scoped fix — the rule formalizes existing practice.
Don't proliferate. If a Medrano-scoped global.css rule starts feeling like a sixth or seventh wrapper-specific override, escalate to §7.6.
7.6 Adding a Subframe slot
When the same override pattern repeats across multiple wrappers or fights the same internal class repeatedly, the right answer is to modify the Subframe component to expose what you need. Workflow:
Open the Subframe theme tab for the relevant component.
Add the missing slot, restructure the layout, or expose the styling variable.
Run npx @subframe/cli sync.
The regenerated src/ui/components/SomeComponent.tsx and any regenerated theme.css slots carry the change.
Update wrappers to consume the new slot. Remove the ! overrides they no longer need.
This is the only correct way to change src/ui/. Direct edits to src/ui/components/* or src/ui/theme.css are wiped by the next sync.
7.7 Breakpoint conventions
Tailwind v4's default breakpoints apply. Two conventions specific to this codebase:
max-md: prefixes are the preferred way to express mobile-only overrides. The codebase reads as desktop-default with mobile exceptions, which matches the design source of truth (Subframe components are authored for desktop layout first).
tsx
  className="flex-row max-md:flex-col"           // ✅ preferred
  className="flex-col md:flex-row"               // ✅ also fine, equivalent
Both work; the first reads more clearly when most styles are desktop-default.
Mobile-only render branches use md:hidden / hidden md:block pairs, not JavaScript media queries. See HeroWrapper.tsx for the video-desktop / image-mobile background swap.
Don't introduce custom breakpoints in wrappers — if a breakpoint isn't in Tailwind's default scale (sm, md, lg, xl, 2xl), the right move is to use the closest one or escalate the request to the design system level, not to inline an arbitrary [@media (min-width: 850px)] variant.
7.8 Override hygiene
A wrapper accumulating overrides is normal. A wrapper accumulating the same shape of override repeatedly is a smell. Two specific patterns to watch:
The 8-line className string with five ! markers. This signals fighting the Subframe component. Time to consider §7.5 or §7.6.
But read the Subframe component before concluding you are fighting it. A large cluster has two possible causes and they call for opposite responses. CONFLICT means the wrapper is overriding a value Subframe sets differently — the escalation case, and what this section originally assumed. DUPLICATION means the wrapper is restating what Subframe already does. In the services-grid cluster, 7 of 9 classes merely repeated the component's own grid grid-cols-4 gap-6 max-w-[1024px]. Duplication is deletable with zero visual change and no escalation; conflict is the signal to escalate. Open src/ui/components/{Component}.tsx and diff the two lists before reaching for §7.5 or §7.6 — the cheap fix is often deletion, not a new slot.
The [&_*]: universal child selector. Sometimes the right answer (Variant A forms use [&_*]:!text-white for button label coloring). Often a shortcut around understanding what's actually being styled. If you can replace it with a more specific selector, do.
className strings over ~10 lines on a single Subframe component are worth scrolling past once to see if any of them are dead, redundant, or fighting each other.

8. Tracking Architecture
All analytics in this codebase flow through Google Tag Manager. GTM is the single source of truth for tracking — GA4, Google Ads, and any future destinations are configured inside GTM, not in code. Wrappers and pages push events to window.dataLayer; GTM listens, transforms, and routes.
This rule is absolute:
❌ Never import or inject GA4, Google Ads, Meta Pixel, or any analytics library directly into a wrapper, page, layout, or Astro file.
❌ Never add <script> tags for tracking pixels outside of GTM.
✅ All new tracking goes through dataLayer.push(), and is then configured in the GTM container.
If a new destination is needed, the work happens in GTM. Code only needs to emit the right event with the right payload shape.
8.1 The data-* click bridge
src/layouts/Layout.astro contains a global click delegation listener that auto-captures click events from any element carrying a data-event attribute. Wrappers do not write addEventListener for click tracking — they declare intent via data-* attributes and the bridge does the rest.
The bridge walks up from the click target to find the nearest ancestor with data-event, then pushes a payload composed of these attributes:
Attribute
Required
Purpose
data-event
Yes
The event name (e.g. click_cta, click_call)
data-label
Yes
Element identifier in {section}-{element}-{detail}
data-section
Yes
Section name, must match a value in the taxonomy
data-city
Yes
Client city slug, kebab-case (e.g. raleigh-durham)
data-service
Yes
Service slug, kebab-case (e.g. tree-removal)
data-page-type
Yes
Page type (home, service, city, about, etc.)

The bridge also auto-includes href (from the element or nearest anchor) and text (trimmed to 100 chars from data-text or textContent). Do not duplicate these manually.
The bridge skips clicks on input, textarea, select, option, label, disabled elements, and modified clicks (cmd/ctrl/shift/alt or middle/right mouse). Only left-button, unmodified clicks fire events.
Rule for new tracked elements: add the six data-* attributes. Do not write a click handler. Do not push to dataLayer from a click handler.
8.2 view_section IntersectionObserver — two mechanisms
Section-view tracking cannot ride the click bridge, because the bridge only sees clicks. There are TWO implementations in this codebase, and choosing wrongly either breaks tracking silently or blocks a component from being de-hydrated.

Mechanism A — vanilla observer in Layout.astro (preferred for anything de-hydratable). A second inline script alongside the click bridge queries [data-track-view], observes those elements, and pushes the same view_section payload read from data-* attributes. It is template-shared: it ships in Layout.astro on every fork. Use it when a component's ONLY client-side need is view_section tracking, because it lets that component render with no client directive at all (§9.11) — the React version cannot, since a useEffect never runs in an unhydrated component and stops firing with no build error and no console warning.
Opt in by adding data-track-view to the element that already carries data-section. Contract:
The selector is [data-track-view], deliberately NOT [data-section]. A generic selector would start firing view_section for every section that carries data-section but never had an observer, which is a silent analytics data discontinuity, and it would force migrating all React observers at once or they double-fire. The attribute is a migration seam, not permanent API — once no React observers remain, it can be replaced with a generic selector.
Dedupe is by SECTION NAME, not element. A wrapper may render the same data-section on two elements (a desktop and a mobile copy); keying on the element fires the name twice.
Default threshold 0.4; override per element with data-track-view-threshold.
Optional data-slug is forwarded into the payload when present.
It fires off server-rendered DOM before hydration — measurably earlier than the React version (observed at GTM eventId 4-5, ahead of gtm.dom, where React observers landed at 16-21). Earlier is better tracking, not just faster.

Mechanism B — React useEffect observer in the wrapper (only when the component must hydrate anyway). Still correct for components that need hydration for other reasons — form state, carousels, disclosure toggles, scroll effects. Do not migrate these for its own sake; the win only exists if the directive can actually be dropped. The pattern:
Attach a useRef<HTMLElement> to the section element.
Create one IntersectionObserver per wrapper, threshold: 0.4.
Guard each section with a useRef<boolean>(false) (e.g. hasTrackedHero) so the event fires exactly once per page load.
After the first fire, call observer.unobserve(entry.target) to release the observation.
The observed element must carry a data-section attribute matching the trackingSection prop — the observer reads entry.target.getAttribute("data-section") to disambiguate when one wrapper observes multiple sections.
Disconnect the observer in the effect's cleanup.
When a wrapper renders both a mobile-only and desktop-only version of the same logical section, each gets its own ref and is observed independently. They share the same trackingSection value, but only the visible one will intersect — preventing double-fires across breakpoints. (Mechanism A handles this case by deduping on the section name instead, which is why it needs no per-element refs.)
The view_section payload always includes: event, section, city, service, page_type. No label, no href. Both mechanisms emit the identical payload — that is deliberate, so migrating a component between them is invisible downstream.

Which to use, in one line: if dropping the client directive is possible after removing the observer, use Mechanism A; otherwise leave Mechanism B in place. Before assuming a component is de-hydratable, inventory its hooks AND check whether it renders an interactive Subframe primitive — a wrapper with no hooks of its own can still require hydration because its interactivity lives inside an imported component (a Radix-backed Accordion, for instance). A hooks-only grep misclassifies those.
8.3 Form event chain
Every form in the codebase fires the same four-stage event chain. Order is load-bearing — GTM triggers depend on it.
Stage
When it fires
Required payload fields
form_start
First focusin anywhere in the form
form_id, form_name, section, city, service, page_type, slug
form_submit_attempt
Top of submit handler, before validation
Same as above
form_submit_success
After 2xx response from /api/contact
Same as above
form_submit_error
On non-2xx or thrown error
Same as above + error_message
generate_lead
Immediately after form_submit_success
Same as above + value: 1, currency: "USD"

Implementation rules:
Each event must be ref-guarded to fire at most once per submission lifecycle (hasStartedRef, hasSubmittedRef). The reset() helper clears these on success so a second submission in the same component instance re-fires the chain.
Use a buildPayload(event, extra?) helper so every payload carries the full tracking context. Do not handwrite payloads per event.
The honeypot field (named company) silently rejects bots by faking success without hitting the API. No tracking events fire on honeypot trips — bots should look invisible in analytics.
The started_at_ms timestamp goes in the API payload (server-side bot timing), not in dataLayer events.
Form root element carries data-form="{formId}" so the focusin listener can scope itself with document.querySelector('[data-form="${formId}"]'). This is separate from data-section and must not be removed thinking it's redundant.
See RightRailContactFormStickyWrapper.tsx for the canonical implementation. Custom form wrappers (form wrappers do not wrap Subframe components — see §10) must match this chain exactly.
8.4 Event taxonomy
These are the only event names this codebase emits. Adding a new event name is a tracking-architecture decision, not a wrapper-implementation decision — discuss it before introducing one.
Event
Fired by
Purpose
Conversion role
Status
generate_lead
Form chain
Form submission completed
PRIMARY
Live
click_call
data-event
Phone link click
SUPPORTING
Live
click_text
data-event
SMS link click
SUPPORTING
Live
click_email
data-event
Email link click
ANALYTICS ONLY
Live
click_cta
data-event
Primary/secondary CTA button click
SUPPORTING
Live
click_nav_link
data-event
Top/footer navigation link click
ANALYTICS ONLY
Live
click_social
data-event
Social media link click
ANALYTICS ONLY
Live
click_coupon_cta
data-event
Offer card "Get Coupon" link click
SUPPORTING
Live
select_service
data-event
Service-card selection on landing pages
SUPPORTING
Live
view_section
IntersectionObserver
Section scrolled into view (≥40%)
SECONDARY (CRO)
Live
form_start
Form chain
First focus inside form
SECONDARY
Live
form_submit_attempt
Form chain
Submit handler entry
SECONDARY
Live
form_submit_success
Form chain
API returned 2xx
SECONDARY
Live
form_submit_error
Form chain
API failed or threw
SECONDARY
Live
qualified_call_60s
Google Ads
Call ≥60s via Google Ads call tracking (see §8.9)
PRIMARY
Live
click_coupon_download
data-event
Coupon PDF download
SUPPORTING
Live (client-dependent)
open_menu
data-event
Mobile navigation menu opened
UX ONLY
Live
toggle_nav_section
data-event
Accordion section expanded/collapsed — navigation OR content. ⚠️ The description read "Mobile nav accordion" and under-described it: the mechanic is identical for a content accordion (an FAQ, a disclosure), and reusing this name for one is correct. Broadening a DESCRIPTION is not a taxonomy change and does not trip §11.5; introducing a new event name for the same mechanic would.
UX ONLY
Live
carousel_prev
data-event
Reviews/gallery carousel stepped backward
UX ONLY
Live
carousel_next
data-event
Reviews/gallery carousel stepped forward
UX ONLY
Live
carousel_dot
data-event
Carousel position selected via dot indicator
UX ONLY
Live
carousel_thumb
data-event
Carousel position selected via thumbnail
UX ONLY
Live

⚠️ Correction (2026-08-20). The six UX ONLY rows above were emitted by wrapper code but absent from this table, and click_coupon_download was listed as "Aspirational" while a client was already emitting it. Both errors were found by crawling the served HTML of every route pattern rather than reading the code. The lesson generalizes: this table drifts from reality in the direction of UNDER-reporting, because adding a data-event to a wrapper is a one-line change that nobody thinks of as a taxonomy edit. Audit it by crawling emitted HTML, not by grepping source.

The UX ONLY role means these events carry no conversion weight and should not be imported into Google Ads. They exist for funnel and interaction analysis. They still require the full tracking context payload (§8.6) — a UX event without city/service/page_type cannot be joined to anything and is therefore worthless.

click_coupon_download is marked "Live (client-dependent)" rather than "Live" because whether it fires depends on the client having a coupon asset configured. A client whose CLIENT.offers.items[*].couponPath is empty never emits it. Check the client before building a report on it.
8.5 Taxonomy values — kebab-case, controlled vocabulary
All string values inside tracking attributes and payloads are kebab-case. The vocabularies are controlled — do not invent new values without updating this list.
page_type: home, service, city-landing, about, contact, offers, privacy. This is the complete set for one-off and data-driven pages combined. ⚠️ CORRECTED: this list read `city` while §9.4's worked example, the CityLandingPageBLDR code, and the served HTML all emit `city-landing`. Root contradicted itself, and a fork copying this list would have keyed GA4 explorations on a value nothing emits. When this file and the code disagree about an EMITTED value, the code wins and this list is what gets fixed — renaming an emitted section or page_type to match documentation creates an analytics discontinuity for no benefit. Adding a new page type requires updating this list along with the page builder.
section: kebab-case section name. Reuse existing names when an element belongs in the same logical section as existing tracked elements (e.g. a new CTA inside the hero stays as hero, not hero-extra). New section names are introduced only when the section is genuinely new.
city: kebab-case slug. Client-scoped — see client CLAUDE.md for the active value(s).
service: kebab-case slug matching servicePageData[*].slug. Generated from the service name via the service-page builder's normalizeTrackingService() helper, not via the local slugify() helper that appears in HeroWrapper.tsx and LandingContactForm.tsx. The two functions appear similar but serve different roles:
normalizeTrackingService() produces the canonical service slug used for tracking — it must match servicePageData[*].slug exactly so analytics joins across events stay consistent.
slugify() is a local-scope string utility used for tracking labels (e.g. hero-offer-text-emergency-storm-clean-up) where the slug is descriptive rather than canonical.
Using slugify() where normalizeTrackingService() is needed (or vice versa) breaks the analytics join. See client CLAUDE.md Open Items for the triple-instance consolidation work tracking these two functions plus the third instance.
⚠️ The "must match slug exactly" invariant above is STATED BUT NOT ENFORCED, and it is currently violated. ServicePageBLDR calls normalizeTrackingService(page.service) — the DISPLAY NAME, not the slug. They coincide for most services, so the drift is invisible until a display name contains punctuation: "Tree Trimming / Pruning" normalizes to tree-trimming-pruning against a slug of tree-trimming, so GA4 has been recording the wrong value for that service and any join keyed on the slug returns zero rows for it.
Two consequences that matter more than the one instance. First, nothing catches this — there is no assertion, no type-level link between service and slug, and no build step comparing them, so a new service with a slash, ampersand or double space in its display name silently inherits the same bug. Second, a display-name COPY EDIT moves a GA4 dimension. Renaming a service for marketing reasons changes the tracking slug as a side effect, and nothing in the diff shows it. Treat any edit to a service's display name as a tracking change: decide deliberately whether the slug should follow, and if not, decouple it by passing the slug explicitly rather than deriving it. Fixing an existing mismatch is itself a discontinuity, so it is a decision rather than an auto-fix.
label: {section}-{element-type}-{detail}. Examples: hero-primary-get-a-quote, hero-offer-text-emergency-storm-clean-up, nav-cta-get-quote.
8.6 Tracking context flow through props
Tracking context is passed top-down as props, never read from a global context or store. The flow is:
Page builders (e.g. ServicePageBLDR.tsx, CityLandingPageBLDR.tsx) derive tracking context from the page data file (servicePageData.tsx, cityLandingData.tsx).
Page builders pass trackingCity, trackingService, trackingPageType to every wrapper as props.
Wrappers accept these as optional props with sensible defaults, then thread them into every data-* attribute and every view_section payload.
Wrappers also own their trackingSection value — it is wrapper-local, not derived from page data.
When adding a new wrapper, the props interface must accept at minimum: trackingSection, trackingCity, trackingService, trackingPageType. All four are optional (?:) at the type level so the wrapper can be dropped into pages that don't fully derive them, but in practice all four should always be passed by page builders.
8.7 Server-side analytics
Layout.astro accepts a gtmId prop. The GTM head snippet and noscript iframe are only emitted when gtmId is set — this is intentional, so preview/development routes can opt out by omitting the prop.
The GTM container ID itself is client-scoped — see client CLAUDE.md for the value. No container ID appears anywhere in code: it resolves env var → CLIENT.tracking.gtmId → every route's gtmId prop → Layout.astro. Two consequences worth knowing before touching it. The variable is PUBLIC_*, so Vite inlines it at BUILD time — changing it in Vercel does nothing until a redeploy, which reads like a broken variable rather than a stale build. And the container holds every tag, so pointing at a new one drops all three Ads conversions, the GA4 Event Router, AND the phone-number swap until they are rebuilt. DUPLICATE.md has the swap procedure, the conversion-rebuild checklist, and how to test a container on Preview scope only.
8.8 Manual pushToDataLayer — when the click bridge can't see the event
The global click bridge in Layout.astro (§8.1) auto-captures click events from elements carrying data-event attributes. It can't see every event. When the click bridge can't see something but tracking is still needed, push to dataLayer manually from the relevant handler.
Three cases where manual push is required:
React-portaled content — Subframe's DropdownMenu, Popover, and similar components render their content outside the parent's DOM subtree via React portals. The click bridge walks up from the click target to find the nearest ancestor with data-event — when the rendered tree is portaled, walking up exits the page section before reaching the wrapper's tracking attributes. The click bridge sees no data-event ancestor and doesn't fire.
Programmatic state changes — form validation failures, route transitions handled by client-side navigation, success/error state updates after async operations. These aren't DOM clicks at all; they're synthetic events. The click bridge can't intercept what never reaches it.
Third-party intercepted handlers — third-party libraries that stop event propagation before it reaches the document-level click listener (rare in this codebase; common in older libraries).
The manual push pattern:
ts
import { pushToDataLayer } from "@/utils/tracking"; // or local helper

function handleSelectFromDropdown(value: string) {
  // ...state update logic...
  pushToDataLayer({
    event: "select_service",
    label: `service-dropdown-${value}`,
    section: trackingSection,
    city: trackingCity,
    service: trackingService,
    page_type: trackingPageType,
  });
}
The manual push must include the full tracking context payload — section, city, service, page_type — same as what the click bridge would have constructed from data-* attributes. Without it, the event lands in dataLayer but lacks the context for analytics joins.
Verification protocol: if data-event is on an element and the event doesn't fire in GTM preview mode, the click bridge can't see that element — switch to manual push from the handler. Conversely, if you're tempted to add a manual push to an element that already has data-event working, you have a duplicate-fire bug; remove the manual push.
The form event chain (§8.3) uses manual pushes throughout because the form chain consists entirely of synthetic events (form_start on first focus, form_submit_attempt on submit handler entry, etc.). None of those are DOM clicks the bridge would catch. See RightRailContactFormStickyWrapper.tsx for the canonical implementation.

8.9 Phone call tracking model
Two call signals feed two separate Google Ads conversion actions with different roles. Never set both as Primary — that double-counts the bid signal and corrupts Smart Bidding.

Primary — Qualified 60-second call (awcc tag)
Mechanism: Google Ads "Calls from website" swap. A GTM tag type awcc fires on All Pages and dynamically replaces the phone number displayed on the page with a Google forwarding number. Google times calls routed through that number and counts a conversion only for calls ≥ 60 seconds. This is the quality signal that drives bidding.
Conversion role: Primary (Include in Conversions: On in the Google Ads conversion action settings — not a GTM tag setting).
Client-specific tag names, conversion IDs, conversion labels, and values are documented in client-scoped CLAUDE.md §3.6.

Secondary — Click-based tap (click_call dataLayer event)
Mechanism: The global click bridge (§8.1) fires a click_call event on every tap of a phone link carrying data-event="click_call". This feeds a standard awct conversion tag. Every phone link tap is counted — no duration check, no forwarding number required.
Conversion role: Secondary (Include in Conversions: Off) — recorded in All Conversions but excluded from the Conversions column and the bid denominator.

The swap compatibility rule
The awcc swap script scans the rendered DOM for text matching the configured phone number string. It only matches VISIBLE rendered text — text the browser actually draws on screen. The following are NOT matched and do NOT enable the forwarding number:
- href="tel:+1..." (the link destination)
- aria-label="Call now ..." (accessibility attribute only)
- sr-only / display:none / visibility:hidden text
- Text inside CSS pseudo-elements (::before / ::after)

Consequence: any phone link that shows only a phone icon or "Call Now" text without the number visible on screen will not trigger the number swap. The user dials the real number directly, the call bypasses the forwarding number, and the qualified-call signal is lost.

Convention for swap-compatible call buttons — all three required:
1. Outer element must be <a href={PHONE_HREF}> — must be an <a> with a tel: href. <button> elements cannot hold href and will not dial.
2. Visible number text: <span className="phone-number">{DISPLAY_PHONE}</span> inside the <a>. The .phone-number class is a codebase convention for identifiability — the class itself is not required by the swap script, but the visible text is required.
3. Both PHONE_HREF and DISPLAY_PHONE sourced from central config (CLIENT.contact in client.config.ts) — never hardcoded strings. See §6.3 for the module-level constants convention.

Elements that intentionally show no phone number (icon-only elements) can still carry data-event="click_call" for the Secondary tap-conversion signal. Whether they can ALSO feed the Primary qualified-call path depends on which swap mechanism the container uses — see below. Document the trade-off if a button is intentionally Secondary-only.

The visible-text rule belongs to the AUTOMATIC swap, not to forwarding numbers
Everything above describes gtag's automatic text-node replacement, which is the default and the only mechanism most containers use. It is a real constraint and the warnings stand. But it is a property of that scanner, not of the Google forwarding number itself, and an earlier version of this section overstated it as absolute. There are two mechanisms:

Mechanism 1 — automatic text-node swap (everything above). The script matches the configured number as VISIBLE RENDERED TEXT and rewrites those nodes. href, aria-label, sr-only, display:none, and pseudo-element content are all invisible to it. An icon-only button gets nothing and degrades to Secondary tap-only.

Mechanism 2 — phone_conversion_callback. Google invokes a JS callback with (formatted_number, mobile_number) once a forwarding number is provisioned, and the code assigns mobile_number wherever it wants — including an <a> whose only child is an SVG. The call still routes through the GFN, so Google telephony still measures duration server-side, so an icon-only button DOES feed the Primary 60s conversion under this mechanism.

So: icon-only call CTAs are ineligible for the automatic text-node swap; they become eligible only via phone_conversion_callback with a post-hydration reapply. Absent that, they degrade to Secondary tap-only.

Three things to get right if a client adopts Mechanism 2:
Reapply AFTER hydration, not on DOMContentLoaded. On this template every route renders its page builder with client:load, so every tel: anchor lives inside a hydrated React island and a load-time-only patch races hydration. Use a MutationObserver on document.body. Guard with :not([data-gfn-applied]) so the pass is idempotent.
It fixes the always-mount problem rather than merely working around it. A conditionally-mounted call bar ({open ? … : null}) can NEVER be eligible under Mechanism 1 — it does not exist when the scanner runs. Under Mechanism 2 it is patched the moment it mounts. Where both apply, Mechanism 2 strictly dominates. Fixing the ternary per the always-mount rule above is still correct for accessibility and layout reasons; Mechanism 2 removes its tracking consequence.
GTM's built-in awcc tag template does not appear to expose phone_conversion_callback, so this likely needs a Custom HTML tag calling gtag('config', …). That is still inside the container and does not violate §13.5.1 — verify against the current GTM UI when building it.

GFN provisions ONLY for GCLID-carrying sessions — under BOTH mechanisms
A forwarding number is allocated only when the visitor arrives with a valid Google Ads click ID. Organic, direct, referral, and paid-social traffic dial the real line and generate NO duration data at all. The qualified-call metric is therefore structurally a Google-Ads-only subset, never an all-channel call count. Do not reconcile it against total lead volume across channels — the gap is a measurement artifact, not lost calls. Cross-channel call duration requires a pooled provider (CallRail, Twilio) that swaps for all traffic and pushes GCLID-keyed conversions back via offline import; that only earns its cost at multi-metro or multi-client scale.

GTM does not measure the 60 seconds — and this changes how it is QA'd
GTM only sees browser events, and the browser has no idea what happens after tel: hands off to the dialer. Duration is measured entirely server-side by Google Ads telephony because the call physically transits their number. GTM's only job in this path is loading the config that triggers the swap. Consequently "Calls from website" is NOT a GTM conversion with a GTM trigger, it never pushes a dataLayer event, and it will never appear in GTM Preview no matter how long you watch for it. Verify it by confirming the config tag fires and that a forwarding number actually renders on a real GCLID session — never by looking for an event. click_call (tap) and qualified_call_60s (duration) are two independent measurement systems that happen to describe the same phone call; their counts are not reconcilable.

Swap eligibility requires the element to EXIST at parse time (the always-mount rule)
The visible-text rules above cover elements the swap script can see. This rule covers elements it never gets the chance to see. The script scans the DOM shortly after load; an element that is conditionally mounted does not exist yet, is never scanned, and therefore never receives a forwarding number. It fails silently — no error, no console warning, and the element looks completely correct once it does appear, because the real number is rendered exactly as intended.

The failure case that shipped: a mobile menu overlay written as {mobileOpen ? (<div …>) : null}. It contained a full-width call bar with the number visible in a .phone-number span — swap-compatible by every rule above, and permanently ineligible in practice, because it did not exist when the scan ran. On mobile that was a primary call surface.

The working pattern — always mount, hide with a transform:
<div
  className={[
    "fixed inset-0 z-[100] bg-default-background",
    "transition-transform duration-200",
    open ? "translate-x-0" : "-translate-x-full pointer-events-none",
  ].join(" ")}
  inert={!open}
>
All four parts are load-bearing:
Always mounted — no ternary around the element. This is the whole point; it must be in the server-rendered DOM.
-translate-x-full, NOT display:none or visibility:hidden. Both of those make the text invisible to the swap script, which §8.9 already lists as swap-invisible — so they defeat the fix. A transform moves the element out of view while leaving its text rendered and matchable. Prefer translating LEFT: left-side overflow does not create a horizontal scrollbar the way right-side overflow can.
pointer-events-none while closed. Omitting this is catastrophic, not cosmetic: a fixed inset-0 z-[100] overlay sitting invisibly over the viewport intercepts every click on the site. Symptom is "nothing on the page is clickable", with no console error.
inert={!open} while closed. Keeps the hidden overlay's links out of tab order and out of the accessibility tree, which display:none did for free and a transform does not.

Verify with the static swap-eligibility audit above, not by opening the menu — the point is that the element is present BEFORE any interaction. Check the served HTML: curl the page and confirm the call bar's markup is there on a cold load with the menu closed.

Subframe baked-in button pattern
When a Subframe component renders a hardcoded <button> that cannot carry a tel: href or display the phone number, the fix is:
- Suppress it via [&_button]:!hidden on the Subframe component's className.
- Inject a proper <a href={PHONE_HREF}> with a .phone-number span inside an existing slot prop (e.g., paragraphs, description).
This is the pattern applied in serviceOnecaption-photoWrapper.tsx, where TallContentTruTemp's hardcoded Button was replaced. Never attempt to convert a Subframe <button> to a phone link via className overrides — the element type cannot change through CSS.

GA4 event name passthrough
The GA4 Event Router tag pattern used in this codebase binds its event name to {{Event}} — the literal dataLayer event key, forwarded verbatim with no rename step. The event name in GA4 is exactly what the code pushes to dataLayer. If code pushes event: "click_call", GA4 receives "click_call". GA4 key events, Ads secondary imports, and GTM trigger conditions must key on the exact event name in the taxonomy (§8.4), not a variant or alias. See client-scoped CLAUDE.md §3.6 for client-specific event naming notes.

Verifying call-swap coverage (the GCLID test)
The "Calls from website" swap activates only for ad-attributed sessions — a GCLID must be present on the URL. A plain direct visit will NOT swap the number, so a direct visit is not a valid test and its unchanged number is not evidence of failure.

DO NOT use a fabricated GCLID. An earlier version of this section instructed appending ?gclid=test123 to the URL and watching for the number to change. That test is invalid: Google validates the click ID before allocating a forwarding number, so a made-up value never swaps — on ANY page, swap-compatible or not. The test therefore cannot distinguish a working page from a broken one, and it returns a false "broken" every time. Following it produced a confident "this page's swap is broken" finding that triggered a full investigation before being traced back to the test method rather than the page. This is precisely the failure mode §9.12 warns about: acting on a measurement whose validity was never checked.

Valid ways to verify swap coverage, in order of preference:
GTM Preview — confirm the awcc tag ("Calls from website") fires on the page and reports no configuration error. This checks the tag path without needing an ad click, and is the practical everyday check.
A real ad click — click your own live ad, which produces a genuine GCLID and a real session. This is the only way to observe the rendered number actually change. Costs a click.
Static swap-eligibility audit — independent of any session, and the failure mode that is easiest to introduce accidentally: confirm each call element (a) is an <a href="tel:…">, (b) renders the configured number as visible text, and (c) EXISTS IN THE SERVER-RENDERED DOM at parse time. Point (c) is the one that bites — see the always-mount rule below.

Whichever method is used, check each page type that should track calls (home, service pages, city landings, contact) and, on mobile, the navbar icon and any sticky call bar — these render separately and must each be verified independently. Any surface failing the static audit is not swap-compatible regardless of what a session-based test shows (see the visible-number-text rule above and never-do §13.5.6).
This is the standard QA step after any call-button change and on every new client fork before launch.

8.10 Form-lead Google Ads conversion path
The generate_lead dataLayer event (§8.3) feeds Google Ads via a dedicated Google Ads Conversion Tracking (awct) tag in GTM, fired by a Custom Event trigger on the generate_lead event name. This is a direct GTM tag — the conversion is not imported from GA4.

A GA4-imported generate_lead action may also exist as a Secondary signal in the same conversion goal. The direct GTM tag is the sole Primary; the GA4 import is recorded but excluded from the Conversions column and the bid denominator.

Client-specific tag name, trigger name, conversion label, and goal structure are documented in client-scoped CLAUDE.md §3.6.

9. Page System Distinctions
This codebase has three distinct patterns for building pages. They differ in how content is sourced, how many instances exist, and how page builders compose wrappers. The distinction matters because each pattern has different rules for where content lives and what counts as a "new page" vs. a "new entry in an existing system."
9.1 The three patterns
Pattern
Used for
Source of truth
Page builder
One-off pages
Unique pages with bespoke layout (home, about, contact, offers, privacy)
The page builder file itself
One builder per page
Data-driven service pages
All service pages, sharing one layout pattern
servicePageData.tsx
ServicePageBLDR.tsx (single builder, iterates data)
Reusable city landing pages
City-specific landing pages, sharing one layout pattern
cityLandingData.tsx
CityLandingPageBLDR.tsx (single builder, iterates data)

The Astro routing layer is the same across all three: a file in src/pages/ (e.g. contact.astro, services/tree-removal.astro, durham.astro) wraps the appropriate page builder in <Layout> and sets SEO metadata. The patterns differ below the Astro file, not at it.
9.2 Pattern 1 — One-off page builders
One-off pages have no other pages like them. The home page is not "a type of page"; it's the home page. Same for about, contact, offers, privacy.
Structure:
Astro route: src/pages/{page}.astro — SEO frontmatter, <Layout> wrap, single page-builder import.
Page builder: src/components/websites/MedranosINC/pages/{Page}.tsx — composes wrappers directly, content hardcoded in the builder or in the wrappers' default prop values.
When to add a one-off page:
The page is genuinely unique (not "another service" or "another city").
No other page shares its layout or content shape.
The content rarely changes and lives well inside the builder.
When NOT to add a one-off page:
The page is one of several similar pages. Build a data-driven system instead, even if there are only two instances today.
The content is highly templated (intro + service-list + CTA + form). That's a system, not a one-off.
Content authority: the page builder owns the content. Wrappers have sensible defaults; the page builder overrides them via props when the page-specific copy differs from the default.
Hydration note: a one-off builder rendered with client:load per §9.8 makes its whole tree a single React island. That is the default and it is fine for most pages, but it has a measured LCP cost on pages whose largest above-fold element sits inside it — see §9.11 before adding sections below the fold.
9.3 Pattern 2 — Data-driven service pages
All eight service pages share one layout. They differ only in copy, slugs, tracking values, and contact-form identifiers. The system has three pieces:
servicePageData.tsx — the source of truth. A ServicePageData type definition, a servicePageData record keyed by service name (treeRemoval, stumpGrinding, etc.), and two shared content arrays (SHARED_BENEFITS, SHARED_PROCESS) that are identical across every service.
ServicePageBLDR.tsx — the renderer. Takes a ServicePageData prop, derives tracking context from it, composes the same wrapper stack with that data threaded through.
src/pages/services/{slug}.astro — one Astro route per service. Imports ServicePageBLDR, imports servicePageData, passes the right record into the builder.
Adding a new service:
Add a new entry to servicePageData in servicePageData.tsx with all the fields the type requires (slug, service, seoTitle, seoDescription, headingTitle, headingSubtitle, captionTitle, captionDescription, formId, formName, contactAnchorId).
Create src/pages/services/{slug}.astro that imports the builder and passes the new record.
That's the whole change. No new builder file, no new wrapper, no layout edits.
Shared content vs. per-service content: content that's identical across all eight service pages lives in SHARED_BENEFITS and SHARED_PROCESS inside servicePageData.tsx. Content that varies per service lives in the servicePageData record for that service. Don't move per-service content into wrappers and don't move shared content into per-service records — the split is load-bearing for the template-shared / per-client distinction (§4.5) and for keeping the data file as the single source of truth.
Tracking context derivation: the builder derives tracking values from the data record at the top of its function body:
tsx
const trackingService = normalizeTrackingService(page.service);
const trackingPageType = "service";
const trackingCity = "raleigh-durham";
const contactHref = `#${page.contactAnchorId}`;
trackingService is normalized via normalizeTrackingService(), not the local slugify() helper from other wrappers (these may serve overlapping purposes — see Medrano-scoped CLAUDE.md Open Items). trackingPageType is always "service" for this pattern.
trackingCity is currently hardcoded to "raleigh-durham". This is one of several per-client values that are repeated as inline constants across the codebase (alongside bodyClass per-route, the siteKey defaults in form wrappers, OFFER_PAGE_URL in OfferSavingsWrapper, and others). All of them are candidates for centralization via a client.config.ts constant — see Medrano-scoped CLAUDE.md Open Items for the joint refactor entry that groups them together. The current state is documented accurately; the refactor is tracked there.
9.4 Pattern 3 — Reusable city landing pages
All city-specific landing pages share one layout. The system mirrors Pattern 2 with different data:
cityLandingData.tsx — source of truth. A CityLandingPageData type and a cityLandingData record keyed by city name.
CityLandingPageBLDR.tsx — renderer. Takes a CityLandingPageData prop, derives tracking context, composes the city-landing wrapper stack.
src/pages/{city-slug}.astro — one route per city.
Adding a new city landing page:
Add a new entry to cityLandingData with all required fields (slug, city, seoTitle, seoDescription, heroTitleLine1, heroTitleLine2, heroSubtitle, formId, formName, contactAnchorId, centeredCopyMainTitle, centeredCopySubtitle, centeredCopyIntroDescription).
Create src/pages/{city-slug}.astro, import the builder, pass the record.
Tracking context derivation:
tsx
const trackingCity = normalizeTrackingCity(page.city);
const trackingService = "tree-service";
const trackingPageType = "city-landing";
const contactHref = `#${page.contactAnchorId}`;
trackingService is hardcoded to "tree-service" because city landing pages aren't service-specific. trackingPageType is always "city-landing". trackingCity derives from the data record via normalizeTrackingCity(), a helper that mirrors normalizeTrackingService()'s shape.
9.5 Shared composition shape
All three page-builder patterns compose wrappers in the same structural order:
NavbarMainWrapper (always first)
Hero variant (position fixed; specific wrapper varies by system)
[main content — varies by pattern]
FooterSection (always last)
Two composition rules are absolute:
NavbarMainWrapper is always the first wrapper in every page builder. It's the page-shell top. Omitting it produces a content-only page that visually breaks against the site's layout expectations.
FooterSection is always the last wrapper in every page builder. Same reason — it's the page-shell bottom.
The hero variant occupies a fixed position (immediately after the navbar, before the main content) but the specific wrapper varies by system:
One-off home page → HeroWrapper.tsx
City landing pages → Landing1HeroWrapper.tsx
Service pages → TitleHeadingBlock.tsx + ServiceONEHeroWithRatingsWrapper.tsx composed as the hero region (service pages have a two-wrapper hero because they carry both a title block and a hero-with-ratings band)
Other one-off pages (about, contact, offers, privacy) → varies per page; some use ActionHeroHeader.tsx, some use ContactHeroHeader.tsx, some have no distinct hero section
The position is fixed; the wrapper choice is system-specific. When adding a new page or new data-driven pattern, the hero region occupies the post-navbar slot — what fills it depends on the page's purpose.
Composition order is DOM order, and DOM order constrains hydration boundaries. A component nested in the middle of the builder cannot be lifted out to its own island without moving everything below it too, or the page visibly reorders. If a section is a candidate for deferred or zero hydration, its position in this stack determines how cheaply that can be done — see §9.11.
Within the main content section, wrappers are composed top-to-bottom in the JSX. The composition is declarative — the page builder reads as a manifest of "what sections appear on this page, in what order, with what props." No conditional rendering based on data values, no dynamic section ordering. The structural shape of a page is fixed at authorship time; runtime data only fills the slots.
Each wrapper receives the tracking context (trackingCity, trackingService, trackingPageType) as props, plus its own wrapper-specific trackingSection value. The flow follows §8.6 — tracking context is page-builder-derived and prop-passed, never read from a global.
9.6 Choosing the right pattern for a new page
The decision tree:
Is this a unique page that won't have siblings? → Pattern 1. Build a one-off page builder.
Is this one of several pages that share a layout, with content that varies in predictable, structured ways? → Pattern 2 or 3, depending on whether the variation is by service or by city. Add an entry to the relevant data file.
Is this a sibling of one of the existing systems, but with meaningfully different layout? → Add a new data-driven pattern. New data file, new builder, new astro routes per instance. Use Patterns 2 and 3 as templates for the file shape. When adding a new data-driven pattern, mirror the file shape of the closest existing system. Same data file structure (type definition + record + optional shared arrays), same builder shape (tracking context derivation at top, wrapper composition below), same routing pattern (one .astro file per instance, importing the builder and the data). Don't invent a new architecture; copy what works. New patterns that match existing patterns' file shapes are easier to recognize, easier to extend, and easier for Claude Code to reason about. Architectural variation across data-driven patterns is debt that future-you will pay.
Don't fork a one-off page builder to create a "new variation." That's the path that ends with seven near-identical builders that drift apart. If you're tempted to copy Medranos-About.tsx to make Medranos-Team.tsx, the answer is either (a) Team is genuinely a one-off too (fine, but write it from scratch), or (b) About and Team are the start of a system (build the data-driven pattern now).
9.7 Page-builder file naming
One-off builders: Medranos-{PageName}.tsx (e.g. Medranos-Home.tsx, Medranos-About.tsx, Medranos-Contact.tsx). All one-off builders follow this convention without exception.
Data-driven builders: {System}PageBLDR.tsx (e.g. ServicePageBLDR.tsx, CityLandingPageBLDR.tsx). The BLDR suffix is the signal that this file is a renderer over a data file, not a one-off page.
Data files: {system}Data.tsx (e.g. servicePageData.tsx, cityLandingData.tsx). Same folder as the builder.
9.8 The Astro route layer
Astro routes are thin. Every route file in src/pages/ does four things and nothing else:
Imports Layout and the relevant page builder.
Defines an SEO metadata object (title, description — plus ogImage only when the page overrides the site-wide default).
Imports CLIENT and wraps the builder in <Layout>, passing all five props: title, description, ogImage, gtmId, bodyClass. Only title and description are hardcoded per route; the other three come from client.config.ts, so a fork edits them once rather than per route (§13.7.1).
Renders the builder with client:load so its interactive React parts hydrate.
astro
---
import Layout from "../layouts/Layout.astro";
import ContactPage from "../components/websites/MedranosINC/pages/Medranos-Contact";
import { CLIENT } from "../components/websites/MedranosINC/config/client.config";

const seo = {
  title: "Contact Us | Medrano's Tree Service | Raleigh–Durham Triangle",
  description: "Get a free estimate or schedule tree service…",
};
---

<Layout
  title={seo.title}
  description={seo.description}
  ogImage={CLIENT.seo.ogImage}
  gtmId={CLIENT.tracking.gtmId}
  bodyClass={CLIENT.theme.bodyClass}
>
  <ContactPage client:load />
</Layout>
Astro routes are not the place for content authoring, conditional logic, tracking decisions, or wrapper composition. Those belong in the page builder. The Astro file is a thin SEO + Layout shell.

9.9 Filesystem-derived slug arrays
Two exports live at the bottom of the data files and are always in sync with the actual .astro route files on disk:
SERVICE_SLUGS — exported from servicePageData.tsx, derived from import.meta.glob("../../../pages/services/*.astro").
CITY_SLUGS — exported from cityLandingData.tsx, derived from import.meta.glob("../../../pages/service-area/*.astro").
import.meta.glob is a Vite static-analysis feature: the glob pattern is resolved at build time and replaced with a static map of path → lazy-import function. Extracting the keys (file paths) and stripping the .astro extension gives a reliable slug array with no manual maintenance. Adding a new .astro route automatically includes its slug in the array on the next build.
The Astro-side boundary rule: React wrappers that need a list of available service or city slugs must receive the array as a prop passed from Astro frontmatter — never by importing SERVICE_SLUGS or CITY_SLUGS directly inside the wrapper. The data files are Vite-processed modules; the import.meta.glob call resolves safely there. But a React wrapper that imports it at module scope would import at the client bundle layer, where the glob is already resolved to a static object — functionally it would work, but it couples the wrapper to the routing layer and defeats the template's separation between per-client data and generic wrapper logic.
Passing the array as a prop keeps wrappers generic: a wrapper that renders a service list accepts serviceslugs?: readonly string[] as a prop and renders whatever it receives. The Astro page (or page builder) imports SERVICE_SLUGS and passes it down. The wrapper itself has no knowledge of the filesystem.
The per-record slug: fields in servicePageData and cityLandingData are not replaced by these arrays. They serve a different role: URL construction, form IDs, and tracking joins. The glob-derived arrays are a list view; the per-record slugs are the per-page data anchor. Both coexist.

9.10 Encoding sweep — required immediately after copying a client folder
Files copied from any prior client folder, or generated by AI writing tools, frequently contain two classes of character encoding errors that cause esbuild JSX parse failures at runtime. Both must be swept before the first npm run dev on any newly forked client.

Class 1 — Curly/smart quotes (U+201C " and U+201D "). AI tools and rich-text editors auto-convert straight ASCII quotes to typographic curly quotes. When these appear inside JSX string literals or as JSX attribute delimiters, esbuild rejects the file with: Expected "}" but found "word".

Class 2 — Mojibake em dashes. The UTF-8 encoding of an em dash (U+2014, bytes 0xE2 0x80 0x94) is sometimes written through a Windows-1252 code page, producing the three-character sequence â€" where the last character is U+201D (a curly close-quote). After the Class 1 sweep replaces U+201D with ASCII ", the sequence becomes â€" where the embedded " now prematurely terminates any JSX string that contains it — producing the same esbuild error at a different location.

Order matters: run the curly-quote sweep first, then the Mojibake sweep. Running them in reverse order leaves residual U+201D characters that the Mojibake sweep cannot find because it looks for the already-fixed three-byte sequence.

Run both PowerShell scripts below on the entire new client folder (src/components/websites/{NewClient}/) immediately after copying it, before making any other edits:

Step 1 — Curly/smart quote sweep:
$dir = "src/components/websites/{NewClient}"
$files = Get-ChildItem -Path $dir -Recurse -Include "*.tsx","*.ts","*.astro"
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $fixed = $content.Replace([char]0x201C, '"').Replace([char]0x201D, '"').Replace([char]0x2018, "'").Replace([char]0x2019, "'")
    if ($fixed -ne $content) {
        [System.IO.File]::WriteAllText($f.FullName, $fixed, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed curly quotes: $($f.Name)"
    }
}

Step 2 — Mojibake em dash sweep (run after Step 1):
$brokenEmDash  = [string]([char]0x00E2) + [string]([char]0x20AC) + [string]([char]0x0022)
$brokenBoxDraw = [string]([char]0x00E2) + [string]([char]0x0022) + [string]([char]0x20AC)
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $fixed = $content.Replace($brokenEmDash, [string]([char]0x2014)).Replace($brokenBoxDraw, [string]([char]0x2500))
    if ($fixed -ne $content) {
        [System.IO.File]::WriteAllText($f.FullName, $fixed, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed Mojibake: $($f.Name)"
    }
}

Symptom if sweep is skipped: esbuild reports Expected "}" but found "word" pointing to a line that contains a string literal. The word after the error location is the first token after the prematurely closed string. Run the sweeps, restart the dev server, and the error resolves.

9.11 Hydration boundaries and island splitting
§9.8's route pattern renders the page builder with client:load. That is the template default and it is the right starting point, but it has a documented performance cost that every fork inherits: client:load on the page builder makes the ENTIRE page — navbar through footer — a single React island that hydrates in one commit. Astro still server-renders the HTML either way, so content is present and discoverable immediately; what client:load controls is when React takes over.

The cost is concentrated on the LCP element. If the largest above-fold element (usually a hero image) sits inside that one island, it cannot paint while the main thread executes hydration for the whole tree, including sections far below the fold. Measured on Medrano's home page: the hero image finished loading in ~100ms but LCP element render delay was ~2,000ms — 86% of LCP spent holding a ready image.

The failure mode is bimodal, not linear. Image-paint and hydration-start race each other. Render delay lands in one of two tight bands — fast (~200ms, paint wins) or slow (~2,000ms, hydration wins) — with nothing in between. Jitter picks the winner, so single measurements are misleading. Measure with 6+ runs and report the fast/slow ratio, not a mean or median across both modes.

Directive selection, per component:
client:load — only for components with above-fold interactivity that must work on first paint. In practice: the navbar (mobile menu state).
client:visible — components that need React but are below the fold. Forms, carousels, anything with onClick or state a user cannot reach before scrolling. Hydration fires on intersection, which is before the user can interact.
No directive at all — components with zero hooks, zero state and zero handlers. These ship as static HTML with no client JS. Plain <a> elements carrying data-event attributes still track correctly, because the click bridge in Layout.astro (§8.1) is vanilla document-level delegation that does not depend on hydration.

Before removing or downgrading a component's directive, inventory its hooks explicitly. Click tracking survives de-hydration; anything implemented as a useEffect does not. A view_section IntersectionObserver inside a component rendered with no directive silently stops firing — no build error, no console warning, no visible symptom. Under client:visible it survives, because IntersectionObserver fires immediately on observe() when the target is already intersecting. Verify in GTM Preview rather than assuming.

Two structural constraints when splitting:
DOM order is fixed by file position. Astro renders siblings in source order, so a component extracted out of the middle of a builder lands wherever it is placed in the .astro file — not where it used to be. Extracting one mid-page section usually forces extracting everything below it too, or the page visibly reorders. Check order before splitting, not after.
Wrapper elements are usually redundant — but verify before dropping one. Wrappers in this codebase render their own root element with its own width class, so the builder's enclosing <section className="w-full"> can generally be dropped rather than recreated in the .astro file. Do NOT drop one carrying an id without running §6.6.1's anchor inventory first: some anchors exist only on the builder's wrapper, and removing it breaks every link to them with no build error. Check for nested landmark elements (<footer> inside <footer>) at the same time — the redundancy hides both problems.
astro-island does not affect layout. Astro ships astro-island,astro-slot,astro-static-slot{display:contents}, so additional sibling islands introduce no boxes and no whitespace gaps.

What island splitting does and does not buy. Splitting below-fold components off reduces total shipped JS and improves TBT. On Medrano's it improved TBT ~32% and cut the page-builder chunk 15%. It does NOT fix LCP render delay — and neither does de-hydrating the LCP element itself. See §9.12, which corrects an earlier claim in this section: hydration was never the dominant main-thread cost on this template.

9.12 MEASURE FIRST — hydration is usually not the bottleneck
This section exists because the opposite was assumed, acted on across three staged changes, and turned out to be wrong. Read it before proposing any hydration or island change for performance reasons.

The standing rule: measure BEFORE proposing a hydration fix, and measure two things, because two independent mechanisms dominate this template and neither one is hydration.
(1) Per-script main-thread attribution. Read the bootup-time audit's per-URL breakdown (scripting + scriptParseCompile per script). That single audit tells you which script actually owns the main thread.
(2) Preloaded image weight. Enumerate <link rel="preload" as="image"> in the SERVED HTML and sum the byte weights, then compare that total against the LCP image's own size. These links are not hand-authored — React 19's SSR emits one for every <img> that lacks loading="lazy", which silently puts below-fold decorative images on the critical path at highest priority. On Medrano's home page that was 15 images totalling ~2.6MB, of which the LCP image was ~6%. §9.13 covers the mechanism, the diagnostic command, and which fixes are reachable from a wrapper.
Both audits are in the same Lighthouse JSON / served HTML you already have, so there is no excuse for skipping either. §11.9 covers how to get a trustworthy measurement on this stack at all — it is harder than it looks, and a wide-spread environment will manufacture conclusions as readily as a skipped audit will.

Which one explains which symptom — this matters, because they are not interchangeable:
Main-thread time gates the LCP element render delay subpart. On Medrano's, ~2s of main-thread work matched a ~2,000ms render delay closely.
Preload bandwidth contention gates total LCP and FCP. Those were 14-18s and 6.8-8s respectively — far larger than 2s of main-thread work can explain, and consistent with ~2.6MB of high-priority image preloads on a ~184 KB/s throttled mobile connection.
So a render-delay problem points at scripts; an FCP-and-total-LCP problem points at preloads. Diagnose the subpart first, then pick the audit. An earlier version of this section said "the first performance question is a tag-loading question" — too narrow: it would send a fork to GTM when preload weight was the larger lever.

What the measurement showed on Medrano's home page, consistent across 5 runs and both before and after the island work:

Script                                   Main-thread time
gtag/destination (GA4 config)            ~390ms eval + ~34ms parse
gtm.js (GTM container)                   ~170ms eval + ~21ms parse
GTM + GA4 combined                       ~620-730ms
React runtime (_astro/client.*.js)       ~50-150ms
everything else                          ~40-100ms

GTM plus GA4 is roughly ten times the React runtime's cost. Total main-thread work was ~2.2s before the island work and ~2.0s after — because three stages of effort went into the 50-150ms slice while a ~650ms slice sat untouched.

How the wrong conclusion was reached, so it is not repeated: the original audit inferred that hydration was the bottleneck from unused-JavaScript totals (627 KiB), chunk sizes, and TBT. Those are all real numbers and all consistent with a hydration problem — but none of them attribute main-thread time to a specific script. The attribution audit was available in the same Lighthouse JSON the entire time and was never opened. Circumstantial bundle metrics are not causal evidence about the main thread.

What was actually tried, and what each produced:
Deferring three below-fold sections (footer to zero JS, gallery and contact form to client:visible): TBT -32%, chunk -15%, LCP render delay unchanged.
Rendering the LCP element's own component with no directive at all (hero fully static, verified by DOM path losing its ASTRO-ISLAND ancestor): script eval -130ms, LCP render delay unchanged — slow-mode median 1,965ms before, 2,022ms after, and the fast mode disappeared (2-of-6 fast → 0-of-6).
De-hydrating the navbar to drop the React runtime entirely: RULED OUT on this evidence, not deferred. The runtime it would remove is ~50-60ms.

Every fork inherits this same GTM + GA4 cost profile, because the tag setup is template-shared (§8). So on any fork, the first performance question is a tag-loading question, not a hydration question. Deferring GA4's config script is the largest single lever and — unlike gtm.js — carries no conversion dependency, because the Google Ads "Calls from website" number swap rides on gtm.js (§8.9). Treat gtm.js and gtag/destination as separable, and verify any change against production rather than a preview deployment, since the preview lacks the custom domain and the tag load profile may differ.

None of the island work was harmful and it is all still in place — the vanilla view_section observer is better tracking (it fires off server-rendered DOM before hydration, ahead of gtm.dom, where the React observers landed well after), the icon chunking removed real duplication, and the static hero ships less JS. It simply did not fix what it was aimed at.

9.13 React 19 preloads every non-lazy image — below-fold weight is NOT cheap
The mechanism: React 19's SSR emits <link rel="preload" as="image"> into <head> for every <img> it renders that does not carry loading="lazy". Nobody wrote those links. They are not visible in any wrapper, they do not appear in a component's JSX, and they are added on the server, so a client-side inspection of the React tree will not reveal them.

The consequence inverts the usual intuition. A below-fold decorative image is normally free until the user scrolls. Here it is fetched at HIGHEST priority during initial load, competing directly with the LCP element for bandwidth. "It's below the fold, so it doesn't matter" is false on this template, and a Lighthouse report that marks an image FCP/Unscored can still be describing something that is delaying LCP.

Measured on Medrano's home page: 15 preloaded images totalling ~2.6MB, of which the LCP image was ~6%. At the throttled mobile throughput Lighthouse uses (~184 KB/s) that is roughly 14 seconds of downloading. Before recompression the same set was over 7MB. An earlier audit had explicitly ruled the image payload out of scope as "below the fold, not in the LCP path" — that judgment was wrong, and it was wrong because of this mechanism.

The diagnostic, which takes one command and belongs BEFORE any hydration or script work (§9.12):
curl -s https://{domain}/ | grep -oE '<link rel="preload"[^>]*as="image"[^>]*>'
Sum the byte weight of what comes back and compare it against the LCP image alone. If the LCP image is a small fraction of the total, bandwidth contention is the problem and no amount of JS work will fix it.

Two levers, and they are not equivalent:
loading="lazy" on a below-fold <img> stops React emitting the preload at all, taking that image's initial-load cost to ZERO. This is the strong lever.
Recompression roughly halves the bytes but the image still preloads at high priority. Use it for images that must stay eager — the LCP image, the logo, anything above the fold — and to reduce the cost when lazy images eventually do load.
Never set loading="lazy" on the LCP element. It delays the one paint that matters and Lighthouse flags it specifically.

⚠️ PRELOADS DEDUPE BY URL, so the count is not the cost. Two components rendering the SAME image path emit ONE preload link between them. The consequence is a false negative: move or add a section that reuses an image already on the page, and the preload count does not move while the page has genuinely gained a duplicated picture. Observed exactly that on a route whose count stayed at seven across a section migration. A flat preload count is therefore NOT evidence that a change cost nothing — count `src` occurrences as well as `<link rel="preload">` lines, and treat a repeated URL as a content problem (the same photograph twice on one page) even though it is free in bytes.

The constraint that decides how much of this is reachable: loading is an HTML attribute, so on a Subframe-rendered <img> it is theme-tab-only (§7.1's ceiling). Wrapper-authored <img> elements can be fixed immediately; Subframe-rendered ones cannot be fixed from a wrapper at all. Split the preload list into those two groups first — that tells you what is available now versus what needs a sync.

10. Form Patterns
This codebase has four form wrappers. They differ in their structure (how much of Subframe they consume) but share one identical mechanic (event chain, honeypot, bot timing, API contract, payload shape, reset behavior). Think of form patterns as one mechanic with three structural variants — one of which (Variant A) is standard wrapping methodology applied to a Subframe form-layout parent.
10.1 Form inventory
Wrapper
Page type
Variant
Subframe usage
ContactFormWrapper.tsx
Home
B
Atom components only (TextField, TextArea, Button, DropdownMenu)
ContactInfoFormWrapper.tsx
/contact
A
Wraps Infoand_ContactForm parent + uses atom components for fields
LandingContactForm.tsx
City landings
A
Wraps AltContactForm2 parent; form fields are custom HTML
RightRailContactFormStickyWrapper.tsx
Service pages
C
Icons + IconWrapper only — no Subframe form components

All four wrappers live in src/components/websites/MedranosINC/sections/.
10.2 The three structural variants
Variant A — Wrap a Subframe form-layout parent component. Standard wrapping methodology (§6) applied to a form-layout parent. The wrapper consumes a Subframe parent like Infoand_ContactForm or AltContactForm2 and fills its slot props (title, description, form, disclaimer, etc.). The form fields inside the form slot are custom React state-managed inputs — the Subframe parent provides layout, the wrapper provides form logic. The form slot accepting custom React is normal slot prop behavior (§6.5), not a deviation from methodology.
This is the preferred pattern for new contact forms when a suitable Subframe parent exists. Variants B and C below are deviations from standard methodology, used only when Variant A doesn't fit.
Variant B — Compose Subframe atom components without a parent (deviation from §6). The wrapper builds its own section layout with HTML + Tailwind (no Subframe layout parent), but uses Subframe atom components for the form fields: TextField, TextArea, Button, DropdownMenu. The atoms preserve Subframe's design system at the field level even though the surrounding layout is bespoke.
Use this variant when no Subframe parent layout fits the design intent but field-level styling consistency with the rest of the site matters.
Variant C — Custom React, no Subframe form components (deviation from §6). The wrapper hand-rolls everything: layout, inputs, button, status messages. The only Subframe imports allowed are icon utilities (FeatherMessageCircle, SubframeCore.IconWrapper) and typography classes (text-heading-1, font-heading-1, text-default-font).
This is the most extreme departure from the wrapping methodology and should be used only when neither a Subframe parent nor atoms support the form's structural requirements (e.g. sticky-rail layouts, highly custom card chrome, deep interaction state).
10.3 The shared mechanic (applies to all four wrappers)
Variants differ structurally; the form mechanic is identical. Every form wrapper must implement:
Event chain (§8.3) — form_start → form_submit_attempt → form_submit_success | form_submit_error → generate_lead, with ref-guarded fire-once semantics.
Honeypot field named company, hidden via <div className="hidden"> with tabIndex={-1} and autoComplete="off". On non-empty submit, fake success, reset, return early. No tracking events fire on honeypot trips.
Bot timing — startedAtMsRef set on first focusin, sent in the API payload as started_at_ms. If a submission arrives without it set, fall back to Date.now() - 3000 so the server-side check has a value.
API endpoint — POST to /api/contact, expects { ok: true } | { ok: false, error: { code, message } }.
Reset behavior — successful submission clears all field state AND the ref guards (hasStartedRef, hasSubmittedRef, startedAtMsRef) so a second submission in the same component instance re-fires the chain.
RightRailContactFormStickyWrapper.tsx is the canonical implementation of the shared mechanic. When in doubt, mirror its event-handling logic (not its structure — that's Variant C, which is the exception).
10.4 The /api/contact payload contract
The API accepts:
ts
{
  site: string;            // client identifier — see client CLAUDE.md
  name: string;            // .trim()'d
  email: string;           // .trim()'d
  phone: string;           // .trim()'d
  address?: string;        // .trim()'d; some forms collect, some don't
  message: string;         // .trim()'d
  service_type: string;    // see field-set notes below
  company: string;         // honeypot — must be empty
  started_at_ms: number;   // bot timing
  // Optional fields that some forms include:
  zip?: string;            // some forms collect, some don't
  property_type?: string;  // some forms collect ("residential" | "commercial")
}
Response: { ok: true } on success, { ok: false, error: { code, message } } on failure. Wrappers check res.ok && data?.ok === true.
service_type resolution rules:
Forms with explicit service selection (dropdown or clickable cards): use the selected value (e.g. "Tree Service"). Use "(not_selected)" literal when nothing has been chosen yet.
Forms without service selection (RightRailContactFormStickyWrapper): fall back to trackingService || formName.
This is the one field whose source varies per form. Other fields are standard.
name resolution: most forms collect a single name field. Some forms split it into firstName and lastName separately and join them with a space before sending. The API only sees the joined form.
Per-wrapper field set: which fields each specific form wrapper collects (some include zip, some include property_type, some have the first/last name split, etc.) is a business-decision concern that varies per client. See client CLAUDE.md for the per-wrapper field inventory — root CLAUDE.md documents the contract the API accepts; client CLAUDE.md documents which fields each wrapper actually collects.
The endpoint sends transactional email via Resend. Wrappers treat it as opaque — they do not import Resend, format email bodies, or know about delivery.
10.5 Honeypot + bot timing — details
Two-layer defense, both required on every form.
Honeypot — client-side silent rejection. Hidden field named company, wrapped in <div className="hidden"> with tabIndex={-1} and autoComplete="off" so legitimate users can't see or focus it. On submit, if company.trim() is non-empty:
Fake success state (setStatus("success"))
Call reset() to clear fields and refs
Return early without POSTing
Do not fire form_submit_attempt, form_submit_error, or any other tracking event. Bots should look invisible to analytics — emitting any event lets them probe whether their submissions register.
Bot timing — server-side input. startedAtMsRef.current is set to Date.now() on the form's first focusin event. It's sent in the API payload as started_at_ms. If a submission arrives without startedAtMsRef.current being set (no focus ever occurred — bot programmatic submission), set it to Date.now() - 3000 as a fallback so the API has a value to work with. The server's policy on what counts as "too fast" lives in /api/contact itself, not in the wrapper.
10.6 Required wrapper props
Every form wrapper exposes this minimum prop interface, even if some props are unused on its page type. Consistency lets page builders pass the same prop bag regardless of which form is being rendered.
ts
interface FormWrapperProps {
  id?: string;
  className?: string;
  title?: React.ReactNode;

  // Form identity
  formId?: string;            // also used as data-form selector and event payload
  formName?: string;          // human-readable, e.g. "Service Page Contact"
  siteKey?: string;           // client identifier — see client CLAUDE.md

  // Tracking context — flows down from page builders (§8.6)
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
  pageSlug?: string;          // present on service/landing variants
}
Individual wrappers may add content-override props (e.g. ContactInfoFormWrapper adds description; LandingContactForm adds badgeLabel, servicesHeading, serviceItems[]). These are wrapper-local extensions, not part of the shared contract.
formId must be unique per form instance on a page. Two forms on the same page need two different formId values, or the focusin listener will fire for both.
10.7 Form root selector — data-form is canonical
The focusin listener needs a DOM scope so it only fires for its own form. Two patterns exist in the codebase:
Canonical: data-form="{formId}" on the wrapper's outermost element, scoped via document.querySelector('[data-form="${formId}"]'). Used by RightRailContactFormStickyWrapper.tsx and LandingContactForm.tsx.
Legacy: id={id} on the wrapper root, scoped via document.getElementById(id). Used by ContactFormWrapper.tsx and ContactInfoFormWrapper.tsx.
Both work. The data-form pattern is preferred because:
It's coupled to formId, which is already used in event payloads and as a uniqueness key. One identifier, one purpose.
It works whether data-form is on the wrapper root or on a nested element (LandingContactForm puts it on a <div> inside the section).
id is a generic attribute used for anchor links, ARIA, and many other purposes — overloading it for form scoping creates collision risk.
New form wrappers should use data-form. The two legacy getElementById wrappers are not required to migrate, but if they are edited substantially, switching to data-form is the upgrade path.
The wrapper's outermost element also carries the standard tracking attributes (data-section, data-city, data-service, data-page-type) for the global click bridge. data-form is separate from data-section and must not be removed or consolidated.
10.8 Submission state contract
All wrappers track three local state values for UI feedback:
status: "idle" | "success" | "error"
errorMsg: string
isSubmitting: boolean
The submit button is disabled while isSubmitting, and its label flips to "Submitting...". Success renders a brand-colored confirmation message inside the form. Error renders the error message in red without resetting the form (the user can fix and retry without re-typing).
The reset() (or resetFormFields() + manual ref clears) helper is required. Without it, the second submission in the same component instance will not re-fire the event chain because the ref guards stay tripped. Two implementation patterns exist:
reset() clears fields and ref guards together (RightRailContactFormStickyWrapper, LandingContactForm).
resetFormFields() clears fields only; ref guards (hasStartedRef, hasSubmittedRef) are cleared separately after success (ContactFormWrapper, ContactInfoFormWrapper).
Either is acceptable. Pick one and apply it consistently within a single wrapper.
10.9 Optional client-side validation
Client-side validation is optional. Two forms have it (ContactFormWrapper, ContactInfoFormWrapper); two don't (RightRailContactFormStickyWrapper, LandingContactForm). Server-side validation in /api/contact is authoritative either way.
When client-side validation is implemented, follow the clientErrors useMemo pattern from ContactFormWrapper.tsx:
ts
const clientErrors = useMemo(() => {
  const errs: string[] = [];
  if (!name.trim()) errs.push("Name is required.");
  if (!phone.trim()) errs.push("Phone is required.");
  if (!email.trim()) errs.push("Email is required.");
  if (!message.trim()) errs.push("Message is required.");
  return errs;
}, [name, phone, email, message]);
And in the submit handler, after form_submit_attempt fires but before the fetch:
ts
if (clientErrors.length) {
  setStatus("error");
  setErrorMsg(clientErrors[0] ?? "Please check your form fields.");
  pushToDataLayer({
    event: "form_submit_error",
    /* ...full tracking payload... */
    reason: "client_validation",
  });
  return;
}
Key rules:
form_submit_attempt must fire before validation runs. A validation failure still counts as intent to submit.
form_submit_error fires with reason: "client_validation" so GTM can distinguish client-side validation failures from server-side or network errors (which use reason: error.code or similar).
Validation only runs after the honeypot check passes. Honeypot trips silently succeed; validation failures emit a tracked error.
If a new form does not need client-side validation, omit the clientErrors block entirely. Don't add a vestigial empty array.
On the pushToDataLayer calls in this validation pattern: they're an example of when manual pushes are appropriate (validation is a synthetic event, not a real DOM click — the global click bridge can't see it). The broader rule for when to push manually vs. when to rely on the click bridge is documented in §8.8.

11. Plan Mode & Edit Permissions
This section documents the interaction rules for Claude Code working in this repo. The rules below establish where Claude Code should operate in plan mode (propose before edit) vs. accept mode (edit directly), and which directories or file types are off-limits to direct edits regardless of mode.
The goal is to make Claude Code a useful collaborator without creating churn from speculative edits to load-bearing files. The architecture in this codebase has specific patterns that are easy to "improve" in ways that break the per-client templating, the Subframe sync workflow, or the tracking taxonomy. Plan mode for those edits is the guard.
11.1 Default mode by file category
Path / pattern
Default mode
Reason
src/ui/**
Forbidden
Subframe-generated, sync overwrites direct edits (§5)
src/components/websites/*/sections/**
Plan mode
Wrappers carry methodology constraints (§6, §7); edits should be reviewed before applying
src/components/websites/*/pages/**
Plan mode
Page builders compose wrappers; structure changes propagate widely
src/styles/global.css
Plan mode
Per-client token overrides + scoped fixes; specificity and cascade matter (§4, §7.5)
src/layouts/Layout.astro
Plan mode
Site shell; affects every route
src/pages/** (route files)
Plan mode
Layout props per §9.8; missing props produce silent failures
src/pages/api/contact.ts
Plan mode
Server-side, customer-facing emails, Resend integration
astro.config.mjs, tsconfig.json, package.json
Plan mode
Build configuration; changes affect all clients in the repo
.env.example
Plan mode
Onboarding artifact; reviewed change protects against silent env-var omissions in forks
Client-scoped CLAUDE.md files
Plan mode
Documentation drift between code and CLAUDE.md is the failure mode plan mode prevents
Root CLAUDE.md
Plan mode
Methodology source of truth; changes should be deliberate
public/**
Accept mode
Asset additions and replacements (logos, images, videos). Mechanical changes, no structural concerns.
public/coupons/**
Accept mode (with confirmation)
New coupon asset requires corresponding entry in COUPON_DOWNLOADS map in OfferSavingsWrapper.tsx (Medrano-scoped §3.5). The "with confirmation" framing reminds Claude Code to update both places.
Markdown content inside existing slot props
Accept mode
Copy edits, content updates inside wrapper composition; low-risk, high-frequency
Inline JSX content (text strings, headings) in builders
Accept mode
Content edits that don't change structure
New entries in data files (servicePageData, etc.)
Accept mode (with confirmation)
Additive changes; per-record content follows established field-shape patterns

The bar for accept mode is: the edit is content-substitution within an existing structural pattern, not a structural change to the pattern itself.
11.2 The forbidden category
src/ui/** is off-limits for direct edits in any mode. Plan mode doesn't help here — even a proposed edit is the wrong move because the authorized customization paths (wrapper composition, theme tab, scoped global.css) bypass src/ui/ entirely.
If a Claude Code session reaches a point where the proposed solution requires editing a file in src/ui/, that's a signal to stop and re-evaluate. The correct answer is usually:
"Customize via wrapper (§6)" — most cases.
"Customize via scoped global.css (§7.5)" — for selector reach the wrapper can't get.
"Edit the Subframe theme tab (§5.4)" — for structural changes that need to propagate.
None of those require a src/ui/ edit.
11.3 Plan mode in practice
When Claude Code is in plan mode for a category above, the expected interaction shape is:
Read the relevant files to understand current state.
Propose the change in chat — describe what would be edited, why, and any cross-file implications.
Wait for confirmation before applying.
Apply the change after explicit go-ahead.
Plan mode is not about latency — it's about giving the developer a chance to catch:
Architectural conflicts (e.g., an edit that fights the wrapping methodology in a way the developer wouldn't approve).
Missing context (e.g., an edit that looks correct in isolation but breaks an intentional pattern elsewhere in the codebase).
Cross-file ripple (e.g., an edit that requires updates in multiple places, where Claude Code's proposal only covers one).
Plan mode is most valuable in the first 5-10 turns of a session, when context-loading is still happening. Once the developer has established working patterns with Claude Code for a specific task, some categories may shift to accept mode for that session's remaining turns. This is conversational, not policy — the developer can say "proceed without asking" and accept mode resumes.
Plan mode cannot persist artifacts. It permits editing only the plan file, so any inventory, mapping or measurement produced during a plan-mode pass exists solely in the chat transcript — and context compaction can drop it. This is not hypothetical: a Q1-Q10 mapping had to be recovered from a 3.8 MB transcript JSONL to confirm it still existed, which is why PHASE2_DECISIONS.md was written. So: if a plan-mode session produces something durable — a CTA inventory, an anchor map, a baseline measurement, a decision record — the FIRST action after exiting plan mode is to write it to a file. Do not carry it forward in conversation and intend to write it later.
11.4 Accept mode in practice
When Claude Code is in accept mode for a category above, the interaction shape is:
Make the edit directly.
Report what was changed briefly — file, lines affected, summary of intent.
Flag any uncertainty if the edit revealed a question Claude Code couldn't answer from context alone.
Accept mode is right for:
Content edits inside existing slot props (e.g., "change the hero subtitle to ...").
Copy fixes inside builders or data files (e.g., "fix the typo in treeRemoval.captionTitle").
Adding a new entry to a data file when the entry follows the established field shape (e.g., adding a new service to servicePageData.tsx with all 11 required fields).
Renames inside the same file scope when the rename is mechanical (e.g., extracting a magic string into a SCREAMING_SNAKE_CASE constant).
Accept mode is NOT right for:
Anything that changes a wrapper's prop shape, even if the wrapper is the same file (prop shape is the public contract; changes propagate).
Anything that adds, removes, or renames module constants used by multiple files (§8.1 candidates in Medrano's-scoped CLAUDE.md).
Anything that touches override hierarchies (className arbitrary variants, ! markers, scoped global.css rules) — those have specificity implications worth reviewing.
Bundled operations rule. When a single conceptual operation requires changes across categories with different default modes, treat the whole operation as plan mode. The most-restrictive category sets the mode for the bundle. Example: adding a new service requires a new record in servicePageData.tsx (accept mode by default) AND a new route file in src/pages/services/ (plan mode by default). The route file's plan mode wins; the whole operation goes through plan mode. Without this rule, half-completed operations or two-stage workflows produce friction that defeats the per-category defaults.
11.5 Mode escalation triggers
A plan-mode category can escalate to "stop and discuss before proposing" — a tighter constraint than plan mode — when the edit touches one of these triggers:
Tracking taxonomy changes. New event names, new section values, new data-* attribute names. These propagate to GTM and to analytics queries; changes require coordinated updates in multiple places.
API payload contract changes. New fields in /api/contact POSTs, renamed fields, removed fields. Customer-facing emails and downstream CRM integrations depend on the contract.
Form structural changes (e.g., adding a new form variant, splitting an existing variant). Per §10 form patterns, the three variants are deliberate — a new variant is an architectural decision, not a routine edit.
Token system changes (theme.css slots, global.css overrides, new tokens, deleted tokens). Affect every wrapper that consumes the token.
The "stop and discuss" trigger is a hint that the work is bigger than it might first look. The discussion sets the right scope before edits start.
11.6 What to do when uncertain
If Claude Code can't tell which mode applies, default to plan mode. The cost of over-asking is low (one extra exchange); the cost of under-asking is potentially high (a regression that takes debugging to undo).
Specifically, default to plan mode when:
The file path isn't in the §11.1 table directly. New file locations may introduce new categories that haven't been defaulted.
The edit is described as "small" but touches a load-bearing file. "Small" doesn't always mean low-risk — a one-line change to a token value can have site-wide visual impact.
The conversation hasn't established the developer's preference for the current session. First-five-turns plan mode is the safe default.
After the developer's working style for the session is clear, adjustments to mode are conversational — the developer can say "accept mode for the rest of this section" or "back to plan mode for the next chunk of work." Claude Code follows along.

11.7 Verify commits in isolation before pushing
A passing build proves the WORKING TREE compiles. It does not prove the COMMIT compiles. When unrelated work sits uncommitted alongside the change being shipped — a partially-applied refactor, a new config key, a helper added but not staged — the build validates a state that will never exist in production. Splitting hunks out of a file to isolate a commit makes this worse, because the hunks left behind may be the ones the shipped code depends on.

This is not hypothetical. A wrapper was committed referencing CLIENT.service.trackingSlug while that config key existed only in an uncommitted refactor in the working tree. Every local build passed. Production served "Internal server error" on /privacy until it was found days later, because nothing verified the pushed state.

Before pushing any commit that touched a file which also carries unrelated uncommitted changes:
git stash -u          # park everything not in the commit
npm run build         # must pass
npx tsc --noEmit      # must pass, and must actually run (see below)
git stash pop         # restore the parked work
If either check fails, the commit is incomplete — a referenced symbol, config key, or import is missing from it. Fix the commit, do not fix the working tree.

Confirm tsc is actually running, not just exiting. tsc exits non-zero on config errors BEFORE type-checking any file, and a config error looks identical to "no type errors" if only the absence of file-level output is checked. tsconfig.json's ignoreDeprecations value must match the installed TypeScript major (5.9.x accepts "5.0"; "6.0" is rejected with TS5103 and silently disables all type-checking). If tsc --noEmit produces zero output, verify it is reporting on the tree — deliberately break a type and confirm it complains — before trusting a clean result.

11.8 Post-merge production sweep
After any merge to main deploys, confirm the deploy reached Ready, then sweep one route per page pattern and check BOTH status code and byte size. Status alone is insufficient: a route whose island throws during SSR still returns 200 with a near-empty shell (the /privacy failure returned 200 at 2,173 bytes against a healthy 36,000+). Byte size is what makes the failure visible.
for p in / /about /contact /privacy /offers /services/emergency-tree-service /services/tree-removal /service-area/durham-nc-tree-service; do
  printf "%-42s %s  %s bytes\n" "$p" \
    "$(curl -s -o /dev/null -w '%{http_code}' https://{domain}$p)" \
    "$(curl -s https://{domain}$p | wc -c)"
done
The eight routes cover all three page patterns (§9.1) plus every one-off page. Compare sizes against the previous sweep rather than an absolute threshold — an order-of-magnitude drop on one route is the signal. Follow with a spot-check that any newly tokenized or newly de-hydrated content actually rendered, since those fail silently too.

When a change alters <head> output or tokenized content, extend the sweep to grep for the specific value, not just size:
curl -s https://{domain}$p | grep -oE 'og:image" content="[^"]*"' | head -1
A wrong og:image, a stale theme class or a missing tracking attribute all produce a perfectly healthy 200 at full byte size. Status and bytes confirm the page rendered; only a grep confirms it rendered the NEW value.

11.9 Performance measurement protocol
Getting a trustworthy before/after on this stack is harder than it looks, and every constraint below cost real time to discover. Read this before running any performance comparison.

There is no local production-equivalent server. astro preview refuses to run under the Vercel adapter: "The @astrojs/vercel adapter does not support the preview command." The adapter emits Vercel's Build Output API format, which Astro's preview server cannot serve. The adapter is template-shared (§9.1), so every fork inherits this. Consequences: npm run build proves it COMPILES, not that it emits what you intended; to inspect rendered HTML (meta tags, island directives, tracking attributes) before pushing, use npx astro dev and curl it; and any real performance number requires a deployed preview.

Measuring a deployed preview:
Deployment Protection blocks preview URLs behind Vercel SSO. Pass the bypass as a header — x-vercel-protection-bypass: $SECRET — which is what Lighthouse's --extra-headers takes. In a browser, the query-param form needs BOTH params: ?x-vercel-protection-bypass=…&x-vercel-set-bypass-cookie=true. The bypass param alone does not set a cookie, so subresources (CSS, JS, images) still 401 and the page renders broken — a screenshot check will catch this where a status check will not.
Branch aliases do NOT auto-track the newest build. Re-point before every measurement (vercel alias set <deployment-url> <alias>) and confirm the alias serves the commit you think it does by grepping the served HTML for a hash or marker unique to that build. Skipping this measures the wrong commit and the numbers look perfectly plausible.
The PageSpeed Insights API has an unauthenticated quota of ZERO per day. It returns 429 RESOURCE_EXHAUSTED immediately, not after some allowance. Using it programmatically requires a free API key from Google Cloud Console.
Warm the URL with a throwaway request before each run set. Preview cold starts inflate TTFB and have nothing to do with the change under test.

Validating the environment before trusting any delta. A local Lighthouse run can produce garbage without saying so — antivirus interference and leftover chrome.exe processes produced a 12x LCP spread (3.0s to 36.0s) across identical back-to-back runs, and one run reported 11.7 seconds to download a 155 KB image, which is physically impossible. Before comparing stages, run the SAME unchanged build 3 times and confirm the spread is tight. If it is not, fix the environment (kill stray browser processes between runs; check AV) rather than averaging noise. Do not proceed on a wide baseline.

Reporting rules, because the headline metrics mislead here:
Render delay on this template is BIMODAL, not noisy. It lands in one of two tight bands — roughly 200ms when the image paint wins the race, roughly 2,000ms when script execution does — with nothing in between. Report the fast/slow RATIO plus a median PER MODE. A blended median across both modes describes a state the page never actually occupies.
At n=6 the sampling error on a proportion is about ±20 percentage points. A 2-of-6 to 4-of-6 shift is noise. Only a large move is readable.
Do NOT report LCP total as a result. It swung 14.8s to 18.3s across three identical runs, and it sits on a different measurement basis from the subparts (Lantern simulation vs observed trace), so mixing them produces false readings. Report the four subparts.
TBT and unused-JS are valid stage-to-stage, but do not compare them against production PSI figures — the environments differ too much. Render delay is the only metric that cross-compared cleanly (local runs landed within 3% of the PSI figure).

11.10 Visual and contrast verification — what getComputedStyle cannot see
§11.9 covers whether a PERFORMANCE number can be trusted. This section covers whether a VISUAL one can, and the answer is that the obvious tool is wrong more often than it is right.
getComputedStyle reports what a rule DECLARES on one element. It does not report what a pixel ends up looking like. Every case below produced a confident, plausible, wrong reading:
· A section whose tint and texture are painted by CHILD layers reports its own `background-color` — typically `rgb(255,255,255)`. A seam check between it and a white neighbour therefore concludes "white against white, draw a rule", and the rule then sits on top of a boundary that was already visible. Cost: a border added on that basis, then removed once a screenshot was taken.
· Text over a SCRIM over a PHOTOGRAPH reports the scrim's own colour as though the photograph were not underneath it. Contrast computed from that is meaningless; the real backdrop is the composite.
· A gradient whose alpha varies across x has no single backdrop value at all, so it cannot be composited by hand even if you know every layer.
Two methods that DO work:
1. Composite the real pixels. Draw the underlying image to a canvas, apply the overlay's colour and alpha in the same maths the browser uses, and take the BRIGHTEST resulting pixel as the worst case for white text (darkest for dark text). Exact when the overlay's alpha is uniform, and it needs no screenshot.
2. Hide the glyphs and sample the box. Set `visibility:hidden` on the text element, screenshot exactly its bounding box, and sample that clip — with the glyphs gone the whole clip IS the backdrop, so the extreme pixel is the worst case by definition. This is the ONLY method that handles a varying-alpha gradient, and it needs no knowledge of the layer stack at all. Prefer it whenever the backdrop is not a flat fill.
Report the WORST case, not the median. A headline crossing a bright patch of photograph fails on that patch regardless of how comfortable the average is.
And know which bar applies before declaring a pass: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold) and for non-text UI components. Enlarging type can therefore MOVE THE BAR as well as the measurement — a heading that grows past the large-text threshold gets easier to pass without its contrast changing at all.
Contrast is a property of the colour PAIR. Inverting the polarity of a failing pair changes nothing; the ground has to move.
⚠️ Verify the probe before believing the failure. This generalises §11.9's environment check to every kind of assertion, and on one client it accounted for roughly twenty false alarms — every one the harness rather than the site. Recurring causes: a dev server that had died (reads as a null-property error, or as "no sections found"); a selector that guessed a tag (`h2` for a title that is a `<span>`) and returned undefined, which reads as broken state; `querySelector` returning the FIRST of a desktop/mobile pair, so the hidden copy's zero-size box reads as a layout collapse; and bracketed class selectors such as `.max-w-[720px]`, which do not survive escaping through a debugger protocol and throw rather than matching. Before reporting a defect, confirm the probe can see a control it should see.
⚠️ Tailwind v4 sets some properties standalone, not through `transform`. `rotate-180` sets the CSS `rotate` property, so reading `.transform` returns `"none"` on a correctly rotated element. Same for `scale-*` and `translate-*`. Read the property the utility actually sets.
⚠️ Some things can only be caught by LOOKING. Text that overflows a container with `overflow-hidden` is clipped rather than scrolled, so `document.scrollWidth` stays clean while the line is visibly cut off at both edges — no measurement catches it. Take the screenshot as well as the numbers: measure to prove, look to notice.

12. Canonical Examples
This section embeds two complete wrapper files with annotations that walk through what each pattern demonstrates and which methodology sections / never-do rules apply. The two files were chosen because they collectively cover roughly 80% of the wrapping methodology surface area:
HeroWrapper.tsx (§12.1) — broad wrapping methodology outside the form context: slot-prop composition, tracking patterns including IntersectionObserver, section-id convention, nested helper components, conditional desktop/mobile rendering, className override patterns.
RightRailContactFormStickyWrapper.tsx (§12.2) — form pattern with no Subframe form-layout parent: full form event chain, sticky layout, page-context-driven service_type, data-form canonical pattern, server-side error handling.
The annotations reference §13 never-do rules and the methodology sections that establish them. Reading the embedded files alongside the annotations should give Claude Code a working mental model for new wrapper authorship in this codebase.
These files are the verification anchor for the rest of CLAUDE.md. If a section claims a pattern that the canonical examples don't follow, the canonical examples reflect the actual methodology — the section text is what's out of date. (Never-do rule §13.9.3.)
12.1 HeroWrapper.tsx walkthrough
File: src/components/websites/MedranosINC/sections/HeroWrapper.tsx
Subframe component consumed: Updatedherowithoffers (from @/ui/components/Updatedherowithoffers), with slot props headline, subheadline, primaryActionButton, offerCards.
Subframe atoms consumed (icons): FeatherMessageSquare, FeatherMail, FeatherDownload, IconWrapper — all from @subframe/core.
Page builders that compose it: Medranos-Home.tsx.
This wrapper sits at the top of the home page. It owns two sections: the main hero (with heading, phone CTA, primary quote CTA, and embedded desktop offer cards) and a mobile-only offer section that renders the same cards below the hero on narrow viewports. Both sections fire view_section tracking, via the vanilla observer in Layout.astro rather than a React effect.
Note what this file does NOT contain, because it is the point of the example: no hooks, no refs, no "use client". It is rendered with NO client directive at all (see src/pages/index.astro), which is only possible because its tracking is attribute-driven and its CTAs are plain anchors caught by the click bridge. It contains the page's LCP element, so keeping hydration off this subtree is deliberate — §9.11, §9.12.
Full file
import React from "react";
import { Updatedherowithoffers } from "@/ui/components/Updatedherowithoffers";
import {
  IconWrapper,
  FeatherMessageSquare,
  FeatherMail,
  FeatherDownload,
} from "@subframe/core";

const PHONE_HREF = "tel:+19193573376";
const DISPLAY_PHONE = "919-357-3376";
const SMS_HREF = "sms:+19193573376";
const EMAIL_HREF = "mailto:info@medranosinc.com";

/**
 * Future coupon landing page.
 * Safe to wire now; build the page later before production use.
 */
const COUPON_HREF = "/offers?action=print";

/**
 * Mobile hero background image path.
 * Place the team photo at public/images/hero-mobile-bg.jpg in your project.
 */
const MOBILE_HERO_BG = "/images/hero-mobile-bg.jpg";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export interface HeroWrapperProps {
  id?: string;
  className?: string;

  quoteHref?: string;

  trackingSection?: string;
  offersTrackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

function OfferActions({
  offerLabel,
  offersTrackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: {
  offerLabel: string;
  offersTrackingSection: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}) {
  return (
    <div className="mt-4 flex items-center justify-center gap-10 border-t pt-4 text-brand-primary">
      <a href={SMS_HREF}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-primary/80"
        data-event="click_text"
        data-label={`hero-offer-text-${offerLabel}`}
        data-section={offersTrackingSection}
        data-city={trackingCity}
        data-service={trackingService}
        data-page-type={trackingPageType}
      >
        <IconWrapper className="h-4 w-4">
          <FeatherMessageSquare />
        </IconWrapper>
        Text
      </a>

      <a href={EMAIL_HREF}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-primary/80"
        data-event="click_email"
        data-label={`hero-offer-email-${offerLabel}`}
        data-section={offersTrackingSection}
        data-city={trackingCity}
        data-service={trackingService}
        data-page-type={trackingPageType}
      >
        <IconWrapper className="h-4 w-4">
          <FeatherMail />
        </IconWrapper>
        Email
      </a>

      <a href={COUPON_HREF}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-primary/80"
        data-event="click_coupon_cta"
        data-label={`hero-offer-coupon-${offerLabel}`}
        data-section={offersTrackingSection}
        data-city={trackingCity}
        data-service={trackingService}
        data-page-type={trackingPageType}
      >
        <IconWrapper className="h-4 w-4">
          <FeatherDownload />
        </IconWrapper>
        Get Coupon
      </a>
    </div>
  );
}

function PercentBadge({ label }: { label: string }) {
  return (
    <div
      className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-brand-secondary px-3 py-1 text-sm font-semibold text-white shadow-md"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function OfferCard({
  badge,
  title,
  description,
  validThrough,
  offersTrackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: {
  badge: string;
  title: string;
  description: string;
  validThrough: string;
  offersTrackingSection: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}) {
  const offerLabel = slugify(title);

  return (
    <div className="relative flex h-full w-full max-w-[560px] flex-col justify-between rounded-xl border-2 border-dotted border-brand-secondary bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:w-1/2">
      <PercentBadge label={badge} />

      <div className="pr-14">
        <h3 className="text-xl font-semibold text-default-font">{title}</h3>
        <p className="mt-2 text-neutral-600">{description}</p>
        <p className="mt-4 text-sm text-neutral-500">{validThrough}</p>
      </div>

      <OfferActions
        offerLabel={offerLabel}
        offersTrackingSection={offersTrackingSection}
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />
    </div>
  );
}

function OfferCards({
  offersTrackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: {
  offersTrackingSection: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}) {
  return (
    <div
      className={[
        "mx-auto flex w-full max-w-[1280px] flex-col items-stretch justify-center gap-6",
        "px-6 md:flex-row md:px-10",
      ].join(" ")}
    >
      <OfferCard
        badge="20% OFF"
        title="Emergency & Storm Clean Up"
        description="Severe weather can cause unexpected tree damage and dangerous debris. Our certified crew responds fast to remove fallen trees and storm hazards safely. Save on emergency and storm clean-up services across the Triangle."
        validThrough="Valid through 04/05/2026"
        offersTrackingSection={offersTrackingSection}
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />

      <OfferCard
        badge="15% OFF"
        title="Your First Tree Service"
        description="We're so confident you'll be thrilled with our work that we offer exclusive pricing for your first visit. Join the hundreds of happy customers who trust us for all their tree needs. Your satisfaction is our priority!"
        validThrough="Valid through 04/01/2026"
        offersTrackingSection={offersTrackingSection}
        trackingCity={trackingCity}
        trackingService={trackingService}
        trackingPageType={trackingPageType}
      />
    </div>
  );
}

export default function HeroWrapper({
  id,
  className,
  quoteHref = "#home-contact",
  trackingSection = "hero",
  offersTrackingSection = "hero-offers",
  trackingCity = "raleigh-durham",
  trackingService = "tree-service",
  trackingPageType = "home",
}: HeroWrapperProps) {
  // No hooks, no refs, no effect. view_section tracking is opt-in via the
  // data-track-view attributes below, handled by the vanilla observer in
  // Layout.astro (§8.2 Mechanism A). That is what allows this component —
  // which contains the LCP element — to render with no client directive.

  return (
    <>
      {/* HERO SECTION */}
      <section
        id={id}
        className={["relative w-full overflow-hidden md:overflow-visible", className]
          .filter(Boolean)
          .join(" ")}
        data-track-view
        data-section={trackingSection}
        data-city={trackingCity}
        data-service={trackingService}
        data-page-type={trackingPageType}
      >
        <div className="relative min-h-[80vh] w-full overflow-hidden md:overflow-visible">
          {/* Desktop: video background */}
          <video
            className="absolute inset-0 hidden h-full w-full object-cover md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>

          {/* Mobile: static team photo background instead of video */}
          <img
            src={MOBILE_HERO_BG}
            alt="Medrano's tree service crew"
            className="absolute inset-0 h-full w-full object-cover object-bottom md:hidden"
          />

          <div className="absolute inset-0 bg-transparent md:bg-black/40" />

          <Updatedherowithoffers
            className="relative z-10 min-h-[80vh] w-full pb-10 pt-24 md:pb-40"
            headline={
              <span className="text-3xl font-bold md:text-5xl">
                Durham-Chapel Hill Tree Service You Can Trust
              </span>
            }
            subheadline={
              <div className="space-y-5">
                <p className="!text-white text-base font-medium md:text-lg">
                  Fast quotes, licensed & insured crews, and expert tree work across
                  the Triangle—serving NC since 2007.
                </p>

                <div>
                  <a href={PHONE_HREF}
                    className="inline-flex items-center gap-2 text-lg font-bold text-white underline underline-offset-4 md:text-xl"
                    data-event="click_call"
                    data-label="hero-plain-phone-link"
                    data-section={trackingSection}
                    data-city={trackingCity}
                    data-service={trackingService}
                    data-page-type={trackingPageType}
                    aria-label={`Call now ${DISPLAY_PHONE}`}
                  >
                    <span>Call Now:</span>
                    <span className="phone-number">{DISPLAY_PHONE}</span>
                  </a>
                </div>
              </div>
            }
            primaryActionButton={
              <a href={quoteHref}
                className="rounded-md border border-transparent bg-brand-primary px-6 py-3 text-base font-medium text-white transition-colors hover:border-brand-primary hover:bg-white hover:text-brand-primary"
                data-event="click_cta"
                data-label="hero-primary-get-a-quote"
                data-section={trackingSection}
                data-city={trackingCity}
                data-service={trackingService}
                data-page-type={trackingPageType}
              >
                Get A Free Quote
              </a>
            }

            offerCards={
              <div
                className="hidden md:block"
                data-track-view
                data-section={offersTrackingSection}
                data-city={trackingCity}
                data-service={trackingService}
                data-page-type={trackingPageType}
              >
                <OfferCards
                  offersTrackingSection={offersTrackingSection}
                  trackingCity={trackingCity}
                  trackingService={trackingService}
                  trackingPageType={trackingPageType}
                />
              </div>
            }
          />
        </div>
      </section>

      {/* MOBILE-ONLY OFFER SECTION */}
      <section
        className="block bg-white px-6 pb-16 pt-10 md:hidden"
        data-track-view
        data-section={offersTrackingSection}
        data-city={trackingCity}
        data-service={trackingService}
        data-page-type={trackingPageType}
      >
        <OfferCards
          offersTrackingSection={offersTrackingSection}
          trackingCity={trackingCity}
          trackingService={trackingService}
          trackingPageType={trackingPageType}
        />
      </section>

      {/* Desktop spacer */}
      <div className="h-0 md:h-[140px]" />
    </>
  );
}

Annotated walkthrough
Imports. "use client" is required because the wrapper consumes a Subframe component and uses React hooks (useEffect, useRef). The Subframe component import follows the granular @/ui/components/{Component} path per §3 — every wrapper uses this form. Icons come from @subframe/core, which is the Subframe runtime library (a separate import path from the generated components in @/ui/).
Module constants. Five constants at module scope: PHONE_HREF, DISPLAY_PHONE, SMS_HREF, EMAIL_HREF, COUPON_HREF. Plus MOBILE_HERO_BG for the mobile background image path. All follow SCREAMING_SNAKE_CASE per §6, and all six are candidates for the joint client.config.ts centralization in Medrano's-scoped CLAUDE.md — they're duplicated across multiple wrappers today.
The COUPON_HREF comment ("Future coupon landing page. Safe to wire now; build the page later before production use.") is the kind of inline note that should stay with the constant rather than migrate into a CLAUDE.md entry. It's specific to the constant's deployment state and would lose context if separated.
The local slugify helper. One of three slugify-equivalent helpers in the codebase (Medrano's Open Items inventories all three). Resolution is opportunistic per the open item — leave as-is during routine edits, audit during consolidation.
Helper components. Four helper components defined in the file before the main HeroWrapper export:
OfferActions — renders three CTAs (Text, Email, Get Coupon) with full tracking attributes. Used inside each OfferCard.
PercentBadge — renders the "20% OFF" / "15% OFF" badge positioned absolute in the top-right of each card. The pointer-events-none and aria-hidden="true" framing means the badge is decorative — it doesn't capture clicks or announce to screen readers.
OfferCard — renders a single offer card with badge, title, description, validity date, and OfferActions row. Calls slugify(title) to generate a per-card tracking label.
OfferCards — renders the two-card row (Emergency & Storm 20% OFF, First Tree Service 15% OFF). Used in both desktop and mobile rendering contexts.
The four helpers are co-located in the wrapper file because they're tightly coupled to this wrapper's content. Per §6.4, co-located helpers stay in the wrapper file unless they're genuinely cross-wrapper utilities — which these aren't. The offer cards' content (badges, titles, descriptions, validity dates) is hardcoded; if Medrano's needed to manage offers from data, the right refactor would be to lift the content into a data file (similar to servicePageData.tsx), not to relocate the helpers.
Tracking attribute propagation through helpers. Every helper function accepts and threads trackingCity, trackingService, trackingPageType props plus the relevant section name. This ensures every data-* attribute on every nested clickable element carries the right context for the global click bridge (per §8). Rule §13.5.3 forbids stripping these attributes — the helpers demonstrate the propagation discipline that keeps tracking complete.
Prop interface. Standard wrapper prop shape: optional id and className for the outer element, plus tracking-context props per §8.6 (with Medrano's-specific defaults like trackingCity = "raleigh-durham" — the value flagged for reconciliation in Medrano's Open Items). The quoteHref defaults to "#home-contact" to match the home page builder's anchor target.
No refs, no effect — view_section is attribute-driven. Three elements carry data-track-view alongside their existing data-section: the hero <section>, the desktop offers <div>, and the mobile offers <section>. The vanilla observer in Layout.astro (§8.2 Mechanism A) picks them up. Two things this demonstrates:
The desktop offers <div> and the mobile offers <section> both carry data-section="hero-offers". Only one is visible per breakpoint (hidden md:block vs md:hidden), but the vanilla observer dedupes on the section NAME rather than the element, so hero-offers cannot fire twice even if both were somehow visible. This is why Mechanism A needs no per-element guard refs.
This wrapper previously used Mechanism B — one observer, three refs, two fire-once guards, reading entry.target.getAttribute("data-section") to disambiguate. That was removed, not because it was wrong, but because it was the last thing forcing this component to hydrate. If you are reading an older copy of this file that still contains it, the current file is authoritative (§13.9.3).
The hero section element. The outer <section> carries id, data-track-view, data-section={trackingSection}, and the three tracking-context attributes. Per §6.6, the wrapper owns its own section element rather than relying on the Subframe parent to provide it.
The className uses ["...", className].filter(Boolean).join(" ") to merge wrapper-internal classes with consumer-provided ones safely. Without filter(Boolean), an undefined consumer className would produce "... undefined" in the final string.
Desktop video + mobile image background. The wrapper renders both backgrounds and uses Tailwind responsive utilities (hidden md:block, md:hidden) to show only one per viewport. The video has autoPlay muted loop playsInline preload="metadata" poster="..." — the standard accessibility-and-performance combo for decorative background video.
The <div className="absolute inset-0 bg-transparent md:bg-black/40" /> is the mobile-vs-desktop overlay pattern: transparent on mobile (where the image background carries text contrast on its own), 40% black on desktop (where the video needs darkening for text legibility).
Subframe parent composition. <Updatedherowithoffers> consumes four slot props:
headline — the H1-style heading text. Inline styled with text-3xl md:text-5xl font-bold.
subheadline — the subheading paragraph plus the phone CTA link below it. The !text-white on the <p> is an inline important override; per §7, this is rung 4 of the override hierarchy and is the right escalation here because the Subframe component's default subheadline text color (dark) conflicts with the dark video background.
primaryActionButton — the "Get A Free Quote" CTA. Hardcoded to use quoteHref from the wrapper's props.
offerCards — the desktop-only offer cards container, carrying data-track-view so the vanilla observer reports it.
Slot props are the public API of Subframe components per §6. Rule §13.3.2 forbids importing Subframe internals to bypass slot props — this wrapper demonstrates the canonical composition approach.
Phone CTA inside subheadline. The <a> tag with href={PHONE_HREF} fires click_call via data-event (caught by the global click bridge per §8.1). No manual pushToDataLayer needed — rule §13.5.4 reserves manual pushes for synthetic events.
Primary CTA with full tracking attribute set. The "Get A Free Quote" button has all five tracking attributes: data-event, data-label, data-section, data-city, data-service, data-page-type. The label hero-primary-get-a-quote is unique site-wide for analytics distinguishing this CTA from any other.
Mobile-only offer section. The second <section> outside the hero container, rendered only when md:hidden (below 768px), contains the same <OfferCards> component. The duplicate rendering (desktop offers inside the hero, mobile offers as a separate section below) keeps the two contexts laid out correctly while still tracking visibility for each independently.
Desktop spacer. The final <div className="h-0 md:h-[140px]" /> adds 140px of vertical space below the hero on desktop only. This is a layout-spacing concern that depends on the Subframe component's internal layout — without it, the hero overlaps the content below on desktop. A spacer like this is a valid wrapper-level fix per §6.
What this wrapper does NOT demonstrate
Form patterns. See §12.2.
Client-side validation. Heroes don't have form fields.
Effects of any kind. This wrapper has none — that is the point of it as an example. For the React useEffect observer (§8.2 Mechanism B), see any wrapper that must hydrate anyway, e.g. ReviewsCarouselWrapper or ServicesGridSectionWrapper.
12.2 RightRailContactFormStickyWrapper.tsx walkthrough
File: src/components/websites/MedranosINC/sections/RightRailContactFormStickyWrapper.tsx
Subframe atoms consumed (icons only): FeatherMessageCircle, IconWrapper (via SubframeCore) — both from @subframe/core. No Subframe form-layout parent is consumed. The wrapper builds its own form layout from custom JSX and Tailwind utilities, making it a hybrid: Subframe atoms for the icon, custom React for the form structure.
Page builders that compose it: ServicePageBLDR.tsx.
This wrapper is the conversion endpoint of every service page. It sits in the right rail of the two-column service-page layout, sticks to the top of the viewport on desktop scrolling via the sticky positioning passed by the consuming builder, and collects the minimal field set required to convert a high-intent service-page visitor.
Full file
"use client";

import React, { useEffect, useRef, useState } from "react";
import { FeatherMessageCircle } from "@subframe/core";
import * as SubframeCore from "@subframe/core";

type ApiOk = { ok: true };
type ApiErr = { ok: false; error: { code: string; message: string } };

export interface RightRailContactFormStickyWrapperProps {
  id?: string;
  className?: string;
  title?: React.ReactNode;
  cardMaxWidthClassName?: string;

  /** Form identity */
  formId?: string;
  formName?: string;
  siteKey?: string;

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
  pageSlug?: string;
}

function push(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer =
    (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer || [];
  (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer?.push(payload);
}

export default function RightRailContactFormStickyWrapper({
  id,
  className,
  title = "Request Your Free Estimate",
  cardMaxWidthClassName = "w-full lg:max-w-[420px]",

  formId = "service-contact-form",
  formName = "Service Page Contact",
  siteKey = "medranos",

  trackingSection = "service-contact-form",
  trackingCity,
  trackingService,
  trackingPageType,
  pageSlug,
}: RightRailContactFormStickyWrapperProps) {
  const startedAtRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildPayload = (event: string, extra?: Record<string, unknown>) => ({
    event,
    form_id: formId,
    form_name: formName,
    section: trackingSection,
    city: trackingCity,
    service: trackingService,
    page_type: trackingPageType,
    slug: pageSlug,
    ...extra,
  });

  /* form_start on first focus */
  useEffect(() => {
    const formRoot = document.querySelector(`[data-form="${formId}"]`);
    if (!formRoot) return;

    const form = formRoot.querySelector("form");
    if (!form) return;

    const onFocus = () => {
      if (!startedAtRef.current) startedAtRef.current = Date.now();
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      push(buildPayload("form_start"));
    };

    form.addEventListener("focusin", onFocus);
    return () => form.removeEventListener("focusin", onFocus);
  }, [formId, formName, trackingSection, trackingCity, trackingService, trackingPageType, pageSlug]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setMessage("");
    setCompany("");
    startedAtRef.current = null;
    hasStartedRef.current = false;
    hasSubmittedRef.current = false;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      push(buildPayload("form_submit_attempt"));
    }

    // Honeypot
    if (company.trim()) {
      setStatus("success");
      reset();
      return;
    }

    if (!startedAtRef.current) {
      startedAtRef.current = Date.now() - 3000;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: siteKey,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          message: message.trim(),
          service_type: trackingService || formName,
          company: company.trim(),
          started_at_ms: startedAtRef.current,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiOk | ApiErr | null;

      if (!res.ok || !data || !data.ok) {
        const msg = (data as ApiErr | null)?.error?.message || "Submit failed";
        push(buildPayload("form_submit_error", { error_message: msg }));
        throw new Error(msg);
      }

      push(buildPayload("form_submit_success"));
      push(buildPayload("generate_lead", { value: 1, currency: "USD" }));

      setStatus("success");
      reset();
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      setStatus("error");
      setErrorMsg(msg);

      if (msg === "Something went wrong") {
        push(buildPayload("form_submit_error", { error_message: msg }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "w-full rounded-md border border-neutral-200 bg-white px-4 py-3 " +
    "text-default-font placeholder:text-neutral-400 text-sm " +
    "transition-all duration-150 " +
    "focus:border-2 focus:border-neutral-900 focus:outline-none focus:ring-0 " +
    "focus-visible:border-2 focus-visible:border-neutral-900 focus-visible:outline-none focus-visible:ring-0";

  const labelClass = "text-sm font-medium text-default-font";

  return (
    <div
      id={id}
      data-form={formId}
      className={[cardMaxWidthClassName, className].filter(Boolean).join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div className="flex w-full flex-col items-start gap-2 rounded-lg bg-white shadow-md">
        <div className="flex w-full flex-col items-start gap-2">
          {/* Icon + Title */}
          <div className="flex w-full flex-col items-center gap-6 pt-6">
            <SubframeCore.IconWrapper className="text-heading-1 font-heading-1 text-default-font">
              <FeatherMessageCircle />
            </SubframeCore.IconWrapper>
            <span className="text-heading-1 font-heading-1 text-default-font text-center px-4">
              {title}
            </span>
          </div>

          {/* Form */}
          <div className="flex w-full flex-col items-start gap-4 px-4 py-4">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              {/* Honeypot */}
              <div className="hidden">
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Full Name</label>
                <input
                  placeholder="Enter your full name"
                  className={fieldClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Phone</label>
                <input
                  placeholder="Enter your phone number"
                  className={fieldClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Email</label>
                <input
                  placeholder="Enter your email"
                  className={fieldClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Address</label>
                <input
                  placeholder="Enter your address"
                  className={fieldClass}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>How Can We Help?</label>
                <textarea
                  placeholder="Tell us how we can help you..."
                  rows={4}
                  className={fieldClass}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={[
                  "w-auto inline-flex items-center justify-center mx-auto",
                  "rounded-full px-6 py-2.5",
                  "text-sm font-semibold text-white",
                  "bg-brand-primary border border-transparent",
                  "shadow-sm transition-all duration-300",
                  "hover:bg-white hover:text-brand-primary hover:border-brand-primary hover:shadow-md",
                  "disabled:opacity-60",
                ].join(" ")}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>

              {status === "error" && (
                <div className="text-sm text-red-600 text-center">{errorMsg}</div>
              )}

              {status === "success" && (
                <div className="text-sm text-brand-primary text-center">
                  Thanks! We'll reach out shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

Annotated walkthrough
Imports. "use client" required for hook usage. useEffect, useRef, useState from React. Two Subframe imports: FeatherMessageCircle directly, and * as SubframeCore for access to IconWrapper. The wildcard import pattern is used here to access the namespace; direct named imports work too and would be the more typical pattern. Either form is valid Subframe consumption per §5.
Discriminated union types for API response. type ApiOk and type ApiErr model the two response shapes from /api/contact. TypeScript narrows based on the ok boolean discriminator — once data.ok is checked, the type system knows whether data is the success or error shape. The pattern is good practice for handling remote API responses with typed shapes.
Prop interface — broader than HeroWrapper's. Twelve props, covering content (title, cardMaxWidthClassName), form identity (formId, formName, siteKey), and tracking context (trackingSection, trackingCity, trackingService, trackingPageType, pageSlug). The pageSlug prop is unique to this wrapper among form wrappers — it threads the per-service URL slug into the slug field of every tracked event, useful for downstream analytics joining events to specific service pages.
Rule §13.3.4 ("never change a wrapper's prop shape silently") applies broadly to the interface — twelve props means a larger attack surface for accidental breakage.
The push helper function. Module-level helper that safely pushes to window.dataLayer. Guards: typeof window === "undefined" (SSR safety — function does nothing if called server-side), and the standard dataLayer = dataLayer || [] initialization. The helper is local to this wrapper but could be lifted to a shared utility — currently inline because it's specific to this wrapper's event-firing patterns.
Default values for form identity props. formId = "service-contact-form", formName = "Service Page Contact", siteKey = "medranos". Per §10.6, page builders (ServicePageBLDR.tsx) always override these with per-record data from servicePageData.tsx — the defaults handle the no-override fallback case.
Rule §13.6.2 cautions about changing formId/formName without coordinating with analytics and Resend templates. The defaults are the safe baseline; overrides happen through the data records, not by editing the defaults.
State and refs. useState holds the form field values plus status (idle/success/error), errorMsg, and isSubmitting. useRef holds the timing (startedAtRef), the one-shot form-start guard (hasStartedRef), and the one-shot submit guard (hasSubmittedRef). Refs are used for values that shouldn't trigger re-renders when updated.
The buildPayload helper. Internal function that returns a consistent event payload shape with event name plus all the identity and context fields. Every tracking event in this wrapper goes through buildPayload to keep the payload structure uniform across the event chain. The ...extra spread lets specific events add their own fields (e.g., form_submit_error adds error_message; generate_lead adds value and currency).
The pattern is worth replicating in form wrappers that need multiple event fires. It's optional per §10 — the event chain mechanic doesn't require a centralized payload helper, but the helper reduces drift between events in practice.
Form-start tracking via focusin. The useEffect queries for the form's root element using [data-form="${formId}"] (per §10.7), then queries for the inner <form> element, then attaches a focusin listener. First focus → form_start event.
This is the canonical data-form pattern: the wrapper's outer element carries data-form={formId}, and event scoping queries against this attribute rather than getElementById. Per Medrano's Open Items, two other wrappers (ContactFormWrapper, ContactInfoFormWrapper) still use the getElementById legacy pattern; this wrapper is one of two using the canonical form.
The reset function. Centralizes form-state cleanup after successful submission. Clears all field values and resets the timing/guard refs. The function runs on success and on honeypot catch (silent bot drop).
The handleSubmit function — full event chain. Five-step flow:
Submit attempt event. First action: fire form_submit_attempt (once-only via hasSubmittedRef). This happens before validation or honeypot checks so that submission intent is tracked even for blocked submissions.
Honeypot check. If company.trim() is truthy (a bot filled the hidden field), silently succeed: set status to success, reset the form, return. No further events fire. The bot sees what looks like a successful submission; analytics shows the honeypot worked.
Bot-timing fallback. If startedAtRef.current is null (form_start never fired — likely a script submit), backdate the timestamp to "now minus 3 seconds" to avoid failing the server-side timing check.
API call. POST to /api/contact with the standard payload shape per §10.4. Includes site: siteKey (the routing discriminator — rule §13.6.3 forbids POSTing without it), field values, service_type: trackingService || formName (the page-context-driven service type flagged in Medrano's Open Items for the kebab-case bug), company (honeypot value passed through for server-side verification), and started_at_ms (timing token).
Response handling. Parse JSON, check res.ok AND data.ok. On success: fire form_submit_success and generate_lead. On error: fire form_submit_error with the error message, throw to the catch block. In the catch: set error state, show user-facing error message. The generic "Something went wrong" message triggers an additional form_submit_error fire — this is a duplicate-fire guard for the catch-block path; the explicit error path already fired form_submit_error with the API-provided message.
Rule §13.5.5 forbids changing the event chain order or naming. This wrapper is the canonical reference implementation — modifications elsewhere should mirror this structure.
The service_type: trackingService || formName line. This is where the kebab-case slug bug lives. trackingService is the kebab-case slug (e.g., "tree-removal"), and that slug is what the API receives. The API then renders it into customer-facing emails verbatim — customers see "Service: tree-removal" instead of "Service: Tree Removal." The fix documented in Medrano's Open Items: pass page.service (display name) as a new prop from ServicePageBLDR.tsx and use it here instead of trackingService.
fieldClass and labelClass as JS string constants. The two field-styling utilities are extracted as module-scope-like constants inside the component (declared just above the return). This keeps the JSX cleaner — every <input> and <label> references the same shared style instead of duplicating the long utility class strings. The pattern is a wrapper-local convenience; it doesn't relate to any methodology rule, just practical readability.
Form rendering with data-form attribute. The outermost <div> carries id, data-form={formId}, className, and the four tracking context attributes (data-section, data-city, data-service, data-page-type). The data-form attribute is the canonical scoping pattern per §10.7 — the focusin listener queries against it; rule §13.5.3 forbids stripping it.
Honeypot field. Rendered inside a <div className="hidden"> wrapper, plus tabIndex={-1} and autoComplete="off" on the input itself. Bots fill it via auto-completion or label heuristics; users never see or tab through it. The submitted value flows to handleSubmit's honeypot check. Rule §13.6.1 forbids removing the honeypot.
Form fields. Five standard fields: name, phone, email, address, message (textarea). All use the shared fieldClass and labelClass styling. Per §10.4, the field set is intentionally minimal — service pages are conversion-optimized and field friction reduces conversion. No client-side validation is applied; server-side validation in /api/contact is authoritative per §10.9.
Submit button. Disabled when isSubmitting is true to prevent double-submission. The label flips between "Submit" and "Submitting..." based on state. The button is styled with a multi-line className={[...].join(" ")} array for readability — common pattern when className strings get long.
Inline status messages. Below the button, the status state drives either an error message (red, centered, from errorMsg) or a success message (brand-primary color, centered, hardcoded "Thanks! We'll reach out shortly."). The success state replaces no UI — the form stays rendered after a successful submission, just with the success message appended below. Re-submission is possible (refs are reset in the reset() function), though analytics will see the second submission as a separate form-start → form_submit_attempt → form_submit_success chain.
The inline-message pattern is different from a hard form replacement. Both are valid per §10; this wrapper's choice reflects a UX call (user can see what they submitted while the "thanks" message shows).
What this wrapper does NOT demonstrate
Subframe form-layout parent composition (Variants A and B). See ContactInfoFormWrapper.tsx, LandingContactForm.tsx (Variant A) and ContactFormWrapper.tsx (Variant B) per Medrano's §6 form inventory.
Client-side validation. This wrapper opts out; ContactInfoFormWrapper.tsx is the example of the optional client-validation pattern per §10.9.
Dropdown-selection tracking (manual pushToDataLayer for portaled DropdownMenu items). The form wrappers on Home and Contact pages demonstrate this pattern; see Medrano's §6 for cross-references.
12.3 What the two canonical examples don't cover
Two areas of methodology aren't represented in §12.1 or §12.2:
Variant A and B form patterns. Both examples show variants where Subframe form parents are NOT consumed. Cross-reference Medrano's §6 inventory for wrappers demonstrating Variant A (ContactInfoFormWrapper, LandingContactForm) and Variant B (ContactFormWrapper).
Effects on Subframe stateful components. Components like DropdownMenu render in portals and require manual event pushes (per §8.8 manual-push rule). The examples here don't consume portal-managed Subframe components.
These gaps are intentional. Adding a third canonical example would push §12 past readability; the two examples above plus cross-references to other wrappers via Medrano's inventory cover the rest.
view_section tracking is half-covered. §12.1's HeroWrapper demonstrates Mechanism A — attribute-driven, three opted-in elements, two tracked section names, no hooks. Mechanism B (the React useEffect observer, still correct for components that must hydrate anyway) has no canonical example here; read §8.2's spec plus any hydrated wrapper such as ReviewsCarouselWrapper.


13. Never-Do List
This section consolidates the never-do rules scattered across §4-§11 into one scannable inventory. Each entry is a single line stating the rule, with a cross-reference to the methodology section that establishes it. The list serves two functions:
Quick reference for Claude Code when about to make a decision that might violate methodology. If the proposed edit appears on this list, stop and re-evaluate.
Verification anchor for §12 canonical examples. The annotations in §12 reference these rules rather than restating them, keeping the rules in one place where corrections only need to happen once.
The list is grouped by methodology area for findability. Within each group, rules are ordered by severity (most-disruptive violations first).
13.1 Subframe and src/ui/
#
Rule
Section
13.1.1
Never edit any file in src/ui/ directly. Subframe sync overwrites direct edits.
§5.2
13.1.2
Never change C2 token values (--color-default-background, --color-default-font) in the Subframe theme tab. These slots are intentionally overridden in global.css per client.
§5.5
13.1.3
Never inline styles from theme.css into wrappers for "encapsulation." Token resolution depends on the theme.css → global.css cascade.
§5.7
13.1.4
Never delete files from src/ui/. Subframe sync auto-manages this directory; layouts/ and index.ts are unused but not dead. Removal happens through the Subframe theme tab.
§5.7
13.1.5
Never add types or helpers to src/ui/utils.ts. Subframe's type generation reflects the theme tab — corrections happen there, not in the generated file.
§5.7
13.1.6
Never run npx @subframe/cli sync with uncommitted wrapper work that depends on Subframe component shape. Commit first so git checkout src/ui/ can revert a problematic sync.
§4.4, §5.6
13.1.7
Never add npx @subframe/cli sync to package.json build scripts or Vercel build commands. Sync is a developer workflow step, not a build step.
§4.4

13.2 Token system and styling
#
Rule
Section
13.2.1
Never edit src/ui/theme.css to change a token value. Edit the slot in the Subframe theme tab, then sync. For per-client overrides, edit src/styles/global.css.
§4, §5.2
13.2.2
Never use raw color values (hex codes, RGB) in wrappers when a brand or neutral token applies. Tokens are the per-client layer; raw values defeat the templating.
§4
13.2.3
Never put client-specific copy in the Subframe theme tab. Subframe components are content-agnostic; content lives in wrappers, builders, or data files.
§5.4
13.2.4
Never edit wrappers to fix token values that need updating site-wide. The override layer is global.css. Wrapper-level changes don't propagate; global.css does.
§4

13.3 Wrapping methodology
#
Rule
Section
13.3.1
Never modify Subframe components to expose new slots or behavior. Use wrapper composition first (§6); escalate to theme tab only when wrapper customization can't reach the need.
§6
13.3.2
Never bypass slot props by importing Subframe component internals directly. Slot props are the public API; internals are implementation.
§6
13.3.3
Never invent a new form variant pattern in a single PR. The three variants (A/B/C) are deliberate. A new variant is an architecture decision worth discussing first.
§10
13.3.4
Never change a wrapper's prop shape silently. Prop shape is the public contract — changes require coordinated updates across every consumer.
§6, §11.4
13.3.5
Never compose a wrapper without preserving its data-section, data-city, data-service, and data-page-type attributes. These flow through the click bridge and into every analytics event.
§8
13.3.6
Never use single-letter or numeric-suffix conventions for new wrapper files. Naming follows the *Wrapper.tsx convention without versioning suffixes. The _v1_1 and _2_0 patterns flagged in Medrano's Open Items are historical residue, not models to follow.
§6.10
13.3.7
Never import SERVICE_SLUGS or CITY_SLUGS directly inside a React wrapper. These arrays are derived via import.meta.glob and live in Vite-processed data files — importing them in a wrapper couples the wrapper to the routing layer. Wrappers that need a slug list accept it as a prop; the Astro frontmatter imports the export and passes it down.
§9.9
13.3.8
Never edit a wrapper's default prop value assuming it's what renders. Check first whether the composing page builder always passes an override for that prop (e.g. serviceOnecaption-photoWrapper.tsx's headline/paragraph defaults are always overridden by ServicePageBLDR's page.captionTitle/page.captionDescription) or whether the value is a module-level export with zero consumers (e.g. servicePageData.tsx's SHARED_BENEFITS/SHARED_PROCESS — see DUPLICATE.md Step 6). Editing an unreachable default produces a correct-looking diff with zero rendered effect.
⚠️ AND THE INVERSE, which is the more expensive half. A default that READS as unreachable placeholder data IS the shipping value whenever the builder passes NO prop at all. The rule above trains you to assume defaults are dead; that assumption is what lets a previous client's copy, or a path to a file that does not exist, sit live on every route of a page type while looking like scaffolding. Four instances surfaced in a single session on one client: a hero wrapper whose `backgroundImage` default pointed at a file that had never existed (a 404 preloaded at high priority on six routes); a benefits section the builder rendered with NO PROPS AT ALL, so its defaults were the live copy on seven routes; a caption wrapper whose `image` default was likewise a 404 on seven routes; and a FAQ wrapper whose `items` default served the previous client's questions on a live page.
So the check runs BOTH ways, and it is a two-line grep: find the default, then find every call site and confirm whether that prop is passed. If no consumer passes it, the default is not a default — it is the content, and it belongs under the same review as any other copy. The strongest structural fix is to make the field REQUIRED on the data type with no default at all, so omitting it is a TypeScript error rather than a silent fallback.
§6.5, §9.3

13.4 Override hierarchy
#
Rule
Section
13.4.1
Never use ! important markers without checking the rung above first. The override hierarchy escalates: slot prop → className → arbitrary variant → ! → scoped global.css → Subframe slot. Skipping rungs produces specificity wars.
§7
13.4.2
Never add a scoped global.css rule without commenting the "why." Future-you needs to know which Subframe component fights the rule and what removing it would break.
§7.5
13.4.3
Never write an [&_…]:! arbitrary-variant cluster of 5+ overrides on a single className without escalating to scoped global.css (§7.5) or a new Subframe slot (§7.6). The cluster is a smell, not a solution.
§7.8

13.5 Tracking and analytics
#
Rule
Section
13.5.1
Never bypass GTM by firing events directly to GA4 or Google Ads. GTM is the single source of truth. Direct fires create dual-write inconsistencies.
§8
13.5.2
Never invent a new tracking event name without adding it to the taxonomy. The taxonomy lives in §8.4. Unlogged events break analytics queries.
§8
13.5.3
Never strip data-event, data-label, data-section, data-city, data-service, or data-page-type attributes from a wrapper's JSX. The global click bridge in Layout.astro depends on them.
§8
13.5.4
Never push events manually via pushToDataLayer for sources that are real DOM clicks. The click bridge catches them automatically. Manual pushes are reserved for portaled content (e.g., DropdownMenu) and synthetic events (§8.8).
§8.8
13.5.5
Never change form event chain order or naming (form_start → form_submit_attempt → form_submit_success / form_submit_error → generate_lead). The chain is uniform across all forms; downstream reporting depends on it.
§10.3, §8.3
13.5.6
Never render a call button as icon-only, "Call Now" text-only, or with the number hidden via sr-only/display:none if it needs to feed Google Ads "Calls from website" (awcc) qualified-call tracking. The swap script matches visible rendered number text equal to the client's configured number — href, aria-label, and hidden text are all invisible to it. Icon-only and hidden-number buttons silently drop the qualified-call signal with no error. Swap-compatible buttons render {DISPLAY_PHONE} as visible text in a .phone-number span inside an <a href={PHONE_HREF}>. See §8.9 and the GCLID test method.
§8.9
13.5.7
Never hardcode a phone number string or tel: href in a wrapper. Use PHONE_HREF / DISPLAY_PHONE sourced from CLIENT.contact (client.config.ts). Hardcoded strings survive template forks unchanged; config constants adapt automatically.
§6.3, §8.9

13.6 Forms
#
Rule
Section
13.6.1
Never remove the honeypot field from a form wrapper. It catches automated bot submissions; removing it doubles spam load on Resend.
§10
13.6.2
Never change a form's formId or formName without coordinating with downstream analytics and Resend templates. These values flow into event payloads and email subjects.
§10.6
13.6.3
Never POST to /api/contact without siteKey. The discriminator routes the submission to the right client backend; missing it means the request can't be routed.
§10.4
13.6.4
Never weaken or remove client-side validation rules without checking server-side coverage. Server-side validation in /api/contact is authoritative, but client-side validation provides UX feedback that matters for conversion.
§10.9

13.7 Page builders and routing
#
Rule
Section
13.7.1
Never omit any of the five <Layout> props on a new route file (title, description, ogImage, gtmId, bodyClass). Missing props produce silent failures — tracking that doesn't fire, themes that don't apply, SEO that doesn't render, social shares with no preview image. Only title and description are hardcoded per route; ogImage, gtmId and bodyClass come from client.config.ts, so pass ogImage={CLIENT.seo.ogImage} unless the page deliberately overrides it.
§9.8
13.7.2
Never put content or wrapper composition inside an Astro route file. Routes are thin SEO + Layout shells. Content and composition belong in the page builder.
§9.8
13.7.3
Never edit shared content arrays (SHARED_BENEFITS, SHARED_PROCESS in servicePageData.tsx) by moving them into per-record fields. The split between shared and per-record is load-bearing.
§9.3
13.7.4
Never refactor the three page-system patterns (one-off pages, data-driven service pages, reusable city landings) into a unified system. Each pattern is right for its use case.
§9

13.8 Configuration and environment
#
Rule
Section
13.8.1
Never expose server-only environment variables to client code by adding the PUBLIC_ prefix. Resend API keys, contact emails, and other server-only values stay non-PUBLIC_. Exposing them leaks credentials to every page visitor.
§8.7, Medrano's §4.3
13.8.2
Never modify astro.config.mjs settings that are documented as load-bearing (output: "server", the Vercel adapter, the React integration, Tailwind v4 via Vite plugin) without understanding what breaks.
Medrano's §4.8
13.8.3
Never set ignoreDeprecations to a value the installed TypeScript does not accept. The correct value for the 5.9.x line is "5.0". An earlier version of this rule named "6.0", which TypeScript 5.9.3 rejects with TS5103 — and because tsc exits on a config error BEFORE type-checking any file, that single wrong string silently disabled all type-checking. It is how a reference to a non-existent config key reached production. Re-check this value on any TypeScript upgrade and confirm tsc still reports on the tree per §11.7's canary check.
Medrano's §4.8
13.8.4
Never set environment variables in code instead of via .env or Vercel. Code-set env vars don't propagate to production builds and aren't reviewable through the standard env-var workflow.
Medrano's §4.3
13.8.5
Never commit .env files. Local environment values are gitignored for a reason; committing them exposes credentials to anyone with repo access. .env.example (without values) is the right artifact to commit.
Medrano's §4.3

13.9 Documentation and CLAUDE.md
#
Rule
Section
13.9.1
Never edit root CLAUDE.md casually. It's the methodology source of truth. Changes should be deliberate and reflect actual code-level evolution.
§11.1
13.9.2
Never restate values from client-scoped CLAUDE.md inside root CLAUDE.md. Client-specific values stay in the client-scoped file; root stays methodology-only.
§1
13.9.3
Never assume root CLAUDE.md and a wrapper file disagree on methodology. When they appear to, the wrapper usually reflects the methodology correctly and CLAUDE.md may be out of date — verify before "fixing" the wrapper to match CLAUDE.md.
§1
13.9.4
Never resolve Open Items entries by editing the entry rather than the underlying code. Open Items track real codebase states; editing the entry without fixing the code creates documentation drift.
Medrano's §8

13.10 Forking and multi-client
#
Rule
Section
13.10.1
Never edit template-shared files to address a client-specific need. Template-shared files don't need per-client edits. The change probably belongs in global.css or a client-scoped file.
Medrano's §9.5
13.10.2
Never copy values from Medrano's-scoped CLAUDE.md directly into a new client's scoped file without verifying each value applies to the new client. Inherited config is a common source of cross-client bleed.
Medrano's §9.2
13.10.3
Never push to main without verifying the four environment variables are set in the target Vercel project. Missing variables cause silent /api/contact failures — no email, no error visible to users.
Medrano's §4.7, §9.2
13.10.4
Never run npm run dev on a newly forked client folder without first running both encoding sweep scripts (§9.10). Skipping the sweep produces esbuild JSX parse errors on the first page load. The errors look like code bugs but are purely encoding artifacts from the copied source files — the sweep resolves them entirely.
§9.10
13.10.5
Never ship a forked client to production without updating the SEO title and description in every .astro route file. These fields are hardcoded per route and are not derived from client.config.ts. Leaving them unchanged means the new client's site serves the previous client's SEO metadata — a launch-blocking error that does not surface during local dev.
§4.6
13.10.6
Never delete a folder inside a freshly created fork without first confirming its contents. A template copy can nest the entire template under {NewClient}/Frame-sites/, and deleting that "stray" folder deletes the actual site.
DUPLICATE.md Step -1
13.10.7
Never carry template copy containing factual claims — licensure, insurance, certifications, ratings, review counts, years in business, service area, availability/response times, crew size, warranty terms — into a new client fork unchanged. What was true of the previous client becomes false of the new one when left in place; the fix is removal, not rewording. Unsupported claims survive in SEO metadata (per-route seo.description in .astro files) as well as in wrapper copy — both need the audit.
DUPLICATE.md Step 6, Step 9

Using this list
When proposing or applying an edit, the implicit question is: does the edit appear on §13? If yes, stop and re-evaluate using the cross-referenced section. The list is not exhaustive — new patterns will surface — but the categories above cover the major axes of methodology violations that the codebase has accumulated rules around.
When a never-do rule appears to conflict with a real edit need, the conflict is usually one of:
A different methodology applies than the rule assumes. Example: the rule says "never edit src/ui/," but the real need is theme tab work + sync, which doesn't violate the rule.
The rule has a documented escape hatch in the methodology section. Example: §13.4.1 forbids ! markers without checking the rung above, but §7 documents when ! is the right answer after the rungs have been considered.
If the rule appears stale, raise the question rather than acting on the assumption. The path forward is to discuss the conflict and update CLAUDE.md if needed, not to silently bypass the rule based on a stale-rule assumption.
When in doubt, default to following the rule and discussing the need rather than acting unilaterally.

End of root CLAUDE.md.
