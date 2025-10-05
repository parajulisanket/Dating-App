import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="w-full flex justify-center">
      <main className="w-full max-w-[390px] min-h-screen flex flex-col px-5 pt-6 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back"
            className="text-[#f72fa2] p-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </Link>
          <h1 className="title">Sign Up</h1>
          <span className="w-7" />
        </div>

        {/* Big circle / placeholder */}
        <div className="flex-grow flex items-center justify-center">
          <div className="h-[280px] w-[280px] rounded-full bg-[#E2B3F7]" />
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link href="/signup/email" className="btn btn-signup tracking-wide">
            Continue with email
          </Link>
          <Link href="/signup/phone" className="btn btn-login tracking-wide">
            Use phone number
          </Link>
        </div>
      </main>
    </div>
  );
}
