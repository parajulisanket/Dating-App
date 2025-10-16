import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from 'next/image';
import icons from '@/assets/icons/icons';

export const Account = () => {
    return (
        <>
            <main className='min-h-screen'>
                <div className="border-b border-neutral-200">
                    <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1">
                        <Link href='/settings' aria-label="Back" className="rounded-full">
                            <ChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h1 className="text-[24px] font-bold leading-[36px]">Account</h1>
                    </div>
                </div>

                <div className="p-4 space-y-1">

                    {/* Edit Profile */}
                    <Link href='/edit-profile' className="h-[52px] px-4 flex gap-4 items-center justify-between rounded-[16px] bg-neutral-1000/5">
                        <div className="flex items-center gap-4">
                            <Image src={icons.profile} alt='profile' height={48} width={48} className='h-6 w-6' />
                            <p className='text-[16px] leading-[20px] font-semibold'>Edit Profile</p>
                        </div>
                        <ChevronRight size={16} className='text-neutral-600' />
                    </Link>

                    {/* Change Password */}
                    <Link href='/settings/account/change-password' className="h-[52px] px-4 flex gap-4 items-center justify-between rounded-[16px] bg-neutral-1000/5">
                        <div className="flex items-center gap-4">
                            <Image src={icons.changePassword} alt='change password' height={48} width={48} className='h-6 w-6' />
                            <p className='text-[16px] leading-[20px] font-semibold'>Change Password</p>
                        </div>
                        <ChevronRight size={16} className='text-neutral-600' />
                    </Link>

                    {/* Delete Account */}
                    <Link href='/settings/account//delete-account' className="h-[52px] px-4 flex gap-4 items-center justify-between rounded-[16px] bg-neutral-1000/5">
                        <div className="flex items-center gap-4">
                            <Image src={icons.deleteAccount} alt='delete account' height={48} width={48} className='h-6 w-6' />
                            <p className='text-[16px] leading-[20px] font-semibold'>Delete Account</p>
                        </div>
                        <ChevronRight size={16} className='text-neutral-600' />
                    </Link>

                    {/* Add/Edit Email */}
                    <Link href='/settings/account/add-email' className="h-[52px] px-4 flex gap-4 items-center justify-between rounded-[16px] bg-neutral-1000/5">
                        <div className="flex items-center gap-4">
                            <Image src={icons.addEditEmail} alt='add or edit email' height={48} width={48} className='h-6 w-6' />
                            <p className='text-[16px] leading-[20px] font-semibold'>Add/Edit Email</p>
                        </div>
                        <ChevronRight size={16} className='text-neutral-600' />
                    </Link>

                </div>
            </main>
        </>
    )
}
