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
        <div className="min-h-screen flex flex-col">

            <div className="fixed bg-white w-[393px] z-50">
                <Header onMenuClick={() => setIsMenuOpen(true)} />
            </div>

            <main className="flex-1 pb-20  pt-[50px]">
                <UserInfo id={id} />
            </main>
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
    );
}
