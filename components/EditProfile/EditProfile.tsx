"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
    { key: "football", label: "Football", emoji: "⚽" },
    { key: "exercising", label: "Exercising", emoji: "💪" },
    { key: "art", label: "Art", emoji: "🎨" },
    { key: "singing", label: "Singing", emoji: "🎤" },
    { key: "reading", label: "Reading", emoji: "📖" },
    { key: "dancing", label: "Dancing", emoji: "💃" },
];

export const EditProfile = ({ backHref = "/home" }) => {
    // Demo data - will be replaced with API data
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

    // Handlers for backend integration
    const handleProfilePictureChange = () => {
        console.log("Change profile picture");
        // TODO: Implement file upload logic
    };

    const handleImageDelete = (imageId: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== imageId)
        }));
        console.log("Delete image:", imageId);
        // TODO: Call API to delete image
    };

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, bio: e.target.value }));
    };

    const handleInterestedInChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, interestedIn: e.target.value }));
    };

    const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, sexualOrientation: e.target.value }));
    };

    const handleHobbyToggle = (hobbyKey: string) => {
        setFormData(prev => {
            const hobbies = prev.hobbies.includes(hobbyKey)
                ? prev.hobbies.filter(h => h !== hobbyKey)
                : [...prev.hobbies, hobbyKey];
            return { ...prev, hobbies };
        });
    };

    const handleSocialLinkRemove = (linkId: number) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter(link => link.id !== linkId)
        }));
        console.log("Remove social link:", linkId);
        // TODO: Call API to remove social link
    };

    const handleAddSocialLink = () => {
        console.log("Add social link");
        // TODO: Show modal to add new social link
    };

    const handleSave = () => {
        console.log("Save profile:", formData);
        // TODO: Call API to save profile data
    };


    return (
        <main className="min-h-screen ">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2]">

                <Link href={backHref} aria-label="Back" className="rounded-full">
                    <ChevronLeft className="" size={24} strokeWidth={1.5} />
                </Link>

                <h1 className="text-[24px] font-bold leading-[36px]">Edit Profile</h1>
            </div>

            <div className="px-4 py-6 space-y-6">
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
                                        <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
                        <Link href=''>
                            <button className="btn-edit">
                                Edit
                            </button>
                        </Link>
                    </div>
                    <textarea
                        value={formData.bio}
                        readOnly
                        onChange={handleBioChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-[14px] min-h-[80px] "
                        placeholder="Write something about yourself..."
                    />
                </div>

                {/* Interested In Section */}
                <div>

                    <div className="flex justify-between">

                        <h2 className="edit-title">I'm interested in</h2>
                        <Link href=''>
                            <button className="btn-edit">
                                Edit
                            </button>
                        </Link>
                    </div>
                    <select
                        value={formData.interestedIn}
                        onChange={handleInterestedInChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-[14px] focus:outline-none focus:border-[#f9209b] appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center'
                        }}
                    >
                        {GENDER_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sexual Orientation Section */}
                <div>
                    <div className="flex justify-between">
                        <h2 className="edit-title">My Sexual Orientation is</h2>
                        <Link href=''>
                            <button className="btn-edit">
                                Edit
                            </button>
                        </Link>
                    </div>
                    <select
                        value={formData.sexualOrientation}
                        onChange={handleOrientationChange}
                        className="w-full border border-gray-300 rounded-lg p-3 text-[14px] focus:outline-none focus:border-[#f9209b] appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center'
                        }}
                    >
                        {ORIENTATION_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hobbies Section */}
                <div>
                    <div className="flex justify-between">
                        <h2 className="edit-title">My Hobbies are</h2>
                        <Link href=''>
                            <button className="btn-edit">
                                Edit
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {HOBBIES_OPTIONS.map(hobby => {
                            const isSelected = formData.hobbies.includes(hobby.key);
                            return (
                                <button
                                    key={hobby.key}
                                    onClick={() => handleHobbyToggle(hobby.key)}
                                    className={`px-4 py-2 rounded-full text-[14px] flex items-center gap-2 border transition-all ${isSelected
                                        ? 'bg-[#f9209b] text-white border-[#f9209b]'
                                        : 'bg-white text-gray-700 border-gray-300'
                                        }`}
                                >
                                    <span>{hobby.emoji}</span>
                                    <span>{hobby.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Social Links Section */}
                <div>
                    <div className="flex justify-between">
                        <h2 className="edit-title">My Social Links</h2>
                        <Link href=''>
                            <button className="btn-edit">
                                Edit
                            </button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {formData.socialLinks.map(link => (
                            <div key={link.id} className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg p-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center '
                                    }`}>
                                    {link.platform === 'facebook' ? (
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
                                <span className="flex-1 text-[14px] text-gray-700">{link.username}</span>
                                <button
                                    onClick={() => handleSocialLinkRemove(link.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddSocialLink}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-[14px] text-gray-500 flex items-center justify-center gap-2 hover:border-[#f9209b] hover:text-[#f9209b] transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Add social link
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button - Fixed at bottom */}
            {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-[#f9209b] to-[#ff6b9d] text-white py-3 rounded-full text-[16px] font-semibold"
                >
                    Save Changes
                </button>
            </div> */}
        </main>
    );
};