export type CityLandingPageData = {
  slug: string;
  city: string;

  /**
   * ⚠️ seoTitle is DELIBERATELY uniform across all six cities
   * ("{City} NC Tree Service | Ed's Tree Service") and should stay that way.
   * A predictable, keyword-front-loaded title is what you want for a city
   * set — the variation belongs in the description, not here. All six sit
   * at 44-48 chars, inside the ~60 display cut, so none truncates.
   */
  seoTitle: string;

  /**
   * ⚠️ EACH CITY'S DESCRIPTION USES A DIFFERENT SENTENCE STRUCTURE, ON PURPOSE
   * (a rule inherited from EBS, where five of six were once one template with
   * the city name swapped — a near-duplicate pattern Google reads as thin
   * templating).
   *
   * The six shapes are: county-anchor-first (Goldsboro), tenure-first
   * (Clinton), service-list-first (Mount Olive), contrast/differentiator-first
   * (Warsaw), place-identity-first (Faison, the HQ town), and
   * symptom-list-first (Kenansville). Keep them distinct — do NOT "normalise"
   * them back to one template, and if a seventh city is added, give it a
   * seventh shape rather than copying one of these.
   *
   * Every claim used is on the CLAIMS REGISTER's cleared list
   * (EdsTreeService_HANDOFF_Step0-Step1.md §3): bonded & insured, since 2006,
   * free estimates, own crews, same-day removal, residential and commercial.
   * Storm CLEAN-UP is a service; a 24-7 or emergency RESPONSE promise is not.
   */
  seoDescription: string;

  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;

  /**
   * Full-bleed background photograph for the city hero.
   *
   * ⚠️ REQUIRED, and deliberately not optional (inherited from EBS: a
   * defaulted path once pointed at a file that never existed and preloaded a
   * 404 on every city route — the type is what catches it).
   *
   * ⚠️ THE CURRENT VALUES ARE GENERATED PLACEHOLDERS, one per city, until the
   * owner supplies photography. Nothing in them is city-specific. Swapping one
   * is a one-line edit here. Tracked as an Open Item.
   */
  heroImage: string;
  /** Alt text for the above. Empty while the image is a decorative placeholder. */
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
    slug: "goldsboro-nc-tree-service",
    city: "Goldsboro",
    seoTitle: "Goldsboro NC Tree Service | Ed's Tree Service",
    // Structure: county-first geographic anchor → services → credential.
    seoDescription:
      "Wayne County tree removal, trimming, stump grinding and storm clean-up, run out of our Faison shop twenty minutes down the road. Bonded and insured. Free estimates.",

    heroTitleLine1: "Tree Service",
    heroTitleLine2: "in Goldsboro, NC",
    heroSubtitle:
      "Tree removal, trimming, stump grinding, and storm clean-up — bonded and insured, with free estimates",

    heroImage: "/images/edstree-city-goldsboro.jpg",
    heroImageAlt: "",

    formId: "goldsboro-landing-form",
    formName: "Goldsboro Free Estimate",
    contactAnchorId: "goldsboro-contact",

    centeredCopyMainTitle: "Tree Service in Goldsboro, NC",
    centeredCopySubtitle: "Residential & Commercial Tree Removal, Trimming & Storm Clean-Up",
    centeredCopyIntroDescription:
      "Ed's Tree Service works throughout Wayne County from our base in Faison, twenty minutes down the road. Tree removal, trimming, stump grinding, and storm clean-up for Goldsboro homes and businesses — bonded and insured, with a free written estimate before anything starts.",
  },

  clinton: {
    slug: "clinton-nc-tree-service",
    city: "Clinton",
    seoTitle: "Clinton NC Tree Service | Ed's Tree Service",
    // Structure: tenure claim first → audience → offer.
    seoDescription:
      "We have worked in Sampson County since 2006. Tree removal, trimming, stump grinding and storm clean-up for Clinton homes and businesses. Free written estimates.",

    heroTitleLine1: "Tree Service",
    heroTitleLine2: "in Clinton, NC",
    heroSubtitle:
      "Tree removal, trimming, stump grinding, and storm clean-up — bonded and insured, with free estimates",

    heroImage: "/images/edstree-city-clinton.jpg",
    heroImageAlt: "",

    formId: "clinton-landing-form",
    formName: "Clinton Free Estimate",
    contactAnchorId: "clinton-contact",

    centeredCopyMainTitle: "Tree Service in Clinton, NC",
    centeredCopySubtitle: "Residential & Commercial Tree Removal, Trimming & Storm Clean-Up",
    centeredCopyIntroDescription:
      "Sampson County has been part of our service area since 2006. We take down, trim and clear trees for Clinton homeowners and businesses — our own crews, bonded and insured, start to finish.",
  },

  mountOlive: {
    slug: "mount-olive-nc-tree-service",
    city: "Mount Olive",
    seoTitle: "Mount Olive NC Tree Service | Ed's Tree Service",
    // Structure: service list first → locality.
    seoDescription:
      "Tree removal, trimming, stump grinding and storm clean-up for Mount Olive homes and businesses. We sit between Faison and Goldsboro, so it is a short drive for our crews.",

    heroTitleLine1: "Tree Service",
    heroTitleLine2: "in Mount Olive, NC",
    heroSubtitle:
      "Tree removal, trimming, stump grinding, and storm clean-up — bonded and insured, with free estimates",

    heroImage: "/images/edstree-city-mount-olive.jpg",
    heroImageAlt: "",

    formId: "mount-olive-landing-form",
    formName: "Mount Olive Free Estimate",
    contactAnchorId: "mount-olive-contact",

    centeredCopyMainTitle: "Tree Service in Mount Olive, NC",
    centeredCopySubtitle: "Residential & Commercial Tree Removal, Trimming & Storm Clean-Up",
    centeredCopyIntroDescription:
      "Mount Olive sits between our Faison base and Goldsboro, well inside the area our crews cover. Tree removal, trimming, stump grinding, and storm clean-up for homes and businesses, with a free written estimate and no obligation.",
  },

  warsaw: {
    slug: "warsaw-nc-tree-service",
    city: "Warsaw",
    seoTitle: "Warsaw NC Tree Service | Ed's Tree Service",
    // Structure: differentiator/contrast first → services → offer.
    seoDescription:
      "A short run for our own crews, not a dispatch from three counties away. Tree removal, trimming, stump grinding and storm clean-up for Warsaw homes and businesses. Free estimates.",

    heroTitleLine1: "Tree Service",
    heroTitleLine2: "in Warsaw, NC",
    heroSubtitle:
      "Tree removal, trimming, stump grinding, and storm clean-up — bonded and insured, with free estimates",

    heroImage: "/images/edstree-city-warsaw.jpg",
    heroImageAlt: "",

    formId: "warsaw-landing-form",
    formName: "Warsaw Free Estimate",
    contactAnchorId: "warsaw-contact",

    centeredCopyMainTitle: "Tree Service in Warsaw, NC",
    centeredCopySubtitle: "Residential & Commercial Tree Removal, Trimming & Storm Clean-Up",
    centeredCopyIntroDescription:
      "Warsaw is a few miles from our shop in Faison, so it is a short run for our own crews rather than a call-center dispatch from three counties away. Tree removal, trimming, stump grinding, and storm clean-up for Duplin County homes and businesses.",
  },

  faison: {
    slug: "faison-nc-tree-service",
    city: "Faison",
    seoTitle: "Faison NC Tree Service | Ed's Tree Service",
    // Structure: place-identity first (this is the HQ town) → tenure → services.
    seoDescription:
      "Faison is where our shop is, and has been since 2006. Tree removal, trimming, stump grinding and storm clean-up for homes and businesses, handled by our own crews.",

    heroTitleLine1: "Tree Service",
    heroTitleLine2: "in Faison, NC",
    heroSubtitle:
      "Your local tree crew — bonded and insured, with free estimates",

    heroImage: "/images/edstree-city-faison.jpg",
    heroImageAlt: "",

    formId: "faison-landing-form",
    formName: "Faison Free Estimate",
    contactAnchorId: "faison-contact",

    centeredCopyMainTitle: "Tree Service in Faison, NC",
    centeredCopySubtitle: "Residential & Commercial Tree Removal, Trimming & Storm Clean-Up",
    centeredCopyIntroDescription:
      "Ed's Tree Service is based in Faison and has been taking down and trimming trees for eastern North Carolina homes and businesses since 2006. Removal, trimming, stump grinding, and storm clean-up, handled by our own bonded and insured crews with a written estimate first.",
  },

  kenansville: {
    slug: "kenansville-nc-tree-service",
    city: "Kenansville",
    seoTitle: "Kenansville NC Tree Service | Ed's Tree Service",
    // Structure: symptom/problem list first → audience → credential.
    seoDescription:
      "A dead tree over the house, limbs on the lines, a stump in the way, or a yard full of storm debris. Kenansville homes and businesses. Bonded and insured, free estimates.",

    heroTitleLine1: "Tree Service",
    heroTitleLine2: "in Kenansville, NC",
    heroSubtitle:
      "Tree removal, trimming, stump grinding, and storm clean-up — bonded and insured, with free estimates",

    heroImage: "/images/edstree-city-kenansville.jpg",
    heroImageAlt: "",

    formId: "kenansville-landing-form",
    formName: "Kenansville Free Estimate",
    contactAnchorId: "kenansville-contact",

    centeredCopyMainTitle: "Tree Service in Kenansville, NC",
    centeredCopySubtitle: "Residential & Commercial Tree Removal, Trimming & Storm Clean-Up",
    centeredCopyIntroDescription:
      "Kenansville is one of the Duplin County towns our crews work in regularly. Tree removal, trimming, stump grinding, and storm clean-up for homes and commercial properties — bonded and insured, with free estimates.",
  },
};

// Filesystem-derived slug list — always in sync with src/pages/service-area/*.astro.
// Import in Astro frontmatter only; pass as props to any React component that needs it.
const _cityPages = import.meta.glob("../../../pages/service-area/*.astro");
export const CITY_SLUGS: readonly string[] = Object.keys(_cityPages)
  .map((p) => p.split("/").pop()!.replace(".astro", ""));
