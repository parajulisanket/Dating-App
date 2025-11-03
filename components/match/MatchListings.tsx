"use client";
import { Portal } from "@/components/ui/Portal";
import Image from "next/image";
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  {
    id: "8",
    name: "Ariana",
    age: 28,
    distanceKm: 3.2,
    image: "/images/Shristima.jpg",
    verified: true,
  },
];

const HEADER_H = 48;
const FOOTER_H = 68;
const containerHeight = `calc(100dvh - ${HEADER_H + FOOTER_H}px)`;

// Reusable animation variants
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
};

export const scaleVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

export const buttonHoverVariants = {
  initial: { scale: 1, backgroundColor: "transparent" },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export default function MatchListings() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Match | null>(null);

  const openSheet = (m: Match) => {
    setSelected(m);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
  };

  // Close on ESC
  React.useEffect(() => {
    if (open) {
      // Disable background scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "auto";
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto"; // cleanup on unmount
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section
      className="no-scrollbar max-md:h-100dvh  scroll-smooth py-4 max-h-[calc(100dvh-146px)] md:max-h-[840.22px] relative"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        overflowY: "scroll",
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For IE and Edge
      }}
    >
      <div>
        <section className="px-4 pb-[77px]">
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
                <motion.button
                  aria-label="Card menu"
                  onClick={() => openSheet(m)}
                  className="absolute right-4 top-3 flex items-center justify-center text-white"
                  variants={scaleVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ duration: 0.2 }}
                >
                  <MoreHorizontal size={20} />
                </motion.button>

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

      <AnimatePresence>
        {open && selected && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onClick={closeSheet}
            ></motion.div>
            <div className=" w-full fixed md:sticky  inset-x-0 bottom-0  z-200">
              <motion.div
                className="absolute "
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              />

              {/* Sheet panel */}
              <motion.div
                className=" mx-auto w-full max-w-[425px] z-200 "
                onClick={(e) => e.stopPropagation()}
                variants={slideUpVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="rounded-t-[32px] bg-background p-4 shadow-xl z-200 ">
                  <div className="mb-3 flex items-center justify-center"></div>

                  {/* Pink profile card */}
                  <div className="rounded-2xl border border-[#F92FA233] dark:bg-white/10 dark:border-white/10 bg-[#FEE9F5] p-3 ">
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
                    <motion.button
                      className="flex w-full items-center gap-2 py-3 text-left font-bold text-neutral-1000 rounded-lg px-2"
                      onClick={() => {
                        closeSheet();
                      }}
                      variants={buttonHoverVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={"/icons/XCircle.svg"}
                        alt=""
                        className="w-7 h-7"
                      />
                      Unmatch
                    </motion.button>

                    <motion.button
                      className="flex w-full items-center gap-2 py-3 text-left font-bold text-neutral-1000 rounded-lg px-2"
                      onClick={() => {
                        closeSheet();
                      }}
                      variants={buttonHoverVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={"/icons/ChatCircleDots Stroke.svg"}
                        alt=""
                        className="w-7 h-7"
                      />
                      Message
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
