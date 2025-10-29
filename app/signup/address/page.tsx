"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import StepLayout from "@/components/layout/StepLayout";
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
    <StepLayout
      backHref="/signup/dob"
      title="Where do you live currently?"
      footer={
        <>
          <button
            type="button"
            onClick={useDeviceLocation}
            className="mb-4 block mx-auto text-heading text-base text-center font-medium underline-offset-2 hover:underline"
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
        {/* replaced default <select> with shadcn Select */}
        <Select onValueChange={setAddress}>
          <SelectTrigger className="w-full !rounded-[16px] px-4 py-[14px] border border-gray-300 !text-[16px]">
            <SelectValue
              placeholder="Select your address"
              className={address ? "text-neutral-900" : "text-neutral-500"}
            />
          </SelectTrigger>
          <SelectContent className="border border-neutral-200 !rounded-2xl">
            {locations.map((location) => (
              <SelectItem
                key={location.key}
                value={location.value}
                className="cursor-pointer"
              >
                {location.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    </StepLayout>
  );
}
