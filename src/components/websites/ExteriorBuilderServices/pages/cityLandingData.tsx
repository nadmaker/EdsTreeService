export type CityLandingPageData = {
  slug: string;
  city: string;

  /**
   * ⚠️ seoTitle is DELIBERATELY uniform across all six cities
   * ("{City} NC Roofing & Siding | Exterior Builder Services") and should stay
   * that way. A predictable, keyword-front-loaded title is what you want for a
   * city set — the variation belongs in the description, not here. All six sit
   * at 54-59 chars, inside the ~60 display cut, so none truncates.
   */
  seoTitle: string;

  /**
   * ⚠️ EACH CITY'S DESCRIPTION USES A DIFFERENT SENTENCE STRUCTURE, ON PURPOSE
   * (rewritten 2026-09-02). Five of the six were previously one template with
   * the city name swapped in — byte-identical otherwise — which is a
   * near-duplicate-description pattern across a route set that Google reads as
   * thin templating.
   *
   * The six shapes are: county-anchor-first (Goldsboro), tenure-first
   * (Clinton), service-list-first (Mount Olive), contrast/differentiator-first
   * (Warsaw), place-identity-first (Faison, the HQ town), and
   * symptom-list-first (Kenansville). Each opens on a different word and runs
   * a different sentence count. Keep them distinct — do NOT "normalise" them
   * back to one template, and if a seventh city is added, give it a seventh
   * shape rather than copying one of these.
   *
   * Every claim used is drawn from that city's own centeredCopyIntroDescription
   * below, so the description matches the page it describes. All are on the
   * CLAIMS REGISTER's cleared list (licensed/bonded/insured, since 2006, free
   * estimates, residential and commercial, own crews). Storm REPAIR is cleared;
   * a 24-7 or emergency RESPONSE promise is not — see the register in
   * EBS_HANDOFF_Step0-Step1.md §3 before editing any of these.
   */
  seoDescription: string;

  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;

  /**
   * Full-bleed background photograph for the city hero.
   *
   * ⚠️ REQUIRED, and deliberately not optional. Until 2026-08-31
   * Landing1-HeroWrapper carried a default of "/images/services-bg.jpg" and
   * the builder passed nothing — that file has never existed in this repo,
   * so all six city landings served a 404 as their LCP element, AND React 19
   * preloaded the missing file at high priority on every one of them (root
   * §9.13). A missing image is invisible in the build and reads as an
   * ordinary dark hero, so the type is what has to catch it: adding a city
   * without a photo is now a compile error rather than a silent 404.
   *
   * ⚠️ THE CURRENT VALUES ARE STAND-INS, NOT CURATED CHOICES — same posture
   * as servicePageData's heroImage. The point of the field is the STRUCTURE:
   * six independent paths, so each city can carry its own photograph once
   * per-city photography exists. Swapping one is a one-line edit here and
   * touches no wrapper and no builder. Nothing in these photographs is
   * city-specific today, so they are assigned to spread the four genuinely
   * EBS roofing/siding photos across the six routes rather than to depict
   * the town.
   */
  heroImage: string;
  /**
   * Alt text for the above. These are real EBS jobs rather than decoration,
   * so they get described. Pass "" to mark one decorative if a generic
   * image is ever used.
   */
  heroImageAlt: string;

  formId: string;
  formName: string;

  contactAnchorId: string;

  centeredCopyMainTitle: string;
  centeredCopySubtitle: string;
  centeredCopyIntroDescription: string;
};

export const cityLandingData: Record<string, CityLandingPageData> = {
  goldsboro: {
    slug: "goldsboro-nc-roofing-siding",
    city: "Goldsboro",
    seoTitle: "Goldsboro NC Roofing & Siding | Exterior Builder Services",
    // Structure: county-first geographic anchor → services → credential.
    seoDescription:
      "Wayne County roof replacement, repair, siding and gutters, run out of our Faison shop twenty minutes down the road. Licensed, bonded and insured.",

    heroTitleLine1: "Roofing & Siding",
    heroTitleLine2: "in Goldsboro, NC",
    heroSubtitle:
      "Roof replacement, repair, siding, and gutters — licensed, bonded, and insured",

    heroImage: "/images/ebs-hero-2-roof-replacement.jpg",
    heroImageAlt:
      "A completed asphalt shingle roof replacement on a single-family home",

    formId: "goldsboro-landing-form",
    formName: "Goldsboro Free Estimate",
    contactAnchorId: "goldsboro-contact",

    centeredCopyMainTitle: "Roofing & Siding in Goldsboro, NC",
    centeredCopySubtitle: "Residential & Commercial Roofing and Siding",
    centeredCopyIntroDescription:
      "Exterior Builder Services works throughout Wayne County from our base in Faison, twenty minutes down the road. Roof replacement, repair, siding, and gutters for Goldsboro homes and commercial buildings — licensed, bonded, and insured, with a written estimate before anything starts.",
  },

  clinton: {
    slug: "clinton-nc-roofing-siding",
    city: "Clinton",
    seoTitle: "Clinton NC Roofing & Siding | Exterior Builder Services",
    // Structure: tenure claim first → audience → offer.
    seoDescription:
      "We have worked in Sampson County since 2006. Roof replacements, targeted repairs, siding and gutters for Clinton homes and businesses. Free written estimates.",

    heroTitleLine1: "Roofing & Siding",
    heroTitleLine2: "in Clinton, NC",
    heroSubtitle:
      "Roof replacement, repair, siding, and gutters — licensed, bonded, and insured",

    heroImage: "/images/ebs-gallery-2-roof-repair.jpg",
    heroImageAlt:
      "An Exterior Builder Services crew carrying out a roof repair",

    formId: "clinton-landing-form",
    formName: "Clinton Free Estimate",
    contactAnchorId: "clinton-contact",

    centeredCopyMainTitle: "Roofing & Siding in Clinton, NC",
    centeredCopySubtitle: "Residential & Commercial Roofing and Siding",
    centeredCopyIntroDescription:
      "Sampson County has been part of our service area since 2006. We handle full roof replacements, targeted repairs, siding, and gutters for Clinton homeowners and businesses — our own crews, OSHA-certified, start to finish.",
  },

  mountOlive: {
    slug: "mount-olive-nc-roofing-siding",
    city: "Mount Olive",
    seoTitle: "Mount Olive NC Roofing & Siding | Exterior Builder Services",
    // Structure: service list first → locality and coverage cadence.
    seoDescription:
      "Roof replacement, repair, siding and gutter work for Mount Olive homes and commercial buildings. We sit between Faison and Goldsboro, so crews are here weekly.",

    heroTitleLine1: "Roofing & Siding",
    heroTitleLine2: "in Mount Olive, NC",
    heroSubtitle:
      "Roof replacement, repair, siding, and gutters — licensed, bonded, and insured",

    heroImage: "/images/ebs-gallery-3-metal-roof.jpg",
    heroImageAlt:
      "A standing seam metal roof installed on a home",

    formId: "mount-olive-landing-form",
    formName: "Mount Olive Free Estimate",
    contactAnchorId: "mount-olive-contact",

    centeredCopyMainTitle: "Roofing & Siding in Mount Olive, NC",
    centeredCopySubtitle: "Residential & Commercial Roofing and Siding",
    centeredCopyIntroDescription:
      "Mount Olive sits between our Faison base and Goldsboro, well inside the area our crews cover every week. Roof replacement, repair, siding, and gutter work for homes and commercial buildings, with a free written estimate and no obligation.",
  },

  warsaw: {
    slug: "warsaw-nc-roofing-siding",
    city: "Warsaw",
    seoTitle: "Warsaw NC Roofing & Siding | Exterior Builder Services",
    // Structure: differentiator/contrast first → services → offer.
    seoDescription:
      "A short run for our crews, not a dispatch from three counties away. Roofing, siding and gutters for Warsaw homes and businesses. Free estimates.",

    heroTitleLine1: "Roofing & Siding",
    heroTitleLine2: "in Warsaw, NC",
    heroSubtitle:
      "Roof replacement, repair, siding, and gutters — licensed, bonded, and insured",

    heroImage: "/images/ebs-hero-3-commercial-siding.jpg",
    heroImageAlt:
      "New siding on a commercial building",

    formId: "warsaw-landing-form",
    formName: "Warsaw Free Estimate",
    contactAnchorId: "warsaw-contact",

    centeredCopyMainTitle: "Roofing & Siding in Warsaw, NC",
    centeredCopySubtitle: "Residential & Commercial Roofing and Siding",
    centeredCopyIntroDescription:
      "Warsaw is a few miles from our shop in Faison, so it is a short run for our crews rather than a call center dispatch from three counties away. Roof replacement, repair, siding, and gutters for Duplin County homes and businesses.",
  },

  faison: {
    slug: "faison-nc-roofing-siding",
    city: "Faison",
    seoTitle: "Faison NC Roofing & Siding | Exterior Builder Services",
    // Structure: place-identity first (this is the HQ town) → tenure → services.
    seoDescription:
      "Faison is where our shop is, and has been since 2006. Roof replacement, repair, siding and gutters for homes and businesses, handled by our own crews.",

    heroTitleLine1: "Roofing & Siding",
    heroTitleLine2: "in Faison, NC",
    heroSubtitle:
      "Your local roofing and siding contractor — licensed, bonded, and insured",

    heroImage: "/images/ebs-hero-poster.jpg",
    heroImageAlt:
      "An Exterior Builder Services crew at work on a residential roof",

    formId: "faison-landing-form",
    formName: "Faison Free Estimate",
    contactAnchorId: "faison-contact",

    centeredCopyMainTitle: "Roofing & Siding in Faison, NC",
    centeredCopySubtitle: "Residential & Commercial Roofing and Siding",
    centeredCopyIntroDescription:
      "Exterior Builder Services is based in Faison and has been putting roofs on eastern North Carolina homes and businesses since 2006. Roof replacement, repair, siding, and gutters, handled by our own OSHA-certified crews with a written estimate first.",
  },

  kenansville: {
    slug: "kenansville-nc-roofing-siding",
    city: "Kenansville",
    seoTitle: "Kenansville NC Roofing & Siding | Exterior Builder Services",
    // Structure: symptom/problem list first → audience → credential.
    seoDescription:
      "Leaks, storm damage, a roof past repairing, or siding and gutters that need replacing. Kenansville homes and businesses. Licensed, bonded and insured.",

    heroTitleLine1: "Roofing & Siding",
    heroTitleLine2: "in Kenansville, NC",
    heroSubtitle:
      "Roof replacement, repair, siding, and gutters — licensed, bonded, and insured",

    heroImage: "/images/ebs-gallery-1-roof-replacement.jpg",
    heroImageAlt:
      "A finished roof replacement seen from the front of the house",

    formId: "kenansville-landing-form",
    formName: "Kenansville Free Estimate",
    contactAnchorId: "kenansville-contact",

    centeredCopyMainTitle: "Roofing & Siding in Kenansville, NC",
    centeredCopySubtitle: "Residential & Commercial Roofing and Siding",
    centeredCopyIntroDescription:
      "Kenansville is one of the Duplin County towns our crews work in regularly. Full roof replacements, leak and storm repairs, siding, and gutters for homes and commercial buildings — licensed, bonded, and insured, with free estimates.",
  },
};

// Filesystem-derived slug list — always in sync with src/pages/service-area/*.astro.
// Import in Astro frontmatter only; pass as props to any React component that needs it.
const _cityPages = import.meta.glob("../../../pages/service-area/*.astro");
export const CITY_SLUGS: readonly string[] = Object.keys(_cityPages)
  .map((p) => p.split("/").pop()!.replace(".astro", ""));
