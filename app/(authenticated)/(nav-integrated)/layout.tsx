"use client";
import FooterBar from "@/components/layout/FooterBar";
import { usePathname } from "next/navigation";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter =
    pathname === "/home" ||
    pathname === "/match" ||
    pathname === "/profile" ||
    pathname === "/messages";
  return (
    <>
      {children}
      {showFooter && <FooterBar />}
    </>
  );
}
