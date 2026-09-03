"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/1a65819b7181/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * TallContentTruTemp — https://app.subframe.com/1a65819b7181/library?component=TallContentTruTemp_31db6ad8-75cd-4773-8ed2-3b1e6f17b531
 */

import React from "react";
import { FeatherPhone } from "@subframe/core";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";

interface TallContentTruTempRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  paragraphs?: React.ReactNode;
  className?: string;
}

const TallContentTruTempRoot = React.forwardRef<
  HTMLDivElement,
  TallContentTruTempRootProps
>(function TallContentTruTempRoot(
  { image, paragraphs, className, ...otherProps }: TallContentTruTempRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start gap-8",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {image ? (
        <img className="w-full flex-none rounded-lg shadow-lg" src={image} />
      ) : null}
      {paragraphs ? (
        <div className="flex w-full flex-col items-start gap-8">
          {paragraphs}
        </div>
      ) : null}
      <Button icon={<FeatherPhone />}>string</Button>
    </div>
  );
});

export const TallContentTruTemp = TallContentTruTempRoot;
