"use client";

import FooterBar from "@/components/layout/FooterBar";
import SearchTop from "@/components/layout/SearchTop";
import ActiveMessage from "@/components/message/ActiveMessage";
import ChatList from "@/components/message/ChatList";
import MessageFilter from "@/components/message/MessageFilter";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <SearchTop />
      <main className="flex-1">
        <ActiveMessage />
        <MessageFilter />

        <ChatList onOpenChat={(slug) => router.push(`/messages/${slug}`)} />
      </main>
      <div className="fixed bottom-0 max-w-[425px] w-dvw">
        <FooterBar />
      </div>
    </div>
  );
}
