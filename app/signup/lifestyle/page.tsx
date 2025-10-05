// app/signup/lifestyle/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

type Choice = { key: string; label: string };
type Question = {
  key: string;
  icon: string;
  title: string;
  options: Choice[];
};

const QUESTIONS: Question[] = [
  {
    key: "drink",
    icon: "🥂",
    title: "Do you drink?",
    options: [
      { key: "never", label: "Never" },
      { key: "socially", label: "Socially" },
      { key: "occasionally", label: "Occasionally" },
      { key: "often", label: "Often" },
    ],
  },
  {
    key: "smoke",
    icon: "🚬",
    title: "Do you smoke?",
    options: [
      { key: "never", label: "Never" },
      { key: "socially", label: "Socially" },
      { key: "occasionally", label: "Occasionally" },
      { key: "often", label: "Often" },
    ],
  },
  {
    key: "active",
    icon: "🏃‍♂️",
    title: "How active are you?",
    options: [
      { key: "not_really", label: "Not really" },
      { key: "sometimes", label: "Sometimes" },
      { key: "regularly", label: "Regularly" },
      { key: "fitness_life", label: "Fitness is life" },
    ],
  },
  {
    key: "diet",
    icon: "🍔",
    title: "What’s your diet like?",
    options: [
      { key: "no_pref", label: "No preference" },
      { key: "veg", label: "Veg" },
      { key: "nonveg", label: "Non-veg" },
      { key: "other", label: "Other" },
    ],
  },
  {
    key: "travel",
    icon: "✈️",
    title: "Do you like to travel?",
    options: [
      { key: "homebody", label: "Homebody" },
      { key: "sometimes", label: "Sometimes" },
      { key: "love_exploring", label: "Love exploring" },
      { key: "always_planning", label: "Always planning" },
    ],
  },
  {
    key: "pets",
    icon: "🐶",
    title: "Do you have or like pets?",
    options: [
      { key: "love_pets", label: "Love pets" },
      { key: "okay_with_pets", label: "Okay with pets" },
      { key: "prefer_no_pets", label: "Prefer no pets" },
    ],
  },
];

export default function LifestylePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const onPick = (qKey: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qKey]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: send `answers` to API/store
    router.push("/signup/photos");
  };
  const allAnswered = QUESTIONS.every((q) => answers[q.key]);
  const skip = () => router.push("/signup/photos");

  return (
    <StepLayout
      backHref="/signup/hobbies"
      title="What are your lifestyle choices?"
      subtitle={
        <p className="text-[15px] leading-6">
          Let everyone know about your lifestyle to get a
          <br /> better match.
        </p>
      }
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
        <NextButton disabled={!allAnswered} form="lifestyle-form">
          Next
        </NextButton>
      }
    >
      <form id="lifestyle-form" onSubmit={onSubmit} className="space-y-4">
        {QUESTIONS.map((q, idx) => (
          <section
            key={q.key}
            className={[
              "pt-4",
              idx === 0 ? "" : "border-t border-neutral-200",
            ].join(" ")}
          >
            {/* Heading */}
            <h2 className="text-[18px] font-semibold text-neutral-900">
              <span className="mr-2">{q.icon}</span>
              {q.title}
            </h2>

            {/* Two-column options */}
            <div className="grid grid-cols-2 gap-y-3">
              {q.options.map((opt) => {
                const active = answers[q.key] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onPick(q.key, opt.key)}
                    className="flex items-center gap-2 text-[15px] text-neutral-800"
                  >
                    {/* custom radio */}
                    <span
                      className={[
                        "inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border",
                        active ? "border-[#F92FA2]" : "border-neutral-400",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-[10px] w-[10px] rounded-full",
                          active ? "bg-[#F92FA2]" : "bg-transparent",
                        ].join(" ")}
                      />
                    </span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </form>
    </StepLayout>
  );
}
