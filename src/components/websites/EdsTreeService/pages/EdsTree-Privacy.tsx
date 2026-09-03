import React from "react";

import NavbarMainWrapper from "../sections/NavbarMainWrapper";
import PrivacyPolicyWrapper from "../sections/PrivacyPolicyWrapper";
import FooterSection from "../sections/FooterSection";
import { CLIENT } from "../config/client.config";

/**
 * ExteriorBuilderServices — Privacy Policy Page Builder
 * - One-off page (not reusable landing page system)
 * - Composition only (wrappers control layout + styling)
 */
/*
  Page-level tracking context, spread into every tracked wrapper.
  Most wrappers do NOT default trackingCity, so omitting it here means
  the page emits no data-city at all and every event from it drops out
  of any city-keyed analytics join (client CLAUDE.md §3.7 defect 3).
*/
const TRACKING = {
  trackingCity: CLIENT.geo.trackingCity,
  trackingService: CLIENT.service.trackingSlug,
  trackingPageType: "privacy",
} as const;

export default function PrivacyPage() {
  return (
    <main className="w-full">
      {/* Top navigation */}
      <header id="top" className="w-full">
        <NavbarMainWrapper {...TRACKING} />
      </header>

      {/* Privacy Policy */}
      <PrivacyPolicyWrapper {...TRACKING} />

      {/* Footer */}
      <footer id="footer" className="w-full">
        <FooterSection {...TRACKING} />
      </footer>
    </main>
  );
}
