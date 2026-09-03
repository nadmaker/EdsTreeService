"use client";
/*
 * Documentation:
 * Service Guarantee and Features — https://app.subframe.com/1a65819b7181/library?component=Service+Guarantee+and+Features_202b711d-be24-4056-a5a9-8c7c8cf8a7f7
 */

import React from "react";
import { FeatherAward } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface ServiceGuaranteeAndFeaturesRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  badgeIcon?: React.ReactNode;
  badgeText?: React.ReactNode;
  features?: React.ReactNode;
  ctaButton?: React.ReactNode;
  className?: string;
}

const ServiceGuaranteeAndFeaturesRoot = React.forwardRef<
  HTMLDivElement,
  ServiceGuaranteeAndFeaturesRootProps
>(function ServiceGuaranteeAndFeaturesRoot(
  {
    image,
    badgeIcon = <FeatherAward />,
    badgeText,
    features,
    ctaButton,
    className,
    ...otherProps
  }: ServiceGuaranteeAndFeaturesRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[1280px] items-start gap-16 py-16 mobile:flex-col mobile:gap-8",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start gap-12 mobile:order-1">
        {features ? (
          <div className="w-full items-start grid grid-cols-2 gap-x-8 gap-y-12 mobile:grid mobile:gap-x-8 mobile:gap-y-12 mobile:grid-cols-1">
            {features}
          </div>
        ) : null}
        {ctaButton ? (
          <div className="flex flex-col items-start gap-12">{ctaButton}</div>
        ) : null}
      </div>
      <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start gap-8 mobile:order-2">
        <div className="flex flex-col items-start relative">
          {image ? (
            <img
              className="h-96 w-full flex-none rounded-lg object-cover"
              src={image}
            />
          ) : null}
          <div className="flex h-32 w-32 flex-none items-center justify-center rounded-full bg-success-700 shadow-lg absolute -right-4 top-8">
            <div className="flex flex-col items-center gap-1">
              {badgeIcon ? (
                <SubframeCore.IconWrapper className="text-heading-3 font-heading-3 text-white">
                  {badgeIcon}
                </SubframeCore.IconWrapper>
              ) : null}
              {badgeText ? (
                <span className="text-caption-bold font-caption-bold text-white text-center">
                  {badgeText}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const ServiceGuaranteeAndFeatures = ServiceGuaranteeAndFeaturesRoot;
