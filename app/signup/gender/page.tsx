"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";

const GENDERS = ["Man", "Woman", "Other"] as const;
type Gender = (typeof GENDERS)[number];

export default function GenderPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Gender | null>(null);
  const isValid = !!selected;

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
                    ? "bg-pink-100 border-pink-400 text-primary-500"
                    : "border-neutral-300 text-neutral-1000",
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
    </div>
  );
}
