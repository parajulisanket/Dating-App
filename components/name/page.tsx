"use client";

// import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
// import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function NamePage({ value, onChange, onNext }: NameStepProps) {
  const [first, setFirst] = useState("");
  const valid = first.trim().length > 0;

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isValid = value.trim().length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  };

  return (
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER: pink back chevron (top-left) */}
      {/* <header className="flex flex-col items-start px-4 pt-6">
        <Link
          href="/signup/verify"
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
      </header> */}

      {/* CONTENT: title, input, helper text */}
      <main className="px-4">
        <h1 className="title mt-4  leading-10 text-left">What is your name?</h1>

        <form id="name-form" onSubmit={handleSubmit} className="mt-8 ">
          <input
            type="text"
            placeholder="Enter your first name"
            className="input h-12 rounded-2xl"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          {mounted && (
            <p
              className={`mt-4 text-[16px] ${
                resolvedTheme === "light"
                  ? "text-neutral-700"
                  : "text-neutral-500"
              }`}
            >
              This name will appear in your profile.
              <br />
              <span className="font-semibold">You can’t change it later.</span>
            </p>
          )}
        </form>
      </main>

      {/* FOOTER: pill button at bottom (inside view) */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton className="w-full" disabled={!isValid} form="name-form">
          Next
        </NextButton>
      </footer>
    </div>
  );
}
