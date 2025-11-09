"use client";

import { FormEvent, useEffect } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

const ORIENTATIONS = [
  { key: "heterosexual", label: "Heterosexual" },
  { key: "homosexual", label: "Homosexual" },
  { key: "bisexual", label: "Bisexual" },
  { key: "queer", label: "Queer" },
  { key: "other", label: "Other" },
];

interface OrientationPageProps {
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: (show: boolean) => void;
  onNext: () => void;
  setSkipDisabled?: (disabled: boolean) => void;
}

export default function OrientationPage({
  value,
  show,
  onChange,
  onToggle,
  onNext,
  setSkipDisabled,
}: OrientationPageProps) {
  const { resolvedTheme } = useTheme();
  const isValid = !!value;

  useEffect(() => {
    setSkipDisabled?.(!!value);
    return () => setSkipDisabled?.(false);
  }, [value, setSkipDisabled]);

  useEffect(() => {
    if (!value && show) onToggle(false);
  }, [value, show, onToggle]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  function handleSelect(key: string) {
    if (value === key) {
      onChange("");
      setSkipDisabled?.(false);
    } else {
      onChange(key);
      setSkipDisabled?.(true);
    }
  }

  return (
    <>
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What is your sexual <br />
          orientation?
        </h1>

        <form
          id="orientation-form"
          onSubmit={onSubmit}
          className="space-y-4 mt-8"
          role="radiogroup"
          aria-label="Select orientation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onChange("");
              setSkipDisabled?.(false);
            }
          }}
        >
          {ORIENTATIONS.map((opt) => {
            const active = value === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelect(opt.key)}
                role="radio"
                aria-checked={active}
                className={[
                  "w-full h-14 rounded-full border px-6",
                  "flex items-center justify-center text-[18px] font-semibold transition-colors",
                  active
                    ? resolvedTheme === "light"
                      ? "bg-pink-100 border-pink-400 text-pink-600"
                      : "bg-white/30 border-white text-white"
                    : resolvedTheme === "light"
                    ? "border-neutral-300 text-neutral-1000"
                    : "border-white/30 text-white/80",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </form>
      </main>

      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        {/* Toggle is disabled until an option is selected */}
        <label className="mb-4 flex items-center justify-center gap-2 select-none">
          <button
            type="button"
            onClick={() => isValid && onToggle(!show)}
            disabled={!isValid}
            className={[
              "flex items-center h-6 w-[42px] rounded-full p-[2px] border transition-all duration-300",
              show
                ? "bg-[#f92fa2] border-[#f92fa2]"
                : "bg-[#f92fa2]/10 border-[#f92fa2]",
            ].join(" ")}
            aria-pressed={show}
            aria-label="Toggle show orientation on profile"
            aria-disabled={!isValid}
          >
            <span
              className={[
                "h-[16px] w-[16px] rounded-full shadow-md transition-transform duration-300 flex items-center justify-center text-[10px] font-bold",
                show
                  ? "translate-x-[20px] bg-white text-[#f92fa2]"
                  : "translate-x-0 bg-[#f92fa2] text-transparent",
              ].join(" ")}
            />
          </button>
          <span className="text-[16px] font-medium text-neutral-1000">
            Show my orientation in my profile.
          </span>
        </label>

        <NextButton
          disabled={!isValid}
          form="orientation-form"
          className="w-full"
        >
          Next
        </NextButton>
      </footer>
    </>
  );
}
