"use client";

import * as React from "react";
import { Plus } from "lucide-react";

export default function ActiveMessage() {
  const users = [
    {
      id: 1,
      name: "Jada Banks",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300",
      online: true,
    },
    {
      id: 2,
      name: "Ava Moore",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
      online: true,
    },
    {
      id: 3,
      name: "Maya Carter",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300",
      online: true,
    },
    {
      id: 4,
      name: "Zoey Hill",
      avatar:
        "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=300",
      online: true,
    },
    {
      id: 5,
      name: "Lena Ortiz",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=300",
      online: true,
    },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar select-none ">
      <div className="flex items-center gap-4 px-6">
        {/* Add / New message button */}
        <div
          className="relative shrink-0 grid place-items-center size-14 rounded-full
                     bg-gradient-to-tl from-[#F92FA2] to-[#CA2CFF]
                     border-1 border-[#f6bdef] border-border-400"
        >
          <Plus size={36} strokeWidth={2} color="white" />
        </div>

        {/* Avatars */}
        {users.map((u) => (
          <div
            key={u.id}
            title={u.name}
            className="relative shrink-0 size-16 rounded-full  border-2 border-[#F92FA2]"
          >
            <span className="absolute inset-[2px] rounded-full overflow-hidden">
              <img
                src={u.avatar}
                alt={u.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </span>

            {/* Online dot */}
          </div>
        ))}
      </div>
    </div>
  );
}
