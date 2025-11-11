"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";
import { ProfileFormData } from "@/types/profile";

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

/* component */
export const EditInterestedIn = ({ backHref = "/edit-profile" }) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { authTokens, authReady } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    profilePicture: { url: "/nobita.png" },
    images: [
      { id: 1, url: "/profile1.jpg" },
      { id: 2, url: "/profile2.jpg" },
      { id: 3, url: "/profile3.jpg" },
      { id: 4, url: "/profile1.jpg" },
      { id: 5, url: "/profile2.jpg" },
      { id: 6, url: "/profile3.jpg" },
    ],
    bio: "",
    interestedIn: "",
    sexualOrientation: "",
    hobbies: [],
    socialLinks: [
      { id: 1, platform: "facebook", username: "Socialmedia/username" },
      { id: 2, platform: "instagram", username: "Socialmedia/username" },
    ],
  });

  const [initialInterested, setInitialInterested] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Use lowercase values for backend; labels stay the same
  const interestOptions = [
    { value: "man", label: "Man" },
    { value: "woman", label: "Woman" },
    { value: "all", label: "All" },
  ];

  /* GET /user/profile-detail/ and prefill */
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
      try {
        let raw = await fetchWith("Bearer");
        const root = raw?.profile ?? raw?.data ?? raw ?? {};
        const interested = toStr(
          deepFindFirst(root, /(interested[_-]?in|gender[_-]?preference)/i)
        )
          .toLowerCase()
          .trim();
        setFormData((prev) => ({ ...prev, interestedIn: interested }));
        setInitialInterested(interested);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          try {
            const raw2 = await fetchWith("JWT");
            const root = raw2?.profile ?? raw2?.data ?? raw2 ?? {};
            const interested = toStr(
              deepFindFirst(root, /(interested[_-]?in|gender[_-]?preference)/i)
            )
              .toLowerCase()
              .trim();
            setFormData((prev) => ({ ...prev, interestedIn: interested }));
            setInitialInterested(interested);
          } catch {
            // ignore: keep defaults
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authReady, authTokens?.access]);

  const handleSelectInterest = (value: string) => {
    // normalize to lowercase for backend
    setFormData((prev) => ({
      ...prev,
      interestedIn: (value || "").toLowerCase(),
    }));
  };

  /* PUT /user/profile-update/ on Save */
  const handleSave = async () => {
    const nextVal = (formData.interestedIn || "").toLowerCase();
    if (!nextVal || nextVal === (initialInterested || "").toLowerCase()) {
      router.back();
      return;
    }

    setIsSaving(true);

    const fd = new FormData();
    // include both styles just in case backend accepts either
    fd.append("interested_in", nextVal);
    fd.append("interestedIn", nextVal);

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
        } catch {}
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- UI (unchanged design) ---
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className=" px-4 py-4 flex items-center gap-3 text-heading border-b border-borderButton">
        <Link href={backHref} aria-label="Back" className="rounded-full">
          <ChevronLeft className="" size={24} strokeWidth={1.5} />
        </Link>
        <h1 className="text-[24px] font-bold leading-[36px]">
          Edit Sexual Interest
        </h1>
      </div>

      {/* Content Area - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 ">
        <div className="flex flex-col gap-4">
          {interestOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelectInterest(option.value)}
              className={`py-[14px] px-[18px] border rounded-full text-[16px] leading-[20px] font-semibold cursor-pointer ${
                (formData.interestedIn || "").toLowerCase() === option.value
                  ? resolvedTheme === "light"
                    ? "bg-primary-500/10 border-primary-500/40 text-primary-500"
                    : "bg-[#FFFFFF4D] border-white"
                  : resolvedTheme === "light"
                  ? "border-neutral-200  "
                  : "border-[#FFFFFF4D] "
              }`}
              disabled={isLoading || isSaving}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Button Container */}
      <div className="absolute bottom-0 left-0 right-0  max-w-[425px] mx-auto  pb-10">
        <div className="max-w-[425px] mx-auto px-4 py-3 ">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="w-full bg-[#f9209b] h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full"
          >
            Save
          </button>
        </div>
      </div>
    </main>
  );
};
