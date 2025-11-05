"use client";

import { useState, FormEvent, useEffect } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const GENDERS = ["Man", "Woman", "Other"] as const;
type Gender = (typeof GENDERS)[number];

interface GenderPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function GenderPage({
  value,
  onChange,
  onNext,
}: GenderPageProps) {
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
          What is your gender?
        </h1>

        <form id="gender-form" onSubmit={onSubmit} className="space-y-4 mt-8">
          {GENDERS.map((g) => {
            const active = value === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => onChange(g)}
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
                {g}
              </button>
            );
          })}
        </form>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="gender-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </>
  );
}
