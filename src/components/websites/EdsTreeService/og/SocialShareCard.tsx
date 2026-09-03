import React from "react";
import { CLIENT } from "../config/client.config";

/**
 * SocialShareCard — the og:image DESIGN, as code.
 *
 * This is a live-markup rebuild of SOCIAL_SHARE_FOR_ebs.png plus the phone
 * pill the composite never had. It is NOT a page section and is never
 * hydrated or served as HTML. It is rendered ONCE, AT BUILD TIME, to a JPEG by
 * ./renderSocialShareCard.ts and served from /og/default.jpg — which is what
 * CLIENT.seo.ogImage points at.
 *
 * WHY IT IS AN IMAGE AND NOT A SECTION. og:image must be a URL that returns
 * image bytes. Facebook, LinkedIn, iMessage and X fetch it and decode it; none
 * of them render HTML, so there is no way to "connect" og:image to a DOM
 * section. The closest thing that actually works is what this is: keep the
 * design as code, render it to pixels on every build, point the tag at the
 * output. Change anything here and the next build regenerates the card.
 *
 * WHY INLINE STYLES AND NOT TAILWIND. The renderer is Satori, which converts a
 * React element tree to SVG using a CSS SUBSET: flexbox only (no grid), inline
 * `style` objects only (no classes, no stylesheet, so no Tailwind and no CSS
 * custom properties), px units, absolute positioning, linear-gradient, opacity,
 * box-shadow on boxes. Not supported and worked around below: `filter:
 * drop-shadow` (the halo is pre-baked into the logo PNG by sharp instead),
 * `object-fit: cover` (the photo is sized to cover by arithmetic and offset by
 * hand), `clamp()`/vw units (the canvas is a fixed 1200x630 so nothing needs
 * to be fluid). Every element with more than one child MUST declare
 * display:flex or Satori throws.
 *
 * COLOURS ARE LITERALS ON PURPOSE. Satori cannot read var(--color-brand-*), so
 * the values below are copied from the body.theme-ebs block in global.css and
 * labelled with the token they mirror. If a brand token changes in global.css,
 * change it here too — nothing will catch the drift automatically.
 *
 * Values marked "sampled" were read off the 1153x771 composite (strap 164px)
 * rather than guessed, then rescaled to the 1200x630 canvas that every social
 * platform wants (1.91:1). The composite is 1.5:1, so the photo band here is
 * shallower than the artwork's; the strap-to-band ratio was kept and the band
 * crops the photo more tightly top and bottom.
 */

/* ─── Canvas ──────────────────────────────────────────────────────────────── */

/** 1200x630 is the one size every platform renders without cropping. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * Strap height. Sampled ratio is 164/771 = 21% of the composite; 21% of 630 is
 * 134. Rounded to 128 so the photo band gets a little more room.
 */
export const STRAP_HEIGHT = 128;

/* ─── Colours (mirrors of global.css body.theme-ebs) ─────────────────────── */

/* LITERALS mirroring body.theme-edstree in global.css — Satori cannot read
   CSS custom properties. Key names are kept from the EBS card; the values are
   Ed's: strap = primary-hover (reverse-out band, guide §4 rule 6), gradient
   dark stop = default-font, brandPrimary = primary, paleGold = the amber-foil
   light stop, brandSecondary = amber. A token change in global.css needs a
   matching edit here; nothing catches the drift. */
export const OG_COLORS = {
  strapNavy: "#14651F",
  gradientNavy: "#0B240E",
  brandPrimary: "#187A26",
  paleGold: "#FAD080",
  brandSecondary: "#E68E1C",
  white: "#FFFFFF",
} as const;

/* ─── Gradient ────────────────────────────────────────────────────────────── */

/**
 * The client's "Option B" strip, sampled from the composite.
 *
 * ANGLE 55deg. Not left-to-right: navy sits bottom-left under the swoosh, the
 * top-left under the strap is already pure brand blue, gold lands top-right.
 * Tracing the iso-lines gives ~35 degrees above horizontal = 55deg in CSS.
 *
 * OPACITY 0.65, normal blend. The top-left corner is LIGHTER than #1685CC,
 * which multiply cannot produce. Three independent samples reconstruct to a
 * 0.60-0.70 overlay.
 */
export const OG_GRADIENT =
  `linear-gradient(55deg, ${OG_COLORS.gradientNavy} 0%, ` +
  `${OG_COLORS.brandPrimary} 42%, ${OG_COLORS.paleGold} 72%, ` +
  `${OG_COLORS.brandSecondary} 100%)`;
export const OG_GRADIENT_OPACITY = 0.65;

/* ─── Layout knobs ────────────────────────────────────────────────────────── */

/**
 * Photo crop. The photo is scaled to COVER the band, then scaled a little
 * further by PHOTO_ZOOM so there is horizontal overflow to play with, and the
 * overflow is placed by the two focus values (0 pins the left/top edge, 1 pins
 * the right/bottom edge).
 *
 * ZOOM 1.18 / FOCUS_X 1.0: the source has a white van parked at the left edge.
 * The band is width-bound at zoom 1, so it cannot be cropped out sideways —
 * the extra 18% gives ~215px of overflow, and pinning the right edge pushes
 * the van under the logo's halo. The composite hides it the same way.
 *
 * FOCUS_Y 0.08: keeps a band of sky above the roofline and drops most of the
 * dirt. Was 0.18 in an earlier pass, which ran the roof edge into the strap
 * on the left; lowering it bought ~40px of sky.
 */
const PHOTO_ZOOM = 1.18;
const PHOTO_FOCUS_X = 1.0;
const PHOTO_FOCUS_Y = 0.08;

/**
 * Logo placement, as fractions of the BAND, not the canvas. Left and bottom
 * insets are sampled (3.5%, 5%). Height is NOT the sampled 67%: that figure
 * was measured on the composite's 607px band, and on this shallower 502px
 * band it leaves the wordmark spanning only ~59% of the width against the
 * artwork's ~77%. 0.80 restores the artwork's horizontal presence (~70% of
 * width) while keeping ~75px of clear photo between the buildings and the
 * strap. It matters more here than on the page: feeds render this card at
 * ~500px wide, and the wordmark is the one thing that has to stay legible.
 */
const LOGO_HEIGHT_FRAC = 0.8;
const LOGO_LEFT_FRAC = 0.035;
const LOGO_BOTTOM_FRAC = 0.05;

/**
 * Height the logo ARTWORK is drawn at, in output pixels, excluding any halo
 * padding. Exported so the renderer can resize the logo to exactly this
 * BEFORE baking the halo — the halo has to be computed at output resolution,
 * or a glow that looks right on the 1733px source shrinks to a hairline once
 * the logo is scaled down ~3x to fit the band. The card then draws the haloed
 * image at its intrinsic size, 1:1, so nothing is resampled twice.
 */
export const LOGO_DRAW_HEIGHT = Math.round((OG_HEIGHT - STRAP_HEIGHT) * LOGO_HEIGHT_FRAC);

/** Strap type. 78px Barlow Semi Condensed 700 spans ~1040px for the default
 *  three words plus bars, leaving ~80px margin each side at 1200. */
const STRAP_FONT_SIZE = 64;
const STRAP_BAR_WIDTH = 8;
const STRAP_BAR_HEIGHT = 62;
const STRAP_BAR_GAP = 22;

/** Phone pill. Top-right is the only empty zone in the composite (pale-gold
 *  sky) and it never collides with the bottom-left logo. */
const PILL_FONT_SIZE = 38;
const PILL_ICON_SIZE = 34;
const PILL_INSET_X = 42;
const PILL_INSET_Y = 30;

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface SocialShareCardProps {
  /** data: URI of the background photograph, plus its intrinsic size. */
  photoSrc: string;
  photoWidth: number;
  photoHeight: number;
  /** data: URI of the HALOED logo PNG (see renderSocialShareCard.ts), already
   *  resized so the artwork is LOGO_DRAW_HEIGHT tall, plus its intrinsic size
   *  INCLUDING the halo padding and the padding itself. Drawn 1:1. */
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  logoPad: number;
  /** Strap words, left to right. Rendered uppercase with bar separators. */
  services?: readonly string[];
  /** Phone number as it should READ. Pixels, not a link — but it is the
   *  number people will dial from the preview card, so it must be the real
   *  one. Defaults to CLIENT.contact.phoneDisplay. */
  phoneDisplay?: string;
}

/* ─── Sub-parts ───────────────────────────────────────────────────────────── */

/** Same solid handset HeroWrapper draws. Satori accepts inline <svg>. */
function SolidPhoneIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.95 21c-2.08 0-4.74-.85-7.42-2.41-2.57-1.49-4.99-3.61-6.81-5.97C3.86 10.21 2.96 7.88 3 6.04c.02-1 .73-1.87 1.7-2.06l2.67-.53c.88-.18 1.75.27 2.15 1.07l1.24 2.49c.33.66.22 1.45-.27 2l-1.26 1.42a.75.75 0 0 0-.09.92c.78 1.19 1.77 2.27 2.95 3.22 1.16.94 2.41 1.7 3.71 2.28a.75.75 0 0 0 .89-.2l1.18-1.39c.52-.61 1.38-.84 2.13-.57l2.61.94c.88.32 1.41 1.22 1.28 2.15l-.38 2.71A2.12 2.12 0 0 1 19.95 21Z" />
    </svg>
  );
}

/* ─── Card ────────────────────────────────────────────────────────────────── */

export function SocialShareCard({
  photoSrc,
  photoWidth,
  photoHeight,
  logoSrc,
  logoWidth,
  logoHeight,
  logoPad,
  services = ["Removal", "Trimming", "Cleanup"],
  phoneDisplay = CLIENT.contact.phoneDisplay,
}: SocialShareCardProps) {
  const bandHeight = OG_HEIGHT - STRAP_HEIGHT;

  /*
    Cover-fit the photo by hand (Satori has no object-fit). Scale so the photo
    covers the band on both axes, zoom a little further, then place the
    overflow on each axis per the focus values.
  */
  const photoScale =
    Math.max(OG_WIDTH / photoWidth, bandHeight / photoHeight) * PHOTO_ZOOM;
  const drawnPhotoW = Math.ceil(photoWidth * photoScale);
  const drawnPhotoH = Math.ceil(photoHeight * photoScale);
  const photoLeft = Math.round((OG_WIDTH - drawnPhotoW) * PHOTO_FOCUS_X);
  const photoTop = Math.round((bandHeight - drawnPhotoH) * PHOTO_FOCUS_Y);

  /*
    The haloed logo is drawn at its intrinsic size (the renderer already sized
    the artwork to LOGO_DRAW_HEIGHT). The sampled left/bottom insets describe
    where the ARTWORK's corner lands, so the image box is shifted out by the
    halo padding to put the artwork — not the glow — at that point.
  */
  const logoLeft = Math.round(OG_WIDTH * LOGO_LEFT_FRAC) - logoPad;
  const logoBottom = Math.round(bandHeight * LOGO_BOTTOM_FRAC) - logoPad;

  /* Strap children: word, bar, word, bar, word. Built as a flat array
     because Satori wants a flex parent with plain element children. */
  const strapChildren: React.ReactNode[] = [];
  services.forEach((word, i) => {
    if (i > 0) {
      strapChildren.push(
        <div
          key={`bar-${i}`}
          style={{
            width: STRAP_BAR_WIDTH,
            height: STRAP_BAR_HEIGHT,
            marginLeft: STRAP_BAR_GAP,
            marginRight: STRAP_BAR_GAP,
            backgroundColor: OG_COLORS.white,
          }}
        />,
      );
    }
    strapChildren.push(
      <div
        key={word}
        style={{
          color: OG_COLORS.white,
          fontSize: STRAP_FONT_SIZE,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: -0.5,
          textTransform: "uppercase",
        }}
      >
        {word}
      </div>,
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: OG_COLORS.strapNavy,
        fontFamily: "Zilla Slab",
      }}
    >
      {/* STRAP */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: OG_WIDTH,
          height: STRAP_HEIGHT,
          backgroundColor: OG_COLORS.strapNavy,
        }}
      >
        {strapChildren}
      </div>

      {/* PHOTO BAND */}
      <div
        style={{
          position: "relative",
          display: "flex",
          width: OG_WIDTH,
          height: bandHeight,
          overflow: "hidden",
          backgroundColor: OG_COLORS.brandPrimary,
        }}
      >
        <img
          src={photoSrc}
          width={drawnPhotoW}
          height={drawnPhotoH}
          style={{ position: "absolute", left: photoLeft, top: photoTop }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: OG_WIDTH,
            height: bandHeight,
            backgroundImage: OG_GRADIENT,
            opacity: OG_GRADIENT_OPACITY,
          }}
        />

        <img
          src={logoSrc}
          width={logoWidth}
          height={logoHeight}
          style={{ position: "absolute", left: logoLeft, bottom: logoBottom }}
        />

        {/* PHONE PILL */}
        <div
          style={{
            position: "absolute",
            right: PILL_INSET_X,
            top: PILL_INSET_Y,
            display: "flex",
            alignItems: "center",
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 28,
            paddingRight: 30,
            borderRadius: 999,
            backgroundColor: OG_COLORS.strapNavy,
            color: OG_COLORS.white,
            fontSize: PILL_FONT_SIZE,
            fontWeight: 700,
            lineHeight: 1,
            boxShadow: "0 6px 18px rgba(0,0,0,0.30)",
          }}
        >
          <SolidPhoneIcon size={PILL_ICON_SIZE} />
          <div style={{ marginLeft: 14 }}>{phoneDisplay}</div>
        </div>
      </div>
    </div>
  );
}
