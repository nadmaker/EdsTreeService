"use client";
/*
 * Documentation:
 * Modern navbar 1_0 — https://app.subframe.com/1a65819b7181/library?component=Modern+navbar+1_0_cba8555a-1e5a-4a57-8c3d-6ad67c2ef976
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

const NavItem = React.forwardRef<HTMLDivElement, NavItemProps>(function NavItem(
  {
    children,
    icon = null,
    iconRight = null,
    className,
    ...otherProps
  }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/4f025ecf flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full px-4 hover:bg-brand-600",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {children ? (
        <span className="text-body-bold font-body-bold text-default-font group-hover/4f025ecf:text-brand-50">
          {children}
        </span>
      ) : null}
      {iconRight ? (
        <SubframeCore.IconWrapper className="text-body-bold font-body-bold text-default-font group-hover/4f025ecf:text-brand-50">
          {iconRight}
        </SubframeCore.IconWrapper>
      ) : null}
    </div>
  );
});

interface ModernNavbar1_0RootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  horizontalMenuItems?: React.ReactNode;
  menuCtaRow?: React.ReactNode;
  logo?: string;
  className?: string;
}

const ModernNavbar1_0Root = React.forwardRef<
  HTMLDivElement,
  ModernNavbar1_0RootProps
>(function ModernNavbar1_0Root(
  {
    horizontalMenuItems,
    menuCtaRow,
    logo,
    className,
    ...otherProps
  }: ModernNavbar1_0RootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-60 w-full max-w-[1024px] flex-wrap items-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-4 shadow-md relative",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
        {logo ? (
          <img className="h-20 w-20 flex-none object-contain" src={logo} />
        ) : null}
      </div>
      {horizontalMenuItems ? (
        <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-wrap items-center justify-end gap-6">
          {horizontalMenuItems}
        </div>
      ) : null}
      {menuCtaRow ? (
        <div className="flex items-center gap-2 px-2">{menuCtaRow}</div>
      ) : null}
    </div>
  );
});

export const ModernNavbar1_0 = Object.assign(ModernNavbar1_0Root, {
  NavItem,
});
