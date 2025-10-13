"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import SwipeButtons from "@/components/discover/SwipeButtons";

type Person = {
  id: string;
  name: string;
  age: number;
  distance: string;
  image: string;
};
type SwipeResult = { id: string; direction: "left" | "right" };

const PEOPLE_SEED: Person[] = [
  {
    id: "1",
    name: "Shristima",
    age: 35,
    distance: "5.3 Km",
    image: "/images/Shristima.jpg",
  },
  {
    id: "2",
    name: "Ariana",
    age: 28,
    distance: "3.2 Km",
    image: "/images/Shristima.jpg",
  },
  {
    id: "3",
    name: "Maya",
    age: 31,
    distance: "6.8 Km",
    image: "/images/Shristima.jpg",
  },
];

const SWIPE_THRESHOLD = 120;
const OUT_DISTANCE = 1000;

/** Measure existing header/footer without changing them */
function useLayoutVars({
  headerSel = "header",
  footerSel = "footer",
}: { headerSel?: string; footerSel?: string } = {}) {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(headerSel);
    const footer = document.querySelector<HTMLElement>(footerSel);

    const apply = () => {
      root.style.setProperty("--hdr", `${header?.offsetHeight ?? 0}px`);
      root.style.setProperty("--ftr", `${footer?.offsetHeight ?? 0}px`);
    };
    apply();

    const ro = new ResizeObserver(apply);
    header && ro.observe(header);
    footer && ro.observe(footer);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [headerSel, footerSel]);
}

export default function Hero() {
  useLayoutVars();

  const [stack, setStack] = useState<Person[]>(PEOPLE_SEED);
  const [gone, setGone] = useState<SwipeResult[]>([]);
  const topCard = useMemo(() => stack.at(-1) ?? null, [stack]);

  const posX = useRef(0),
    posY = useRef(0);
  const startX = useRef(0),
    startY = useRef(0);
  const dragging = useRef(false),
    animating = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const setStyle = (
    el: HTMLElement | null,
    x: number,
    y: number,
    rotate?: number
  ) => {
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${
      rotate ?? x / 15
    }deg)`;
  };
  const resetStyle = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.transition = "transform 220ms ease";
    el.style.transform = "translate3d(0,0,0) rotate(0deg)";
    setTimeout(() => (el.style.transition = ""), 220);
  };

  const fling = (direction: "left" | "right") => {
    if (!topCard || animating.current) return;
    animating.current = true;
    const el = cardRef.current;
    const x = direction === "right" ? OUT_DISTANCE : -OUT_DISTANCE;
    if (el) {
      el.style.transition = "transform 240ms ease-out";
      el.style.transform = `translate3d(${x}px, ${posY.current}px, 0) rotate(${
        x / 15
      }deg)`;
    }
    setTimeout(() => {
      setGone((g) => [...g, { id: topCard.id, direction }]);
      setStack((s) => s.slice(0, -1));
      posX.current = 0;
      posY.current = 0;
      animating.current = false;
    }, 240);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!topCard || animating.current) return;
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startX.current = e.clientX;
    startY.current = e.clientY;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !topCard) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    posX.current = dx;
    posY.current = dy;
    setStyle(cardRef.current, dx, dy);
  };
  const handlePointerUp = () => {
    if (!topCard) return;
    dragging.current = false;
    Math.abs(posX.current) > SWIPE_THRESHOLD
      ? fling(posX.current > 0 ? "right" : "left")
      : ((posX.current = 0), (posY.current = 0), resetStyle(cardRef.current));
  };

  const onUndo = useCallback(() => {
    if (gone.length === 0 || animating.current) return;
    const last = gone.at(-1)!;
    const person = PEOPLE_SEED.find((p) => p.id === last.id);
    if (!person) return;
    setStack((s) => [...s, person]);
    setGone((g) => g.slice(0, -1));
  }, [gone]);

  const onNope = () => fling("left");
  const onLike = () => fling("right");

  return (
    <section
      className="discover-host flex justify-center items-stretch px-6 pb-6"
      style={{
        height:
          "calc(100svh - var(--hdr,0px) - var(--ftr,0px) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px))",
      }}
    >
      {/* removed max-w-[393px] so mobile card can grow taller */}
      <div className="w-full md:max-w-[480px] flex">
        {/* Make the card fill the gap with equal (tiny) margins */}
        <div
          className="relative w-full rounded-[28px] overflow-hidden mx-auto"
          style={{
            height: "calc(100% - (var(--m,8px) * 2))",
            marginTop: "var(--m,8px)",
            marginBottom: "var(--m,8px)",
          }}
        >
          {/* STACK */}
          <div className="absolute inset-0">
            {stack.map((p, i) => {
              const isTop = i === stack.length - 1;
              const depth = i - (stack.length - 2);
              return (
                <div
                  key={p.id}
                  ref={isTop ? cardRef : null}
                  className={`absolute inset-0 rounded-[28px] overflow-hidden ${
                    isTop ? "touch-none select-none" : ""
                  }`}
                  style={{
                    transform: isTop
                      ? undefined
                      : `scale(${0.985 + depth * 0.01}) translateY(${
                          Math.abs(depth) * 12
                        }px)`,
                    opacity: isTop ? 1 : 0.9,
                    zIndex: i,
                  }}
                  onPointerDown={isTop ? handlePointerDown : undefined}
                  onPointerMove={isTop ? handlePointerMove : undefined}
                  onPointerUp={isTop ? handlePointerUp : undefined}
                >
                  {/* Fill the frame */}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    priority
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 480px, 560px"
                    className="object-cover object-center"
                  />

                  {/* Top progress bars */}
                  <div className="absolute top-4 left-6 right-6 flex items-center gap-2">
                    <div className="h-1 w-7 rounded-full bg-white/85" />
                    <div className="h-1 w-7 rounded-full bg-white/45" />
                    <div className="h-1 w-7 rounded-full bg-white/45" />
                  </div>

                  {/* 67% badge */}
                  <div className="absolute top-4 right-4 bg-[#F92FA2] text-white font-medium text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <img
                      src={"/icons/Sparkle.svg"}
                      alt=""
                      className="w-4 h-4"
                    />
                    <span>67%</span>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#340046] via-[#340046]/30 to-transparent" />

                  {/* Name + distance */}
                  <div className="absolute bottom-24 sm:bottom-28 left-6 right-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    <h2 className="text-[26px] sm:text-[28px] md:text-[32px] font-bold tracking-wide flex items-center gap-2">
                      {p.name}, {p.age}
                      <img
                        src={"/icons/verify.svg"}
                        alt=""
                        className="w-7 h-7 sm:w-8 sm:h-8"
                      />
                    </h2>
                    <p className="mt-1 text-sm md:text-[15px] opacity-95 flex items-center gap-1">
                      <img
                        src={"/icons/MapPin.svg"}
                        alt=""
                        className="w-4 h-4"
                      />
                      {p.distance}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Buttons */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4 sm:pb-6 z-10">
              <div className="pointer-events-auto">
                <SwipeButtons onUndo={onUndo} onLike={onLike} onNope={onNope} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* minimal, mobile-first margins; no stray diff markers */}
      <style jsx>{`
        .discover-host {
          --m: 0px;
        } /* no extra gap on phones */
        @media (max-height: 640px) {
          .discover-host {
            --m: 0px;
          }
        }
        @media (min-height: 900px) {
          .discover-host {
            --m: 10px;
          }
        }
        @supports (height: 100dvh) {
          .discover-host {
            height: calc(
              100dvh - var(--hdr, 0px) - var(--ftr, 0px) -
                env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)
            );
          }
        }
      `}</style>
    </section>
  );
}
