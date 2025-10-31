import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PhoneViewport from "@/components/layout/PhoneViewport";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen max:md:min-h-dvh bg-background max-h-[897.222px] max-md:max-h-dvh ">
      {/* HEADER */}
      <header className="flex items-center justify-between w-full px-4 pt-6 pb-4">
        <Link
          href="/"
          aria-label="Back"
          className="text-heading p-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
        <h1 className="title text-lg font-bold text-heading">Log In</h1>
        {/* spacer to balance the back button */}
        <span className="w-8" />
      </header>

      {/* CONTENT (non-scrollable; auto-centers) */}
      <section className="flex-1 flex items-center justify-center w-full max-h-[685.22px] max-md:max-h-[calc(100dvh-212px)]">
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
      <div className="pb-10">
        <footer className="w-full px-4  space-y-2">
          <Link href="/login/email" className="btn btn-signup tracking-wide">
            Log In
          </Link>
          <Link href="/signup" className="btn btn-login tracking-wide">
            Create an Account
          </Link>
        </footer>
      </div>
    </div>
  );
}
