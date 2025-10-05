"use client";

import { useRouter } from "next/navigation";
import SignUpPhoneForm from "@/components/auth/SignUpPhoneForm";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function PhonePage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onValidSubmit({ phone }: { phone: string }) {
    setBusy(true);
    try {
      if (!API) {
        // Mock success then go to verify
        await new Promise((r) => setTimeout(r, 400));
        router.push(`/signup/verify?phone=${encodeURIComponent(phone)}`);
        return;
      }

      const res = await fetch(`${API}/auth/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone }), // <- only phone now
      });

      if (!res.ok) throw new Error(await res.text());
      router.push(`/signup/verify?phone=${encodeURIComponent(phone)}`);
    } catch {
      alert("Failed to start signup. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <SignUpPhoneForm onValidSubmit={onValidSubmit} busy={busy} />;
}
