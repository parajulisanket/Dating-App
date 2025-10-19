"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import emoji from "@/assets/emojis/emoji";
// Types for backend integration
interface ProfilePicture {
  url: string;
}

interface ProfileImage {
  id: number;
  url: string;
}

interface SocialLink {
  id: number;
  platform: "facebook" | "instagram";
  username: string;
}

interface ProfileFormData {
  profilePicture: ProfilePicture;
  images: ProfileImage[];
  bio: string;
  interestedIn: string;
  sexualOrientation: string;
  hobbies: string[];
  socialLinks: SocialLink[];
}

// Constants for dropdowns
const GENDER_OPTIONS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

const ORIENTATION_OPTIONS = [
  { value: "heterosexual", label: "Heterosexual" },
  { value: "homosexual", label: "Homosexual" },
  { value: "bisexual", label: "Bisexual" },
  { value: "pansexual", label: "Pansexual" },
  { value: "asexual", label: "Asexual" },
  { value: "other", label: "Other" },
];

const HOBBIES_OPTIONS = [
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

export const EditProfile = () => {
  // Demo data - will be replaced with API data
  const router = useRouter();
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
    hobbies: ["football", "exercising", "cycling"],
    socialLinks: [
      { id: 1, platform: "facebook", username: "Socialmedia/username" },
      { id: 2, platform: "instagram", username: "Socialmedia/username" },
    ],
  });

  // Handlers for backend integration
  const handleProfilePictureChange = () => {
    console.log("Change profile picture");
    // TODO: Implement file upload logic
  };

  const handleImageDelete = (imageId: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
    console.log("Delete image:", imageId);
    // TODO: Call API to delete image
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, bio: e.target.value }));
  };

  const handleInterestedInChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, interestedIn: e.target.value }));
  };

  const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, sexualOrientation: e.target.value }));
  };

  const handleHobbyToggle = (hobbyKey: string) => {
    setFormData((prev) => {
      const hobbies = prev.hobbies.includes(hobbyKey)
        ? prev.hobbies.filter((h) => h !== hobbyKey)
        : [...prev.hobbies, hobbyKey];
      return { ...prev, hobbies };
    });
  };

  const handleSocialLinkRemove = (linkId: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== linkId),
    }));
    console.log("Remove social link:", linkId);
    // TODO: Call API to remove social link
  };

  const containerHeight = `calc(100dvh)`;

  return (
    <div
      className="no-scrollbar scroll-smooth "
      style={{
        height: containerHeight,
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        overflowY: "auto",
      }}
    >
      {" "}
      <main className="min-h-screen ">
        {/* Header */}
        <div className="bg-background px-4 py-4 flex items-center gap-3 text-[#F92FA2] border-b border-borderButton">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="rounded-full"
          >
            <ChevronLeft className="" size={24} strokeWidth={1.5} />
          </button>

          <h1 className="text-[24px] font-bold leading-[36px]">Edit Profile</h1>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* Profile Picture Section */}
          <div>
            <h2 className="edit-title">My Profile Picture</h2>
            <div className="flex items-center gap-4">
              <Image
                src={formData.profilePicture.url}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover h-[80px] w-[80px]"
              />
              <button
                onClick={handleProfilePictureChange}
                className="bg-[#F92FA2] text-white px-6 py-2 rounded-full text-[16px] font-bold"
              >
                Change
              </button>
            </div>
          </div>

          {/* My Pictures Section */}
          <div>
            <h2 className="edit-title">My Pictures</h2>
            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((image) => (
                <div key={image.id} className="relative aspect-[3/4]">
                  <Image
                    src={image.url}
                    alt={`Picture ${image.id}`}
                    fill
                    className="rounded-2xl object-cover"
                  />
                  <button
                    onClick={() => handleImageDelete(image.id)}
                    className="absolute top-2 right-2 btn-close rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Bio</h2>
              <Link href="/edit-profile/bio">
                <button className="btn-edit">Edit</button>
              </Link>
            </div>

            <div className="w-full border border-neutral-400  rounded-lg p-3 text-[14px] focus:outline-none">
              {formData.bio || ""}
            </div>
          </div>

          {/* Interested In Section */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">I'm interested in</h2>
              <Link href="edit-profile/interested">
                <button className="btn-edit">Edit</button>
              </Link>
            </div>
            <div className="w-full border border-neutral-400 h-[56px] rounded-lg p-3 text-[14px] focus:outline-none">
              <span className="py-[14px] px-4 rounded-[200px] border border-capsule-border bg-capsule h-[32px] inline-flex justify-center items-center">
                {formData.interestedIn || ""}
              </span>
            </div>
          </div>

          {/* Sexual Orientation Section */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Sexual Orientation is</h2>
              <Link href="/edit-profile/sexual-orientation">
                <button className="btn-edit">Edit</button>
              </Link>
            </div>
            <div className="w-full border border-neutral-400 h-[56px] rounded-lg p-3 text-[14px] focus:outline-none">
              <span className="py-[14px] px-4 rounded-[200px] border border-capsule-border bg-capsule h-[32px] inline-flex justify-center items-center">
                {formData.sexualOrientation || ""}
              </span>
            </div>
          </div>

          {/* Hobbies Section */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Hobbies are</h2>
              <Link href="/edit-profile/hobbies">
                <button className="btn-edit">Edit</button>
              </Link>
            </div>
            <div className="w-full border border-neutral-400 rounded-lg p-3 text-[14px] focus:outline-none">
              <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                {formData.hobbies.length > 0 ? (
                  formData.hobbies.map((hobbyKey) => {
                    const hobby = HOBBIES_OPTIONS.find(
                      (h) => h.key === hobbyKey
                    );
                    return (
                      <span
                        key={hobbyKey}
                        className="px-4 py-[6px] rounded-full border border-capsule-border bg-capsule inline-flex items-center gap-2"
                      >
                        <Image
                          src={hobby?.emoji}
                          alt={`Picture ${hobby?.label}`}
                          height={20}
                          width={20}
                          className=" object-cover h-5 w-5"
                        />
                        <span>{hobby?.label}</span>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400">No hobbies selected</span>
                )}
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Social Links</h2>
              <Link href="/edit-profile/social-accounts">
                <button className="btn-edit">Edit</button>
              </Link>
            </div>
            <div className="space-y-3">
              {formData.socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-3  border border-neutral-400 rounded-lg p-3"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center '
                                    }`}
                  >
                    {link.platform === "facebook" ? (
                      <Image
                        src="/icons/facebookBlue.svg"
                        alt="Profile picture"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <Image
                        src="/icons/instagramblue.svg"
                        alt="Profile picture"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <span className="flex-1 text-[14px]">{link.username}</span>
                  <button
                    onClick={() => handleSocialLinkRemove(link.id)}
                    className=" hover:text-gray-600"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <Link href="/edit-profile/social-accounts">
                <button className="w-full p-4 bg-capsule h-[52px]  rounded-lg py-3 text-[14px]  flex items-center justify-center gap-2 hover:border-[#f9209b] hover:text-[#f9209b] transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 5V15M5 10H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add social link
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
