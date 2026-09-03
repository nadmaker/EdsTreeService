"use client";
/*
 * Documentation:
 * Icon Button — https://app.subframe.com/1a65819b7181/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * newmodernNav2_0 — https://app.subframe.com/1a65819b7181/library?component=newmodernNav2_0_47cc4397-6d14-490b-8cd4-82a3e1504b01
 */

import React from "react";
import { FeatherMenu } from "@subframe/core";
import { FeatherPhone } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";
import { IconButton } from "./IconButton";

interface NewmodernNav2_0RootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string;
  menuItems?: React.ReactNode;
  ctaButtons?: React.ReactNode;
  className?: string;
}

const NewmodernNav2_0Root = React.forwardRef<
  HTMLDivElement,
  NewmodernNav2_0RootProps
>(function NewmodernNav2_0Root(
  {
    logo,
    menuItems,
    ctaButtons,
    className,
    ...otherProps
  }: NewmodernNav2_0RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full items-center gap-6 border-b border-solid border-neutral-border bg-default-background px-8 py-6 shadow-md mobile:gap-2 mobile:px-4 mobile:py-4",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex h-12 items-center mobile:flex-1">
        {logo ? (
          <img
            className="grow shrink-0 basis-0 self-stretch object-contain mobile:h-8"
            src={logo}
          />
        ) : null}
      </div>
      {menuItems ? (
        <div className="flex grow shrink-0 basis-0 items-center justify-end gap-2 mobile:hidden">
          {menuItems}
        </div>
      ) : null}
      {ctaButtons ? (
        <div className="flex items-center gap-3 mobile:hidden">
          {ctaButtons}
        </div>
      ) : null}
      <div className="hidden items-start mobile:flex mobile:items-center mobile:gap-2">
        <IconButton
          variant="neutral-tertiary"
          size="medium"
          icon={<FeatherPhone />}
        />
        <SubframeCore.Popover.Root>
          <SubframeCore.Popover.Trigger asChild={true}>
            <IconButton
              variant="neutral-tertiary"
              size="medium"
              icon={<FeatherMenu />}
            />
          </SubframeCore.Popover.Trigger>
          <SubframeCore.Popover.Portal>
            <SubframeCore.Popover.Content
              side="bottom"
              align="center"
              sideOffset={0}
              asChild={true}
            >
              {menuItems ? (
                <div className="flex min-w-[288px] flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-2 py-2 shadow-lg">
                  {menuItems}
                </div>
              ) : null}
            </SubframeCore.Popover.Content>
          </SubframeCore.Popover.Portal>
        </SubframeCore.Popover.Root>
      </div>
    </div>
  );
});

export const NewmodernNav2_0 = NewmodernNav2_0Root;
