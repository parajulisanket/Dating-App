"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import icons from "@/assets/icons/icons";
import { useTheme } from 'next-themes'
import { useEffect, useState } from "react";
// Types for backend integration
interface UserProfile {
    name: string;
    age: number;
    profileImage: string;
    isVerified: boolean;
}

interface SettingsMenuItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    route: string;
}

export const Settings = () => {
    const router = useRouter();
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        // Use resolvedTheme to get the actual current theme
        const currentTheme = resolvedTheme || theme;
        setTheme(currentTheme === "dark" ? "light" : "dark");
    };



    if (!mounted) {
        // Return a placeholder that matches your initial render
        return (
            <main className="min-h-screen relative">
                {/* Simplified loading structure */}
                <div className="border-b border-neutral-200">
                    <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1">
                        {/* Loading skeleton */}
                    </div>
                </div>
            </main>
        );
    }

    // Demo data - will be replaced with API data
    const userProfile: UserProfile = {
        name: "Anup",
        age: 23,
        profileImage: "/nobita.png",
        isVerified: true
    };

    const menuItems: SettingsMenuItem[] = [
        {
            id: "account",
            title: "Account",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: '/icons/account.svg',
            route: "/settings/account"
        },
        {
            id: "subscription",
            title: "Subscription",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: icons.subscription,
            route: "/settings/subscription"
        },
        {
            id: "activity-log",
            title: "Activity Log",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: "/icons/activityLog.svg",
            route: "/settings/activity-log"
        },
        {
            id: "privacy",
            title: "Privacy",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: "/icons/privacy.svg",
            route: "/settings/privacy"
        },
        {
            id: "notifications",
            title: "Notifications",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: "/icons/notifications.svg",
            route: "/settings/notifications"
        },
        {
            id: "help-support",
            title: "Help & Support",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: "/icons/help.svg",
            route: "/settings/help-support"
        }
    ];

    const handleMenuItemClick = (route: string) => {
        console.log("Navigate to:", route);
        router.push(route);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        // TODO: Call logout API
        // Clear local storage/cookies
        // Redirect to login page
    };

    const handleBackClick = () => {
        console.log("Going back");
        // router.back();
    };

    return (
        <main className="min-h-screen relative ">
            {/* Header */}
            <div className="border-b border-neutral-200">
                <div className="bg-background px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1 ">

                    <Link href='/profile' aria-label="Back" className="rounded-full">
                        <ChevronLeft className="" size={24} strokeWidth={1.5} />
                    </Link>

                    <h1 className="text-[24px] font-bold leading-[36px]">Settings</h1>
                </div>
            </div>



            <div className="">
                {/* User Profile Card */}
                <div className="px-4 pb-4"><div className="bg-[#fee9f5] rounded-2xl p-4 flex items-center gap-3 border-[1px] border-[#F92FA233]">
                    <Image
                        src={userProfile.profileImage}
                        alt={userProfile.name}
                        width={52}
                        height={52}
                        className="rounded-full object-cover w-[52px] h-[52px]"
                    />
                    <div className="flex gap-2 items-center text-[#f9209b] text-[24px] font-bold leading-[36px]">
                        <h1>{userProfile.name}, {userProfile.age}</h1>
                        {userProfile.isVerified && (
                            <Image
                                src="/icons/verified.svg"
                                alt="verified"
                                width={24}
                                height={24}
                                className="cursor-pointer rounded-full object-cover h-6 w-6"
                            />
                        )}
                    </div>
                </div></div>


                {/* Settings Menu Items */}
                <div className="px-4 border-y border-neutral-200">
                    <div className="size-[52px] w-full  flex items-center    ">
                        <div className="flex justify-between items-center w-full cursor-pointer">
                            <div className="flex items-center gap-3 bg-background">
                                <Image
                                    src={icons.darkmode}
                                    alt="Dark mode icon"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                                <h3 className="text-[16px] font-bold text-gray-900 leading-tight">
                                    Dark Mode
                                </h3>

                            </div>
                            {/* <div className="h-6 w-[42px] border border-primary-500 bg-primary-500/10 rounded-full p-1">
                                <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
                            </div> */}
                            <div
                                onClick={toggleTheme}
                                className={`h-6 w-[42px] rounded-full p-1 transition-all duration-300 cursor-pointer  border border-primary-500 flex items-center
    ${theme === "dark" ? "bg-primary-500" : "bg-primary-500/10"}
  `}
                            >
                                <div
                                    className={`w-4 h-4  rounded-full shadow-md transform transition-transform duration-300
      ${theme === "dark" ? "translate-x-[18px] bg-white" : "translate-x-0 bg-primary-500"}
    `}
                                ></div>
                            </div>

                        </div>
                    </div>
                </div>


                <div className=" px-4  ">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.route)}
                            className="w-full flex items-start gap-4 py-4  rounded-xl  hover:bg-gray-50 transition-colors text-left cursor-pointer"
                        >
                            <div className="pt-1">
                                <Image
                                    src={item.icon}
                                    alt={item.title}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[16px] font-bold text-gray-900 mb-1 leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-[12px] text-gray-500 leading-[18px]">
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <div className=" bottom-4 ">
                    <div className="pt-8 pb-6 flex justify-center ">
                        <button
                            onClick={handleLogout}
                            className="btn-logout text-white px-8 py-3 rounded-[200px] text-[16px] font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
                        >
                            <Image
                                src='/icons/logout.svg'
                                height={48}
                                width={48}
                                alt="logout"
                                className="h-6 w-6"
                            />
                            Log Out
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
};