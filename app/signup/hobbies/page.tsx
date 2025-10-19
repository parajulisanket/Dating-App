// app/signup/hobbies/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
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
  const { theme } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const isValid = selected.length > 0;

  function toggleHobby(key: string) {
    setSelected((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else if (prev.length < 6) {
        return [...prev, key];
      }
      return prev;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    router.push("/signup/lifestyle");
  }

  const skip = () => router.push("/signup/lifestyle");

  return (
    <StepLayout
      backHref="/signup/interested"
      title="What are your hobbies?"
      subtitle={
        <>
          Select <span className="font-medium">up to 6 hobbies</span> to let
          everyone know you better.
        </>
      }
      rightNode={
        <button
          type="button"
          onClick={skip}
          className="text-heading text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
        >
          Skip
        </button>
      }
      footer={
        <NextButton disabled={!isValid} form="hobbies-form">
          Next
        </NextButton>
      }
    >
      <form
        id="hobbies-form"
        onSubmit={onSubmit}
        className="grid grid-cols-3 gap-3"
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
                "h-10 rounded-full border flex items-center justify-center gap-2 text-sm tracking-wide",
                active
                  ? theme === "light"
                    ? "bg-primary-500/10 text-primary-500 border-primary-500/40"
                    : "bg-[#FFFFFF4D] border-white "
                  : theme === "light"
                  ? " border-neutral-200 text-neutral-1000"
                  : " border-neutral-300",
              ].join(" ")}
            >
              <span>{h.emoji}</span>
              <span>{h.label}</span>
            </button>
          );
        })}
      </form>
    </StepLayout>
  );
}
