"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

interface DobPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function DobPage({ value, onChange, onNext }: DobPageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onDobChange(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    let out = digits;
    if (digits.length >= 5)
      out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length >= 3)
      out = `${digits.slice(0, 2)}/${digits.slice(2)}`;

    onChange(out); // Update parent state
  }

  const isValid = useMemo(() => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
    const [dd, mm, yyyy] = value.split("/").map(Number);
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
    onNext(); // Call parent's goNext function
  }

  return (
    <>
      {/* MAIN CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What is your date <br />
          of birth?
        </h1>

        <form id="dob-form" onSubmit={onSubmit} className="mt-8">
          <input
            type="text"
            inputMode="numeric"
            placeholder="DD / MM / YYYY"
            maxLength={14}
            className="input h-12 rounded-2xl"
            value={value}
            onChange={(e) => onDobChange(e.target.value)}
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
            Your age not birthdate will be public.{" "}
            <span className="font-semibold">
              You can't change your birthday later.
            </span>
          </p>
        )}
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="dob-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </>
  );
}
