"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { ProfileFormData } from "@/types/profile";

export const EditBio = ({ backHref = "/home" }) => {
    const [formData, setFormData] = useState<ProfileFormData>({
        profilePicture: {
            url: "/nobita.png"
        },
        images: [
            { id: 1, url: "/profile1.jpg" },
            { id: 2, url: "/profile2.jpg" },
            { id: 3, url: "/profile3.jpg" },
            { id: 4, url: "/profile1.jpg" },
            { id: 5, url: "/profile2.jpg" },
            { id: 6, url: "/profile3.jpg" },
        ],
        bio: "It is a long established fact that a reader will be distracted by the readable content.",
        interestedIn: "woman",
        sexualOrientation: "heterosexual",
        hobbies: ["football", "exercising", "art"],
        socialLinks: [
            { id: 1, platform: "facebook", username: "Socialmedia/username" },
            { id: 2, platform: "instagram", username: "Socialmedia/username" },
        ]
    });

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, bio: e.target.value }));
    };

    // Handle keyboard appearance
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined' && window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const windowHeight = window.innerHeight;
                const kbHeight = windowHeight - viewportHeight;
                setKeyboardHeight(kbHeight > 0 ? kbHeight : 0);
            }
        };

        if (typeof window !== 'undefined' && window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            return () => {
                if (window.visualViewport) {
                    window.visualViewport.removeEventListener('resize', handleResize);
                }
            };
        }
    }, []);

    const maxLength = 150;
    const currentLength = formData.bio.length;

    return (
        <main className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] border-b border-gray-200">
                <Link href={backHref} aria-label="Back" className="rounded-full">
                    <ChevronLeft className="" size={24} strokeWidth={1.5} />
                </Link>
                <h1 className="text-[24px] font-bold leading-[36px]">Edit Bio</h1>
            </div>

            {/* Content Area - scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
                <div className="space-y-4">
                    <div className="text-[16px] font-medium text-gray-800">
                        Tell a bit about yourself. Keep it short and engaging.
                    </div>

                    <div className="relative">
                        <textarea
                            value={formData.bio}
                            onChange={handleBioChange}
                            maxLength={maxLength}
                            rows={4}
                            placeholder="Write something about yourself..."
                            className="w-full rounded-2xl border border-neutral-300 p-4 text-[14px] resize-none
                                focus:outline-none focus:ring-2 focus:ring-[#F92FA2] focus:bg-[#F92FA2]/5
                                placeholder:text-gray-400"
                        />
                        <div className="text-right text-[12px] text-gray-500 mt-1">
                            {currentLength}/{maxLength}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Button Container */}
            <div
                className="fixed bottom-0 left-0 right-0  max-w-[425px] mx-auto  "
                style={{
                    bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px',
                }}
            >
                <div className="max-w-[425px] mx-auto px-4 py-3 ">
                    <button
                        className="w-full bg-primary-500 h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                            hover:bg-primary-700 active:bg-[#D01080] transition-colors
                            disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={currentLength === 0}
                    >
                        Save
                    </button>
                </div>
            </div>
        </main>
    );
};