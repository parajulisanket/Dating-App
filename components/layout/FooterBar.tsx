// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";

// type FooterBarProps = {
//   likeCount?: number;
//   unreadCount?: number;
//   className?: string;
// };

// const ICON_SIZE = 24;

// function TabIcon({
//   active,
//   activeSrc,
//   inactiveSrc,
//   alt,
//   size = ICON_SIZE,
//   className,
// }: {
//   active: boolean;
//   activeSrc: string;
//   inactiveSrc: string;
//   alt: string;
//   size?: number;
//   className?: string;
// }) {
//   return (
//     <img
//       src={active ? activeSrc : inactiveSrc}
//       alt={alt}
//       width={size}
//       height={size}
//       className={cn("tab-icon block shrink-0", className)}
//       draggable={false}
//     />
//   );
// }

// export default function FooterBar({
//   likeCount = 0,
//   unreadCount = 0,
//   className,
// }: FooterBarProps) {
//   const pathname = usePathname();

//   const isDiscover =
//     pathname === "/" || pathname === "/home" || pathname?.startsWith("/home");
//   const isLikes =
//     pathname?.startsWith("/match") || pathname?.startsWith("/likes");
//   const isChat = pathname?.startsWith("/messages");
//   const isProfile = pathname?.startsWith("/profile");

//   return (
//     <footer
//       className={cn(
//         "footer-shell bg-footer footer-safe shadow-[0px_-2px_8px_0px_#0000001A] max-w-[425px] w-full  ",
//         className
//       )}
//     >
//       <div className="mx-auto w-full   ">
//         <ul className="grid grid-cols-4 items-center">
//           {/* home */}
//           <li className="flex justify-center min-w-[93px]">
//             {isDiscover ? (
//               <Link
//                 href="/home"
//                 aria-current="page"
//                 className={cn(
//                   "pill pill--active",

//                   "max-w-[108px] w-full justify-center whitespace-nowrap"
//                 )}
//               >
//                 <TabIcon
//                   active
//                   activeSrc="/icons/discover.svg"
//                   inactiveSrc="/icons/discover-inactive.svg"
//                   alt="Discover"
//                 />
//                 <span className="text-xs tracking-wide font-bold">
//                   Discover
//                 </span>
//               </Link>
//             ) : (
//               <Link
//                 href="/home"
//                 aria-label="Discover"
//                 className="grid place-items-center"
//               >
//                 <TabIcon
//                   active={false}
//                   activeSrc="/icons/discover.svg"
//                   inactiveSrc="/icons/discover-inactive.svg"
//                   alt="Discover"
//                 />
//               </Link>
//             )}
//           </li>

//           {/* match */}
//           <li className="flex justify-center min-w-[93px]">
//             {isLikes ? (
//               <Link
//                 href="/match"
//                 aria-current="page"
//                 className={cn(
//                   "pill pill--active",
//                   "max-w-[108px] w-full justify-center whitespace-nowrap"
//                 )}
//               >
//                 <TabIcon
//                   active
//                   activeSrc="/icons/match.svg"
//                   inactiveSrc="/icons/match-inactive.svg"
//                   alt="Match"
//                 />
//                 <span className="text-xs tracking-wide font-bold">Match</span>
//                 {likeCount > 0 && (
//                   <span className="badge ml-2 static translate-x-0 translate-y-0">
//                     {likeCount > 99 ? "99+" : likeCount}
//                   </span>
//                 )}
//               </Link>
//             ) : (
//               <Link
//                 href="/match"
//                 aria-label="Match"
//                 className="relative grid place-items-center"
//               >
//                 <TabIcon
//                   active={false}
//                   activeSrc="/icons/match.svg"
//                   inactiveSrc="/icons/match-inactive.svg"
//                   alt="Match"
//                 />
//                 {likeCount > 0 && (
//                   <span className="badge">
//                     {likeCount > 99 ? "99+" : likeCount}
//                   </span>
//                 )}
//               </Link>
//             )}
//           </li>

//           {/* chat */}
//           <li className="flex justify-center min-w-[93px]">
//             {isChat ? (
//               <Link
//                 href="/messages"
//                 aria-current="page"
//                 className={cn(
//                   "pill pill--active",
//                   "max-w-[108px] w-full justify-center whitespace-nowrap"
//                 )}
//               >
//                 <TabIcon
//                   active
//                   activeSrc="/icons/chat.svg"
//                   inactiveSrc="/icons/chat-inactive.svg"
//                   alt="Chat"
//                 />
//                 <span className="text-xs tracking-wide font-bold">Message</span>
//                 {unreadCount > 0 && (
//                   <span className="badge ml-2 static translate-x-0 translate-y-0">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </span>
//                 )}
//               </Link>
//             ) : (
//               <Link
//                 href="/messages"
//                 aria-label="Chat"
//                 className="relative grid place-items-center"
//               >
//                 <TabIcon
//                   active={false}
//                   activeSrc="/icons/chat.svg"
//                   inactiveSrc="/icons/chat-inactive.svg"
//                   alt="Chat"
//                 />
//                 {unreadCount > 0 && (
//                   <span className="badge">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </span>
//                 )}
//               </Link>
//             )}
//           </li>

//           {/* profile */}
//           <li className="flex justify-center min-[86px]">
//             {isProfile ? (
//               <Link
//                 href="/profile"
//                 aria-current="page"
//                 className={cn(
//                   "pill pill--active",
//                   "max-w-[108px] w-full justify-center whitespace-nowrap"
//                 )}
//               >
//                 <TabIcon
//                   active
//                   activeSrc="/icons/profile.svg"
//                   inactiveSrc="/icons/profile-inactive.svg"
//                   alt="Profile"
//                 />
//                 <span className="text-xs tracking-wide font-bold">Profile</span>
//               </Link>
//             ) : (
//               <Link
//                 href="/profile"
//                 aria-label="Profile"
//                 className="grid place-items-center"
//               >
//                 <TabIcon
//                   active={false}
//                   activeSrc="/icons/profile.svg"
//                   inactiveSrc="/icons/profile-inactive.svg"
//                   alt="Profile"
//                 />
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </footer>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, Variants, AnimatePresence, Transition } from "framer-motion";

type FooterBarProps = {
  likeCount?: number;
  unreadCount?: number;
  className?: string;
};

const ICON_SIZE = 24;
const TAB_MIN_W = "min-w-[93px]";

function TabIcon({
  active,
  activeSrc,
  inactiveSrc,
  alt,
  size = ICON_SIZE,
  className,
}: {
  active: boolean;
  activeSrc: string;
  inactiveSrc: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={active ? activeSrc : inactiveSrc}
      alt={alt}
      width={size}
      height={size}
      className={cn("tab-icon block shrink-0", className)}
      draggable={false}
    />
  );
}

const pillVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0.5, originX: 0.5 },
  visible: {
    opacity: 1,
    scaleX: 1,
    originX: 0.5,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 500,
      damping: 30,
    } as Transition,
  },
  exit: {
    opacity: 0,
    scaleX: 0.5,
    originX: 0.5,
    transition: { duration: 0.2 } as Transition,
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1 } },
  exit: { opacity: 0 },
};

export default function FooterBar({
  likeCount = 0,
  unreadCount = 0,
  className,
}: FooterBarProps) {
  const pathname = usePathname();

  const isDiscover =
    pathname === "/" || pathname === "/home" || pathname?.startsWith("/home");
  const isLikes =
    pathname?.startsWith("/match") || pathname?.startsWith("/likes");
  const isChat = pathname?.startsWith("/messages");
  const isProfile = pathname?.startsWith("/profile");

  return (
    <footer
      className={cn(
        "footer-shell bg-footer footer-safe shadow-[0px_-2px_8px_0px_#0000001A] max-w-[425px] w-full",
        className
      )}
    >
      <div className="mx-auto w-full">
        <ul className="grid grid-cols-4 items-center">
          {/* Discover */}
          <li className={cn("flex justify-center", TAB_MIN_W)}>
            <AnimatePresence mode="wait" initial={false}>
              {isDiscover ? (
                <motion.div
                  key="discover-active"
                  variants={pillVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "pill pill--active",
                    "max-w-[108px] w-full justify-center whitespace-nowrap"
                  )}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center"
                  >
                    <TabIcon
                      active
                      activeSrc="/icons/discover.svg"
                      inactiveSrc="/icons/discover-inactive.svg"
                      alt="Discover"
                    />
                    <span className="text-xs tracking-wide font-bold ml-2">
                      Discover
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <Link
                  key="discover-inactive"
                  href="/home"
                  aria-label="Discover"
                  className="grid place-items-center"
                >
                  <TabIcon
                    active={false}
                    activeSrc="/icons/discover.svg"
                    inactiveSrc="/icons/discover-inactive.svg"
                    alt="Discover"
                  />
                </Link>
              )}
            </AnimatePresence>
          </li>

          {/* Match / Likes */}
          <li className={cn("flex justify-center", TAB_MIN_W)}>
            <AnimatePresence mode="wait" initial={false}>
              {isLikes ? (
                <motion.div
                  key="likes-active"
                  variants={pillVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "pill pill--active",
                    "max-w-[108px] w-full justify-center whitespace-nowrap"
                  )}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center"
                  >
                    <TabIcon
                      active
                      activeSrc="/icons/match.svg"
                      inactiveSrc="/icons/match-inactive.svg"
                      alt="Match"
                    />
                    <span className="text-xs tracking-wide font-bold ml-2">
                      Match
                    </span>
                    {likeCount > 0 && (
                      <span className="badge ml-2 static translate-x-0 translate-y-0">
                        {likeCount > 99 ? "99+" : likeCount}
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <Link
                  key="likes-inactive"
                  href="/match"
                  aria-label="Match"
                  className="relative grid place-items-center"
                >
                  <TabIcon
                    active={false}
                    activeSrc="/icons/match.svg"
                    inactiveSrc="/icons/match-inactive.svg"
                    alt="Match"
                  />
                  {likeCount > 0 && (
                    <span className="badge">
                      {likeCount > 99 ? "99+" : likeCount}
                    </span>
                  )}
                </Link>
              )}
            </AnimatePresence>
          </li>

          {/* Chat / Messages */}
          <li className={cn("flex justify-center", TAB_MIN_W)}>
            <AnimatePresence mode="wait" initial={false}>
              {isChat ? (
                <motion.div
                  key="chat-active"
                  variants={pillVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "pill pill--active",
                    "max-w-[108px] w-full justify-center whitespace-nowrap"
                  )}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center"
                  >
                    <TabIcon
                      active
                      activeSrc="/icons/chat.svg"
                      inactiveSrc="/icons/chat-inactive.svg"
                      alt="Chat"
                    />
                    <span className="text-xs tracking-wide font-bold ml-2">
                      Message
                    </span>
                    {unreadCount > 0 && (
                      <span className="badge ml-2 static translate-x-0 translate-y-0">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <Link
                  key="chat-inactive"
                  href="/messages"
                  aria-label="Chat"
                  className="relative grid place-items-center"
                >
                  <TabIcon
                    active={false}
                    activeSrc="/icons/chat.svg"
                    inactiveSrc="/icons/chat-inactive.svg"
                    alt="Chat"
                  />
                  {unreadCount > 0 && (
                    <span className="badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}
            </AnimatePresence>
          </li>

          {/* Profile */}
          <li className={cn("flex justify-center", TAB_MIN_W)}>
            <AnimatePresence mode="wait" initial={false}>
              {isProfile ? (
                <motion.div
                  key="profile-active"
                  variants={pillVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "pill pill--active",
                    "max-w-[108px] w-full justify-center whitespace-nowrap"
                  )}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center"
                  >
                    <TabIcon
                      active
                      activeSrc="/icons/profile.svg"
                      inactiveSrc="/icons/profile-inactive.svg"
                      alt="Profile"
                    />
                    <span className="text-xs tracking-wide font-bold ml-2">
                      Profile
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <Link
                  key="profile-inactive"
                  href="/profile"
                  aria-label="Profile"
                  className="grid place-items-center"
                >
                  <TabIcon
                    active={false}
                    activeSrc="/icons/profile.svg"
                    inactiveSrc="/icons/profile-inactive.svg"
                    alt="Profile"
                  />
                </Link>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>
    </footer>
  );
}
