"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PhoneViewport from "@/components/layout/PhoneViewport"; // <-- use the component

const images = ["/hero.png", "/hero.png", "/hero.png"];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % images.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <PhoneViewport
      maxWidth={425}
      className="grid bg-background grid-rows-[auto_1fr_auto] gap-4"
    >
      {/* HEADER */}
      <header className="text-center">
        <div className="title">LOGO</div>
      </header>

      {/* MIDDLE (non-scrollable) */}
      <section className="overflow-hidden">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(260px, 52svh, 560px)" }}
          >
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative h-full w-full flex-shrink-0 flex items-center justify-center"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={i === 0}
                    className="object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HEADLINE */}
          <h1
            className="mt-4 text-center font-semibold text-heading"
            style={{
              fontSize: "clamp(16px, 4.6vw, 20px)",
              lineHeight: "clamp(22px, 6.2vw, 28px)",
            }}
          >
            Find love, friendship, or
            <br />
            something in between — it’s
            <br />
            your choice.
          </h1>

          {/* DOTS */}
          <div className="mt-2 flex justify-center gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "h-2 w-2 bg-pink-500"
                    : "h-1.5 w-1.5 bg-pink-200"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="space-y-2">
        <Link href="/signup" className="btn btn-signup w-full">
          Sign Up
        </Link>
        <Link href="/login" className="btn btn-login w-full">
          Log In
        </Link>
      </footer>
    </PhoneViewport>
  );
}
