"use client";

import { useTheme } from "next-themes";
import * as React from "react";

type TabKey = "all" | "unread" | "archived";

export default function MessageFilter({
  defaultValue = "all",
  onChange,
  className = "",
}: {
  defaultValue?: TabKey;
  onChange?: (v: TabKey) => void;
  className?: string;
}) {
  const [value, setValue] = React.useState<TabKey>(defaultValue);
  const { theme, resolvedTheme } = useTheme();
  const select = (v: TabKey) => {
    setValue(v);
    onChange?.(v);
  };

  const Pill = ({ tab, label }: { tab: TabKey; label: string }) => {
    const active = value === tab;
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => select(tab)}
        className={[
          "inline-flex items-center justify-center",
          "px-4 py-2 rounded-4xl",
          "text-sm leading-none",
          active
            ? "bg-[#F92FA2] text-white border-transparent font-bold"
            : resolvedTheme === "light"
            ? "bg-background border border-neutral-200 text-neutral-1000 font-medium"
            : " border border-white/40 text-white font-medium",
          "transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB3FA5]/40",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      role="tablist"
      aria-label="Messages filter"
      className={[
        "flex items-center gap-2 pt-3 px-4 pb-2 border-b border-borderButton",
        className,
      ].join(" ")}
    >
      <Pill tab="all" label="All" />
      <Pill tab="unread" label="Unread" />
      <Pill tab="archived" label="Archived" />
    </div>
  );
}
