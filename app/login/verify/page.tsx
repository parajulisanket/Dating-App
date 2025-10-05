"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

const RESEND_SECONDS = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "youremail@gmail.com";

  // 6-digit code boxes
  const [d, setD] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const code = useMemo(() => d.join(""), [d]);
  const valid = code.length === 6;

  // resend countdown
  const [sec, setSec] = useState(RESEND_SECONDS);
  useEffect(() => {
    if (sec <= 0) return;
    const t = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [sec]);

  const setAt = (i: number, v: string) =>
    setD((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  function onChange(i: number, v: string) {
    const c = v.replace(/\D/g, "").slice(0, 1); // numbers only
    setAt(i, c);
    if (c && i < 5) refs[i + 1].current?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !d[i] && i > 0) {
      setAt(i - 1, "");
      refs[i - 1].current?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs[i - 1].current?.focus();
    if (e.key === "ArrowRight" && i < 5) refs[i + 1].current?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLFormElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    e.preventDefault();
    const chars = text.slice(0, 6).split("");
    setD((_) => Array.from({ length: 6 }, (_, i) => chars[i] ?? ""));
    refs[Math.min(chars.length, 5)].current?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid) return;

    // TODO: call your Django /auth/verify endpoint
    await new Promise((r) => setTimeout(r, 300)); // mock
    router.push("/login/reset");
  }

  async function resend() {
    if (sec > 0) return;
    // TODO: call your backend to re-send code to `email`
    await new Promise((r) => setTimeout(r, 300)); // mock
    setSec(RESEND_SECONDS);
  }

  return (
    <StepLayout
      backHref="/login/email"
      title="Verify Email"
      subtitle={
        <p className="text-[15px] leading-6 text-neutral-600">
          Enter verification code we sent to{" "}
          <span className="text-[#F92FA2] font-semibold">{email}</span>.
        </p>
      }
      footer={
        <>
          <NextButton form="verify-form" disabled={!valid}>
            Verify
          </NextButton>
          <button
            type="button"
            onClick={resend}
            disabled={sec > 0}
            className={[
              "mt-3 w-full text-center text-sm font-bold",
              sec > 0 ? "text-[#f92fa2] cursor-not-allowed" : "text-[#F92FA2]",
            ].join(" ")}
          >
            {sec > 0 ? `Resend Code (${sec} Sec)` : "Resend Code"}
          </button>
        </>
      }
    >
      <form
        id="verify-form"
        onSubmit={onSubmit}
        onPaste={onPaste}
        className="space-y-6"
      >
        <div className="grid grid-cols-6 gap-2 max-w-[360px]">
          {d.map((v, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              className="
                h-12 w-12 sm:w-12 text-center text-lg
                rounded-2xl border border-neutral-300 bg-white
                focus:outline-none focus:ring-2 focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10
              "
            />
          ))}
        </div>
      </form>
    </StepLayout>
  );
}
