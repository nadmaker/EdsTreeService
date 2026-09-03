"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/1a65819b7181/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * contactformSectiom — https://app.subframe.com/1a65819b7181/library?component=contactformSectiom_ce866f85-26ef-4f29-b8aa-9fd7bc8758dd
 * Text Area — https://app.subframe.com/1a65819b7181/library?component=Text+Area_4ec05ee8-8f1c-46b2-b863-5419aa7f5cce
 * Text Field — https://app.subframe.com/1a65819b7181/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 */

import React from "react";
import { FeatherHash } from "@subframe/core";
import { FeatherList } from "@subframe/core";
import { FeatherMail } from "@subframe/core";
import { FeatherMapPin } from "@subframe/core";
import { FeatherPhone } from "@subframe/core";
import { FeatherUser } from "@subframe/core";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";
import { TextArea } from "./TextArea";
import { TextField } from "./TextField";

interface ContactformSectiomRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  submitLabel?: React.ReactNode;
  className?: string;
}

const ContactformSectiomRoot = React.forwardRef<
  HTMLDivElement,
  ContactformSectiomRootProps
>(function ContactformSectiomRoot(
  { title, submitLabel, className, ...otherProps }: ContactformSectiomRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full flex-col items-center gap-8 px-6 py-12",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {title ? (
        <span className="w-full font-['Inter'] text-[32px] font-[600] leading-[40px] text-default-font text-center">
          {title}
        </span>
      ) : null}
      <div className="flex w-full max-w-[1280px] flex-wrap items-end gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <TextField
            variant="outline"
            label="Name"
            helpText=""
            icon={<FeatherUser />}
          >
            <TextField.Input placeholder="" />
          </TextField>
          <TextField
            variant="outline"
            label="Phone"
            helpText=""
            icon={<FeatherPhone />}
          >
            <TextField.Input placeholder="" />
          </TextField>
          <TextField
            variant="outline"
            label="Email"
            helpText=""
            icon={<FeatherMail />}
          >
            <TextField.Input placeholder="" />
          </TextField>
          <TextField
            variant="outline"
            label="Address"
            helpText=""
            icon={<FeatherMapPin />}
          >
            <TextField.Input placeholder="" />
          </TextField>
          <TextField
            variant="outline"
            label="ZIP Code"
            helpText=""
            icon={<FeatherHash />}
          >
            <TextField.Input placeholder="" />
          </TextField>
          <TextField
            variant="outline"
            label="Service Type"
            helpText=""
            icon={<FeatherList />}
          >
            <TextField.Input placeholder="" />
          </TextField>
          <TextArea variant="outline" label="How Can We Help?" helpText="">
            <TextArea.Input placeholder="" />
          </TextArea>
          <Button
            className="h-12 w-auto flex-none"
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

export const ContactformSectiom = ContactformSectiomRoot;
