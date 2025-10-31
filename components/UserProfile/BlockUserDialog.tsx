"use client"
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import profile from '@/public/profile1.jpg';
import { useState } from "react";
import { useTheme } from "next-themes";

interface BlockUserProps {
    isBlockActive: boolean;
    onClose: () => void;
}

export default function BlockUserDialog({ isBlockActive, onClose }: BlockUserProps) {
    const { theme } = useTheme();
    const handleBlock = () => {
        console.log('User blocked');
        onClose();
        // Add your block logic here
    };

    const handleCancel = () => {
        console.log('Action cancelled');
        onClose();
    };

    return (
        <AnimatePresence>
            {isBlockActive && (
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
                        className="fixed bottom-0 md:bottom-[calc((100svh-897px)/2)] rounded-b-4xl left-0 right-0 bg-background rounded-t-3xl z-50  mx-auto w-[425px] h-[343px] p-4"
                    >
                        <div className="z-50   mx-auto pb-4">
                            {/* Profile Image */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        src={profile}
                                        height={64}
                                        width={64}
                                        className="h-full w-full object-cover"
                                        alt="profile"
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-semibold text-center  mb-4">
                                Block Shreya
                            </h2>

                            {/* Description */}
                            <p className={`text-center ${theme === 'light' ? 'text-gray-600' : ""} text-sm mb-8 leading-relaxed`}>
                                It is a long established fact that a reader will be distracted by the readable content
                            </p>

                            {/* Block Button */}
                            <button
                                onClick={handleBlock}
                                className="w-full btn-userprofile  transition-colors duration-200"
                            >
                                Block
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={handleCancel}
                                className="w-full text-[16px] bg-transparent text-pink-500 hover:text-pink-600 font-semibold py-3 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}