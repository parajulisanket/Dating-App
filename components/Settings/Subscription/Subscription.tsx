'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";
import Image from 'next/image';
import icons from '@/assets/icons/icons';
import { useTheme } from 'next-themes';
export const Subscripition = () => {
    const { theme } = useTheme()
    return (
        <>
            <main className='max-h-screen'>
                <div className="border-b border-borderButton">
                    <div className=" px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1 ">

                        <Link href='/settings' aria-label="Back" className="rounded-full">
                            <ChevronLeft className="" size={24} strokeWidth={1.5} />
                        </Link>

                        <h1 className="text-[24px] font-bold leading-[36px]">Subscripition</h1>
                    </div>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <h2 className='text-[24px] leading-[36px] font-bold'>Upgrade Your Experience!</h2>
                            <p className={`text-[14px]  leading-[21px] font-medium ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-400'} `}>Find your match faster and stand out from the crowd! Choose the plan that fits your vibe and unlock exclusive features made to boost your dating journey.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="rounded-2xl flex flex-col justify-center items-center more-swipes p-4 text-white">
                                <Image
                                    src={icons.moreSwipes}
                                    alt='moreSwipes'
                                    height={96}
                                    width={96}
                                    className='h-12 w-12 '
                                />
                                <h2 className='text-[16px] font-bold leading-5'>More swipes</h2>
                                <p className='font-medium text-[16px] '>200 swipes  for Rs.200</p>

                            </div>
                            <div className="rounded-2xl flex flex-col justify-center items-center view-profile p-4 text-white">
                                <Image
                                    src={icons.viewProfile}
                                    alt='viewProfile'
                                    height={96}
                                    width={96}
                                    className='h-12 w-12 '
                                />
                                <h2 className='text-[16px] font-bold leading-5'>View Profile</h2>
                                <p className='font-medium text-[16px] '>View unmatched profiles for Rs. 200.</p>

                            </div>
                            <div className="rounded-2xl  flex flex-col justify-center items-center boost-profile p-4 text-white">
                                <Image
                                    src={icons.boostProfile}
                                    alt='boostProfile'
                                    height={96}
                                    width={96}
                                    className='h-12 w-12 '
                                />
                                <h2 className='text-[16px] font-bold leading-5'>Boost Profile</h2>
                                <p className='font-medium text-[16px] '>15 days boost for Rs.700.</p>

                            </div>
                        </div>
                    </div>
                </div>


            </main>
        </>
    )
}
