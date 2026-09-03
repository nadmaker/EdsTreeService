"use client";
/*
 * Documentation:
 * INFO_IMAGE COLUMN — https://app.subframe.com/1a65819b7181/library?component=INFO_IMAGE+COLUMN_80d25186-4e7a-47f0-b8e9-46f2ed36e313
 */

import React from "react";
import { FeatherTreeDeciduous } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface Info_ImageColumnRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  image?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  ctaButton?: React.ReactNode;
  className?: string;
}

const Info_ImageColumnRoot = React.forwardRef<
  HTMLDivElement,
  Info_ImageColumnRootProps
>(function Info_ImageColumnRoot(
  {
    image,
    icon = <FeatherTreeDeciduous />,
    title,
    subtitle,
    description,
    ctaButton,
    className,
    ...otherProps
  }: Info_ImageColumnRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-wrap items-start gap-12",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start relative">
        <div className="flex w-full items-start overflow-hidden rounded-lg border-4 border-dashed border-[#84cc16] relative">
          {image ? (
            <img className="min-w-[0px] grow shrink-0 basis-0" src={image} />
          ) : null}
        </div>
        <div className="flex h-16 w-16 flex-none items-center justify-center absolute -bottom-4 -left-4">
          {icon ? (
            <SubframeCore.IconWrapper className="font-['Work_Sans'] text-[64px] font-[400] leading-[96px] text-[#057a32]">
              {icon}
            </SubframeCore.IconWrapper>
          ) : null}
        </div>
      </div>
      <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start gap-6">
        {title ? (
          <span className="font-['Work_Sans'] text-[36px] font-[700] leading-[42px] text-[#057a32] uppercase -tracking-[0.02em]">
            {title}
          </span>
        ) : null}
        {subtitle ? (
          <span className="font-['Work_Sans'] text-[24px] font-[600] leading-[30px] text-[#16a34a]">
            {subtitle}
          </span>
        ) : null}
        {description ? (
          <span className="text-body font-body text-subtext-color">
            {description}
          </span>
        ) : null}
        {ctaButton ? (
          <div className="flex flex-col items-start gap-6">{ctaButton}</div>
        ) : null}
      </div>
    </div>
  );
});

export const Info_ImageColumn = Info_ImageColumnRoot;
