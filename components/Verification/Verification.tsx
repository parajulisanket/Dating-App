'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";
import Image from 'next/image';
import icons from '@/assets/icons/icons';
import { useTheme } from 'next-themes';
export const Verification = () => {
    const { theme } = useTheme();
    return (
        <>
            <main className='min-h-screen flex flex-col justify-between'>
                <div className="">
                    <div className="bg-background px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1 ">

                        <Link href='/settings' aria-label="Back" className="rounded-full">
                            <ChevronLeft size={24} className={theme === "light" ? "" : "filter invert brightness-0"} strokeWidth={1.5} />
                        </Link>

                        <h1 className="text-[24px] font-bold leading-[36px]"></h1>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src={icons.verification}
                        alt='vefication'
                        height={400}
                        width={400}
                        className="size-[173px]"
                    />
                    <div

                        className="h-[8.98px] w-[272.84px] my-4 bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(4,100,226,0.5)_0%,_rgba(255,255,255,0)_100%)] "
                    />
                    <div className="flex flex-col items-center text-[28px] leading-[42px] font-bold text-primary-500">
                        <p>Let's get you</p>
                        <p>verified!</p>
                    </div>

                </div>
                <div className=" pb-8">
                    <div className="max-w-[425px] mx-auto px-4 py-3 ">
                        <Link href='/verification/document'>
                            <button
                                className="w-full bg-primary-500 h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                            hover:bg-primary-700 active:bg-[#D01080] transition-colors
                            disabled:bg-gray-300 disabled:cursor-not-allowed"

                            >
                                Continue
                            </button>
                        </Link>

                    </div>
                </div>


            </main>
        </>
    )
}
