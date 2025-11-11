"use client";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

// types
interface Hobby {
  id: number;
  name: string;
  key?: string;
}
interface ProfileLike {
  profile?: any;
  data?: any;
}

// utlits
const MAX_HOBBIES = 6;
const isObj = (x: any) => x && typeof x === "object";
function deepFindFirst(obj: any, keyRx: RegExp): any {
  const seen = new Set<any>(),
    stack = [obj];
  while (stack.length) {
    const cur = stack.pop();
    if (!isObj(cur) || seen.has(cur)) continue;
    seen.add(cur);
    for (const [k, v] of Object.entries(cur)) {
      if (keyRx.test(k)) return v;
      if (isObj(v)) stack.push(v);
    }
  }
  return undefined;
}
const toStr = (x: any) =>
  x == null
    ? ""
    : typeof x === "string"
    ? x
    : typeof x === "number" || typeof x === "boolean"
    ? String(x)
    : "";

/* Component */
export const EditHobbies = ({ backHref = "/edit-profile" }) => {
  const { resolvedTheme } = useTheme();
  const { authTokens, authReady } = useAuth();

  const [options, setOptions] = useState<Hobby[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedKeysFallback, setSelectedKeysFallback] = useState<string[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- Load options and user's current hobbies ---- */
  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;

    async function get<T = any>(url: string, prefix: "Bearer" | "JWT") {
      const res = await apiPublic.get<T>(url, {
        headers: { Authorization: `${prefix} ${authTokens?.access || ""}` },
      });
      return res.data;
    }

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        // All hobby options
        let hPayload: any;
        try {
          hPayload = await get("/user/hobbies/", "Bearer");
        } catch (e: any) {
          if (e?.response?.status === 401)
            hPayload = await get("/user/hobbies/", "JWT");
          else throw e;
        }
        if (cancelled) return;

        const opts: Hobby[] = (Array.isArray(hPayload) ? hPayload : [])
          .map((h: any) => ({
            id: Number(h?.id ?? h?.pk),
            name:
              toStr(h?.name ?? h?.label ?? h?.title) || `Hobby #${h?.id ?? ""}`,
            key:
              toStr(h?.key ?? h?.slug ?? "")
                .toLowerCase()
                .replace(/\s+/g, "-") || undefined,
          }))
          .filter((h) => Number.isFinite(h.id) && h.id > 0);

        setOptions(opts);

        // Current user selection from profile
        let profile: ProfileLike;
        try {
          profile = await get("/user/profile-detail/", "Bearer");
        } catch (e: any) {
          if (e?.response?.status === 401)
            profile = await get("/user/profile-detail/", "JWT");
          else throw e;
        }
        if (cancelled) return;

        const root =
          profile?.profile ?? profile?.data ?? (profile as any) ?? {};
        const node = deepFindFirst(root, /(hobby|hobbies|interests)/i);

        const ids: number[] = [];
        const keys: string[] = [];

        if (Array.isArray(node)) {
          node.forEach((it: any) => {
            const id = Number(it?.id ?? it?.pk);
            if (Number.isFinite(id) && id > 0) ids.push(id);
            let k = toStr(it?.key ?? it?.slug ?? it?.name);
            if (!k && typeof it === "string") k = it;
            if (k) keys.push(k.toLowerCase().replace(/\s+/g, "-"));
          });
        } else if (typeof node === "string") {
          keys.push(node.toLowerCase().replace(/\s+/g, "-"));
        }

        setSelectedIds(ids);
        setSelectedKeysFallback(keys);
      } catch (err: any) {
        setError(err?.message || "Failed to load hobbies");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, authTokens?.access]);

  /* ---- Compute selected for rendering (prefer ids; fallback to keys) ---- */
  const effectiveSelectedIds = selectedIds.length
    ? selectedIds
    : selectedKeysFallback.length
    ? options
        .filter((o) => o.key && selectedKeysFallback.includes(o.key))
        .map((o) => o.id)
    : [];

  /* ---- Toggle with max of  ---- */
  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_HOBBIES) {
        setError(`You can select up to ${MAX_HOBBIES} hobbies.`);
        return prev;
      }
      if (selectedKeysFallback.length) setSelectedKeysFallback([]);
      return [...prev, id];
    });
  };

  /*  Save: PUT indexed list of strings -> hobbies[0]=Singing  */
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Resolve final *names* (strings) for the server
      const idsForSave = effectiveSelectedIds.slice(0, MAX_HOBBIES);
      const namesForSave = idsForSave
        .map((id) => options.find((o) => o.id === id)?.name)
        .filter((n): n is string => !!n);

      // Build FormData with indexed keys: hobbies[0], hobbies[1]
      const fd = new FormData();
      namesForSave.forEach((name, i) => {
        fd.append(`hobbies[${i}]`, name);
      });

      await apiPublic.put("/user/profile-update/", fd, {
        headers: { Authorization: `Bearer ${authTokens?.access || ""}` },
      });

      history.back();
    } catch (e: any) {
      // JWT fallback if needed
      if (e?.response?.status === 401) {
        try {
          const idsForSave = effectiveSelectedIds.slice(0, MAX_HOBBIES);
          const namesForSave = idsForSave
            .map((id) => options.find((o) => o.id === id)?.name)
            .filter((n): n is string => !!n);

          const fd = new FormData();
          namesForSave.forEach((name, i) => fd.append(`hobbies[${i}]`, name));

          await apiPublic.put("/user/profile-update/", fd, {
            headers: { Authorization: `JWT ${authTokens?.access || ""}` },
          });

          history.back();
          return;
        } catch (e2: any) {
          setError(
            e2?.response?.data?.detail ||
              e2?.message ||
              "Failed to save changes"
          );
        }
      } else {
        setError(
          e?.response?.data?.detail || e?.message || "Failed to save changes"
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  /* Render (design unchanged)*/
  return (
    <main className="min-h-screen bg-backgrounda flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 text-heading border-b border-borderButton">
        <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </Link>
        <h1 className="text-[24px] font-bold leading-[36px]">Edit Hobbies</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-pink-600 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="w-full flex justify-center py-8">
            <Loader2 className="animate-spin text-primary-500" size={24} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {options.map((h) => {
              const isSelected = effectiveSelectedIds.includes(h.id);
              const atLimit =
                !isSelected && effectiveSelectedIds.length >= MAX_HOBBIES;

              return (
                <button
                  key={h.id}
                  onClick={() => !atLimit && toggle(h.id)}
                  disabled={atLimit}
                  aria-disabled={atLimit}
                  className={`flex h-[40px] cursor-pointer items-center gap-2 py-[10px] px-[16px] rounded-full border text-[14px] leading-[21px] font-medium transition
                    ${
                      isSelected
                        ? resolvedTheme === "light"
                          ? "bg-primary-500/10 text-primary-500 border-primary-500/40"
                          : "bg-[#FFFFFF4D] border-white text-white"
                        : resolvedTheme === "light"
                        ? "bg-white border-neutral-200 text-neutral-1000"
                        : "bg-transparent border-[#FFFFFF4D] text-white"
                    }
                    ${atLimit ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                  title={atLimit ? `Max ${MAX_HOBBIES} hobbies` : ""}
                >
                  <span>{h.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto pb-10">
        <div className="max-w-[425px] mx-auto px-4">
          <button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="w-full bg-[#f9209b]  h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </main>
  );
};
