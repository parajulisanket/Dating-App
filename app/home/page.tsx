import TopBar from "@/components/layout/TopBar";
import FooterNav from "@/components/layout/FooterBar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1"></main>

      <FooterNav />
    </div>
  );
}
