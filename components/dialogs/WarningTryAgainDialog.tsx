"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  onTryAgain?: () => void;
  className?: string;
};

export default function WarningTryAgainDialog({
  open,
  onOpenChange,
  children,
  onTryAgain,
  className,
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
      {/* solid overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <div
        className={cn(
          "relative w-[80%] max-w-[316px] rounded-[28px] bg-white shadow-xl dark:bg-neutral-900",
          className
        )}
      >
        {/* Fixed header */}
        <div className="flex items-center justify-center">
          <h2 className="mt-4 text-2xl font-extrabold tracking-wide text-rose-500">
            Warning!
          </h2>
        </div>

        {/* Middle*/}
        {children ? (
          <div className="px-5 py-4 text-center text-[14px] text-neutral-700 dark:text-neutral-200">
            {children}
          </div>
        ) : null}

        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />

        <div className="grid grid-cols-2">
          <button
            className="rounded-bl-[28px] py-3 text-xl font-bold text-primary-500 hover:bg-pink-50 active:bg-pink-100 dark:hover:bg-pink-900/20"
            onClick={() => {
              onTryAgain?.();
              onOpenChange(false);
            }}
          >
            Try Again
          </button>
          <button
            className="rounded-br-[28px] border-l border-neutral-200 py-3 text-xl font-bold text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-white/5"
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
