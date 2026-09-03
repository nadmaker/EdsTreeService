"use client";
/*
 * Documentation:
 * FULLSTRETCHFAQ — https://app.subframe.com/1a65819b7181/library?component=FULLSTRETCHFAQ_e7187cf5-1641-483e-80d1-5ef1820fc83a
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface FullstretchfaqRootProps extends React.HTMLAttributes<HTMLDivElement> {
  titlePrefix?: React.ReactNode;
  titleHighlight?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  faqItems?: React.ReactNode;
  className?: string;
}

const FullstretchfaqRoot = React.forwardRef<
  HTMLDivElement,
  FullstretchfaqRootProps
>(function FullstretchfaqRoot(
  {
    titlePrefix,
    titleHighlight,
    titleSuffix,
    faqItems,
    className,
    ...otherProps
  }: FullstretchfaqRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center px-6 py-20",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full max-w-[1024px] flex-col items-center gap-12">
        <div className="flex flex-wrap items-center justify-center gap-x-2">
          {titlePrefix ? (
            <span className="font-['Work_Sans'] text-[36px] font-[700] leading-[42px] text-neutral-900 text-center uppercase">
              {titlePrefix}
            </span>
          ) : null}
          {titleHighlight ? (
            <span className="font-['Work_Sans'] text-[36px] font-[700] leading-[42px] text-[#cc0000] text-center italic uppercase">
              {titleHighlight}
            </span>
          ) : null}
          {titleSuffix ? (
            <span className="font-['Work_Sans'] text-[36px] font-[700] leading-[42px] text-neutral-900 text-center uppercase">
              {titleSuffix}
            </span>
          ) : null}
        </div>
        {faqItems ? (
          <div className="flex w-full flex-col items-start gap-4">
            {faqItems}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const Fullstretchfaq = FullstretchfaqRoot;
