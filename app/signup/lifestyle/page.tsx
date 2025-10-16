"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";

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
    // TODO: send answers
    router.push("/signup/photos");
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.key]);
  const skip = () => router.push("/signup/photos");

  return (
    <StepLayout
      backHref="/signup/hobbies"
      title="What are your lifestyle choices?"
      titleClassName="title"
      subtitle={
        <p className="text-[15px] leading-6 text-neutral-600">
          Let everyone know about your lifestyle to get a
          <br /> better match.
        </p>
      }
      rightNode={
        <button
          type="button"
          onClick={skip}
          className="text-[#F92FA2] text-base font-semibold mt-4 px-2 hover:bg-[#f92fa2]/10 rounded-2xl"
        >
          Skip
        </button>
      }
      /* No footer: the Next button is part of the scrollable content at the end */
    >
      {/* Scrollable middle content; keeps footer area empty */}
      <div className="h-full min-h-0 overflow-y-auto no-scrollbar -mr-2 pr-2">
        <form id="lifestyle-form" onSubmit={onSubmit} className="space-y-6">
          {QUESTIONS.map((q, idx) => (
            <section
              key={q.key}
              className={[
                "pt-5",
                idx === 0 ? "" : "border-t border-neutral-200",
              ].join(" ")}
            >
              {/* Heading */}
              <h2 className="text-[18px] font-medium text-neutral-900 flex items-center gap-2">
                <span aria-hidden>{q.icon}</span>
                <span>{q.title}</span>
              </h2>

              {/* Two-column options */}
              <div className="mt-3 grid grid-cols-2 gap-y-3 gap-x-6">
                {q.options.map((opt) => {
                  const active = answers[q.key] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onPick(q.key, opt.key)}
                      className="flex items-center gap-2 text-[15px] text-neutral-800"
                      aria-pressed={active}
                    >
                      {/* custom radio */}
                      <span
                        className={[
                          "inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors",
                          active ? "border-[#F92FA2]" : "border-neutral-400",
                        ].join(" ")}
                        aria-hidden
                      >
                        <span
                          className={[
                            "h-[10px] w-[10px] rounded-full transition-colors",
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

          {/* Next button at the end of the scrollable area */}
          <div
            className="pt-4"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            }}
          >
            <button
              type="submit"
              form="lifestyle-form"
              disabled={!allAnswered}
              className={
                allAnswered
                  ? "btn btn-signup"
                  : "btn bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
              }
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </StepLayout>
  );
}
