"use client";
/*
 * Documentation:
 * TallContactForm_TrueTemp — https://app.subframe.com/1a65819b7181/library?component=TallContactForm_TrueTemp_35476720-dc62-4152-a557-5df40b8b73e9
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface TallContactForm_TrueTempRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  formFields?: React.ReactNode;
  submitButton?: React.ReactNode;
  className?: string;
}

const TallContactForm_TrueTempRoot = React.forwardRef<
  HTMLDivElement,
  TallContactForm_TrueTempRootProps
>(function TallContactForm_TrueTempRoot(
  {
    formFields,
    submitButton,
    className,
    ...otherProps
  }: TallContactForm_TrueTempRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[768px] flex-col items-center justify-center gap-6 rounded-lg px-4 py-4 shadow-lg",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-start gap-2">
        <span className="text-heading-2 font-heading-2 text-default-font">
          Get Your Free Estimate
        </span>
        <span className="text-body font-body text-subtext-color">
          Fill out the form below and we&#39;ll get back to you shortly
        </span>
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        {formFields ? (
          <div className="flex w-full flex-col items-start gap-4">
            {formFields}
          </div>
        ) : null}
        <div className="flex w-full items-center justify-center">
          {submitButton ? (
            <div className="flex items-center justify-center">
              {submitButton}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const TallContactForm_TrueTemp = TallContactForm_TrueTempRoot;
