"use client";
/*
 * Documentation:
 * Title Block 1_1 — https://app.subframe.com/1a65819b7181/library?component=Title+Block+1_1_76925dad-89a8-447f-8638-4adf56c9db81
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface TitleBlock1_1RootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

const TitleBlock1_1Root = React.forwardRef<
  HTMLDivElement,
  TitleBlock1_1RootProps
>(function TitleBlock1_1Root(
  { title, subtitle, className, ...otherProps }: TitleBlock1_1RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start gap-4 px-6 py-8",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {title ? (
        <span className="text-heading-1 font-heading-1 text-neutral-900">
          {title}
        </span>
      ) : null}
      {subtitle ? (
        <span className="text-body-bold font-body-bold text-neutral-600">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
});

export const TitleBlock1_1 = TitleBlock1_1Root;
