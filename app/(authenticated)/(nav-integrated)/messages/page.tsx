import FooterNav from "@/components/layout/FooterBar";
import SearchTop from "@/components/layout/SearchTop";
import ActiveMessage from "@/components/message/ActiveMessage";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SearchTop />
      <ActiveMessage />
      <main className="flex-1"></main>


    </div>
  );
}
