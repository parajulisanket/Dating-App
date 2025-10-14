"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
    open: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement | null;
    portalRoot?: HTMLElement | null;
    children: React.ReactNode;
};

export default function BottomSheet({
    open,
    onClose,
    anchorEl,
    portalRoot,
    children,
}: BottomSheetProps) {
    const [entered, setEntered] = React.useState(false);
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 });

    // lock scroll while open
    React.useEffect(() => {
        if (!open) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, [open]);

    // compute transform origin from anchor center
    React.useLayoutEffect(() => {
        if (!open || !anchorEl) return;
        const r = anchorEl.getBoundingClientRect();
        setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        const t = setTimeout(() => setEntered(true), 10);
        return () => {
            clearTimeout(t);
            setEntered(false);
        };
    }, [open, anchorEl]);

    if (!open || !portalRoot) return null;

    const sheet = (
        <div className="absolute inset-0 z-[70] pointer-events-none">
            {/* Backdrop: 40% opacity, NO blur */}
            <div
                className={`absolute inset-0 pointer-events-auto bg-black/40 transition-opacity ${entered ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Bottom sheet  */}
            <div
                className="absolute inset-x-0 bottom-0  pointer-events-none"
                style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
            >
                <div
                    className={`pointer-events-auto rounded-t-4xl bg-white p-3 shadow-[0_-10px_28px_rgba(0,0,0,0.18)] ring-1 ring-black/5
                      transition-transform duration-200
                      ${entered
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-0 translate-y-6"
                        }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(sheet, portalRoot);
}