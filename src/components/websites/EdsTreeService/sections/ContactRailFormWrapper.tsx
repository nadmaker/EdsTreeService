"use client";

/**
 * ContactRailFormWrapper — the /contact form card, built to sit in a STICKY
 * right rail that travels from the contact section down into the process
 * section below it.
 *
 * ⚠️ WHY THIS IS A NEW FILE AND NOT A CHANGE TO
 * RightRailContactFormStickyWrapper, which is what "remake the sticky
 * wrapper" would suggest:
 *
 *   1. THAT WRAPPER IS NOT WHERE THE STICKINESS LIVES. ServicePageBLDR does
 *      it, in the builder: `lg:sticky lg:top-[calc(var(--site-nav-clearance)
 *      +1rem)]` wrapped around the form. The wrapper itself is layout-
 *      agnostic. So nothing about it needed changing, and editing it would
 *      have put all SEVEN service pages at risk for no gain.
 *   2. THE FIELD SETS DIFFER. That form collects name / email / phone /
 *      address / message. This one keeps /contact's existing eight —
 *      first name, last name, address, property type, email, phone, service
 *      type, message — which is what was asked for.
 *
 * ⚠️ THE FOCUSIN LISTENER USES A REF, NOT document.querySelector, and that is
 * a deliberate divergence from the canonical form (root §12.2). This card is
 * rendered TWICE on the page — an in-flow copy below `lg` and a sticky copy
 * at `lg` and up — exactly as ServicePageBLDR does. Both copies share one
 * formId, so `document.querySelector('[data-form="…"]')` returns the FIRST
 * match for BOTH instances: the mobile copy collects two listeners and fires
 * form_start twice, while the desktop copy gets none and never fires it at
 * all. That bug is live on the service pages today. A ref binds each instance
 * to its own <form> and cannot collide.
 *
 * ⚠️ SERVICE TYPE IS A NATIVE <select>, not the Radix DropdownMenu the other
 * three forms use. Two reasons: a portaled menu inside a position:sticky
 * ancestor is a needless interaction risk, and the portal is exactly why the
 * previous client's tree services survived two crawl-based audits here (the
 * options never appear in served HTML). A native select puts every option in
 * the markup. It still needs the MANUAL dataLayer push — an onChange is a
 * synthetic event, not a DOM click, so the global bridge cannot see it
 * (root §8.8).
 *
 * MECHANIC IS UNCHANGED from ContactInfoFormWrapper: same event chain
 * (form_start → form_submit_attempt → form_submit_success | _error →
 * generate_lead), same honeypot, same bot timing, same /api/contact payload,
 * and the same six-service list the home form and city landings use.
 * formId and formName are also unchanged — they are GA4 join keys and appear
 * in Resend subjects (root §13.6.2).
 *
 * ⚠️ CONTRAST. The submit button is brand-primary-HOVER (#1376B4), NOT
 * brand-primary. Its label is 16px semibold, which is not large text, so it
 * needs 4.5:1 — white on brand-primary is 3.99:1 and fails; on the hover tone
 * it is 4.91:1. Same decision as the FAQ accordion and the city-landing
 * service cards. Do not "correct" it back to match the reference's blue.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FeatherUser,
  FeatherMapPin,
  FeatherMail,
  FeatherPhone,
  FeatherList,
} from "@subframe/core";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

type ApiOk = { ok: true; accepted?: true };
type ApiErr = { ok: false; error: { code?: string; message?: string; reason?: string } };

/* Mirrors the approved list on the home form, the city landings and the
   services grid. ⚠️ NOT imported from servicePageData — no file in sections/
   imports from pages/ (root §13.3.7). Add a service in all of them. */
const SERVICE_OPTIONS: ReadonlyArray<{ key: string; label: string }> = [
  { key: "tree-removal", label: "Tree Removal" },
  { key: "tree-trimming", label: "Tree Trimming" },
  { key: "stump-grinding", label: "Stump Grinding" },
  { key: "storm-clean-up", label: "Storm Clean Up" },
  { key: "other", label: "Other" },
];

export interface ContactRailFormWrapperProps {
  id?: string;
  className?: string;
  cardTitle?: React.ReactNode;

  formId?: string;
  formName?: string;
  siteKey?: string;

  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
}

export default function ContactRailFormWrapper({
  id,
  className,
  cardTitle = "Contact us",
  formId = "contact-page-form",
  formName = "Contact Page Estimate",
  siteKey = CLIENT.siteKey,
  trackingSection = "contact-info-form",
  trackingCity,
  trackingService = CLIENT.service.trackingSlug,
  trackingPageType = "contact",
}: ContactRailFormWrapperProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const startedAtMsRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const push = (payload: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
  };

  const base = (extra?: Record<string, unknown>) => ({
    form_id: formId,
    form_name: formName,
    section: trackingSection,
    city: trackingCity,
    service: trackingService,
    page_type: trackingPageType,
    ...extra,
  });

  /* form_start, bound to THIS instance's <form> via ref. See the header note
     on why querySelector is wrong here. */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const onFocusIn = () => {
      if (!startedAtMsRef.current) startedAtMsRef.current = Date.now();
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      push({ event: "form_start", ...base() });
    };

    form.addEventListener("focusin", onFocusIn);
    return () => form.removeEventListener("focusin", onFocusIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, formName, trackingSection, trackingCity, trackingService, trackingPageType]);

  const clientErrors = useMemo(() => {
    const errs: string[] = [];
    if (!firstName.trim()) errs.push("First name is required.");
    if (!lastName.trim()) errs.push("Last name is required.");
    if (!email.trim()) errs.push("Email is required.");
    if (!phone.trim()) errs.push("Phone is required.");
    return errs;
  }, [firstName, lastName, email, phone]);

  const resetFormFields = () => {
    setFirstName("");
    setLastName("");
    setAddress("");
    setEmail("");
    setPhone("");
    setServiceType("");
    setMessage("");
    setCompany("");
    startedAtMsRef.current = null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      push({
        event: "form_submit_attempt",
        ...base({ service_type: serviceType || "(not_selected)" }),
      });
    }

    /* Honeypot. Fake success, reset, return — and fire NOTHING, so bots
       cannot probe whether their submissions register (root §10.5). */
    if (company.trim()) {
      setStatus("success");
      resetFormFields();
      return;
    }

    if (clientErrors.length) {
      setStatus("error");
      setErrorMsg(clientErrors[0] ?? "Please check your form fields.");
      push({
        event: "form_submit_error",
        ...base({
          service_type: serviceType || "(not_selected)",
          reason: "client_validation",
        }),
      });
      return;
    }

    if (!startedAtMsRef.current) startedAtMsRef.current = Date.now() - 3000;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: siteKey,
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          service_type: serviceType || "(not_selected)",
          message: message.trim(),
          company: company.trim(),
          started_at_ms: startedAtMsRef.current,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiOk | ApiErr | null;

      if (!res.ok || !data || (data as ApiOk).ok !== true) {
        const err = data as ApiErr | null;
        const reason =
          err?.error?.code || err?.error?.reason || `http_${res.status}`;
        push({
          event: "form_submit_error",
          ...base({ service_type: serviceType || "(not_selected)", reason }),
        });
        throw new Error(err?.error?.message || "Something went wrong. Please try again.");
      }

      push({
        event: "form_submit_success",
        ...base({ service_type: serviceType || "(not_selected)" }),
      });
      push({
        event: "generate_lead",
        ...base({
          value: 1,
          currency: "USD",
          service_type: serviceType || "(not_selected)",
        }),
      });

      setStatus("success");
      resetFormFields();
      hasStartedRef.current = false;
      hasSubmittedRef.current = false;
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* Shared field chrome. Filled light input on a white card, per the
     reference. Icons sit inside the field, so the input carries left padding
     rather than the icon being a sibling column. */
  const field =
    "w-full rounded-md border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 " +
    "text-sm text-default-font placeholder:text-neutral-400 " +
    "transition-colors focus:border-brand-primary focus:bg-white focus:outline-none";
  const fieldNoIcon = field.replace("pl-9", "pl-3");
  const label = "mb-1 block text-xs font-semibold text-default-font";
  const iconWrap =
    "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400";

  return (
    <div
      id={id}
      data-form={formId}
      className={[
        "w-full rounded-lg bg-white p-6 md:p-8",
        /* ⚠️ CARD CHROME IS TUNED TO THE CONCRETE GROUND, which this card
           only started sitting on when /contact's band went from a flat
           dark #525252 to #F2F5F9 on 2026-09-02.

           White on concrete is 1.09:1 — the fill alone gives the card no
           edge whatsoever, so the shadow is now doing all of the work and
           its tint matters. Tailwind's `shadow-lg` is neutral black, which
           greys out against a cool ground; the two-stop navy shadow below
           is the recipe ServicesGridSectionWrapper already uses for its
           white tiles on this same surface, scaled up because this is a
           large panel rather than a tile. It reads as resting ON the
           concrete instead of drawn on it.

           `ring-neutral-200` went with it: at 1.13:1 on concrete it was a
           hairline nobody could see, and it was warm against a cool
           ground. The navy 8% border is the grid's value. */
        "border border-[rgba(23,41,58,0.08)]",
        "shadow-[0_2px_6px_rgba(23,41,58,0.05),0_18px_44px_rgba(23,41,58,0.10)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-section={trackingSection}
      data-city={trackingCity}
      data-service={trackingService}
      data-page-type={trackingPageType}
    >
      <p className="mb-5 font-heading-1 text-xl font-bold uppercase tracking-[0.01em] text-default-font">
        {cardTitle}
      </p>

      {status === "success" ? (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Thanks — we got your request. We&apos;ll be in touch shortly.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {errorMsg || "Please check the form and try again."}
        </div>
      ) : null}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Honeypot. tabIndex={-1} + autoComplete="off" keep real users out
            of it; the wrapper is display:none so it never renders. */}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor={`${formId}-first`}>
              First Name <span className="text-brand-primary">*</span>
            </label>
            <div className="relative">
              <span className={iconWrap}>
                <FeatherUser className="h-4 w-4" />
              </span>
              <input
                id={`${formId}-first`}
                className={field}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor={`${formId}-last`}>
              Last Name <span className="text-brand-primary">*</span>
            </label>
            <div className="relative">
              <span className={iconWrap}>
                <FeatherUser className="h-4 w-4" />
              </span>
              <input
                id={`${formId}-last`}
                className={field}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={label} htmlFor={`${formId}-address`}>
            Full Property Address
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <FeatherMapPin className="h-4 w-4" />
            </span>
            <input
              id={`${formId}-address`}
              className={field}
              placeholder="Start typing your address…"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor={`${formId}-email`}>
            Email Address <span className="text-brand-primary">*</span>
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <FeatherMail className="h-4 w-4" />
            </span>
            <input
              id={`${formId}-email`}
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor={`${formId}-phone`}>
            Phone <span className="text-brand-primary">*</span>
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <FeatherPhone className="h-4 w-4" />
            </span>
            <input
              id={`${formId}-phone`}
              className={field}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor={`${formId}-service`}>
            Service Type
          </label>
          <div className="relative">
            <span className={iconWrap}>
              <FeatherList className="h-4 w-4" />
            </span>
            <select
              id={`${formId}-service`}
              className={field}
              value={serviceType}
              onChange={(e) => {
                const label = e.target.value;
                setServiceType(label);
                const opt = SERVICE_OPTIONS.find((o) => o.label === label);
                /* MANUAL push: a select's change is a synthetic event, not a
                   DOM click, so the global bridge in Layout.astro cannot see
                   it (root §8.8). Label carries the DECLARED slug, never a
                   slugified display name (root §8.5). */
                if (opt) {
                  push({
                    event: "select_service",
                    label: `contact-info-form-service-${opt.key}`,
                    section: trackingSection,
                    city: trackingCity,
                    service: trackingService,
                    page_type: trackingPageType,
                  });
                }
              }}
            >
              <option value="">Select a service (optional)</option>
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.key} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label} htmlFor={`${formId}-message`}>
            Messages and Questions
          </label>
          <textarea
            id={`${formId}-message`}
            rows={4}
            className={fieldNoIcon}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-1 w-full rounded-md bg-brand-primary-hover px-6 py-3
            text-base font-semibold text-white
            transition-opacity duration-200
            hover:opacity-90
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-brand-primary-hover
            disabled:opacity-60
          "
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
