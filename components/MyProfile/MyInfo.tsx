"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

const getRelationshipType = (key: string) =>
  RELATIONSHIP_OPTIONS.find((o) => o.key === key);

const getHobbyDetails = (key: string) => HOBBIES.find((h) => h.key === key);

const getLifestyleDetails = (
  categoryKey: string,
  optionKey: string
): { icon: string; label: string } | null => {
  const category = LIFESTYLE.find((c) => c.key === categoryKey);
  if (!category) return null;
  const opt = category.options.find((o) => o.key === optionKey);
  return opt ? { icon: category.icon, label: opt.label } : null;
};

export const MyInfo = () => {
  const profileData: ProfileData = {
    name: "Anup",
    age: 23,
    location: "Kanyam",
    distance: "535km",
    bio: "Mutton Lover....",
    profileImage: "/nobita.png",
    isVerified: true,
    aboutMe: [
      { value: "Man" },
      { value: "Pisces" },
      { value: "Heterosexual" },
      { value: "At University" },
      { value: "5'7\"" },
    ],
    lookingFor: {
      relationshipType: "serious",
      genderPreference: "Woman",
    },
    hobbies: ["football", "exercising", "art"],
    lifestyle: {
      drink: "never",
      smoke: "never",
      diet: "nonveg",
      travel: "love_exploring",
      pets: "love_pets",
    },
  };

  const images: ImageData[] = [
    { id: 1, src: "/profile1.jpg", alt: "profile1" },
    { id: 2, src: "/profile2.jpg", alt: "profile2" },
    { id: 3, src: "/profile3.jpg", alt: "profile3" },
  ];

  return (
    <section className="h-[calc(105svh-160px)] overflow-y-auto overscroll-contain no-scrollbar">
      <main className="flex flex-col gap-[24px]">
        {/* Profile Info */}
        <div className="p-6 border-y border-gray-300">
          <div className="w-full h-full flex flex-col">
            {/* Header row */}
            <div className="flex h-[80px] gap-4">
              <Image
                src={profileData.profileImage}
                alt="Profile"
                width={80}
                height={80}
                className="cursor-pointer rounded-full object-cover h-[80px] w-[80px]"
              />
              <div className="flex flex-col h-[57px]">
                <div className="flex gap-2 items-center text-[#f9209b] text-[24px] font-bold leading-[36px]">
                  <h1>
                    {profileData.name}, {profileData.age}
                  </h1>
                  {profileData.isVerified && (
                    <Image
                      src="/icons/verified.svg"
                      alt="verified"
                      width={24}
                      height={24}
                      className="h-6 w-6"
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
                  <p className="text-[14px]">
                    {profileData.location}, {profileData.distance}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="font-medium text-[12px] text-[#777777] py-2">
              <p>{profileData.bio}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => console.log("Add Story clicked")}
                className="p-1 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95"
              >
                <Image
                  src="/icons/addStory.svg"
                  alt="Add Story"
                  width={136}
                  height={52}
                  className="select-none"
                />
              </button>

              <Link href="/edit-profile">
                <button className="p-1 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95">
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

        {/* Image Gallery */}
        <div className="px-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            My Images
          </h1>
          <Swiper spaceBetween={5} slidesPerView="auto">
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

        {/* About Me */}
        <div className="px-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            About Me
          </h1>
          <div className="flex flex-wrap gap-2">
            {profileData.aboutMe.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px]"
              >
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* I'm Looking for */}
        <div className="px-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            I'm Looking for
          </h1>
          <div className="flex flex-wrap gap-2">
            {profileData.lookingFor.relationshipType && (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px] flex items-center gap-2">
                {(() => {
                  const rel = getRelationshipType(
                    profileData.lookingFor.relationshipType
                  );
                  return (
                    <>
                      <span>{rel?.emoji}</span>
                      <span>{rel?.label}</span>
                    </>
                  );
                })()}
              </div>
            )}
            {profileData.lookingFor.genderPreference && (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px]">
                {profileData.lookingFor.genderPreference}
              </div>
            )}
          </div>
        </div>

        {/* Hobbies */}
        <div className="px-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            My Hobbies
          </h1>
          <div className="flex flex-wrap gap-2">
            {profileData.hobbies.map((key) => {
              const hobby = getHobbyDetails(key);
              return hobby ? (
                <div
                  key={key}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-[14px] flex items-center gap-2"
                >
                  <span>{hobby.emoji}</span>
                  <span>{hobby.label}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="px-4 ">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            My Lifestyle
          </h1>
          <div className="flex flex-wrap gap-2">
            {Object.entries(profileData.lifestyle).map(
              ([categoryKey, optionKey]) => {
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
              }
            )}
          </div>
        </div>

        {/* Social Accounts */}
        <div className="px-4 pb-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            My Social Accounts
          </h1>
          <div className="flex gap-2">
            <Image src="/facebook.svg" alt="facebook" width={36} height={36} />
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={32}
              height={32}
            />
          </div>
        </div>
      </main>
    </section>
  );
};
