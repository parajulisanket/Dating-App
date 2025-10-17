"use client";

import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import SwipeButtons from "@/components/discover/SwipeButtons";

type Person = {
  id: string;
  name: string;
  age: number;
  distance: string;
  imageMobile: string;
  imageDesktop: string;
};

type SwipeResult = { id: string; direction: "left" | "right" };

const PEOPLE: Person[] = [
  {
    id: "1",
    name: "Shristima",
    age: 35,
    distance: "5.3 Km",
    imageMobile: "/images/Shristima.jpg",
    imageDesktop: "/images/Shristima.jpg",
  },
  {
    id: "2",
    name: "Ariana",
    age: 28,
    distance: "3.2 Km",
    imageMobile: "/images/Shristima.jpg",
    imageDesktop: "/images/Shristima.jpg",
  },
  {
    id: "3",
    name: "Maya",
    age: 31,
    distance: "6.8 Km",
    imageMobile: "/images/Shristima.jpg",
    imageDesktop: "/images/Shristima.jpg",
  },
];

function useHeaderFooterGaps() {
  const [gaps, setGaps] = useState({ top: 0, bottom: 0 });

  useLayoutEffect(() => {
    const read = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      const footer = document.querySelector("footer") as HTMLElement | null;
      setGaps({
        top: header?.offsetHeight ?? 0,
        bottom: footer?.offsetHeight ?? 0,
      });
    };

    const ro = new ResizeObserver(read);
    document.querySelectorAll("header, footer").forEach((el) => ro.observe(el));
    window.addEventListener("resize", read);
    read();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);

  return gaps;
}

const SWIPE_THRESHOLD = 120;
const OUT_DISTANCE = 1000;

export default function Hero() {
  const [stack, setStack] = useState<Person[]>(PEOPLE);
  const [gone, setGone] = useState<SwipeResult[]>([]);
  const [busy, setBusy] = useState(false); // for disabling buttons during fling
  const topCard = useMemo(() => stack.at(-1) ?? null, [stack]);

  // drag state/refs
  const posX = useRef(0);
  const posY = useRef(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const animating = useRef(false);
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
    el.style.transform = `translate3d(0,0,0) rotate(0deg)`;
    setTimeout(() => (el.style.transition = ""), 220);
  };

  const fling = (direction: "left" | "right") => {
    if (!topCard || animating.current) return;
    animating.current = true;
    setBusy(true); // disable buttons during animation

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
      setBusy(false);
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

  // Buttons now animate via fling (same as swipe)
  const onNope = () => fling("left");
  const onLike = () => fling("right");

  const onUndo = useCallback(() => {
    if (gone.length === 0 || animating.current) return;
    const last = gone.at(-1)!;
    const person = PEOPLE.find((p) => p.id === last.id);
    if (!person) return;
    setStack((s) => [...s, person]);
    setGone((g) => g.slice(0, -1));
  }, [gone]);

  const { top, bottom } = useHeaderFooterGaps();

  // Use dvh (or switch to svh if you prefer “small viewport height” behavior)
  const UNIT = "dvh";
  const heroHeight = `calc(100${UNIT} - ${top + bottom}px)`;

  return (
    <section
      className="fixed inset-x-0 mb-6 z-10"
      style={{ top, bottom }}
      aria-label="Discover feed"
    >
      <div className="h-full w-full flex items-center justify-center px-4">
        {/* The card container */}
        <div
          className="relative rounded-[28px] overflow-hidden select-none "
          style={{
            width: 380,
            maxWidth: "100%",
            height: heroHeight,
            touchAction: "none",
          }}
        >
          {stack.map((p, i) => {
            const isTop = i === stack.length - 1;
            const depth = i - (stack.length - 2);

            return (
              <div
                key={p.id}
                ref={isTop ? cardRef : null}
                className={`absolute inset-0 rounded-[28px] overflow-hidden ${
                  isTop ? "will-change-transform touch-none" : ""
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
                {/* Device-specific image */}
                <picture>
                  <source media="(min-width: 1024px)" srcSet={p.imageDesktop} />
                  <Image
                    src={p.imageMobile}
                    alt={p.name}
                    fill
                    priority={isTop}
                    className="object-cover"
                    sizes="393px"
                  />
                </picture>

                {/* Top HUD */}
                <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-7 rounded-full bg-white/85" />
                    <div className="h-1 w-7 rounded-full bg-white/45" />
                    <div className="h-1 w-7 rounded-full bg-white/45" />
                  </div>
                  <div className="bg-[#F92FA2] text-white font-medium text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <img
                      src={"/icons/Sparkle.svg"}
                      alt=""
                      className="w-4 h-4"
                    />
                    <span>67%</span>
                  </div>
                </div>

                {/* Name + distance */}
                <div className="absolute left-6 right-6 bottom-32 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] z-20">
                  <h2 className="text-[28px] font-bold tracking-wide flex items-center gap-2">
                    {p.name}, {p.age}
                    <img src={"/icons/verify.svg"} alt="" className="w-8 h-8" />
                  </h2>
                  <p className="mt-1 text-sm opacity-95 flex items-center gap-1">
                    <img src={"/icons/MapPin.svg"} alt="" className="w-4 h-4" />
                    {p.distance}
                  </p>
                </div>

                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#340046] via-transparent to-transparent z-0" />
              </div>
            );
          })}

          {/* Buttons — now animate via fling; disabled while busy */}
          <div
            className="absolute left-0 right-0 flex items-center justify-center z-30 pointer-events-auto"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)" }}
          >
            <SwipeButtons
              onUndo={onUndo}
              onLike={onLike}
              onNope={onNope}
              // disabled={busy}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
