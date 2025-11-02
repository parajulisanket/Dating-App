"use client";

import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
type TopBarProps = {
  className?: string;
  title?: string; // defaults to "Matches"
  backHref?: string; // where the chevron goes (defaults to /home)
  showSearch?: boolean; // show search bubble
  searchHref?: string; // optional search link (defaults to /search)
  onSearchClick?: () => void; // optional click handler instead of link
};

export default function TopBar({
  className,
  title = "Matches",
  backHref = "/home",
  showSearch = true,
  searchHref,
  onSearchClick,
}: TopBarProps) {
  const { theme, resolvedTheme } = useTheme();
  // const theme = localStorage.getItem('app-theme')
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  });
  // if (!mounted) {
  //   return <div className="h-[56px]" />;
  // }
  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "p-4",
        className
      )}
    >
      {/* Left: chevron + title */}
      <div className="flex items-center gap-3">
        {/* <Link href={backHref} aria-label="Back" className="rounded-full ">
          <ChevronLeft className="text-heading" size={35} strokeWidth={1.5} />
        </Link> */}

        <h1 className="title">{title}</h1>
      </div>

      {/* Right: Search */}

      {showSearch &&
        mounted &&
        (onSearchClick ? (
          <button
            type="button"
            aria-label="Search"
            onClick={onSearchClick}
            className=" text-heading "
          >
            <Search className={`w-[26px] h-[26px] `} strokeWidth={2} />
          </button>
        ) : (
          <Link
            href={searchHref || "/search"}
            aria-label="Search"
            className=" p-2 "
          >
            <Search
              className={`w-[26px] h-[26px] ${
                resolvedTheme === "dark" ? "text-white" : "text-primary-500"
              }`}
              strokeWidth={2}
            />
          </Link>
        ))}
    </header>
  );
}
