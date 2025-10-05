"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type TopBarProps = {
  className?: string;
};

export default function TopBar({ className }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "p-6",
        className
      )}
    >
      <Link href="/" className="title">
        LOGO
      </Link>

      {/* Right side images */}
      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="rounded-full p-2 bg-[#F92FA21A] hover:bg-pink-50"
        >
          <img
            src="/icons/bell.svg"
            alt="Notifications"
            className="w-[26px] h-[26px] object-contain"
          />
        </Link>

        <Link
          href="/filters"
          aria-label="Filters"
          className="rounded-full p-2 bg-[#F92FA21A] hover:bg-pink-50"
        >
          <img
            src="/icons/slider.svg"
            alt="Filters"
            className="w-[26px] h-[26px] object-contain"
          />
        </Link>
      </div>
    </header>
  );
}
