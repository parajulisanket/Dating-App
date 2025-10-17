import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PhoneViewport from "@/components/layout/PhoneViewport"; // <-- use the component

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <PhoneViewport maxWidth={425} className="grid grid-rows-[auto_1fr_auto] bg-background">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Back"
          className="text-[#f72fa2] p-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
        <h1 className="title">Sign Up</h1>
        <span className="w-8" />
      </header>

      {/* CONTENT (non-scrollable, auto-centers) */}
      <section className="flex items-center justify-center overflow-hidden">
        {/* Scales per device height */}
        <div
          className="rounded-full bg-[#E2B3F7]"
          style={{
            width: "clamp(180px, 42svh, 320px)",
            height: "clamp(180px, 42svh, 320px)",
          }}
        />
      </section>

      {/* FOOTER (pinned) */}
      <footer className="space-y-2">
        <Link href="/signup/email" className="btn btn-signup tracking-wide">
          Continue with email
        </Link>
        <Link href="/signup/phone" className="btn btn-login tracking-wide">
          Use phone number
        </Link>
      </footer>
    </PhoneViewport>
  );
}
