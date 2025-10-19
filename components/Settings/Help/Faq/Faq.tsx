"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export const Faq = () => {
  const FaqList = [
    {
      question: "1. How do I create an account?",
      ans: "We have sent you a quick verification link to confirm the change.",
    },
    {
      question: "2. How does matching work?",
      ans: "We have sent you a quick verification link to confirm the change.",
    },
    {
      question: "3. Can I change my profile information?",
      ans: "We have sent you a quick verification link to confirm the change.",
    },
    {
      question: "4. How can I report or block someone?",
      ans: "We have sent you a quick verification link to confirm the change.",
    },
    {
      question: "5. How do I delete my account?",
      ans: "We have sent you a quick verification link to confirm the change.",
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
        <div className="border-b border-borderButton">
          <div className="bg-background px-4 py-4 flex items-center gap-3 text-heading ml-1 ">
            <Link
              href="/settings/help-support"
              aria-label="Back"
              className="rounded-full"
            >
              <ChevronLeft className="" size={24} strokeWidth={1.5} />
            </Link>

            <h1 className="text-[24px] font-bold leading-[36px]">FAQ's</h1>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-8 ">
            <p className="text-justify text-[14px] leading-[21px] font-medium">
              Your privacy matters to us. We’re committed to protecting your
              personal information and keeping your dating experience safe,
              transparent, and in your control.
            </p>
            <div className="flex flex-col gap-2">
              {FaqList.map((faq, index) => {
                return (
                  <Accordion key={faq.question} type="single" collapsible>
                    <AccordionItem
                      value="item-1"
                      className="bg-neutral-1000/5 rounded-[16px]"
                    >
                      <AccordionTrigger className="p-4 font-bold  !text-[16px]">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[15px] px-2  pb-4 ">
                        {faq.ans}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
