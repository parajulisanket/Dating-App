"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

import ThreadHeader from "@/components/message/thread/ThreadHeader";
import MessageBubble, {
  Message,
} from "@/components/message/thread/MessageBubble";
import DayDivider from "@/components/message/thread/DayDivider";
import TypingBubble from "@/components/message/thread/TypingBubble";
import Composer from "@/components/message/thread/Composer";
import ThreadActionSheet from "@/components/message/ThreadActionSheet";
import BlockUserDialog from "@/components/UserProfile/BlockUserDialog";

export default function ThreadView({ slug }: { slug: string }) {
  const router = useRouter();

  const userMetaById: Record<
    string,
    { name: string; avatar?: string; online?: boolean }
  > = {
    "1": { name: "Smarika", avatar: "/images/Shristima.jpg", online: true },
    "2": { name: "Ariana", avatar: "/images/Shristima.jpg", online: false },
  };

  const meta = userMetaById[slug] ?? {
    name: decodeURIComponent(slug),
    avatar: "/images/Shristima.jpg",
    online: false,
  };

  // Reference to the container for portal mounting
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [viewMenu, setViewMenu] = React.useState<boolean>(false);
  const [readReceipts, setReadReceipts] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [isBlockActive, setIsBlockActive] = React.useState(false);

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      from: "them",
      text: "It is a long established fact that a",
      time: "12:25",
    },
    {
      id: "2",
      from: "them",
      text: "It is a long established fact that a",
      time: "12:25",
    },
    {
      id: "3",
      from: "me",
      text: "It is a long established fact that a",
      time: "12:25 am",
      status: "read",
    },
    { id: "4", from: "them", text: "It is a long", time: "12:25" },
    {
      id: "5",
      from: "me",
      text: "It is a",
      time: "12:25 am",
      status: "delivered",
    },
    {
      id: "6",
      from: "me",
      emojis: "😅😅😅😅😅",
      time: "12:25 am",
      status: "read",
    },
    { id: "d1", type: "divider", label: "Yesterday 20 :15" },
    { id: "7", from: "them", text: "It is a long", time: "12:25" },
    { id: "8", type: "typing" },
  ]);

  // auto-scroll to bottom when messages change
  const endRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [
      ...m,
      {
        id: String(Date.now()),
        from: "me",
        text: trimmed,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "sent",
      },
    ]);
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-rows-[auto,1fr,auto] no-scrollbar relative"
    >
      <div className="sticky top-0 z-0">
        <ThreadHeader
          slug={slug}
          name={meta.name}
          avatar={meta.avatar}
          online={meta.online}
          portalContainer={containerRef.current}
          setViewMenu={setViewMenu}
        />
      </div>

      <ScrollArea className="px-3  py-4 no-scrollbar h-[calc(100svh-116px)] md:max-h-[730.22px]">
        {messages.map((msg) => {
          if (msg.type === "divider") {
            return <DayDivider key={msg.id} label={msg.label!} />;
          }
          if (msg.type === "typing") {
            return <TypingBubble key={msg.id} />;
          }
          return <MessageBubble key={msg.id} msg={msg} />;
        })}
        <div ref={endRef} />
      </ScrollArea>

      <Composer onSend={handleSend} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* Bottom sheet */}
      <div className="sticky bottom-4 rounded-b-4xl ">
        <ThreadActionSheet
          open={viewMenu}
          onOpenChange={setViewMenu}
          portalRoot={containerRef.current}
          readReceipts={readReceipts}
          notifications={notifications}
          onToggleReadReceipts={setReadReceipts}
          onToggleNotifications={setNotifications}
          onViewProfile={() => {
            setViewMenu(false);
            router.push(`/profile/${encodeURIComponent(slug)}`);
          }}
          onSearch={() => {
            setViewMenu(false);
            router.push(`/messages/${encodeURIComponent(slug)}?search=1`);
          }}
          onImages={() => {
            setViewMenu(false);
            router.push(`/messages/${encodeURIComponent(slug)}?tab=media`);
          }}
          onDelete={() => {
            setViewMenu(false);
            console.log("Delete conversations");
          }}
          onReport={() => {
            router.push("/user-profile/7/report");
            setViewMenu(false);
            console.log("Report user");
          }}
          onBlock={() => {
            setViewMenu(false);
            setIsBlockActive(true);
            console.log("Block user");
          }}
        />
        <BlockUserDialog
          isBlockActive={isBlockActive}
          onClose={() => setIsBlockActive(false)}
        />
      </div>
    </div>
  );
}
