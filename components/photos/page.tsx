"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { useTheme } from "next-themes";

interface PhotosPageProps {
  value: File[];
  onChange: (value: File[]) => void;
  onNext: () => void;
  setSkipDisabled?: (disabled: boolean) => void;
}

export default function PhotosPage({
  value,
  onChange,
  onNext,
  setSkipDisabled,
}: PhotosPageProps) {
  const { resolvedTheme } = useTheme();

  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));
  const [files, setFiles] = useState<(File | null)[]>(Array(6).fill(null));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const onChangeRef = useRef(onChange);
  const [mounted, setMounted] = useState(false);

  // keep latest onChange without retriggering effect
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setMounted(true);
    return () => {
      photos.forEach((p) => p?.startsWith("blob:") && URL.revokeObjectURL(p));
    };
  }, []);

  useEffect(() => {
    if (!mounted || !Array.isArray(value) || value.length === 0) return;

    photos.forEach((p) => p?.startsWith("blob:") && URL.revokeObjectURL(p));

    const nextFiles: (File | null)[] = Array(6).fill(null);
    const nextUrls: (string | null)[] = Array(6).fill(null);
    value.slice(0, 6).forEach((f, i) => {
      nextFiles[i] = f;
      nextUrls[i] = URL.createObjectURL(f);
    });
    setFiles(nextFiles);
    setPhotos(nextUrls);
  }, [value, mounted]);

  const filesKey = useMemo(
    () =>
      JSON.stringify(
        (files.filter(Boolean) as File[]).map(
          (f) => `${f.name}:${f.size}:${f.lastModified}`
        )
      ),
    [files]
  );

  useEffect(() => {
    if (!mounted) return;
    const payload = files.filter(Boolean) as File[];
    onChangeRef.current(payload);
  }, [filesKey, mounted]);

  const selectedCount = useMemo(
    () => (files.filter(Boolean) as File[]).length,
    [filesKey]
  );
  useEffect(() => {
    setSkipDisabled?.(selectedCount > 0);
    return () => setSkipDisabled?.(false);
  }, [selectedCount, setSkipDisabled]);

  function onPick(i: number, file: File) {
    const url = URL.createObjectURL(file);

    setPhotos((prev) =>
      prev.map((p, idx) => {
        if (idx === i && p?.startsWith("blob:")) URL.revokeObjectURL(p);
        return idx === i ? url : p;
      })
    );

    setFiles((prev) => {
      const next = [...prev];
      next[i] = file;

      inputRefs.current[i] && (inputRefs.current[i]!.value = "");
      return next;
    });
  }

  function onRemove(i: number) {
    setPhotos((prev) =>
      prev.map((p, idx) => {
        if (idx === i && p?.startsWith("blob:")) URL.revokeObjectURL(p);
        return idx === i ? null : p;
      })
    );

    setFiles((prev) => {
      const next = [...prev];
      next[i] = null;
      inputRefs.current[i] && (inputRefs.current[i]!.value = "");
      return next;
    });
  }

  function onDone() {
    onNext();
  }

  if (!mounted) return null;

  return (
    <>
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
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPick(i, f);
                }}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <button
          type="button"
          onClick={onDone}
          className="btn btn-signup w-full"
        >
          Done
        </button>
      </footer>
    </>
  );
}
