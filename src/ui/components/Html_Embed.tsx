"use client";
/*
 * Documentation:
 * Html_Embed — https://app.subframe.com/1a65819b7181/library?component=Html_Embed_7a5b9c7f-9869-4416-b1ba-73acdac87ae4
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface Html_EmbedRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const Html_EmbedRoot = React.forwardRef<HTMLDivElement, Html_EmbedRootProps>(
  function Html_EmbedRoot(
    { children, className, ...otherProps }: Html_EmbedRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeUtils.twClassNames(
          "flex flex-col items-start gap-2",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const Html_Embed = Html_EmbedRoot;
