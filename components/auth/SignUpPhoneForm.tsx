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
    <div className="flex min-h-svh items-center justify-center ">
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
            Create Account with
            <br />
            Phone Number
          </h1>
        </header>

        {/* FORM */}
        <section className="overflow-y-auto px-4 mt-8">
          <form onSubmit={onSubmit} className="flex min-h-0 flex-col">
            <div className="space-y-4">
              {/* Phone input */}
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

              {/* Password input */}
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

            {/* Spacer to push footer button to bottom */}
            <div className="flex-1" />
          </form>
        </section>

        {/* FOOTER */}
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
