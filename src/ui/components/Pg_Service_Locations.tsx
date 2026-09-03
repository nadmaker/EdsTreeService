"use client";
/*
 * Documentation:
 * PG_SERVICE_LOCATIONS — https://app.subframe.com/1a65819b7181/library?component=PG_SERVICE_LOCATIONS_24a489a9-a05f-4241-8872-3840671550bc
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface Pg_Service_LocationsRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  contentArea?: React.ReactNode;
  cityFooter?: React.ReactNode;
  className?: string;
}

const Pg_Service_LocationsRoot = React.forwardRef<
  HTMLDivElement,
  Pg_Service_LocationsRootProps
>(function Pg_Service_LocationsRoot(
  {
    contentArea,
    cityFooter,
    className,
    ...otherProps
  }: Pg_Service_LocationsRootProps,
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
          <span className="text-heading-2 font-heading-2 text-neutral-900 uppercase">
            Service area
          </span>
        </div>
        {contentArea ? (
          <div className="flex w-full flex-col items-start gap-8">
            {contentArea}
          </div>
        ) : null}
        {cityFooter ? (
          <div className="flex w-full flex-col items-start gap-8">
            {cityFooter}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const Pg_Service_Locations = Pg_Service_LocationsRoot;
