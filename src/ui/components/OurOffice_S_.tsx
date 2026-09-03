"use client";
/*
 * Documentation:
 * Our Office_s_ — https://app.subframe.com/1a65819b7181/library?component=Our+Office_s__7b50f842-97eb-46af-944b-0539fd0c85c4
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface OurOffice_S_RootProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionTitle?: React.ReactNode;
  officeName?: React.ReactNode;
  addressLine1?: React.ReactNode;
  addressLine2?: React.ReactNode;
  directionsLink?: React.ReactNode;
  className?: string;
}

const OurOffice_S_Root = React.forwardRef<
  HTMLDivElement,
  OurOffice_S_RootProps
>(function OurOffice_S_Root(
  {
    sectionTitle,
    officeName,
    addressLine1,
    addressLine2,
    directionsLink,
    className,
    ...otherProps
  }: OurOffice_S_RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start bg-neutral-0 px-12 py-16",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-8">
        {sectionTitle ? (
          <span className="text-heading-1 font-heading-1 text-neutral-900">
            {sectionTitle}
          </span>
        ) : null}
        <div className="flex flex-col items-start gap-3">
          {officeName ? (
            <span className="font-['Work_Sans'] text-[16px] font-[700] leading-[20px] text-neutral-900">
              {officeName}
            </span>
          ) : null}
          <div className="flex flex-col items-start">
            {addressLine1 ? (
              <span className="text-body font-body text-neutral-700">
                {addressLine1}
              </span>
            ) : null}
            {addressLine2 ? (
              <span className="text-body font-body text-neutral-700">
                {addressLine2}
              </span>
            ) : null}
          </div>
          {directionsLink ? (
            <div className="flex flex-col items-start gap-3">
              {directionsLink}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const OurOffice_S_ = OurOffice_S_Root;
