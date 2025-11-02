"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, FormEvent } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { resolvedTheme } = useTheme();
  const valid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;

    await new Promise((r) => setTimeout(r, 300)); // mock API call
    router.push(`/login/verify?email=${encodeURIComponent(email)}`);
  }

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
            href="/login/email"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>

        {/* CONTENT */}
        <main className="px-4">
          <h1 className="title mt-4 leading-10 text-left">Forgot Password?</h1>

          {mounted && (
            <p
              className={`mt-4 text-[16px] leading-6 ${
                resolvedTheme === "light"
                  ? "text-neutral-700"
                  : "text-neutral-500"
              }`}
            >
              Enter your registered email to get password
              <br /> reset code.
            </p>
          )}

          <form id="forgot-form" onSubmit={onSubmit} className="mt-8 ">
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
        </main>

        {/* FOOTER */}
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
            Send Code
          </button>
        </footer>
      </div>
    </div>
  );
}
