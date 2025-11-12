"use client";

import Link from "next/link";
import { ChevronLeft, Check, Eye, EyeOff } from "lucide-react";
import { FormEvent, useMemo, useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import WarningTryAgainDialog from "@/components/dialogs/WarningTryAgainDialog";
import InfoDialog from "@/components/dialogs/InfoDialog";

export default function SignUpEmailForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const pwdRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  const { resolvedTheme } = useTheme();

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnDesc, setWarnDesc] = useState<React.ReactNode>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoDesc, setInfoDesc] = useState<React.ReactNode>(null);

  const isValid = useMemo(() => {
    if (!email) return false;
    if (!/^\S+@\S+\.\S+$/.test(email)) return false;
    if (!password || password.length < 8) return false;
    return true;
  }, [email, password]);

  const validateAndSetErrors = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!email) {
      setEmailError("Email is required");
      setWarnDesc("Email is required.");
      setWarnOpen(true);
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Enter a valid email");
      setWarnDesc("Enter a valid email address (e.g., name@example.com).");
      setWarnOpen(true);
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password length should be ≥ 8");
      valid = false;
    }
    return valid;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateAndSetErrors()) return;
    setLoading(true);
    try {
      const res = await apiPublic.post("/user/send_otp_in_email/", {
        email,
        password,
      });
      console.log(res);
      if (res.status === 200) {
        router.push(`/signup/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);

        const status = error.response?.status;
        const data = error.response?.data as any;
        const serverMsg =
          (typeof data === "string" ? data : data?.message || data?.detail) ??
          "";

        // Email already exists show Info
        if (status === 409 || (status === 403 && /exist/i.test(serverMsg))) {
          setEmailError("This email is already registered. Please log in.");
          setInfoDesc("This email is already registered. Please log in.");
          setInfoOpen(true);
          return;
        }

        // Bad request
        if (status === 400 && data?.field_errors?.email) {
          const msg = String(data.field_errors.email);
          setEmailError(msg);
          setWarnDesc(msg);
          setWarnOpen(true);
          return;
        }

        // Fallback warning for other errors
        setWarnDesc(
          serverMsg || "We couldn’t complete your request. Please try again."
        );
        setWarnOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-svh items-center justify-center ">
      <WarningTryAgainDialog open={warnOpen} onOpenChange={setWarnOpen}>
        {warnDesc}
      </WarningTryAgainDialog>

      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen}>
        {infoDesc}
      </InfoDialog>

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
        <section className="overflow-y-auto px-4 mt-8">
          <form
            noValidate
            id="signupForm"
            onSubmit={onSubmit}
            className="flex min-h-0 flex-col"
          >
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
            <label className="mt-4 inline-flex items-start gap-2 select-none">
              <span className="relative">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="peer h-4 w-4 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
                />
                {optIn && (
                  <Check
                    size={16}
                    className="absolute left-0 top-0.5 text-white pointer-events-none"
                    strokeWidth={2}
                  />
                )}
              </span>
              <p
                className={`-mt-0.5 text-[13px] leading-6 ${
                  resolvedTheme === "light"
                    ? "text-neutral-600"
                    : "text-neutral-500"
                }`}
              >
                I want to receive updates, news, and offers from myapp.
              </p>
            </label>

            <button type="submit" hidden />
          </form>
        </section>

        {/* FOOTER */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <button
            type="submit"
            form="signupForm"
            disabled={loading}
            className={
              isValid && !loading
                ? "btn btn-signup w-full cursor-pointer"
                : "btn bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100 w-full"
            }
          >
            {loading ? "Sending..." : "Next"}
          </button>
        </footer>
      </div>
    </div>
  );
}
