"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NotificationSheet } from "@/components/sheets/NotificationSheet";
import { FilterSheet } from "@/components/sheets/FilterSheet";
import { useTheme } from "next-themes";

type TopBarProps = { className?: string };

export default function TopBar({ className }: TopBarProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [open, setOpen] = React.useState<null | "notif" | "filter">(null);
  const [animateIn, setAnimateIn] = React.useState(false);

  const openPanel = (which: "notif" | "filter") => {
    setOpen(which);
    requestAnimationFrame(() => setAnimateIn(true));
  };
  const closePanel = () => {
    setAnimateIn(false);
    setTimeout(() => setOpen(null), 220);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 flex items-center justify-between text-heading p-6 ",
          className
        )}
      >
        <a href="/" className="title">
          LOGO
        </a>
        {mounted && (
          <div className="flex items-center gap-3 ">
            <button
              aria-label="Notifications"
              onClick={() => openPanel("notif")}
              className="p-2 click-effect "
            >
              {resolvedTheme === "light" ? (
                <img
                  src="/icons/bell.svg"
                  alt=""
                  className="w-[26px] h-[26px]"
                />
              ) : (
                <img
                  src="/icons/bellDark.svg"
                  alt=""
                  className="w-[26px] h-[26px]"
                />
              )}
            </button>

            <button
              aria-label="Filters"
              onClick={() => openPanel("filter")}
              className=" p-2 click-effect"
            >
              {resolvedTheme === "light" ? (
                <img
                  src="/icons/slider.svg"
                  alt=""
                  className="w-[26px] h-[26px]"
                />
              ) : (
                <img
                  src="/icons/sliderDark.svg"
                  alt=""
                  className="w-[26px] h-[26px]"
                />
              )}
            </button>
          </div>
        )}
      </header>

      {open && (
        <div className="absolute inset-0 z-[200] bbb">
          <div
            className={cn(
              "fixed inset-0 bg-black/40 transition-opacity duration-200",
              animateIn ? "opacity-100" : "opacity-0"
            )}
            onClick={closePanel}
          />
          <div
            className={cn(
              "absolute max-md:fixed bottom-0 left-0 right-0 w-full rounded-t-3xl bg-background shadow-xl p-6",
              "transition-transform duration-200",
              animateIn ? "translate-y-0" : "translate-y-full"
            )}
          >
            <h2
              className={cn(
                "text-center text-xl font-bold mb-4",
                isDark ? "text-white" : "text-primary-500"
              )}
            >
              {open === "notif" ? "Notifications" : "Filters"}
            </h2>

            {open === "notif" ? (
              <NotificationSheet />
            ) : (
              <FilterSheet onApply={closePanel} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
