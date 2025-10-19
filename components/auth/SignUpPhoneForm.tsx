"use client";

import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import PhoneViewport from "@/components/layout/PhoneViewport";

export default function SignUpPhoneForm({
  onValidSubmit,
  busy = false,
}: {
  onValidSubmit: (args: { phone: string; password: string }) => void;
  busy?: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const pwdRef = useRef<HTMLInputElement>(null);

  const phoneOk = useMemo(
    () => /^\+?[0-9]{8,15}$/.test(phone.replace(/\s/g, "")),
    [phone]
  );
  const pwdOk = pwd.length >= 6;
  const isValid = phoneOk && pwdOk;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || busy) return;
    onValidSubmit({ phone: phone.replace(/\s/g, ""), password: pwd });
  };

  // keep cursor position when toggling visibility (same UX as email form)
  const togglePwdVisibility = () => {
    const el = pwdRef.current;
    const s = el?.selectionStart ?? null;
    const epos = el?.selectionEnd ?? null;
    setShowPwd((p) => !p);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus({ preventScroll: true });
      if (s !== null && epos !== null) {
        try {
          el.setSelectionRange(s, epos);
        } catch {}
      }
    });
  };

  return (
    <PhoneViewport maxWidth={425} className="grid grid-rows-[auto_1fr_auto]">
      {/* HEADER — chevron then title underneath, left aligned */}
      <header className="flex flex-col items-start">
        <Link
          href="/signup"
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
        <h1 className="title mt-4 leading-10 text-left">
          Create Account with
          <br />
          Phone Number
        </h1>
      </header>

      {/* MIDDLE — non-scroll, compact like email form */}
      <section className="mt-4 overflow-hidden">
        <form onSubmit={onSubmit} className="flex min-h-0 flex-col">
          <div className="space-y-4">
            {/* Phone */}
            <label className="block">
              <span className="sr-only">Phone number</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            {/* Password */}
            <label className="block relative">
              <span className="sr-only">Password</span>
              <input
                ref={pwdRef}
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create password"
                className="input pr-12"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={togglePwdVisibility}
                className="absolute inset-y-0 right-4 flex items-center text-neutral-500"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </label>
          </div>

          {/* Spacer keeps layout identical to email form (button in footer) */}
          <div className="flex-1" />
        </form>
      </section>

      {/* FOOTER — fixed; only safe-area padding, no keyboard lift */}
      <footer
        className="space-y-2"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        }}
      >
        <button
          type="submit"
          onClick={() =>
            (
              document.querySelector("form") as HTMLFormElement | null
            )?.requestSubmit()
          }
          disabled={!isValid || busy}
          className={
            isValid && !busy
              ? "btn btn-signup"
              : "btn bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
          }
        >
          {busy ? "Please wait..." : "Next"}
        </button>
      </footer>
    </PhoneViewport>
  );
}
