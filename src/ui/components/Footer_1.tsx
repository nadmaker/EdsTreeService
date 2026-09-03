"use client";
/*
 * Documentation:
 * Footer_1 — https://app.subframe.com/1a65819b7181/library?component=Footer_1_c028a514-432b-4f67-8117-2be0145e9888
 */

import React from "react";
import { FeatherAtSign } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherHousePlug } from "@subframe/core";
import * as SubframeUtils from "../utils";

interface Footer_1RootProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string;
  tagline?: React.ReactNode;
  companyLinks?: React.ReactNode;
  servicesLinks?: React.ReactNode;
  ctaTitle?: React.ReactNode;
  ctaDescription?: React.ReactNode;
  ctaButton?: React.ReactNode;
  socialIcons?: React.ReactNode;
  email?: React.ReactNode;
  addressLine1?: React.ReactNode;
  addressLine2?: React.ReactNode;
  copyright?: React.ReactNode;
  designerName?: React.ReactNode;
  className?: string;
}

const Footer_1Root = React.forwardRef<HTMLDivElement, Footer_1RootProps>(
  function Footer_1Root(
    {
      logo,
      tagline,
      companyLinks,
      servicesLinks,
      ctaTitle,
      ctaDescription,
      ctaButton,
      socialIcons,
      email,
      addressLine1,
      addressLine2,
      copyright,
      designerName,
      className,
      ...otherProps
    }: Footer_1RootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "container max-w-none flex w-full flex-col items-center gap-10",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <div className="flex w-full flex-wrap items-start justify-between">
          <div className="flex max-w-[240px] flex-col items-center gap-4 text-center">
            {logo ? (
              <img className="h-48 w-48 flex-none object-contain" src={logo} />
            ) : null}
            {tagline ? (
              <span className="text-body-bold font-body-bold text-default-font">
                {tagline}
              </span>
            ) : null}
          </div>
          <div className="flex grow shrink-0 basis-0 flex-wrap items-start gap-16">
            <div className="flex grow shrink-0 basis-0 items-start justify-center gap-16">
              <div className="flex flex-col items-start gap-6">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Company
                </span>
                {companyLinks ? (
                  <div className="flex flex-col items-start gap-3">
                    {companyLinks}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-start gap-6">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Services
                </span>
                {servicesLinks ? (
                  <div className="flex flex-col items-start gap-3">
                    {servicesLinks}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex max-w-[384px] grow shrink-0 basis-0 flex-col items-start gap-6">
              {ctaTitle ? (
                <span className="text-heading-3 font-heading-3 text-default-font">
                  {ctaTitle}
                </span>
              ) : null}
              {ctaDescription ? (
                <span className="text-body font-body text-neutral-600">
                  {ctaDescription}
                </span>
              ) : null}
              {ctaButton ? (
                <div className="flex w-full flex-col items-start gap-6">
                  {ctaButton}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
        <div className="flex w-full items-center justify-between">
          {socialIcons ? (
            <div className="flex items-center gap-4">{socialIcons}</div>
          ) : null}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-900">
                <FeatherAtSign className="text-heading-3 font-heading-3 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-caption font-caption text-neutral-500">
                  Connected With Us Now!
                </span>
                {email ? (
                  <span className="text-body font-body text-default-font">
                    {email}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-900">
                <FeatherGlobe className="text-heading-3 font-heading-3 text-white" />
              </div>
              <div className="flex flex-col items-start">
                {addressLine1 ? (
                  <span className="text-body font-body text-default-font">
                    {addressLine1}
                  </span>
                ) : null}
                {addressLine2 ? (
                  <span className="text-body font-body text-default-font">
                    {addressLine2}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
        <div className="flex w-full items-center justify-between">
          {copyright ? (
            <span className="text-body font-body text-neutral-500">
              {copyright}
            </span>
          ) : null}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-body font-body text-neutral-500">
              Website Designed With
            </span>
            {designerName ? (
              <span className="text-body font-body text-default-font underline cursor-pointer hover:text-neutral-600">
                {designerName}
              </span>
            ) : null}
            <FeatherHousePlug className="text-body font-body text-error-600" />
          </div>
        </div>
      </div>
    );
  }
);

export const Footer_1 = Footer_1Root;
