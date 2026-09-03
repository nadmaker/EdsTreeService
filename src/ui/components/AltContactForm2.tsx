"use client";
/*
 * Documentation:
 * AltContactForm2 — https://app.subframe.com/1a65819b7181/library?component=AltContactForm2_83512192-7937-43f6-aea4-ef8a3aefdd40
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface AltContactForm2RootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  badge?: React.ReactNode;
  title?: React.ReactNode;
  services?: React.ReactNode;
  formTitle?: React.ReactNode;
  form?: React.ReactNode;
  disclaimer?: React.ReactNode;
  className?: string;
}

const AltContactForm2Root = React.forwardRef<
  HTMLDivElement,
  AltContactForm2RootProps
>(function AltContactForm2Root(
  {
    badge,
    title,
    services,
    formTitle,
    form,
    disclaimer,
    className,
    ...otherProps
  }: AltContactForm2RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start overflow-hidden rounded-lg bg-white shadow-lg",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full items-start mobile:flex-col">
        <div className="hidden grow shrink-0 basis-0 flex-col items-start gap-2 px-2 py-2 mobile:flex" />
        <div className="flex flex-col items-start gap-8 px-12 py-12 flex-1 mobile:w-full mobile:grow mobile:shrink-0 mobile:basis-0">
          {badge ? (
            <span className="text-body-bold font-body-bold text-neutral-900">
              {badge}
            </span>
          ) : null}
          {title ? (
            <span className="text-heading-1 font-heading-1 text-[#0056b3]">
              {title}
            </span>
          ) : null}
          <span className="hidden text-heading-1 font-heading-1 text-[#0056b3] mobile:inline mobile:text-body-bold mobile:font-body-bold">
            Select your service
          </span>
          {services ? (
            <div className="flex w-full flex-col items-start gap-6 mobile:gap-4">
              {services}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-6 bg-neutral-100 px-12 py-12 flex-1">
          {formTitle ? (
            <span className="w-full text-heading-2 font-heading-2 text-neutral-900 text-center">
              {formTitle}
            </span>
          ) : null}
          {form ? (
            <div className="flex w-full flex-col items-start gap-4">{form}</div>
          ) : null}
          {disclaimer ? (
            <span className="text-caption font-caption text-neutral-500">
              {disclaimer}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const AltContactForm2 = AltContactForm2Root;
