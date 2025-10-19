"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const ZODIACS = [
  { key: "aries", label: "Aries", emoji: "♈️" },
  { key: "taurus", label: "Taurus", emoji: "♉️" },
  { key: "gemini", label: "Gemini", emoji: "♊️" },
  { key: "cancer", label: "Cancer", emoji: "♋️" },
  { key: "leo", label: "Leo", emoji: "♌️" },
  { key: "virgo", label: "Virgo", emoji: "♍️" },
  { key: "libra", label: "Libra", emoji: "♎️" },
  { key: "scorpio", label: "Scorpio", emoji: "♏️" },
  { key: "sagittarius", label: "Sagittarius", emoji: "♐️" },
  { key: "capricorn", label: "Capricorn", emoji: "♑️" },
  { key: "aquarius", label: "Aquarius", emoji: "♒️" },
  { key: "pisces", label: "Pisces", emoji: "♓️" },
];

export default function ZodiacPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const isValid = !!selected;
  const { theme } = useTheme();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/gender");
  }

  const onSkip = () => router.push("/signup/gender");

  return (
    <StepLayout
      backHref="/signup/address"
      title="What is your zodiac sign?"
      rightNode={
        <button
          type="button"
          onClick={onSkip}
          className="text-heading text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
        >
          Skip
        </button>
      }
      footer={
        <NextButton disabled={!isValid} form="zodiac-form">
          Next
        </NextButton>
      }
    >
      <form
        id="zodiac-form"
        onSubmit={onSubmit}
        className="flex flex-col flex-1"
      >
        {/* Two-column grid of pills */}
        <div className="grid grid-cols-2 gap-3">
          {ZODIACS.map((z) => {
            const active = selected === z.key;
            return (
              <button
                key={z.key}
                type="button"
                onClick={() => setSelected(z.key)}
                className={[
                  "h-10 w-full rounded-full border px-4",
                  "flex items-center gap-2 justify-start",
                  active
                    ? theme === "light"
                      ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                      : "bg-[#FFFFFF4D] border-white"
                    : theme === "light"
                    ? "border-neutral-200  "
                    : "border-[#FFFFFF4D] ",
                ].join(" ")}
              >
                <span className="text-lg">{z.emoji}</span>
                <span className="text-[15px]">{z.label}</span>
              </button>
            );
          })}
        </div>

        {/* Note */}
        <p
          className={`mt-6 text-[15px] leading-6  ${
            theme === "light" ? "text-neutral-700" : "text-neutral-500"
          }`}
        >
          Your zodiac sign will be public.{" "}
          <span className="font-bold">You can&apos;t change it later.</span>
        </p>
      </form>
    </StepLayout>
  );
}
