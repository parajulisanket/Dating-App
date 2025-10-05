"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
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
    <StepLayout
      backHref="/signup/zodiac"
      title="What is your gender?"
      footer={
        <NextButton disabled={!isValid} form="gender-form">
          Next
        </NextButton>
      }
    >
      <form
        id="gender-form"
        onSubmit={onSubmit}
        className="flex flex-col flex-1"
      >
        <div className="mt-2 space-y-4">
          {GENDERS.map((g) => {
            const active = selected === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelected(g)}
                className={[
                  "w-full h-14 rounded-full border px-6",
                  "flex items-center justify-center text-[18px] font-semibold",
                  active
                    ? "border-[#F92FA2] bg-[#F92FA2]/10 text-[#F92FA2]"
                    : "border-neutral-300 text-neutral-800 bg-white",
                ].join(" ")}
              >
                {g}
              </button>
            );
          })}
        </div>
      </form>
    </StepLayout>
  );
}
