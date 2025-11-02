"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

const RESEND_SECONDS = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "youremail@gmail.com";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { resolvedTheme } = useTheme();

  // 6-digit code boxes
  const [d, setD] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: 6 }, () => null)
  );
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
    if (c && i < 5) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !d[i] && i > 0) {
      setAt(i - 1, "");
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLFormElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    e.preventDefault();
    const chars = text.slice(0, 6).split("");
    setD(() => Array.from({ length: 6 }, (_, i) => chars[i] ?? ""));
    refs.current[Math.min(chars.length, 5)]?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid) return;
    await new Promise((r) => setTimeout(r, 300)); // mock verify
    router.push("/login/reset");
  }

  async function resend() {
    if (sec > 0) return;
    await new Promise((r) => setTimeout(r, 300)); // mock resend
    setSec(RESEND_SECONDS);
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
            href="/login/forgot"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>

        {/* CONTENT */}
        <main className="px-4">
          <h1 className="title mt-4 leading-10 text-left">Verify Email</h1>
          <p
            className={`text-[16px] leading-6 ${
              resolvedTheme === "light"
                ? "text-neutral-700"
                : "text-neutral-500"
            }`}
          >
            Enter verification code we sent to{" "}
            <span className="text-neutral-700 font-semibold">{email}</span>.
          </p>

          <form
            id="verify-form"
            onSubmit={onSubmit}
            onPaste={onPaste}
            className="mt-8 "
          >
            <div className="grid grid-cols-6 gap-2 max-w-[360px]">
              {d.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={v}
                  onChange={(e) => onChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  className="
                  h-12 w-12 text-center text-lg
                  rounded-2xl border border-neutral-300 bg-background
                  focus:outline-none focus:border-[#F92FA2] focus:bg-[#F92FA2]/10
                "
                />
              ))}
            </div>
          </form>
        </main>

        {/* FOOTER */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <button
            type="submit"
            onClick={() =>
              (
                document.querySelector("#verify-form") as HTMLFormElement | null
              )?.requestSubmit()
            }
            disabled={!valid}
            className={
              valid
                ? "btn btn-signup w-full"
                : "btn w-full bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
            }
          >
            Verify
          </button>

          <button
            type="button"
            onClick={resend}
            disabled={sec > 0}
            className={[
              "w-full text-center text-sm font-bold",
              sec > 0 ? "text-[#f92fa2] cursor-not-allowed" : "text-[#F92FA2]",
            ].join(" ")}
          >
            {sec > 0 ? `Resend Code (${sec} Sec)` : "Resend Code"}
          </button>
        </footer>
      </div>
    </div>
  );
}
