"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { ProfileFormData } from "@/types/profile";
import emoji from "@/assets/emojis/emoji";
import { useTheme } from "next-themes";

interface HobbyOption {
  key: string;
  label: string;
  emoji: string;
}

export const EditHobbies = ({ backHref = "/edit-profile" }) => {
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState<ProfileFormData>({
    profilePicture: {
      url: "/nobita.png",
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
    ],
  });

  const hobbiesOptions: HobbyOption[] = [
    { key: "football", label: "Football", emoji: emoji.football },
    { key: "exercising", label: "Exercising", emoji: emoji.exercising },
    { key: "singing", label: "Singing", emoji: emoji.singing },
    { key: "reading", label: "Reading", emoji: emoji.reading },
    { key: "acting", label: "Acting", emoji: emoji.acting },
    { key: "swimming", label: "Swimming", emoji: emoji.swimming },
    { key: "cricket", label: "Cricket", emoji: emoji.cricket },
    { key: "dancing", label: "Dancing", emoji: emoji.dancing },
    { key: "painting", label: "Art", emoji: emoji.painting },
    { key: "boxing", label: "Boxing", emoji: emoji.boxing },
    { key: "hiking", label: "Hiking", emoji: emoji.hiking },
    { key: "meditation", label: "Meditation", emoji: emoji.meditation },
    { key: "paragliding", label: "Paragliding", emoji: emoji.paragliding },
    { key: "cycling", label: "Cycling", emoji: emoji.cycling },
  ];

  const handleToggleHobby = (hobbyKey: string) => {
    setFormData((prev) => {
      const isSelected = prev.hobbies.includes(hobbyKey);
      return {
        ...prev,
        hobbies: isSelected
          ? prev.hobbies.filter((h) => h != hobbyKey)
          : [...prev.hobbies, hobbyKey],
      };
    });
  };

  // Handle keyboard appearance

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className=" px-4 py-4 flex items-center gap-3 text-heading border-b border-borderButton">
        <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft className="" size={24} strokeWidth={1.5} />
        </Link>
        <h1 className="text-[24px] font-bold leading-[36px]">Edit Hobbies </h1>
      </div>

      {/* Content Area - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 ">
        <div className="flex flex-wrap gap-4">
          {hobbiesOptions.map((option) => {
            const isSelected = formData.hobbies.includes(option.key);
            return (
              <button
                key={option.key}
                onClick={() => handleToggleHobby(option.key)}
                className={`flex h-[40px] cursor-pointer items-center gap-2 py-[10px] px-[16px] rounded-full border text-[14px] leading-[21px] font-medium transition 
  ${
    isSelected
      ? resolvedTheme === "light"
        ? "bg-primary-500/10 text-primary-500 border-primary-500/40"
        : "bg-[#FFFFFF4D] border-white text-white"
      : resolvedTheme === "light"
      ? "bg-white border-neutral-200 text-neutral-1000"
      : "bg-transparent border-[#FFFFFF4D] text-white"
  }`}
              >
                {/* <span>{option.emoji}</span> */}
                <span>
                  <Image
                    src={option.emoji}
                    height={40}
                    width={40}
                    alt="emoji"
                    className="size-[20px]"
                  />
                </span>

                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Button Container */}
      <div className="absolute bottom-0 left-0 right-0  max-w-[425px] mx-auto pb-10 ">
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
