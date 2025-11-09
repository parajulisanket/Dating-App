"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

interface DobPageProps {
  value: string; // should be "YYYY-MM-DD"
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function DobPage({ value, onChange, onNext }: DobPageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Validate "YYYY-MM-DD" and ensure it's a real past date
  const isValid = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [yyyy, mm, dd] = value.split("-").map(Number);
    const d = new Date(yyyy, mm - 1, dd);
    if (
      d.getFullYear() !== yyyy ||
      d.getMonth() + 1 !== mm ||
      d.getDate() !== dd
    )
      return false;
    if (d > new Date()) return false;
    return true;
  }, [value]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  return (
    <>
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What is your date <br /> of birth?
        </h1>

        <form id="dob-form" onSubmit={onSubmit} className="mt-8">
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input h-12 rounded-2xl"
            max={new Date().toISOString().slice(0, 10)} // prevent future dates
          />
        </form>

        {mounted && (
          <p
            className={`mt-4 text-[16px] ${
              resolvedTheme === "light"
                ? "text-neutral-700"
                : "text-neutral-500"
            }`}
          >
            Your age, not birthdate, will be public.{" "}
            <span className="font-semibold">
              You can't change your birthday later.
            </span>
          </p>
        )}
      </main>

      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="dob-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </>
  );
}
