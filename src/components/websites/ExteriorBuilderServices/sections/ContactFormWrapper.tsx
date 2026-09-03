"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FeatherUser,
  FeatherPhone,
  FeatherMail,
  FeatherMapPin,
  FeatherHash,
  FeatherList,
  FeatherChevronDown,
} from "@subframe/core";
import * as SubframeCore from "@subframe/core";

import { TextField } from "@/ui/components/TextField";
import { TextArea } from "@/ui/components/TextArea";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { CLIENT } from "@/components/websites/ExteriorBuilderServices/config/client.config";
import { SERVICE_ICONS } from "./serviceIcons";

/* ── Service Type options ───────────────────────────────────────────────
   ⚠️ THIS LIST IS SENT TO THE CUSTOMER-FACING LEAD EMAIL. The selection
   POSTs to /api/contact as `service_type` and is rendered verbatim into
   the email body, so a wrong entry here is not cosmetic. Until 2026-09-01
   this dropdown offered "Tree Service", "Tree Care & Trimming", "Stump
   Grinding" and "Landscape & Shrub Care" — the previous client's services
   — so a roofing enquiry from the home page arrived reading
   "Service: Stump Grinding". Same defect that was fixed on the city
   landings in 433fab0; this consumer was missed because the options live
   inside a Radix PORTAL and therefore never appear in the served HTML, so
   a crawl-based audit reports this file clean.

   ⚠️ MIRRORS LandingContactForm's approved list, deliberately. Ryan
   trimmed that one to five services plus "Other" on 2026-09-01, dropping
   Gutter Installation and Gutter Cleaning; gutter work arrives as "Other"
   and both services still have their own pages. Kept identical here so the
   two lead-capture surfaces cannot disagree about what EBS sells. Unlike
   the landing form's 2-up card grid there is no layout pressure in a
   dropdown, so re-adding the two gutter entries is a two-line change if
   that trim was specific to the cards.

   ⚠️ NOT imported from servicePageData — no file in sections/ imports from
   pages/ (root §13.3.7). Add a service in both places.

   `key` is the tracking slug and matches servicePageData[*].slug, so the
   select_service label is the DECLARED slug rather than a slugified
   display name — root §8.5's failure mode, where punctuation in a display
   name silently breaks the analytics join. */
const SERVICE_OPTIONS: ReadonlyArray<{ key: string; label: string }> = [
  { key: "roof-replacement", label: "Roof Replacement" },
  { key: "roof-repair", label: "Roof Repair" },
  { key: "roof-installation", label: "Roof Installation" },
  { key: "metal-roof-installation", label: "Metal Roof Installation" },
  { key: "siding-installation", label: "Siding Installation" },
  /* Last on purpose: a catch-all above real options invites people to stop
     reading. "other" is not a service slug and has no /services/ route. */
  { key: "other", label: "Other" },
];

type ApiOk = { ok: true; accepted: true; confirmationSent?: boolean };
type ApiErr = {
  ok: false;
  error: { code: string; message: string; field?: string; reason?: string };
};

export interface ContactFormWrapperProps {
  id?: string;
  className?: string;

  formId?: string;
  formName?: string;
  siteKey?: string;
  title?: React.ReactNode;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ContactFormWrapper({
  id = "home-contact",
  className,
  formId = "contact-estimate",
  formName = "Get a Free Estimate",
  siteKey = CLIENT.siteKey,
  /* ⚠️ EBS-Home passes no title, so this default IS the live home-page
     heading (root §13.3.8's inverse). "Free" is cleared — free estimates,
     no charge, no obligation — and matches the one real offer in
     client.config.ts. Uppercasing is done in CSS so the accessible name
     stays sentence-case. */
  title = (
    <>
      Get Your <span className="text-brand-secondary">Free</span> Estimate
    </>
  ),
  trackingSection = "contact-form",
  trackingCity,
  trackingService,
  trackingPageType = "home",
}: ContactFormWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const hasTrackedSectionRef = useRef(false);

  const startedAtMsRef = useRef<number | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [serviceType, setServiceType] = useState<string>("");
  const [message, setMessage] = useState("");

  const [company, setCompany] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const pushToDataLayer = (payload: Record<string, unknown>) => {
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

  /* Takes the DECLARED slug from SERVICE_OPTIONS, not the display name.
     This used to slugify the label at call time — root §8.5's documented
     failure mode, where punctuation or a double space in a display name
     silently produces a slug that no longer joins to
     servicePageData[*].slug, and a marketing copy edit moves a GA4
     dimension with nothing in the diff to show it. Same fix applied to
     LandingContactForm in 433fab0. */
  const pushServiceSelection = (serviceSlug: string) => {
    pushToDataLayer({
      event: "select_service",
      label: `contact-form-service-${serviceSlug}`,
      section: trackingSection,
      city: trackingCity,
      service: trackingService,
      page_type: trackingPageType,
    });
  };

  const previewPayload = useMemo(
    () => ({
      site: siteKey,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      zip: zip.trim(),
      service_type: serviceType || "(not_selected)",
      message: message.trim(),
      company: company.trim(),
      started_at_ms: startedAtMsRef.current ?? undefined,
    }),
    [siteKey, name, phone, email, address, zip, serviceType, message, company]
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (hasTrackedSectionRef.current) return;

          hasTrackedSectionRef.current = true;

          pushToDataLayer({
            event: "view_section",
            section: trackingSection,
            city: trackingCity,
            service: trackingService,
            page_type: trackingPageType,
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [trackingSection, trackingCity, trackingService, trackingPageType]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.getElementById(id);
    if (!root) return;

    const form = root.querySelector("form");
    if (!form) return;

    const onFocusIn = () => {
      if (!startedAtMsRef.current) startedAtMsRef.current = Date.now();

      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      pushToDataLayer({
        event: "form_start",
        form_id: formId,
        form_name: formName,
        section: trackingSection,
        city: trackingCity,
        service: trackingService,
        page_type: trackingPageType,
      });
    };

    form.addEventListener("focusin", onFocusIn);
    return () => form.removeEventListener("focusin", onFocusIn);
  }, [id, formId, formName, trackingSection, trackingCity, trackingService, trackingPageType]);

  const pushSubmitAttempt = () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    pushToDataLayer({
      event: "form_submit_attempt",
      form_id: formId,
      form_name: formName,
      section: trackingSection,
      city: trackingCity,
      service: trackingService,
      page_type: trackingPageType,
      service_type: serviceType || "(not_selected)",
    });
  };

  const clientErrors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Name is required.");
    if (!phone.trim()) errs.push("Phone is required.");
    if (!email.trim()) errs.push("Email is required.");
    if (!message.trim()) errs.push("Message is required.");
    return errs;
  }, [name, phone, email, message]);

  const resetFormFields = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setZip("");
    setServiceType("");
    setMessage("");
    setCompany("");
    startedAtMsRef.current = null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus("idle");
    setErrorMsg("");

    pushSubmitAttempt();

    if (company.trim()) {
      setStatus("success");
      resetFormFields();
      return;
    }

    if (clientErrors.length) {
      setStatus("error");
      setErrorMsg(clientErrors[0] ?? "Please check your form fields.");

      pushToDataLayer({
        event: "form_submit_error",
        form_id: formId,
        form_name: formName,
        section: trackingSection,
        city: trackingCity,
        service: trackingService,
        page_type: trackingPageType,
        service_type: serviceType || "(not_selected)",
        reason: "client_validation",
      });

      return;
    }

    if (!startedAtMsRef.current) startedAtMsRef.current = Date.now() - 3000;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(previewPayload),
      });

      const data = (await res.json().catch(() => null)) as ApiOk | ApiErr | null;

      if (!res.ok || !data || (data as any).ok !== true) {
        const reason =
          (data as any)?.error?.code ||
          (data as any)?.error?.reason ||
          (data as any)?.error?.message ||
          `http_${res.status}`;

        pushToDataLayer({
          event: "form_submit_error",
          form_id: formId,
          form_name: formName,
          section: trackingSection,
          city: trackingCity,
          service: trackingService,
          page_type: trackingPageType,
          service_type: serviceType || "(not_selected)",
          reason,
        });

        throw new Error(
          (data as any)?.error?.message || "Something went wrong. Please try again."
        );
      }

      pushToDataLayer({
        event: "form_submit_success",
        form_id: formId,
        form_name: formName,
        section: trackingSection,
        city: trackingCity,
        service: trackingService,
        page_type: trackingPageType,
        service_type: serviceType || "(not_selected)",
      });

      pushToDataLayer({
        event: "generate_lead",
        form_id: formId,
        form_name: formName,
        section: trackingSection,
        city: trackingCity,
        service: trackingService,
        page_type: trackingPageType,
        value: 1,
        currency: "USD",
        service_type: serviceType || "(not_selected)",
      });

      setStatus("success");
      resetFormFields();

      hasStartedRef.current = false;
      hasSubmittedRef.current = false;
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      /* Dark band, to the supplied reference. bg-default-font is the navy
         the site already uses for dark surfaces (the service-page hero
         scrim is bg-default-font/72), so this re-skins on a fork instead
         of freezing a hex. White measures 14.84:1 on it. */
      className={["w-full bg-default-font", className].filter(Boolean).join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <div
        className="
          flex w-full flex-col items-center gap-8
          px-6 md:px-10
          max-md:pt-6 max-md:pb-8
          md:py-16
          max-md:[&_.pointer-events-none]:translate-y-[6px]
          max-md:[&_.pointer-events-none]:transform
        "
      >
        {/* Heading with a rule running out to each edge, per the reference.
            Decorative, so aria-hidden and no semantics. Hidden below md,
            where there is no width to ramp across and two short stubs just
            look like damage.

            ⚠️ WHITE → GOLD, NOT transparent → gold. Both stops are OPAQUE
            deliberately. Tailwind v4 interpolates gradients in OKLAB —
            `.bg-gradient-to-r` compiles to `to right in oklab` — and CSS
            `transparent` is transparent BLACK, so a from-transparent ramp
            passes through a desaturated grey-brown midpoint instead of
            fading cleanly. The rule looked muddy and barely gold for that
            reason. If a fade-out at the outer edge is ever wanted, use
            `from-white/0` (same hue, zero alpha) rather than
            `from-transparent`, or the murk comes straight back.

            Mirrored, so gold always sits against the heading: the left rule
            runs to-r (white at the outer edge → gold at the title) and the
            right runs to-l. Swapping one to match the other's direction
            would put white against the title on one side only.

            h2 is shrink-0 so the RULES give way as the viewport narrows,
            rather than the heading wrapping between them. */}
        <div className="flex w-full max-w-[1280px] items-center gap-6 md:gap-8">
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-r from-white to-brand-secondary md:block"
          />
          <h2
            className="
              shrink-0 text-center font-heading-2 font-bold uppercase
              tracking-[0.02em] text-white
              text-[clamp(1.75rem,4vw,2.75rem)] leading-tight
              max-md:w-full
            "
          >
            {title}
          </h2>
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-l from-white to-brand-secondary md:block"
          />
        </div>

        {status === "success" ? (
          <div className="w-full max-w-[720px] rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
            Thanks — we got your request. We'll reach out shortly.
          </div>
        ) : null}

        {status === "error" ? (
          <div className="w-full max-w-[720px] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {errorMsg || "Please check the form and try again."}
          </div>
        ) : null}

        <form
          className="flex w-full max-w-[1280px] flex-wrap items-end gap-4"
          onSubmit={handleSubmit}
        >
          <div className="hidden">
            <label>
              Company
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </label>
          </div>

          {/* ── LAYOUT ────────────────────────────────────────────────────
              REBUILT 2026-09-01. This was a single `flex-wrap items-end
              gap-4` row holding all eight controls. Subframe's TextField
              root carries NO width — it is `flex flex-col items-start`, so
              it sizes to content — which meant the eight children wrapped
              on intrinsic width and the break points moved with the label
              text. In practice: five fields filled row 1, then Service
              Type, the textarea and the Submit button landed on row 2
              misaligned by `items-end`, with roughly a third of the card's
              width left empty on the right.

              Now an explicit grid, so placement is declared rather than
              emergent. Landscape is preserved and reinforced — the card is
              WIDER in feel than before, because the fields now reach the
              full measure instead of clustering at the left.

                base   1 col — everything stacks full width
                md     2 cols
                lg     4 cols — matching the reference's 4-across density

              Each control is wrapped in its own grid cell and given
              `w-full`, because the span has to land on the CELL; putting
              col-span on the TextField itself would make the Subframe root
              the grid item and the width classes would fight its intrinsic
              sizing.

              Row 2 mixes 48px inputs with a taller textarea, so Address and
              Service Type carry `self-start` — without it the grid stretches
              them to the textarea's height and they read as broken. */}
          <div
            className="
              grid w-full grid-cols-1 gap-x-4 gap-y-4
              md:grid-cols-2
              lg:grid-cols-4
              [&_input]:w-full
              [&_textarea]:w-full
              max-md:[&_.pointer-events-none]:translate-y-[6px]
            "
          >
            <div>
              <TextField
                className="w-full"
                variant="outline"
                label="Name"
                helpText=""
                icon={<FeatherUser />}
              >
                <TextField.Input
                  placeholder="Name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  autoComplete="name"
                />
              </TextField>
            </div>

            <div>
              <TextField
                className="w-full"
                variant="outline"
                label="Phone"
                helpText=""
                icon={<FeatherPhone />}
              >
                <TextField.Input
                  placeholder="Phone"
                  value={phone}
                  onChange={(e: any) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </TextField>
            </div>

            <div>
              <TextField
                className="w-full"
                variant="outline"
                label="Email"
                helpText=""
                icon={<FeatherMail />}
              >
                <TextField.Input
                  placeholder="Email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                />
              </TextField>
            </div>

            {/* Address, ZIP and Service Type are NOT in clientErrors, so
                they are genuinely optional — labelled as such rather than
                left for the visitor to discover by submitting. */}
            <div>
              <TextField
                className="w-full"
                variant="outline"
                label="ZIP Code (optional)"
                helpText=""
                icon={<FeatherHash />}
              >
                <TextField.Input
                  placeholder="ZIP code (optional)"
                  value={zip}
                  onChange={(e: any) => setZip(e.target.value)}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </TextField>
            </div>

            <div className="self-start">
              <TextField
                className="w-full"
                variant="outline"
                label="Address (optional)"
                helpText=""
                icon={<FeatherMapPin />}
              >
                <TextField.Input
                  placeholder="Street address (optional)"
                  value={address}
                  onChange={(e: any) => setAddress(e.target.value)}
                  autoComplete="street-address"
                />
              </TextField>
            </div>

            <div className="self-start">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <TextField
                  className="w-full cursor-pointer"
                  variant="outline"
                  label="Service Type (optional)"
                  helpText=""
                  icon={<FeatherList />}
                  iconRight={<FeatherChevronDown />}
                >
                  {/* readOnly, not disabled: a disabled input is skipped by
                      focusin, which is what fires form_start (§8.3). */}
                  <TextField.Input
                    className="cursor-pointer"
                    placeholder="Service type (optional)"
                    value={serviceType}
                    readOnly
                  />
                </TextField>
              </SubframeCore.DropdownMenu.Trigger>

              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu className="min-w-[240px]">
                    {/* ⚠️ DropdownItem accepts an `icon` prop and NEVER
                        RENDERS IT — it destructures `icon` (defaulting to
                        <FeatherStar />) and returns only `children`. The
                        four Feather icons passed here until 2026-09-01 were
                        dead props drawing nothing. Glyphs therefore go
                        through `children`, which is a real slot (root §7.1
                        rung 1), rather than through the prop that looks
                        like the right one.

                        Same SERVICE_ICONS map the services grid and the
                        landing form use, so the three surfaces cannot drift
                        apart on what a service looks like. */}
                    {SERVICE_OPTIONS.map(({ key, label }) => {
                      const Glyph = SERVICE_ICONS[key];
                      return (
                        <DropdownMenu.DropdownItem
                          key={key}
                          onClick={() => {
                            setServiceType(label);
                            pushServiceSelection(key);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            {Glyph ? (
                              <Glyph className="h-4 w-4 flex-none text-brand-primary" />
                            ) : null}
                            {label}
                          </span>
                        </DropdownMenu.DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            </div>

            {/* Message takes the wide cell and the Submit sits beside it at
                lg, which is what keeps the last row landscape rather than
                dropping a full-width button under a full-width textarea.
                min-h on the TextArea root is load-bearing: the Subframe
                root is `flex flex-col` with the input box set to `grow
                shrink-0 basis-0`, so the box fills whatever height the root
                is given and the root itself has no intrinsic height. */}
            <div className="md:col-span-2 lg:col-span-2">
              <TextArea
                className="h-full min-h-[132px] w-full"
                variant="outline"
                label="How Can We Help?"
                helpText=""
              >
                <TextArea.Input
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e: any) => setMessage(e.target.value)}
                />
              </TextArea>
            </div>

            {/* Submit spans the full grid and centres, per the reference.
                A NATIVE <button>, not Subframe's Button: the reference's CTA
                is a gradient, and Button paints its own solid variant
                background, so keeping it would mean fighting that with
                !important for no gain. RightRailContactFormStickyWrapper —
                the canonical form (root §12.2) — already uses a plain
                button, so this follows precedent rather than setting one.
                Dropping it also removes the !text-white / [&_*]:!text-white
                pair that existed only to win against the variant.

                ⚠️ GOLD, NOT brand-primary blue. White on blue is 3.99:1 and
                fails AA for normal text. Navy on this gradient measures
                6.86:1 at the dark end and 8.81:1 at the light end, so it is
                safe across the whole ramp — but that depends on the text
                staying navy. White on gold would be ~2.2:1. */}
            <div className="mt-2 flex justify-center md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  h-12 w-full max-w-[320px] rounded-md
                  bg-gradient-to-r from-brand-secondary
                  to-[var(--color-brand-secondary-secondary-tone)]
                  px-8 text-base font-bold uppercase tracking-[0.06em]
                  text-default-font
                  transition-opacity duration-200
                  hover:opacity-90
                  focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-white
                  disabled:opacity-60
                "
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}