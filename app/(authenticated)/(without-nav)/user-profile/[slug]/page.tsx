"use client";
import { Header } from "@/components/UserProfile/Header";
import { UserInfo } from "@/components/UserProfile/UserInfo";
import { useState } from "react";
import { BottomSheetMenu } from "@/components/UserProfile/BottomSheet";
import { AnimatePresence, motion } from "framer-motion";

type UserPageProps = {
  params: {
    id: string;
  };
};
export const slideUpVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
};
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
export default function UserPage({ params }: UserPageProps) {
  const { id } = params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="max-md:min-h-dvh max-h-[897.22px] flex flex-col relative ">
      <div className="sticky top-0 rounded-t-4xl bg-background z-40">
        <Header setIsMenuOpen={setIsMenuOpen} />
      </div>
      <main className="flex-1">
        <UserInfo id={id} />
      </main>

      {/* Bottom Sheet Portal */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop - Sibling 1 */}
            <motion.div
              onClick={() => setIsMenuOpen(false)}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="fixed bg-black/40 inset-0 z-40"
            ></motion.div>

            {/* Bottom Sheet Container - Sibling 2 */}
            <motion.div
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute  bottom-0 w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <BottomSheetMenu
                id={id}
                onClose={() => setIsMenuOpen(false)}
                userName="Shreya"
                userAge={24}
                userImage="/profile1.jpg"
                isVerified={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
