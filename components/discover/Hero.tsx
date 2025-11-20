// "use client";

// import React, {
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
//   useEffect,
// } from "react";
// import Image from "next/image";
// import SwipeButtons from "@/components/discover/SwipeButtons";
// import { useAuth } from "@/context/AuthContext";
// import useAxiosAuth from "@/app/hook/useAxiosAuth";

// interface TimelineUserApi {
//   user_id: number;
//   id: number;
//   full_name: string;
//   profile_pic: string | null;
//   dob: string;
//   bio: string | null;
//   location: string;
//   age: number;
//   distance?: number | string | null;
//   distance_km?: number | null;
//   images_list: { id: number; photo: string }[];
// }

// interface TimelinePage {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: TimelineUserApi[];
// }

// type TimelineResponse = TimelineUserApi[] | TimelinePage;

// type Person = {
//   id: string;
//   name: string;
//   age: number;
//   distance: string;
//   photos: string[];
// };

// function formatDistance(u: TimelineUserApi): string {
//   if (typeof u.distance === "number") return `${u.distance.toFixed(1)} Km`;
//   if (typeof u.distance === "string") return u.distance;
//   if (typeof u.distance_km === "number")
//     return `${u.distance_km.toFixed(1)} Km`;

//   return u.location || "";
// }

// function mapTimelineUserToPerson(u: TimelineUserApi): Person {
//   const imgs = (u.images_list ?? []).map((i) => i.photo);

//   const photos =
//     imgs.length > 0
//       ? imgs
//       : u.profile_pic
//       ? [u.profile_pic]
//       : ["/images/fallback.jpg"];

//   return {
//     id: String(u.id),
//     name: u.full_name,
//     age: u.age,
//     distance: formatDistance(u),
//     photos,
//   };
// }

// function useHeaderFooterGaps() {
//   const [gaps, setGaps] = useState({ top: 0, bottom: 0 });

//   useLayoutEffect(() => {
//     const read = () => {
//       const header = document.querySelector("header") as HTMLElement | null;
//       const footer = document.querySelector("footer") as HTMLElement | null;
//       setGaps({
//         top: header?.offsetHeight ?? 0,
//         bottom: footer?.offsetHeight ?? 0,
//       });
//     };

//     const ro = new ResizeObserver(read);
//     document.querySelectorAll("header, footer").forEach((el) => ro.observe(el));
//     window.addEventListener("resize", read);
//     read();

//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", read);
//     };
//   }, []);

//   return gaps;
// }

// const SWIPE_THRESHOLD = 120;
// const OUT_DISTANCE = 1000;

// /** Normalize backend response to a simple array of users */
// function normalizeTimeline(
//   data: TimelineResponse | null | undefined
// ): TimelineUserApi[] {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (Array.isArray((data as TimelinePage).results)) {
//     return (data as TimelinePage).results;
//   }
//   return [];
// }

// // for random photos shuffle
// function shuffleArray<T>(arr: T[]): T[] {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// export default function Hero() {
//   const api = useAxiosAuth();
//   const { authTokens, authReady, logout } = useAuth();

//   const [stack, setStack] = useState<Person[]>([]);
//   const [gone, setGone] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [photoIndex, setPhotoIndex] = useState(0);
//   const { bottom } = useHeaderFooterGaps();

//   const cardRef = useRef<HTMLDivElement | null>(null);
//   const posX = useRef(0);
//   const posY = useRef(0);
//   const startX = useRef(0);
//   const startY = useRef(0);
//   const dragging = useRef(false);
//   const animating = useRef(false);
//   const raf = useRef<number | null>(null);

//   const topCard = useMemo(() => stack.at(-1) ?? null, [stack]);

//   useEffect(() => {
//     if (!authReady) return;

//     const accessToken = authTokens?.access ?? null;

//     if (!accessToken) {
//       setError("Please log in to see your feed.");
//       setLoading(false);
//       return;
//     }

//     let cancelled = false;

//     async function fetchTimeline(
//       prefix: "Bearer" | "JWT"
//     ): Promise<TimelineResponse> {
//       const headers = {
//         Authorization: `${prefix} ${accessToken}`,
//       };
//       const res = await api.get<TimelineResponse>("/user/timeline/", {
//         headers,
//       });
//       return res.data;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // First try with Bearer
//         const raw = await fetchTimeline("Bearer");
//         if (cancelled) return;

//         let users = normalizeTimeline(raw);

//         if (!users.length) {
//           console.error("Timeline unexpected shape:", raw);
//           setError("Invalid feed format.");
//           return;
//         }

//         const shuffled = shuffleArray(users);
//         setStack(shuffled.map(mapTimelineUserToPerson));
//       } catch (err: any) {
//         // If token prefix mismatch, try "JWT" as fallback
//         if (err?.response?.status === 401) {
//           try {
//             const raw2 = await fetchTimeline("JWT");
//             if (!cancelled) {
//               const users2 = normalizeTimeline(raw2);
//               if (users2.length) {
//                 const shuffled2 = shuffleArray(users2);
//                 setStack(shuffled2.map(mapTimelineUserToPerson));
//                 return;
//               }
//             }
//           } catch {
//             if (!cancelled) logout();
//             return;
//           }
//         }

//         if (!cancelled) {
//           console.error("Timeline load error:", err);
//           setError("Could not load feed.");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [authReady, authTokens?.access, api, logout]);

//   const setStyle = (el: HTMLElement | null, x: number, y: number) => {
//     if (!el) return;
//     el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${x / 15}deg)`;
//   };

//   const resetStyle = (el: HTMLElement | null) => {
//     if (!el) return;
//     el.style.transition = "transform 200ms ease";
//     el.style.transform = "translate3d(0,0,0) rotate(0deg)";
//     setTimeout(() => {
//       if (el) el.style.transition = "";
//     }, 200);
//   };

//   const fling = (dir: "left" | "right") => {
//     if (!topCard || animating.current) return;
//     animating.current = true;

//     const el = cardRef.current;
//     const x = dir === "right" ? OUT_DISTANCE : -OUT_DISTANCE;

//     if (el) {
//       el.style.transition = "transform 800ms cubic-bezier(0.23, 1, 0.33, 1)";
//       el.style.transform = `translate3d(${x}px, ${posY.current}px, 0) rotate(${
//         x / 15
//       }deg)`;
//     }

//     setTimeout(() => {
//       setGone((g) => [...g, topCard]);
//       setStack((s) => s.slice(0, -1));
//       posX.current = 0;
//       posY.current = 0;
//       animating.current = false;
//     }, 800);
//   };

//   const handlePointerDown = (e: React.PointerEvent) => {
//     if (!topCard || animating.current) return;
//     dragging.current = true;

//     const el = cardRef.current;
//     if (el) {
//       el.style.transition = "";
//       el.style.willChange = "transform";
//     }

//     startX.current = e.clientX;
//     startY.current = e.clientY;
//   };

//   const handlePointerMove = (e: React.PointerEvent) => {
//     if (!dragging.current || !topCard) return;

//     posX.current = e.clientX - startX.current;
//     posY.current = e.clientY - startY.current;

//     if (raf.current === null) {
//       raf.current = requestAnimationFrame(() => {
//         setStyle(cardRef.current, posX.current, posY.current);
//         raf.current = null;
//       });
//     }
//   };

//   const finishDrag = () => {
//     dragging.current = false;

//     if (Math.abs(posX.current) > SWIPE_THRESHOLD) {
//       fling(posX.current > 0 ? "right" : "left");
//     } else {
//       resetStyle(cardRef.current);
//     }
//   };

//   const onUndo = useCallback(() => {
//     if (gone.length === 0 || animating.current) return;
//     const last = gone.at(-1);
//     setStack((s) => [...s, last]);
//     setGone((g) => g.slice(0, -1));
//   }, [gone]);

//   const showNextPhoto = () => {
//     if (!topCard) return;
//     setPhotoIndex((i) => (i + 1 < topCard.photos.length ? i + 1 : i));
//   };

//   const showPrevPhoto = () => {
//     if (!topCard) return;
//     setPhotoIndex((i) => (i - 1 >= 0 ? i - 1 : i));
//   };

//   const onCardTap = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!topCard) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;

//     if (x > rect.width / 2) showNextPhoto();
//     else showPrevPhoto();
//   };

//   if (loading)
//     return (
//       <div className="h-[80vh] flex items-center justify-center text-gray-500">
//         Loading…
//       </div>
//     );

//   if (error)
//     return (
//       <div className="h-[80vh] flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );

//   return (
//     <section
//       className="w-full z-10 h-[calc(100svh-175px)] md:max-h-[716.54px] flex items-center justify-center max-md:px-4"
//       style={{
//         marginTop: `0px`,
//         marginBottom: `${bottom}px`,
//       }}
//     >
//       <div className="h-full w-full flex items-center justify-center">
//         <div
//           className="relative rounded-[28px] overflow-hidden select-none"
//           style={{
//             width: 380,
//             maxWidth: "100%",
//             height: "100%",
//             touchAction: "pan-y",
//           }}
//         >
//           {/* Card Stack */}
//           <div className="absolute inset-0">
//             {stack.map((p, i) => {
//               const isTop = i === stack.length - 1;
//               const depth = i - (stack.length - 2);
//               const currentPhoto = isTop
//                 ? p.photos[Math.min(photoIndex, p.photos.length - 1)]
//                 : p.photos[0];

//               return (
//                 <div
//                   key={p.id}
//                   ref={isTop ? cardRef : null}
//                   className="absolute inset-0 rounded-[28px] overflow-hidden"
//                   style={{
//                     transform: isTop
//                       ? undefined
//                       : `scale(${0.985 + depth * 0.01}) translateY(${
//                           Math.abs(depth) * 12
//                         }px)`,
//                     zIndex: i,
//                     touchAction: isTop ? "none" : "auto",
//                   }}
//                   onPointerDown={isTop ? handlePointerDown : undefined}
//                   onPointerMove={isTop ? handlePointerMove : undefined}
//                   onPointerUp={isTop ? finishDrag : undefined}
//                   onPointerCancel={isTop ? finishDrag : undefined}
//                   onClick={isTop ? onCardTap : undefined}
//                 >
//                   <Image
//                     src={currentPhoto}
//                     alt={p.name}
//                     fill
//                     sizes="(max-width: 1024px) 393px, 393px"
//                     className="object-cover"
//                     draggable={false}
//                   />

//                   {/* Purple gradient overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#340046] via-transparent to-transparent" />

//                   {/* Photo progress bars */}
//                   {p.photos.length > 1 && (
//                     <div className="absolute top-8 left-6 right-6 w-20 flex gap-1">
//                       {p.photos.map((_, idx) => (
//                         <div
//                           key={idx}
//                           className={`h-1 flex-1 rounded-full ${
//                             idx <= photoIndex ? "bg-white" : "bg-white/50"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   )}

//                   {/* Dark bottom gradient */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

//                   {/* Info overlay */}
//                   <div className="absolute left-6 right-6 bottom-30 text-white z-20">
//                     <h2 className="text-[28px] font-bold flex items-center gap-2">
//                       {p.name}, {p.age}
//                     </h2>

//                     <p className="text-sm opacity-90 flex items-center gap-1">
//                       <img src="/icons/MapPin.svg" className="w-4 h-4" alt="" />
//                       {p.distance}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Buttons */}
//           <div
//             className="absolute left-0 right-0 flex items-center justify-center z-30"
//             style={{
//               bottom: `calc(env(safe-area-inset-bottom, 0px) + 18px)`,
//               pointerEvents: "auto",
//             }}
//           >
//             <SwipeButtons
//               onUndo={onUndo}
//               onLike={() => fling("right")}
//               onNope={() => fling("left")}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// code 2

"use client";

import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import SwipeButtons from "@/components/discover/SwipeButtons";
import { useAuth } from "@/context/AuthContext";
import useAxiosAuth from "@/app/hook/useAxiosAuth";
import MatchPage from "@/components/MatchPage/MatchPage";

interface TimelineUserApi {
  user_id: number;
  id: number;
  full_name: string;
  profile_pic: string | null;
  dob: string;
  bio: string | null;
  location: string;
  age: number;
  distance?: number | string | null;
  distance_km?: number | null;
  images_list: { id: number; photo: string }[];
}

interface TimelinePage {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimelineUserApi[];
}

type TimelineResponse = TimelineUserApi[] | TimelinePage;

type Person = {
  /** timeline card id – good for React keys */
  id: number;
  /** actual backend user id – THIS is what swipe API needs */
  userId: number;
  name: string;
  age: number;
  distance: string;
  photos: string[];
};

function formatDistance(u: TimelineUserApi): string {
  if (typeof u.distance === "number") return `${u.distance.toFixed(1)} Km`;
  if (typeof u.distance === "string") return u.distance;
  if (typeof u.distance_km === "number")
    return `${u.distance_km.toFixed(1)} Km`;

  return u.location || "";
}

function mapTimelineUserToPerson(u: TimelineUserApi): Person {
  const imgs = (u.images_list ?? []).map((i) => i.photo);

  const photos =
    imgs.length > 0
      ? imgs
      : u.profile_pic
      ? [u.profile_pic]
      : ["/images/fallback.jpg"];

  return {
    id: u.id, // timeline id
    userId: u.user_id, // REAL user pk for swipe
    name: u.full_name,
    age: u.age,
    distance: formatDistance(u),
    photos,
  };
}

function useHeaderFooterGaps() {
  const [gaps, setGaps] = useState({ top: 0, bottom: 0 });

  useLayoutEffect(() => {
    const read = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      const footer = document.querySelector("footer") as HTMLElement | null;
      setGaps({
        top: header?.offsetHeight ?? 0,
        bottom: footer?.offsetHeight ?? 0,
      });
    };

    const ro = new ResizeObserver(read);
    document.querySelectorAll("header, footer").forEach((el) => ro.observe(el));
    window.addEventListener("resize", read);
    read();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);

  return gaps;
}

const SWIPE_THRESHOLD = 120;
const OUT_DISTANCE = 1000;

/** Normalize backend response to a simple array of users */
function normalizeTimeline(
  data: TimelineResponse | null | undefined
): TimelineUserApi[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as TimelinePage).results)) {
    return (data as TimelinePage).results;
  }
  return [];
}

// for random photos shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Hero() {
  const api = useAxiosAuth();
  const { authTokens, authReady, logout } = useAuth();

  const [stack, setStack] = useState<Person[]>([]);
  const [gone, setGone] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { bottom } = useHeaderFooterGaps();

  //  match overlay state
  const [matchData, setMatchData] = useState<{
    otherName: string;
    otherPhoto: string;
  } | null>(null);

  // TODO: replace with real logged-in user photo
  const myMainPhotoUrl = "/images/fallback.jpg";

  const cardRef = useRef<HTMLDivElement | null>(null);
  const posX = useRef(0);
  const posY = useRef(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const animating = useRef(false);
  const raf = useRef<number | null>(null);

  const topCard = useMemo(() => stack.at(-1) ?? null, [stack]);

  // reset photo index when card changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [topCard?.id]);

  useEffect(() => {
    if (!authReady) return;

    const accessToken = authTokens?.access ?? null;

    if (!accessToken) {
      setError("Please log in to see your feed.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchTimeline(
      prefix: "Bearer" | "JWT"
    ): Promise<TimelineResponse> {
      const headers = {
        Authorization: `${prefix} ${accessToken}`,
      };
      const res = await api.get<TimelineResponse>("/user/timeline/", {
        headers,
      });
      return res.data;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // First try with Bearer
        const raw = await fetchTimeline("Bearer");
        if (cancelled) return;

        let users = normalizeTimeline(raw);

        if (!users.length) {
          console.error("Timeline unexpected shape:", raw);
          setError("Invalid feed format.");
          return;
        }

        const shuffled = shuffleArray(users);
        setStack(shuffled.map(mapTimelineUserToPerson));
      } catch (err: any) {
        // If token prefix mismatch, try "JWT" as fallback
        if (err?.response?.status === 401) {
          try {
            const raw2 = await fetchTimeline("JWT");
            if (!cancelled) {
              const users2 = normalizeTimeline(raw2);
              if (users2.length) {
                const shuffled2 = shuffleArray(users2);
                setStack(shuffled2.map(mapTimelineUserToPerson));
                return;
              }
            }
          } catch {
            if (!cancelled) logout();
            return;
          }
        }

        if (!cancelled) {
          console.error("Timeline load error:", err);
          setError("Could not load feed.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, authTokens?.access, api, logout]);

  const setStyle = (el: HTMLElement | null, x: number, y: number) => {
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${x / 15}deg)`;
  };

  const resetStyle = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.transition = "transform 200ms ease";
    el.style.transform = "translate3d(0,0,0) rotate(0deg)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 200);
  };

  /**
   * swipe
   * Right  -> action = "like"
   * Left   -> action = "ignore"
   * Sends `userId` (actual user pk) as `to_user`
   */
  const fling = (dir: "left" | "right") => {
    if (!topCard || animating.current) return;
    animating.current = true;

    const toUserId = topCard.userId; // backend user id
    const action = dir === "right" ? "like" : "ignore";

    api
      .post("/swipe/", {
        to_user: toUserId,
        action,
      })
      .then((res) => {
        // if backend says it's a match, open match overlay
        if (res.data?.is_match) {
          setMatchData({
            otherName: res.data.other_user.full_name,
            otherPhoto: res.data.other_user.photo, // adjust to your actual field
          });
        }
      })
      .catch((err) => {
        console.error("Swipe API failed:", err.response?.data || err);
      });

    const el = cardRef.current;
    const x = dir === "right" ? OUT_DISTANCE : -OUT_DISTANCE;

    if (el) {
      el.style.transition = "transform 800ms cubic-bezier(0.23, 1, 0.33, 1)";
      el.style.transform = `translate3d(${x}px, ${posY.current}px, 0) rotate(${
        x / 15
      }deg)`;
    }

    setTimeout(() => {
      setGone((g) => [...g, topCard]);
      setStack((s) => s.slice(0, -1));
      posX.current = 0;
      posY.current = 0;
      animating.current = false;
    }, 800);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!topCard || animating.current) return;
    dragging.current = true;

    const el = cardRef.current;
    if (el) {
      el.style.transition = "";
      el.style.willChange = "transform";
    }

    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !topCard) return;

    posX.current = e.clientX - startX.current;
    posY.current = e.clientY - startY.current;

    if (raf.current === null) {
      raf.current = requestAnimationFrame(() => {
        setStyle(cardRef.current, posX.current, posY.current);
        raf.current = null;
      });
    }
  };

  const finishDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;

    if (Math.abs(posX.current) > SWIPE_THRESHOLD) {
      const dir = posX.current > 0 ? "right" : "left";
      fling(dir);
    } else {
      resetStyle(cardRef.current);
    }
  };

  const onUndo = React.useCallback(() => {
    if (gone.length === 0 || animating.current) return;
    const last = gone.at(-1);
    if (!last) return;

    setStack((s) => [...s, last]);
    setGone((g) => g.slice(0, -1));
  }, [gone]);

  const showNextPhoto = () => {
    if (!topCard) return;
    setPhotoIndex((i) => (i + 1 < topCard.photos.length ? i + 1 : i));
  };

  const showPrevPhoto = () => {
    if (!topCard) return;
    setPhotoIndex((i) => (i - 1 >= 0 ? i - 1 : i));
  };

  const onCardTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!topCard) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x > rect.width / 2) showNextPhoto();
    else showPrevPhoto();
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );

  if (error)
    return (
      <div className="h-[80vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!topCard) {
    return (
      <section
        className="w-full z-10 h-[calc(100svh-175px)] md:max-h-[716.54px] flex items-center justify-center max-md:px-4"
        style={{
          marginTop: `0px`,
          marginBottom: `${bottom}px`,
        }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">No more profiles nearby 👀</p>
        </div>

        {/* Match overlay can still show even if stack is empty */}
        {matchData && (
          <MatchPage
            myPhoto={myMainPhotoUrl}
            otherPhoto={matchData.otherPhoto}
            otherName={matchData.otherName}
            onSayHi={() => {
              // TODO: navigate to chat
              setMatchData(null);
            }}
            onMaybeLater={() => setMatchData(null)}
          />
        )}
      </section>
    );
  }

  return (
    <section
      className="w-full z-10 h-[calc(100svh-175px)] md:max-h-[716.54px] flex items-center justify-center max-md:px-4"
      style={{
        marginTop: `0px`,
        marginBottom: `${bottom}px`,
      }}
    >
      <div className="h-full w-full flex items-center justify-center">
        <div
          className="relative rounded-[28px] overflow-hidden select-none"
          style={{
            width: 380,
            maxWidth: "100%",
            height: "100%",
            touchAction: "pan-y",
          }}
        >
          {/* Card Stack */}
          <div className="absolute inset-0">
            {stack.map((p, i) => {
              const isTop = i === stack.length - 1;
              const depth = i - (stack.length - 2);
              const currentPhoto = isTop
                ? p.photos[Math.min(photoIndex, p.photos.length - 1)]
                : p.photos[0];

              return (
                <div
                  key={p.id}
                  ref={isTop ? cardRef : null}
                  className="absolute inset-0 rounded-[28px] overflow-hidden"
                  style={{
                    transform: isTop
                      ? undefined
                      : `scale(${0.985 + depth * 0.01}) translateY(${
                          Math.abs(depth) * 12
                        }px)`,
                    zIndex: i,
                    touchAction: isTop ? "none" : "auto",
                  }}
                  onPointerDown={isTop ? handlePointerDown : undefined}
                  onPointerMove={isTop ? handlePointerMove : undefined}
                  onPointerUp={isTop ? finishDrag : undefined}
                  onPointerCancel={isTop ? finishDrag : undefined}
                  onClick={isTop ? onCardTap : undefined}
                >
                  <Image
                    src={currentPhoto}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 393px, 393px"
                    className="object-cover"
                    draggable={false}
                  />

                  {/* Purple gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#340046] via-transparent to-transparent" />

                  {/* Photo progress bars */}
                  {p.photos.length > 1 && (
                    <div className="absolute top-8 left-6 right-6 w-20 flex gap-1">
                      {p.photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1 flex-1 rounded-full ${
                            idx <= photoIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Dark bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Info overlay */}
                  <div className="absolute left-6 right-6 bottom-30 text-white z-20">
                    <h2 className="text-[28px] font-bold flex items-center gap-2">
                      {p.name}, {p.age}
                    </h2>

                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <img src="/icons/MapPin.svg" className="w-4 h-4" alt="" />
                      {p.distance}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div
            className="absolute left-0 right-0 flex items-center justify-center z-30"
            style={{
              bottom: `calc(env(safe-area-inset-bottom, 0px) + 18px)`,
              pointerEvents: "auto",
            }}
          >
            <SwipeButtons
              onUndo={onUndo}
              onLike={() => fling("right")}
              onNope={() => fling("left")}
            />
          </div>
        </div>
      </div>

      {/* Match overlay */}
      {matchData && (
        <MatchPage
          myPhoto={myMainPhotoUrl}
          otherPhoto={matchData.otherPhoto}
          otherName={matchData.otherName}
          onSayHi={() => {
            // TODO: navigate to chat
            setMatchData(null);
          }}
          onMaybeLater={() => setMatchData(null)}
        />
      )}
    </section>
  );
}
