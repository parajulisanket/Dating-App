"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
}

export const Header = ({ setIsMenuOpen, name }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 rounded-t-4xl px-6 h-[48px] bg-background z-40 flex items-center justify-between border-b border-b-borderButton">
      <div className="flex items-center gap-3 text-heading">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="rounded-full p-0 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>

        <h1 className="text-[16px] leading-[20px] font-bold truncate max-w-[180px]">
          {name}
        </h1>
      </div>

      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        className="hover:opacity-70 transition-opacity"
      >
        <Image
          src="/icons/threedot.svg"
          alt="Menu"
          width={24}
          height={24}
          className="dark:filter dark:invert dark:brightness-0"
        />
      </button>
    </header>
  );
};
