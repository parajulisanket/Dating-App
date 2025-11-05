"use client";

import { useState, useEffect, FormEvent } from "react";
import { useTheme } from "next-themes";

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
    title: "What's your diet like?",
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

interface LifestylePageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function LifestylePage({
  value,
  onChange,
  onNext,
}: LifestylePageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Initialize answers from value prop
  useEffect(() => {
    if (value && typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        setAnswers(parsed);
      } catch {
        // If not JSON, ignore
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onPick = (qKey: string, optionKey: string) => {
    const newAnswers = { ...answers, [qKey]: optionKey };
    setAnswers(newAnswers);
    // Update parent component with JSON string
    onChange(JSON.stringify(newAnswers));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    onNext();
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.key]);

  if (!mounted) return null;

  return (
    <main className="px-4 pr-3 grid grid-rows-[auto_1fr] min-h-0">
      <div>
        <h1 className="title mt-4 leading-10 text-left">
          What are your lifestyle choices?
        </h1>

        <p
          className={`mt-2 text-[16px] leading-6 ${
            resolvedTheme === "light" ? "text-neutral-700" : "text-neutral-500"
          }`}
        >
          Let everyone know about your lifestyle to get a
          <br /> better match.
        </p>
      </div>

      {/* Scrollable form only */}
      <div
        className="min-h-0 overflow-y-auto no-scrollbar mt-8"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <form id="lifestyle-form" onSubmit={onSubmit} className="space-y-4">
          {QUESTIONS.map((q, idx) => (
            <section
              key={q.key}
              className={[
                "pt-5",
                idx === 0 ? "" : "border-t border-neutral-200",
              ].join(" ")}
            >
              <h2 className="text-[18px] font-medium text-neutral flex items-center gap-2">
                <span aria-hidden>{q.icon}</span>
                <span>{q.title}</span>
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-y-3 gap-x-6">
                {q.options.map((opt) => {
                  const active = answers[q.key] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onPick(q.key, opt.key)}
                      className="flex items-center gap-2 text-[15px] text-neutral"
                      aria-pressed={active}
                    >
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

          {/* Next at end of scroll area */}
          <div
            className="pt-6 pb-8"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
            }}
          >
            <button
              type="submit"
              form="lifestyle-form"
              disabled={!allAnswered}
              className={
                allAnswered
                  ? "btn btn-signup w-full"
                  : "btn w-full bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
              }
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
