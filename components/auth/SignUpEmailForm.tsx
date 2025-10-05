"use client";

import Link from "next/link";
import { ChevronLeft, Check, Eye, EyeOff } from "lucide-react";
import { FormEvent, useMemo, useState, useRef } from "react";

export default function SignUpEmailForm({
  onValidSubmit,
  busy = false,
}: {
  onValidSubmit: (args: {
    email: string;
    password: string;
    optIn: boolean;
  }) => void;
  busy?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const pwdRef = useRef<HTMLInputElement>(null);

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const pwdOk = pwd.length >= 6;

  const isValid = emailOk && pwdOk;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || busy) return;
    onValidSubmit({ email, password: pwd, optIn });
  };

  return (
    <div className="w-full flex justify-center">
      <main className="w-full max-w-[390px] min-h-screen flex flex-col px-5 pt-6 pb-8">
        <div className="items-center gap-2">
          <Link
            href="/signup"
            aria-label="Back"
            className="text-[#f72fa2] p-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
          </Link>
          <h1 className="title">
            Create Account
            <br />
            with Email
          </h1>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1">
          <div className="mt-8 space-y-4">
            {/* Email */}
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full h-12 rounded-2xl border border-neutral-300 px-5 text-[15px] 
                         placeholder:text-neutral-400 focus:outline-none focus:ring-2 
                         focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                ref={pwdRef}
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create password"
                className="w-full h-12 rounded-2xl border border-neutral-300 px-5 pr-12 text-[15px] 
                           placeholder:text-neutral-400 focus:outline-none focus:ring-2 
                           focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPwd(!showPwd);
                  pwdRef.current?.focus();
                }}
                className="absolute inset-y-0 right-4 flex items-center text-neutral-500"
              >
                {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Optional Checkbox */}
          <label className="mt-5 inline-flex items-start gap-3 select-none relative">
            <div className="relative">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="peer h-5 w-5 appearance-none rounded border border-pink-400 bg-white 
                           checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
              />
              {optIn && (
                <Check
                  size={16}
                  className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                  strokeWidth={3}
                />
              )}
            </div>
            <span className="text-[14px] leading-5 text-neutral-600">
              I want to receive updates, news, and offers from myapp.
            </span>
          </label>

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
