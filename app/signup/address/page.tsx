"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
import NextButton from "@/components/ui/NextButton";

export default function AddressPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");

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
    <StepLayout
      backHref="/signup/dob"
      title="Where do you live currently?"
      footer={
        <>
          <button
            type="button"
            onClick={useDeviceLocation}
            className="mb-4 block mx-auto text-[#f72fa2] text-base text-center font-medium underline-offset-2 hover:underline"
          >
            Turn on your device location instead.
          </button>

          <NextButton disabled={!isValid} form="address-form">
            Next
          </NextButton>
        </>
      }
    >
      <form id="address-form" onSubmit={onSubmit} className="space-y-6">
        <div className="relative">
          <select
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={[
              "w-full h-14 rounded-2xl border border-neutral-300",
              "pl-5 pr-12 text-[16px] bg-white appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-[#F92FA2] focus:bg-[#F92FA2]/10",
              address ? "text-neutral-900" : "text-neutral-500",
            ].join(" ")}
          >
            <option value="" disabled>
              Select your address
            </option>
            <option value="Kathmandu, Nepal">Kathmandu, Nepal</option>
            <option value="Pokhara, Nepal">Pokhara, Nepal</option>
            <option value="Biratnagar, Nepal">Biratnagar, Nepal</option>
            <option value="Dallas, USA">Dallas, USA</option>
            <option value="Other">Other</option>
          </select>

          {/* Custom Chevron */}
          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        </div>
      </form>
    </StepLayout>
  );
}
