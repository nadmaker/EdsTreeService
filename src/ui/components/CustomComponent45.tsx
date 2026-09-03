"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/1a65819b7181/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * Custom Component45 — https://app.subframe.com/1a65819b7181/library?component=Custom+Component45_3894ee6f-7dbc-42b3-9e85-a9827013d021
 */

import React from "react";
import { FeatherAward } from "@subframe/core";
import { FeatherCheck } from "@subframe/core";
import { FeatherShield } from "@subframe/core";
import { FeatherStar } from "@subframe/core";
import { FeatherTarget } from "@subframe/core";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";

interface CustomComponent45RootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CustomComponent45Root = React.forwardRef<
  HTMLDivElement,
  CustomComponent45RootProps
>(function CustomComponent45Root(
  { className, ...otherProps }: CustomComponent45RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center gap-12 py-12 mobile:gap-8",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-center gap-8 px-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-heading-1 font-heading-1 text-default-font text-center">
            Trust Summary Headline
          </span>
          <span className="text-body font-body text-subtext-color text-center">
            Supporting text for trust summary section
          </span>
        </div>
        <div className="flex items-center justify-center gap-8 mobile:flex-col mobile:gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-heading-1 font-heading-1 text-brand-primary">
              100+
            </span>
            <span className="text-body font-body text-subtext-color text-center">
              Metric Label
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-heading-1 font-heading-1 text-brand-primary">
              50+
            </span>
            <span className="text-body font-body text-subtext-color text-center">
              Metric Label
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-heading-1 font-heading-1 text-brand-primary">
              25+
            </span>
            <span className="text-body font-body text-subtext-color text-center">
              Metric Label
            </span>
          </div>
        </div>
      </div>
      <div className="container max-w-none flex w-full items-start gap-8 mobile:flex-col mobile:px-6 mobile:py-0">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
          <div className="flex h-96 w-full flex-none flex-col items-center justify-center relative">
            <img
              className="w-full grow shrink-0 basis-0 rounded-lg object-cover"
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
            />
            <div className="flex h-24 w-24 flex-none items-center justify-center rounded-full bg-brand-primary shadow-lg absolute bottom-4 right-4">
              <FeatherAward className="text-heading-1 font-heading-1 text-white" />
            </div>
          </div>
        </div>
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-2">
            <span className="w-full text-heading-1 font-heading-1 text-default-font">
              Secondary Headline Goes Here
            </span>
            <span className="w-full text-body font-body text-subtext-color">
              Short supporting subheadline text goes here
            </span>
          </div>
          <div className="w-full items-start gap-6 grid grid-cols-2 mobile:grid mobile:grid-cols-1">
            <div className="flex flex-col items-start gap-2">
              <FeatherCheck className="text-heading-2 font-heading-2 text-brand-primary" />
              <span className="text-body-bold font-body-bold text-default-font">
                Feature Title
              </span>
              <span className="text-body font-body text-subtext-color">
                Short descriptive text about this feature
              </span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <FeatherShield className="text-heading-2 font-heading-2 text-brand-primary" />
              <span className="text-body-bold font-body-bold text-default-font">
                Feature Title
              </span>
              <span className="text-body font-body text-subtext-color">
                Short descriptive text about this feature
              </span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <FeatherTarget className="text-heading-2 font-heading-2 text-brand-primary" />
              <span className="text-body-bold font-body-bold text-default-font">
                Feature Title
              </span>
              <span className="text-body font-body text-subtext-color">
                Short descriptive text about this feature
              </span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <FeatherStar className="text-heading-2 font-heading-2 text-brand-primary" />
              <span className="text-body-bold font-body-bold text-default-font">
                Feature Title
              </span>
              <span className="text-body font-body text-subtext-color">
                Short descriptive text about this feature
              </span>
            </div>
          </div>
          <Button variant="brand-primary" size="large">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
});

export const CustomComponent45 = CustomComponent45Root;
