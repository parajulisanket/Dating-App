"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import GlobeIcon from '@/assets/globe.svg'

// Types
interface RelationshipOption {
    key: string;
    label: string;
    emoji: string;
}

interface Hobby {
    key: string;
    label: string;
    emoji: string;
}

interface LifestyleOption {
    key: string;
    label: string;
}

interface LifestyleCategory {
    key: string;
    icon: string;
    title: string;
    options: LifestyleOption[];
}

interface AboutMeItem {
    value: string;
}

interface LookingFor {
    relationshipType: string;
    genderPreference: string;
}

interface LifestyleData {
    drink: string;
    smoke: string;
    diet: string;
    travel: string;
    pets: string;
}

interface ProfileData {
    name: string;
    age: number;
    location: string;
    distance: string;
    bio: string;
    profileImage: string;
    isVerified: boolean;
    aboutMe: AboutMeItem[];
    lookingFor: LookingFor;
    hobbies: string[];
    lifestyle: LifestyleData;
}

interface ImageData {
    id: number;
    src: string;
    alt: string;
}

// Constants - Frontend maintains all emojis and labels
const RELATIONSHIP_OPTIONS: RelationshipOption[] = [
    { key: "serious", label: "Serious Relationship", emoji: "💕" },
    { key: "casual", label: "Casual Dating", emoji: "😊" },
    { key: "friendship", label: "Friendship", emoji: "👋" },
    { key: "unsure", label: "Not sure yet", emoji: "🤷" },
];

const HOBBIES: Hobby[] = [
    { key: "football", label: "Football", emoji: "⚽" },
    { key: "singing", label: "Singing", emoji: "🎤" },
    { key: "reading", label: "Reading", emoji: "📖" },
    { key: "acting", label: "Acting", emoji: "🕺" },
    { key: "swimming", label: "Swimming", emoji: "🏊" },
    { key: "cricket", label: "Cricket", emoji: "🏏" },
    { key: "dancing", label: "Dancing", emoji: "💃" },
    { key: "exercising", label: "Exercising", emoji: "💪" },
    { key: "art", label: "Art", emoji: "🎨" },
    { key: "boxing", label: "Boxing", emoji: "🥊" },
    { key: "hiking", label: "Hiking", emoji: "🥾" },
    { key: "meditation", label: "Meditation", emoji: "🧘" },
    { key: "paragliding", label: "Paragliding", emoji: "🪂" },
    { key: "cycling", label: "Cycling", emoji: "🚴" },
];

const LIFESTYLE: LifestyleCategory[] = [
    {
        key: "drink",
        icon: "🥂",
        title: "Do you drink?",
        options: [
            { key: "never", label: "Never" },
            { key: "socially", label: "Socially" },
            { key: "occasionally", label: "Occasionally" },
            { key: "often", label: "Often" },
        ],
    },
    {
        key: "smoke",
        icon: "🚬",
        title: "Do you smoke?",
        options: [
            { key: "never", label: "Never" },
            { key: "socially", label: "Socially" },
            { key: "occasionally", label: "Occasionally" },
            { key: "often", label: "Often" },
        ],
    },
    {
        key: "active",
        icon: "🏃‍♂️",
        title: "How active are you?",
        options: [
            { key: "not_really", label: "Not really" },
            { key: "sometimes", label: "Sometimes" },
            { key: "regularly", label: "Regularly" },
            { key: "fitness_life", label: "Fitness is life" },
        ],
    },
    {
        key: "diet",
        icon: "🍔",
        title: "What's your diet like?",
        options: [
            { key: "no_pref", label: "No preference" },
            { key: "veg", label: "Veg" },
            { key: "nonveg", label: "Non-veg" },
            { key: "other", label: "Other" },
        ],
    },
    {
        key: "travel",
        icon: "✈️",
        title: "Do you like to travel?",
        options: [
            { key: "homebody", label: "Homebody" },
            { key: "sometimes", label: "Sometimes" },
            { key: "love_exploring", label: "Love exploring" },
            { key: "always_planning", label: "Always planning" },
        ],
    },
    {
        key: "pets",
        icon: "🐶",
        title: "Do you have or like pets?",
        options: [
            { key: "love_pets", label: "Love pets" },
            { key: "okay_with_pets", label: "Okay with pets" },
            { key: "prefer_no_pets", label: "Prefer no pets" },
        ],
    },
];

// Helper functions to get emoji and labels from keys
const getRelationshipType = (key: string): RelationshipOption | undefined => {
    return RELATIONSHIP_OPTIONS.find(option => option.key === key);
};

const getHobbyDetails = (key: string): Hobby | undefined => {
    return HOBBIES.find(hobby => hobby.key === key);
};

const getLifestyleDetails = (categoryKey: string, optionKey: string): { icon: string; label: string } | null => {
    const category = LIFESTYLE.find(item => item.key === categoryKey);
    if (!category) return null;

    const option = category.options.find(opt => opt.key === optionKey);
    return option ? { icon: category.icon, label: option.label } : null;
};

export const MyInfo = () => {
    // Demo profile data - will be replaced with API data
    // Backend will only send keys/values, emojis are maintained on frontend
    const profileData: ProfileData = {
        name: "Anup",
        age: 23,
        location: "Kanyam",
        distance: "535km",
        bio: "Mutton Lover....",
        profileImage: "/nobita.png",
        isVerified: false,
        aboutMe: [
            { value: "Man" },
            { value: "Pisces" },
            { value: "Heterosexual" },
            { value: "At University" },
            { value: "5'7\"" },
        ],
        lookingFor: {
            relationshipType: "serious", // Backend sends only the key
            genderPreference: "Woman"
        },
        hobbies: ["football", "exercising", "art"], // Backend sends only keys
        lifestyle: {
            drink: "never",      // Backend sends only keys
            smoke: "never",
            diet: "nonveg",
            travel: "love_exploring",
            pets: "love_pets"
        },

    };

    const images: ImageData[] = [
        { id: 1, src: "/profile1.jpg", alt: "profile1" },
        { id: 2, src: "/profile2.jpg", alt: "profile2" },
        { id: 3, src: "/profile3.jpg", alt: "profile3" },
    ];

    return (
        <main className="flex flex-col gap-[24px]">
            {/* Profile Info Section */}
            <div className="p-4 border-y border-gray-300">
                <div className="w-full h-full flex flex-col  ">
                    {
                        !profileData.isVerified && (
                            <Link href='/verification'>
                                <div className="flex gap-2  flex-col text-white bg-[linear-gradient(130.89deg,#006FFF_4.3%,#01E6FF_97.77%)] mb-4 rounded-[16px] p-4 border border-[#00E6FF] ">
                                    <div className="text-[16px] leading-[20px] font-semibold">Verify Account</div>
                                    <div className="text-[12px] leading-[18px] font-medium">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum minima esse officiis.</div>
                                </div></Link>

                        )
                    }
                    {/* Profile Header */}
                    <div className="flex h-[80px] gap-4">
                        <Image
                            src={profileData.profileImage}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="cursor-pointer rounded-full object-cover h-[80px] w-[80px]"
                        />

                        <div className="flex flex-col h-[57px] ">
                            <div className="flex gap-2 items-center text-[#f9209b] text-[24px] font-bold leading-[36px]">
                                <h1>{profileData.name}, {profileData.age}</h1>
                                {profileData.isVerified && (
                                    <Image
                                        src="/icons/verified.svg"
                                        alt="verified"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer rounded-full object-cover h-6 w-6"
                                    />
                                )}
                            </div>
                            <div className="flex text-[#fa51b1] items-center gap-1">
                                <Image
                                    src="/icons/location.svg"
                                    alt="location"
                                    width={16}
                                    height={16}
                                    className="h-4 w-4"
                                />
                                <p className="text-[14px]">{profileData.location}, {profileData.distance}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="font-medium text-[12px] text-[#777777] py-2">
                        <p>{profileData.bio}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {/* Add Story Button */}
                        <button
                            onClick={() => console.log("Add Story clicked")}
                            className="p-1 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 cursor-pointer"
                        >
                            <Image
                                src="/icons/addStory.svg"
                                alt="Add Story"
                                width={136}
                                height={52}
                                className="select-none"
                            />
                        </button>

                        {/* Edit Button */}
                        <Link href='/edit-profile'>
                            <button
                                onClick={() => console.log("Edit clicked")}
                                className="p-1 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 cursor-pointer"
                            >
                                <Image
                                    src="/icons/edit.svg"
                                    alt="Edit"
                                    width={52}
                                    height={52}
                                    className="select-none"
                                />
                            </button>
                        </Link>

                    </div>
                </div>
            </div>

            {/* Image Gallery Section */}
            <div className="px-4">
                <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">My Images</h1>

                <Swiper
                    spaceBetween={5}
                    slidesPerView={"auto"}
                    className=""
                >
                    {images.map((image) => (
                        <SwiperSlide
                            key={image.id}
                            className="!w-[172px] !h-[229px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative h-full w-full">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover rounded-2xl"
                                    sizes="172px"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* About Me Section */}
            <div className="px-4">
                <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">About Me</h1>
                <div className="flex flex-wrap gap-2">
                    {profileData.aboutMe.map((item, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px]"
                        >
                            {item.value}
                        </div>
                    ))}
                </div>
            </div>

            {/* I'm Looking for Section */}
            <div className="px-4">
                <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">I'm Looking for</h1>
                <div className="flex flex-wrap gap-2">
                    {profileData.lookingFor.relationshipType && (
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px] flex items-center gap-2">
                            <span>{getRelationshipType(profileData.lookingFor.relationshipType)?.emoji}</span>
                            <span>{getRelationshipType(profileData.lookingFor.relationshipType)?.label}</span>
                        </div>
                    )}
                    {profileData.lookingFor.genderPreference && (
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px]">
                            {profileData.lookingFor.genderPreference}
                        </div>
                    )}
                </div>
            </div>

            {/* My Hobbies Section */}
            <div className="px-4">
                <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">My Hobbies</h1>
                <div className="flex flex-wrap gap-2">
                    {profileData.hobbies.map((hobbyKey) => {
                        const hobby = getHobbyDetails(hobbyKey);
                        return hobby ? (
                            <div
                                key={hobbyKey}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px] flex items-center gap-2"
                            >
                                <span>{hobby.emoji}</span>
                                <span>{hobby.label}</span>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>

            {/* My Lifestyle Section */}
            <div className="px-4 ">
                <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">My Lifestyle</h1>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(profileData.lifestyle).map(([categoryKey, optionKey]) => {
                        const details = getLifestyleDetails(categoryKey, optionKey);
                        return details ? (
                            <div
                                key={categoryKey}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px] flex items-center gap-2"
                            >
                                <span>{details.icon}</span>
                                <span>{details.label}</span>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>

            <div className="px-4 pb-4 ">
                <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">My Social Accounts</h1>
                <div className="flex gap-2">
                    <Image
                        src="/facebook.svg"
                        alt="facebook"
                        width={36}
                        height={36}
                        className="select-none"
                    />
                    <Image
                        src="/instagram.svg"
                        alt="instagram"
                        width={32}
                        height={32}
                        className="select-none"
                    />
                </div>
            </div>

        </main>
    );
};