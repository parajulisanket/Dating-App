import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PhoneViewport from "@/components/layout/PhoneViewport";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <PhoneViewport maxWidth={425} className="grid grid-rows-[auto_1fr_auto]">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Back"
          className="text-heading p-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
        <h1 className="title">Log In</h1>
        {/* spacer to balance the back button */}
        <span className="w-8" />
      </header>

      {/* CONTENT (non-scrollable; auto-centers) */}
      <section className="flex items-center justify-center overflow-hidden">
        {/* Circle scales by device height; never causes scroll */}
        <div
          className="rounded-full bg-[#E2B3F7]"
          style={{
            width: "clamp(180px, 40svh, 320px)",
            height: "clamp(180px, 40svh, 320px)",
          }}
        />
      </section>

      {/* FOOTER (pinned, tight spacing) */}
      <footer className="space-y-2">
        <Link href="/login/email" className="btn btn-signup tracking-wide">
          Log In
        </Link>
        <Link href="/signup" className="btn btn-login tracking-wide">
          Create an Account
        </Link>
      </footer>
    </PhoneViewport>
  );
}
