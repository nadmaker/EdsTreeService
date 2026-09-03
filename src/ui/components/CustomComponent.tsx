"use client";
/*
 * Documentation:
 * Custom Component — https://app.subframe.com/1a65819b7181/library?component=Custom+Component_cd2bf2a1-12a2-4965-b358-9fbea1e8fd99
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface CustomComponentRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CustomComponentRoot = React.forwardRef<
  HTMLDivElement,
  CustomComponentRootProps
>(function CustomComponentRoot(
  { className, ...otherProps }: CustomComponentRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex flex-col items-start gap-2",
        className
      )}
      ref={ref}
      {...otherProps}
    />
  );
});

export const CustomComponent = CustomComponentRoot;
