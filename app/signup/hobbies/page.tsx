"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const HOBBIES = [
  { key: "football", label: "Football", emoji: "⚽" },
  { key: "singing", label: "Singing", emoji: "🎤" },
  { key: "reading", label: "Reading", emoji: "📖" },
  { key: "acting", label: "Acting", emoji: "🕺" },
  { key: "swimming", label: "Swimming", emoji: "🏊" },
  { key: "cricket", label: "Cricket", emoji: "🏏" },
  { key: "dancing", label: "Dancing", emoji: "💃" },
  { key: "exercising", label: "Exercising", emoji: "💪" },
  { key: "art", label: "Art", emoji: "🎨" },
  { key: "boxing", label: "Boxing", emoji: "🥊" },
  { key: "hiking", label: "Hiking", emoji: "🥾" },
  { key: "meditation", label: "Meditation", emoji: "🧘" },
  { key: "paragliding", label: "Paragliding", emoji: "🪂" },
  { key: "cycling", label: "Cycling", emoji: "🚴" },
];

export default function HobbiesPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const isValid = selected.length > 0;

  function toggleHobby(key: string) {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length < 6) return [...prev, key];
      return prev;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/lifestyle");
  }
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const skip = () => router.push("/signup/lifestyle");

  return (
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={() => router.push("/signup/interested")}
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
      <main className="px-4 ">
        <h1 className="title mt-4 leading-10 text-left">
          What are your hobbies?
        </h1>
        <p
          className={`mt-2 text-[16px] leading-6 ${
            resolvedTheme === "light" ? "text-neutral-700" : "text-neutral-500"
          }`}
        >
          Select <span className="font-semibold">up to 6 hobbies</span> to let
          everyone know you better.
        </p>
        {mounted && (
          <form
            id="hobbies-form"
            onSubmit={onSubmit}
            className="mt-8 grid grid-cols-3 gap-2"
          >
            {HOBBIES.map((h) => {
              const active = selected.includes(h.key);
              return (
                <button
                  key={h.key}
                  type="button"
                  onClick={() => toggleHobby(h.key)}
                  aria-pressed={active}
                  className={[
                    "h-10 rounded-full border flex items-center justify-center gap-2 text-sm tracking-wide transition-colors",
                    active
                      ? resolvedTheme === "light"
                        ? "bg-pink-100 text-pink-600 border-pink-400"
                        : "bg-white/30 border-white text-white"
                      : resolvedTheme === "light"
                      ? "border-neutral-300 text-neutral-1000"
                      : "border-white/30 text-white",
                  ].join(" ")}
                >
                  <span>{h.emoji}</span>
                  <span>{h.label}</span>
                </button>
              );
            })}
          </form>
        )}
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="hobbies-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </div>
  );
}
