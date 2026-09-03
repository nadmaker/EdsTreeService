// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { Resend } from "resend";
import crypto from "node:crypto";
import { getClientEmailConfig } from "@/lib/clientRegistry";

// -------------------- ENV (SERVER ONLY) --------------------
function env(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

const RESEND_API_KEY = env("RESEND_API_KEY");
const DEFAULT_SITE_KEY = (env("DEFAULT_SITE_KEY") ?? "medranos").toLowerCase();

// Rate limit settings
const RATE_WINDOW_MS = Number(env("CONTACT_RATE_WINDOW_MS") ?? 10 * 60 * 1000);
const RATE_MAX_PER_IP = Number(env("CONTACT_RATE_MAX_PER_IP") ?? 5);
const RATE_MAX_PER_EMAIL = Number(env("CONTACT_RATE_MAX_PER_EMAIL") ?? 3);

// Bot friction
const MIN_SUBMIT_MS = Number(env("CONTACT_MIN_SUBMIT_MS") ?? 1800);

// -------------------- In-memory rate limiter --------------------
type RateRecord = { count: number; resetAt: number };
const BUCKET = new Map<string, RateRecord>();

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function rateHit(key: string, windowMs: number, max: number) {
  const now = Date.now();
  const existing = BUCKET.get(key);

  if (!existing || existing.resetAt <= now) {
    BUCKET.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }

  existing.count += 1;
  BUCKET.set(key, existing);

  if (existing.count > max) return { ok: false, resetAt: existing.resetAt };
  return { ok: true, remaining: max - existing.count, resetAt: existing.resetAt };
}

// -------------------- Helpers --------------------
function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function clamp(s: string, max: number) {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  if (email.includes("\n") || email.includes("\r")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}

function jsonOk(extra?: Record<string, unknown>) {
  return new Response(JSON.stringify({ ok: true, ...(extra ?? {}) }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function jsonError(status: number, code: string, message: string, extra?: Record<string, unknown>) {
  return new Response(JSON.stringify({ ok: false, error: { code, message, ...(extra ?? {}) } }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function envForSite(siteKey: string) {
  const prefix = siteKey.toUpperCase();
  return {
    to: env(`${prefix}_CONTACT_TO_EMAIL`),
    from: env(`${prefix}_CONTACT_FROM_EMAIL`),
    bcc: env(`${prefix}_CONTACT_BCC_EMAIL`),
  };
}

// -------------------- Route --------------------
export const POST: APIRoute = async ({ request }) => {
  if (!RESEND_API_KEY) {
    return jsonError(500, "server_misconfigured", "Server email is not configured.");
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "invalid_json", "Invalid JSON.");
  }

  const site = clamp(String(body?.site ?? DEFAULT_SITE_KEY), 40).toLowerCase();
  const { to: CONTACT_TO_EMAIL, from: CONTACT_FROM_EMAIL, bcc: CONTACT_BCC_EMAIL } = envForSite(site);
  const clientEmail = getClientEmailConfig(site);

  if (!CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return jsonError(500, "server_misconfigured", "Server email is not configured.");
  }

  // Honeypot
  const honeypot = typeof body?.company === "string" ? body.company.trim() : "";
  if (honeypot) return jsonOk({ accepted: true });

  // Bot friction
  const startedAt = Number(body?.started_at_ms ?? 0);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 0 && elapsed < MIN_SUBMIT_MS) {
      return jsonError(400, "bot_suspected", "Please try again.", { reason: "too_fast" });
    }
  }

  // Rate limit per-IP
  const ip = getClientIp(request);
  const rlIp = rateHit(`ip:${ip}`, RATE_WINDOW_MS, RATE_MAX_PER_IP);
  if (!rlIp.ok) {
    return jsonError(429, "rate_limited", "Too many requests. Please try again later.", {
      scope: "ip",
      retryAfterMs: Math.max(0, rlIp.resetAt - Date.now()),
    });
  }

  // Extract + sanitize
  const name = clamp(String(body?.name ?? ""), 80);
  const email = clamp(String(body?.email ?? "").toLowerCase(), 120);
  const phone = clamp(normalizePhone(String(body?.phone ?? "")), 30);
  const address = clamp(String(body?.address ?? ""), 120);
  const zip = clamp(String(body?.zip ?? ""), 12);
  const serviceType = clamp(String(body?.service_type ?? ""), 80);
  const message = clamp(String(body?.message ?? ""), 2000);

  // Validate required
  if (!name) return jsonError(400, "validation_error", "Name is required.", { field: "name" });
  if (!email || !isValidEmail(email))
    return jsonError(400, "validation_error", "A valid email is required.", { field: "email" });
  if (!phone) return jsonError(400, "validation_error", "Phone is required.", { field: "phone" });
  if (!message) return jsonError(400, "validation_error", "Message is required.", { field: "message" });

  // ZIP optional sanity
  if (zip && !/^[0-9A-Za-z\- ]{3,12}$/.test(zip)) {
    return jsonError(400, "validation_error", "ZIP looks invalid.", { field: "zip" });
  }

  // Rate limit per-email (hashed)
  const rlEmail = rateHit(`email:${sha256(email)}`, RATE_WINDOW_MS, RATE_MAX_PER_EMAIL);
  if (!rlEmail.ok) {
    return jsonError(429, "rate_limited", "Too many requests. Please try again later.", {
      scope: "email",
      retryAfterMs: Math.max(0, rlEmail.resetAt - Date.now()),
    });
  }

  // URL spam check
  const urlCount = (message.match(/https?:\/\//gi) ?? []).length;
  if (urlCount >= 3) {
    return jsonError(400, "spam_detected", "Please remove links and try again.", {
      reason: "too_many_links",
    });
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    address: escapeHtml(address),
    zip: escapeHtml(zip),
    serviceType: escapeHtml(serviceType),
    message: escapeHtml(message),
    submittedAt: new Date().toISOString(),
  };

  const resend = new Resend(RESEND_API_KEY);

  const bizSubject = `New estimate request (${site}): ${name}${serviceType ? ` — ${serviceType}` : ""}`;

  const bizHtml = `
    <div style="font-family: ui-sans-serif, system-ui; line-height: 1.4;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Site:</strong> ${escapeHtml(site)}</p>
      <p><strong>Name:</strong> ${safe.name}</p>
      <p><strong>Email:</strong> ${safe.email}</p>
      <p><strong>Phone:</strong> ${safe.phone}</p>
      <p><strong>Address:</strong> ${safe.address || "-"}</p>
      <p><strong>ZIP:</strong> ${safe.zip || "-"}</p>
      <p><strong>Service Type:</strong> ${safe.serviceType || "-"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; background:#f6f6f6; padding:12px; border-radius:8px;">${safe.message}</pre>
      <hr />
      <p style="color:#666; font-size:12px;">Submitted: ${safe.submittedAt}</p>
    </div>
  `;

  const userSubject = `We received your request — ${clientEmail.businessName}`;
  const userHtml = `
    <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
      <p>Hi ${safe.name},</p>
      <p>Thanks for reaching out. We received your request and will respond as soon as possible.</p>
      <p><strong>Summary:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${safe.serviceType || "—"}</li>
        <li><strong>Phone:</strong> ${safe.phone}</li>
        <li><strong>Address:</strong> ${safe.address || "—"} ${safe.zip ? `(${safe.zip})` : ""}</li>
      </ul>
      <p><strong>Your message:</strong></p>
      <pre style="white-space: pre-wrap; background:#f6f6f6; padding:12px; border-radius:8px;">${safe.message}</pre>
      <p style="color:#666; font-size:12px;">If you didn’t submit this request, ignore this email.</p>
      <p>— ${clientEmail.businessName}</p>
    </div>
  `;

  try {
    const bizSend = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      ...(CONTACT_BCC_EMAIL ? { bcc: CONTACT_BCC_EMAIL } : {}),
      subject: bizSubject,
      html: bizHtml,
      replyTo: email,
    });

    if ((bizSend as any)?.error) {
      return jsonError(502, "email_failed", "Failed to send. Please try again.");
    }

    const userSend = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: email,
      subject: userSubject,
      html: userHtml,
    });

    const confirmationSent = !((userSend as any)?.error);
    return jsonOk({ accepted: true, confirmationSent });
  } catch {
    return jsonError(502, "email_failed", "Failed to send. Please try again.");
  }
};

export const GET: APIRoute = async () => jsonError(405, "method_not_allowed", "Use POST.");
export const OPTIONS: APIRoute = async () => new Response(null, { status: 204 });