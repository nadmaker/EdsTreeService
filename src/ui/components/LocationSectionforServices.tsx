"use client";
/*
 * Documentation:
 * LocationSectionforServices — https://app.subframe.com/1a65819b7181/library?component=LocationSectionforServices_87ab9fc1-3ea7-44d9-a45d-21d164c60a85
 */

import React from "react";
import { FeatherMapPin } from "@subframe/core";
import { FeatherPlus } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface LocationSectionforServicesRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  mapImage?: string;
  mapIcon?: React.ReactNode;
  locationIcon?: React.ReactNode;
  locationName?: React.ReactNode;
  expandIcon?: React.ReactNode;
  className?: string;
}

const LocationSectionforServicesRoot = React.forwardRef<
  HTMLDivElement,
  LocationSectionforServicesRootProps
>(function LocationSectionforServicesRoot(
  {
    title,
    mapImage,
    mapIcon = <FeatherMapPin />,
    locationIcon = <FeatherMapPin />,
    locationName,
    expandIcon = <FeatherPlus />,
    className,
    ...otherProps
  }: LocationSectionforServicesRootProps,
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
      <div className="flex w-full flex-col items-start gap-8">
        <div className="flex w-full flex-col items-start gap-2">
          {title ? (
            <span className="text-heading-2 font-heading-2 text-neutral-900 uppercase">
              {title}
            </span>
          ) : null}
        </div>
        <div className="flex h-80 w-full flex-none items-start overflow-hidden rounded-md border border-solid border-neutral-200 bg-neutral-100 relative">
          {mapImage ? (
            <img
              className="grow shrink-0 basis-0 self-stretch object-cover opacity-80 grayscale"
              src={mapImage}
            />
          ) : null}
          <div className="flex items-center justify-center absolute inset-0">
            {mapIcon ? (
              <SubframeCore.IconWrapper className="text-body font-body text-error-600 h-10 w-10 fill-white">
                {mapIcon}
              </SubframeCore.IconWrapper>
            ) : null}
          </div>
        </div>
        <div className="flex w-full items-center justify-between rounded-md border border-solid border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-neutral-900">
              {locationIcon ? (
                <SubframeCore.IconWrapper className="text-body font-body text-white h-3 w-3">
                  {locationIcon}
                </SubframeCore.IconWrapper>
              ) : null}
            </div>
            {locationName ? (
              <span className="text-body-bold font-body-bold text-neutral-900 uppercase">
                {locationName}
              </span>
            ) : null}
          </div>
          {expandIcon ? (
            <SubframeCore.IconWrapper className="text-body font-body text-neutral-400">
              {expandIcon}
            </SubframeCore.IconWrapper>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const LocationSectionforServices = LocationSectionforServicesRoot;
