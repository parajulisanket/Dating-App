"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import apiPublic from "@/api";
import { useAuth } from "@/context/AuthContext";

interface AboutMeItem {
  value: string;
}
interface LookingFor {
  relationshipType?: string;
  genderPreference?: string;
}
interface LifestyleData {
  drink?: string;
  smoke?: string;
  diet?: string;
  travel?: string;
  pets?: string;
}
interface SocialLink {
  platform:
    | "facebook"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "snapchat"
    | "tiktok"
    | "other";
  username: string; // full link
}
interface ProfileData {
  name: string;
  age: number;
  location: string;
  distance: string;
  bio: string;
  profileImage: string;
  isVerified: boolean;
  aboutMe: AboutMeItem[];
  lookingFor: LookingFor;
  hobbies: string[];
  lifestyle: LifestyleData;
  socialAccounts: SocialLink[];
}
interface ImageData {
  id: number;
  src: string;
  alt: string;
}

/* utilities */
function ageFromDob(dob?: string | null): number {
  if (!dob) return 0;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  const t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
  return Math.max(0, a);
}
const titleCase = (s?: string) =>
  (s ?? "")
    .toString()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
function toStr(x: any) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  return "";
}
function absolutize(url?: string): string | null {
  const u = (url || "").trim();
  if (!u) return null;
  try {
    new URL(u);
    return u;
  } catch {}
  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "";
  if (!base) return null;
  return `${base}/${u.replace(/^\/+/, "")}`;
}
function safeSrc(maybe: string | null | undefined, fallback = "") {
  const result = absolutize(maybe || undefined);
  return result || fallback;
}

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

/*  component */
export const MyInfo = () => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { authTokens, authReady, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const demoProfile: ProfileData = useMemo(
    () => ({
      name: "",
      age: 0,
      location: "",
      distance: "",
      bio: "",
      profileImage: "/nobita.png",
      isVerified: false,
      aboutMe: [],
      lookingFor: {},
      hobbies: [],
      lifestyle: {},
      socialAccounts: [],
    }),
    []
  );

  const [profileData, setProfileData] = useState<ProfileData>(demoProfile);
  const [images, setImages] = useState<ImageData[]>([]);

  function mapApiToProfile(root: any): {
    profile: ProfileData;
    imgs: ImageData[];
  } {
    const json = root?.profile ?? root?.data ?? root ?? {};

    const fullName = toStr(
      deepFindFirst(json, /(full[_-]?name|name|first[_-]?name)/i)
    );
    const location = toStr(
      deepFindFirst(json, /(location|city|address|town)/i)
    );
    const bio = toStr(deepFindFirst(json, /(bio|about|description)/i));
    const isVerifiedBool = Boolean(
      deepFindFirst(json, /(is[_-]?verified|verified)/i) ?? false
    );

    const dobRaw = deepFindFirst(
      json,
      /(dob|date[_-]?of[_-]?birth|birth[_-]?date)/i
    );
    const age = ageFromDob(toStr(dobRaw));

    const relationship = toStr(
      deepFindFirst(json, /(relationship(_status)?|looking[_-]?for)/i)
    );
    const interestedIn = toStr(
      deepFindFirst(json, /(interested[_-]?in|gender[_-]?preference)/i)
    );

    let hobbies: string[] = [];
    const hobbiesNode = deepFindFirst(json, /(hobby|hobbies|interests)/i);
    if (Array.isArray(hobbiesNode)) {
      hobbies = hobbiesNode
        .map((h: any) =>
          typeof h === "string" ? h : toStr(h?.name ?? h?.label ?? h?.title)
        )
        .filter(Boolean);
    }

    const lifeNode = deepFindFirst(json, /lifestyle/i) || {};
    const lifestyle: LifestyleData = {
      drink: toStr(
        deepFindFirst(lifeNode, /(drink|alcohol)/i) ??
          deepFindFirst(json, /(drink|alcohol)/i)
      ),
      smoke: toStr(
        deepFindFirst(lifeNode, /(smok)/i) ?? deepFindFirst(json, /(smok)/i)
      ),
      diet: toStr(
        deepFindFirst(lifeNode, /(diet|food)/i) ??
          deepFindFirst(json, /(diet|food)/i)
      ),
      travel: toStr(
        deepFindFirst(lifeNode, /(travel|trip)/i) ??
          deepFindFirst(json, /(travel|trip)/i)
      ),
      pets: toStr(
        deepFindFirst(lifeNode, /(pet|pets)/i) ??
          deepFindFirst(json, /(pet|pets)/i)
      ),
    };

    const primaryPhoto = toStr(
      deepFindFirst(
        json,
        /(profile[_-]?image|profile[_-]?photo|avatar(_url)?|profile[_-]?pic)/i
      )
    );

    const imageArrays = deepFindAll(json, /(images?|photos?|gallery)/i).filter(
      Array.isArray
    );
    const gallery: ImageData[] = [];
    imageArrays.forEach((arr: any[], idxA: number) => {
      arr.forEach((it: any, idx: number) => {
        const src = toStr(
          it?.url ?? it?.image ?? it?.photo ?? it?.file ?? it?.src
        );
        const abs = absolutize(src);
        if (abs)
          gallery.push({
            id: Number(it?.id ?? `${idxA}${idx}`),
            src: abs,
            alt: `photo-${idxA}-${idx}`,
          });
      });
    });

    // socialAccounts: you store full links; icon chosen by domain
    const socialAccounts: SocialLink[] = [];
    const socialNode = deepFindFirst(json, /(social[_-]?links?|socials)/i);

    if (Array.isArray(socialNode)) {
      socialNode.forEach((s: any) => {
        const link = toStr(s?.link_url ?? s?.url ?? s?.username ?? s?.handle);
        if (link) {
          socialAccounts.push({
            platform: platformFromLink(link),
            username: link,
          });
        }
      });
    } else if (isObj(socialNode)) {
      for (const [, v] of Object.entries(socialNode)) {
        const link = toStr(v);
        if (link) {
          socialAccounts.push({
            platform: platformFromLink(link),
            username: link,
          });
        }
      }
    }

    // ---- About Me: only gender, zodiac, sexual orientation (respect show_orientation) ----
    const genderVal = toStr(deepFindFirst(json, /\bgender\b/i));
    const zodiacVal =
      toStr(deepFindFirst(json, /(zodiac(_sign)?|zodiacsign)/i)) ||
      toStr(deepFindFirst(json, /(sun[_-]?sign)/i));
    const sexualOrientationVal = toStr(
      deepFindFirst(json, /(sexual[_-]?orientation|orientation)/i)
    );
    const showOrientationRaw = toStr(
      deepFindFirst(json, /(show[_-]?orientation)/i)
    );
    const showOrientation =
      showOrientationRaw === ""
        ? true
        : !/^(false|0)$/i.test(showOrientationRaw);

    const aboutBasics: AboutMeItem[] = [
      genderVal ? titleCase(genderVal) : "",
      zodiacVal ? titleCase(zodiacVal) : "",
      showOrientation && sexualOrientationVal
        ? titleCase(sexualOrientationVal)
        : "",
    ]
      .filter(Boolean)
      .map((v) => ({ value: v as string }));

    const profile: ProfileData = {
      name: fullName,
      age,
      location,
      distance: "",
      bio,
      profileImage: safeSrc(primaryPhoto, "/nobita.png"),
      isVerified: isVerifiedBool,
      aboutMe: aboutBasics, // ← only these three chips
      lookingFor: {
        relationshipType: relationship || undefined,
        genderPreference: interestedIn || undefined,
      },
      hobbies,
      lifestyle,
      socialAccounts,
    };

    return { profile, imgs: gallery };
  }

  useEffect(() => {
    let cancelled = false;
    if (!authReady) return;
    if (!authTokens?.access) {
      router.replace("/login");
      return;
    }

    async function fetchWith(prefix: "Bearer" | "JWT") {
      if (!authTokens?.access) throw new Error("No auth token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      headers.Authorization = `${prefix} ${authTokens.access}`;
      const res = await apiPublic.get("/user/profile-detail/", { headers });
      return res.data;
    }

    (async () => {
      try {
        const raw = await fetchWith("Bearer");
        if (cancelled) return;
        const { profile, imgs } = mapApiToProfile(raw);
        setProfileData((p) => ({ ...p, ...profile }));
        if (imgs.length) setImages(imgs);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          try {
            const raw2 = await fetchWith("JWT");
            if (cancelled) return;
            const { profile, imgs } = mapApiToProfile(raw2);
            setProfileData((p) => ({ ...p, ...profile }));
            if (imgs.length) setImages(imgs);
          } catch {
            logout();
            router.replace("/login");
          }
        } else {
          console.error(
            "Profile fetch failed:",
            e?.response?.status || e?.message
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, authTokens, logout, router]);

  // listen for profile updates from EditProfile (pfp)
  useEffect(() => {
    function onProfileUpdated(e: any) {
      try {
        const url = e?.detail?.profileImage;
        if (!url) return;
        const abs = absolutize(url) || url;
        setProfileData((p) => ({ ...p, profileImage: abs }));
        setImages((prev) => {
          if (prev.find((x) => x.src === abs)) return prev;
          return [{ id: Date.now(), src: abs, alt: "profile" }, ...prev];
        });
      } catch {}
    }

    window.addEventListener(
      "profile:updated",
      onProfileUpdated as EventListener
    );
    return () =>
      window.removeEventListener(
        "profile:updated",
        onProfileUpdated as EventListener
      );
  }, []);

  return (
    <div
      className="no-scrollbar scroll-smooth h-[calc(100svh-116px)] md:max-h-[776.54px] pb-5"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        overflowY: "auto",
      }}
    >
      <div className="p-4 ">
        <div className="w-full flex flex-col">
          {!profileData.isVerified && (
            <Link href="/verification">
              <div className="flex gap-2 flex-col text-white bg-[linear-gradient(130.89deg,#006FFF_4.3%,#01E6FF_97.77%)] mb-4 rounded-[16px] p-4">
                <div className="text-[16px] leading-[20px] font-semibold">
                  Verify Account
                </div>
                <div className="text-[12px] leading-[18px] font-medium">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </div>
              </div>
            </Link>
          )}

          {/* Header row */}
          <div className="flex h-[80px] gap-4">
            <Image
              src={safeSrc(profileData.profileImage, "/nobita.png")}
              alt="Profile"
              width={80}
              height={80}
              className="cursor-pointer rounded-full object-cover h-[80px] w-[80px]"
            />
            <div className="flex flex-col h-[57px]">
              <div
                className={`flex gap-2 items-center ${
                  mounted && resolvedTheme === "light"
                    ? "text-[#f9209b]"
                    : "text-white"
                } text-[24px] font-bold leading-[36px]`}
              >
                <h1>
                  {profileData.name || ""}
                  {profileData.age ? `, ${profileData.age}` : ""}
                </h1>
                {profileData.isVerified && (
                  <div>
                    <Image
                      src="/icons/verified.svg"
                      alt="verified"
                      width={24}
                      height={24}
                      className="h-6 w-6 "
                    />
                  </div>
                )}
              </div>
              <div
                className={`flex ${
                  mounted && resolvedTheme === "light"
                    ? "text-[#fa51b1]"
                    : "text-neutral-400"
                } items-center gap-1`}
              >
                <Image
                  src={
                    mounted && resolvedTheme === "light"
                      ? "/icons/location.svg"
                      : "/icons/locationDark.svg"
                  }
                  alt="location"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <p className="text-[14px] font-medium">
                  {profileData.location || ""}
                </p>
              </div>
            </div>
          </div>

          {profileData.bio && (
            <div
              className={`font-medium text-[12px] py-2 ${
                mounted && resolvedTheme === "light"
                  ? "text-neutral-700"
                  : "text-neutral-400"
              }`}
            >
              <p>{profileData.bio}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button className="p-1 rounded-full cursor-pointer hover:scale-102 transition-transform duration-200 active:scale-95">
              <Image
                src="/icons/addStory.svg"
                alt="Add Story"
                width={136}
                height={52}
              />
            </button>
            <Link href="/edit-profile">
              <button className="p-1 rounded-full cursor-pointer hover:scale-102 transition-transform duration-200 active:scale-95">
                <Image
                  src="/icons/edit.svg"
                  alt="Edit"
                  width={52}
                  height={52}
                />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-8">
        <div className="px-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            My Images
          </h1>
          <Swiper spaceBetween={5} slidesPerView={"auto"}>
            {(images.length
              ? images
              : [
                  {
                    id: 1,
                    src: safeSrc(profileData.profileImage),
                    alt: "profile",
                  },
                ]
            ).map((img) => (
              <SwiperSlide
                key={img.id}
                className="!w-[172px] !h-[229px] bg-white rounded-2xl overflow-hidden "
              >
                <div className="relative h-full w-full">
                  <Image
                    src={safeSrc(img.src)}
                    alt={img.alt}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="172px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* About Me */}
        {profileData.aboutMe.length > 0 && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
              About Me
            </h1>
            <div className="flex flex-wrap gap-2">
              {profileData.aboutMe.map((it, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]"
                >
                  {it.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Looking For */}
        {(profileData.lookingFor.relationshipType ||
          profileData.lookingFor.genderPreference) && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
              I'm Looking for
            </h1>
            <div className="flex flex-wrap gap-2">
              {profileData.lookingFor.relationshipType && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {titleCase(profileData.lookingFor.relationshipType)}
                </div>
              )}
              {profileData.lookingFor.genderPreference && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {profileData.lookingFor.genderPreference}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {profileData.hobbies.length > 0 && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
              My Hobbies
            </h1>
            <div className="flex flex-wrap gap-2">
              {profileData.hobbies.map((h, i) => (
                <div
                  key={`${h}-${i}`}
                  className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]"
                >
                  {titleCase(h)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifestyle */}
        {Object.values(profileData.lifestyle).some(Boolean) && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
              My Lifestyle
            </h1>
            <div className="flex flex-wrap gap-2">
              {profileData.lifestyle.drink && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {titleCase(profileData.lifestyle.drink)}
                </div>
              )}
              {profileData.lifestyle.smoke && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {titleCase(profileData.lifestyle.smoke)}
                </div>
              )}
              {profileData.lifestyle.diet && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {titleCase(profileData.lifestyle.diet)}
                </div>
              )}
              {profileData.lifestyle.travel && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {titleCase(profileData.lifestyle.travel)}
                </div>
              )}
              {profileData.lifestyle.pets && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {titleCase(profileData.lifestyle.pets)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Accounts */}
        {profileData.socialAccounts.length > 0 && (
          <div className="px-4 pb-5">
            <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
              My Social Accounts
            </h1>
            <div className="flex gap-2">
              {profileData.socialAccounts.map((account, index) => {
                const href = account.username; // full URL saved
                const p = platformFromLink(href);
                return (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="select-none"
                    title={`View ${p} profile`}
                  >
                    <Image
                      src={ICONS[p]}
                      alt={p}
                      width={36}
                      height={36}
                      className="select-none"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
