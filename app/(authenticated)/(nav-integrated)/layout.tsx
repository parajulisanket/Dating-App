
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


