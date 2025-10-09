"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function FilterSheet({ onApply }: { onApply: () => void }) {
  const [show, setShow] = React.useState<"man" | "woman" | "all" | null>(null);
  const [age, setAge] = React.useState<[number, number]>([23, 36]);
  const [distance, setDistance] = React.useState(7);
  const [hasBio, setHasBio] = React.useState(true);

  const reset = () => {
    setShow(null);
    setAge([23, 36]);
    setDistance(7);
    setHasBio(true);
  };

  const Chip = ({
    label,
    value,
  }: {
    label: string;
    value: "man" | "woman" | "all";
  }) => (
    <button
      onClick={() => setShow(value)}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition",
        show === value
          ? "border-pink-500 bg-pink-50 text-pink-600"
          : "border-gray-300 text-gray-700 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[#333333] font-bold">Show me</p>
        <div className="flex gap-2">
          <Chip label="Man" value="man" />
          <Chip label="Woman" value="woman" />
          <Chip label="All" value="all" />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[#333333] mb-2">
          <span className="font-bold">Preferred age</span>
          <span className="text-pink-600 text-sm">
            {age[0]}–{age[1]}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={18}
            max={60}
            value={age[0]}
            onChange={(e) => setAge([+e.target.value, age[1]])}
            className="w-full accent-pink-500"
          />
          <input
            type="range"
            min={18}
            max={60}
            value={age[1]}
            onChange={(e) => setAge([age[0], +e.target.value])}
            className="w-full accent-pink-500"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[#333333] mb-2">
          <span className="font-bold">Preferred distance</span>
          <span className="text-pink-600 text-sm">{distance} km</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={distance}
          onChange={(e) => setDistance(+e.target.value)}
          className="w-full accent-pink-500"
        />
      </div>

      <label className="flex items-center justify-between">
        <span className="text-[#333333] font-bold">Should have a bio</span>
        <input
          type="checkbox"
          checked={hasBio}
          onChange={(e) => setHasBio(e.target.checked)}
          className="peer sr-only"
        />
        <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition peer-checked:bg-pink-500">
          <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
        </span>
      </label>

      <div className="space-y-3">
        <button
          onClick={() => {
            console.log("apply (static):", { show, age, distance, hasBio });
            onApply();
          }}
          className="w-full rounded-full bg-[#F92FA2] py-3 text-white font-medium "
        >
          Apply Filters
        </button>
        <button
          onClick={reset}
          className="w-full rounded-full bg-[#CA2CFF] py-3 text-white font-medium "
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
