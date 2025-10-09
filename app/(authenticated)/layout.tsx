
import FooterBar from "@/components/layout/FooterBar";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <div className="fixed bottom-0 max-w-[393px]">
                <FooterBar />
            </div>
        </>
    );
}

// shadow-none sm:shadow-xl
// sm:rounded-[32px] sm:my-5 sm:overflow-hidden
// border-2 border-transparent sm:border-black
