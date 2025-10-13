import FooterBar from "@/components/layout/FooterBar";

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-dvh max-w-[393px] mx-auto bg-white overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto ">{children}</div>
      {/* or use a sticky/fixed wrapper */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
        {/* <FooterBar /> */}
      </div>
    </div>
  );
}

// shadow-none sm:shadow-xl
// sm:rounded-[32px] sm:my-5 sm:overflow-hidden
// border-2 border-transparent sm:border-black
