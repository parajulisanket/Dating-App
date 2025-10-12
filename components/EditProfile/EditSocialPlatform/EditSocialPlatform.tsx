"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProfileFormData } from "@/types/profile";

export const EditSocialPlatform = ({ backHref = "/home" }) => {
    const [formData, setFormData] = useState<ProfileFormData>({
        profilePicture: { url: "/nobita.png" },
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
            { id: 1, platform: "facebook", username: "Socialmedia/facebookUser" },
            { id: 2, platform: "instagram", username: "Socialmedia/instaUser" },
            { id: 3, platform: "x", username: "Socialmedia/xUser" },
        ],
    });

    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [username, setUsername] = useState("");

    const socialPlatformOptions = [
        { value: "facebook", label: "Facebook" },
        { value: "instagram", label: "Instagram" },
        { value: "x", label: "X" },
    ];

    // When user selects a platform
    const handleSelectPlatform = (value: string) => {
        setSelectedPlatform(value);
        const found = formData.socialLinks.find((link) => link.platform === value);
        setUsername(found ? found.username : "");
    };

    // Handle username change
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    // Handle save (ready for backend integration)
    const handleSave = async () => {
        if (!selectedPlatform || !username) return;

        const updatedLinks = formData.socialLinks.map((link) =>
            link.platform === selectedPlatform
                ? { ...link, username }
                : link
        );

        const updatedData = { ...formData, socialLinks: updatedLinks };
        setFormData(updatedData);

        // ✅ Example: ready for backend API integration
        try {
            const res = await fetch("/api/social-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    platform: selectedPlatform,
                    username,
                }),
            });

            if (!res.ok) throw new Error("Failed to save social link");
            alert("Social link saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] border-b border-gray-200">
                <Link href={backHref} aria-label="Back" className="rounded-full">
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </Link>
                <h1 className="text-[20px] font-semibold">Add Social Link</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                <Select onValueChange={handleSelectPlatform}>
                    <SelectTrigger className="w-full  !rounded-[16px] px-4 py-[14px] border border-gray-300 !text-[16px]"
                    >
                        <SelectValue placeholder="Select Social Platform" />
                    </SelectTrigger>
                    <SelectContent className="border !border-primary-500/40">
                        {socialPlatformOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={!selectedPlatform}
                    className="w-full h-[52px] w-full rounded-[16px] border border-neutral-300 p-4 text-[16px] resize-none
                                focus:outline-none focus:ring-2 focus:ring-[#F92FA2] focus:bg-[#F92FA2]/5
                                placeholder-neutral-300 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            </div>

            {/* Save Button */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[425px] mx-auto bg-white border-t border-gray-200 px-4 py-3">
                <button
                    onClick={handleSave}
                    disabled={!selectedPlatform || !username}
                    className={`w-full h-[52px] rounded-full text-[16px] font-semibold transition-colors ${!selectedPlatform || !username
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#F92FA2] text-white hover:bg-pink-600 active:bg-pink-700"
                        }`}
                >
                    Save
                </button>
            </div>
        </main>
    );
};
