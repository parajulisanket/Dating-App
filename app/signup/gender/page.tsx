"use client";

// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const GENDERS = ["Man", "Woman", "Other"] as const;
type Gender = (typeof GENDERS)[number];

export default function GenderPage() {
  const { theme } = useTheme()
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
                    ? theme === 'light'
                      ? 'bg-primary-500/10 border-primary-500/40 text-primary-500'
                      : 'bg-[#FFFFFF4D] border-white'
                    : theme === 'light'
                      ? 'border-neutral-200  '
                      : 'border-[#FFFFFF4D] ',
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
