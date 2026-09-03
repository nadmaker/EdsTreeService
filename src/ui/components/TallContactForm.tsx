"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/1a65819b7181/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * TallContactForm — https://app.subframe.com/1a65819b7181/library?component=TallContactForm_e448f63c-c529-40d9-a72d-9e7151f4bca6
 * Text Field — https://app.subframe.com/1a65819b7181/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";
import { TextField } from "./TextField";

interface TallContactFormRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

const TallContactFormRoot = React.forwardRef<
  HTMLDivElement,
  TallContactFormRootProps
>(function TallContactFormRoot(
  { title, description, className, ...otherProps }: TallContactFormRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[768px] flex-col items-center justify-center gap-6 rounded-lg px-4 py-4 shadow-lg",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex w-full flex-col items-start gap-2">
        <span className="text-heading-2 font-heading-2 text-default-font">
          Get Your Free Estimate
        </span>
        <span className="text-body font-body text-subtext-color">
          Fill out the form below and we&#39;ll get back to you shortly
        </span>
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <TextField className="h-auto w-full flex-none" label="" helpText="">
              <TextField.Input placeholder="Name *" />
            </TextField>
            <TextField className="h-auto w-full flex-none" label="" helpText="">
              <TextField.Input placeholder="Phone *" />
            </TextField>
            <TextField className="h-auto w-full flex-none" label="" helpText="">
              <TextField.Input placeholder="Email *" />
            </TextField>
            <TextField className="h-auto w-full flex-none" label="" helpText="">
              <TextField.Input placeholder="Address" />
            </TextField>
            <TextField className="h-auto w-full flex-none" label="" helpText="">
              <TextField.Input placeholder="Zip Code" />
            </TextField>
            <TextField className="h-auto w-full flex-none" label="" helpText="">
              <TextField.Input placeholder="How Can We Help?" />
            </TextField>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
              <Button variant="brand-primary" size="large">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const TallContactForm = TallContactFormRoot;
