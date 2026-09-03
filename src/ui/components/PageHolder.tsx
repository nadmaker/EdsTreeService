"use client";
/*
 * Documentation:
 * Page Holder — https://app.subframe.com/1a65819b7181/library?component=Page+Holder_c3e58be7-ad58-4e36-87db-b33d4e91a2ed
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface PageHolderRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const PageHolderRoot = React.forwardRef<HTMLDivElement, PageHolderRootProps>(
  function PageHolderRoot(
    { className, ...otherProps }: PageHolderRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex cursor-pointer flex-col items-start gap-4",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <div className="flex flex-col items-start" />
      </div>
    );
  }
);

export const PageHolder = PageHolderRoot;
