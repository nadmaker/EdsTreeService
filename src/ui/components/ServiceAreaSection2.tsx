"use client";
/*
 * Documentation:
 * ServiceAreaSection 2 — https://app.subframe.com/1a65819b7181/library?component=ServiceAreaSection+2_e9554dde-c6f6-4f54-b7ad-b0b7e157cf15
 */

import React from "react";
import { FeatherClock } from "@subframe/core";
import { FeatherMailQuestion } from "@subframe/core";
import { FeatherPhone } from "@subframe/core";
import { FeatherStar } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface SubcomponentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Subcomponent = React.forwardRef<HTMLDivElement, SubcomponentProps>(
  function Subcomponent({ className, ...otherProps }: SubcomponentProps, ref) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex flex-col items-start gap-2",
          className
        )}
        ref={ref}
        {...otherProps}
      />
    );
  }
);

interface ServiceAreaSection2RootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  headline?: React.ReactNode;
  supportingLine?: React.ReactNode;
  descriptionParagraphs?: React.ReactNode;
  calloutIcon?: React.ReactNode;
  calloutTitle?: React.ReactNode;
  calloutDescription?: React.ReactNode;
  areaTitle?: React.ReactNode;
  openHours?: React.ReactNode;
  phoneNumber?: React.ReactNode;
  address?: React.ReactNode;
  serviceAreasTitle?: React.ReactNode;
  locationsSlot?: React.ReactNode;
  readmorerow?: React.ReactNode;
  locationsrow?: React.ReactNode;
  readMoreExpanded?: React.ReactNode;
  locationsRowExpanded?: React.ReactNode;
  newestmapslot?: React.ReactNode;
  firstThreecitesslot?: React.ReactNode;
  className?: string;
}

const ServiceAreaSection2Root = React.forwardRef<
  HTMLDivElement,
  ServiceAreaSection2RootProps
>(function ServiceAreaSection2Root(
  {
    headline,
    supportingLine,
    descriptionParagraphs,
    calloutIcon = <FeatherStar />,
    calloutTitle,
    calloutDescription,
    areaTitle,
    openHours,
    phoneNumber,
    address,
    serviceAreasTitle,
    locationsSlot,
    readmorerow,
    locationsrow,
    readMoreExpanded,
    locationsRowExpanded,
    newestmapslot,
    firstThreecitesslot,
    className,
    ...otherProps
  }: ServiceAreaSection2RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start justify-end",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="container max-w-none flex w-full items-start gap-8 py-12 mobile:flex-col mobile:gap-2 mobile:pt-24">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 pr-8 mobile:px-6 mobile:py-6">
          {headline ? (
            <span className="w-full text-heading-1 font-heading-1 text-default-font">
              {headline}
            </span>
          ) : null}
          {supportingLine ? (
            <span className="w-full text-heading-2 font-heading-2 text-brand-primary">
              {supportingLine}
            </span>
          ) : null}
          <span className="w-full text-body font-body text-subtext-color">
            This is a short paragraph explaining the purpose of this section. It
            provides general information about services and value propositions
            without specific details. The content here is designed to give
            visitors an overview of what to expect.
          </span>
          <span className="w-full text-body font-body text-subtext-color">
            Another paragraph of placeholder text continues the description.
            This section offers additional context and helps establish
            credibility. The information presented here reinforces the main
            message while maintaining a professional tone throughout.
          </span>
          {descriptionParagraphs ? (
            <span className="w-full text-body font-body text-subtext-color">
              {descriptionParagraphs}
            </span>
          ) : null}
          <div className="flex w-full items-center gap-6 rounded-md border border-solid border-brand-primary bg-neutral-50 px-6 py-4">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-md bg-neutral-200">
              {calloutIcon ? (
                <SubframeCore.IconWrapper className="text-heading-1 font-heading-1 text-brand-primary">
                  {calloutIcon}
                </SubframeCore.IconWrapper>
              ) : null}
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
              {calloutTitle ? (
                <span className="w-full text-body-bold font-body-bold text-default-font">
                  {calloutTitle}
                </span>
              ) : null}
              {calloutDescription ? (
                <span className="w-full text-body font-body text-subtext-color">
                  {calloutDescription}
                </span>
              ) : null}
            </div>
          </div>
          {readmorerow ? (
            <div className="flex w-full items-center justify-between border-t border-solid border-neutral-border pt-4">
              {readmorerow}
            </div>
          ) : null}
          {readMoreExpanded ? (
            <div className="flex w-full flex-col items-start gap-2 px-2 py-2">
              {readMoreExpanded}
            </div>
          ) : null}
        </div>
        <div className="flex max-w-[448px] grow shrink-0 basis-0 flex-col items-start gap-6 mobile:px-6 mobile:py-6 mobile:max-w-full">
          {newestmapslot ? (
            <div className="flex h-64 w-full flex-none flex-col items-start rounded-sm mobile:grow mobile:shrink-0 mobile:basis-0">
              {newestmapslot}
            </div>
          ) : null}
          {areaTitle ? (
            <span className="w-full text-heading-3 font-heading-3 text-default-font">
              {areaTitle}
            </span>
          ) : null}
          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <FeatherClock className="text-body font-body text-brand-primary" />
              {openHours ? (
                <span className="text-body font-body text-default-font">
                  {openHours}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <FeatherPhone className="text-body font-body text-brand-primary" />
              {phoneNumber ? (
                <span className="text-body font-body text-default-font">
                  {phoneNumber}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <FeatherMailQuestion className="text-body font-body text-brand-primary" />
              {address ? (
                <span className="text-body font-body text-default-font">
                  {address}
                </span>
              ) : null}
            </div>
          </div>
          {serviceAreasTitle ? (
            <span className="w-full text-heading-3 font-heading-3 text-default-font">
              {serviceAreasTitle}
            </span>
          ) : null}
          {firstThreecitesslot ? (
            <div className="flex w-full flex-col items-start gap-6">
              {firstThreecitesslot}
            </div>
          ) : null}
          {locationsrow ? (
            <div className="flex w-full items-center justify-between border-t border-solid border-neutral-border pt-4">
              {locationsrow}
            </div>
          ) : null}
          {locationsRowExpanded ? (
            <div className="flex w-full flex-col items-start gap-2 px-2 py-2">
              {locationsRowExpanded}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const ServiceAreaSection2 = Object.assign(ServiceAreaSection2Root, {
  Subcomponent,
});
