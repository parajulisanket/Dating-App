// app/signup/interested/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

const OPTIONS = ["Man", "Woman", "All"] as const;
type Interested = (typeof OPTIONS)[number];

export default function InterestedPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Interested | null>(null);

  const isValid = !!selected;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    // TODO: save selected
    router.push("/signup/hobbies");
  }

  const skip = () => router.push("/signup/hobbies");

  return (
    <StepLayout
      backHref="/signup/orientation"
      title="Who are you interested in seeing?"
      rightNode={
        <button
          type="button"
          onClick={skip}
          className="text-[#F92FA2] text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
        >
          Skip
        </button>
      }
      footer={
        <NextButton disabled={!isValid} form="interested-form">
          Next
        </NextButton>
      }
    >
      <form id="interested-form" onSubmit={onSubmit} className="space-y-4">
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
                "flex items-center justify-center text-[18px] font-semibold",
                active
                  ? "border-[#F92FA2] bg-[#F92FA2]/10 text-[#F92FA2]"
                  : "border-neutral-300 text-neutral-800 bg-white",
                "transition-colors",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </form>
    </StepLayout>
  );
}
