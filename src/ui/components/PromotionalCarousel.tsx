"use client";
/*
 * Documentation:
 * PromotionalCarousel — https://app.subframe.com/1a65819b7181/library?component=PromotionalCarousel_fac8386c-77f4-4195-b0b6-c7dfbf2b80ec
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface PromotionalCarouselRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  image?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  ctaButton?: React.ReactNode;
  indicators?: React.ReactNode;
  prevButton?: React.ReactNode;
  nextButton?: React.ReactNode;
  className?: string;
}

const PromotionalCarouselRoot = React.forwardRef<
  HTMLDivElement,
  PromotionalCarouselRootProps
>(function PromotionalCarouselRoot(
  {
    image,
    title,
    subtitle,
    description,
    ctaButton,
    indicators,
    prevButton,
    nextButton,
    className,
    ...otherProps
  }: PromotionalCarouselRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[1280px] flex-col items-center gap-12 px-16 py-24",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full items-center gap-12 relative">
        {prevButton ? (
          <div className="flex items-center gap-12">{prevButton}</div>
        ) : null}
        <div className="flex flex-col items-start overflow-hidden rounded-lg flex-1">
          {image ? (
            <img className="h-96 w-full flex-none object-cover" src={image} />
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-6 flex-1">
          {title ? (
            <span className="text-heading-1 font-heading-1 text-neutral-800">
              {title}
            </span>
          ) : null}
          {subtitle ? (
            <span className="text-heading-2 font-heading-2 text-neutral-700">
              {subtitle}
            </span>
          ) : null}
          <div className="flex h-px w-full flex-none items-start border-t border-dashed border-neutral-300" />
          {description ? (
            <span className="text-caption font-caption text-neutral-600 uppercase">
              {description}
            </span>
          ) : null}
          {ctaButton ? (
            <div className="flex flex-col items-start gap-6">{ctaButton}</div>
          ) : null}
        </div>
        {nextButton ? (
          <div className="flex items-center gap-12">{nextButton}</div>
        ) : null}
      </div>
      {indicators ? (
        <div className="flex items-center gap-2">{indicators}</div>
      ) : null}
    </div>
  );
});

export const PromotionalCarousel = PromotionalCarouselRoot;
