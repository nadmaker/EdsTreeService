/**
 * LandingServicesListWrapper — "Services We Offer" on the six city landings.
 *
 * NEW 2026-09-01. SPLIT OUT OF CenteredCopyAreaWrapper by request: that
 * section carried a header block (eyebrow → title → intro → CTA) and this
 * services list below a hairline, and the two are now separate sections.
 * The header half keeps the `centered-copy` name and its CTA; this half is
 * everything from the "Services We Offer" heading down.
 *
 * ⚠️ THE 720px MEASURE IS SHARED WITH ITS NEIGHBOUR AND IS LOAD-BEARING.
 * Everything in the old combined section ended at x=800 at 1440, and that
 * alignment was asked for explicitly. Splitting is exactly the change that
 * breaks it, because the two halves now set their own containers — so this
 * file repeats the neighbour's geometry EXACTLY: `max-w-[1280px]` outer,
 * `max-w-[720px]` inner, `px-6 md:px-10`. Change one and you must change
 * both, or the section acquires a second right edge — the specific defect
 * the 720px measure was introduced to fix.
 *
 * 720px rather than a `ch` value on purpose: `ch` scales with font-size, and
 * the neighbour's caption is 18px where this copy is 16px, so the same
 * `62ch` resolves to 704px and 620px — a near-miss that reads as a mistake.
 *
 * SURFACE. White, same as the header section above it, so the split is
 * structural rather than visual — the page looks as it did. The hairline
 * that used to divide the two halves inside one section is kept here as the
 * top border, so the boundary is still legible now that the two are
 * separated by section padding rather than a margin.
 *
 * ⚠️ If this section is ever given a TINTED ground (#F5F8FB) to make the
 * split visible, the CARDS MUST FLIP TO WHITE in the same edit. They are
 * currently tinted-on-white; tinted-on-tinted disappears. That pairing is
 * the inverse of why-choose-us directly above, which is white-on-tint.
 *
 * TRACKING. New section name `landing-services`, NOT a reuse of the home
 * page's `services`. Those are different sections despite the similar
 * content: home's grid is a set of LINKS emitting select_service per card,
 * while these are static <li> with no href and no events. Conflating them
 * would put two different interaction models under one name. This section
 * emits view_section and nothing else.
 *
 * Mechanism A — no hooks, no "use client", no @subframe/core, zero client
 * JS. Do NOT add a useEffect observer alongside data-track-view.
 *
 * ⚠️ THE DEFAULTS BELOW ARE THE LIVE COPY. CityLandingPageBLDR passes no
 * `serviceItems`, exactly as it passed none to the combined section before
 * the split. Root §13.3.8 cuts both ways — a default that reads as
 * unreachable placeholder data is what all six city landings serve.
 */

import React from "react";
import { SERVICE_ICONS } from "./serviceIcons";

export interface LandingServiceItem {
  /**
   * Service slug — the key into SERVICE_ICONS, added 2026-09-02 when this
   * list gained icons.
   *
   * ⚠️ REQUIRED, deliberately, so omitting one is a TypeScript error
   * rather than a card that silently renders without a picture. Root
   * §13.3.8's structural fix, applied at the point the field was added
   * rather than after a defect.
   *
   * ⚠️ AND IT IS PASSED, NOT DERIVED. Slugifying `title` would work today
   * — "Roof Replacement" → "roof-replacement" — and is the wrong call:
   * serviceIcons.tsx keys by slug precisely so a consumer holding a slug
   * cannot pair it with the wrong drawing, and a derived key throws that
   * away. It would also make a COPY EDIT silently drop an icon, which is
   * the same class of coupling root §8.5 records for
   * normalizeTrackingService: a marketing rename moving a technical value
   * with nothing in the diff to show it.
   *
   * Typed `string` rather than a union because SERVICE_ICONS is itself
   * Record<string, …>, so a union here would be a second copy of the key
   * list, free to drift from the real one. A wrong slug therefore fails at
   * RUNTIME by rendering no icon — visible in the served HTML, which is
   * where this is verified.
   */
  slug: string;
  title: string;
  description: string;
}

export interface LandingServicesListWrapperProps {
  id?: string;
  className?: string;

  title?: React.ReactNode;
  intro?: React.ReactNode;
  items?: LandingServiceItem[];

  /** Tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

/**
 * ⚠️ CLAIMS. An "Emergency Response" entry was removed from this list when
 * the city landings were rebuilt on 2026-09-01 — it was the last surviving
 * 24-7 string on the site, and MUST NOT SHIP on two counts: EBS has no
 * emergency line (CLIENT.contact.emergencyPhoneDisplay is deliberately
 * empty) and the CLAIMS REGISTER bans emergency / 24-7 / after-hours copy
 * outright. Do not reinstate it.
 *
 * Gutter Cleaning and Roof Installation are omitted only to keep this to
 * five — both are reachable from the contact form's cards and the navbar.
 *
 * Descriptions are sourced from servicePageData's captionDescription copy,
 * so they say what the service pages say.
 */
const defaultItems: LandingServiceItem[] = [
  {
    slug: "roof-replacement",
    title: "Roof Replacement",
    description:
      "Full tear-off and rebuild when a roof is past repairing, including deck inspection, new underlayment, and haul-away of the old material.",
  },
  {
    slug: "roof-repair",
    title: "Roof Repair",
    description:
      "Targeted fixes for leaks, wind damage, missing shingles, and failed flashing, most of them handled the same day we come out.",
  },
  {
    slug: "metal-roof-installation",
    title: "Metal Roof Installation",
    description:
      "Standing seam and metal panel roofing built for eastern North Carolina weather, with a service life well past asphalt.",
  },
  {
    slug: "siding-installation",
    title: "Siding Installation",
    description:
      "New siding on homes and commercial buildings, including tear-off, moisture barrier, and trim work.",
  },
  {
    slug: "gutter-installation",
    title: "Gutter Installation",
    description:
      "Gutters and downspouts sized and pitched to move water away from the foundation.",
  },
];

export default function LandingServicesListWrapper({
  id,
  className,
  title = "Services We Offer",
  intro,
  items = defaultItems,
  trackingSection,
  trackingCity,
  trackingService,
  trackingPageType,
}: LandingServicesListWrapperProps) {
  /* Conditional on trackingSection, so a consumer that supplies no context
     emits nothing rather than a section whose city/service/page_type are all
     undefined — which is worse than silence, because it looks like data. */
  const tracking = trackingSection
    ? {
        "data-track-view": true,
        "data-section": trackingSection,
        "data-city": trackingCity,
        "data-service": trackingService,
        "data-page-type": trackingPageType,
      }
    : {};

  if (!items?.length) return null;

  return (
    <section
      id={id}
      className={[
        "w-full bg-white",
        /* ⚠️ RETUNED 2026-09-01, TWICE IN ONE DAY, and the history is
           the point: this section's top spacing has to match whatever is
           actually above it, and that changed twice.

           First it ran pt-0, because the header section it was split from
           sat directly above with 96px of its own bottom padding — a top
           pad as well stacked with that and the hairline into ~200px of
           void. Then centered-copy was MOVED above the offer carousel, so
           the neighbour became the why-choose-us band, whose padding is on
           an inner element (its own section box reports padding 0). pt-0
           against that left the content almost touching the boundary.

           Now py-16 / md:py-20, which stands on its own regardless of what
           precedes it. Re-check the seam after any reorder rather than
           trusting this value. */
        "px-6 py-16 md:px-10 md:py-20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...tracking}
    >
      {/* Geometry mirrors CenteredCopyAreaWrapper exactly — see the header
          comment. Both halves must keep the same two containers. */}
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="w-full max-w-[720px]">
          {/* ⚠️ THE HAIRLINE WAS REMOVED 2026-09-01 when centered-copy
              moved above the offer carousel. It existed to divide two
              adjacent WHITE sections — this one and the header block it
              was split from. The neighbour above is now the why-choose-us
              band, which is tinted and textured, so the ground already
              changes at that boundary and a rule sitting on top of a
              luminance step reads as muddle rather than structure.

              ⚠️ Found by LOOKING. getComputedStyle reports
              why-choose-us' background as rgb(255,255,255), because its
              tint and texture are painted by child layers rather than by
              the section's own background-color — so a computed-style
              check says "white above white, keep the rule" and is wrong.
              Same trap this section's neighbour comment already records.

              If this is ever placed under a plain-white section again, the
              rule has to come back. */}
          <div>
            {title ? (
              <h2 className="font-heading-1 text-2xl font-bold text-default-font md:text-3xl">
                {title}
              </h2>
            ) : null}

            {intro ? (
              <p className="mt-3 text-base leading-relaxed text-neutral-600">
                {intro}
              </p>
            ) : null}

            {/* TWO COLUMNS at md, to a supplied reference. Cards stay INSIDE
                the shared 720px measure rather than widening to the 1280px
                container: nothing in this run crosses that right edge, and
                widening only the card grid would reintroduce the
                two-right-edges problem the measure was introduced to fix.
                Each card is therefore ~352px at md and up.
                One column below md — 352px is already the narrow end for a
                title plus three lines of copy, and half of a phone is not a
                card. */}
            <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((item, index) => {
                /* An odd-length list leaves the final card alone in the left
                   column with a hole beside it. Span it instead, so the grid
                   closes flush at any count — the list ships five today and
                   the count is a content decision that will move. Same
                   treatment as the landing form's service picker.
                   These <li> are DIRECT children of the grid (root §6.5), so
                   the span lands on the right box; it would silently do
                   nothing if a wrapper div were introduced between them. */
                const spanLast =
                  index === items.length - 1 && items.length % 2 === 1
                    ? "md:col-span-2"
                    : "";

                return (
                  <li
                    key={index}
                    /* TINTED fill, not white. The card treatment elsewhere on
                       the site is a white card (why-choose-us above, the home
                       services grid), but both of those sit on a NON-white
                       ground. This section's ground is white, so a white card
                       would have only its border to read by. Filling with
                       --color-default-background (#F5F8FB) inverts the pair
                       deliberately: tinted cards on white here, white cards
                       on tint directly above.
                       ⚠️ If this section's ground ever changes, re-check this
                       fill — the two are a pair, and a tinted card on a
                       tinted ground disappears.

                       HOVER — a full fill flip, to a supplied reference.

                       ⚠️ THE FILL IS brand-primary-HOVER (#1376B4), NOT
                       brand-primary (#1685CC), and that is a contrast
                       decision rather than a shade preference. White on
                       brand-primary measures 3.99:1 — it FAILS AA for normal
                       text and passes only as large text, and this card's
                       description is 16px regular. brand-primary-hover
                       measures 4.91:1 with white and clears AA outright. It
                       is also the semantically correct token for a hover
                       state.

                       ⚠️ BOTH the title and the body go PURE WHITE. Softer
                       tints were measured and none survive: brand-100 gives
                       4.17:1, brand-200 3.56:1, white at 90% opacity 4.28:1
                       — all below 4.5:1. Do not "soften" the body copy here.

                       The border flips with the fill so the card does not
                       keep a pale outline once it goes solid. */
                    className={[
                      "group rounded-lg border border-neutral-200 bg-default-background p-6",
                      "transition-colors duration-200 motion-reduce:transition-none",
                      "hover:border-brand-primary-hover hover:bg-brand-primary-hover",
                      spanLast,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {/* ICON + TITLE on one row, description below at the
                        card's full width — the arrangement in the supplied
                        reference. `items-center` so the disc stays centred
                        against a title that wraps to two lines, which
                        "Metal Roof Installation" does in the ~248px left
                        after the disc and gap.

                        ⚠️ THE GLYPHS ARE NOT NEW ART. SERVICE_ICONS already
                        ships on this same page twice — in the services grid
                        and in the contact form's picker — so this section
                        was the only one of the three without them. Drawn
                        inline rather than imported because @subframe/core's
                        Feather set has no roof, no siding and no gutter
                        glyph; see serviceIcons.tsx. Inline SVG also keeps
                        this section at ZERO client JS and invisible to React
                        19's preload pass (root §9.13), both of which an icon
                        font or an <img> would cost.

                        ⚠️ THE DISC MUST FLIP WITH THE CARD. This <li> fills
                        solid brand-primary-hover on hover and its text goes
                        white; a disc left at brand-primary/10 with a
                        brand-primary glyph would sit on that blue as a pale
                        smudge. Measured, treating the icon as a NON-TEXT
                        graphic (3.0:1 bar, not 4.5:1):

                          rest   primary glyph on the /10 disc   3.33:1  pass
                          hover  white glyph on white/15 disc    3.76:1  pass

                        white/15 rather than a heavier tint on purpose: /20
                        gives 3.45:1 and /25 gives 3.16:1, so every step
                        lightens the disc and squeezes the glyph. Do not
                        deepen it. */}
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Glyph = SERVICE_ICONS[item.slug];
                        return Glyph ? (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors duration-200 group-hover:bg-white/15 group-hover:text-white motion-reduce:transition-none">
                            <Glyph className="h-5 w-5" />
                          </span>
                        ) : null;
                      })()}

                      <div className="font-heading-1 text-lg font-semibold text-default-font transition-colors duration-200 group-hover:text-white motion-reduce:transition-none">
                        {item.title}
                      </div>
                    </div>
                    <p className="mt-2 text-base leading-relaxed text-neutral-600 transition-colors duration-200 group-hover:text-white motion-reduce:transition-none">
                      {item.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
