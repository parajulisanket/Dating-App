"use client"
import { Header } from "@/components/UserProfile/Header"
import { UserInfo } from "@/components/UserProfile/UserInfo";
import { useState } from "react";
import { BottomSheetMenu } from "@/components/UserProfile/BottomSheet";

type UserPageProps = {
    params: {
        id: string
    }
}

export default function UserPage({ params }: UserPageProps) {
    const { id } = params;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="sticky rounded-t-4xl bg-background w-[425px] z-50">
                <Header onMenuClick={() => setIsMenuOpen(true)} />
            </div>
            <main className="flex-1">
                <UserInfo id={id} />
            </main>
            {/* This parent div now has relative positioning */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="relative h-full pointer-events-auto">
                    <BottomSheetMenu
                        id={id}
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        userName="Shreya"
                        userAge={24}
                        userImage="/profile1.jpg"
                        isVerified={true}
                    />
                </div>
            </div>
        </div>
    );
}