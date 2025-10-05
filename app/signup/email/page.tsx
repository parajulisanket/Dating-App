"use client";
import { useRouter } from "next/navigation";
import SignUpEmailForm from "@/components/auth/SignUpEmailForm";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE; // undefined while backend is off

export default function EmailPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onValidSubmit({
    email,
    password,
    optIn,
  }: {
    email: string;
    password: string;
    optIn: boolean;
  }) {
    setBusy(true);
    try {
      if (!API) {
        // ---- MOCK: pretend it worked, wait a moment, then move on
        await new Promise((r) => setTimeout(r, 400));
        router.push("/signup/verify");
        return;
      }

      const res = await fetch(`${API}/auth/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, optIn }),
      });

      if (!res.ok) throw new Error(await res.text());
      router.push("/signup/verify");
    } catch (e) {
      alert("Failed to start signup. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <SignUpEmailForm onValidSubmit={onValidSubmit} busy={busy} />;
}
