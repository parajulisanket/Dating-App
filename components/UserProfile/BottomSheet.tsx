"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import BlockUserDialog from "./BlockUserDialog";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface BottomSheetMenuProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userAge: number;
    userImage: string;
    isVerified: boolean;
    id: string;
}

export const BottomSheetMenu = ({
    id,
    isOpen,
    onClose,
    userName,
    userAge,
    userImage,
    isVerified
}: BottomSheetMenuProps) => {
    const { theme } = useTheme();
    const router = useRouter();
    const [isBlockActive, setIsBlockActive] = useState(false);
    const handleBlock = () => {
        console.log("Block user");
        setIsBlockActive(true);
        onClose();
    };

    const handleMuteNotifications = () => {
        console.log("Mute notifications");
        // TODO: Call API to mute notifications
        onClose();
    };

    const handleReport = () => {
        console.log("Report user");
        router.push('7/report')
        onClose();
    };

    return (
        <>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-50"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type:"spring", damping: 100, stiffness: 1000 }}
                        className="fixed bottom-0 md:bottom-[calc((100svh-897px)/2)] md:rounded-4xl left-0 right-0 bg-background rounded-t-3xl z-50 h-[306px] max-w-[425px] mx-auto "
                    >
                        {/* User Info Header */}
                        <div className=" rounded-3xl bg-primary-100 border border-primary-200 p-4 mx-4 mt-4 flex items-center gap-3 ">
                            <Image
                                src='/profile1.jpg'
                                alt={userName}
                                width={52}
                                height={52}
                                className="rounded-full object-cover w-[52px] h-[52px]"
                            />
                            <div className="flex gap-2 items-center text-heading text-[24px] font-bold leading-[36px]">
                                <h1>{userName}, {userAge}</h1>
                                {isVerified && (
                                    <Image
                                        src="/icons/verified.svg"
                                        alt="verified"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer rounded-full object-cover h-6 w-6"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="px-4 py-4 space-y-1">
                            <button
                                onClick={handleBlock}
                                className="w-full flex items-center gap-3 px-4 py-3  rounded-lg transition-colors text-left"
                            >
                                <Image
                                    src='/icons/block.svg'
                                    alt="block"
                                    height={24}
                                    width={24}
                                />
                                <span className="text-[16px] ">Block</span>
                            </button>

                            <button
                                onClick={handleMuteNotifications}
                                className="w-full flex items-center gap-3 px-4 py-3  rounded-lg transition-colors text-left"
                            >
                                <Image
                                    src='/icons/mute.svg'
                                    alt="block"
                                    height={24}
                                    width={24}
                                />
                                <span className="text-[16px] ">Mute Notifications</span>
                            </button>

                            <button
                                onClick={handleReport}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left"
                            >
                                <Image
                                    src='/icons/reportIcon.svg'
                                    alt="block"
                                    height={24}
                                    width={24}
                                />
                                <span className="text-[16px] ">Report</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
            <BlockUserDialog
                isBlockActive={isBlockActive}
                onClose={() => setIsBlockActive(false)}
            />
        </>



    );
};