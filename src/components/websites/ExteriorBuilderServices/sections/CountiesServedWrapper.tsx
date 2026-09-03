"use client";

import React from "react";
import { CountiesServed } from "@/ui/components/CountiesServed";

function LocationsList() {
  return (
    <ul className="m-0 list-disc pl-5">
      <li>Duplin County</li>
      <li>Sampson County</li>
      <li>Wayne County</li>
    </ul>
  );
}

export default function CountiesServedWrapper() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10">
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-stretch md:gap-0">
          {/* LEFT COLUMN — 60% */}
          <div className="md:basis-3/5 md:flex md:items-stretch">
            <CountiesServed
              className="
                counties-served-root w-full h-full
                max-w-none !gap-0
                [&>div:last-child]:hidden
                [&>div:first-child]:w-full
                [&_span]:text-brand-primary
                [&_li]:text-brand-primary
              "
              title="Counties Served"
              locations={<LocationsList />}
              linkText=""
            />
          </div>

          {/* RIGHT COLUMN — 40% */}
          <div className="flex items-center justify-center rounded-xl bg-brand-secondary p-6 md:basis-2/5 md:p-0">
            <img
              src="/images/ebs-counties-map.png"
              alt="Map of counties served by Exterior Builder Services"
              className="block w-full max-w-[640px] md:w-[640px] md:max-w-none md:-ml-24"
            />
          </div>
        </div>
      </div>
    </section>
  );
}