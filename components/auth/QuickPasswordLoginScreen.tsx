"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

type SavedUser = {
  email: string;
  name: string;
  image: string;
};

interface Props {
  loading: boolean;
  onSubmit: (password: string) => void;
  onForgotPassword: () => void;
}

export default function QuickPasswordLoginScreen({
  loading,
  onSubmit,
  onForgotPassword,
}: Props) {
  const [user, setUser] = useState<SavedUser | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("saved_email");
    const userInfoString = localStorage.getItem("userInfo");

    // If we don't have the saved email or the profile data, we can't show the screen.
    if (!email || !userInfoString) {
      // You might want to redirect to the full login page here if this happens
      // (e.g., router.replace("/login/email")), but for now, we'll just return.
      return;
    }

    try {
      const profileInfo = JSON.parse(userInfoString);

      const name = profileInfo.full_name || email;
      const image = profileInfo.profile_pic || "/images/fallback-avatar.png";

      setUser({ email, name, image });
    } catch (e) {
      console.error("Error parsing userInfo from localStorage:", e);
      // If parsing fails, we set a minimal user to avoid a crash,
      // or you could redirect the user.
      const fallbackImage = "/images/fallback-avatar.png";
      setUser({ email, name: email, image: fallbackImage });
    }
  }, []); // Empty dependency array ensures this runs once on mount

  if (!user) {
    return (
      <main className="min-h-svh flex items-center justify-center">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password.trim());
  };

  return (
    <div className="flex flex-col h-screen max-md:min-h-dvh bg-background max-h-[897.222px] max-md:max-h-dvh">
      {/* HEADER - Chevron Left */}
      <header className="px-4 pt-6  flex items-center">
        <Link
          href="/welcome-back"
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>

        {/* Spacer to balance layout */}
        <span className="w-8" />
      </header>

      {/* CENTERED CONTENT SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Avatar */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
          <Image
            src={user.image}
            alt="User"
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Name */}
        <p className="text-[22px] font-bold text-heading">
          {user.name || user.email}
        </p>

        {/* Password Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 px-4 max-w-[420px]"
        >
          <input
            type="password"
            placeholder="Enter password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-signup"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        {/* Forgot Password */}
        <button
          onClick={onForgotPassword}
          className="text-heading text-sm font-semibold"
        >
          Forgot Password?
        </button>
      </section>
    </div>
  );
}
