"use client";

import Image from "next/image";

type MatchPageProps = {
  myPhoto: string;
  otherPhoto: string;
  otherName: string;
  onSayHi: () => void;

  onMaybeLater: () => void;
};

export default function MatchPage({
  myPhoto,
  otherPhoto,
  otherName,
  onSayHi,
  onMaybeLater,
}: MatchPageProps) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-[40px] bg-white pt-10 pb-10 px-6 overflow-hidden text-center">
        {/* Big soft heart / glow background */}
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,#ff7ac6,#ff9fd9_45%,#ffd9f0_75%,#ffeaf7)] opacity-90" />

        {/* Top cards + hearts */}
        <div className="relative z-10 flex mt-2 mb-8 justify-center">
          {/* Your card */}
          <div className="-mr-4 h-48 w-32 -rotate-12 overflow-hidden rounded-[26px] shadow-2xl">
            <Image
              src={myPhoto}
              alt="You"
              width={256}
              height={384}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Their card */}
          <div className="ml-4 h-48 w-32 rotate-12 overflow-hidden rounded-[26px] shadow-2xl">
            <Image
              src={otherPhoto}
              alt={otherName}
              width={256}
              height={384}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating hearts */}
          <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-4 flex flex-col items-center gap-1">
            <Heart className="h-6 w-6 fill-pink-500" />
            <Heart className="h-4 w-4 fill-pink-400 translate-x-3" />
            <Heart className="h-3 w-3 fill-pink-300 -translate-x-3" />
          </div>
        </div>

        {/* Text / title */}
        <div className="relative z-10 mb-6">
          <h1 className="text-3xl font-extrabold text-pink-600 mb-1">
            Bingo!!
          </h1>
          <p className="text-sm font-medium text-pink-500">
            You and {otherName} liked
            <br />
            eachother.
          </p>
        </div>

        {/* Buttons */}
        <div className="relative z-10 flex flex-col gap-3">
          <button onClick={onSayHi} className="btn btn-signup tracking-wide">
            Say Hi
          </button>

          <button
            onClick={onMaybeLater}
            className="btn btn-login tracking-wide"
          >
            May be Later
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tiny heart SVG used above */
function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 21s-5.3-3.1-8.1-6C1.9 12.9 1 11.4 1 9.7 1 7 3 5 5.5 5 7.1 5 8.6 5.9 9.3 7.3 10 5.9 11.5 5 13.1 5 15.6 5 17.6 7 17.6 9.7c0 1.7-.9 3.2-2.9 5.3C17.3 17.9 12 21 12 21z" />
    </svg>
  );
}
