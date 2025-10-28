'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";
export const Privacy = () => {
    const [activeStatus, setActiveStatus] = useState(false)
    const [lastActive, setLastActive] = useState(false);
    const [readMessage, setReadMessage] = useState(false);
    const toggleActiveStatus = () => {
        setActiveStatus(prev => !prev)
    }
    const toggleLastActive = () => {
        setLastActive(prev => !prev)
    }
    const toggleReadMessage = () => {
        setReadMessage(prev => !prev)
    }
    const handleSave = () => {
        console.log('handleSave')
    }
    return (
        <>
            <main className='min-h-screen'>
                <div className="border-b border-borderButton">
                    <div className=" px-4 py-4 flex items-center gap-3 text-heading ml-1 ">

                        <Link href='/settings' aria-label="Back" className="rounded-full">
                            <ChevronLeft className="" size={24} strokeWidth={1.5} />
                        </Link>

                        <h1 className="text-[24px] font-bold leading-[36px]">Privacy</h1>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <div className="bg-neutral-1000/5 rounded-[16px] h-[52px] px-4 flex items-center justify-between">
                        <span className="font-medium text-[16px]">Show active status</span>

                        <div
                            onClick={toggleActiveStatus}
                            className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-[#f92fa2]  transition-all duration-300
              ${activeStatus ? "bg-[#f92fa2]" : "bg-[#f92fa2]/10"}
            `}
                        >
                            <div
                                className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${activeStatus ? "translate-x-[20px] bg-white" : "translate-x-0 bg-[#f92fa2]"}
              `}
                            ></div>
                        </div>
                    </div>


                    <div className="bg-neutral-1000/5 rounded-[16px] h-[52px] px-4 flex items-center justify-between">
                        <span className="font-medium text-[16px]">Show last active</span>

                        <div
                            onClick={toggleLastActive}
                            className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-[#f92fa2]  transition-all duration-300
              ${lastActive ? "bg-[#f92fa2]" : "bg-[#f92fa2]/10"}
            `}
                        >
                            <div
                                className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${lastActive ? "translate-x-[20px] bg-white" : "translate-x-0 bg-[#f92fa2]"}
              `}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-neutral-1000/5 rounded-[16px] h-[52px] px-4 flex items-center justify-between">
                        <span className="font-medium text-[16px]">Read message receipts</span>

                        <div
                            onClick={toggleReadMessage}
                            className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-[#f92fa2]  transition-all duration-300
              ${readMessage ? "bg-[#f92fa2]" : "bg-[#f92fa2]/10"}
            `}
                        >
                            <div
                                className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${readMessage ? "translate-x-[20px] bg-white" : "translate-x-0 bg-[#f92fa2]"}
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
        </>
    )
}
