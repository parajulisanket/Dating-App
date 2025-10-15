import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Manrope } from "next/font/google";
import "./global.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased  no-scrollbar`}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
          storageKey="app-theme"
          disableTransitionOnChange={false}
        >
          <div className="min-h-dvh w-full flex justify-center ">
            <div
              className="
              w-full max-w-[425px] 
              bg-background text-neutral-1000 min-h-dvh
              relative overflow-hidden  
            "
            >
              <div className="min-h-dvh overflow-y-auto ">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
