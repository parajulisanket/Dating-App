"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
  title?: string; // default: "Anup"
  backHref?: string; // default: "/"
  settingsHref?: string; // default: "/settings"
  onSettingsClick?: () => void; // optional click handler instead of link
};

export default function Header({
  className,
  title = "Anup",
  backHref = "/",
  settingsHref = "/settings",
  onSettingsClick,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between",
        "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "px-6 h-[40px] mt-2",
        className
      )}
    >
      {/* Left: Back button + title */}
      <div className="flex items-center gap-3 text-[#F92FA2]">
        <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </Link>
        <h1 className="text-[16px] leading-[20px] font-bold">{title}</h1>
      </div>

      {/* Right: Settings icon (link by default, or button if handler is provided) */}
      {onSettingsClick ? (
        <button
          type="button"
          aria-label="Settings"
          onClick={onSettingsClick}
          className="rounded-full"
        >
          <Image
            src="/settings.svg"
            alt="Settings"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </button>
      ) : (
        <Link
          href={settingsHref}
          aria-label="Settings"
          className="rounded-full"
        >
          <Image
            src="/settings.svg"
            alt="Settings"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </Link>
      )}
    </header>
  );
}
