"use client";

import * as React from "react";
import Image from "next/image";

export type ChatItem = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: Date | string;
  unreadCount?: number;
  capUnreadAt?: number;
  isOnline?: boolean;
  hasStoryRing?: boolean;
};

type ChatListProps = {
  items?: ChatItem[];
  loading?: boolean;
  onOpenChat?: (id: string) => void;
};

function formatWhen(when: Date | string): string {
  const d = when instanceof Date ? when : new Date(when);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);

  if (mins < 60) return `${Math.max(mins, 1)} mins ago`;
  if (hrs < 24) return hrs === 1 ? "1 hr ago" : `${hrs} hrs ago`;

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) {
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const am = h < 12;
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${am ? "am" : "pm"}`;
  }

  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

function UnreadBadge({ count, cap = 5 }: { count?: number; cap?: number }) {
  if (!count || count <= 0) return null;
  const label = count > cap ? `${cap}+` : `${count}`;
  return (
    <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EB3FA5] px-2 text-xs font-medium leading-none text-white">
      {label}
    </span>
  );
}

function Avatar({
  src,
  alt,
  online,
  hasRing,
}: {
  src: string;
  alt: string;
  online?: boolean;
  hasRing?: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={[
          "h-14 w-14 rounded-full p-[2px]",
          hasRing ? "ring-2 ring-[#F92FA2]" : "",
        ].join(" ")}
      >
        <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
          <Image
            src={src}
            alt={alt}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      {online && (
        <span className="absolute bottom-0.5 right-1 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]" />
      )}
    </div>
  );
}

function ChatRow({
  item,
  onPress,
}: {
  item: ChatItem;
  onPress?: (id: string) => void;
}) {
  const isUnread = (item.unreadCount ?? 0) > 0;

  return (
    <button
      onClick={() => onPress?.(item.id)}
      className="group w-full select-none  px-4 py-3 text-left  focus:outline-none"
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={item.avatar}
          alt={item.name}
          online={item.isOnline}
          hasRing={item.hasStoryRing}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline">
            <span className="truncate text-[18px] font-semibold text-neutral-1000">
              {item.name}
            </span>

            <span
              className={`ml-auto text-[12px] font-semibold ${
                isUnread ? "text-[#F92FA2]" : "text-[#A4A4A4]"
              }`}
            >
              {formatWhen(item.lastMessageAt)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center">
            <p className="truncate text-[14px] font-semibold text-[#A4A4A4]">
              {item.lastMessage}
            </p>
            <UnreadBadge count={item.unreadCount} cap={item.capUnreadAt ?? 5} />
          </div>
        </div>
      </div>
    </button>
  );
}

function ChatRowSkeleton() {
  return (
    <div className="w-full border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-3.5">
        <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-3.5 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function useChatListHeight<T extends HTMLElement>(
  ref: React.RefObject<T | null>
) {
  React.useEffect(() => {
    const footer =
      (document.querySelector<HTMLElement>(
        "footer, #app-footer, .app-footer, [data-role='footer'], [role='contentinfo']"
      ) as HTMLElement | null) || null;

    const apply = () => {
      const el = ref.current as T | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const topPx = rect.top;
      el.style.setProperty("--chatTop", `${Math.max(0, Math.round(topPx))}px`);
      el.style.setProperty("--ftr", `${footer?.offsetHeight ?? 0}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    if (ref.current) ro.observe(ref.current as Element);
    if (footer) ro.observe(footer);
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", apply, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", apply);
    };
  }, [ref]);
}

function ChatList({ items, loading = false, onOpenChat }: ChatListProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  useChatListHeight(hostRef);

  const data: ChatItem[] =
    items ??
    Array.from({ length: 14 }).map((_, i) => ({
      id: String(i + 1),
      name: "Smarika",
      avatar: "/images/Shristima.jpg",
      lastMessage: "Twinkle, twinkle little star!",
      lastMessageAt:
        i < 1
          ? new Date(Date.now() - 15 * 60 * 1000)
          : i < 2
          ? new Date(Date.now() - 60 * 60 * 1000)
          : i === 2
          ? new Date()
          : "2025-12-04",
      unreadCount: i === 2 ? 2 : i === 4 ? 3 : 0,
      capUnreadAt: 5,
      hasStoryRing: i === 2,
      isOnline: i === 0 || i === 2 || i === 6,
    }));

  return (
    <div
      ref={hostRef}
      className="chatlist-host relative"
      style={{
        height:
          "calc(100svh - var(--ftr,0px) - var(--chatTop,0px) - env(safe-area-inset-bottom,0px))",
      }}
    >
      <div className="h-full overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] no-scrollbar">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <ChatRowSkeleton key={i} />
            ))
          : data.map((it) => (
              <ChatRow key={it.id} item={it} onPress={onOpenChat} />
            ))}
      </div>

      {/* prefer dvh; hide scrollbar cross-browser */}
      <style jsx>{`
        @supports (height: 100dvh) {
          .chatlist-host {
            height: calc(
              100dvh - var(--ftr, 0px) - var(--chatTop, 0px) -
                env(safe-area-inset-bottom, 0px)
            );
          }
        }

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
    </div>
  );
}
export default ChatList;
