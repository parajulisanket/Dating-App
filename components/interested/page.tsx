"use client";

import { useState, FormEvent, useEffect } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const OPTIONS = ["Man", "Woman", "All"] as const;
type Interested = (typeof OPTIONS)[number];

interface InterestedPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function InterestedPage({
  value,
  onChange,
  onNext,
}: InterestedPageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValid = !!value;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  if (!mounted) return null;

  return (
    <>
      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          Who are you interested in seeing?
        </h1>

        <form
          id="interested-form"
          onSubmit={onSubmit}
          className="space-y-4 mt-8"
        >
          {OPTIONS.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                aria-pressed={active}
                className={[
                  "w-full h-14 rounded-full border px-6",
                  "flex items-center justify-center text-[18px] font-semibold transition-colors",
                  active
                    ? resolvedTheme === "light"
                      ? "bg-pink-100 border-pink-400 text-pink-600"
                      : "bg-white/30 border-white text-white"
                    : resolvedTheme === "light"
                    ? "border-neutral-300 text-neutral-1000"
                    : "border-white/30 text-white/80",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </form>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton
          disabled={!isValid}
          form="interested-form"
          className="w-full"
        >
          Next
        </NextButton>
      </footer>
    </>
  );
}
