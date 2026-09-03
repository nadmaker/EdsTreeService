"use client";
/*
 * Documentation:
 * ContacForm_ServicePGHolderJustNested — https://app.subframe.com/1a65819b7181/library?component=ContacForm_ServicePGHolderJustNested_437ea743-255d-478d-97a2-c1964de3b442
 */

import React from "react";
import { FeatherMessageCircle } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface ContacForm_ServicePgHolderJustNestedRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  fullNameField?: React.ReactNode;
  className?: string;
}

const ContacForm_ServicePgHolderJustNestedRoot = React.forwardRef<
  HTMLDivElement,
  ContacForm_ServicePgHolderJustNestedRootProps
>(function ContacForm_ServicePgHolderJustNestedRoot(
  {
    icon = <FeatherMessageCircle />,
    title,
    fullNameField,
    className,
    ...otherProps
  }: ContacForm_ServicePgHolderJustNestedRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex flex-col items-start gap-2",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-center gap-6">
        {icon ? (
          <SubframeCore.IconWrapper className="text-body font-body text-default-font">
            {icon}
          </SubframeCore.IconWrapper>
        ) : null}
        {title ? (
          <span className="w-full font-['Inter'] text-[32px] font-[600] leading-[40px] text-default-font text-center">
            {title}
          </span>
        ) : null}
      </div>
      {fullNameField ? (
        <div className="flex w-full flex-col items-start">{fullNameField}</div>
      ) : null}
      <div className="flex w-full flex-col items-start gap-2 px-2 py-2" />
    </div>
  );
});

export const ContacForm_ServicePgHolderJustNested =
  ContacForm_ServicePgHolderJustNestedRoot;
