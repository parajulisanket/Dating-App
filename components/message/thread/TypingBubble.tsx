"use client";

export default function TypingBubble() {
    return (
        <div className="mb-4 max-w-[30%] rounded-xl bg-[#FCE4F0] px-4 py-2 text-[#EB3FA5] shadow-sm">
            <span className="inline-flex gap-1">
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#EB3FA5]" />
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#EB3FA5] [animation-delay:120ms]" />
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#EB3FA5] [animation-delay:240ms]" />
            </span>
        </div>
    );
}