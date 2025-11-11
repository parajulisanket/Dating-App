"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import apiPublic from "@/api";
import icons from "@/assets/icons/icons";

/* tiny helpers */
const isObj = (x: any) => x && typeof x === "object";
function deepFindAll(obj: any, keyRx: RegExp): any[] {
  const seen = new Set<any>(),
    out: any[] = [],
    stack = [obj];
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
const toStr = (x: any) =>
  x == null ? "" : typeof x === "string" ? x : String(x);

type LinkRow = { platform: "facebook" | "instagram" | "x"; link_url: string };

export const EditSocialPlatform = ({ backHref = "/edit-profile" }) => {
  const router = useRouter();
  const { authTokens } = useAuth();

  const [selectedPlatform, setSelectedPlatform] = useState<
    "" | LinkRow["platform"]
  >("");
  const [linkUrl, setLinkUrl] = useState("");
  const [links, setLinks] = useState<LinkRow[]>([
    { platform: "facebook", link_url: "" },
    { platform: "instagram", link_url: "" },
    { platform: "x", link_url: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialPlatformOptions = [
    { value: "facebook", label: "Facebook", icon: icons.facebookOrg },
    { value: "instagram", label: "Instagram", icon: icons.instagramOrg },
    { value: "x", label: "X", icon: icons.XOrg },
  ] as const;

  // No initial fetch: the page simply allows adding/updating social links

  const handleSelectPlatform = (value: string) => {
    const v = value as LinkRow["platform"];
    setSelectedPlatform(v);
    const hit = links.find((l) => l.platform === v);
    setLinkUrl(hit?.link_url ?? "");
  };

  /* local input */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };

  /* PUT: send array payload social_links[n][link_url] */
  const handleSave = async () => {
    if (!selectedPlatform || !linkUrl) return;

    // update local list first
    const next = links.map((l) =>
      l.platform === selectedPlatform ? { ...l, link_url: linkUrl } : l
    );
    setLinks(next);

    const fd = new FormData();
    const nonEmpty = next.filter((l) => l.link_url && l.link_url.trim() !== "");

    nonEmpty.forEach((row, idx) => {
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
      // notify other pages
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
      <div className=" px-4 py-4 flex items-center gap-3 text-heading border-b border-borderButton">
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
                        src={option.icon}
                        alt="icon"
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
      <div className=" absolute bottom-0 left-0 right-0 max-w-[425px] mx-auto pb-10">
        <div className="max-w-[425px] mx-auto px-4 py-3 ">
          <button
            onClick={handleSave}
            disabled={!selectedPlatform || !linkUrl || isSaving}
            className="w-full bg-[#f9209b] h-[52px] text-white font-semibold text-[16px] py-3.5 rounded-full"
          >
            Save
          </button>
        </div>
      </div>
    </main>
  );
};
