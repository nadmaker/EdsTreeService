"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SERVICE_ICONS } from "./serviceIcons";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

/**
 * A service the visitor can pick. `key` is the canonical service slug and
 * MUST match `servicePageData[*].slug`, the route filename under
 * src/pages/services/, and the key used by `SERVICE_ICONS`.
 *
 * It is a plain string rather than a union of the seven literals so that a
 * caller passing `serviceItems` can offer a different set without a type
 * change — the previous union hardcoded the previous client's four services
 * into the type itself.
 */
type ServiceKey = string;

type ServiceItem = {
  key: ServiceKey;
  label: string;
  icon: React.ReactNode;
};

type ApiOk = { ok: true };
type ApiErr = { ok: false; error: { code: string; message: string } };

export interface LandingContactFormProps {
  /** Optional section id / styling hook */
  id?: string;
  className?: string;

  /** Page-specific tracking / backend identity */
  formId?: string;
  formName?: string;
  siteKey?: string;

  /** Landing tracking context */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
  pageSlug?: string;

  /** Visible copy */
  badgeLabel?: React.ReactNode;
  title?: React.ReactNode;
  servicesHeading?: React.ReactNode;
  formTitle?: React.ReactNode;
  submitLabel?: React.ReactNode;
  submittingLabel?: React.ReactNode;
  disclaimer?: React.ReactNode;
  messagePlaceholder?: string;

  /** Optional service overrides */
  serviceItems?: ServiceItem[];
}

export default function LandingContactForm({
  id = "landing-contact",
  className,

  // Generic EBS fallbacks. CityLandingPageBLDR always passes the per-record
  // values from cityLandingData, so these are unreachable in practice — but
  // they were the PREVIOUS CLIENT's ("durham-landing-form" / "Durham Free
  // Consultation") and would have been silently adopted by any new consumer
  // that omitted the props (root §13.3.8). formId/formName are GA4 join keys
  // and appear in Resend subjects, so a wrong default is not cosmetic.
  formId = "city-landing-form",
  formName = "City Landing Free Estimate",
  siteKey = CLIENT.siteKey,

  trackingSection = "landing-contact-form",
  trackingCity,
  trackingService,
  trackingPageType,
  pageSlug,

  /* ⚠️ BOTH OF THESE ARE LIVE COPY ON ALL SIX CITY ROUTES, not
     placeholders — CityLandingPageBLDR passes ids, form identity and
     tracking, and NO content props at all, so root §13.3.8's inverse
     applies: nothing overrides them.

     Changed 2026-09-02 by request, from "Get Started" and "Request Your
     Free Consultation". "Free Estimates" is title-cased because it is a
     heading; the register's cleared phrasing is "free estimates — no
     charge, no obligation" and the offer itself is unchanged. */
  badgeLabel = "Select a Service",
  title = "Free Estimates",
  servicesHeading = "How Can We Help? Select a Service and Leave Your Details.",
  formTitle = "Contact Us",
  submitLabel = "Submit Request",
  submittingLabel = "Submitting...",
  disclaimer = (
    <>
      By submitting this form, you agree to be contacted by our team. We respect
      your privacy.
    </>
  ),
  messagePlaceholder =
    "Please leave any additional details and include street address.",

  serviceItems: serviceItemsProp,
}: LandingContactFormProps) {
  const startedAtRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  /**
   * The seven services EBS actually sells, in the order the money runs:
   * roofing work first, then siding, then gutters. Same list and same order
   * as the home page's services grid.
   *
   * ⚠️ THIS IS NOT A COSMETIC LIST. The selected label is sent to
   * /api/contact as `service_type` and is rendered verbatim into the
   * customer-facing lead email. Until 2026-08-31 these were the previous
   * client's four TREE services, so a Goldsboro roofing enquiry arrived
   * reading "Service: Tree Removal". Anything added here must be a service
   * EBS performs, named the way EBS names it.
   *
   * `key` is the canonical slug, and it does double duty: it picks the icon
   * out of SERVICE_ICONS and it forms the `select_service` tracking label.
   * Deriving that label from the DISPLAY NAME via slugify() — which is what
   * this file used to do — is the exact failure root §8.5 documents: a
   * display name containing punctuation silently yields a slug that no
   * longer matches servicePageData[*].slug, and the analytics join returns
   * nothing. Declared once, used for both, so the two cannot disagree.
   *
   * ⚠️ Deliberately NOT imported from servicePageData: no file in sections/
   * imports from pages/, for the reason root §13.3.7 gives. Same standing
   * decision as the home services grid — if a service is added, add it in
   * both places.
   */
  const defaultServiceItems: ServiceItem[] = useMemo(
    () => [
      { key: "tree-removal", label: "Tree Removal" },
      { key: "tree-trimming", label: "Tree Trimming" },
      { key: "stump-grinding", label: "Stump Grinding" },
      { key: "storm-clean-up", label: "Storm Clean Up" },
      /* ⚠️ "Other" is NOT a service slug and has no /services/ route. Added
         2026-09-01 by request, replacing "Gutter Installation"; "Gutter
         Cleaning" was removed in the same change. Gutter work is therefore
         no longer directly selectable here and arrives as "Other" — the two
         gutter services still have their own pages, linked from the navbar,
         the home services grid and the footer.
         It ships LAST on purpose: a catch-all above real options invites
         people to stop reading. */
      { key: "other", label: "Other" },
    ].map(({ key, label }) => {
      const Glyph = SERVICE_ICONS[key];
      return {
        key,
        label,
        /* 32px in the 64px disc. Was h-7 (28px) with a `scale-[1.25]`
           on the wrapper, i.e. 35px by way of a transform — sized directly
           now so the number in the class is the number on screen. */
        icon: Glyph ? <Glyph className="h-6 w-6 sm:h-8 sm:w-8" /> : null,
      };
    }),
    []
  );

  const serviceItems = serviceItemsProp ?? defaultServiceItems;

  const [selectedService, setSelectedService] = useState<ServiceKey>(
    serviceItems[0]?.key ?? "tree-removal"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceLabel =
    serviceItems.find((s) => s.key === selectedService)?.label ?? "";

  const push = (payload: Record<string, unknown>) => {
    if (typeof window === "undefined") return;

    (
      window as Window & {
        dataLayer?: Record<string, unknown>[];
      }
    ).dataLayer = (
      window as Window & {
        dataLayer?: Record<string, unknown>[];
      }
    ).dataLayer || [];

    (
      window as Window & {
        dataLayer?: Record<string, unknown>[];
      }
    ).dataLayer?.push(payload);
  };

  const buildFormEventPayload = (
    eventName: string,
    extra?: Record<string, unknown>
  ) => ({
    event: eventName,
    form_id: formId,
    form_name: formName,
    section: trackingSection,
    city: trackingCity,
    service: trackingService,
    page_type: trackingPageType,
    slug: pageSlug,
    selected_service: serviceLabel || "(not_selected)",
    ...extra,
  });

  /* ⚠️ view_section MIGRATED Mechanism B → A on the 2026-09-01 rebuild.
     The React `useEffect` IntersectionObserver that used to sit here was
     DELETED in the same edit — an observer left alongside `data-track-view`
     double-fires view_section (root §8.2).

     This wrapper still hydrates, and must: it owns the form's state, the
     focusin listener and the submit handler. Mechanism A is still the
     better choice for it, exactly as for PortfolioGallery, Reviews and
     map-and-benefits — the vanilla observer in Layout.astro fires off
     server-rendered DOM ahead of hydration, so the event lands earlier than
     a React effect could manage. Dropping the client directive is NOT the
     reason to migrate here, and is not possible for this component. */

  useEffect(() => {
    const formRoot = document.querySelector(`[data-form="${formId}"]`);
    if (!formRoot) return;

    const form = formRoot.querySelector("form");
    if (!form) return;

    const onFocus = () => {
      if (!startedAtRef.current) startedAtRef.current = Date.now();
      if (hasStartedRef.current) return;

      hasStartedRef.current = true;
      push(buildFormEventPayload("form_start"));
    };

    form.addEventListener("focusin", onFocus);
    return () => form.removeEventListener("focusin", onFocus);
  }, [
    formId,
    formName,
    trackingSection,
    trackingCity,
    trackingService,
    trackingPageType,
    pageSlug,
    serviceLabel,
  ]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setCompany("");

    startedAtRef.current = null;
    hasStartedRef.current = false;
    hasSubmittedRef.current = false;

    setSelectedService(serviceItems[0]?.key ?? "tree-removal");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus("idle");
    setErrorMsg("");

    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      push(buildFormEventPayload("form_submit_attempt"));
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
          message: message.trim(),
          service_type: serviceLabel,
          company: company.trim(),
          started_at_ms: startedAtRef.current,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiOk | ApiErr | null;

      if (!res.ok || !data || !data.ok) {
        const message =
          (data as ApiErr | null)?.error?.message || "Submit failed";

        push(
          buildFormEventPayload("form_submit_error", {
            error_message: message,
          })
        );

        throw new Error(message);
      }

      push(buildFormEventPayload("form_submit_success"));

      push(
        buildFormEventPayload("generate_lead", {
          value: 1,
          currency: "USD",
        })
      );

      setStatus("success");
      reset();
    } catch (err: any) {
      const message = err?.message || "Something went wrong";

      setStatus("error");
      setErrorMsg(message);

      // Avoid double-pushing if submit_error already fired in the failed response block.
      if (message === "Something went wrong") {
        push(
          buildFormEventPayload("form_submit_error", {
            error_message: message,
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "w-full rounded-md border border-neutral-200 bg-white px-4 py-3 " +
    "text-default-font placeholder:text-neutral-400 " +
    "transition-all duration-150 " +
    "focus:border-2 focus:border-neutral-900 focus:outline-none focus:ring-0 " +
    "focus-visible:border-2 focus-visible:border-neutral-900 focus-visible:outline-none focus-visible:ring-0";

  return (
    <section
      id={id}
      /* GROUND — the same treatment as the service-area section
         (ServiceGuaranteeAndFeaturesWrapper), by request: white, with the
         procedural folded-paper creases over it and a grain layer on top.
         `relative isolate` is required, not decoration — the layers below
         blend with their BACKDROP, so without a stacking context of its own
         that backdrop is whatever the page painted beneath this section.
         `overflow-x-hidden` keeps the stretched sheet from widening the
         document.
         ⚠️ The ground moved from bg-neutral-50 to bg-white. The creases are
         mix-blend-multiply, so they take their hue from whatever sits
         underneath — change this ground and they re-tint for free, but a
         DARK ground would swallow them entirely. */
      className={[
        "relative isolate w-full overflow-x-hidden bg-white py-12 md:py-24",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-track-view
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      {/* Folded-paper creases. ⚠️ NOT A TILE — the SVG is
          preserveAspectRatio='none' and this is bg-[length:100%_100%]
          bg-no-repeat, so ONE sheet stretches across the whole section.
          Do not give it a pixel background-size; that turns it into a tile
          and the creases stop reaching the edges, which is the effect.
          Geometry and tokens live in global.css under body.theme-ebs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-creases)] bg-[length:100%_100%] bg-no-repeat opacity-[0.85] mix-blend-multiply"
      />
      {/* Grain. TECHNICAL, not decorative: the creases are very large, very
          shallow gradients, exactly the case 8-bit displays render as
          visible banding across a section this wide. This dithers it away.
          Remove it and banding appears on some monitors and not others. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--site-tex-grain)] bg-[length:140px] opacity-[0.05] mix-blend-multiply"
      />

      {/* `relative` lifts the content above the two texture layers. */}
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div data-form={formId}>
          {/* ⚠️ REBUILT 2026-09-01 — the `AltContactForm2` Subframe parent is
              gone and this two-column card is wrapper-authored.

              WHAT THAT PARENT WAS DOING:
              · Hardcoding `text-[#0056b3]` on the title. A raw hex, not an
                EBS token, so this heading did not re-skin with the site
                (root §4) — and it is close enough to brand-primary that the
                difference read as a rendering fault rather than a choice.
              · Rendering a hardcoded "Select your service" label, visible
                only at its own breakpoint. Wrapper-invisible: it is text
                inside the component, so no className could remove it
                (root §7.1's ceiling) and it appeared in the served copy of
                every city landing.
              · Switching to one column at Subframe's `mobile:` breakpoint
                rather than this site's 768px, so the form reflowed at a
                different width from every other section on the page.
              · Painting `bg-neutral-100` on the form column — a raw neutral
                where the rest of the site uses the tokenized ground.

              The form MECHANIC is untouched: same event chain, honeypot,
              bot timing and API contract (root §10.3). Only the container
              changed. */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left — copy and the service picker */}
              <div className="flex flex-col items-start gap-8 p-8 md:p-12">
            {/* EYEBROW — gold, by request 2026-09-02, using the site's
                established eyebrow treatment verbatim rather than a new one:
                the same `text-sm font-semibold uppercase tracking-[0.22em]`
                plus --color-brand-secondary-text that CenteredCopyAreaWrapper,
                ServiceONEFaqWrapper and AboutUsVariant1 already ship.

                ⚠️ THE GOLD IS --color-brand-secondary-text (#8D6917), NOT
                --color-brand-secondary (#DDA82C). That is not a preference,
                it is the only gold that can carry text this size. Measured
                against this card's white ground:

                  brand-secondary       #DDA82C   2.16:1   fails BOTH bars
                  brand-secondary-hover #CE9B22   2.52:1   fails both
                  foil-deep             #C08F1E   2.92:1   fails both
                  brand-secondary-text  #8D6917   5.04:1   passes AA normal

                At text-sm/600 this is normal text, so the bar is 4.5:1 and
                the brand gold misses it by more than half. §4.5's slot
                exists for exactly this case. Do not "correct" it back to
                the brand token to make it brighter.

                Incidentally this also FIXES a pre-existing failure: the
                eyebrow was text-brand-primary at 3.99:1, under the same
                4.5:1 bar. It was never reported because nothing on the page
                looked wrong. */}
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-(--color-brand-secondary-text)">
              {badgeLabel}
            </span>

            {/* TITLE — the hero's heading treatment, by request 2026-09-02.

                ⚠️ THIS WAS NOT RENDERING IN BARLOW AT ALL. The class list was
                `text-heading-1 text-brand-primary` — text-heading-1 is a SIZE
                token (30px/600), and the FAMILY comes from the separate
                font-heading-1 token, which was absent. With no font class
                anywhere in this card's ancestry the heading inherited
                font-body, so it has been setting in Inter while every other
                heading on the site sets in Barlow Semi Condensed. Nothing
                errors; the two tokens simply look like one and are not.

                Matched to Landing1-HeroWrapper's title on the same page:
                font-heading-1, font-bold (700 — the "higher weight", against
                text-heading-1's 600), leading-[1.08], tracking-[0.01em]. The
                hero's [text-shadow] is deliberately NOT carried over: it
                exists to lift white type off a photograph, and here the
                ground is white card.

                Size is a smaller clamp than the hero's (2.75rem cap vs
                3.25rem) because this column is roughly half a card rather
                than a viewport — same clamp the home page's contact heading
                uses, so the two forms agree.

                Colour stays brand-primary. At 3.99:1 on white that is under
                the 4.5:1 normal-text bar but over the 3.0:1 LARGE-text bar,
                and at a 28px minimum this is unambiguously large text. ⚠️ So
                the size and the colour are now coupled: dropping this below
                24px would move the bar and put it in breach. */}
            <span className="font-heading-1 font-bold leading-[1.08] tracking-[0.01em] text-[clamp(1.75rem,4vw,2.75rem)] text-brand-primary">
              {title}
            </span>
            <div>
              <div className="mb-6 font-normal text-default-font">
                {servicesHeading}
              </div>

              {/* ⚠️ TWO COLUMNS AT EVERY WIDTH — was grid-cols-1 with
                  sm:grid-cols-2, i.e. a single stack of full-width
                  rectangles on phones. Changed 2026-09-02 by request: the
                  six options took six screens' worth of thumb travel and
                  the last two sat below the fold on a 390px viewport.

                  gap-3 rather than gap-6 below sm. At 390px the left column
                  is p-8, so 326px is available; 24px of gutter would leave
                  151px per tile and 12px leaves 157px. That 6px matters
                  because the tile is square and the label wraps to three
                  lines inside it. */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {serviceItems.map((s, i) => {
                  const active = s.key === selectedService;

                  /* An odd-length list leaves the final card alone on its
                     own row with a hole beside it. Span it instead, so the
                     grid closes flush at any count — EBS ships seven
                     services and the count is expected to change about
                     once a year. These cards are DIRECT children of the
                     grid above (root §6.5), so the span lands on the right
                     box; it would silently do nothing if a wrapper div
                     were introduced between them.

                     ⚠️ UNPREFIXED col-span-2 since 2026-09-02, and the
                     prefix HAD to go with the grid change. It read
                     `sm:col-span-2` while mobile was a single column, where
                     spanning is meaningless. Now that mobile is two columns
                     too, leaving the prefix would put the hole back on
                     precisely the viewport this change was made for — and
                     it would be invisible today, because the list is
                     currently SIX items and this branch never runs. It
                     would surface only when a seventh is added, long after
                     anyone connects the two edits. */
                  const spanLast =
                    i === serviceItems.length - 1 &&
                    serviceItems.length % 2 === 1
                      ? "col-span-2"
                      : "";

                  const stateClasses = active
                    ? "bg-neutral-100 border border-neutral-200 shadow-sm scale-[1.01]"
                    : "bg-white border border-transparent hover:bg-neutral-50 hover:border-neutral-200 hover:shadow-sm hover:-translate-y-[1px]";

                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSelectedService(s.key)}
                      className={[
                        "w-full",
                        /* gap-4, not gap-6, ABOVE sm. At 24px the label read
                           as a separate column from its icon rather than as
                           one control; 16px binds them.
                           The 8px freed does go to the label (measured 87px
                           wide, up from ~79px), but it does NOT stop the
                           longer labels wrapping — the card is only 222px at
                           1440 and is fully consumed: 32 pad + 64 disc + 16
                           gap + 87 label + 24 pad. Wrapping here is a
                           function of CARD WIDTH, not of this gap, so
                           tightening further would not fix it either.

                           ⚠️ BELOW sm THIS IS A SQUARE TILE, NOT A ROW: icon
                           over centred label. Written MOBILE-FIRST with sm:
                           overrides rather than max-sm: ones, which inverts
                           this file's usual idiom (root §7.7) for a reason
                           that is easy to trip over —

                             Tailwind emits the padding SHORTHAND before the
                             longhands, so `p-3` can never beat `pl-8` no
                             matter which variant carries it. `max-sm:p-3`
                             against a base `pl-8` looks correct and does
                             nothing on the left edge. Putting the shorthand
                             in the base and the longhands behind sm: is what
                             makes the override land.

                           ⚠️ aspect-square is a PREFERRED ratio, not a clamp:
                           height stays auto, so a tile whose label needs a
                           third line grows instead of clipping. That matters
                           at 320px, where the tile is ~122px and the content
                           is close to it. Do not add overflow-hidden — it
                           would turn a graceful stretch into text cut off
                           silently, which no measurement catches. */
                        "group flex rounded-2xl transition-all",
                        "aspect-square flex-col items-center justify-center gap-2 p-3 text-center",
                        "sm:aspect-auto sm:flex-row sm:justify-start sm:gap-4",
                        "sm:p-0 sm:pl-8 sm:pr-6 sm:py-6 sm:text-left",
                        "duration-200 ease-out transform",
                        stateClasses,
                        spanLast,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      data-event="select_service"
                      data-label={`landing-contact-select-service-${s.key}`}
                      data-section={trackingSection}
                      data-city={trackingCity}
                      data-service={trackingService}
                      data-page-type={trackingPageType}
                    >
                      {/* 48px below sm, 64px above. A 64px disc inside a
                          ~157px square leaves too little room under it for
                          a label that wraps to three lines. */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary sm:h-16 sm:w-16">
                        {/* ⚠️ `translate-x-[7px] scale-[1.25]` was removed
                            here 2026-09-01. That nudge was tuned for the
                            PREVIOUS client's Feather glyphs, which had
                            asymmetric padding inside their viewBox; the
                            inline EBS icons are drawn centred on a 24×24
                            grid, so the offset pushed every icon visibly
                            right of its disc. The parent already centres
                            with `items-center justify-center` — nothing
                            needs to correct it. */}
                        {s.icon}
                      </div>

                      {/* 13px/tight below sm so "Metal Roof Installation"
                          wraps inside the square instead of forcing it to
                          grow. leading-tight is left on at sm+ too: these
                          labels are one line there, so it changes nothing. */}
                      <span className="font-body-bold text-default-font text-[13px] leading-tight sm:text-body-bold">
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
              </div>

              {/* Right — the form, on the tokenized ground so the split
                  reads without a divider. */}
              <div className="flex flex-col items-start gap-6 bg-default-background p-8 md:p-12">
            <span className="text-heading-2 text-brand-primary">
              {formTitle}
            </span>
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              <div className="hidden">
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <input
                placeholder="Full Name"
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />

              <input
                placeholder="Email Address"
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                autoComplete="email"
              />

              <input
                placeholder="Phone Number"
                className={fieldClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />

              <textarea
                placeholder={messagePlaceholder}
                rows={4}
                className={fieldClass}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-brand-primary py-3 text-white transition-colors hover:bg-brand-primary/90 disabled:opacity-60"
              >
                {isSubmitting ? submittingLabel : submitLabel}
              </button>

              {status === "error" ? (
                <div className="text-sm text-red-600">{errorMsg}</div>
              ) : null}

              {status === "success" ? (
                <div className="text-sm text-brand-primary">
                  Thanks! We'll reach out shortly.
                </div>
              ) : null}
            </form>

                <span className="text-sm text-brand-primary">{disclaimer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}