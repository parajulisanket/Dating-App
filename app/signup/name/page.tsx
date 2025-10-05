"use client";

import { FormEvent, useState } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function NamePage() {
  const [first, setFirst] = useState("");
  const valid = first.trim().length > 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    // Save to backend if API is set, otherwise mock and continue
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
    <StepLayout
      backHref="/signup/verify"
      title="What is your name?"
      footer={
        <NextButton disabled={!valid} form="name-form">
          Next
        </NextButton>
      }
    >
      <form id="name-form" onSubmit={submit} className="space-y-3">
        <input
          type="text"
          placeholder="Enter your first name"
          className="w-full h-12 rounded-2xl border border-neutral-300 px-5 text-[15px]
                     placeholder:text-neutral-400 focus:outline-none focus:ring-2
                     focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />

        <p className="pt-1 text-[15px] leading-6 text-neutral-600">
          This name will appear in your profile.
          <br />
          <span className="font-semibold">You can’t change it later.</span>
        </p>
      </form>
    </StepLayout>
  );
}
