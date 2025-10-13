"use client";

import FooterNav from "@/components/layout/FooterBar";
import SearchTop from "@/components/layout/SearchTop";
import ActiveMessage from "@/components/message/ActiveMessage";
import ChatList from "@/components/message/ChatList";
import MessageFilter from "@/components/message/MessageFIlter";
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
      <FooterNav />
    </div>
  );
}
