'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const DeleteAccountComponent = () => {
    const [showPwd, setShowPwd] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    const handleProceed = () => {
        router.push('delete-account/reason')
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
                    <p className='text-[14px] text-justified leading-[21px] text-neutral-1000 font-medium'>Deleting your account will permanently remove your profile, matches, messages, and all related data. This action can’t be undone.</p>

                </div>

                <div className="p-4">
                    <div className="relative">
                        <input
                            ref={currentPasswordRef}
                            type={showPwd ? "text" : "password"}
                            placeholder="Current password"
                            className="input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                setShowPwd(!showPwd);
                                currentPasswordRef.current?.focus();
                            }}
                            type="button"
                            className="absolute inset-y-0  right-4 flex items-center text-neutral-500"
                        >
                            {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                </div>

                <div
                    className="fixed bottom-0 left-0 right-0  max-w-[425px] mx-auto pb-10 "
                >
                    <div className="max-w-[425px] mx-auto px-4 py-3 ">
                        <button
                            onClick={handleProceed}
                            className="w-full bg-primary-500 h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                            hover:bg-primary-700 active:bg-[#D01080] transition-colors
                            disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={!currentPassword}
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}
