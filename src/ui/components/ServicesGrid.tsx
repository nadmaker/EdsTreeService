"use client";
/*
 * Documentation:
 * ServicesGrid — https://app.subframe.com/1a65819b7181/library?component=ServicesGrid_b0e5121c-0eb2-48fd-87c7-d7414403d9e5
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface ServicesGridRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  services?: React.ReactNode;
  className?: string;
}

const ServicesGridRoot = React.forwardRef<
  HTMLDivElement,
  ServicesGridRootProps
>(function ServicesGridRoot(
  {
    title,
    description,
    services,
    className,
    ...otherProps
  }: ServicesGridRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center justify-center gap-12 px-6 py-16",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex flex-col items-center gap-2">
        {title ? (
          <span className="font-['Inter'] text-[30px] font-[600] leading-[36px] text-white text-center -tracking-[0.01em]">
            {title}
          </span>
        ) : null}
        {description ? (
          <span className="font-['Inter'] text-[14px] font-[400] leading-[20px] text-white text-center">
            {description}
          </span>
        ) : null}
      </div>
      {services ? (
        <div className="w-full max-w-[1024px] items-start gap-6 grid grid-cols-4 mobile:grid mobile:grid-cols-2">
          {services}
        </div>
      ) : null}
    </div>
  );
});

export const ServicesGrid = ServicesGridRoot;
