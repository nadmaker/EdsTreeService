"use client";
/*
 * Documentation:
 * TopOverlayWButtons — https://app.subframe.com/1a65819b7181/library?component=TopOverlayWButtons_7d5f8bf1-c9d2-4587-ad8f-0f53d200208d
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface TopOverlayWButtonsRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const TopOverlayWButtonsRoot = React.forwardRef<
  HTMLDivElement,
  TopOverlayWButtonsRootProps
>(function TopOverlayWButtonsRoot(
  { className, ...otherProps }: TopOverlayWButtonsRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex items-start bg-[#000000] absolute inset-0 opacity-50",
        className
      )}
      ref={ref}
      {...otherProps}
    />
  );
});

export const TopOverlayWButtons = TopOverlayWButtonsRoot;
