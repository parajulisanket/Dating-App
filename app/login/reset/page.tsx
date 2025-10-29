"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";
import { Check, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [logoutAll, setLogoutAll] = useState(true);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const valid = useMemo(
    () => pwd.length >= 6 && pwd === confirmPwd,
    [pwd, confirmPwd]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;

    await new Promise((r) => setTimeout(r, 300));
    alert(`Password reset with token: ${token}`);

    router.push("/login/email");
  }

  return (
    <StepLayout
      backHref="/login"
      title="Reset Password"
      footer={
        <NextButton form="reset-form" disabled={!valid}>
          Reset Password
        </NextButton>
      }
    >
      <form id="reset-form" onSubmit={onSubmit} className="space-y-4">
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
          >
            {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Logout all checkbox */}
        <label className="inline-flex items-center gap-2 select-none relative mt-2">
          <span className="relative ">
            <input
              type="checkbox"
              checked={logoutAll}
              onChange={(e) => setLogoutAll(e.target.checked)}
              className="mt-1 peer h-4 w-4 appearance-none rounded border border-primary-500 bg-white checked:bg-[#F92FA2] checked:border-[#F92FA2] transition-colors"
            />
            {logoutAll && (
              <Check
                size={16}
                className="absolute left-0 top-1 text-white pointer-events-none"
                strokeWidth={2}
              />
            )}
          </span>
          <span className="text-sm text-neutral-600">
            Log out of all devices.
          </span>
        </label>
      </form>
    </StepLayout>
  );
}
