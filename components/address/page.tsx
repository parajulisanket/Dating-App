"use client";

import { FormEvent } from "react";
import NextButton from "@/components/ui/NextButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AddressPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function AddressPage({
  value,
  onChange,
  onNext,
}: AddressPageProps) {
  const locations = [
    { key: "Kathmandu, Nepal", value: "Kathmandu, Nepal" },
    { key: "Pokhara, Nepal", value: "Pokhara, Nepal" },
    { key: "Biratnagar, Nepal", value: "Biratnagar, Nepal" },
    { key: "Dallas, USA", value: "Dallas, USA" },
    { key: "Other", value: "Other" },
  ];

  const isValid = value.trim().length > 0;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onChange(
          `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        );
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <>
      {/* CONTENT: title + select */}
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          Where do you live
          <br />
          currently?
        </h1>

        <form id="address-form" onSubmit={onSubmit} className="mt-8">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full rounded-[16px] px-4 py-[14px] border border-neutral-300 text-[16px]">
              <SelectValue
                placeholder="Select your address"
                className={value ? "text-neutral-900" : "text-neutral-500"}
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
    </>
  );
}
