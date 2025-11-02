"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, FormEvent } from "react";
import { Check, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [logoutAll, setLogoutAll] = useState(true);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { resolvedTheme } = useTheme();

  const valid = useMemo(
    () => pwd.length >= 6 && pwd === confirmPwd,
    [pwd, confirmPwd]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;

    await new Promise((r) => setTimeout(r, 300)); // mock
    alert(`Password reset with token: ${token}`);
    router.push("/login/email");
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
            href="/login"
            aria-label="Back"
            className="text-heading px-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
        </header>

        {/* CONTENT */}
        <main className="px-4">
          <h1 className="title mt-4 leading-10 text-left">Reset Password</h1>

          <form id="reset-form" onSubmit={onSubmit} className="mt-8">
            <div className="space-y-4">
              {/* New Password */}
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="New password"
                  className="input"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  className="input"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            {/* check label */}
            <label className="mt-4 inline-flex items-start gap-2 select-none">
              <span className="relative">
                <input
                  type="checkbox"
                  checked={logoutAll}
                  onChange={(e) => setLogoutAll(e.target.checked)}
                  className="peer h-4 w-4 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
                />
                {logoutAll && (
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
                Log out of all devices.
              </p>
            </label>
          </form>
        </main>

        {/* FOOTER */}
        <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
          <button
            type="submit"
            onClick={() =>
              (
                document.querySelector("#reset-form") as HTMLFormElement | null
              )?.requestSubmit()
            }
            disabled={!valid}
            className={
              valid
                ? "btn btn-signup"
                : "btn bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none opacity-100"
            }
          >
            Reset Password
          </button>
        </footer>
      </div>
    </div>
  );
}
