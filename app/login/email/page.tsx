"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useMemo } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";
import { Check, Eye, EyeOff } from "lucide-react";

export default function LoginEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  const valid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && pwd.length >= 6,
    [email, pwd]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;

    // Mock success (replace with your Django login call)
    await new Promise((r) => setTimeout(r, 300));

    if (remember) localStorage.setItem("remember_me", "1");
    else localStorage.removeItem("remember_me");

    router.push("/home");
  }

  return (
    <StepLayout
      backHref="/login"
      title="Log In"
      footer={
        <NextButton form="login-email-form" disabled={!valid}>
          Log In
        </NextButton>
      }
    >
      <form id="login-email-form" onSubmit={onSubmit} className="space-y-4 ">
        {/* Email */}
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Enter your email address"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password with eye toggle */}
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="input"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
          >
            {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Remember + Forgot row */}
        <div className="mt-2 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 select-none">
            <span className="relative">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mt-1 peer h-4 w-4 appearance-none rounded  bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
              />
              {remember && (
                <Check
                  size={16}
                  className="absolute left-0 top-1 text-white"
                  strokeWidth={2}
                />
              )}
            </span>
            <span className="text-sm leading-5 text-neutral-500 tracking-wide">
              Remember me
            </span>
          </label>

          <a
            href="/login/forgot"
            className="text-[#F92FA2] text-[15px] font-semibold"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </StepLayout>
  );
}
