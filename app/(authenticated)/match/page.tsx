import FooterBar from "@/components/layout/FooterBar";
import MatchTopBar from "@/components/layout/MatchTopBar";
import MatchListings from "@/components/match/MatchListings";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MatchTopBar />

      <main className="flex-1">
        <MatchListings />
      </main>
      <FooterBar />
    </div>
  );
}
