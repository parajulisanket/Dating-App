"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export function FilterSheet({ onApply }: { onApply: () => void }) {
  const { theme } = useTheme();
  const [show, setShow] = React.useState<"man" | "woman" | "all" | null>(null);
  const [age, setAge] = React.useState<[number, number]>([23, 36]);
  const [distance, setDistance] = React.useState(7);
  const [hasBio, setHasBio] = React.useState(true);

  const toggleFloatingBadges = () => {
    setHasBio((prev) => !prev);
  };

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
          ? theme === "light"
            ? "bg-primary-500/10 text-primary-500 border-primary-500/40"
            : "bg-[#FFFFFF4D] border-white "
          : theme === "light"
          ? " border-neutral-200 text-neutral-1000"
          : " border-neutral-300"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 ">
      <div>
        <p className="mb-2  font-bold">Show me</p>
        <div className="flex gap-2">
          <Chip label="Man" value="man" />
          <Chip label="Woman" value="woman" />
          <Chip label="All" value="all" />
        </div>
      </div>

      <div>
        <div className="flex justify-between  mb-2">
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
        <div className="flex justify-between  mb-2">
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
        <span className=" font-bold">Should have a bio</span>
        <div
          onClick={toggleFloatingBadges}
          className={` flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-primary-500  transition-all duration-300
              ${hasBio ? "bg-primary-500" : "bg-primary-500/10"}
            `}
        >
          <div
            className={`h-[16px] w-[16px] rounded-full  shadow-md transition-transform duration-300
                ${
                  hasBio
                    ? "translate-x-[20px] bg-white"
                    : "translate-x-0 bg-primary-500"
                }
              `}
          ></div>
        </div>
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
