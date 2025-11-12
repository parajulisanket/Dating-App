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
  onContinue?: () => void;
  autoCloseMs?: number;
};

export default function SuccessDialog({
  open,
  onOpenChange,
  children,
  className,
  headerImage = "/icons/check-circle-fill.svg",
  onContinue,
  autoCloseMs = 5000,
}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open || !autoCloseMs || autoCloseMs <= 0) return;
    const timer = window.setTimeout(() => onOpenChange(false), autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [open, autoCloseMs, onOpenChange]);

  // Close on Esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  const close = () => onOpenChange(false);
  const handleContinue = () => {
    onContinue?.();
    close();
  };

  const node = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <div
        className={cn(
          "relative w-[80%] max-w-[340px] rounded-[28px] bg-white shadow-xl dark:bg-neutral-900",
          className
        )}
      >
        <div className="flex items-center justify-center mt-4">
          <img
            src={headerImage}
            alt="success"
            className="w-10 h-10 object-contain"
          />
        </div>

        {children && (
          <div className="px-5 py-4 text-center font-semibold text-[20px] text-neutral-1000 dark:text-neutral-200">
            {children}
          </div>
        )}

        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />

        <div className="grid">
          <button
            ref={btnRef}
            className="rounded-b-[28px] py-3 text-lg font-bold text-neutral-700 dark:text-neutral-50"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
