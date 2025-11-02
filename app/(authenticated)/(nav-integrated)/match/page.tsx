import MatchTopBar from "@/components/layout/MatchTopBar";
import MatchListings from "@/components/match/MatchListings";

export default function HomePage() {
  return (
    <div className="h-screen max-md:h-100dvh  relative flex flex-col">
      <MatchTopBar />

      <main className="flex-1">
        <MatchListings />
      </main>
    </div>
  );
}
