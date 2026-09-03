"use client";
/*
 * Documentation:
 * HeroWithOfferCards 2 — https://app.subframe.com/1a65819b7181/library?component=HeroWithOfferCards+2_0bd4266c-68ff-4a00-a0db-038498a02323
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface HeroWithOfferCards2RootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  primaryActionButton?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  offerCards?: React.ReactNode;
  herowithoffercardsSlot?: React.ReactNode;
  className?: string;
}

const HeroWithOfferCards2Root = React.forwardRef<
  HTMLDivElement,
  HeroWithOfferCards2RootProps
>(function HeroWithOfferCards2Root(
  {
    headline,
    subheadline,
    primaryActionButton,
    secondaryAction,
    offerCards,
    herowithoffercardsSlot,
    className,
    ...otherProps
  }: HeroWithOfferCards2RootProps,
  ref
) {
  return herowithoffercardsSlot ? (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center justify-center relative bg-cover bg-center",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {herowithoffercardsSlot}
    </div>
  ) : null;
});

export const HeroWithOfferCards2 = HeroWithOfferCards2Root;
