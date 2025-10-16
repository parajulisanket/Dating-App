"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

const OPTIONS = [
  "Heterosexual",
  "Homosexual",
  "Bisexual",
  "Queer",
  "Other",
] as const;
type Orientation = (typeof OPTIONS)[number];

export default function OrientationPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Orientation | null>(null);
  const [showOnProfile, setShowOnProfile] = useState(true);

  const isValid = !!selected;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    // TODO: save { selected, showOnProfile } to store/API
    router.push("/signup/interested"); // next step in your flow
  }

  const skip = () => router.push("/signup/interested");

  return (
    <StepLayout
      backHref="/signup/relationship"
      title="What is your sexual orientation?"
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
        <>
          {/* Toggle row */}
          <label className="mb-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowOnProfile((v) => !v)}
              aria-pressed={showOnProfile}
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
                showOnProfile
                  ? "bg-[#F92FA2] border-[#F92FA2]"
                  : "bg-[#feeaf6] border-[#F92FA2]",
              ].join(" ")}
            >
              <span
                className={[
                  "pointer-events-none absolute left-0 h-5 w-5 rounded-full transition-transform",
                  showOnProfile
                    ? " bg-white translate-x-5"
                    : "translate-x-0.5 bg-[#f92fa2] border border-[#F92FA2]",
                ].join(" ")}
              />
            </button>
            <span className="text-[16px] text-neutral-800">
              Show my orientation in my profile.
            </span>
          </label>

          <NextButton disabled={!isValid} form="orientation-form">
            Next
          </NextButton>
        </>
      }
    >
      <form id="orientation-form" onSubmit={onSubmit} className="space-y-4">
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
