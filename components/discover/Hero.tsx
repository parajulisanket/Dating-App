"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
// import { Zap, BadgeCheck, MapPin } from "lucide-react";
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

export default function Hero() {
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
    el.style.transform = `translate3d(0,0,0) rotate(0deg)`;
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
    const dx = e.clientX - startX.current,
      dy = e.clientY - startY.current;
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

  // button actions
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
    <section className="w-full flex justify-center px-6 pb-6">
      <div className="relative w-full max-w-md rounded-[28px] overflow-hidden">
        <div className="relative w-full h-[80vh] rounded-[28px] overflow-hidden">
          {stack.map((p, i) => {
            const isTop = i === stack.length - 1;
            const depth = i - (stack.length - 2);
            return (
              <div
                key={p.id}
                ref={isTop ? cardRef : null}
                className={`absolute inset-0 rounded-[28px] overflow-hidden shadow-xl ${
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
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0  bg-gradient-to-t from-[#340046] via-transparent  to-transparent " />
                <div className="absolute top-4 left-6 right-6 flex items-center gap-2">
                  <div className="h-1 w-7 rounded-full bg-white/85" />
                  <div className="h-1 w-7 rounded-full bg-white/45" />
                  <div className="h-1 w-7 rounded-full bg-white/45" />
                </div>

                <div className="absolute top-4 right-4 bg-[#F92FA2] text-white font-medium text-sm px-2 py-1 rounded-full flex items-center gap-1 ">
                  <img src={"/icons/Sparkle.svg"} alt="" className="w-4 h-4" />
                  <span>67%</span>
                </div>

                <div className="absolute bottom-32 left-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  <h2 className="text-[28px] font-bold tracking-wide flex items-center gap-2">
                    {p.name}, {p.age}
                    <img src={"/icons/verify.svg"} alt="" className="w-8 h-8" />
                  </h2>
                  <p className="mt-1 text-sm opacity-95 flex items-center gap-1">
                    <img src={"/icons/MapPin.svg"} alt="" className="w-4 h-4" />
                    {p.distance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons stay fixed and visible for every card */}
        <SwipeButtons onUndo={onUndo} onLike={onLike} onNope={onNope} />
      </div>
    </section>
  );
}
