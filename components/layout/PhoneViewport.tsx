"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PhoneViewport
 * - Non-scrollable page canvas, centered, fixed design width
 * - Uses 100svh to be stable across mobile browser chrome changes
 * - Safe-area padding so nothing sits under notches/home indicator
 */
export default function PhoneViewport({
  className,
  children,
  maxWidth = 425, // your design width
  bg = "bg-white", // inner canvas background
  frameBg = "bg-[#F4B7D0]", // outer frame (the pink sides you like)
}: {
  className?: string;
  children: React.ReactNode;
  maxWidth?: number;
  bg?: string;
  frameBg?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center",
        "overflow-hidden", // hard lock
        frameBg
      )}
    >
      <main
        className={cn(
          "w-full",
          bg,
          "overflow-hidden", // no scroll inside either
          "h-[100svh]", // stable height on mobile
          "shadow-xl"
        )}
        style={{ maxWidth }}
      >
        <div
          className={cn(
            "flex h-full flex-col",
            "px-4",
            // Safe-area padding with sensible minimums
            "pt-[max(env(safe-area-inset-top),16px)]",
            "pb-[max(env(safe-area-inset-bottom),16px)]",
            "pl-[max(env(safe-area-inset-left),16px)]",
            "pr-[max(env(safe-area-inset-right),16px)]",
            className
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
