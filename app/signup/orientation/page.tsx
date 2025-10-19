"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
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
  const { theme } = useTheme();
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
          className="text-heading text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
        >
          Skip
        </button>
      }
      footer={
        <>
          {/* Toggle row */}
          <label className="mb-4 flex items-center justify-center gap-2">
            <div
              onClick={
                showOnProfile
                  ? () => setShowOnProfile(false)
                  : () => setShowOnProfile(true)
              }
              className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-primary-500  transition-all duration-300
              ${showOnProfile ? "bg-primary-500" : "bg-primary-500/10"}
            `}
            >
              <div
                className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${
                  showOnProfile
                    ? "translate-x-[20px] bg-white"
                    : "translate-x-0 bg-primary-500"
                }
              `}
              ></div>
            </div>
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
                  ? theme === "light"
                    ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                    : "bg-[#FFFFFF4D] border-white"
                  : theme === "light"
                  ? "border-neutral-200  "
                  : "border-[#FFFFFF4D] ",
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
