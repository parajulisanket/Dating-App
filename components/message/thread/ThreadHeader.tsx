"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export default function ThreadHeader({
  slug,
  name,
  avatar = "/images/Shristima.jpg",
  online = true,
  portalContainer,
  setViewMenu,
}: {
  slug: string;
  name?: string;
  avatar?: string;
  online?: boolean;
  setViewMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  portalContainer?: HTMLElement | null;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const displayName = name ?? decodeURIComponent(slug);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-borderButton bg-background h-[90px] p-6 ">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <img
            src={"/icons/CaretLeft.svg"}
            className={theme === "light" ? "" : "filter invert brightness-0"}
            alt="Back"
          />
        </button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} className="!object-cover" />
          <AvatarFallback>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <div className="text-[18px] font-semibold capitalize">
            {displayName}
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <span
              className={`h-2 w-2 rounded-full ${
                online ? "bg-[#22C55E]" : "bg-gray-300"
              }`}
            />
            <span className={online ? "text-neutral-600" : "text-gray-400"}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-[4px] text-[#EB3FA5]">
          <button className="p-2" aria-label="Audio call">
            <img
              src="/icons/phone.svg"
              alt=""
              className={
                theme === "light" ? "" : "filter invert brightness-0"
              }
            />
          </button>
          <button className="p-2" aria-label="Video call">
            <img
              src={"/icons/VideoCamera.svg"}
              className={
                theme === "light" ? "" : "filter invert brightness-0"
              }
              alt=""
            />
          </button>
          <button
            className="p-2"
            aria-label="More"
            onClick={() => setViewMenu?.(true)}
          >
            <img
              src={"/icons/DotsThree.svg"}
              className={
                theme === "light" ? "" : "filter invert brightness-0"
              }
              alt=""
            />
          </button>
        </div>
      </div>
    </header>
  );
}