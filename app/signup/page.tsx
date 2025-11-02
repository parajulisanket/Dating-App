import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-screen max:md:min-h-dvh bg-background max-h-[897.222px] max-md:max-h-dvh ">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <Link
          href="/"
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
        <h1 className="title text-heading">Sign Up</h1>
        <span className="w-8" />
      </header>

      {/* MAIN SECTION — grows to fill space */}
      <section className="flex-1 flex items-center justify-center w-full max-h-[685.22px] max-md:max-h-[calc(100dvh-212px)]">
        <div
          className="rounded-full bg-[#E2B3F7]"
          style={{
            width: "clamp(180px, 42svh, 320px)",
            height: "clamp(180px, 40svh, 320px)",
          }}
        />
      </section>

      {/* FOOTER */}
      <div className="pb-10">
        <footer className="w-full px-4  space-y-2">
          <Link href="/signup/email" className="btn btn-signup w-full">
            Continue with email
          </Link>
          <Link href="/signup/phone" className="btn btn-login w-full">
            Use phone number
          </Link>
        </footer>
      </div>
    </div>
  );
}
