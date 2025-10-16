"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const valid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;

    // TODO: call Django API to send reset code/email
    await new Promise((r) => setTimeout(r, 300));
    // Go to verify or reset flow (choose your path)
    router.push(`/login/verify?email=${encodeURIComponent(email)}`);
  }

  return (
    <StepLayout
      backHref="/login/email"
      title="Forgot Password?"
      subtitle={
        <p className="text-[15px] leading-6 text-neutral-600">
          Enter your registered email to get password
          <br /> reset code.
        </p>
      }
      footer={
        <NextButton form="forgot-form" disabled={!valid}>
          Send Code
        </NextButton>
      }
    >
      <form id="forgot-form" onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email address"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
    </StepLayout>
  );
}
