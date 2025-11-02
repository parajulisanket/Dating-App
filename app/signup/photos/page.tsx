"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

export default function PhotosPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // optional cleanup on unmount: revoke any blob URLs
    return () => {
      photos.forEach((p) => {
        if (p && p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPick(i: number, file: File) {
    const url = URL.createObjectURL(file);
    setPhotos((prev) =>
      prev.map((p, idx) => {
        if (idx === i && p && p.startsWith("blob:")) {
          URL.revokeObjectURL(p);
        }
        return idx === i ? url : p;
      })
    );
  }

  function onRemove(i: number) {
    setPhotos((prev) =>
      prev.map((p, idx) => {
        if (idx === i) {
          if (p && p.startsWith("blob:")) URL.revokeObjectURL(p);
          return null;
        }
        return p;
      })
    );
  }

  function onDone() {
    // TODO: send photos to backend
    router.push("/home");
  }

  const skip = () => router.push("/home");

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          onClick={() => router.push("/signup/lifestyle")}
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={skip}
          className="text-heading text-base font-semibold hover:bg-[#f92fa2]/10 rounded-xl px-3 py-1 transition-colors"
        >
          Skip
        </button>
      </header>

      {/* CONTENT */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          Last step! add your best photos
        </h1>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {photos.map((p, i) => (
            <div
              key={i}
              className={`relative aspect-[3/4] rounded-xl ${
                resolvedTheme === "light" ? "bg-primary-500/10" : "bg-white/10"
              } flex items-center justify-center overflow-hidden`}
            >
              {p ? (
                <>
                  <img
                    src={p}
                    alt={`uploaded ${i + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    aria-label={`Remove photo ${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(i);
                    }}
                    className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full flex items-center justify-center gradient-border"
                  >
                    <X size={23} className="text-white" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRefs.current[i]?.click();
                  }}
                  className="h-15 w-15 rounded-full flex items-center justify-center gradient-border"
                  aria-label={`Add photo ${i + 1}`}
                >
                  <Plus size={28} className="text-white" />
                </button>
              )}

              <input
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) onPick(i, e.target.files[0]);
                }}
              />
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <button
          type="button"
          onClick={onDone}
          className="btn btn-signup w-full"
        >
          Done
        </button>
      </footer>
    </div>
  );
}
