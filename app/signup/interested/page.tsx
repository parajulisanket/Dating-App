"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const OPTIONS = ["Man", "Woman", "All"] as const;
type Interested = (typeof OPTIONS)[number];

export default function InterestedPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<Interested | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValid = !!selected;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/hobbies");
  }

  const skip = () => router.push("/signup/hobbies");

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={() => router.push("/signup/orientation")}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={skip}
          className="text-heading text-base font-semibold hover:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors"
        >
          Skip
        </button>
      </header>

      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          Who are you interested in seeing?
        </h1>

        <form
          id="interested-form"
          onSubmit={onSubmit}
          className="space-y-4 mt-5"
        >
          {OPTIONS.map((opt) => {
            const active = selected === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelected(opt)}
                aria-pressed={active}
                className={[
                  "w-full h-14 rounded-full border px-6",
                  "flex items-center justify-center text-[18px] font-semibold transition-colors",
                  active
                    ? theme === "light"
                      ? "bg-pink-100 border-pink-400 text-pink-600"
                      : "bg-white/30 border-white text-white"
                    : theme === "light"
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
    </div>
  );
}
