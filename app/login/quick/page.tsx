"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import QuickPasswordLoginScreen from "@/components/auth/QuickPasswordLoginScreen";
import WarningTryAgainDialog from "@/components/dialogs/WarningTryAgainDialog";

function coerceBool(v: any): boolean | null {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (["1", "true", "yes", "y"].includes(s)) return true;
    if (["0", "false", "no", "n"].includes(s)) return false;
  }
  return null;
}

function findHasProfile(obj: any): boolean | null {
  const KEY_RX =
    /(has[_-]?profile|profile[_-]?complete(d)?|profile[_-]?done|profileComplete|profileCompleted)/i;
  try {
    const stack = [obj];
    const seen = new Set<any>();
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
      seen.add(cur);

      if (Array.isArray(cur)) {
        for (const v of cur) stack.push(v);
        continue;
      }

      for (const [k, v] of Object.entries(cur)) {
        if (KEY_RX.test(k)) {
          const b = coerceBool(v);
          if (b !== null) return b;
        }
        if (v && typeof v === "object") stack.push(v);
      }
    }
  } catch {}
  return null;
}

function readHasProfileFromBody(body: any): boolean | null {
  return findHasProfile(body);
}

function readHasProfileFromJwt(token?: string | null): boolean | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = decodeURIComponent(
      atob(part.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json);
    return findHasProfile(payload);
  } catch {
    return null;
  }
}

export default function QuickLoginPage() {
  const router = useRouter();
  const { storeLoginToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnMessage, setWarnMessage] = useState(
    "Incorrect password. Please try again."
  );

  const handleQuickLogin = async (password: string) => {
    const email = localStorage.getItem("saved_email");
    if (!email) {
      router.replace("/login/email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/login/`,
        { email: email.trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token: string | undefined = res.data?.access || res.data?.token;
      if (!token) throw new Error("No token received from server");

      // save token
      storeLoginToken(token);

      // check profile status (same logic as main login)
      const fromBody = readHasProfileFromBody(res.data);
      const hasProfile =
        fromBody !== null ? fromBody : readHasProfileFromJwt(token) ?? false;

      router.replace(hasProfile ? "/home" : "/setup");
    } catch (err: any) {
      console.error("Quick login error:", err?.response?.data || err);

      const status = err?.response?.status;
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : "") ||
        "";

      if (status === 401 || /password/i.test(msg || "")) {
        setWarnMessage("Incorrect password. Please try again.");
      } else {
        setWarnMessage(msg || "Unable to log in. Please try again.");
      }

      setWarnOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WarningTryAgainDialog open={warnOpen} onOpenChange={setWarnOpen}>
        {warnMessage}
      </WarningTryAgainDialog>

      <QuickPasswordLoginScreen
        loading={loading}
        onSubmit={handleQuickLogin}
        onForgotPassword={() => router.push("/login/forgot")}
      />
    </>
  );
}
