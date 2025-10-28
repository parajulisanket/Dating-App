'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";
import { useState } from 'react';
import Image from 'next/image';
import icons from '@/assets/icons/icons';

export const DeleteAccountReasonComponent = () => {
    const [selectedReason, setSelectedReason] = useState<string>('someone');
    const reasons = [
        { value: 'someone', label: 'I found someone special ❤️' },
        { value: 'dating', label: 'I’m taking a break from dating' },
        { value: 'experience', label: 'I didn’t have a good experience ' },
        { value: 'privacy', label: 'I’m concerned about privacy' },
        { value: 'matches', label: 'I’m not getting enough matches' },
        { value: 'other', label: 'Other' },
    ]
    const handleSave = () => {

    }


    return (
        <>
            <main className='min-h-screen'>
                <div className="border-b border-borderButton">
                    <div className="px-4 py-4 flex items-center gap-3 text-heading ml-1">
                        <Link href='/settings/account' aria-label="Back" className="rounded-full">
                            <ChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h1 className="text-[24px] font-bold leading-[36px]">Delete Account</h1>
                    </div>
                </div>

                <div className="p-4">
                    <h2 className='font-bold text-[24px] leading-[36px] '>Help us improve</h2>
                    <p className='text-[14px] text-justified leading-[21px] text-neutral-1000 font-medium'>We totally get it — sometimes things just don’t click. But we’d love to know what made you decide to leave! Your feedback helps us make the app better for everyone (and maybe even win you back someday 😉).</p>

                </div>

                <div className="p-4">
                    {reasons.map((reason) => (
                        <button key={reason.value}
                            onClick={() => setSelectedReason(reason.value)}
                            className="flex items-center gap-2 h-[52px]">


                            <Image
                                src={selectedReason === reason.value ? icons.selected : icons.nonSelected}
                                alt="radio"
                                height={32}
                                width={32}
                                className='h-4 w-4'
                            />
                            <span className="text-[16px] font-medium leading-[24px]">
                                {reason.label}
                            </span>
                        </button>
                    ))}
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
        </>
    )
}
