"use client";
/*
 * Documentation:
 * FinalSlimForm — https://app.subframe.com/1a65819b7181/library?component=FinalSlimForm_3ce5182d-d7f6-4161-9bf0-212e2962b479
 */

import React from "react";
import { FeatherMessageCircle } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface FinalSlimFormRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  fullNameField?: React.ReactNode;
  phoneField?: React.ReactNode;
  emailField?: React.ReactNode;
  addressField?: React.ReactNode;
  messageField?: React.ReactNode;
  submitButton?: React.ReactNode;
  className?: string;
}

const FinalSlimFormRoot = React.forwardRef<
  HTMLDivElement,
  FinalSlimFormRootProps
>(function FinalSlimFormRoot(
  {
    icon = <FeatherMessageCircle />,
    title,
    fullNameField,
    phoneField,
    emailField,
    addressField,
    messageField,
    submitButton,
    className,
    ...otherProps
  }: FinalSlimFormRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-center justify-center gap-12 rounded-lg bg-default-background px-6 py-6 shadow-md">
        <div className="flex w-full flex-col items-center justify-center gap-6">
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
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            {fullNameField ? (
              <div className="flex w-full flex-col items-start">
                {fullNameField}
              </div>
            ) : null}
            {phoneField ? (
              <div className="flex w-full flex-col items-start">
                {phoneField}
              </div>
            ) : null}
            {emailField ? (
              <div className="flex w-full flex-col items-start">
                {emailField}
              </div>
            ) : null}
            {addressField ? (
              <div className="flex w-full flex-col items-start">
                {addressField}
              </div>
            ) : null}
            {messageField ? (
              <div className="flex w-full flex-col items-center justify-center gap-6">
                {messageField}
              </div>
            ) : null}
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-6">
            {submitButton ? (
              <div className="flex w-full flex-col items-center justify-center gap-6">
                {submitButton}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});

export const FinalSlimForm = FinalSlimFormRoot;
