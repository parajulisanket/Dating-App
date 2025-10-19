"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
export const PrivacyPolicy = () => {
  const PrivacyPolicyArray = [
    {
      title: "What we collect:",
      body: "When you sign up, we collect basic information like your name, email, age, photos, preferences, and location — just enough to help you find meaningful matches.",
    },
    {
      title: "How we use it:",
      body: "We use your data to improve your experience — from showing better matches to enhancing app security and personalization. Your information is never sold to third parties.",
    },
    {
      title: "Your control:",
      body: "You can edit or delete your account anytime, control what information you share, and manage notification or visibility settings right from your profile.",
    },
    {
      title: "Security:",
      body: "We use advanced encryption and verification measures to protect your data and prevent unauthorized access.",
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
      {" "}
      <main className="min-h-screen">
        <div className="border-b border-borderButton">
          <div className="bg-background px-4 py-4 flex items-center gap-3 text-heading ml-1 ">
            <Link
              href="/settings/help-support"
              aria-label="Back"
              className="rounded-full"
            >
              <ChevronLeft className="" size={24} strokeWidth={1.5} />
            </Link>

            <h1 className="text-[24px] font-bold leading-[36px]">
              Privacy Policy
            </h1>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-8 ">
            <p className="text-justify text-[14px] leading-[21px] font-medium">
              Your privacy matters to us. We’re committed to protecting your
              personal information and keeping your dating experience safe,
              transparent, and in your control.
            </p>

            {PrivacyPolicyArray.map((privacyPolicy, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <h1 className="text-[20px] leading-[30px] font-semibold">
                    {privacyPolicy.title}
                  </h1>
                  <p className="text-justify text-[14px] leading-[21px] font-medium">
                    {privacyPolicy.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h1 className="text-[20px] leading-[30px] font-semibold">
                  Questions?
                </h1>
                <p className="text-justify text-[14px] leading-[21px] font-medium">
                  If you have any concerns or requests regarding your privacy,
                  reach out to our support team at{" "}
                  <Link href="" className="text-primary-500">
                    support@yourapp.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
