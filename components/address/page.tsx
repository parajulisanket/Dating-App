"use client";

import { useState, FormEvent } from "react";
import NextButton from "@/components/ui/NextButton";
import { getCoords, reverseGeocodePretty } from "@/utils/geo";

interface AddressPageProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onCoords?: (lat: number, lon: number) => void;
}

export default function AddressPage({
  value,
  onChange,
  onNext,
  onCoords,
}: AddressPageProps) {
  const [hint, setHint] = useState<string>("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onNext();
  }

  async function handleUseMyLocation() {
    setHint("");
    try {
      const { lat, lng } = await getCoords();
      onCoords?.(lat, lng);

      // show coords immediately for feedback
      onChange(`(${lat.toFixed(4)}, ${lng.toFixed(4)})`);

      // then replace with "Place, City, Country"
      const pretty = await reverseGeocodePretty(lat, lng);
      onChange(pretty);
    } catch (e: any) {
      const msg =
        e?.message === "PermissionDenied"
          ? "Permission denied — allow location for this site."
          : e?.message === "PositionUnavailable"
          ? "Position unavailable — try again near a window."
          : e?.message === "Timeout"
          ? "Timed out — tap again or move outside."
          : e?.message === "GeolocationNotAvailable"
          ? "Geolocation not available (use HTTPS or localhost in dev)."
          : "Could not get your location.";
      setHint(msg);
      console.warn("[geo]", e);
    }
  }

  return (
    <>
      <main className="px-4">
        <h1 className="title mt-4 leading-10 text-left">
          Where do you live
          <br />
          currently?
        </h1>

        <form id="address-form" onSubmit={onSubmit} className="mt-8">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your address"
            className="w-full rounded-[16px] px-4 py-[14px] border border-neutral-300 text-[16px]"
          />
        </form>

        {hint && <p className="mt-2 text-sm text-red-600">{hint}</p>}
      </main>

      <footer className="absolute bottom-0 px-4 w-full pb-10 space-y-2 z-50">
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="mb-4 block mx-auto text-heading text-base font-medium"
        >
          Turn on your device location instead.
        </button>

        <NextButton
          disabled={!value.trim()}
          form="address-form"
          className="w-full"
        >
          Next
        </NextButton>
      </footer>
    </>
  );
}
