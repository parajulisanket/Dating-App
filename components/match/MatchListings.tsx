"use client";
import { Portal } from "@/components/ui/Portal";
import Image from "next/image";
import React from "react";
import { MoreHorizontal } from "lucide-react";

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
  {
    id: "7",
    name: "Ariana",
    age: 28,
    distanceKm: 3.2,
    image: "/images/Shristima.jpg",
    verified: true,
  },
];

export default function MatchListings() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Match | null>(null);

  const openSheet = (m: Match) => {
    setSelected(m);
    setOpen(true);
  };
  const closeSheet = () => setOpen(false);

  // Close on ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto"; // cleanup on unmount
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        className="no-scrollbar scroll-smooth  pt-4 pb-14 h-[calc(100svh-116px)] md:max-h-[776.54px] "
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          overflowY: "auto",
        }}
      >
        <section className="px-4">
          <div className="grid grid-cols-2 gap-4">
            {DATA.map((m) => (
              <article
                key={m.id}
                className="relative overflow-hidden rounded-[16px] bg-neutral-200"
              >
                {/* image */}
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
                  onClick={() => openSheet(m)}
                  className="absolute right-4 top-3 flex items-center justify-center text-white"
                >
                  <MoreHorizontal size={20} />
                </button>

                {/* text overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#570074] to-transparent " />
                  <div className="relative p-2 text-white">
                    <div className="flex items-center gap-1 text-[18px] font-bold leading-tight drop-shadow">
                      <span className="truncate">
                        {m.name}, {m.age}
                      </span>
                      {m.verified && (
                        <img
                          src={"/icons/verify.svg"}
                          alt=""
                          className="w-4 h-4"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <img
                        src={"/icons/MapPin.svg"}
                        alt=""
                        className="w-4 h-4"
                      />
                      <span>{m.distanceKm} Km</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Sheet */}
      {open && selected && (
        <div
          className="absolute inset-0 z-[1000]  bg-black/50"
          onClick={closeSheet}
        >
          {/* Sheet panel */}
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[425px]">
            <div className="rounded-t-3xl bg-background p-4 shadow-xl">
              {/* Pink profile card */}
              <div className="rounded-2xl border border-[#F92FA233] dark:bg-white/10 dark:border-white/10 bg-[#FEE9F5] p-3">
                <div className="flex items-center gap-3">
                  {/* avatar */}
                  <div className="h-10 w-10 overflow-hidden rounded-full shrink-0">
                    <Image
                      src={selected.image}
                      alt={`${selected.name} avatar`}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-cover"
                    />
                  </div>

                  {/* text block */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[20px] font-extrabold leading-none text-heading">
                        {selected.name}, {selected.age}
                      </span>
                      {selected.verified && (
                        <img
                          src="/icons/verify.svg"
                          alt="Verified"
                          className="h-5 w-5"
                        />
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-heading">
                      <img
                        src="/icons/location.svg"
                        alt=""
                        className="h-4 w-4 dark:filter dark:invert dark:brightness-0"
                      />
                      <span className="text-sm font-semibold">
                        {selected.distanceKm}km
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-1">
                <button
                  className="flex w-full items-center gap-2 py-3 text-left font-bold text-neutral-1000 "
                  onClick={() => {
                    closeSheet();
                  }}
                >
                  <img src={"/icons/XCircle.svg"} alt="" className="w-7 h-7" />
                  Unmatch
                </button>

                <button
                  className="flex w-full items-center gap-2 py-3 text-left font-bold text-neutral-1000 "
                  onClick={() => {
                    closeSheet();
                  }}
                >
                  <img
                    src={"/icons/ChatCircleDots Stroke.svg"}
                    alt=""
                    className="w-7 h-7"
                  />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
