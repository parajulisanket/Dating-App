import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Log In",
};

export default function SignUpPage() {
  return (
    <div className="w-full  h-screen flex justify-center">
      <main className="w-full  flex flex-col p-4  pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back"
            className="text-[#f72fa2] p-2 -ml-2 rounded-full"
          >
            <ChevronLeft size={35} strokeWidth={2} />
          </Link>
          <h1 className="title">Log In</h1>
          <span className="w-7" />
        </div>

        {/* Big circle / placeholder */}
        <div className="flex-grow flex items-center justify-center">
          <div className="h-[280px] w-[280px] rounded-full bg-[#E2B3F7]" />
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link href="/login/email" className="btn btn-signup">
            Log In
          </Link>
          <Link href="/signup" className="btn btn-login">
            Create an Account
          </Link>
        </div>
      </main>
    </div>
  );
}
