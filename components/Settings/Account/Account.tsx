import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";
import Image from 'next/image';
import icons from '@/assets/icons/icons';
export const Account = () => {
    return (
        <>
            <main className='min-h-screen'>
                <div className="border-b border-neutral-200">
                    <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1 ">

                        <Link href='/settings' aria-label="Back" className="rounded-full">
                            <ChevronLeft className="" size={24} strokeWidth={1.5} />
                        </Link>

                        <h1 className="text-[24px] font-bold leading-[36px]">Account</h1>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="h-[52px] px-4 flex gap-4 items-center">
                        <Image
                            src={icons.profile}
                            alt='profile'
                            height={48}
                            width={48}
                            className='h-6 w-6'
                        />
                        <Link href='' className='text-[16px] leading-[20px] font-semibold'>Edit Profile</Link>
                    </div>
                    <div className="h-[52px] px-4 flex gap-4 items-center">
                        <Image
                            src={icons.profile}
                            alt='profile'
                            height={48}
                            width={48}
                            className='h-6 w-6'
                        />
                        <Link href='' className='text-[16px] leading-[20px] font-semibold'>Change Profile</Link>
                    </div>
                    <div className="h-[52px] px-4 flex gap-4 items-center">
                        <Image
                            src={icons.profile}
                            alt='profile'
                            height={48}
                            width={48}
                            className='h-6 w-6'
                        />
                        <Link href='' className='text-[16px] leading-[20px] font-semibold'>Delete Account</Link>
                    </div>
                    <div className="h-[52px] px-4 flex gap-4 items-center">
                        <Image
                            src={icons.profile}
                            alt='profile'
                            height={48}
                            width={48}
                            className='h-6 w-6'
                        />
                        <Link href='' className='text-[16px] leading-[20px] font-semibold'>Add/Edit Email</Link>
                    </div>
                </div>


            </main>
        </>
    )
}
