"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search as SearchIcon, type LucideProps } from "lucide-react";

type SearchTopProps = {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  className?: string;
  sticky?: boolean;
  autoFocus?: boolean;
  /** Icon component to render (defaults to lucide-react Search) */
  Icon?: React.ComponentType<LucideProps>;
  /** Icon size in px */
  iconSize?: number;
  /** Optional extra classes for the icon */
  iconClassName?: string;
};

export default function SearchTop({
  placeholder = "Search chats",
  value,
  onChange,
  onSubmit,
  className,
  sticky = true,
  autoFocus = false,
  Icon = SearchIcon,
  iconSize = 22,
  iconClassName,
}: SearchTopProps) {
  const [internal, setInternal] = React.useState("");
  const val = value ?? internal;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange ? onChange(e.target.value) : setInternal(e.target.value);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(val);
  }

  return (
    <header
      className={cn(
        sticky && "sticky top-0 z-30",
        // "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-background",
        "p-4",
        className
      )}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <label
          className={cn(
            "flex items-center gap-3 w-full",
            "h-12 rounded-full px-4",
            "bg-[#3333330D] bg-search  text-gray-700 text-neutral-1000"
          )}
        >
          <Icon
            size={iconSize}
            strokeWidth={2.5}
            className={cn("text-gray-500  text-neutral-1000", iconClassName)}
            aria-hidden="true"
          />

          <input
            type="search"
            inputMode="search"
            autoFocus={autoFocus}
            value={val}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label={placeholder}
            className={cn(
              "flex-1 bg-transparent outline-none",
              "text-[16px] leading-none placeholder:text-gray-400"
            )}
          />
        </label>
      </form>
    </header>
  );
}
