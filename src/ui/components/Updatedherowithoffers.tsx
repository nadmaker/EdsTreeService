"use client";
/*
 * Documentation:
 * updatedherowithoffers — https://app.subframe.com/1a65819b7181/library?component=updatedherowithoffers_570b042b-2a61-4870-b192-7e6de34ac84d
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface UpdatedherowithoffersRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  primaryActionButton?: React.ReactNode;
  secondaryActionButton?: React.ReactNode;
  offerCards?: React.ReactNode;
  className?: string;
}

const UpdatedherowithoffersRoot = React.forwardRef<
  HTMLDivElement,
  UpdatedherowithoffersRootProps
>(function UpdatedherowithoffersRoot(
  {
    headline,
    subheadline,
    primaryActionButton,
    secondaryActionButton,
    offerCards,
    className,
    ...otherProps
  }: UpdatedherowithoffersRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center justify-center relative",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-center justify-center gap-8 px-6 relative z-10">
        <div className="flex flex-col items-center gap-4">
          {headline ? (
            <span className="text-heading-1 font-heading-1 text-white text-center">
              {headline}
            </span>
          ) : null}
          {subheadline ? (
            <span className="text-heading-2 font-heading-2 text-white text-center">
              {subheadline}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-center gap-4 mobile:w-full mobile:flex-none mobile:flex-col">
          {primaryActionButton ? (
            <div className="flex items-center justify-center gap-4 mobile:w-full mobile:flex-none">
              {primaryActionButton}
            </div>
          ) : null}
          {secondaryActionButton ? (
            <div className="flex items-center justify-center gap-4 mobile:w-full mobile:flex-none">
              {secondaryActionButton}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex w-full items-start justify-center gap-6 px-6 absolute bottom-0 z-20 translate-y-1/2 mobile:flex-col">
        <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6">
          {offerCards ? (
            <div className="flex grow shrink-0 basis-0 items-start justify-center gap-6 mobile:flex-col">
              {offerCards}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const Updatedherowithoffers = UpdatedherowithoffersRoot;
