"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function StepLayout({
  backHref,
  title,
  subtitle,
  rightNode,
  titleClassName,
  children,
  footer,
}: {
  backHref?: string;
  title: string;
  subtitle?: React.ReactNode;
  rightNode?: React.ReactNode;
  titleClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center">
      <main className="w-full max-w-[425px] min-h-screen flex flex-col px-5 pt-6 pb-8">
        <div className="flex items-start justify-between">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Back"
              className="text-[#F92FA2] p-2 -ml-2 rounded-full"
            >
              <ChevronLeft size={35} strokeWidth={1.5} />
            </Link>
          ) : (
            <span className="w-7" />
          )}
          {rightNode ?? <span className="w-7" />}
        </div>

        <div className="mt-2">
          <h1 className={titleClassName ?? "title"}>{title}</h1>
          {subtitle ? (
            <div className="mt-3 text-sm text-neutral-600">{subtitle}</div>
          ) : null}
        </div>

        <div className="mt-6 flex-1">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </main>
    </div>
  );
}
