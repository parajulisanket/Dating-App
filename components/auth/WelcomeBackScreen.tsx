"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type SavedUser = {
  email: string;
  name: string;
  image: string;
};

export default function WelcomeBackScreen() {
  const router = useRouter();
  const [user, setUser] = useState<SavedUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") return;

    const remember = localStorage.getItem("remember_me");
    const email = localStorage.getItem("saved_email");
    const userInfoString = localStorage.getItem("userInfo"); //  READ the JSON string from userInfo

    // 1. Check for necessary data
    // If we don't have the remember flag, email, OR the profile data, redirect to full login.
    if (remember !== "1" || !email || !userInfoString) {
      router.replace("/login/email");
      return;
    }

    // 2. Parse the saved JSON profile info
    try {
      const profileInfo = JSON.parse(userInfoString);

      // 3. Extract the required properties from the parsed object
      // Use full_name and profile_pic directly from the parsed object
      const name = profileInfo.full_name || email;
      const image = profileInfo.profile_pic || "/images/fallback-avatar.png";

      // 4. Set the state with the correctly pulled data
      setUser({ email, name, image });
    } catch (e) {
      console.error("Error parsing userInfo from localStorage:", e);
      // Fallback: If parsing fails (e.g., corrupted data), redirect to full login.
      router.replace("/login/email");
    }
  }, [router]); // Removed unnecessary dependencies

  const handleContinue = () => {
    router.push("/login/quick");
  };

  if (!mounted || !user) {
    return (
      <main className="min-h-svh flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Loading…</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col h-screen max:md:min-h-dvh bg-background max-h-[897.222px] max-md:max-h-dvh">
      {/* HEADER */}
      <header className="px-4 pt-6 pb-2">
        <h1 className="title text-heading text-center">LOGO</h1>
      </header>

      {/* CONTENT (non-scrollable; auto-centers like LoginPage) */}
      <section className="flex-1 flex items-center justify-center w-full max-h-[685.22px] max-md:max-h-[calc(100dvh-212px)]">
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ">
            <Image
              src={user.image} // Now correctly using the profile_pic URL
              alt={user.name || user.email}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-[22px] md:text-[24px] font-bold text-heading">
              Welcome Back! 👋
            </p>
            <p className="text-[22px] md:text-[24px] font-bold text-heading">
              {user.name || user.email}{" "}
              {/*  Now correctly using the full_name */}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER  */}
      <div className="pb-10">
        <footer className="w-full px-4 space-y-4">
          <button
            onClick={handleContinue}
            className="btn btn-signup tracking-wide w-full"
          >
            Continue
          </button>

          <Link
            href="/login"
            className="block text-center text-heading text-sm font-medium"
          >
            Not you? Log in with another email
          </Link>
        </footer>
      </div>
    </div>
  );
}
