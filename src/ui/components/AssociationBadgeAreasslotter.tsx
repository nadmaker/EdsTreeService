"use client";
/*
 * Documentation:
 * AssociationBadgeAreasslotter — https://app.subframe.com/1a65819b7181/library?component=AssociationBadgeAreasslotter_9daa2f6a-34c2-4667-bf54-0328e204fb00
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface AssociationBadgeAreasslotterRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
  logos?: React.ReactNode;
  className?: string;
}

const AssociationBadgeAreasslotterRoot = React.forwardRef<
  HTMLDivElement,
  AssociationBadgeAreasslotterRootProps
>(function AssociationBadgeAreasslotterRoot(
  {
    heading,
    logos,
    className,
    ...otherProps
  }: AssociationBadgeAreasslotterRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start justify-center bg-neutral-50 py-24",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="container max-w-none flex w-full flex-col items-center gap-10">
        {heading ? (
          <span className="w-full max-w-[1280px] text-heading-2 font-heading-2 text-default-font text-center">
            {heading}
          </span>
        ) : null}
        <div className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-12 opacity-60 grayscale">
          {logos ? (
            <div className="flex grow shrink-0 basis-0 flex-wrap items-center justify-center gap-12">
              {logos}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const AssociationBadgeAreasslotter = AssociationBadgeAreasslotterRoot;
