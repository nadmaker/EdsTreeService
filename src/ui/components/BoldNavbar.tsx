"use client";
/*
 * Documentation:
 * Bold navbar — https://app.subframe.com/1a65819b7181/library?component=Bold+navbar_8be1b160-02db-4f5b-b7d6-f3c2c8ede9d6
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  selected?: boolean;
  className?: string;
}

const NavItem = React.forwardRef<HTMLDivElement, NavItemProps>(function NavItem(
  { children, selected = false, className, ...otherProps }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/b8f2fb75 flex h-8 cursor-pointer flex-col items-center justify-center gap-4 rounded-full px-4",
        { "bg-brand-200": selected },
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {children ? (
        <span className="font-['Montserrat'] text-[15px] font-[600] leading-[20px] text-brand-900">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface BoldNavbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  rightSlot?: React.ReactNode;
  logo?: string;
  className?: string;
}

const BoldNavbarRoot = React.forwardRef<HTMLDivElement, BoldNavbarRootProps>(
  function BoldNavbarRoot(
    {
      children,
      rightSlot,
      logo,
      className,
      ...otherProps
    }: BoldNavbarRootProps,
    ref
  ) {
    return rightSlot ? (
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full max-w-[1280px] flex-wrap items-center gap-4",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {rightSlot}
      </div>
    ) : null;
  }
);

export const BoldNavbar = Object.assign(BoldNavbarRoot, {
  NavItem,
});
