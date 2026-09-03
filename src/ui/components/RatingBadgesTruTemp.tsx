"use client";
/*
 * Documentation:
 * RatingBadgesTruTemp — https://app.subframe.com/1a65819b7181/library?component=RatingBadgesTruTemp_ee8d7437-dcff-4a7c-ba68-40428e56b66a
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface RatingBadgesTruTempRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ratings?: React.ReactNode;
  className?: string;
}

const RatingBadgesTruTempRoot = React.forwardRef<
  HTMLDivElement,
  RatingBadgesTruTempRootProps
>(function RatingBadgesTruTempRoot(
  { ratings, className, ...otherProps }: RatingBadgesTruTempRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex flex-col items-center justify-center gap-1 relative mobile:gap-0.5",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex items-center justify-center relative z-10 bg-neutral-900/40 backdrop-blur-sm">
        {ratings ? (
          <div className="flex items-center justify-center mobile:gap-6">
            {ratings}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const RatingBadgesTruTemp = RatingBadgesTruTempRoot;
