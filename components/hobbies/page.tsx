"use client";

import { useState, useEffect, useRef, useMemo, FormEvent } from "react";
import NextButton from "@/components/ui/NextButton";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

interface Hobby {
  id: number;
  name: string;
  emoji?: string;
}

interface HobbiesPageProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  setSkipDisabled?: (disabled: boolean) => void;
}

function arraysEqualStr(a: string[], b: string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function arraysEqualNum(a: number[], b: number[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export default function HobbiesPage({
  value,
  onChange,
  onNext,
  setSkipDisabled,
}: HobbiesPageProps) {
  const { resolvedTheme } = useTheme();
  const { authTokens } = useAuth();

  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  // Keep a stable ref to onChange
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    async function fetchWith(prefix: "Bearer" | "JWT") {
      if (!authTokens?.access) throw new Error("No auth token");
      const res = await apiPublic.get("/user/hobbies/", {
        headers: { Authorization: `${prefix} ${authTokens.access}` },
      });
      return res.data as Hobby[];
    }

    (async () => {
      try {
        const data = await fetchWith("Bearer");
        if (!cancelled) setAllHobbies(data);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          try {
            const data = await fetchWith("JWT");
            if (!cancelled) setAllHobbies(data);
          } catch (e2) {
            console.error("Failed to fetch hobbies (JWT):", e2);
          }
        } else {
          console.error("Failed to fetch hobbies (Bearer):", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authTokens?.access]);

  useEffect(() => setMounted(true), []);

  // Sync selectedIds from incoming names
  useEffect(() => {
    if (!mounted) return;
    if (!Array.isArray(value) || allHobbies.length === 0) return;

    const idsFromNames = value
      .map((nm) => allHobbies.find((h) => h.name === nm)?.id)
      .filter((x): x is number => Number.isInteger(x));

    setSelectedIds((prev) =>
      arraysEqualNum(prev, idsFromNames) ? prev : idsFromNames
    );
  }, [value, allHobbies, mounted]);

  // Mirror selectedIds -> names up to parent (without loops)
  const selectedIdsJson = useMemo(
    () => JSON.stringify(selectedIds),
    [selectedIds]
  );
  useEffect(() => {
    if (!mounted) return;

    const names = selectedIds
      .map((id) => allHobbies.find((h) => h.id === id)?.name)
      .filter((s): s is string => Boolean(s));

    if (!arraysEqualStr(names, value)) {
      onChangeRef.current(names);
    }
  }, [selectedIdsJson, mounted, allHobbies, value]);

  // Control Skip based on selection count
  useEffect(() => {
    const hasAny = selectedIds.length > 0;
    setSkipDisabled?.(hasAny);
    return () => setSkipDisabled?.(false);
  }, [selectedIds, setSkipDisabled]);

  const isValid = selectedIds.length > 0;

  function toggleHobby(id: number) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((k) => k !== id); // unselect
      if (prev.length >= 6) return prev; // cap at 6
      return [...prev, id]; // select
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  if (!mounted) return null;

  return (
    <>
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          What are your hobbies?
        </h1>
        <p
          className={`mt-2 text-[16px] leading-6 ${
            resolvedTheme === "light" ? "text-neutral-700" : "text-neutral-500"
          }`}
        >
          Select <span className="font-semibold">up to 6 hobbies</span> to let
          everyone know you better.
        </p>

        <form
          id="hobbies-form"
          onSubmit={onSubmit}
          className="mt-8 grid grid-cols-3 gap-2"
        >
          {allHobbies.map((h) => {
            const active = selectedIds.includes(h.id);
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => toggleHobby(h.id)}
                aria-pressed={active}
                className={[
                  "h-10 rounded-full border flex items-center justify-center gap-2 text-sm tracking-wide transition-colors",
                  active
                    ? resolvedTheme === "light"
                      ? "bg-pink-100 text-pink-600 border-pink-400"
                      : "bg-white/30 border-white text-white"
                    : resolvedTheme === "light"
                    ? "border-neutral-300 text-neutral-1000"
                    : "border-white/30 text-white",
                ].join(" ")}
              >
                <span>{h.emoji ?? ""}</span>
                <span>{h.name}</span>
              </button>
            );
          })}
        </form>
      </main>

      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <NextButton disabled={!isValid} form="hobbies-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </>
  );
}
