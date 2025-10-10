"use client";

import Image from "next/image";
import { BadgeCheck, MoreHorizontal, MapPin } from "lucide-react";
import React from "react";

type Match = {
  id: string;
  name: string;
  age: number;
  distanceKm: number;
  image: string;
  verified?: boolean;
};

const DATA: Match[] = [
  {
    id: "1",
    name: "Shristima",
    age: 35,
    distanceKm: 0.3,
    image: "/images/Shristima.jpg",
    verified: true,
  },
  {
    id: "2",
    name: "Sital",
    age: 25,
    distanceKm: 1,
    image: "/images/Shristima.jpg",
    verified: true,
  },
  {
    id: "3",
    name: "Aishaa",
    age: 30,
    distanceKm: 9.6,
    image: "/images/Shristima.jpg",
    verified: true,
  },
  {
    id: "4",
    name: "Bikram",
    age: 21,
    distanceKm: 11,
    image: "/images/Shristima.jpg",
    verified: true,
  },
  {
    id: "5",
    name: "Maya",
    age: 31,
    distanceKm: 6.8,
    image: "/images/Shristima.jpg",
    verified: true,
  },
  {
    id: "6",
    name: "Ariana",
    age: 28,
    distanceKm: 3.2,
    image: "/images/Shristima.jpg",
    verified: true,
  },
];

export default function MatchListings() {
  return (
    <section className="px-6 pb-6 h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-2 gap-4">
        {DATA.map((m) => (
          <article
            key={m.id}
            className="relative rounded-[16px] overflow-hidden  bg-neutral-200"
          >
            {/* image section */}
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={m.image}
                alt={m.name}
                fill
                priority={true}
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 200px"
              />
            </div>

            {/* top-right menu */}
            <button
              aria-label="Card menu"
              className="absolute right-4 top-3  text-white 
                         flex items-center justify-center "
            >
              <MoreHorizontal size={20} />
            </button>

            {/* text overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="absolute inset-0  bg-gradient-to-t from-[#570074] to-transparent backdrop-blur-[2px]" />
              {/* content */}
              <div className="relative  p-2 text-white">
                <div className="flex items-center gap-1 text-[18px] font-bold leading-tight drop-shadow">
                  <span className="truncate">
                    {m.name}, {m.age}
                  </span>
                  {m.verified && (
                    <img src={"/icons/verify.svg"} alt="" className="w-4 h-4" />
                  )}
                </div>
                <div className=" flex items-center gap-1.5 text-sm font-semibold">
                  <img src={"/icons/MapPin.svg"} alt="" className="w-4 h-4" />
                  <span>{m.distanceKm} Km</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
