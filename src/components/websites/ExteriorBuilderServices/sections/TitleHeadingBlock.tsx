"use client";

import React from "react";
import { TitleBlock1_1 } from "@/ui/components/TitleBlock1_1";

export interface TitleHeadingBlockProps {
  className?: string;

  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  /** Optional id for anchor links */
  id?: string;

  /** Wrapper-owned spacing (defaults match your system) */
  padYClassName?: string; // e.g. "py-10 md:py-14"
}

export default function TitleHeadingBlock({
  id,
  className,
  title,
  subtitle,
  padYClassName = "py-10 md:py-14",
}: TitleHeadingBlockProps) {
  return (
    <section
      id={id}
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      {/* Wrapper controls container + spacing */}
      <div
        className={[
          "mx-auto w-full max-w-[1280px] px-6 md:px-10",
          padYClassName,
        ].join(" ")}
      >
        <TitleBlock1_1
          className="w-full p-0" // neutralize Subframe padding
          title={title}
          subtitle={subtitle}
        />
      </div>
    </section>
  );
}
