export type ServicePageData = {
  slug: string;
  service: string;
  seoTitle: string;
  seoDescription: string;

  /** TitleHeadingBlock */
  headingTitle: string;
  headingSubtitle: string;

  /**
   * ServiceONEHeroWithRatingsWrapper's full-bleed background photo.
   *
   * Added 2026-08-31. Every service page previously shared ONE hardcoded
   * default in the wrapper — "/images/services-bg.jpg" — which DOES NOT
   * EXIST in public/images/, so all seven pages rendered a broken <img>.
   * Per-service now, because a photo of the actual trade is the single most
   * service-specific thing on these pages.
   *
   * ⚠️ Root §9.3: a new per-service field goes in this type and in ALL seven
   * records. There is no default — an omission is a TypeScript error, which
   * is deliberate. The wrapper additionally degrades to rendering no <img>
   * at all if this is empty, rather than emitting another broken one.
   *
   * ⚠️ The hero band is ~3.4:1 (full width by 360-420px) and the image is
   * object-cover, so it crops HARD vertically. Landscape sources survive
   * this; portrait ones lose most of their height. Aspect per file is noted
   * beside each assignment below.
   *
   * ⚠️ THE CURRENT VALUES ARE STAND-INS, NOT CURATED CHOICES. The point of
   * this field is the STRUCTURE — seven independent paths, one per service,
   * so each page can carry its own photograph. The files pointed at today
   * are simply the best existing EBS photos, chosen so the pages render
   * something real instead of a 404 while the proper per-service
   * photography is shot. Swapping one is a ONE-LINE edit to that record and
   * touches nothing else: no wrapper change, no builder change, no type
   * change. Two of the seven (both gutter services) are already flagged
   * GENERIC because the repo contains no gutter photograph at all.
   */
  heroImage: string;
  /**
   * Alt text for the above. These photos show EBS's actual work, so they are
   * content rather than decoration and get described — the heading above
   * names the service but not what the picture shows. Pass "" to mark one
   * decorative if a generic stock-ish image is ever used.
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

/* ─── Shared content ──────────────────────────────────────
 *
 * ⚠️ THE HEADING ABOVE USED TO READ "used directly in the builder". IT IS
 * NOT. Both arrays below have ZERO CONSUMERS — verified 2026-08-31 by
 * grepping the whole of src/: they are declared and exported here and
 * imported by nothing. ServicePageBLDR composes
 * TallServicesBenefitsCards and ServiceONEProcessAccordionWrapper with NO
 * props, so what actually renders on all seven service pages is those two
 * wrappers' own hardcoded defaults.
 *
 * This is root §13.3.8's trap in its purest form: editing the content below
 * produces a clean, plausible diff with ZERO rendered effect. The two copies
 * have ALREADY DIVERGED — SHARED_BENEFITS[0] says "Expert Contractors" while
 * the served page says "Expert Arborist" — which is exactly what you would
 * expect once one copy is edited and the other is the live one.
 *
 * ⚠️ DO NOT DELETE THEM ANYWAY. DUPLICATE.md Step 6 makes that call
 * explicitly: "Leave the arrays in servicePageData.tsx in place — don't
 * delete them — but don't spend fork time updating their content until
 * something actually consumes them."
 *
 * So: if you are fixing the previous-client tree-service copy that these
 * arrays appear to contain, the files to edit are
 *   sections/TallServicesBenefitsCards.tsx        (the benefit cards)
 *   sections/ServiceONEProcessAccordionWrapper.tsx (the process steps)
 *   sections/ServiceONEtallLocationWrapper.tsx     ("RDU TRIANGLE, NC",
 *                                                   "since 2007")
 * — NOT this file. DUPLICATE.md names the first two; the third was found on
 * 2026-08-31 and is missing from its list.
 * ───────────────────────────────────────────────────────── */

export const SHARED_BENEFITS = [
  {
    title: "Expert Contractors",
    description:
      "We're committed to the best practices of quality workmanship to ensure a safe and efficient operation. ISA Certified Arborist.",
  },
  {
    title: "Guaranteed Service",
    description:
      "Peace of mind and safety is a priority. That's why we offer our EBS Service Guarantee ensuring service to all our existing customers.",
  },
  {
    title: "Modern Equipment",
    description:
      "Our comprehensive equipment selection and vehicle fleet allow us to be fully equipped and precise for any job.",
  },
];

export const SHARED_PROCESS = [
  {
    title: "Step 1: Tree Assessment",
    description:
      "Contact Exterior Builder's for a free tree health and removal assessment, onsite quote, and convenient scheduling.",
  },
  {
    title: "Step 2: Removal and Pruning",
    description:
      "Crew dismantles tree safely, chips branches, cleans job site, and meets with the homeowner before departure.",
  },
  {
    title: "Step 3: EBS Service Guarantee",
    description:
      "Peace of mind and safety is a priority. That's why we offer our EBS Service Guarantee ensuring service to all our existing customers.",
  },
];

/* ─── Per-service data ───────────────────────────────────── */

export const servicePageData: Record<string, ServicePageData> = {
  roofReplacement: {
    slug: "roof-replacement",
    service: "Roof Replacement",
    seoTitle:
      "Roof Replacement | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Full roof tear-off and replacement across Duplin, Sampson, and Wayne Counties, NC. Licensed, bonded, and insured with OSHA-certified crews. Free estimates.",

    headingTitle: "Roof Replacement",
    headingSubtitle:
      "Full tear-off and rebuild, installed as a complete system.",

    /* 1.55, named match */
    heroImage: "/images/ebs-hero-2-roof-replacement.jpg",
    heroImageAlt:
      "An EBS crew replacing a residential asphalt shingle roof.",

    captionTitle: "Roof Replacement in Eastern North Carolina",
    captionDescription:
      "Full tear-off and rebuild when a roof is past repairing, including deck inspection, new underlayment, and haul-away of the old material.",

    formId: "roof-replacement-form",
    formName: "Roof Replacement Consultation",
    contactAnchorId: "roof-replacement-contact",
  },

  roofRepair: {
    slug: "roof-repair",
    service: "Roof Repair",
    seoTitle:
      "Roof Repair | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Roof leak, wind damage, and flashing repair across Duplin, Sampson, and Wayne Counties, NC. Most repairs handled the same day we come out. Free estimates.",

    headingTitle: "Roof Repair",
    headingSubtitle:
      "Leaks, wind damage, and failed flashing — most handled same-day.",

    /* 1.33, named match */
    heroImage: "/images/ebs-gallery-2-roof-repair.jpg",
    heroImageAlt:
      "An EBS roofer repairing a damaged section of shingle roof.",

    captionTitle: "Same-Day Roof Repair in Eastern North Carolina",
    captionDescription:
      "Targeted fixes for leaks, wind damage, missing shingles, and failed flashing, most of them handled the same day we come out.",

    formId: "roof-repair-form",
    formName: "Roof Repair Consultation",
    contactAnchorId: "roof-repair-contact",
  },

  roofInstallation: {
    slug: "roof-installation",
    service: "Roof Installation",
    seoTitle:
      "Roof Installation | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "New roof installation for new construction and additions across Duplin, Sampson, and Wayne Counties, NC. Licensed, bonded, and insured. Free estimates.",

    headingTitle: "Roof Installation",
    headingSubtitle:
      "New roofs for new construction and additions.",

    /* 1.33, named match */
    heroImage: "/images/ebs-services-bg.jpg",
    heroImageAlt:
      "An EBS crew installing a new roof system on a brick home.",

    captionTitle: "New Roof Installation in Eastern North Carolina",
    captionDescription:
      "New roofs on new construction and additions, installed as a complete system rather than shingles on their own.",

    formId: "roof-installation-form",
    formName: "Roof Installation Consultation",
    contactAnchorId: "roof-installation-contact",
  },

  metalRoofInstallation: {
    slug: "metal-roof-installation",
    service: "Metal Roof Installation",
    seoTitle:
      "Metal Roof Installation | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Standing seam and metal panel roofing across Duplin, Sampson, and Wayne Counties, NC. Built for eastern North Carolina weather. Free estimates.",

    headingTitle: "Metal Roof Installation",
    headingSubtitle:
      "Standing seam and metal panel, built to outlast asphalt.",

    /* 0.75 PORTRAIT - crops hardest of the seven */
    heroImage: "/images/ebs-gallery-3-metal-roof.jpg",
    heroImageAlt:
      "A standing seam metal roof installed by EBS.",

    captionTitle: "Metal Roof Installation in Eastern North Carolina",
    captionDescription:
      "Standing seam and metal panel roofing built for eastern North Carolina weather, with a service life well past asphalt.",

    formId: "metal-roof-installation-form",
    formName: "Metal Roof Installation Consultation",
    contactAnchorId: "metal-roof-installation-contact",
  },

  sidingInstallation: {
    slug: "siding-installation",
    service: "Siding Installation",
    seoTitle:
      "Siding Installation | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "New siding for homes and commercial buildings across Duplin, Sampson, and Wayne Counties, NC. Tear-off, moisture barrier, and trim work. Free estimates.",

    headingTitle: "Siding Installation",
    headingSubtitle:
      "New siding for homes and commercial buildings.",

    /* 1.78, named match */
    heroImage: "/images/ebs-hero-3-commercial-siding.jpg",
    heroImageAlt:
      "EBS siding work on a commercial building exterior.",

    captionTitle: "Siding Installation in Eastern North Carolina",
    captionDescription:
      "New siding on homes and commercial buildings, including tear-off, moisture barrier, and trim work.",

    formId: "siding-installation-form",
    formName: "Siding Installation Consultation",
    contactAnchorId: "siding-installation-contact",
  },

  gutterInstallation: {
    slug: "gutter-installation",
    service: "Gutter Installation",
    seoTitle:
      "Gutter Installation | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "New gutters and downspouts across Duplin, Sampson, and Wayne Counties, NC. Sized and pitched to carry water away from the foundation. Free estimates.",

    headingTitle: "Gutter Installation",
    headingSubtitle:
      "Gutters and downspouts sized and pitched to move water away.",

    /* 1.33 - GENERIC, no gutter photo exists */
    heroImage: "/images/ebs-gallery-6-exterior-project.jpg",
    heroImageAlt:
      "An EBS exterior project showing roofline and guttering.",

    captionTitle: "Gutter Installation in Eastern North Carolina",
    captionDescription:
      "New gutters and downspouts sized and pitched to carry water away from the foundation.",

    formId: "gutter-installation-form",
    formName: "Gutter Installation Consultation",
    contactAnchorId: "gutter-installation-contact",
  },

  gutterCleaning: {
    slug: "gutter-cleaning",
    service: "Gutter Cleaning",
    seoTitle:
      "Gutter Cleaning | Exterior Builder Services | Duplin, Sampson & Wayne Counties NC",
    seoDescription:
      "Gutter cleaning across Duplin, Sampson, and Wayne Counties, NC. Debris clearing plus a pitch and seam check so water can't back up. Free estimates.",

    headingTitle: "Gutter Cleaning",
    headingSubtitle:
      "Clear the debris, then check the pitch and the seams.",

    /* 1.33 - GENERIC, no gutter photo exists */
    heroImage: "/images/ebs-hero-poster.jpg",
    heroImageAlt:
      "A completed EBS roof and gutter line on a residential home.",

    captionTitle: "Gutter Cleaning in Eastern North Carolina",
    captionDescription:
      "Clearing debris and checking pitch and seams so water cannot back up under the roof edge.",

    formId: "gutter-cleaning-form",
    formName: "Gutter Cleaning Consultation",
    contactAnchorId: "gutter-cleaning-contact",
  },
};

// Filesystem-derived slug list — always in sync with src/pages/services/*.astro.
// Import in Astro frontmatter only; pass as props to any React component that needs it.
const _servicePages = import.meta.glob("../../../pages/services/*.astro");
export const SERVICE_SLUGS: readonly string[] = Object.keys(_servicePages)
  .map((p) => p.split("/").pop()!.replace(".astro", ""));
