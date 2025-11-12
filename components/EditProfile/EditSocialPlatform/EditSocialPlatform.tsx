"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import apiPublic from "@/api";

/* tiny helpers (keep only if you use them elsewhere) */
const isObj = (x: unknown): x is Record<string, unknown> =>
  x !== null && typeof x === "object";
function deepFindAll(obj: unknown, keyRx: RegExp): any[] {
  const seen = new Set<any>(),
    out: any[] = [],
    stack: any[] = [obj];
  while (stack.length) {
    const cur = stack.pop();
    if (!isObj(cur) || seen.has(cur)) continue;
    seen.add(cur);
    for (const [k, v] of Object.entries(cur)) {
      if (keyRx.test(k)) out.push(v);
      if (isObj(v)) stack.push(v);
    }
  }
  return out;
}
const toStr = (x: unknown) =>
  x == null ? "" : typeof x === "string" ? x : String(x);

type Platform = "facebook" | "instagram" | "x" | "tiktok" | "snapchat";
type LinkRow = { platform: Platform; link_url: string };

export const EditSocialPlatform = ({ backHref = "/edit-profile" }) => {
  const router = useRouter();
  const { authTokens } = useAuth();

  const [selectedPlatform, setSelectedPlatform] = useState<"" | Platform>("");
  const [linkUrl, setLinkUrl] = useState("");
  const [links, setLinks] = useState<LinkRow[]>([
    { platform: "facebook", link_url: "" },
    { platform: "instagram", link_url: "" },
    { platform: "x", link_url: "" },
    { platform: "tiktok", link_url: "" },
    { platform: "snapchat", link_url: "" },
  ]);

  const [isLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  use /public icons (put svgs in: public/icons/facebook.svg etc.)
  const socialPlatformOptions = [
    { value: "facebook", label: "Facebook", icon: "/icons/facebookBlue.svg" },
    {
      value: "instagram",
      label: "Instagram",
      icon: "/icons/instagramblue.svg",
    },
    { value: "x", label: "X", icon: "/icons/X1.svg" },
    { value: "tiktok", label: "Tiktok", icon: "/icons/tiktok.svg" },
    { value: "snapchat", label: "Snapchat", icon: "/icons/snapchat.svg" },
  ] as const;

  const handleSelectPlatform = (value: string) => {
    const v = value as Platform;
    setSelectedPlatform(v);
    const hit = links.find((l) => l.platform === v);
    setLinkUrl(hit?.link_url ?? "");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };

  /* PUT: send array payload social_links[n][platform] + [link_url] */
  const handleSave = async () => {
    if (!selectedPlatform || !linkUrl) return;

    const trimmed = linkUrl.trim();

    // update local list first
    const next = links.map((l) =>
      l.platform === selectedPlatform ? { ...l, link_url: trimmed } : l
    );
    setLinks(next);

    const fd = new FormData();
    const nonEmpty = next.filter((l) => l.link_url && l.link_url.trim() !== "");

    // IMPORTANT: include platform so backend can map correctly
    nonEmpty.forEach((row, idx) => {
      fd.append(`social_links[${idx}][platform]`, row.platform);
      fd.append(`social_links[${idx}][link_url]`, row.link_url.trim());
    });

    async function putWith(prefix: "Bearer" | "JWT") {
      return apiPublic.put("/user/profile-update/", fd, {
        headers: { Authorization: `${prefix} ${authTokens?.access || ""}` },
      });
    }

    setIsSaving(true);
    setError(null);
    try {
      await putWith("Bearer");
      try {
        window.dispatchEvent(
          new CustomEvent("profile:updated", {
            detail: { social_links: nonEmpty },
          })
        );
      } catch {}
      router.back();
    } catch (e: any) {
      if (e?.response?.status === 401) {
        try {
          await putWith("JWT");
          try {
            window.dispatchEvent(
              new CustomEvent("profile:updated", {
                detail: { social_links: nonEmpty },
              })
            );
          } catch {}
          router.back();
        } catch {
          setError("Failed to update social links.");
        }
      } else {
        setError("Failed to update social links.");
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
        <h1 className="text-[20px] font-semibold">Add Social Link</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {error && (
          <div className="p-3 border border-red-200 rounded-lg text-pink-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-neutral-500 text-sm">Loading…</div>
        ) : (
          <>
            <Select onValueChange={handleSelectPlatform}>
              <SelectTrigger className="w-full !rounded-[16px] px-4 py-[14px] border border-gray-300 !text-[16px]">
                <SelectValue placeholder="Select Social Platform" />
              </SelectTrigger>
              <SelectContent className="border border-neutral-200 !rounded-2xl ">
                {socialPlatformOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={option.icon} // <-- string path under /public
                        alt={`${option.label} icon`}
                        height={24}
                        width={24}
                        className="size-[24px]"
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="url"
              placeholder="Profile URL (e.g. https://example.com/yourname)"
              value={linkUrl}
              onChange={handleUrlChange}
              disabled={!selectedPlatform}
              className="input !h-[52px]"
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto pb-10">
        <div className="max-w-[425px] mx-auto px-4 py-3 ">
          <button
            onClick={handleSave}
            disabled={!selectedPlatform || !linkUrl || isSaving || isLoading}
            aria-busy={isSaving}
            className="w-full bg-[#f9209b] h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full
                       flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving && (
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            )}
            <span>{isSaving ? "Saving…" : "Save"}</span>
          </button>
        </div>
      </div>
    </main>
  );
};
