"use client";
/*
 * Documentation:
 * INFO_SEC1_330 — https://app.subframe.com/1a65819b7181/library?component=INFO_SEC1_330_e711fe56-d0d2-4519-9d55-a8f59b8da89a
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface Info_Sec1_330RootProps extends React.HTMLAttributes<HTMLDivElement> {
  mainTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  introDescription?: React.ReactNode;
  ctaButton?: React.ReactNode;
  ctaFollowupText?: React.ReactNode;
  serviceSectionTitle?: React.ReactNode;
  serviceSectionIntro?: React.ReactNode;
  serviceItems?: React.ReactNode;
  className?: string;
}

const Info_Sec1_330Root = React.forwardRef<
  HTMLDivElement,
  Info_Sec1_330RootProps
>(function Info_Sec1_330Root(
  {
    mainTitle,
    subtitle,
    introDescription,
    ctaButton,
    ctaFollowupText,
    serviceSectionTitle,
    serviceSectionIntro,
    serviceItems,
    className,
    ...otherProps
  }: Info_Sec1_330RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "container max-w-none flex h-full w-full flex-col items-end gap-4 bg-default-background py-12",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-2">
          {mainTitle ? (
            <span className="font-['Inter'] text-[36px] font-[700] leading-[44px] text-neutral-900 text-center">
              {mainTitle}
            </span>
          ) : null}
          {subtitle ? (
            <span className="font-['Inter'] text-[28px] font-[500] leading-[36px] text-brand-600 text-center">
              {subtitle}
            </span>
          ) : null}
        </div>
        <div className="flex max-w-[1024px] flex-col items-center gap-4">
          {introDescription ? (
            <span className="w-full font-['Inter'] text-[16px] font-[400] leading-[26px] text-neutral-800 text-center">
              {introDescription}
            </span>
          ) : null}
          <div className="flex w-full items-center justify-center gap-1">
            {ctaButton ? (
              <div className="flex items-center justify-center gap-1">
                {ctaButton}
              </div>
            ) : null}
            {ctaFollowupText ? (
              <span className="font-['Inter'] text-[16px] font-[400] leading-[26px] text-neutral-900">
                {ctaFollowupText}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-8 pt-6">
          {serviceSectionTitle ? (
            <span className="font-['Inter'] text-[32px] font-[500] leading-[40px] text-brand-600 text-center">
              {serviceSectionTitle}
            </span>
          ) : null}
          <div className="flex w-full max-w-[768px] flex-col items-center gap-4">
            <div className="flex w-full flex-col items-start gap-6 pt-4">
              {serviceSectionIntro ? (
                <span className="font-body text-default-font text-center leading-relaxed">
                  {serviceSectionIntro}
                </span>
              ) : null}
              {serviceItems ? (
                <div className="flex w-full flex-col items-start gap-6">
                  {serviceItems}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const Info_Sec1_330 = Info_Sec1_330Root;
