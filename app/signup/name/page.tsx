"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ChevronLeft } from "lucide-react";
import NextButton from "@/components/ui/NextButton";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function NamePage() {
  const [first, setFirst] = useState("");
  const valid = first.trim().length > 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    if (API) {
      await fetch(`${API}/signup/session`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName: first }),
      });
    } else {
      await new Promise((r) => setTimeout(r, 200));
    }

    location.assign("/signup/dob");
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-background">
      <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
        {/* HEADER: pink back chevron (top-left) */}
        <header className="flex flex-col items-start px-4 pt-6">
          <Link
            href="/signup/verify"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>

        {/* CONTENT: title, input, helper text */}
        <main className="px-4">
          <h1 className="title mt-4  leading-10 text-left">
            What is your name?
          </h1>

          <form id="name-form" onSubmit={submit} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Enter your first name"
              className="input h-12 rounded-2xl"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />

            <p className="pt-1 text-[16px] leading-6 text-neutral-600">
              This name will appear in your profile.
              <br />
              <span className="font-semibold">You can’t change it later.</span>
            </p>
          </form>
        </main>

        {/* FOOTER: pill button at bottom (inside view) */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <NextButton className="w-full" disabled={!valid} form="name-form">
            Next
          </NextButton>
        </footer>
      </div>
    </div>
  );
}
