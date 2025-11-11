"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

// Small helper functions
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

// Component
export const EditBio = ({ backHref = "/edit-profile" }) => {
  const router = useRouter();
  const { authTokens, authReady } = useAuth();

  const [bio, setBio] = useState("");
  const [initialBio, setInitialBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // GET: Fetch bio
  useEffect(() => {
    if (!authReady) return;

    async function fetchWith(prefix: "Bearer" | "JWT") {
      const res = await apiPublic.get("/user/profile-detail/", {
        headers: { Authorization: `${prefix} ${authTokens?.access || ""}` },
      });
      return res.data;
    }

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        let raw = await fetchWith("Bearer");
        const root = raw?.profile ?? raw?.data ?? raw ?? {};
        const userBio = toStr(deepFindFirst(root, /(bio|about|description)/i));
        setBio(userBio);
        setInitialBio(userBio);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          try {
            const raw2 = await fetchWith("JWT");
            const root = raw2?.profile ?? raw2?.data ?? raw2 ?? {};
            const userBio = toStr(
              deepFindFirst(root, /(bio|about|description)/i)
            );
            setBio(userBio);
            setInitialBio(userBio);
          } catch {
            setError("Failed to load bio.");
          }
        } else {
          setError("Failed to load bio.");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authReady, authTokens?.access]);

  // PUT: Save bio
  const handleSave = async () => {
    const nextBio = bio.trim();
    if (nextBio === initialBio.trim()) {
      router.back();
      return;
    }

    setIsSaving(true);
    setError(null);

    const fd = new FormData();
    fd.append("bio", nextBio);

    async function putWith(prefix: "Bearer" | "JWT") {
      return apiPublic.put("/user/profile-update/", fd, {
        headers: { Authorization: `${prefix} ${authTokens?.access || ""}` },
      });
    }

    try {
      await putWith("Bearer");
      window.dispatchEvent(
        new CustomEvent("profile:updated", { detail: { bio: nextBio } })
      );
      router.back();
    } catch (e: any) {
      if (e?.response?.status === 401) {
        try {
          await putWith("JWT");
          window.dispatchEvent(
            new CustomEvent("profile:updated", { detail: { bio: nextBio } })
          );
          router.back();
        } catch {
          setError("Failed to update bio.");
        }
      } else {
        setError("Failed to update bio.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle keyboard height
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const kbHeight = windowHeight - viewportHeight;
        setKeyboardHeight(kbHeight > 0 ? kbHeight : 0);
      }
    };

    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () =>
        window.visualViewport?.removeEventListener("resize", handleResize);
    }
  }, []);

  const maxLength = 150;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 text-heading border-b border-borderButton">
        <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </Link>
        <h1 className="text-[24px] font-bold leading-[36px]">Edit Bio</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {error && (
          <div className="mb-3 p-3 rounded-lg border border-red-200 text-pink-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="text-[16px] font-medium">
            Tell a bit about yourself. Keep it short and engaging.
          </div>

          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={maxLength}
              rows={4}
              placeholder="Write something about yourself..."
              className="textarea"
              disabled={isLoading || isSaving}
            />
            <div className="text-right text-[12px] text-gray-500 mt-1">
              {bio.length}/{maxLength}
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div
        className="absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto pb-10"
        style={{ bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : "0px" }}
      >
        <div className="max-w-[425px] mx-auto px-4 py-3">
          <button
            onClick={handleSave}
            disabled={bio.length === 0 || isSaving || isLoading}
            className="w-full bg-[#f9209b] h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving…
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
