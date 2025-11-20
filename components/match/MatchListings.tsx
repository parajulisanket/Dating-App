"use client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React from "react";
import useAxiosAuth from "@/app/hook/useAxiosAuth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type MatchItem = {
  id: number;
  profileId: number;
  userId?: number;
  name: string;
  age: number;
  distanceKm: string;
  image: string;
};

export default function MatchListings() {
  const api = useAxiosAuth();
  const router = useRouter();
  const { authTokens } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<MatchItem | null>(null);
  const [matches, setMatches] = React.useState<MatchItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [unmatching, setUnmatching] = React.useState(false);

  const openSheet = (m: MatchItem) => {
    setSelected(m);
    setOpen(true);
  };

  const closeSheet = () => {
    if (unmatching) return;
    setOpen(false);
    setSelected(null);
  };

  // use profileId to go to profile page
  const goToProfile = (profileId: number) => {
    if (profileId === undefined || profileId === null) {
      console.error("goToProfile called with invalid profileId:", profileId);
      return;
    }
    const slug = String(profileId).trim();
    console.log("Navigating to profileId:", slug);
    router.push(`/user-profile/${slug}`);
  };
  // unmatch handler
  const handleUnmatch = async (match: MatchItem) => {
    try {
      setUnmatching(true);
      // console.log("Unmatching match_id:", match.id);
      await api.delete(`/swipe/unmatch/${match.id}/`);
      setMatches((prev) => prev.filter((m) => m.id !== match.id));
      setOpen(false);
      setSelected(null);
    } catch (err) {
      console.error("Failed to unmatch:", err);
    } finally {
      setUnmatching(false);
    }
  };

  // Fetch matches from backend
  React.useEffect(() => {
    if (!authTokens) return;
    let ignore = false;

    async function loadMatches() {
      setLoading(true);
      try {
        const res = await api.get("/swipe/matches/");
        const data = res.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
          ? data.matches
          : [];

        if (!ignore) {
          const mapped: MatchItem[] = [];

          list.forEach((m: any) => {
            const profileIdRaw =
              m.profile_id ?? // preferred: explicit profile_id
              m.id ?? // fallback: maybe id is profile id
              null;

            if (profileIdRaw === null || profileIdRaw === undefined) {
              console.warn("Match item has no profile id, skipping:", m);
              return; // skip this match
            }

            const img =
              m.profile_pic ||
              m.images_list?.[0]?.photo ||
              "/images/fallback.jpg";

            const dist =
              typeof m.distance === "number"
                ? `${m.distance.toFixed(1)} Km`
                : typeof m.distance_km === "number"
                ? `${m.distance_km.toFixed(1)} Km`
                : "N/A";

            mapped.push({
              id: m.match_id ?? m.id, // match row id for key
              profileId: Number(profileIdRaw), // what /user/detail/:pk/ uses
              userId: m.user_id,
              name: m.full_name ?? m.name,
              age: m.age,
              distanceKm: dist,
              image: img,
            });
          });

          // console.log("Mapped matches:", mapped);
          setMatches(mapped);
        }
      } catch (err) {
        console.error("Match fetch failed:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadMatches();
    return () => {
      ignore = true;
    };
  }, [api, authTokens]);

  return (
    <>
      <div
        className="no-scrollbar scroll-smooth pt-4 pb-14 h-[calc(100svh-116px)] md:max-h-[776.54px]"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          overflowY: "auto",
        }}
      >
        <section className="px-4">
          {loading && (
            <p className="text-primary-500 flex justify-center items-center h-screen">
              Loading matches…
            </p>
          )}

          {!loading && matches.length === 0 && (
            <p className="text-primary-500 flex justify-center items-center h-screen">
              No matches yet ❤️
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {matches.map((m) => (
              <article
                key={m.id}
                className="relative overflow-hidden rounded-[16px] bg-neutral-200 cursor-pointer"
                onClick={() => goToProfile(m.profileId)} // profileId, never undefined
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* top-right menu */}
                <button
                  aria-label="Card menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    openSheet(m);
                  }}
                  className="absolute right-4 top-3 text-white"
                >
                  <MoreHorizontal size={20} />
                </button>

                {/* text overlay */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#570074] to-transparent" />
                  <div className="relative p-2 text-white">
                    <div className="flex items-center gap-1 text-[18px] font-bold leading-tight">
                      {m.name}, {m.age}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <img src={"/icons/MapPin.svg"} className="w-4 h-4" />
                      <span>{m.distanceKm}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Sheet */}
      {open && selected && (
        <div
          className="absolute inset-0 z-[1000] bg-black/50"
          onClick={closeSheet}
        >
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[425px]">
            <div
              className="rounded-t-3xl bg-background p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl border border-[#F92FA233] bg-[#FEE9F5] p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={selected.image}
                      alt={`${selected.name} avatar`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="text-[20px] font-extrabold leading-none text-heading">
                      {selected.name}, {selected.age}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-heading text-sm font-semibold">
                      <img src="/icons/location.svg" className="w-4 h-4" />
                      {selected.distanceKm}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-1">
                <button
                  disabled={unmatching}
                  onClick={() => handleUnmatch(selected)}
                  className="flex w-full items-center gap-2 py-3 font-bold text-primary-500"
                >
                  <img src={"/icons/XCircle.svg"} className="w-7 h-7" />
                  {unmatching ? "Unmatching..." : "Unmatch"}
                </button>

                <button className="flex w-full items-center gap-2 py-3 font-bold text-primary-500">
                  <img
                    src={"/icons/ChatCircleDots Stroke.svg"}
                    className="w-7 h-7"
                  />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
