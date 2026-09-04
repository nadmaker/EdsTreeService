"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { CLIENT } from "@/components/websites/EdsTreeService/config/client.config";
import { SERVICE_ICONS, IconOther } from "./serviceIcons";

/**
 * Ed's — three-step estimate form for the home hero card (Variant C).
 *
 * Fills HeroFormCardWrapper's `card` slot and owns the card surface. Styled
 * from the SavATree reference: a dashed stepper (SERVICES · DETAILS ·
 * ADDRESS), a serif step title, and green NEXT / BACK buttons.
 *
 *   1  Services  — the four services as selectable tiles (single choice)
 *   2  Details   — full name, phone, email, additional details (textarea)
 *   3  Address   — ZIP code, address; the NEXT here is the SUBMIT
 *   ✓  Done      — "Thank you, {name}. Your submission has been received."
 *
 * ONE <form>, ALWAYS MOUNTED. The steps swap its children; the success
 * panel renders inside it too. That is what keeps the form_start focusin
 * listener (root §10.7, scoped by data-form) attached across every state,
 * and it is why Enter inside a field behaves: implicit submission fires
 * onSubmit, which ADVANCES on steps 1-2 and only SUBMITS on step 3. The
 * NEXT buttons are therefore type="submit"; BACK is type="button".
 *
 * The shared mechanic is the canonical one (root §10.3, §8.3): form_start
 * on first focusin → form_submit_attempt at the top of the FINAL submit →
 * form_submit_success | form_submit_error → generate_lead; ref-guarded,
 * reset() clears the guards on success. Honeypot `company`, started_at_ms
 * bot timing, POST /api/contact with { ok } | { ok:false, error }.
 *
 * ⚠️ /api/contact REQUIRES `message`. "Additional details" is optional by
 * name, so an empty textarea sends a composed one-line message naming the
 * chosen service instead of failing server-side validation. The API also
 * renders `zip` and `address` into both emails, so step 3 is not decorative.
 *
 * Step navigation (NEXT/BACK) is deliberately NOT tracked: no event in root
 * §8.4 describes it, and inventing one is a taxonomy decision (§11.5). Tile
 * selection IS tracked — `select_service` already exists and the tiles are
 * real DOM clicks, so the click bridge handles them with no manual push
 * (§13.5.4).
 */

type ApiOk = { ok: true; accepted?: boolean; confirmationSent?: boolean };
type ApiErr = {
  ok: false;
  error: { code: string; message: string; field?: string; reason?: string };
};

export type ServiceItem = { key: string; label: string };

/*
 * `key` is the DECLARED tracking slug and matches servicePageData[*].slug —
 * never slugified from the label at call time (root §8.5). NOT imported from
 * servicePageData: no file in sections/ imports from pages/ (root §13.3.7),
 * so a new service is added here AND there, same as the sibling forms. No
 * "Other" tile: the reference grid is services only, and the textarea on
 * step 2 is where anything else goes.
 */
const DEFAULT_SERVICE_ITEMS: readonly ServiceItem[] = [
  { key: "tree-removal",   label: "Tree Removal" },
  { key: "tree-trimming",  label: "Tree Trimming" },
  { key: "stump-grinding", label: "Stump Grinding" },
  { key: "storm-clean-up", label: "Storm Clean Up" },
];

type Step = 1 | 2 | 3;

const STEPS: ReadonlyArray<{ n: Step; label: string; title: string }> = [
  { n: 1, label: "Services", title: "" }, // title comes from the `title` prop
  { n: 2, label: "Details",  title: "Enter your contact info" },
  { n: 3, label: "Address",  title: "Enter your address" },
];

/** Same shape the API enforces, so a client pass never disagrees with it. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

function push(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

export interface HeroEstimateFormWrapperProps {
  id?: string;
  className?: string;
  /** Step-1 title. "Free estimate" is a cleared claim (handoff §3). */
  title?: React.ReactNode;

  /** Form identity */
  formId?: string;
  formName?: string;
  siteKey?: string;

  /** Tiles on step 1. Defaults to the four services. */
  serviceItems?: readonly ServiceItem[];

  /** Tracking context (root §8.6) */
  trackingSection?: string;
  trackingCity?: string;
  trackingService?: string;
  trackingPageType?: string;
  pageSlug?: string;
}

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M16 10H4m5-5-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.5 5 9l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Stepper ───────────────────────────────────────────────────────────── */

function Stepper({ step }: { step: Step }) {
  return (
    /*
      Three equal columns, a circle centred in each, so the circle centres
      sit at 1/6, 1/2 and 5/6 of the row. The dashed connector is ONE line
      drawn behind them from the first centre to the last (left/right
      16.667%) at the circles' vertical centre — no per-gap segments to
      keep aligned.
    */
    <ol className="relative mx-auto grid w-full max-w-[360px] grid-cols-3" aria-label="Progress">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[16.667%] right-[16.667%] top-[7px] border-t border-dashed border-neutral-400"
      />
      {STEPS.map((s) => {
        const done = s.n < step;
        const current = s.n === step;
        return (
          <li
            key={s.n}
            className="relative flex flex-col items-center"
            aria-current={current ? "step" : undefined}
          >
            <span
              className={[
                "flex h-[15px] w-[15px] items-center justify-center rounded-full border-2",
                done
                  ? "border-brand-primary bg-brand-primary text-white"
                  : current
                    ? "border-brand-primary bg-white"
                    : "border-neutral-400 bg-white",
              ].join(" ")}
            >
              {done ? <CheckIcon /> : null}
            </span>
            <span
              className={[
                "mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] md:text-[11px]",
                done || current ? "text-default-font" : "text-neutral-600",
              ].join(" ")}
            >
              {s.label}
              {done ? <span className="sr-only"> (completed)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Shared class strings ──────────────────────────────────────────────── */

const fieldClass = [
  "w-full rounded-md border border-neutral-200 bg-white px-4 py-3",
  "text-sm text-default-font placeholder:text-neutral-600",
  "transition-colors focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary",
].join(" ");

/* The field groups on steps 2-3 carry `text-left`: the hero's content column
   is text-center and the labels would otherwise inherit it and sit centred
   over their inputs. */
const labelClass = "text-sm font-medium text-default-font";

const buttonClass = [
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6",
  "bg-brand-primary text-sm font-semibold uppercase tracking-[0.08em] text-white",
  "transition-colors hover:bg-brand-primary-hover",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

/* ─── The wrapper ───────────────────────────────────────────────────────── */

export default function HeroEstimateFormWrapper({
  id,
  className,
  title = "Request your free estimate",

  formId = "hero-estimate-form",
  formName = "Home Hero Free Estimate",
  siteKey = CLIENT.siteKey,

  serviceItems = DEFAULT_SERVICE_ITEMS,

  trackingSection = "hero-form",
  trackingCity,
  trackingService,
  trackingPageType,
  pageSlug,
}: HeroEstimateFormWrapperProps) {
  const headingId = useId();

  /* Flow */
  const [step, setStep] = useState<Step>(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  /* Fields */
  const [serviceKey, setServiceKey] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  /* Event-chain guards (root §8.3) */
  const startedAtRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  /* Focus target on step / state change */
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const isFirstRenderRef = useRef(true);

  const serviceLabel = serviceItems.find((s) => s.key === serviceKey)?.label ?? "";

  const buildPayload = (event: string, extra?: Record<string, unknown>) => ({
    event,
    form_id: formId,
    form_name: formName,
    section: trackingSection,
    city: trackingCity,
    service: trackingService,
    page_type: trackingPageType,
    slug: pageSlug,
    selected_service: serviceKey || "(not_selected)",
    ...extra,
  });

  /* form_start on first focus anywhere inside the form — tiles included,
     since they are buttons. Scoped by data-form (root §10.7). The <form>
     is never unmounted, so one attach per identity change is enough. */
  useEffect(() => {
    const root = document.querySelector(`[data-form="${formId}"]`);
    const form = root?.querySelector("form");
    if (!form) return;

    const onFocus = (e: FocusEvent) => {
      /* Only a CONTROL counts as starting the form. The step titles and the
         thank-you heading are programmatically focused (tabIndex -1) to
         announce state changes, and that focus bubbles here too — without
         this filter the thank-you focus fired a second form_start right
         after generate_lead, because reset() had just cleared the guard. */
      if (!(e.target instanceof Element) || !e.target.matches("input, textarea, select, button")) return;
      if (!startedAtRef.current) startedAtRef.current = Date.now();
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      push(buildPayload("form_start"));
    };

    form.addEventListener("focusin", onFocus);
    return () => form.removeEventListener("focusin", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, formName, trackingSection, trackingCity, trackingService, trackingPageType, pageSlug]);

  /* Move focus to the new step's title (or the thank-you) so the change is
     announced and the keyboard lands in the right place. Skipped on mount —
     a hero must not steal focus on page load. */
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, status]);

  const reset = () => {
    setServiceKey("");
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setZip("");
    setAddress("");
    setCompany("");
    startedAtRef.current = null;
    hasStartedRef.current = false;
    hasSubmittedRef.current = false;
  };

  /** Per-step client validation; first message is what the user sees. */
  const errorsForStep = (s: Step): string[] => {
    const errs: string[] = [];
    if (s === 1) {
      if (!serviceKey) errs.push("Choose a service to continue.");
    } else if (s === 2) {
      if (!name.trim()) errs.push("Full name is required.");
      if (!phone.trim()) errs.push("Phone number is required.");
      if (!email.trim() || !EMAIL_RE.test(email.trim())) errs.push("A valid email is required.");
    } else {
      if (!ZIP_RE.test(zip.trim())) errs.push("A 5-digit ZIP code is required.");
      if (!address.trim()) errs.push("Address is required.");
    }
    return errs;
  };

  const goBack = () => {
    setStepError(null);
    setErrorMsg("");
    setStatus("idle");
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  };

  const startOver = () => {
    setStatus("idle");
    setErrorMsg("");
    setStepError(null);
    setSubmittedName("");
    setStep(1);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStepError(null);

    /* Steps 1-2: NEXT (and Enter) advance; nothing is submitted. */
    if (step < 3) {
      const errs = errorsForStep(step);
      if (errs.length) {
        setStepError(errs[0] ?? "Please check the highlighted field.");
        return;
      }
      setStep((step + 1) as Step);
      return;
    }

    /* Step 3: the real submission. */
    setStatus("idle");
    setErrorMsg("");

    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      push(buildPayload("form_submit_attempt"));
    }

    // Honeypot — silent fake success, no tracking (root §10.5)
    if (company.trim()) {
      setSubmittedName(name.trim());
      setStatus("success");
      reset();
      return;
    }

    // Full client validation before the network (root §10.9). An earlier
    // step can only be invalid if the user went BACK and cleared a field, so
    // jump to the first offending step rather than showing an error the
    // current screen cannot fix.
    for (const s of [1, 2, 3] as const) {
      const errs = errorsForStep(s);
      if (errs.length) {
        setStep(s);
        setStepError(errs[0] ?? "Please check your form fields.");
        push(buildPayload("form_submit_error", { error_message: errs[0], reason: "client_validation" }));
        return;
      }
    }

    if (!startedAtRef.current) {
      startedAtRef.current = Date.now() - 3000;
    }

    // The API requires a message; compose one when the optional textarea is
    // empty so the lead is not rejected for a field the form never demanded.
    const messageToSend =
      message.trim() ||
      `Free estimate request for ${serviceLabel || "an unspecified service"} — no additional details provided.`;

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
          zip: zip.trim(),
          message: messageToSend,
          service_type: serviceLabel || "(not_selected)",
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

      setSubmittedName(name.trim());
      setStatus("success");
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message ? err.message : "Something went wrong";
      setStatus("error");
      setErrorMsg(msg);

      if (msg === "Something went wrong") {
        push(buildPayload("form_submit_error", { error_message: msg }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const tracking = {
    "data-section": trackingSection,
    "data-city": trackingCity,
    "data-service": trackingService,
    "data-page-type": trackingPageType,
  } as const;

  const stepTitle = step === 1 ? title : STEPS[step - 1]?.title;

  return (
    <div
      id={id}
      data-form={formId}
      className={["w-full rounded-2xl bg-white p-6 shadow-2xl md:p-10", className]
        .filter(Boolean)
        .join(" ")}
      data-track-view
      {...tracking}
    >
      <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col">
        {/* Honeypot */}
        <div className="hidden">
          <input
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        {status === "success" ? (
          /* ── DONE ── */
          <div role="status" className="py-4 text-center md:py-6">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-heading-2 text-3xl font-bold text-brand-primary outline-none md:text-4xl"
            >
              Thank you{submittedName ? `, ${submittedName}` : ""}.
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-base text-default-font">
              Your submission has been received. We&apos;ll reach out shortly.
            </p>
            <button type="button" onClick={startOver} className={`${buttonClass} mt-8`}>
              Submit another request
            </button>
          </div>
        ) : (
          <>
            <Stepper step={step} />

            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="mt-6 text-center font-heading-2 text-2xl font-bold text-brand-primary outline-none md:text-3xl"
            >
              {stepTitle}
            </h2>

            {/* ── STEP 1 — services ── */}
            {step === 1 ? (
              <div
                role="radiogroup"
                aria-labelledby={headingId}
                className="mt-6 grid grid-cols-2 gap-3 md:gap-4"
              >
                {serviceItems.map(({ key, label }) => {
                  const Icon = SERVICE_ICONS[key] ?? IconOther;
                  const selected = serviceKey === key;
                  return (
                    /*
                      A real DOM click on a button carrying data-event, so
                      the click bridge emits select_service with the
                      DECLARED slug — no manual push (root §13.5.4).
                    */
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setServiceKey(key);
                        setStepError(null);
                      }}
                      className={[
                        "flex flex-col items-center justify-center gap-2 rounded-md px-3 py-5 text-center",
                        "md:flex-row md:gap-3 md:px-4 md:py-4",
                        "text-[12px] font-semibold uppercase tracking-[0.08em] md:text-[13px]",
                        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                        selected
                          ? "bg-brand-primary text-white shadow-md"
                          : "border border-neutral-200 bg-white text-default-font shadow-sm hover:border-brand-primary",
                      ].join(" ")}
                      data-event="select_service"
                      data-label={`hero-form-service-${key}`}
                      {...tracking}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* ── STEP 2 — details ── */}
            {step === 2 ? (
              <div className="mt-6 flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <label htmlFor={`${formId}-name`} className={labelClass}>Full name</label>
                  <input
                    id={`${formId}-name`}
                    className={fieldClass}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`${formId}-phone`} className={labelClass}>Phone number</label>
                    <input
                      id={`${formId}-phone`}
                      className={fieldClass}
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`${formId}-email`} className={labelClass}>Email</label>
                    <input
                      id={`${formId}-email`}
                      className={fieldClass}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor={`${formId}-message`} className={labelClass}>
                    Additional details <span className="font-normal text-neutral-600">(optional)</span>
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    className={fieldClass}
                    placeholder="Tell us about the tree, the job, or anything we should know"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {/* ── STEP 3 — address ── */}
            {step === 3 ? (
              <div className="mt-6 flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <label htmlFor={`${formId}-zip`} className={labelClass}>ZIP code</label>
                  <input
                    id={`${formId}-zip`}
                    className={`${fieldClass} md:max-w-[220px]`}
                    placeholder="Enter your ZIP code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={10}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={`${formId}-address`} className={labelClass}>Property address</label>
                  <input
                    id={`${formId}-address`}
                    className={fieldClass}
                    placeholder="Enter the property address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    required
                  />
                </div>
              </div>
            ) : null}

            {/* Inline validation / API error */}
            {stepError ? (
              <p role="alert" className="mt-4 text-center text-sm text-red-600">{stepError}</p>
            ) : null}
            {status === "error" && errorMsg ? (
              <p role="alert" className="mt-4 text-center text-sm text-red-600">{errorMsg}</p>
            ) : null}

            {/* ── Buttons ── step 1 has NEXT alone, centred; 2-3 pair BACK
                with NEXT / SUBMIT. NEXT is type="submit" so Enter advances.

                ⚠️ THE KEYS ARE LOAD-BEARING. Without them React reconciles
                the two rows as the same <div> and the step-2 BACK button
                (index 0, type="button") as the same DOM node as the step-1
                NEXT (index 0, type="submit"). goBack() re-renders
                synchronously INSIDE the click dispatch, so by the time the
                browser runs the click's activation behaviour the clicked
                node has become a submit button — and it submits the form,
                advancing straight back to step 2 (traced: `submit
                submitter=Next` in the same millisecond as the BACK click).
                Distinct keys force a remount, so the clicked node is
                detached instead of mutated. preventDefault on BACK is the
                second lock on the same door. */}
            {step === 1 ? (
              <div key="actions-single" className="mt-6 flex justify-center">
                <button type="submit" className={`${buttonClass} min-w-[200px]`}>
                  Next <ArrowRightIcon />
                </button>
              </div>
            ) : (
              <div key="actions-paired" className="mt-6 grid grid-cols-2 gap-4">
                <button
                  key="back"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    goBack();
                  }}
                  className={buttonClass}
                  disabled={isSubmitting}
                >
                  <ArrowLeftIcon /> Back
                </button>
                <button key="next" type="submit" className={buttonClass} disabled={isSubmitting}>
                  {step === 3 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
                  {isSubmitting ? null : <ArrowRightIcon />}
                </button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
