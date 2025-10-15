'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react"
import Image from 'next/image'
import icons from '@/assets/icons/icons'

export const Notification = () => {
    const [badges, setBadges] = useState(false)
    const [offers, setOffers] = useState(false);
    const toggleFloatingBadges = () => {
        setBadges(prev => !prev)
    }
    const toggleOffers = () => {
        setOffers(prev => !prev)
    }
    const handleSave = () => {
        console.log('handleSave')
    }

    return (
        <main className='min-h-screen'>
            {/* Header */}
            <div className="border-b border-neutral-200">
                <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1">
                    <Link href='/settings' aria-label="Back" className="rounded-full">
                        <ChevronLeft size={24} strokeWidth={1.5} />
                    </Link>
                    <h1 className="text-[24px] font-bold leading-[36px]">Notifications</h1>
                </div>
            </div>

            <div className="p-4 space-y-2">
                <div className="bg-neutral-1000/5 rounded-[16px] h-[52px] px-4 flex items-center justify-between">
                    <span className="font-medium text-[16px]">Allow floating badges</span>

                    <div
                        onClick={toggleFloatingBadges}
                        className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-primary-500  transition-all duration-300
              ${badges ? "bg-primary-500" : "bg-primary-500/10"}
            `}
                    >
                        <div
                            className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${badges ? "translate-x-[20px] bg-white" : "translate-x-0 bg-primary-500"}
              `}
                        ></div>
                    </div>
                </div>


                <div className="bg-neutral-1000/5 rounded-[16px] h-[52px] px-4 flex items-center justify-between">
                    <span className="font-medium text-[16px]">Offers and plans notifications</span>

                    <div
                        onClick={toggleOffers}
                        className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-primary-500  transition-all duration-300
              ${offers ? "bg-primary-500" : "bg-primary-500/10"}
            `}
                    >
                        <div
                            className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${offers ? "translate-x-[20px] bg-white" : "translate-x-0 bg-primary-500"}
              `}
                        ></div>
                    </div>
                </div>


            </div>

            <div
                className="fixed bottom-0 left-0 right-0  max-w-[425px] mx-auto pb-10 "
            >
                <div className="max-w-[425px] mx-auto px-4 py-3 ">
                    <button
                        onClick={handleSave}
                        className="w-full bg-primary-500 h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                            hover:bg-primary-700 active:bg-[#D01080] transition-colors
                            disabled:bg-gray-300 disabled:cursor-not-allowed"

                    >
                        Save
                    </button>
                </div>
            </div>
        </main>
    )
}
