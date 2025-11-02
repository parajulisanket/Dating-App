"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import NextButton from "@/components/ui/NextButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AddressPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  const locations = [
    { key: "Kathmandu, Nepal", value: "Kathmandu, Nepal" },
    { key: "Pokhara, Nepal", value: "Pokhara, Nepal" },
    { key: "Biratnagar, Nepal", value: "Biratnagar, Nepal" },
    { key: "Dallas, USA", value: "Dallas, USA" },
    { key: "Other", value: "Other" },
  ];

  const isValid = address.trim().length > 0;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push("/signup/zodiac");
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setAddress(
          `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        );
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    // Phone view container: header / content / footer
    <div className="w-full max-w-[425px] min-h-svh grid grid-rows-[auto_1fr_auto] bg-background overflow-hidden">
      {/* HEADER: back chevron (top-left) */}
      <header className="flex flex-col items-start px-4 pt-6">
        <Link
          href="/signup/dob"
          aria-label="Back"
          className="text-heading px-2 -ml-2 rounded-full"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
      </header>

      {/* CONTENT: title + select */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          Where do you live
          <br />
          currently?
        </h1>

        <form id="address-form" onSubmit={onSubmit} className="mt-8 ">
          <Select onValueChange={setAddress}>
            <SelectTrigger className="w-full rounded-[16px] px-4 py-[14px] border border-neutral-300 text-[16px]">
              <SelectValue
                placeholder="Select your address"
                className={address ? "text-neutral-900" : "text-neutral-500"}
              />
            </SelectTrigger>
            <SelectContent className="border border-neutral-200 rounded-2xl">
              {locations.map((location) => (
                <SelectItem key={location.key} value={location.value}>
                  {location.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
      </main>

      {/* FOOTER: helper link + Next button (inside view) */}
      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2">
        <button
          type="button"
          onClick={useDeviceLocation}
          className="mb-4 block mx-auto text-heading text-base font-medium"
        >
          Turn on your device location instead.
        </button>

        <NextButton disabled={!isValid} form="address-form" className="w-full">
          Next
        </NextButton>
      </footer>
    </div>
  );
}
