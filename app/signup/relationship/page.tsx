"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

type Option = { key: string; emoji: string; label: string };

const OPTIONS: Option[] = [
  { key: "serious", emoji: "💞", label: "Serious\nRelationship" },
  { key: "short_term_rel", emoji: "🫶", label: "Short-Term\nRelationship" },
  { key: "friendship", emoji: "💬", label: "Friendship" },
  { key: "short_term_fun", emoji: "🎉", label: "Short-Term Fun" },
  { key: "text", emoji: "😍", label: "Text" },
  { key: "unsure", emoji: "🤔", label: "Still Figuring Out" },
];

export default function RelationshipPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const isValid = !!selected;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/orientation");
  }

  return (
    <StepLayout
      backHref="/signup/gender"
      title="What are you looking for?"
      footer={
        <NextButton disabled={!isValid} form="relationship-form">
          Next
        </NextButton>
      }
    >
      <form id="relationship-form" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4 bg-background">
          {OPTIONS.map((o) => {
            const active = selected === o.key;
            return (
              <button
                key={o.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(o.key)}
                className={[
                  "rounded-[18px] border ",
                  "px-3 py-4 text-center",
                  "min-h-[118px] flex flex-col items-center justify-center",
                  active
                    ? theme === 'light'
                      ? 'bg-primary-500/10 border-primary-500/40 text-primary-500'
                      : 'bg-[#FFFFFF4D] border-white'
                    : theme === 'light'
                      ? 'border-neutral-200  '
                      : 'border-[#FFFFFF4D] ',
                  "transition-colors",
                ].join(" ")}
              >
                <div className="text-[28px] leading-none">{o.emoji}</div>
                <div className="mt-2 text-[15px] font-medium text-neutral-1000 whitespace-pre-line">
                  {o.label}
                </div>
              </button>
            );
          })}
        </div>
      </form>
    </StepLayout>
  );
}
