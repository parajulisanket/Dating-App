"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import StepLayout from "@/components/layout/StepLayout";

export default function PhotosPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));

  function onPick(i: number, file: File) {
    const url = URL.createObjectURL(file);
    setPhotos((prev) => prev.map((p, idx) => (idx === i ? url : p)));
  }

  function onDone() {
    // TODO: Send photos to backend
    router.push("/home");
  }

  const skip = () => router.push("/home");

  return (
    <StepLayout
      backHref="/signup/lifestyle"
      title="Last step! add your best photos"
      rightNode={
        <button
          type="button"
          onClick={skip}
          className="text-[#F92FA2] text-base font-semibold mt-4 px-2  hover:border hover:rounded-2xl hover:bg-[#f92fa2]/10"
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
          <label
            key={i}
            className="relative aspect-[3/4] rounded-xl bg-[#FDEBFA] flex items-center justify-center cursor-pointer"
          >
            {p ? (
              <img
                src={p}
                alt="uploaded"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">
                <Plus size={28} className="text-white" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) onPick(i, e.target.files[0]);
              }}
            />
          </label>
        ))}
      </div>
    </StepLayout>
  );
}
