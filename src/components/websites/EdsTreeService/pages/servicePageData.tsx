export type ServicePageData = {
  slug: string;
  service: string;
  seoTitle: string;
  seoDescription: string;

  /**
   * Composed into the service page's <h1> by ServiceONEHeroWithRatingsWrapper
   * together with CLIENT.seo.regionLabel. headingSubtitle is the per-service
   * line under it.
   */
  headingTitle: string;
  headingSubtitle: string;

  /**
   * ServiceONEHeroWithRatingsWrapper's full-bleed background photo.
   *
   * ⚠️ REQUIRED, no default — an omission is a TypeScript error, which is
   * deliberate (inherited from EBS, where a defaulted path pointed at a file
   * that never existed and preloaded a 404 on every service route).
   *
   * ⚠️ THE CURRENT VALUES ARE GENERATED PLACEHOLDERS, not photographs. The
   * intake says every photo will be added manually later; until then each
   * route carries its own neutral branded placeholder so nothing 404s and no
   * other company's work appears (the EBS roofing photos and the older
   * Medrano's tree photos are both MUST NOT SHIP here). Swapping one is a
   * ONE-LINE edit to that record. Tracked as an Open Item.
   *
   * The hero band is ~3.4:1 and object-cover, so it crops HARD vertically —
   * supply landscape sources when the real photos arrive.
   */
  heroImage: string;
  /**
   * Alt text for the above. Empty while the image is a decorative placeholder;
   * describe the real photo when it lands (these are content, not decoration).
   */
  heroImageAlt: string;

  /** Caption/photo section */
  captionTitle: string;
  captionDescription: string;

  /** Contact form */
  formId: string;
  formName: string;
  contactAnchorId: string;
};

/*
 * SHARED_BENEFITS / SHARED_PROCESS were DELETED in the Ed's fork (2026-09-03).
 * They had zero consumers on EBS (root §13.3.8 — the live copy is the wrapper
 * defaults in TallServicesBenefitsCards and ServiceONEProcessAccordionWrapper)
 * and they still carried the template's original "ISA Certified Arborist"
 * copy, which is MUST NOT SHIP for this client and would have read as correct
 * on a tree-service site. Removing them closes EBS open item 8.5.7 for this
 * fork. If a consumer is ever wanted, wire the wrappers to a data field here
 * rather than resurrecting the arrays.
 */

/* ─── Per-service data ───────────────────────────────────── */

export const servicePageData: Record<string, ServicePageData> = {
  treeRemoval: {
    slug: "tree-removal",
    service: "Tree Removal",
    seoTitle:
      "Tree Removal | Ed's Tree Service | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Same-day tree removal across Duplin, Sampson, and Wayne Counties, NC. Dead, leaning, storm-damaged or in the way — taken down safely by our own crew. Bonded and insured. Free estimates.",

    headingTitle: "Tree Removal",
    headingSubtitle:
      "Same-day removal for trees that are dead, leaning, or in the way.",

    heroImage: "/images/edstree-service-tree-removal.jpg",
    heroImageAlt: "",

    captionTitle: "Tree Removal in Eastern North Carolina",
    captionDescription:
      "Same-day tree removal for trees that are dead, leaning, storm-damaged or simply in the way, taken down safely by our own crew.",

    formId: "tree-removal-form",
    formName: "Tree Removal Estimate",
    contactAnchorId: "tree-removal-contact",
  },

  treeTrimming: {
    slug: "tree-trimming",
    service: "Tree Trimming",
    seoTitle:
      "Tree Trimming | Ed's Tree Service | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Tree trimming and pruning for homes and businesses across Duplin, Sampson, and Wayne Counties, NC. Limbs kept off the roof and the lines, and the tree kept in shape. Free estimates.",

    headingTitle: "Tree Trimming",
    headingSubtitle:
      "Limbs off the roof and the lines, and the tree kept in shape.",

    heroImage: "/images/edstree-service-tree-trimming.jpg",
    heroImageAlt: "",

    captionTitle: "Tree Trimming in Eastern North Carolina",
    captionDescription:
      "Trimming and pruning that keeps limbs off roofs and power lines and keeps the tree's shape and health.",

    formId: "tree-trimming-form",
    formName: "Tree Trimming Estimate",
    contactAnchorId: "tree-trimming-contact",
  },

  stumpGrinding: {
    slug: "stump-grinding",
    service: "Stump Grinding",
    seoTitle:
      "Stump Grinding | Ed's Tree Service | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Stump grinding below grade across Duplin, Sampson, and Wayne Counties, NC, so you can plant, mow, or build over the spot. Bonded and insured. Free estimates.",

    headingTitle: "Stump Grinding",
    headingSubtitle:
      "Ground below grade so you can plant, mow, or build over it.",

    heroImage: "/images/edstree-service-stump-grinding.jpg",
    heroImageAlt: "",

    captionTitle: "Stump Grinding in Eastern North Carolina",
    captionDescription:
      "Stump grinding below grade so you can plant, mow or build over the spot — on its own, or added to a removal.",

    formId: "stump-grinding-form",
    formName: "Stump Grinding Estimate",
    contactAnchorId: "stump-grinding-contact",
  },

  stormCleanUp: {
    slug: "storm-clean-up",
    service: "Storm Clean Up",
    seoTitle:
      "Storm Clean Up | Ed's Tree Service | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Fallen trees and broken limbs cleared and hauled after a storm, for homes and businesses across Duplin, Sampson, and Wayne Counties, NC. Bonded and insured. Free estimates.",

    headingTitle: "Storm Clean Up",
    headingSubtitle:
      "Fallen trees and broken limbs cleared and hauled.",

    heroImage: "/images/edstree-service-storm-clean-up.jpg",
    heroImageAlt: "",

    captionTitle: "Storm Clean Up in Eastern North Carolina",
    captionDescription:
      "Fallen trees and broken limbs cleared and hauled after a storm, with the property left safe to use.",

    formId: "storm-clean-up-form",
    formName: "Storm Clean Up Estimate",
    contactAnchorId: "storm-clean-up-contact",
  },
};

// Filesystem-derived slug list — always in sync with src/pages/services/*.astro.
// Import in Astro frontmatter only; pass as props to any React component that needs it.
const _servicePages = import.meta.glob("../../../pages/services/*.astro");
export const SERVICE_SLUGS: readonly string[] = Object.keys(_servicePages)
  .map((p) => p.split("/").pop()!.replace(".astro", ""));
