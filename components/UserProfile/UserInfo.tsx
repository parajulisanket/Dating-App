"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTheme } from "next-themes";
import type { ProfileUser } from "@/app/(authenticated)/(without-nav)/user-profile/[slug]/page";

interface UserInfoProps {
  user: ProfileUser;
  age?: number;
  mainImage: string;
}

const SOCIAL_ICON_MAP: Record<string, string> = {
  facebook: "/icons/facebookBlue.svg",
  instagram: "/icons/instagramblue.svg",
  twitter: "/icons/X1.svg",
  tiktok: "/icons/tiktok.svg",
  snapchat: "/icons/snapchat.svg",
};

const capitalize = (str?: string | null) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const prettifyValue = (value?: string | null): string => {
  if (!value) return "";
  const spaced = value.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const formatRelationship = (value?: string | null): string =>
  prettifyValue(value);

const formatInterestedIn = (value?: string | null): string => {
  if (!value) return "";
  const v = value.toLowerCase();
  if (v === "man" || v === "men") return "Men";
  if (v === "woman" || v === "women") return "Women";
  if (v === "everyone") return "Everyone";
  return capitalize(v);
};

export const UserInfo = ({ user, age, mainImage }: UserInfoProps) => {
  const { resolvedTheme } = useTheme();
  const displayAge = age ?? user.age ?? 0;

  // Images
  const images =
    user.images_list && user.images_list.length > 0
      ? user.images_list.map((img) => ({
          id: img.id,
          src: img.photo,
          alt: `image-${img.id}`,
        }))
      : [{ id: 1, src: mainImage, alt: "profile" }];

  // About me
  const aboutMeItems = [
    user.gender ? { value: capitalize(user.gender) } : null,
    user.zodiac_sign && user.show_zodiac
      ? { value: capitalize(user.zodiac_sign) }
      : null,
    user.sexual_orientation && user.show_orientation
      ? { value: capitalize(user.sexual_orientation) }
      : null,
    user.education ? { value: user.education } : null,
    user.height ? { value: user.height } : null,
  ].filter(Boolean) as { value: string }[];

  // I'm looking for
  const relationshipLabel = formatRelationship(
    user.relationship ?? user.relationship_type
  );
  const interestedInLabel =
    formatInterestedIn(user.interested_in) || user.gender_preference || "";

  // Hobbies
  const hobbies = user.hobbies_list ?? [];

  // Lifestyle
  const lifestyleEntries: { value: string }[] = [];

  const drinkValue = user.drink ?? user.lifestyle?.drink_choice;
  if (drinkValue) lifestyleEntries.push({ value: drinkValue });

  const smokeValue = user.smoke ?? user.lifestyle?.smoke_choice;
  if (smokeValue) lifestyleEntries.push({ value: smokeValue });

  const activeValue = user.active ?? user.lifestyle?.active_choice;
  if (activeValue) lifestyleEntries.push({ value: activeValue });

  const dietValue = user.diet ?? user.lifestyle?.diet_choice;
  if (dietValue) lifestyleEntries.push({ value: dietValue });

  const travelValue = user.travel ?? user.lifestyle?.travel_choice;
  if (travelValue) lifestyleEntries.push({ value: travelValue });

  const petsValue = user.pets ?? user.lifestyle?.pet_choice;
  if (petsValue) lifestyleEntries.push({ value: petsValue });

  const distanceLabel =
    typeof user.distance === "number" ? `${user.distance.toFixed(1)} Km` : "";

  // Social links
  const socialLinks = user.social_links ?? [];
  const hasSocialLinks = socialLinks.length > 0;

  return (
    <div
      className="no-scrollbar scroll-smooth h-[calc(100svh-48px)] md:max-h-[850px]"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        overflowY: "auto",
      }}
    >
      <main className="flex flex-col gap-[24px] pb-5">
        {/* Profile Info Section */}
        <div className="px-4 pt-4">
          <div className="w-full h-full flex flex-col gap-4 ">
            <div className="flex h-[80px] gap-4">
              <Image
                src={mainImage}
                alt="Profile"
                width={80}
                height={80}
                className="cursor-pointer rounded-full object-cover h-[80px] w-[80px]"
              />

              <div className="flex flex-col h-[57px] text-heading">
                <div className="flex gap-2 items-center text-[24px] font-bold leading-[36px]">
                  <h1>
                    {user.full_name}
                    {displayAge ? `, ${displayAge}` : ""}
                  </h1>
                  {user.is_verified && (
                    <Image
                      src="/icons/verified.svg"
                      alt="verified"
                      width={24}
                      height={24}
                      className="cursor-pointer rounded-full object-cover h-6 w-6"
                    />
                  )}
                </div>

                <div className="flex text-[#fa51b1] dark:text-neutral-400 items-center gap-1">
                  {resolvedTheme === "light" ? (
                    <Image
                      src="/icons/location.svg"
                      alt="location"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  ) : (
                    <Image
                      src="/icons/locationDark.svg"
                      alt="location"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  )}
                  {user.location && (
                    <p className="text-[14px]">
                      {user.location}
                      {/* If you want distance with location, uncomment next line */}
                      {/* {distanceLabel ? ` · ${distanceLabel}` : ""} */}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="font-medium text-[12px] text-[#777777]">
                <p>{user.bio}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 ">
              <button
                onClick={() => console.log("Message clicked")}
                className=" rounded-full transition-transform duration-200 active:scale-95 cursor-pointer"
              >
                <Image
                  src="/icons/message.svg"
                  alt="message"
                  width={136}
                  height={52}
                  className="select-none"
                />
              </button>

              <button
                onClick={() => console.log("Like clicked")}
                className=" rounded-full transition-transform duration-200 active:scale-95 cursor-pointer"
              >
                <Image
                  src="/icons/crossicon.svg"
                  alt="love"
                  width={52}
                  height={52}
                  className="select-none"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">
              My Images
            </h1>

            <Swiper spaceBetween={5} slidesPerView={"auto"}>
              {images.map((image) => (
                <SwiperSlide
                  key={image.id}
                  className="!w-[172px] !h-[229px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-2xl"
                      sizes="172px"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* About me */}
        {aboutMeItems.length > 0 && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">
              About me
            </h1>
            <div className="flex flex-wrap gap-2">
              {aboutMeItems.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]"
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* I'm looking for */}
        {(relationshipLabel || interestedInLabel) && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">
              I'm Looking for
            </h1>
            <div className="flex flex-wrap gap-2">
              {relationshipLabel && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {relationshipLabel}
                </div>
              )}
              {interestedInLabel && (
                <div className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]">
                  {interestedInLabel}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">
              My Hobbies
            </h1>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <div
                  key={hobby.id}
                  className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]"
                >
                  {hobby.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifestyle – ONLY VALUE, no label text */}
        {lifestyleEntries.length > 0 && (
          <div className="px-4">
            <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">
              My Lifestyle
            </h1>
            <div className="flex flex-wrap gap-2">
              {lifestyleEntries.map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-capsule border border-capsule-border rounded-full text-[14px]"
                >
                  {prettifyValue(item.value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social accounts (only if user has them) */}
        {hasSocialLinks && (
          <div className="px-4 pb-4">
            <h1 className="text-[16px] leading-[20px] tracking-[0px] pb-2 font-bold">
              My Social Accounts
            </h1>
            <div className="flex gap-2">
              {socialLinks.map((link) => {
                const platformKey = link.platform.toLowerCase();
                const iconSrc = SOCIAL_ICON_MAP[platformKey];

                // if no icon mapped, skip this link to avoid broken image
                if (!iconSrc) return null;

                return (
                  <a
                    key={link.id}
                    href={link.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Image
                      src={iconSrc}
                      alt={platformKey}
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
      </main>
    </div>
  );
};
