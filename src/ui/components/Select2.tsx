"use client";
/*
 * Documentation:
 * Select 2 — https://app.subframe.com/1a65819b7181/library?component=Select+2_f6cd939d-7b55-4985-982d-3ca64bba907a
 */

import React from "react";
import { FeatherCheck } from "@subframe/core";
import { FeatherChevronDown } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface ItemProps
  extends Omit<React.ComponentProps<typeof SubframeCore.Select.Item>, "value"> {
  value: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function Item(
  { value, children, className, ...otherProps }: ItemProps,
  ref
) {
  return (
    <SubframeCore.Select.Item
      value={value as string}
      asChild={true}
      {...otherProps}
    >
      <div
        className={SubframeUtils.twClassNames(
          "group/a5418b8c flex h-8 w-full cursor-pointer items-center gap-1 rounded-md px-3 hover:bg-neutral-100 active:bg-neutral-50 data-[highlighted]:bg-brand-50",
          className
        )}
        ref={ref}
      >
        <Select2.ItemText className="h-auto grow shrink-0 basis-0">
          {children || value}
        </Select2.ItemText>
        <FeatherCheck className="hidden text-body font-body text-default-font group-data-[state=checked]/a5418b8c:inline-flex" />
      </div>
    </SubframeCore.Select.Item>
  );
});

interface TriggerValueProps
  extends React.ComponentProps<typeof SubframeCore.Select.Value> {
  placeholder?: React.ReactNode;
  className?: string;
}

const TriggerValue = React.forwardRef<
  React.ElementRef<typeof SubframeCore.Select.Value>,
  TriggerValueProps
>(function TriggerValue(
  { placeholder, className, ...otherProps }: TriggerValueProps,
  ref
) {
  return (
    <SubframeCore.Select.Value
      className={SubframeUtils.twClassNames(
        "w-full whitespace-nowrap text-body font-body text-default-font",
        className
      )}
      ref={ref}
      placeholder={placeholder}
      {...otherProps}
    >
      Value
    </SubframeCore.Select.Value>
  );
});

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Select.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return children ? (
    <SubframeCore.Select.Content asChild={true} {...otherProps}>
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full flex-col items-start overflow-hidden rounded-md border border-solid border-neutral-border bg-white px-1 py-1 shadow-lg",
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    </SubframeCore.Select.Content>
  ) : null;
});

interface TriggerProps
  extends Omit<
    React.ComponentProps<typeof SubframeCore.Select.Trigger>,
    "placeholder"
  > {
  placeholder?: React.ReactNode;
  className?: string;
}

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  function Trigger(
    { placeholder, className, ...otherProps }: TriggerProps,
    ref
  ) {
    return (
      <SubframeCore.Select.Trigger asChild={true} {...otherProps}>
        <button
          className={SubframeUtils.twClassNames(
            "flex h-full w-full items-center gap-2 text-left",
            className
          )}
          ref={ref}
        >
          <Select2.TriggerValue placeholder={placeholder as string} />
          <FeatherChevronDown className="text-body font-body text-default-font" />
        </button>
      </SubframeCore.Select.Trigger>
    );
  }
);

interface ItemTextProps
  extends React.ComponentProps<typeof SubframeCore.Select.ItemText> {
  children?: React.ReactNode;
  className?: string;
}

const ItemText = React.forwardRef<HTMLSpanElement, ItemTextProps>(
  function ItemText(
    { children, className, ...otherProps }: ItemTextProps,
    ref
  ) {
    return children ? (
      <SubframeCore.Select.ItemText {...otherProps}>
        <span
          className={SubframeUtils.twClassNames(
            "text-body font-body text-default-font",
            className
          )}
          ref={ref}
        >
          {children}
        </span>
      </SubframeCore.Select.ItemText>
    ) : null;
  }
);

interface Select2RootProps
  extends React.ComponentProps<typeof SubframeCore.Select.Root> {
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Select2Root = React.forwardRef<HTMLDivElement, Select2RootProps>(
  function Select2Root(
    {
      disabled = false,
      label,
      placeholder,
      children,
      className,
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen,
      onOpenChange,
      dir,
      name,
      autoComplete,
      required,
      form,
      ...otherProps
    }: Select2RootProps,
    ref
  ) {
    return (
      <SubframeCore.Select.Root
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        dir={dir}
        name={name}
        autoComplete={autoComplete}
        required={required}
        form={form}
      >
        <div
          className={SubframeUtils.twClassNames(
            "group/f6cd939d flex flex-col items-start gap-1",
            { "opacity-50 pointer-events-none": disabled },
            className
          )}
          ref={ref}
          {...otherProps}
        >
          {label ? (
            <span className="text-body font-body text-default-font">
              {label}
            </span>
          ) : null}
          <div className="flex h-8 w-full flex-none flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-3 group-focus-within/f6cd939d:outline group-focus-within/f6cd939d:outline-neutral-900/50">
            <Trigger placeholder={placeholder} />
          </div>
          <Content>
            {children ? (
              <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
                {children}
              </div>
            ) : null}
          </Content>
        </div>
      </SubframeCore.Select.Root>
    );
  }
);

export const Select2 = Object.assign(Select2Root, {
  Item,
  TriggerValue,
  Content,
  Trigger,
  ItemText,
});
