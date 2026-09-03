"use client";
/*
 * Documentation:
 * chechcheck — https://app.subframe.com/1a65819b7181/library?component=chechcheck_41a0ab28-56f3-4cc3-9175-ceb12e5e1f5b
 */

import React from "react";
import { FeatherMessageCircle } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface ChechcheckRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  fields?: React.ReactNode;
  submitButton?: React.ReactNode;
  className?: string;
}

const ChechcheckRoot = React.forwardRef<HTMLDivElement, ChechcheckRootProps>(
  function ChechcheckRoot(
    {
      icon = <FeatherMessageCircle />,
      title,
      fields,
      submitButton,
      className,
      ...otherProps
    }: ChechcheckRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full flex-col items-center justify-center gap-12 bg-default-background",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <div className="flex w-full max-w-[1280px] flex-col items-center justify-center gap-6">
          {icon ? (
            <SubframeCore.IconWrapper className="font-['Afacad_Flux'] text-[32px] font-[400] leading-[32px] text-default-font">
              {icon}
            </SubframeCore.IconWrapper>
          ) : null}
          {title ? (
            <span className="w-full font-['Inter'] text-[48px] font-[700] leading-[48px] text-default-font text-center tracking-[-0.035em]">
              {title}
            </span>
          ) : null}
        </div>
        <div className="flex w-full max-w-[768px] flex-col items-center justify-center gap-6">
          {fields ? (
            <div className="flex w-full flex-col items-center justify-center gap-6">
              {fields}
            </div>
          ) : null}
          {submitButton ? (
            <div className="flex w-full flex-col items-center justify-center gap-6">
              {submitButton}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

export const Chechcheck = ChechcheckRoot;
