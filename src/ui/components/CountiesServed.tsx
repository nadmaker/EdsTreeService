"use client";
/*
 * Documentation:
 * countiesServed — https://app.subframe.com/1a65819b7181/library?component=countiesServed_93ee88cc-0b40-45fb-85d6-1edfcba7189e
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface CountiesServedRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  locations?: React.ReactNode;
  linkText?: React.ReactNode;
  className?: string;
}

const CountiesServedRoot = React.forwardRef<
  HTMLDivElement,
  CountiesServedRootProps
>(function CountiesServedRoot(
  {
    title,
    locations,
    linkText,
    className,
    ...otherProps
  }: CountiesServedRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[1024px] items-center gap-12 mobile:flex-col",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-96 flex-none flex-col items-start gap-6 rounded-md bg-white px-10 py-10 shadow-lg mobile:w-full mobile:flex-none">
        {title ? (
          <span className="font-['Inter'] text-[30px] font-[500] leading-[36px] text-[#4b2e83] italic">
            {title}
          </span>
        ) : null}
        {locations ? (
          <span className="font-['Inter'] text-[14px] font-[400] leading-[24px] text-neutral-800">
            {locations}
          </span>
        ) : null}
        {linkText ? (
          <span className="font-['Inter'] text-[12px] font-[500] leading-[16px] tracking-wider text-[#d48806]">
            {linkText}
          </span>
        ) : null}
      </div>
      <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center" />
    </div>
  );
});

export const CountiesServed = CountiesServedRoot;
