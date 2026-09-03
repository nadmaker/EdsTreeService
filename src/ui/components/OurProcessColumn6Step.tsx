"use client";
/*
 * Documentation:
 * Our Process Column 6 step — https://app.subframe.com/1a65819b7181/library?component=Our+Process+Column+6+step_c574526e-e5b4-46b9-b365-af89b0a69230
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface OurProcessColumn6StepRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  steps?: React.ReactNode;
  className?: string;
}

const OurProcessColumn6StepRoot = React.forwardRef<
  HTMLDivElement,
  OurProcessColumn6StepRootProps
>(function OurProcessColumn6StepRoot(
  { title, steps, className, ...otherProps }: OurProcessColumn6StepRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center bg-brand-200 px-12 py-20",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-12">
        {title ? (
          <span className="font-['Work_Sans'] text-[64px] font-[800] leading-[72px] text-neutral-0 text-center">
            {title}
          </span>
        ) : null}
        {steps ? <div className="flex items-start gap-6">{steps}</div> : null}
      </div>
    </div>
  );
});

export const OurProcessColumn6Step = OurProcessColumn6StepRoot;
