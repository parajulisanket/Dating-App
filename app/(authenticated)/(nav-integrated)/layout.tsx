import FooterBar from "@/components/layout/FooterBar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      <FooterBar />
    </>
  );
}
