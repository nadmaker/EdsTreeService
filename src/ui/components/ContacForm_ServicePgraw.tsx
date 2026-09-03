"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/1a65819b7181/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * ContacForm_ServicePGRAW — https://app.subframe.com/1a65819b7181/library?component=ContacForm_ServicePGRAW_5a0414bf-d6cf-4ca8-af27-4751654f1a38
 * Text Area — https://app.subframe.com/1a65819b7181/library?component=Text+Area_4ec05ee8-8f1c-46b2-b863-5419aa7f5cce
 * Text Field — https://app.subframe.com/1a65819b7181/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 */

import React from "react";
import { FeatherMessageCircle } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";
import { TextArea } from "./TextArea";
import { TextField } from "./TextField";

interface ContacForm_ServicePgrawRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}

const ContacForm_ServicePgrawRoot = React.forwardRef<
  HTMLDivElement,
  ContacForm_ServicePgrawRootProps
>(function ContacForm_ServicePgrawRoot(
  {
    icon = <FeatherMessageCircle />,
    title,
    className,
    ...otherProps
  }: ContacForm_ServicePgrawRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-start gap-2 rounded-lg shadow-md",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col items-center gap-6">
          {icon ? (
            <SubframeCore.IconWrapper className="text-heading-1 font-heading-1 text-default-font">
              {icon}
            </SubframeCore.IconWrapper>
          ) : null}
          {title ? (
            <span className="text-heading-1 font-heading-1 text-default-font text-center">
              {title}
            </span>
          ) : null}
        </div>
        <div className="flex w-full flex-col items-start gap-4 px-2 py-2">
          <TextField
            className="h-auto w-full flex-none"
            variant="outline"
            label="Full Name"
            helpText=""
          >
            <TextField.Input placeholder="Enter your full name" />
          </TextField>
          <TextField
            className="h-auto w-full flex-none"
            variant="outline"
            label="Phone"
            helpText=""
          >
            <TextField.Input placeholder="Enter your phone number" />
          </TextField>
          <TextField
            className="h-auto w-full flex-none"
            variant="outline"
            label="Email"
            helpText=""
          >
            <TextField.Input placeholder="Enter your email" />
          </TextField>
          <TextField
            className="h-auto w-full flex-none"
            variant="outline"
            label="Address"
            helpText=""
          >
            <TextField.Input placeholder="Enter your address" />
          </TextField>
          <TextArea
            className="h-auto w-full flex-none"
            variant="outline"
            label="How Can We Help?"
            helpText=""
          >
            <TextArea.Input placeholder="Tell us how we can help you..." />
          </TextArea>
          <Button
            className="h-auto min-h-[20px] w-full flex-none"
            variant="brand-primary"
            size="large"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
});

export const ContacForm_ServicePgraw = ContacForm_ServicePgrawRoot;
