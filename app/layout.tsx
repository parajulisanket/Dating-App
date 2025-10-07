import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "App",
  description: "Mobile-first shell",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased  `}>
        {/* Desktop centering frame */}
        <div className="min-h-dvh w-full flex justify-center">
          {/* Phone-sized canvas */}
          <div
            className="
              w-full max-w-[393px]
              bg-white min-h-dvh
              relative overflow-hidden  
            "
          >
            {/* Inner scroller so the “phone” scrolls, not the page */}
            <div className="min-h-dvh overflow-y-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}

// shadow-none sm:shadow-xl
// sm:rounded-[32px] sm:my-5 sm:overflow-hidden
// border-2 border-transparent sm:border-black
