"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import VoiceRecorder from "@/components/message/thread/VoiceRecorder";
import { useTheme } from "next-themes";

type Props = {
    onSend: (text: string) => void;
    onSendMedia?: (files: File[]) => void;
    onSendAudio?: (blob: Blob, durationMs: number) => void;
};

export default function Composer({ onSend, onSendMedia, onSendAudio }: Props) {
    const [value, setValue] = React.useState("");
    const [focused, setFocused] = React.useState(false);
    const [recOpen, setRecOpen] = React.useState(false);
    const { theme } = useTheme()
    const [mounted, setMounted] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const micRef = React.useRef<HTMLButtonElement | null>(null);

    const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        setMounted(true)
    }, []);

    React.useEffect(() => {
        setPortalRoot(
            document.getElementById("phone-overlay-root") as HTMLElement | null
        );
    }, []);

    const active = focused || value.trim().length > 0;

    const sendText = () => {
        const t = value.trim();
        if (!t) return;
        onSend(t);
        setValue("");
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
        }
    };

    const openGallery = () => fileInputRef.current?.click();
    const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length && onSendMedia) onSendMedia(files);
        // allow re-selecting the same file later
        e.target.value = "";
    };

    if (!mounted) {
        return
    }

    return (
        <div className=" bg-background sticky bottom-0 px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] shadow">
            {/* Hidden picker for images/videos */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={onPickFiles}
            />

            <div className="flex items-center gap-2">
                <div
                    className={[
                        "flex min-w-0 flex-1 items-center rounded-4xl ",
                        theme === "light" ? "bg-neutral-200" : "bg-white/20",
                    ].join(" ")}
                >

                    <button className="text-[#EB3FA5] p-2" aria-label="Emoji">
                        <img src={"/icons/SmileySticker.svg"} alt="" />
                    </button>

                    <Textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={onKeyDown}
                        rows={1}
                        placeholder="Message"
                        className="min-h-10 resize-none w-[240px] px-2 no-scrollbar  bg-transparent py-3 text-sm leading-5 focus:outline-none focus-visible:ring-0 placeholder:font-semibold"
                    />

                    <button
                        onClick={openGallery}
                        className="text-[#EB3FA5] p-2"
                        aria-label={active ? "Media" : "Attach"}
                    >
                        {active ? (
                            <img src={"/icons/ImagesSquare.svg"} alt="Media" />
                        ) : (
                            <img src={"/icons/Paperclip.svg"} alt="Attach" />
                        )}
                    </button>
                </div>

                {active ? (
                    <button
                        onClick={sendText}
                        className="h-[52px] w-[52px] flex justify-center items-center  rounded-full bg-gradient-to-tl from-[#F92FA2] to-[#CA2CFF] p-0 text-white hover:opacity-90"
                        aria-label="Send"
                    >
                        <img src={"/icons/PaperPlaneTilt.svg"} alt="Send" />
                    </button>
                ) : (
                    <button
                        ref={micRef}
                        onClick={() => {
                            if (portalRoot) setRecOpen(true);
                        }}
                        className="h-[52px] w-[52px] flex justify-center items-center rounded-full bg-gradient-to-tl from-[#F92FA2] to-[#CA2CFF] p-0 text-white hover:opacity-90"
                        aria-label="Voice"
                    >
                        <img src={"/icons/Microphone.svg"} alt="Voice" />
                    </button>
                )}
            </div>

            {portalRoot && (
                <VoiceRecorder
                    open={recOpen}
                    anchorEl={micRef.current}
                    portalRoot={portalRoot}
                    onClose={() => setRecOpen(false)}
                    onSend={(blob, ms) => {
                        onSendAudio?.(blob, ms);
                        setRecOpen(false);
                    }}
                />
            )}
        </div>
    );
}