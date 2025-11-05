"use client";

import { useState, useEffect, FormEvent } from "react";
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

interface HobbiesPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function HobbiesPage({
  value,
  onChange,
  onNext,
}: HobbiesPageProps) {
  const { resolvedTheme } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize selected hobbies from value prop
  useEffect(() => {
    if (value && typeof value === "string") {
      const hobbies = value.split(",").filter(Boolean);
      setSelected(hobbies);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValid = selected.length > 0;

  function toggleHobby(key: string) {
    setSelected((prev) => {
      let newSelected: string[];
      if (prev.includes(key)) {
        newSelected = prev.filter((k) => k !== key);
      } else if (prev.length < 6) {
        newSelected = [...prev, key];
      } else {
        return prev;
      }
      // Update parent component
      onChange(newSelected.join(","));
      return newSelected;
    });
  }

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
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="hobbies-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </>
  );
}
