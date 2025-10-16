"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { ProfileFormData } from "@/types/profile";
import { useTheme } from "next-themes";

export const EditSexualOrientation = ({ backHref = "/edit-profile" }) => {
    const { theme } = useTheme();
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

    const sexualOrientationOptions = [
        { value: 'heterosexual', label: "Heterosexual" },
        { value: 'homosexual', label: "Homosexual" },
        { value: 'bisexual', label: "Bisexual" },
        { value: 'queer', label: "Queer" },
        { value: 'other', label: "Other" },
    ]

    const handleSelectSocialOrientation = (value: string) => {
        setFormData(prev => ({ ...prev, sexualOrientation: value }))
    }

    // Handle keyboard appearance


    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className=" px-4 py-4 flex items-center gap-3 text-[#F92FA2] border-b border-borderButton">
                <Link href={backHref} aria-label="Back" className="rounded-full">
                    <ChevronLeft className="" size={24} strokeWidth={1.5} />
                </Link>
                <h1 className="text-[24px] font-bold leading-[36px]">Edit Sexual Orientation</h1>
            </div>

            {/* Content Area - scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 ">
                <div className="flex flex-col gap-4">
                    {sexualOrientationOptions.map((option) =>
                        <button
                            key={option.value}
                            onClick={() => handleSelectSocialOrientation(option.value)}
                            // className={`py-[14px] px-[18px] border rounded-full text-[16px]  leading-[20px] font-semibold cursor-pointer ${formData.sexualOrientation === option.value ? 'bg-primary-500/10 border-primary-500/40 text-primary-500' : 'border-neutral-200  '}`}
                            className={`py-[14px] px-[18px] border rounded-full text-[16px] leading-[20px] font-semibold cursor-pointer ${formData.sexualOrientation === option.value
                                ? theme === 'light'
                                    ? 'bg-primary-500/10 border-primary-500/40 text-primary-500'
                                    : 'bg-[#FFFFFF4D] border-white'
                                : theme === 'light'
                                    ? 'border-neutral-200  '
                                    : 'border-[#FFFFFF4D] '
                                }`}
                        >
                            {option.label}
                        </button>
                    )

                    }
                </div>
            </div>

            {/* Fixed Button Container */}
            <div
                className="fixed bottom-0 left-0 right-0  max-w-[425px] mx-auto pb-10 "

            >
                <div className="max-w-[425px] mx-auto px-4 py-3 ">
                    <button
                        className="w-full bg-primary-500 h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                            hover:bg-primary-700 active:bg-[#D01080] transition-colors
                            disabled:bg-gray-300 disabled:cursor-not-allowed"

                    >
                        Save
                    </button>
                </div>
            </div>
        </main>
    );
};