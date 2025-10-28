"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import StepLayout from "@/components/layout/StepLayout";
import { useTheme } from "next-themes";

export default function PhotosPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  })
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
    // TODO: Send photos to backend
    router.push("/home");
  }
  const { theme } = useTheme();

  const skip = () => router.push("/home");

  if (!mounted) return;

  return (
    <StepLayout
      backHref="/signup/lifestyle"
      title="Last step! add your best photos"
      rightNode={
        <button
          type="button"
          onClick={skip}
          className="text-heading text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
        >
          Skip
        </button>
      }
      footer={
        <button type="button" onClick={onDone} className="btn btn-signup">
          Done
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {photos.map((p, i) => (
          <div
            key={i}
            className={`relative aspect-[3/4] rounded-xl ${theme === "light" ? "bg-primary-500/10" : "bg-white/10"
              } flex items-center justify-center overflow-hidden`}
          >
            {p ? (
              <>
                <img
                  src={p}
                  alt="uploaded"
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(i);
                  }}
                  className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full flex items-center justify-center  gradient-border"
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
                className="h-15 w-15 rounded-full flex items-center justify-center  gradient-border"
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
    </StepLayout>
  );
}
