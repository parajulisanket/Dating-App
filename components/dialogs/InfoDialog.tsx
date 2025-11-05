"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
  headerImage?: string;
};

export default function InfoDialog({
  open,
  onOpenChange,
  children,
  className,
  headerImage = "/icons/WarningCircle.svg",
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  const close = () => onOpenChange(false);

  const node = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <div
        className={cn(
          "relative w-[80%] max-w-[316px] rounded-[28px] bg-white shadow-xl dark:bg-neutral-900",
          className
        )}
      >
        {/* Fixed header (image instead of text) */}
        <div className="flex items-center justify-center mt-4">
          <img
            src={headerImage}
            alt="info icon"
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Middle  */}
        {children ? (
          <div className="px-5 py-4 text-center font-bold text-[20px] text-neutral-1000 dark:text-neutral-200">
            {children}
          </div>
        ) : null}

        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />

        {/* Fixed action */}
        <div className="grid">
          <button
            className="rounded-b-[28px] py-3 text-lg font-bold text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-white/5"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
