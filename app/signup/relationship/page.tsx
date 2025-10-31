"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/orientation");
  }

  return (
    <div className="min-h-svh w-full max-w-[425px] mx-auto grid grid-rows-[auto_1fr_auto] bg-background">
      {/* HEADER */}
      <header className="flex flex-col items-start px-4 pt-6">
        <button
          onClick={() => router.push("/signup/gender")}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
      </header>

      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What are you looking for?
        </h1>
        {mounted && (
          <form id="relationship-form" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4 mt-5">
              {OPTIONS.map((o) => {
                const active = selected === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(o.key)}
                    className={[
                      "rounded-[18px] border px-3 py-4 text-center min-h-[118px]",
                      "flex flex-col items-center justify-center transition-colors",
                      active
                        ? theme === "light"
                          ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                          : "bg-white/30 border-white text-white"
                        : theme === "light"
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
    </div>
  );
}
