// app/signup/dob/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

export default function DobPage() {
  const router = useRouter();
  const [dob, setDob] = useState("");

  function onDobChange(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    let out = digits;
    if (digits.length >= 5)
      out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length >= 3)
      out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDob(out);
  }

  const isValid = useMemo(() => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return false;
    const [dd, mm, yyyy] = dob.split("/").map(Number);
    const d = new Date(yyyy, mm - 1, dd);
    if (
      d.getFullYear() !== yyyy ||
      d.getMonth() + 1 !== mm ||
      d.getDate() !== dd
    )
      return false;
    if (d > new Date()) return false;
    return true;
  }, [dob]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/address");
  }

  return (
    <StepLayout
      backHref="/signup"
      // Bigger heading like the screenshot
      title="What is your date of birth?"
      titleClassName="title"
      // Subtitle matches style (darker copy with bold emphasis)
      subtitle={
        <p className="text-[16px] leading-6 text-neutral-700">
          Your age not birthdate will be public.
          <span className="font-semibold">
            {" "}
            You can’t change your birthday later.
          </span>
        </p>
      }
      footer={
        <NextButton disabled={!isValid} form="dob-form">
          Next
        </NextButton>
      }
    >
      <form id="dob-form" onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          placeholder="DD / MM / YYYY"
          maxLength={14}
          className="input"
          value={dob}
          onChange={(e) => onDobChange(e.target.value)}
        />
      </form>
    </StepLayout>
  );
}
