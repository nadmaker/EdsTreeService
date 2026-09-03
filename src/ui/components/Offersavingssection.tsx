"use client";
/*
 * Documentation:
 * OFFERSAVINGSSECTION — https://app.subframe.com/1a65819b7181/library?component=OFFERSAVINGSSECTION_40cb1cd3-8f87-4d37-a0f8-11a040ecb18b
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface OffersavingssectionRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  eyebrowText?: React.ReactNode;
  headingText?: React.ReactNode;
  dealCards?: React.ReactNode;
  className?: string;
}

const OffersavingssectionRoot = React.forwardRef<
  HTMLDivElement,
  OffersavingssectionRootProps
>(function OffersavingssectionRoot(
  {
    eyebrowText,
    headingText,
    dealCards,
    className,
    ...otherProps
  }: OffersavingssectionRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[1280px] flex-col items-center gap-12",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex flex-col items-center gap-2">
        {eyebrowText ? (
          <span className="text-caption font-caption text-[#e68c32] tracking-[0.15em] uppercase">
            {eyebrowText}
          </span>
        ) : null}
        {headingText ? (
          <span className="text-heading-1 font-heading-1 text-[#555555] text-center">
            {headingText}
          </span>
        ) : null}
      </div>
      <div className="w-full justify-center gap-6 items-stretch grid grid-cols-3">
        {dealCards ? (
          <div className="flex items-start gap-6">{dealCards}</div>
        ) : null}
      </div>
    </div>
  );
});

export const Offersavingssection = OffersavingssectionRoot;
