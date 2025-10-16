"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils"; // adjust this import path based on your project structure
import { useState } from "react";
interface HeaderProps {
    onMenuClick: () => void;
}
export const Header = ({ onMenuClick }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <header
                className="sticky top-0 px-6 h-[48px] bg-background z-40 flex items-center justify-between  border-b border-b-borderButton " >
                {/* Left: Back button + title */}
                <div className="flex items-center gap-3 text-[#F92FA2]">
                    <Link href='/home' aria-label="Back" className="rounded-full">
                        <ChevronLeft className="" size={24} strokeWidth={1.5} />
                    </Link>
                    <h1 className="text-[16px] leading-[20px] font-bold">Anup</h1>
                </div>

                <button onClick={onMenuClick}>
                    <Image
                        src="/icons/threedot.svg"
                        alt="Menu"
                        width={24}
                        height={24}
                        className="cursor-pointer "
                    />
                </button>






            </header>

        </>

    );
};