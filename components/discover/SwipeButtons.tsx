"use client";

type Props = {
  onUndo: () => void;
  onLike: () => void;
  onNope: () => void;
};

export default function SwipeButtons({ onUndo, onLike, onNope }: Props) {
  return (
    <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-8 z-20">
      <button
        onClick={onUndo}
        className="w-14 h-14 rounded-full grid place-items-center text-white shadow-md active:scale-95 transition
                   ring-2 ring-[#fff1c2] bg-gradient-to-b from-[#FFBC1F] to-[#FFCC00]"
        aria-label="Undo"
      >
        <img src={"/icons/ArrowCounterClockwise.svg"} alt="" />
      </button>

      <button
        onClick={onLike}
        className="w-16 h-16 rounded-full grid place-items-center text-white shadow-xl active:scale-95 transition
                   ring-2 ring-[#facbee] bg-gradient-to-b from-[#F92FA2] to-[#CA2CFF]"
        aria-label="Like"
      >
        <img src={"/icons/Heart.svg"} alt="" />
      </button>

      <button
        onClick={onNope}
        className="w-14 h-14 rounded-full grid place-items-center text-white shadow-md active:scale-95 transition
                   ring-2 ring-[#ffbe95] bg-gradient-to-b from-[#FF8D28] to-[#FF7A28]"
        aria-label="Nope"
      >
        <img src={"/icons/X.svg"} alt="" />
      </button>
    </div>
  );
}
