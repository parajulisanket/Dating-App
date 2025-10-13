"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ThreadHeader({
  slug,
  name, // ← new prop
  avatar = "/images/Shristima.jpg",
  online = true,
}: {
  slug: string;
  name?: string;
  avatar?: string;
  online?: boolean;
}) {
  const router = useRouter();
  const displayName = name ?? decodeURIComponent(slug);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <img src={"/icons/CaretLeft.svg"} alt="" />
        </button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <div className="text-[20px] font-bold text-[#111827] capitalize">
            {displayName}
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <span
              className={`h-2 w-2 rounded-full ${
                online ? "bg-[#22C55E]" : "bg-gray-300"
              }`}
            />
            <span className={online ? "text-[#10B981]" : "text-gray-400"}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 text-[#EB3FA5]">
          <img src={"/icons/phone.svg"} alt="" />
          <img src={"/icons/VideoCamera.svg"} alt="" />
          <img src={"/icons/DotsThree.svg"} alt="" />
        </div>
      </div>
    </header>
  );
}
