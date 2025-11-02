import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
import "./global.css";
// import PageTransition from "@/components/PageTransition";

const dmSans = DM_Sans({
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
      <body className={`${dmSans.variable} antialiased  no-scrollbar`}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
          storageKey="app-theme"
          disableTransitionOnChange={false}
        >
          <div className="min-h-dvh w-full flex items-center justify-center  ">
            <div
              className="
              w-full max-w-[425px] 
              bg-background text-neutral-1000 md:max-h-[897.222px]  md:rounded-4xl
              relative overflow-hidden  
            "
            >
              <div className="min-h-dvh overflow-y-auto ">
                {/* <PageTransition> */}
                {children}
                {/* </PageTransition> */}
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
