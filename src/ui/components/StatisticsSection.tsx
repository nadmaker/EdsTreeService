"use client";
/*
 * Documentation:
 * StatisticsSection — https://app.subframe.com/1a65819b7181/library?component=StatisticsSection_79a7f0c0-6489-4801-8dad-3dabaf707256
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface StatisticsSectionRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  statistics?: React.ReactNode;
  className?: string;
}

const StatisticsSectionRoot = React.forwardRef<
  HTMLDivElement,
  StatisticsSectionRootProps
>(function StatisticsSectionRoot(
  {
    heading,
    description,
    statistics,
    className,
    ...otherProps
  }: StatisticsSectionRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center gap-8 py-16",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex flex-col items-center gap-2">
        {heading ? (
          <span className="text-heading-1 font-heading-1 text-neutral-900">
            {heading}
          </span>
        ) : null}
        {description ? (
          <span className="max-w-[576px] text-body font-body text-neutral-600 text-center">
            {description}
          </span>
        ) : null}
      </div>
      <div className="flex w-full max-w-[1024px] items-center justify-between rounded-lg px-12 py-12 mobile:w-auto mobile:flex-none mobile:flex-col mobile:justify-center mobile:gap-8">
        {statistics ? (
          <div className="flex items-center justify-between mobile:w-full mobile:flex-none mobile:flex-col mobile:justify-center mobile:gap-4">
            {statistics}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export const StatisticsSection = StatisticsSectionRoot;
