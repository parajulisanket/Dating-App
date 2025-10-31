"use client";

import Link from "next/link";
import { ChevronLeft, Check, Eye, EyeOff } from "lucide-react";
import { FormEvent, useMemo, useState, useRef, useEffect } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="flex min-h-svh items-center justify-center ">
      {/* MOBILE CONTAINER */}
      <div
        className="
          w-full max-w-[425px] min-h-svh
          grid grid-rows-[auto_1fr_auto]
          bg-background overflow-hidden
        "
      >
        {/* HEADER */}
        <header className="flex flex-col items-start px-4 pt-6">
          <Link
            href="/signup"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
          <h1 className="title mt-4 leading-10 text-left">
            Create Account
            <br />
            with Email
          </h1>
        </header>

        {/* FORM AREA */}
        <section className="overflow-y-auto px-4 mt-4">
          <form onSubmit={onSubmit} className="flex min-h-0 flex-col">
            <div className="space-y-4">
              {/* EMAIL FIELD */}
              <label className="block">
                <span className="sr-only">Email</span>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              {/* PASSWORD FIELD */}
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
                  onClick={() => {
                    setShowPwd(!showPwd);
                    pwdRef.current?.focus();
                  }}
                  className="absolute inset-y-0 right-4 flex items-center text-neutral-500"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </label>
            </div>

            {/* OPT-IN CHECKBOX */}
            <label className="mt-6 inline-flex items-start gap-2 select-none">
              <span className="relative">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
                />
                {optIn && (
                  <Check
                    size={16}
                    className="absolute left-0.5 top-0.5 text-white pointer-events-none"
                    strokeWidth={3}
                  />
                )}
              </span>
              <span className="text-[14px] leading-5 text-neutral-600">
                I want to receive updates, news, and offers from myapp.
              </span>
            </label>
          </form>
        </section>

        {/* FOOTER (inside phone layout) */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
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
                ? "btn btn-signup w-full"
                : "btn bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100 w-full"
            }
          >
            {busy ? "Please wait..." : "Next"}
          </button>
        </footer>
      </div>
    </div>
  );
}
