"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const HelpCenter = () => {
  const HelpCenterList = [
    {
      heading: "🔐 Account & Login",
      body: "Trouble signing in or updating your info? Find quick solutions here.",
    },
    {
      heading: "💕 Matches & Messages",
      body: "Learn how matching works and get tips for better conversations.",
    },
    {
      heading: "💳 Subscriptions & Payments",
      body: "Trouble signing in or updating your info? Find quick solutions here.",
    },
    {
      heading: "🛡️ Safety & Privacy",
      body: "Trouble signing in or updating your info? Find quick solutions here.",
    },
  ];

  const containerHeight = `calc(100dvh)`;

  return (
    <div
      className="no-scrollbar scroll-smooth "
      style={{
        height: containerHeight,
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        overflowY: "auto",
      }}
    >
      <main className="min-h-screen">
        <div className="border-b border-neutral-200">
          <div className="bg-white px-4 py-4 flex items-center gap-3 text-[#F92FA2] ml-1 ">
            <Link
              href="/settings/help-support"
              aria-label="Back"
              className="rounded-full"
            >
              <ChevronLeft className="" size={24} strokeWidth={1.5} />
            </Link>

            <h1 className="text-[24px] font-bold leading-[36px]">
              Help Center
            </h1>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-8">
            <p className="text-[14px] leading-[21px] font-medium">
              Need a hand? You’re in the right place. Our Help Center is here to
              guide you through everything — from setting up your profile to
              managing your account and keeping your experience safe.
            </p>
            <div className="flex flex-col gap-1">
              {HelpCenterList.map((help, index) => {
                return (
                  <div className="p-4 flex flex-col gap-2 bg-neutral-1000/5 rounded-2xl">
                    <h1 className="text-[16px] font-bold leading-[20px] flex items-center">
                      {help.heading}
                    </h1>
                    <p className="font-medium text-[14px] leading-[21px] text-neutral-800">
                      {help.body}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[24px] font-bold leading-[36px]">
                Still need help?
              </h2>
              <p className="text-[14px] leading-[21px] font-medium text-neutral-800">
                Our support team is just a message away! Contact us at{" "}
                <Link
                  className="text-neutral-1000 text-[16px] leading-[24px]"
                  href=""
                >
                  support@yourapp.com
                </Link>{" "}
                — we’ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
