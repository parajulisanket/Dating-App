"use client";

import { useEffect, useState } from "react";
import useAxiosAuth from "@/app/hook/useAxiosAuth";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/UserProfile/Header";
import { UserInfo } from "@/components/UserProfile/UserInfo";
import { BottomSheetMenu } from "@/components/UserProfile/BottomSheet";

export type SocialLink = {
  id: number;
  link_url: string;
  platform: string;
};

export type LifestyleBackend = {
  id: number;
  drink_choice: string;
  smoke_choice: string;
  active_choice: string;
  diet_choice: string;
  pet_choice: string;
  travel_choice: string;
};

export type ProfileUser = {
  id: number;
  full_name: string;
  gender?: string | null;
  profile_pic?: string | null;
  dob?: string | null;
  bio?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;

  user_id?: number;
  age?: number;

  hobbies_list?: { id: number; name: string; predefined: boolean }[];
  images_list?: { id: number; photo: string }[];

  interested_in?: string | null;
  relationship?: string | null;
  sexual_orientation?: string | null;
  show_orientation?: boolean;

  social_links?: SocialLink[];

  zodiac_sign?: string | null;
  show_zodiac?: boolean;

  lifestyle?: LifestyleBackend;

  // flattened lifestyle fields
  drink?: string | null;
  smoke?: string | null;
  active?: string | null;
  diet?: string | null;
  travel?: string | null;
  pets?: string | null;

  relationship_type?: string | null;
  gender_preference?: string | null;
  education?: string | null;
  height?: string | null;

  is_verified?: boolean | null;
};

type PageProps = {
  params: {
    slug: string;
  };
};

const getAgeFromDob = (dob?: string | null) => {
  if (!dob) return undefined;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return undefined;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export default function UserProfilePage({ params }: PageProps) {
  const profileId = params.slug;

  const api = useAxiosAuth();
  const { authTokens } = useAuth();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<{ data: ProfileUser }>(
          `/user/detail/${profileId}/`,
          {
            headers: authTokens?.access
              ? { Authorization: `Bearer ${authTokens.access}` }
              : undefined,
          }
        );

        if (!ignore) {
          const apiUser = res.data.data;

          const normalizedUser: ProfileUser = {
            ...apiUser,
            drink: apiUser.lifestyle?.drink_choice ?? apiUser.drink ?? null,
            smoke: apiUser.lifestyle?.smoke_choice ?? apiUser.smoke ?? null,
            active: apiUser.lifestyle?.active_choice ?? apiUser.active ?? null,
            diet: apiUser.lifestyle?.diet_choice ?? apiUser.diet ?? null,
            travel: apiUser.lifestyle?.travel_choice ?? apiUser.travel ?? null,
            pets: apiUser.lifestyle?.pet_choice ?? apiUser.pets ?? null,
          };

          setUser(normalizedUser);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        if (!ignore) {
          setError("Failed to load user profile.");
          setUser(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      ignore = true;
    };
  }, [api, profileId, authTokens?.access]);

  if (loading) {
    return (
      <div className=" text-primary-500 flex justify-center items-center h-screen">
        Loading profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-primary-500 flex justify-center items-center h-s">
        {error ?? "User not found."}
      </div>
    );
  }

  const age = user.age ?? getAgeFromDob(user.dob);

  const mainImage =
    user.profile_pic ?? user.images_list?.[0]?.photo ?? "/profile1.jpg";

  return (
    <div className="max-md:min-h-screen max-h-[897.22px] flex flex-col relative">
      <div className="sticky top-0 rounded-t-4xl bg-background z-40">
        <Header setIsMenuOpen={setIsMenuOpen} name={user.full_name} />
      </div>

      <main className="flex-1">
        <UserInfo user={user} age={age} mainImage={mainImage} />
      </main>

      {isMenuOpen && (
        <div className="absolute bottom-0 w-full z-50">
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed bg-black/40 -z-40 inset-0"
          />
          <div onClick={(e) => e.stopPropagation()}>
            <BottomSheetMenu
              id={String(user.id)}
              onClose={() => setIsMenuOpen(false)}
              userName={user.full_name}
              userAge={age ?? 0}
              userImage={mainImage}
              isVerified={!!user.is_verified}
            />
          </div>
        </div>
      )}
    </div>
  );
}
