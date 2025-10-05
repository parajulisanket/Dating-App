"use client";

import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";

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

  const togglePwdVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="w-full flex justify-center">
      <main className="w-full min-h-screen flex flex-col px-5 pt-6 pb-6">
        <div className="items-center gap-2">
          <Link
            href="/signup"
            aria-label="Back"
            className="text-[#f72fa2] p-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
          </Link>
          <h1 className="title">
            Create Account with
            <br />
            Phone Number
          </h1>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1">
          <div className="mt-8 space-y-4">
            {/* Phone input */}
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              className="w-full h-12 rounded-2xl border border-neutral-300 px-5 text-[15px] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Password under phone */}
            <div className="relative">
              <input
                ref={pwdRef}
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create password"
                className="w-full h-12 rounded-2xl border border-neutral-300 px-5 pr-12 text-[15px] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onMouseDown={togglePwdVisibility}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="flex-1" />

          <button
            type="submit"
            disabled={!isValid || busy}
            className={
              isValid && !busy
                ? "btn btn-signup"
                : "btn bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
            }
          >
            {busy ? "Please wait..." : "Next"}
          </button>
        </form>
      </main>
    </div>
  );
}
