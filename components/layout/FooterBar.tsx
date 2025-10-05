"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type FooterBarProps = {
  likeCount?: number;
  unreadCount?: number;
  className?: string;
};

const ICON_SIZE = 24;

function TabIcon({
  active,
  activeSrc,
  inactiveSrc,
  alt,
  size = ICON_SIZE,
  className,
}: {
  active: boolean;
  activeSrc: string;
  inactiveSrc: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={active ? activeSrc : inactiveSrc}
      alt={alt}
      width={size}
      height={size}
      className={cn("tab-icon block shrink-0", className)}
      draggable={false}
    />
  );
}

export default function FooterBar({
  likeCount = 0,
  unreadCount = 0,
  className,
}: FooterBarProps) {
  const pathname = usePathname();

  const isDiscover =
    pathname === "/" || pathname === "/home" || pathname?.startsWith("/home");
  const isLikes =
    pathname?.startsWith("/match") || pathname?.startsWith("/likes");
  const isChat = pathname?.startsWith("/messages");
  const isProfile = pathname?.startsWith("/profile");

  return (
    <footer className={cn("footer-shell footer-safe", className)}>
      <div className="mx-auto w-full max-w-[480px] ">
        <ul className="grid grid-cols-4 items-center">
          {/* home */}
          <li className="flex justify-center">
            {isDiscover ? (
              <Link
                href="/home"
                aria-current="page"
                className={cn(
                  "pill pill--active",

                  "max-w-[108px] w-full justify-center whitespace-nowrap"
                )}
              >
                <TabIcon
                  active
                  activeSrc="/icons/discover.svg"
                  inactiveSrc="/icons/discover-inactive.svg"
                  alt="Discover"
                />
                <span className="text-xs tracking-wide font-bold">
                  Discover
                </span>
              </Link>
            ) : (
              <Link
                href="/home"
                aria-label="Discover"
                className="grid place-items-center"
              >
                <TabIcon
                  active={false}
                  activeSrc="/icons/discover.svg"
                  inactiveSrc="/icons/discover-inactive.svg"
                  alt="Discover"
                />
              </Link>
            )}
          </li>

          {/* match */}
          <li className="flex justify-center">
            {isLikes ? (
              <Link
                href="/match"
                aria-current="page"
                className={cn(
                  "pill pill--active",
                  "max-w-[108px] w-full justify-center whitespace-nowrap"
                )}
              >
                <TabIcon
                  active
                  activeSrc="/icons/match.svg"
                  inactiveSrc="/icons/match-inactive.svg"
                  alt="Match"
                />
                <span className="text-xs tracking-wide font-bold">Match</span>
                {likeCount > 0 && (
                  <span className="badge ml-2 static translate-x-0 translate-y-0">
                    {likeCount > 99 ? "99+" : likeCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                href="/match"
                aria-label="Match"
                className="relative grid place-items-center"
              >
                <TabIcon
                  active={false}
                  activeSrc="/icons/match.svg"
                  inactiveSrc="/icons/match-inactive.svg"
                  alt="Match"
                />
                {likeCount > 0 && (
                  <span className="badge">
                    {likeCount > 99 ? "99+" : likeCount}
                  </span>
                )}
              </Link>
            )}
          </li>

          {/* chat */}
          <li className="flex justify-center">
            {isChat ? (
              <Link
                href="/messages"
                aria-current="page"
                className={cn(
                  "pill pill--active",
                  "max-w-[108px] w-full justify-center whitespace-nowrap"
                )}
              >
                <TabIcon
                  active
                  activeSrc="/icons/chat.svg"
                  inactiveSrc="/icons/chat-inactive.svg"
                  alt="Chat"
                />
                <span className="text-xs tracking-wide font-bold">Message</span>
                {unreadCount > 0 && (
                  <span className="badge ml-2 static translate-x-0 translate-y-0">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                href="/messages"
                aria-label="Chat"
                className="relative grid place-items-center"
              >
                <TabIcon
                  active={false}
                  activeSrc="/icons/chat.svg"
                  inactiveSrc="/icons/chat-inactive.svg"
                  alt="Chat"
                />
                {unreadCount > 0 && (
                  <span className="badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
          </li>

          {/* profile */}
          <li className="flex justify-center">
            {isProfile ? (
              <Link
                href="/profile"
                aria-current="page"
                className={cn(
                  "pill pill--active",
                  "max-w-[108px] w-full justify-center whitespace-nowrap"
                )}
              >
                <TabIcon
                  active
                  activeSrc="/icons/profile.svg"
                  inactiveSrc="/icons/profile-inactive.svg"
                  alt="Profile"
                />
                <span className="text-xs tracking-wide font-bold">Profile</span>
              </Link>
            ) : (
              <Link
                href="/profile"
                aria-label="Profile"
                className="grid place-items-center"
              >
                <TabIcon
                  active={false}
                  activeSrc="/icons/profile.svg"
                  inactiveSrc="/icons/profile-inactive.svg"
                  alt="Profile"
                />
              </Link>
            )}
          </li>
        </ul>
      </div>
    </footer>
  );
}
