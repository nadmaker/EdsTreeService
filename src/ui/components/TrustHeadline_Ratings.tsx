"use client";
/*
 * Documentation:
 * Trust Headline _ RATINGS — https://app.subframe.com/1a65819b7181/library?component=Trust+Headline+_+RATINGS_55e39202-0582-4c14-946c-51057d5114d6
 */

import React from "react";
import { FeatherStar } from "@subframe/core";
import * as SubframeUtils from "../utils";

interface TrustHeadline_RatingsRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  badgeText?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  rating?: React.ReactNode;
  ratingSubtext?: React.ReactNode;
  avatars?: React.ReactNode;
  className?: string;
}

const TrustHeadline_RatingsRoot = React.forwardRef<
  HTMLDivElement,
  TrustHeadline_RatingsRootProps
>(function TrustHeadline_RatingsRoot(
  {
    badgeText,
    title,
    description,
    rating,
    ratingSubtext,
    avatars,
    className,
    ...otherProps
  }: TrustHeadline_RatingsRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[1280px] flex-col items-center px-12 py-16",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full items-start gap-12">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
          <div className="flex items-center gap-2 rounded-full border border-solid border-brand-200 bg-brand-50 px-3 py-1">
            <div className="flex h-2 w-2 flex-none items-start rounded-full bg-brand-700" />
            {badgeText ? (
              <span className="text-caption font-caption text-success-700">
                {badgeText}
              </span>
            ) : null}
          </div>
          {title ? (
            <span className="text-heading-1 font-heading-1 text-default-font">
              {title}
            </span>
          ) : null}
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
          {description ? (
            <span className="text-body font-body text-neutral-600">
              {description}
            </span>
          ) : null}
          <div className="flex w-full items-center gap-8">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-1">
                <FeatherStar className="text-body font-body text-[#38bdf8]" />
                <FeatherStar className="text-body font-body text-[#38bdf8]" />
                <FeatherStar className="text-body font-body text-[#38bdf8]" />
                <FeatherStar className="text-body font-body text-[#38bdf8]" />
                <FeatherStar className="text-body font-body text-[#38bdf8]" />
              </div>
              {rating ? (
                <span className="text-body font-body text-brand-700">
                  {rating}
                </span>
              ) : null}
              {ratingSubtext ? (
                <span className="text-caption font-caption text-neutral-500">
                  {ratingSubtext}
                </span>
              ) : null}
            </div>
            {avatars ? (
              <div className="flex items-center">{avatars}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});

export const TrustHeadline_Ratings = TrustHeadline_RatingsRoot;
