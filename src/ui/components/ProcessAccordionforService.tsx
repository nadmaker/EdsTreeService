"use client";
/*
 * Documentation:
 * ProcessAccordionforService — https://app.subframe.com/1a65819b7181/library?component=ProcessAccordionforService_f7efa091-dcab-4f27-8be4-b12eb37df16e
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface ProcessAccordionforServiceRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  accordionItems?: React.ReactNode;
  callToAction?: React.ReactNode;
  className?: string;
}

const ProcessAccordionforServiceRoot = React.forwardRef<
  HTMLDivElement,
  ProcessAccordionforServiceRootProps
>(function ProcessAccordionforServiceRoot(
  {
    title,
    description,
    accordionItems,
    callToAction,
    className,
    ...otherProps
  }: ProcessAccordionforServiceRootProps,
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
          {description ? (
            <span className="text-body font-body text-neutral-600">
              {description}
            </span>
          ) : null}
        </div>
        {accordionItems ? (
          <div className="flex w-full flex-col items-start gap-2">
            {accordionItems}
          </div>
        ) : null}
        {callToAction ? (
          <div className="flex flex-col items-start gap-8">{callToAction}</div>
        ) : null}
      </div>
    </div>
  );
});

export const ProcessAccordionforService = ProcessAccordionforServiceRoot;
