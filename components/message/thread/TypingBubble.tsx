"use client";

import { useTheme } from "next-themes";

export default function TypingBubble() {
    const { theme } = useTheme();
    return (
        <div
            className={[
                "mb-4 max-w-[30%] rounded-xl px-4 py-2  shadow-sm ",
                theme === "light" ? "bg-[#FCE4F0] " : "bg-white/10 text-white ",
            ].join(" ")}
        >

            <span className="inline-flex gap-1">
                {theme === "light" ? (
                    <>
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#EB3FA5]" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#FDB6DE] [animation-delay:120ms]" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#FDB6DE] [animation-delay:240ms]" />
                    </>
                ) : (
                    <>
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-white" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-white/10 [animation-delay:120ms]" />
                        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-white/10 [animation-delay:240ms]" />
                    </>
                )}
            </span>

        </div>
    );
}