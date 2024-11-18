"use client";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link"; // Import Link from next/link
import { CardBalance1 } from "./card-balance1";
import { CardBalance2 } from "./card-balance2";
import { CardBalance3 } from "./card-balance3";
import { CardBalance4 } from "./card-balance4";
import { CardBalance5 } from "./card-balance5";
import { CardBalance6 } from "./card-balance6";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export const Content = () => (
  <div className="h-full lg:px-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap max-w-[90rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center w-full">
            <Link href="/pos">
              <CardBalance1 />
            </Link>
            <Link href="">
              <CardBalance2 />
            </Link>
            <Link href="">
              <CardBalance3 />
            </Link>
            <Link href="">
              <CardBalance4 />
            </Link>
            <Link href="">
              <CardBalance5 />
            </Link>
            <Link href="/customer_support">
              <CardBalance6 />
            </Link>
          </div>
        </div>

        {/* Chart */}
        <div className="h-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Statistics</h3>
          <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
            <Chart />
          </div>
        </div>
      </div>
    </div>
  </div>
);
