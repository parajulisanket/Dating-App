import MatchTopBar from "@/components/layout/MatchTopBar";
import MatchListings from "@/components/match/MatchListings";

export default function HomePage() {
  return (
    <div className="h-screen  relative flex flex-col no-scrollbar">
      <MatchTopBar />

      <main className="flex-1  max-h-[calc(100vh-48px)] md:max-h-[843.54px] overflow-hidden ">
        <MatchListings />
      </main>
    </div>
  );
}
