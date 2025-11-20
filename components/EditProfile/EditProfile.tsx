"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

/* DELETE endpoints */
const DELETE_SOCIAL_ENDPOINT = (id: number) =>
  `/user/delete-social-account/${id}/`;
const DELETE_IMAGE_ENDPOINT = (id: number) => `/user/delete-image/${id}/`;

/* Types */
interface ProfilePicture {
  url: string;
}
interface ProfileImage {
  id: number;
  url: string;
  _file?: File;
}
interface SocialLink {
  id: number;
  platform:
    | "facebook"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "snapchat"
    | "tiktok"
    | "other";
  username: string; // this is a FULL link in your flow
}
interface ProfileFormData {
  profilePicture: ProfilePicture;
  images: (ProfileImage | null)[];
  bio: string;
  interestedIn: string;
  sexualOrientation: string;
  hobbies: string[];
  socialLinks: SocialLink[];
}

/* Helpers  */
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
  x == null
    ? ""
    : typeof x === "string"
    ? x
    : typeof x === "number" || typeof x === "boolean"
    ? String(x)
    : "";

/* Image URL utils */
function absolutize(url?: string): string | null {
  const u = (url || "").trim();
  if (!u) return null;

  // Already absolute or in-memory
  if (
    u.startsWith("http://") ||
    u.startsWith("https://") ||
    u.startsWith("blob:") ||
    u.startsWith("data:")
  ) {
    return u;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "";

  // Backend media/static paths like /media/... or /static/...
  if (u.startsWith("/media/") || u.startsWith("/static/")) {
    return base ? `${base}${u}` : u;
  }

  // Frontend static assets in /public (e.g., /nobita.png)
  if (u.startsWith("/")) {
    return u;
  }

  // Relative backend paths like user_pp/...
  if (base) {
    return `${base}/${u.replace(/^\/+/, "")}`;
  }

  return u;
}
const safeSrc = (u?: string | null) => absolutize(u || undefined);

const GALLERY_EXISTING_KEY = "existing_image_urls";
const GALLERY_NEW_KEY = "images_data";

/* Icons + platform from LINK */
type Platform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "snapchat"
  | "tiktok"
  | "other";

const ICONS: Record<Platform, string> = {
  facebook: "/icons/facebookBlue.svg",
  instagram: "/icons/instagramblue.svg",
  twitter: "/icons/twitter.svg",
  linkedin: "/icons/linkedin.svg",
  snapchat: "/icons/snapchat.svg",
  tiktok: "/icons/tiktok.svg",
  other: "/icons/link.svg",
};

function platformFromLink(link: string): Platform {
  const s = (link || "").toLowerCase();
  if (s.includes("instagram.com")) return "instagram";
  if (s.includes("facebook.com")) return "facebook";
  if (s.includes("x.com") || s.includes("twitter.com")) return "twitter";
  if (s.includes("linkedin.com")) return "linkedin";
  if (s.includes("snapchat.com")) return "snapchat";
  if (s.includes("tiktok.com")) return "tiktok";
  return "other";
}

/* API <-> UI */
function mapFromApi(root: any): { form: ProfileFormData } {
  const json = root?.profile ?? root?.data ?? root ?? {};

  const profilePic =
    toStr(
      deepFindFirst(
        json,
        /(profile[_-]?pic(ture)?|profile[_-]?image|profile[_-]?photo|avatar(_url)?)/i
      )
    ) || "";

  const imageArrays = deepFindAll(json, /(images?|photos?|gallery)/i).filter(
    Array.isArray
  );
  const gallery: ProfileImage[] = [];
  imageArrays.forEach((arr: any[], idxA: number) => {
    arr.forEach((it: any, idx: number) => {
      const url = toStr(
        it?.url ?? it?.image ?? it?.photo ?? it?.file ?? it?.src
      );
      if (url) gallery.push({ id: Number(it?.id ?? `${idxA}${idx}`), url });
    });
  });
  const images: (ProfileImage | null)[] = Array.from(
    { length: 6 },
    (_, i) => gallery[i] ?? null
  );

  const bio = toStr(deepFindFirst(json, /(bio|about|description)/i));
  const interestedIn = toStr(
    deepFindFirst(json, /(interested[_-]?in|gender[_-]?preference)/i)
  );
  const sexualOrientation = toStr(
    deepFindFirst(json, /(sexual[_-]?orientation|orientation)/i)
  );

  const hobbiesNode = deepFindFirst(json, /(hobby|hobbies|interests)/i) || [];
  const hobbies = Array.isArray(hobbiesNode)
    ? hobbiesNode.map((h) =>
        toStr(h?.name ?? h?.key ?? h?.label ?? h)
          .toLowerCase()
          .replace(/\s+/g, "-")
      )
    : [];

  // Social links (you store full URLs)
  const socialLinks: SocialLink[] = [];
  const socialNode = deepFindFirst(json, /(social[_-]?links?|socials)/i);

  if (Array.isArray(socialNode)) {
    socialNode.forEach((s: any, i: number) => {
      const link = toStr(s?.link_url ?? s?.url ?? s?.username ?? s?.handle);
      const id = Number(s?.id ?? i + 1);
      if (link) {
        // platform from link only for display; backend has its own value
        const p = platformFromLink(link);
        socialLinks.push({ id, platform: p, username: link });
      }
    });
  } else if (isObj(socialNode)) {
    for (const [k, v] of Object.entries(socialNode)) {
      const link = toStr(v);
      if (link) {
        const p = platformFromLink(link);
        socialLinks.push({
          id: socialLinks.length + 1,
          platform: p,
          username: link,
        });
      }
    }
  }

  return {
    form: {
      profilePicture: { url: profilePic },
      images,
      bio,
      interestedIn,
      sexualOrientation,
      hobbies,
      socialLinks,
    },
  };
}

/* Component  */
export const EditProfile = () => {
  const router = useRouter();
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const pfpInputRef = useRef<HTMLInputElement | null>(null);
  const { authTokens, authReady } = useAuth();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [formData, setFormData] = useState<ProfileFormData>({
    profilePicture: { url: "" },
    images: [null, null, null, null, null, null],
    bio: "",
    interestedIn: "",
    sexualOrientation: "",
    hobbies: [],
    socialLinks: [],
  });

  /* GET: profile-detail  */
  useEffect(() => {
    let cancelled = false;
    if (!authReady) return;

    async function getWith(prefix: "Bearer" | "JWT") {
      if (!authTokens?.access) throw new Error("No auth token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `${prefix} ${authTokens.access}`,
      };
      const res = await apiPublic.get("/user/profile-detail/", { headers });
      return res?.data;
    }

    (async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const raw = await getWith("Bearer");
        if (cancelled) return;
        const mapped = mapFromApi(raw).form;
        setFormData(mapped);

        if (typeof window !== "undefined" && mapped.profilePicture.url) {
          const abs =
            safeSrc(mapped.profilePicture.url) ?? mapped.profilePicture.url;
          window.localStorage.setItem("saved_user_image", abs);
        }
      } catch (e: any) {
        if (e?.response?.status === 401) {
          try {
            const raw2 = await getWith("JWT");
            if (cancelled) return;
            const mapped2 = mapFromApi(raw2).form;
            setFormData(mapped2);

            if (typeof window !== "undefined" && mapped2.profilePicture.url) {
              const abs =
                safeSrc(mapped2.profilePicture.url) ??
                mapped2.profilePicture.url;
              window.localStorage.setItem("saved_user_image", abs);
            }
          } catch {
            setErrorMsg("Failed to load profile. Please log in again.");
          }
        } else {
          setErrorMsg("Failed to load profile. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, authTokens?.access]);

  /* PUT helper with Bearer/JWT fallback */
  async function putProfile(fd: FormData) {
    const token = authTokens?.access;
    if (!token) throw new Error("No auth token");
    try {
      const res = await apiPublic.put("/user/profile-update/", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res?.data;
    } catch (err: any) {
      if (err?.response?.status === 401) {
        const res = await apiPublic.put("/user/profile-update/", fd, {
          headers: { Authorization: `JWT ${token}` },
        });
        return res?.data;
      }
      throw err;
    }
  }

  /* Profile Picture (auto-save)  */
  const handleProfilePictureChange = () => pfpInputRef.current?.click();

  const handlePfpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData((p) => ({ ...p, profilePicture: { url: previewUrl } }));

    const fd = new FormData();
    fd.append("profile_pic", file);

    try {
      const data = await putProfile(fd);
      const maybeUrl =
        data?.profile?.profile_image ||
        data?.profile?.profile_pic ||
        data?.profile_image ||
        data?.profile_pic ||
        data?.image ||
        null;

      const serverUrl = safeSrc(maybeUrl);
      const finalUrl = serverUrl || previewUrl;

      setFormData((p) => ({ ...p, profilePicture: { url: finalUrl } }));
    } catch (err) {
      console.error("Profile picture update failed:", err);
    } finally {
      setTimeout(() => URL.revokeObjectURL(previewUrl), 3000);
    }
  };

  /* Gallery Add (auto-save using images_data[index])  */
  const handleAddClick = (index: number) => {
    setSelectedIndex(index);
    galleryInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || selectedIndex === null) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData((p) => {
      const arr = [...p.images];
      arr[selectedIndex] = { id: Date.now(), url: previewUrl, _file: file };
      return { ...p, images: arr };
    });

    const fd = new FormData();
    formData.images.forEach((img, i) => {
      if (img && img.url) fd.append(`${GALLERY_EXISTING_KEY}[${i}]`, img.url);
    });
    fd.append(`${GALLERY_NEW_KEY}[${selectedIndex}]`, file);

    try {
      const data = await putProfile(fd);
      const canonical =
        data?.images?.[selectedIndex]?.url ||
        data?.profile?.gallery?.[selectedIndex]?.url ||
        null;
      const finalUrl = safeSrc(canonical) || previewUrl;

      setFormData((p) => {
        const arr = [...p.images];
        arr[selectedIndex] = { id: Date.now(), url: finalUrl! };
        return { ...p, images: arr };
      });
    } catch (err) {
      console.error("Gallery upload failed:", err);
    } finally {
      setSelectedIndex(null);
      setTimeout(() => URL.revokeObjectURL(previewUrl), 3000);
    }
  };

  /* Image Delete with DELETE endpoint + PUT fallback */
  const handleImageDelete = async (index: number) => {
    const prevImages = formData.images;
    const target = prevImages[index];

    const updated = [...prevImages];
    updated[index] = null;
    setFormData((p) => ({ ...p, images: updated }));

    const token = authTokens?.access;
    const deleteOnce = async (scheme: "Bearer" | "JWT", id: number) =>
      apiPublic.delete(DELETE_IMAGE_ENDPOINT(id), {
        headers: { Authorization: `${scheme} ${token}` },
      });

    if (token && target?.id && Number.isFinite(target.id)) {
      try {
        try {
          await deleteOnce("Bearer", target.id);
        } catch (err: any) {
          if (err?.response?.status === 401) {
            await deleteOnce("JWT", target.id);
          } else {
            throw err;
          }
        }
        return;
      } catch (err) {
        console.warn("DELETE image failed, trying PUT fallback…", err);
      }
    }

    const fd = new FormData();
    updated.forEach((img, i) => {
      if (img?.url) fd.append(`${GALLERY_EXISTING_KEY}[${i}]`, img.url);
    });

    try {
      await putProfile(fd);
    } catch (err) {
      console.error("Failed to update gallery after delete:", err);
      setFormData((p) => ({ ...p, images: prevImages }));
    }
  };

  /* Delete a single social link via DELETE API */
  const handleSocialLinkRemove = async (linkId: number) => {
    const prev = formData.socialLinks;
    const next = prev.filter((l) => l.id !== linkId);
    setFormData((p) => ({ ...p, socialLinks: next }));

    const token = authTokens?.access;
    if (!token) {
      setFormData((p) => ({ ...p, socialLinks: prev }));
      console.error("No auth token for delete");
      return;
    }

    const delOnce = async (scheme: "Bearer" | "JWT") =>
      apiPublic.delete(DELETE_SOCIAL_ENDPOINT(linkId), {
        headers: { Authorization: `${scheme} ${token}` },
      });

    try {
      try {
        await delOnce("Bearer");
      } catch (err: any) {
        if (err?.response?.status === 401) {
          await delOnce("JWT");
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error("Failed to delete social link:", err);
      setFormData((p) => ({ ...p, socialLinks: prev }));
    }
  };

  /* Render  */
  if (loading) {
    return (
      <div className="no-scrollbar scroll-smooth h-[calc(100dvh)] md:max-h-[897px] grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading profile…</div>
      </div>
    );
  }
  if (errorMsg) {
    return (
      <div className="no-scrollbar scroll-smooth h-[calc(100dvh)] md:max-h-[897px] grid place-items-center px-6 text-center">
        <div className="space-y-3">
          <p className="text-red-500 text-sm">{errorMsg}</p>
          <button
            className="px-4 py-2 rounded-full bg-[#F92FA2] text-white text-sm"
            onClick={() => router.refresh()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const rawAvatar = formData.profilePicture.url;
  const avatarSrc =
    rawAvatar && rawAvatar.startsWith("blob:")
      ? rawAvatar
      : safeSrc(rawAvatar) ?? "/nobita.png";

  return (
    <div
      className="no-scrollbar scroll-smooth  h-[calc(100dvh)] md:max-h-[897px]"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        overflowY: "auto",
      }}
    >
      <main className="min-h-screen">
        {/* Header */}
        <div className="bg-background px-4 py-4 flex items-center gap-3  text-heading border-b border-borderButton sticky top-0 z-10">
          <button
            onClick={() => router.push("/profile")}
            aria-label="Back"
            className="rounded-full active:bg-primary-500/20"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <h1 className="text-[24px] font-bold leading-[36px]">Edit Profile</h1>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* Profile Picture */}
          <div>
            <h2 className="edit-title">My Profile Picture</h2>
            <div className="flex items-center gap-4">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full object-cover h-[80px] w-[80px]"
                />
              ) : (
                <div className="h-[80px] w-[80px] rounded-full bg-neutral-200" />
              )}
              <button
                onClick={handleProfilePictureChange}
                className="bg-[#F92FA2] text-white px-6 py-2 rounded-full text-[16px] font-bold"
              >
                Change
              </button>
            </div>
          </div>

          {/* Hidden inputs */}
          <input
            ref={pfpInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePfpChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* My Pictures */}
          <div>
            <h2 className="edit-title">My Pictures</h2>
            <div className="grid grid-cols-3 gap-3 z-0">
              <AnimatePresence mode="popLayout">
                {formData.images.map((image, index) => (
                  <motion.div
                    key={image ? image.id : `empty-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative aspect-[3/4]"
                  >
                    {image?.url ? (
                      <>
                        <Image
                          src={safeSrc(image.url)!}
                          alt={`Picture ${index + 1}`}
                          fill
                          className="rounded-2xl object-cover"
                        />
                        <button
                          onClick={() => handleImageDelete(index)}
                          className="absolute top-2 right-2 btn-close rounded-full w-6 h-6 flex items-center justify-center bg-black/50"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div
                        onClick={() => handleAddClick(index)}
                        className="relative aspect-[3/4] rounded-xl bg-primary-500/10 dark:bg-white/10 flex items-center justify-center"
                      >
                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">
                          <Plus size={28} className="text-white" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Bio</h2>
            </div>
            <Link href="/edit-profile/bio">
              <div className="w-full border border-neutral-400 rounded-lg p-3 text-[14px] focus:outline-none text-neutral-500">
                {formData.bio || "Write your bio here..."}
              </div>
            </Link>
          </div>

          {/* Interested In */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">I'm interested in</h2>
            </div>
            <Link href="edit-profile/interested">
              <div className="w-full border border-neutral-400 h-[56px] rounded-lg p-3 text-[14px] focus:outline-none">
                <span className="py-[14px] px-4 rounded-[200px] border border-capsule-border bg-capsule h-[32px] inline-flex justify-center items-center">
                  {formData.interestedIn || ""}
                </span>
              </div>
            </Link>
          </div>

          {/* Sexual Orientation */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Sexual Orientation is</h2>
            </div>
            <Link href="/edit-profile/sexual-orientation">
              <div className="w-full border border-neutral-400 h-[56px] rounded-lg p-3 text-[14px] focus:outline-none">
                <span className="py-[14px] px-4 rounded-[200px] border border-capsule-border bg-capsule h-[32px] inline-flex justify-center items-center">
                  {formData.sexualOrientation || ""}
                </span>
              </div>
            </Link>
          </div>

          {/* Hobbies */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Hobbies are</h2>
            </div>
            <Link href="/edit-profile/hobbies">
              <div className="w-full border border-neutral-400 rounded-lg p-3 text-[14px] focus:outline-none">
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                  {formData.hobbies.length > 0 ? (
                    formData.hobbies.map((hobby, i) => (
                      <span
                        key={`${hobby}-${i}`}
                        className="px-4 py-[6px] rounded-full border border-capsule-border bg-capsule inline-flex items-center"
                      >
                        <span>{hobby.replace(/-/g, " ")}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No hobbies selected</span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex justify-between">
              <h2 className="edit-title">My Social Links</h2>
            </div>
            <div className="space-y-3">
              {formData.socialLinks.map((link) => {
                const p = platformFromLink(link.username);
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 border border-neutral-400 rounded-lg p-3"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Image
                        src={ICONS[p]}
                        alt={p}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <span className="flex-1 text-[14px] break-all">
                      {link.username}
                    </span>
                    <button
                      onClick={() => handleSocialLinkRemove(link.id)}
                      className="hover:text-gray-600"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M15 5L5 15M5 5L15 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
              <Link href="/edit-profile/social-accounts">
                <button className="w-full p-4 bg-capsule h-[52px] rounded-lg py-3 text-[14px] flex items-center justify-center gap-2 hover:border-[#f9209b] hover:text-[#f9209b] transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 5V15M5 10H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add social link
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
