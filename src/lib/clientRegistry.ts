// src/lib/clientRegistry.ts
//
// Server-side display values for each registered client.
// Imported only by API routes — never by React components or Astro pages.
//
// How to add a new client:
//   1. Add one entry to REGISTRY below, keyed by siteKey (lowercase, underscores).
//   2. Set env vars in Vercel: {SITEKEY_UPPER}_CONTACT_TO_EMAIL,
//      {SITEKEY_UPPER}_CONTACT_FROM_EMAIL (see §4.3.1 in client CLAUDE.md).
//   Zero changes to api/contact.ts are required.
//
// Fields likely to grow as clients are added:
//   businessName  — confirmation email subject + signature (current)
//   fromName?     — "From" display name in Resend (e.g. "Smith's HVAC Team")
//   replyTo?      — override reply-to address per client if different from sender

export interface ClientEmailConfig {
  businessName: string;
  fromName?: string;     // Resend display name; falls back to sender address if unset
  replyTo?: string;      // per-client reply-to override; falls back to submitter email if unset
}

const REGISTRY: Record<string, ClientEmailConfig> = {
  edstree: {
    businessName: "Ed's Tree Service",
  },
  // Next client example:
  // smith_hvac: {
  //   businessName: "Smith's HVAC",
  //   fromName: "Smith's HVAC Team",
  // },
};

const FALLBACK: ClientEmailConfig = {
  businessName: "Our Team",
};

export function getClientEmailConfig(siteKey: string): ClientEmailConfig {
  return REGISTRY[siteKey.toLowerCase()] ?? FALLBACK;
}
