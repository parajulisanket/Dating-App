"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, FormEvent } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import axios, { AxiosError } from "axios";
import WarningTryAgainDialog from "@/components/dialogs/WarningTryAgainDialog";
import InfoDialog from "@/components/dialogs/InfoDialog";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnDesc, setWarnDesc] = useState<React.ReactNode>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoDesc, setInfoDesc] = useState<React.ReactNode>(null);

  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();

  const valid = useMemo(() => EMAIL_RX.test(email.trim()), [email]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!valid) {
      setInfoDesc("Invalid email address. Please enter a valid email.");
      setInfoOpen(true);
      return;
    }

    setWarnOpen(false);
    setInfoOpen(false);
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/forgot-password/`,
        { email: email.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      router.push(`/login/verify/?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      const ax = err as AxiosError<any>;
      const status = ax.response?.status;
      const data = ax.response?.data;

      const serverMsg =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        "";

      if (status === 400 || status === 404) {
        setInfoDesc(
          serverMsg || "We couldn't find an account with that email."
        );
        setInfoOpen(true);
      } else if (status === 429) {
        setWarnDesc("Too many attempts. Please wait a minute and try again.");
        setWarnOpen(true);
      } else {
        setWarnDesc(serverMsg || "Something went wrong. Please try again.");
        setWarnOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center ">
      {/* Dialogs */}
      <WarningTryAgainDialog open={warnOpen} onOpenChange={setWarnOpen}>
        {warnDesc}
      </WarningTryAgainDialog>
      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen}>
        {infoDesc}
      </InfoDialog>

      <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
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
              Enter your registered email to get a password reset code.
            </p>
          )}

          {/* noValidate prevents native browser tooltip */}
          <form
            id="forgot-form"
            onSubmit={onSubmit}
            noValidate
            className="mt-8"
          >
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </form>
        </main>

        {/* FOOTER */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <button
            type="submit"
            onClick={() =>
              (
                document.querySelector("#forgot-form") as HTMLFormElement | null
              )?.requestSubmit()
            }
            disabled={!valid || loading}
            className={
              !valid || loading
                ? "btn w-full bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
                : "btn btn-signup w-full"
            }
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </footer>
      </div>
    </div>
  );
}
