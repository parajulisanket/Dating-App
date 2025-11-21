"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = ["hero.png", "hero.png", "hero.png"];

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
    <div className=" flex flex-col max-w-[425px] bg-background py-6">
      {/* HEADER */}
      <header className="text-center mb-4">
        <div className="title text-lg font-bold">LOGO</div>
      </header>

      {/* MIDDLE */}
      <section className="flex-1 overflow-hidden flex flex-col items-center justify-center gap-3">
        <div
          className="relative w-full overflow-hidden "
          style={{ height: "clamp(260px, 47svh, 560px)" }}
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
          className="text-center font-bold text-heading "
          style={{
            fontSize: "clamp(16px, 4.6vw, 24px)",
            lineHeight: "clamp(22px, 6.2vw, 36px)",
          }}
        >
          Find love, friendship, or
          <br />
          something in between — it’s
          <br />
          your choice.
        </h1>

        {/* DOTS */}
        <div className="mt-3 flex justify-center items-center gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`rounded-full transition-all duration-300 ${
                i === current ? "h-2 w-2 bg-pink-500" : "h-1 w-1 bg-pink-200"
              }`}
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <Link href="/signup" className="btn btn-signup w-full">
          Sign Up
        </Link>
        <Link href="/login" className="btn btn-login w-full">
          Log In
        </Link>
      </footer>
    </div>
  );
}
