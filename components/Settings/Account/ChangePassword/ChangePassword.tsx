"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import useAxiosAuth from "@/app/hook/useAxiosAuth";
import { useRouter } from "next/navigation";
import SuccessDialog from "@/components/dialogs/SuccessDialog";

export const ChangePasswordComponent = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  const api = useAxiosAuth();

  async function handleChangePassword() {
    if (loading) return;

    setErrorMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/user/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      // Reset fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // OPEN SUCCESS DIALOG
      setSuccessOpen(true);
    } catch (err: any) {
      const data = err?.response?.data;
      const message =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        "Failed to change password.";

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  const isDisabled =
    !currentPassword || !newPassword || !confirmPassword || loading;

  return (
    <>
      {/* SUCCESS DIALOG */}
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        onContinue={() => router.push("/settings/account")}
      >
        Password changed successfully!
      </SuccessDialog>

      <main className="min-h-screen">
        <div className="border-b border-borderButton">
          <div className="px-4 py-4 flex items-center gap-3 text-heading ml-1">
            <Link
              href="/settings/account"
              aria-label="Back"
              className="rounded-full"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </Link>
            <h1 className="text-[24px] font-bold leading-[36px]">
              Change Password
            </h1>
          </div>
        </div>

        <div className="px-4 pt-8 space-y-4">
          {/* Current password */}
          <div className="relative">
            <input
              ref={currentPasswordRef}
              type={showPwd ? "text" : "password"}
              placeholder="Current password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              onClick={() => {
                setShowPwd(!showPwd);
                currentPasswordRef.current?.focus();
              }}
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-neutral-500"
            >
              {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="h-[16px] text-[12px] flex gap-2 items-center text-neutral-600">
            <div className="flex-1 h-[1px] bg-neutral-600" />
            <h2 className="flex-1">Create new password</h2>
            <div className="flex-1 h-[1px] bg-neutral-600" />
          </div>

          {/* New password */}
          <div className="relative">
            <input
              ref={newPasswordRef}
              type={showNewPwd ? "text" : "password"}
              placeholder="New password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={() => {
                setShowNewPwd(!showNewPwd);
                newPasswordRef.current?.focus();
              }}
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-neutral-500"
            >
              {showNewPwd ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Confirm password */}
          <div className="relative">
            <input
              ref={confirmPasswordRef}
              type={showConfirmPwd ? "text" : "password"}
              placeholder="Confirm password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={() => {
                setShowConfirmPwd(!showConfirmPwd);
                confirmPasswordRef.current?.focus();
              }}
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-neutral-500"
            >
              {showConfirmPwd ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Error message */}
          {errorMsg && (
            <p className="text-sm text-primary-500 mt-2">{errorMsg}</p>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto pb-10">
          <div className="max-w-[425px] mx-auto px-4 py-3">
            <button
              onClick={handleChangePassword}
              className="w-full bg-[#f9209b] h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full"
              disabled={isDisabled}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
