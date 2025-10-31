"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useMemo } from "react";
import { Check, Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from "next/link";

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

    await new Promise((r) => setTimeout(r, 300)); // mock
    if (remember) localStorage.setItem("remember_me", "1");
    else localStorage.removeItem("remember_me");
    router.push("/home");
  }

  return (
    <div className="flex min-h-svh items-center justify-center ">
      {/* HEADER: only back chevron */}
      <div
        className="
          w-full max-w-[425px] min-h-svh
          grid grid-rows-[auto_1fr_auto]
          bg-background overflow-hidden
        "
      >
        <header className="flex flex-col items-start px-4 pt-6">
          <Link
            href="/login"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>

        {/* CONTENT */}
        <main className="px-4">
          {/* Big pink title under chevron */}
          <h1 className="title mt-4 leading-10 text-left">Log In</h1>

          <form
            id="login-email-form"
            onSubmit={onSubmit}
            className="mt-5 space-y-4"
          >
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
                className="input pr-12"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                aria-label={showPwd ? "Hide password" : "Show password"}
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
                    className="peer h-4 w-4 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
                  />
                  {remember && (
                    <Check
                      size={16}
                      className="absolute left-0 top-0.5 text-white"
                      strokeWidth={2}
                    />
                  )}
                </span>
                <span className="text-[17px] text-neutral-500">
                  Remember me
                </span>
              </label>

              <Link
                href="/login/forgot"
                className="text-[#F92FA2] text-[17px] font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </main>

        {/* FOOTER button */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <button
            type="submit"
            onClick={() =>
              (
                document.querySelector("form") as HTMLFormElement | null
              )?.requestSubmit()
            }
            disabled={!valid}
            className={
              valid
                ? "btn btn-signup w-full"
                : "btn w-full bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
            }
          >
            Log In
          </button>
        </footer>
      </div>
    </div>
  );
}
