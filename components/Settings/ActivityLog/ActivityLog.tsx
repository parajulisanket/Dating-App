import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";
import Image from 'next/image';
import icons from '@/assets/icons/icons';
export const ActivityLog = () => {
    return (
        <>
            <main className='min-h-screen'>
                <div className="border-b border-neutral-200">
                    <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1 ">

                        <Link href='/settings' aria-label="Back" className="rounded-full">
                            <ChevronLeft className="" size={24} strokeWidth={1.5} />
                        </Link>

                        <h1 className="text-[24px] font-bold leading-[36px]">Activity Log</h1>
                    </div>
                </div>
                <div className="mt-2">

                </div>


            </main>
        </>
    )
}
