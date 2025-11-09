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
}
interface ImageData {
  id: number;
  src: string;
  alt: string;
}

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

// robust find helpers
function isObj(x: any) {
  return x && typeof x === "object";
}
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

// Make relative URLs absolute for Next/Image
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
  return absolutize(maybe || undefined) || fallback;
}

//  component
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
      profileImage: "",
      isVerified: false,
      aboutMe: [],
      lookingFor: {},
      hobbies: [],
      lifestyle: {},
    }),
    []
  );

  const [profileData, setProfileData] = useState<ProfileData>(demoProfile);
  const [images, setImages] = useState<ImageData[]>([]);

  function mapApiToProfile(root: any): {
    profile: ProfileData;
    imgs: ImageData[];
  } {
    // Some APIs wrap the object under {profile} or {data}
    const json = root?.profile ?? root?.data ?? root ?? {};

    // core fields
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

    // relationship + interested_in
    const relationship = toStr(
      deepFindFirst(json, /(relationship(_status)?|looking[_-]?for)/i)
    );
    const interestedIn = toStr(
      deepFindFirst(json, /(interested[_-]?in|gender[_-]?preference)/i)
    );

    // hobbies (string[] or {name}[])
    let hobbies: string[] = [];
    const hobbiesNode = deepFindFirst(json, /(hobby|hobbies|interests)/i);
    if (Array.isArray(hobbiesNode)) {
      hobbies = hobbiesNode
        .map((h: any) =>
          typeof h === "string" ? h : toStr(h?.name ?? h?.label ?? h?.title)
        )
        .filter(Boolean);
    }

    // lifestyle (nested or flat)
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

    // profile photo
    const primaryPhoto = toStr(
      deepFindFirst(
        json,
        /(profile[_-]?image|profile[_-]?photo|avatar(_url)?)/i
      )
    );

    // gallery images (scan for common arrays that contain {url|image|photo|file|src})
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

    // About me chips
    const aboutMe: AboutMeItem[] = [];
    const gender = toStr(deepFindFirst(json, /(gender|sex)/i));
    const zodiac = toStr(deepFindFirst(json, /(zodiac)/i));
    const sexualOrientation = toStr(
      deepFindFirst(json, /(sexual[_-]?orientation|orientation)/i)
    );
    const education = toStr(
      deepFindFirst(json, /(education|study|university|college)/i)
    );
    const height = toStr(deepFindFirst(json, /(height)/i));

    if (gender) aboutMe.push({ value: titleCase(gender) });
    if (zodiac) aboutMe.push({ value: titleCase(zodiac) });
    if (sexualOrientation) aboutMe.push({ value: sexualOrientation });
    if (education) aboutMe.push({ value: education });
    if (height) aboutMe.push({ value: height });

    const profile: ProfileData = {
      name: fullName,
      age,
      location,
      distance: "",
      bio,
      profileImage: safeSrc(primaryPhoto),
      isVerified: isVerifiedBool,
      aboutMe,
      lookingFor: {
        relationshipType: relationship || undefined,
        genderPreference: interestedIn || undefined,
      },
      hobbies,
      lifestyle,
    };

    // If there is no primary photo, use first gallery image
    if (!primaryPhoto && gallery.length) {
      profile.profileImage = gallery[0].src;
    }

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
        console.log("[MyInfo] profile-detail payload:", raw);
        const { profile, imgs } = mapApiToProfile(raw);
        setProfileData((p) => ({ ...p, ...profile }));
        if (imgs.length) setImages(imgs);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          try {
            const raw2 = await fetchWith("JWT");
            if (cancelled) return;
            console.log("[MyInfo] profile-detail payload (JWT):", raw2);
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

  return (
    <div
      className="no-scrollbar scroll-smooth h-[calc(100svh-116px)] md:max-h-[776.54px]"
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
              src={safeSrc(profileData.profileImage)}
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
            <div className="font-medium text-[12px] text-[#777777] py-2">
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
                className="!w-[172px] !h-[229px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
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

        {/* Social (static for now) */}
        <div className="px-4 pb-4">
          <h1 className="text-[16px] leading-[20px] pb-2 font-bold">
            My Social Accounts
          </h1>
          <div className="flex gap-2">
            <Image
              src="/facebook.svg"
              alt="facebook"
              width={36}
              height={36}
              className="select-none"
            />
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={32}
              height={32}
              className="select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
