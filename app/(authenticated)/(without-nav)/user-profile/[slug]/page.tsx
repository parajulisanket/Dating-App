"use client";
import { Header } from "@/components/UserProfile/Header";
import { UserInfo } from "@/components/UserProfile/UserInfo";
import { useState } from "react";
import { BottomSheetMenu } from "@/components/UserProfile/BottomSheet";
import { div } from "framer-motion/client";

type UserPageProps = {
  params: {
    id: string;
  };
};

export default function UserPage({ params }: UserPageProps) {
  const { id } = params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="max-md:min-h-screen max-h-[897.22px] flex flex-col relative ">
      <div className="sticky top-0 rounded-t-4xl bg-background z-40">
        <Header setIsMenuOpen={setIsMenuOpen} />
      </div>
      <main className="flex-1">
        <UserInfo id={id} />
      </main>

      {/* Bottom Sheet Portal */}
      {isMenuOpen && (
        <div className="absolute bottom-0 w-full z-50">
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed bg-black/40 -z-40 inset-0"
          ></div>
          <div onClick={(e) => e.stopPropagation()} className="">
            <BottomSheetMenu
              id={id}
              onClose={() => setIsMenuOpen(false)}
              userName="Shreya"
              userAge={24}
              userImage="/profile1.jpg"
              isVerified={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
