import TopBar from "@/components/layout/TopBar";
import FooterNav from "@/components/layout/FooterBar";
import Hero from "@/components/discover/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1">
        {" "}
        <Hero />
      </main>


    </div>
  );
}
