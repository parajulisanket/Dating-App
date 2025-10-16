"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

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
          className="text-[#F92FA2] text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
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
                    ? "border-[#F92FA2] bg-[#F92FA2]/10 text-[#F92FA2] font-medium "
                    : "border-neutral-300 text-[#333333] bg-white",
                ].join(" ")}
              >
                <span className="text-lg">{z.emoji}</span>
                <span className="text-[15px]">{z.label}</span>
              </button>
            );
          })}
        </div>

        {/* Note */}
        <p className="mt-6 text-[15px] leading-6 text-[#333333]">
          Your zodiac sign will be public.{" "}
          <span className="font-bold">You can&apos;t change it later.</span>
        </p>
      </form>
    </StepLayout>
  );
}
