"use client";

import { useState, useEffect, FormEvent } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

type Option = { key: RelationshipKey; emoji: string; label: string };
type RelationshipKey =
  | "serious_relationship"
  | "short_term_relationship"
  | "friendship"
  | "short_term_fun"
  | "text"
  | "still_figuring_out";

const OPTIONS: Option[] = [
  { key: "serious_relationship", emoji: "💞", label: "Serious\nRelationship" },
  {
    key: "short_term_relationship",
    emoji: "🫶",
    label: "Short-Term\nRelationship",
  },
  { key: "friendship", emoji: "💬", label: "Friendship" },
  { key: "short_term_fun", emoji: "🎉", label: "Short-Term Fun" },
  { key: "text", emoji: "😍", label: "Text" },
  { key: "still_figuring_out", emoji: "🤔", label: "Still Figuring Out" },
];

interface RelationshipPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function RelationshipPage({
  value,
  onChange,
  onNext,
}: RelationshipPageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValid = !!value;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  if (!mounted) return null;

  return (
    <>
      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What are you looking for?
        </h1>
        {mounted && (
          <form id="relationship-form" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {OPTIONS.map((o) => {
                const active = value === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChange(o.key)}
                    className={[
                      "rounded-[18px] border px-3 py-4 text-center min-h-[118px]",
                      "flex flex-col items-center justify-center transition-colors",
                      active
                        ? resolvedTheme === "light"
                          ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                          : "bg-white/30 border-white text-white"
                        : resolvedTheme === "light"
                        ? "border-neutral-200"
                        : "border-white/30 text-white/80",
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
        )}
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton
          disabled={!isValid}
          form="relationship-form"
          className="w-full"
        >
          Next
        </NextButton>
      </footer>
    </>
  );
}
