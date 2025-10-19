"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PhoneViewport from "@/components/layout/PhoneViewport";
import { useEffect, useState } from "react";

type Props = {
  backHref?: string;
  title: string;
  subtitle?: React.ReactNode;
  rightNode?: React.ReactNode;
  titleClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  liftFooterWithKeyboard?: boolean;
};

function useKeyboardInset(enabled = true) {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const vv = (globalThis as any).visualViewport as VisualViewport | undefined;
    const update = () => {
      if (!vv) return setInset(0);
      const taken = window.innerHeight - vv.height - vv.offsetTop;
      setInset(Math.max(0, Math.round(taken)));
    };
    if (!vv) return;
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [enabled]);
  return inset;
}

export default function StepLayout({
  backHref,
  title,
  subtitle,
  rightNode,
  titleClassName,
  children,
  footer,
  maxWidth = 425,
  liftFooterWithKeyboard = false,
}: Props) {
  const kbInset = useKeyboardInset(liftFooterWithKeyboard);

  return (
    <PhoneViewport
      maxWidth={maxWidth}
      className="grid grid-rows-[auto_auto_1fr_auto] px-4"
    >
      {/* Top bar */}
      <div className="flex items-start justify-between">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Back"
            className="text-heading p-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        ) : (
          <span className="w-7" />
        )}
        {rightNode ?? <span className="w-7" />}
      </div>

      {/* Title + optional subtitle */}
      <div className="mt-2">
        <h1 className={titleClassName ?? "title"}>{title}</h1>
        {subtitle ? (
          <div className="mt-3 text-sm text-neutral-600">{subtitle}</div>
        ) : null}
      </div>

      {/* Content */}
      <div className="mt-6 min-h-0">{children}</div>

      {/* Footer (pinned; now stays put even when keyboard opens) */}
      {footer ? (
        <div
          className="mt-6"
          style={{
            paddingBottom: `calc(max(env(safe-area-inset-bottom, 0px), ${
              liftFooterWithKeyboard ? kbInset : 0
            }px) + 8px)`,
          }}
        >
          {footer}
        </div>
      ) : null}
    </PhoneViewport>
  );
}
