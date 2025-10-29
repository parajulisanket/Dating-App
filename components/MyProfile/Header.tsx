"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
// import { getSvgColor } from '@/utils/theme';
// import { useEffect, useState } from "react";
export const Header = ({ backHref = "/home" }) => {
  const { theme } = useTheme();
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true)
  // }, []);
  return (
    <header className="sticky top-0 px-6 h-[48px] bg-background z-40 flex items-center justify-between  border-b border-b-borderButton ">
      {/* Left: Back button + title */}
      <div className="flex items-center gap-3 text-heading">
        {/* <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft className="" size={24} strokeWidth={1.5} />
        </Link> */}
        <h1 className="text-[16px] leading-[20px] font-bold">Anup</h1>
      </div>

      {/* Right: Settings Icon */}

      <Link href="/settings">
        {
          theme === 'light' ?
            <Image
              src="/settings.svg"
              alt="Settings"
              width={24}
              height={24}
            />
            :
            <Image
              src="/settingsDark.svg"
              alt="Settings"
              width={24}
              height={24}
            />

        }

      </Link>


    </header>
  );
};
