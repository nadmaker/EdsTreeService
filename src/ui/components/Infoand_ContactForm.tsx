"use client";
/*
 * Documentation:
 * infoand_ContactForm — https://app.subframe.com/1a65819b7181/library?component=infoand_ContactForm_d72cf48b-df88-49c2-99c4-3c7f640ad4a5
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface Infoand_ContactFormRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  phoneLabel?: React.ReactNode;
  phoneNumber?: React.ReactNode;
  emailLabel?: React.ReactNode;
  emailAddress?: React.ReactNode;
  officeHoursLabel?: React.ReactNode;
  officeHours?: React.ReactNode;
  currentTime?: React.ReactNode;
  emergencyLabel?: React.ReactNode;
  emergencyText1?: React.ReactNode;
  emergencyLinkText?: React.ReactNode;
  emergencyText2?: React.ReactNode;
  form?: React.ReactNode;
  className?: string;
}

const Infoand_ContactFormRoot = React.forwardRef<
  HTMLDivElement,
  Infoand_ContactFormRootProps
>(function Infoand_ContactFormRoot(
  {
    title,
    description,
    phoneLabel,
    phoneNumber,
    emailLabel,
    emailAddress,
    officeHoursLabel,
    officeHours,
    currentTime,
    emergencyLabel,
    emergencyText1,
    emergencyLinkText,
    emergencyText2,
    form,
    className,
    ...otherProps
  }: Infoand_ContactFormRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start bg-neutral-600 px-12 py-16",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full max-w-[1280px] items-start gap-12">
        <div className="flex flex-col items-start gap-6 flex-1">
          {title ? (
            <span className="text-heading-1 font-heading-1 text-neutral-0">
              {title}
            </span>
          ) : null}
          {description ? (
            <span className="text-body font-body text-neutral-0">
              {description}
            </span>
          ) : null}
          <div className="flex flex-col items-start gap-1">
            {phoneLabel ? (
              <span className="text-body font-body text-neutral-0">
                {phoneLabel}
              </span>
            ) : null}
            {phoneNumber ? (
              <span className="text-body font-body text-neutral-0">
                {phoneNumber}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1">
            {emailLabel ? (
              <span className="text-body font-body text-neutral-0">
                {emailLabel}
              </span>
            ) : null}
            {emailAddress ? (
              <span className="text-body font-body text-neutral-0">
                {emailAddress}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1">
            {officeHoursLabel ? (
              <span className="text-body font-body text-neutral-0">
                {officeHoursLabel}
              </span>
            ) : null}
            {officeHours ? (
              <span className="text-body font-body text-neutral-0">
                {officeHours}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1">
            {emergencyLabel ? (
              <span className="text-body font-body text-neutral-0">
                {emergencyLabel}
              </span>
            ) : null}
            {emergencyText1 ? (
              <span className="text-body font-body text-neutral-0">
                {emergencyText1}
              </span>
            ) : null}
          </div>
        </div>
        {form ? (
          <div className="flex grow shrink-0 basis-0 items-start gap-12">
            {form}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const Infoand_ContactForm = Infoand_ContactFormRoot;
