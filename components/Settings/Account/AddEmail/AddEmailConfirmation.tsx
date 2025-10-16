'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";


export const AddEmailComponent = () => {
    const [email, setEmail] = useState('');
    const handleSave = () => {

    }
    return (
        <>
            <main className='min-h-screen'>
                <div className="border-b border-neutral-200">
                    <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1">
                        <Link href='/settings/account' aria-label="Back" className="rounded-full">
                            <ChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h1 className="text-[24px] font-bold leading-[36px]">Add Email</h1>
                    </div>
                </div>

                <div className="p-4">
                    <h2 className='font-bold text-[24px] leading-[36px] '>Add your email address</h2>
                    <p className='text-[14px] text-justified leading-[21px] text-neutral-800 font-medium'>Keep your account secure and make sure you never miss an important update. Enter your new email address below — we’ll send you a quick verification link to confirm the change..</p>

                </div>

                <div className="p-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='input'
                        placeholder='Add secondary email' />
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
                            disabled={!email}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}
