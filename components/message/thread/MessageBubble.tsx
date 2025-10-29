"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type Message = {
    id: string;
    from?: "me" | "them";
    text?: string;
    emojis?: string;
    time?: string;
    status?: "sent" | "delivered" | "read";
    type?: "bubble" | "typing" | "divider";
    label?: string;
};

export default function MessageBubble({ msg }: { msg: Message }) {
    const isMe = msg.from === "me";
    const content = msg.text ?? msg.emojis ?? "";
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid hydration mismatch by not rendering theme-dependent styles until mounted
    if (!mounted) {
        return (
            <div className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[78%] rounded-2xl px-4 py-3 text-[16px] leading-snug shadow-sm opacity-0">
                    <div>{content}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={[
                    "max-w-[78%] rounded-2xl px-4 py-3 text-[16px] leading-snug shadow-sm",
                    isMe
                        ? "font-medium text-white bg-gradient-to-tl from-[#F92FA2] to-[#CA2CFF] rounded-tr-none"
                        : theme === "light"
                            ? "text-[#EB3FA5] bg-[#FCE4F0] rounded-tl-none"
                            : "bg-white/10 rounded-tl-none",
                ].join(" ")}
            >
                <div>{content}</div>
                {msg.time && (
                    <div
                        className={[
                            "mt-2 text-[12px]",
                            isMe
                                ? "text-white/90 text-right"
                                : theme === "light"
                                    ? "text-[#EB3FA5]/90"
                                    : "text-white",
                        ].join(" ")}
                    >
                        {msg.time}
                        {isMe && msg.status && (
                            <span className="ml-2 align-middle">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    className="inline-block opacity-90"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M9 16.2 4.8 12l1.4-1.4L9 13.4l8.8-8.8L20.2 6z"
                                    />
                                </svg>
                                {msg.status !== "sent" && (
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        className="inline-block -ml-2 opacity-90"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M9 16.2 4.8 12l1.4-1.4L9 13.4l8.8-8.8L20.2 6z"
                                        />
                                    </svg>
                                )}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}