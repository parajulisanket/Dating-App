"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
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
  const { resolvedTheme } = useTheme();
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
    router.push("/signup/gender");
  }

  function onSkip() {
    router.push("/signup/gender");
  }

  return (
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={() => router.push("/signup/address")}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="text-heading text-base font-semibold hover:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors"
        >
          Skip
        </button>
      </header>

      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What is your zodiac <br /> sign?
        </h1>
        {mounted && (
          <form
            id="zodiac-form"
            onSubmit={onSubmit}
            className="flex flex-col flex-1 "
          >
            {/* Grid of zodiac buttons */}
            <div className="grid grid-cols-2 gap-2 mt-8">
              {ZODIACS.map((z) => {
                const active = selected === z.key;
                return (
                  <button
                    key={z.key}
                    type="button"
                    onClick={() => setSelected(z.key)}
                    className={[
                      "h-10 w-full rounded-full border px-4",
                      "flex items-center gap-2 justify-start text-[14px] transition-all",
                      active
                        ? resolvedTheme === "light"
                          ? "bg-pink-100 border-pink-400 text-pink-600"
                          : "bg-white/20 border-white text-white"
                        : resolvedTheme === "light"
                        ? "border-neutral-300 text-neutral-1000"
                        : "border-white/30 text-white/80",
                    ].join(" ")}
                  >
                    <span className="text-lg">{z.emoji}</span>
                    <span>{z.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Info text */}
            <p
              className={`mt-4 text-[16px]  ${
                resolvedTheme === "light"
                  ? "text-neutral-700"
                  : "text-neutral-500"
              }`}
            >
              Your zodiac sign will be public.{" "}
              <span className="font-semibold">You can’t change it later.</span>
            </p>
          </form>
        )}
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="zodiac-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </div>
  );
}
