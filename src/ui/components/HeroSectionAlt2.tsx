"use client";
/*
 * Documentation:
 * HeroSectionAlt2 — https://app.subframe.com/1a65819b7181/library?component=HeroSectionAlt2_d8a6ac21-88b2-482a-aafb-2af5aab48c15
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface HeroSectionAlt2RootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  backgroundImage?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  sideAction?: React.ReactNode;
  className?: string;
}

const HeroSectionAlt2Root = React.forwardRef<
  HTMLDivElement,
  HeroSectionAlt2RootProps
>(function HeroSectionAlt2Root(
  {
    backgroundImage,
    title,
    subtitle,
    primaryAction,
    secondaryAction,
    sideAction,
    className,
    ...otherProps
  }: HeroSectionAlt2RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex min-h-[576px] w-full items-center justify-center overflow-hidden bg-neutral-900 relative",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {backgroundImage ? (
        <img
          className="grow shrink-0 basis-0 absolute opacity-60"
          src={backgroundImage}
        />
      ) : null}
      <div className="container max-w-none flex grow shrink-0 basis-0 flex-col items-center justify-center self-stretch py-12 relative z-10">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-8">
          <div className="flex max-w-[576px] flex-col items-start gap-6">
            {title ? (
              <span className="text-heading-1 font-heading-1 text-white">
                {title}
              </span>
            ) : null}
            {subtitle ? (
              <span className="text-heading-3 font-heading-3 text-white">
                {subtitle}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {primaryAction ? (
              <div className="flex flex-wrap items-center gap-6">
                {primaryAction}
              </div>
            ) : null}
            {secondaryAction ? (
              <div className="flex flex-wrap items-center gap-6">
                {secondaryAction}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {sideAction ? (
        <div className="flex items-center justify-center">{sideAction}</div>
      ) : null}
    </div>
  );
});

export const HeroSectionAlt2 = HeroSectionAlt2Root;
