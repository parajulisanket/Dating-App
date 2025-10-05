"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="w-full flex justify-center">
      <main className="w-full max-w-[393px] px-5 pt-6 pb-8">
        <div className="title text-center">LOGO</div>

        <div className="relative mt-2 h-[420px] w-full overflow-hidden">
          {" "}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-full w-full flex-shrink-0 flex items-center justify-center"
              >
                {/* Bigger image; contain so it stays inside the rings nicely */}
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  width={420}
                  height={420}
                  priority={i === 0}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* HEADLINE */}
        <h1 className="mt-8 text-center text-[22px] font-semibold leading-[30px] text-[#F92FA2]">
          Find love, friendship, or
          <br />
          something in between — it’s
          <br />
          your choice.
        </h1>

        {/* DOTS */}
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "h-2 w-2 bg-pink-500" : "h-1 w-1 bg-pink-200"
              }`}
            />
          ))}
        </div>

        {/* CTAS (flush with equal side gutters via container padding) */}
        <div className="mt-7 space-y-3">
          <Link href="/signup" className="btn btn-signup">
            Sign Up
          </Link>
          <Link href="/login" className="btn btn-login">
            Log In
          </Link>
        </div>
      </main>
    </div>
  );
}
