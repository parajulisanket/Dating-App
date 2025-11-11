"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

// helper
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

// component
export const EditSexualOrientation = ({ backHref = "/edit-profile" }) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { authTokens, authReady } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // orientation value
  const [value, setValue] = useState<string>("");
  const [initialValue, setInitialValue] = useState<string>("");

  // show_orientation toggle
  const [show, setShow] = useState<boolean>(false);
  const [initialShow, setInitialShow] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sexualOrientationOptions = [
    { value: "heterosexual", label: "Heterosexual" },
    { value: "homosexual", label: "Homosexual" },
    { value: "bisexual", label: "Bisexual" },
    { value: "queer", label: "Queer" },
    { value: "other", label: "Other" },
  ];

  /* GET: user/profile-detail/ */
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
        const raw = await fetchWith("Bearer");
        const root = raw?.profile ?? raw?.data ?? raw ?? {};
        const cur = toStr(
          deepFindFirst(root, /(sexual[_-]?orientation|orientation)/i)
        ).toLowerCase();
        const showVal = Boolean(
          deepFindFirst(root, /(show[_-]?orientation|showOrientation)/i)
        );

        setValue(cur);
        setInitialValue(cur);
        setShow(showVal);
        setInitialShow(showVal);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          try {
            const raw2 = await fetchWith("JWT");
            const root = raw2?.profile ?? raw2?.data ?? raw2 ?? {};
            const cur = toStr(
              deepFindFirst(root, /(sexual[_-]?orientation|orientation)/i)
            ).toLowerCase();
            const showVal = Boolean(
              deepFindFirst(root, /(show[_-]?orientation|showOrientation)/i)
            );
            setValue(cur);
            setInitialValue(cur);
            setShow(showVal);
            setInitialShow(showVal);
          } catch {
            setError("Failed to load sexual orientation.");
          }
        } else {
          setError("Failed to load sexual orientation.");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authReady, authTokens?.access]);

  const handleSelect = (v: string) => setValue(v);
  const onToggle = (v: boolean) => setShow(v);
  const isValid = !!value;

  /*  PUT: user/profile-update/ on Save */
  const handleSave = async () => {
    // nothing changed → just go back
    if ((value || "") === (initialValue || "") && show === initialShow) {
      router.back();
      return;
    }

    setIsSaving(true);
    setError(null);

    const fd = new FormData();
    // send both styles to be safe with backend
    fd.append("sexual_orientation", value);
    fd.append("sexualOrientation", value);
    fd.append("show_orientation", show ? "true" : "false");
    fd.append("showOrientation", show ? "true" : "false");

    async function putWith(prefix: "Bearer" | "JWT") {
      return apiPublic.put("/user/profile-update/", fd, {
        headers: { Authorization: `${prefix} ${authTokens?.access || ""}` },
      });
    }

    try {
      await putWith("Bearer");
      router.back();
    } catch (e: any) {
      if (e?.response?.status === 401) {
        try {
          await putWith("JWT");
          router.back();
        } catch (err2: any) {
          setError(err2?.response?.data?.detail || "Failed to update.");
        }
      } else {
        setError(e?.response?.data?.detail || "Failed to update.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 text-heading border-b border-borderButton">
        <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </Link>
        <h1 className="text-[24px] font-bold leading-[36px]">
          Edit Sexual Orientation
        </h1>
      </div>

      {/* Content Area - scrollable */}
      {mounted && (
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 ">
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 text-pink-600">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-6 text-sm text-neutral-500">Loading…</div>
          ) : (
            <div className="flex flex-col gap-4">
              {sexualOrientationOptions.map((option) => {
                const selected = value === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`py-[14px] px-[18px] border rounded-full text-[16px] leading-[20px] font-semibold cursor-pointer
                      ${
                        selected
                          ? resolvedTheme === "light"
                            ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                            : "bg-[#FFFFFF4D] border-white"
                          : resolvedTheme === "light"
                          ? "border-neutral-200"
                          : "border-[#FFFFFF4D]"
                      }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Fixed Button Container */}
      <div className="absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto pb-10">
        {/* Toggle */}
        <div className="max-w-[425px] mx-auto  px-4 mb-3">
          <label className="flex items-center justify-center gap-3 select-none">
            <button
              type="button"
              onClick={() => isValid && onToggle(!show)}
              disabled={!isValid}
              className={[
                "flex items-center h-6 w-[42px] rounded-full p-[2px] border transition-all duration-300",
                show
                  ? "bg-[#f92fa2] border-[#f92fa2]"
                  : "bg-[#f92fa2]/10 border-[#f92fa2]",
              ].join(" ")}
              aria-pressed={show}
              aria-label="Toggle show orientation on profile"
              aria-disabled={!isValid}
            >
              <span
                className={[
                  "h-[16px] w-[16px] rounded-full shadow-md transition-transform duration-300 flex items-center justify-center text-[10px] font-bold",
                  show
                    ? "translate-x-[20px] bg-white text-[#f92fa2]"
                    : "translate-x-0 bg-[#f92fa2] text-transparent",
                ].join(" ")}
              />
            </button>
            <span className="text-[16px] font-medium text-neutral-1000">
              Show my orientation in my profile.
            </span>
          </label>
        </div>

        {/* Save */}
        <div className="max-w-[425px] mx-auto px-4 py-3">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
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
