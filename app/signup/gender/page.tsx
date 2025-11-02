"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const GENDERS = ["Man", "Woman", "Other"] as const;
type Gender = (typeof GENDERS)[number];

export default function GenderPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Gender | null>(null);
  const isValid = !!selected;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  });
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/relationship");
  }

  return (
    <div className="min-h-svh w-full max-w-[425px] mx-auto grid grid-rows-[auto_1fr_auto] bg-background">
      {/* HEADER */}
      <header className="flex flex-col items-start px-4 pt-6">
        <button
          onClick={() => router.push("/signup/zodiac")}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
        <span className="w-8" /> {/* spacer */}
      </header>

      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What is your gender?
        </h1>
        {mounted && (
          <form id="gender-form" onSubmit={onSubmit} className="space-y-4 mt-5">
            {GENDERS.map((g) => {
              const active = selected === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelected(g)}
                  className={[
                    "w-full h-14 rounded-full border px-6 flex items-center justify-center text-[18px] font-semibold transition-all",
                    active
                      ? theme === "light"
                        ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                        : "bg-[#FFFFFF4D] border-white"
                      : theme === "light"
                      ? "border-neutral-200  "
                      : "border-[#FFFFFF4D] ",
                  ].join(" ")}
                >
                  {g}
                </button>
              );
            })}
          </form>
        )}
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="gender-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </div>
  );
}
