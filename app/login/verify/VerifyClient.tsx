"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import axios, { AxiosError } from "axios";
import WarningTryAgainDialog from "@/components/dialogs/WarningTryAgainDialog";
import InfoDialog from "@/components/dialogs/InfoDialog";

const RESEND_SECONDS = 120;

export default function VerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const email = (params.get("email") ?? "").trim();

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnDesc, setWarnDesc] = useState<React.ReactNode>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoDesc, setInfoDesc] = useState<React.ReactNode>(null);

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => setMounted(true), []);

  // 6-digit code boxes
  const [d, setD] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: 6 }, () => null)
  );
  const code = useMemo(() => d.join(""), [d]);
  const valid = code.length === 6;

  // focus first input on mount
  useEffect(() => {
    if (mounted) refs.current[0]?.focus();
  }, [mounted]);

  // OTP entry countdown (always visible)
  const [otpSec, setOtpSec] = useState(RESEND_SECONDS);
  useEffect(() => {
    if (otpSec <= 0) return;
    const t = setInterval(() => setOtpSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [otpSec]);

  const setAt = (i: number, v: string) =>
    setD((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  function onChange(i: number, v: string) {
    const c = v.replace(/\D/g, "").slice(0, 1);
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
    if (!valid || verifying) return;

    if (!email) {
      setInfoDesc("Missing email. Please go back and enter your email again.");
      setInfoOpen(true);
      return;
    }

    setWarnOpen(false);
    setInfoOpen(false);
    setVerifying(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/forgot-password-verify/`,
        { email, otp: code },
        { headers: { "Content-Type": "application/json" } }
      );

      router.push(
        `/login/reset?email=${encodeURIComponent(email)}&otp=${code}`
      );
    } catch (err) {
      const ax = err as AxiosError<any>;
      const status = ax.response?.status;
      const data = ax.response?.data;
      const serverMsg =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        "";

      if (status === 400 || status === 422) {
        setInfoDesc(serverMsg || "Invalid or expired code. Please try again.");
        setInfoOpen(true);
      } else if (status === 404) {
        setInfoDesc(serverMsg || "We couldn’t find that email.");
        setInfoOpen(true);
      } else if (status && status >= 500) {
        setWarnDesc("Server error. Please try again in a moment.");
        setWarnOpen(true);
      } else {
        setWarnDesc(serverMsg || "Something went wrong. Please try again.");
        setWarnOpen(true);
      }
    } finally {
      setVerifying(false);
    }
  }

  // RESEND: no cooldown — only disabled while the request is in-flight
  async function resend() {
    if (resending) return;
    if (!email) {
      setInfoDesc("Missing email. Please go back and enter your email again.");
      setInfoOpen(true);
      return;
    }

    setWarnOpen(false);
    setInfoOpen(false);
    setResending(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/forgot-password/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      // Reset the OTP validity timer and input boxes each resend
      setOtpSec(RESEND_SECONDS);
      setD(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } catch (err) {
      const ax = err as AxiosError<any>;
      const status = ax.response?.status;
      const data = ax.response?.data;
      const serverMsg =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        "";

      if (status === 429) {
        setWarnDesc("Too many requests. Please wait a moment before retrying.");
        setWarnOpen(true);
      } else if (status && status >= 500) {
        setWarnDesc("Server error. Please try again in a moment.");
        setWarnOpen(true);
      } else {
        setWarnDesc(serverMsg || "Couldn’t resend the code. Try again.");
        setWarnOpen(true);
      }
    } finally {
      setResending(false);
    }
  }

  // mm:ss display for OTP validity
  const mm = String(Math.floor(otpSec / 60)).padStart(2, "0");
  const ss = String(otpSec % 60).padStart(2, "0");

  return (
    <div className="flex min-h-svh items-center justify-center ">
      {/* Dialogs */}
      <WarningTryAgainDialog open={warnOpen} onOpenChange={setWarnOpen}>
        {warnDesc}
      </WarningTryAgainDialog>
      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen}>
        {infoDesc}
      </InfoDialog>

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
            Enter the verification code we sent to{" "}
            <span className="text-neutral-700 font-semibold">
              {email || "your email"}
            </span>
            .
          </p>

          <form
            id="verify-form"
            onSubmit={onSubmit}
            onPaste={onPaste}
            className="mt-8"
            noValidate
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
                  disabled={verifying}
                  className="
                    h-12 w-12 text-center text-lg
                    rounded-2xl border border-neutral-300 bg-background
                    focus:outline-none focus:border-[#F92FA2] focus:bg-[#F92FA2]/10
                  "
                />
              ))}
            </div>

            {/* Always-visible OTP countdown */}
            <div className="mt-3 text-sm font-semibold text-[#F92FA2]">
              Code expires in {mm}:{ss}
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
            disabled={!valid || verifying}
            className={
              !valid || verifying
                ? "btn w-full bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                : "btn btn-signup w-full"
            }
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>

          {/* Resend button — ALWAYS enabled except during request */}
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className={`w-full text-center text-sm font-bold ${
              resending ? "text-[#f92fa2] cursor-not-allowed" : "text-[#F92FA2]"
            }`}
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </footer>
      </div>
    </div>
  );
}
