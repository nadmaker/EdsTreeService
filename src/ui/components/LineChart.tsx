"use client";
/*
 * Documentation:
 * Line Chart — https://app.subframe.com/1a65819b7181/library?component=Line+Chart_22944dd2-3cdd-42fd-913a-1b11a3c1d16d
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface LineChartRootProps
  extends React.ComponentProps<typeof SubframeCore.LineChart> {
  className?: string;
}

const LineChartRoot = React.forwardRef<
  React.ElementRef<typeof SubframeCore.LineChart>,
  LineChartRootProps
>(function LineChartRoot(
  { className, ...otherProps }: LineChartRootProps,
  ref
) {
  return (
    <SubframeCore.LineChart
      className={SubframeUtils.twClassNames("h-80 w-full", className)}
      ref={ref}
      colors={[
        "#23914b",
        "#b4dcc0",
        "#00822d",
        "#82c398",
        "#006924",
        "#4ba66a",
      ]}
      {...otherProps}
    />
  );
});

export const LineChart = LineChartRoot;
