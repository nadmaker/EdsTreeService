"use client";
/*
 * Documentation:
 * Tall_LocalBenefitsSection — https://app.subframe.com/1a65819b7181/library?component=Tall_LocalBenefitsSection_785bcbb8-2592-4c3a-ad70-33c1b4e550bc
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface Tall_LocalBenefitsSectionRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  benefitCards?: React.ReactNode;
  className?: string;
}

const Tall_LocalBenefitsSectionRoot = React.forwardRef<
  HTMLDivElement,
  Tall_LocalBenefitsSectionRootProps
>(function Tall_LocalBenefitsSectionRoot(
  {
    title,
    description,
    benefitCards,
    className,
    ...otherProps
  }: Tall_LocalBenefitsSectionRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full items-start",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-8">
        {title ? (
          <span className="text-heading-1 font-heading-1 text-neutral-900">
            {title}
          </span>
        ) : null}
        {description ? (
          <span className="text-body font-body text-neutral-600">
            {description}
          </span>
        ) : null}
        {benefitCards ? (
          <div className="flex w-full flex-col items-start gap-4">
            {benefitCards}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const Tall_LocalBenefitsSection = Tall_LocalBenefitsSectionRoot;
