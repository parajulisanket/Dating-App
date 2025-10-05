"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get("email") ?? "youremail@gmail.com";

  const [d, setD] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const code = useMemo(() => d.join(""), [d]);
  const valid = code.length === 6;

  const setAt = (i: number, val: string) =>
    setD((prev) => prev.map((x, idx) => (idx === i ? val : x)));

  const onChange = (i: number, v: string) => {
    const c = v
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 1);
    setAt(i, c);
    if (c && i < 5) refs[i + 1].current?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !d[i] && i > 0) {
      setAt(i - 1, "");
      refs[i - 1].current?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs[i - 1].current?.focus();
    if (e.key === "ArrowRight" && i < 5) refs[i + 1].current?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const text = e.clipboardData
      .getData("text")
      .replace(/\s+/g, "")
      .toUpperCase();
    if (!text) return;
    e.preventDefault();
    const chars = text.slice(0, 6).split("");
    setD((prev) => prev.map((_, i) => chars[i] ?? ""));
    refs[Math.min(chars.length, 5)].current?.focus();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) return;

    // Mock flow if backend not set
    if (!API) {
      await new Promise((r) => setTimeout(r, 300));
      router.push("/signup/name");
      return;
    }

    const res = await fetch(`${API}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      alert("Invalid/expired code");
      return;
    }
    router.push("/signup/name");
  };

  return (
    <StepLayout
      backHref="/signup"
      title="Verify Email"
      footer={
        <NextButton disabled={!valid} form="verify-form">
          Verify
        </NextButton>
      }
    >
      <form
        id="verify-form"
        onSubmit={submit}
        onPaste={onPaste}
        className="space-y-6"
      >
        <p className="text-[16px] text-[#777777]">
          Enter verification code we sent to{" "}
          <span className="font-semibold">{emailFromQuery}</span>.
        </p>

        <div className="flex gap-3 ">
          {d.map((v, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="text"
              autoComplete="one-time-code"
              maxLength={1}
              className="
                w-[45px] h-[45px]
                md:w-[50px] md:h-[50px] text-center text-lg
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
