"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const OPTIONS = [
  "Heterosexual",
  "Homosexual",
  "Bisexual",
  "Queer",
  "Other",
] as const;
type Orientation = (typeof OPTIONS)[number];

export default function OrientationPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<Orientation | null>(null);
  const [showOnProfile, setShowOnProfile] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isValid = !!selected;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    // TODO: save { selected, showOnProfile }
    router.push("/signup/interested");
  }

  const skip = () => router.push("/signup/interested");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={() => router.push("/signup/relationship")}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={skip}
          className="text-heading text-base font-semibold active:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors"
        >
          Skip
        </button>
      </header>

      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What is your sexual <br />
          orientation?
        </h1>

        <form
          id="orientation-form"
          onSubmit={onSubmit}
          className="space-y-4 mt-8"
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
        {/* Toggle row */}
        <label className="mb-4 flex items-center justify-center gap-2 select-none">
          <button
            type="button"
            onClick={() => setShowOnProfile((v) => !v)}
            className={[
              "flex items-center h-6 w-[42px] rounded-full p-[2px] border transition-all duration-300",
              showOnProfile
                ? "bg-[#f92fa2] border-[#f92fa2]"
                : "bg-[#f92fa2]/10 border-[#f92fa2]",
            ].join(" ")}
            aria-pressed={showOnProfile}
            aria-label="Toggle show orientation on profile"
          >
            <span
              className={[
                "h-[16px] w-[16px] rounded-full shadow-md transition-transform duration-300",
                showOnProfile
                  ? "translate-x-[20px] bg-white"
                  : "translate-x-0 bg-[#f92fa2]",
              ].join(" ")}
            />
          </button>
          <span className="text-[16px] font-medium text-neutral-1000">
            Show my orientation in my profile.
          </span>
        </label>

        <NextButton
          disabled={!isValid}
          form="orientation-form"
          className="w-full"
        >
          Next
        </NextButton>
      </footer>
    </div>
  );
}
