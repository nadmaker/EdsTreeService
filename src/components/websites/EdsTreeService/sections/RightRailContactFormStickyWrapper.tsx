"use client";

import React, { useEffect, useRef, useState } from "react";
import { FeatherMessageCircle } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";

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
  /**
   * HUMAN-READABLE service name for the lead email's "Service:" line —
   * "Tree Removal", not "tree-removal". Optional and additive: omitted, the
   * payload falls back to the old behaviour. See the service_type comment in
   * the submit handler for why this exists.
   */
  serviceLabel?: string;

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
  serviceLabel,
  siteKey = CLIENT.siteKey,

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
          /*
            ⚠️ DISPLAY NAME, not the tracking slug (fixed 2026-09-04, client
            CLAUDE.md §8.4.1). This field is not analytics — /api/contact
            renders it verbatim into the lead email, so for two years of EBS
            and every service page here it read "Service: tree-removal".
            `trackingService` is the kebab-case GA4 join key and MUST stay
            kebab-case everywhere else in this file; only this one line wants
            the human name. Falls back to the old chain when the consumer
            passes no label, so nothing breaks for a caller that has none.
          */
          service_type: serviceLabel || trackingService || formName,
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
    /*
      data-track-view added 2026-09-04. This section carried data-section but
      NO view_section observer of any kind (client CLAUDE.md §8.4.9), so it
      was the one section on a service page that never reported a view — a
      silent gap, since a missing observer produces no error and no warning.

      Mechanism A (the vanilla [data-track-view] observer in Layout.astro,
      root §8.2) rather than a React one, and the choice is load-bearing
      here: ServicePageBLDR mounts this wrapper TWICE per service page — a
      mobile copy and a sticky desktop copy — both emitting section
      "service-contact-form". Mechanism A dedupes by SECTION NAME, so the two
      copies cannot double-fire. A React observer keys on the element and
      would need per-copy guard refs to reach the same result.

      Do NOT also add a React observer: the two together double-fire.
    */
    <div
      id={id}
      data-form={formId}
      className={[cardMaxWidthClassName, className].filter(Boolean).join(" ")}
      data-track-view
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
