"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  FormEvent,
  useEffect,
  useContext,
} from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
const API = process.env.NEXT_PUBLIC_API_BASE;

export default function VerifyPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { verifyEmail } = useAuth();
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get("email") ?? "youremail@gmail.com";

  const [d, setD] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: 6 }, () => null)
  );

  const code = useMemo(() => d.join(""), [d]);
  const valid = code.length === 6;

  const setAt = (i: number, val: string) =>
    setD((prev) => prev.map((x, idx) => (idx === i ? val : x)));

  const onChange = (i: number, v: string) => {
    const c = v
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 1);
    setAt(i, c);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !d[i] && i > 0) {
      setAt(i - 1, "");
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const text = e.clipboardData
      .getData("text")
      .replace(/\s+/g, "")
      .toUpperCase();
    if (!text) return;
    e.preventDefault();
    const chars = text.slice(0, 6).split("");
    setD(() => Array.from({ length: 6 }, (_, i) => chars[i] ?? ""));
    refs.current[Math.min(chars.length, 5)]?.focus();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid || loading) return;
    console.log({ code });
    if (!valid) return;
    try {
      setLoading(true);
      const res = await apiPublic.post("/user/verify_otp_of_email/", {
        email: emailFromQuery,
        otp: code,
      });
      console.log("verify-data", res);
      const token = res?.data?.token;
      console.log("token", token);

      verifyEmail(token);
      console.log("line executing");
      if (res.status === 200) {
        router.push("/setup");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-background">
      {/* PHONE VIEW */}
      <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
        {/* HEADER: back chevron only  */}
        <header className="flex flex-col items-start px-4 pt-6 ">
          <Link
            href="/signup/email"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>

        {/* CONTENT: left-aligned title, text, and inputs */}
        <main className="px-4">
          <form id="verify-form" onSubmit={submit} onPaste={onPaste}>
            <h1 className="title mt-4 leading-10 text-left">Verify Email</h1>

            {mounted && (
              <p
                className={`mt-2 text-[16px] ${
                  resolvedTheme === "light"
                    ? "text-neutral-700"
                    : "text-neutral-500"
                }`}
              >
                Enter verification code we sent to{" "}
                <span className="font-semibold ">{emailFromQuery}</span>.
              </p>
            )}

            <div className="mt-8 flex gap-2">
              {d.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={v}
                  onChange={(e) => onChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  inputMode="text"
                  autoComplete="one-time-code"
                  maxLength={1}
                  className="
                    w-[49px] h-[49px]
                    text-center text-lg rounded-2xl border border-neutral-300 bg-background
                    focus:outline-none focus:border-[#F92FA2] focus:bg-[#F92FA2]/10
                  "
                />
              ))}
            </div>
          </form>
        </main>

        {/* FOOTER: button inside phone, pinned at bottom */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <NextButton
            type="submit"
            disabled={!valid || loading}
            form="verify-form"
            className="w-full"
          >
            Verify
          </NextButton>
        </footer>
      </div>
    </div>
  );
}
