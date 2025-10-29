"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Range, getTrackBackground } from "react-range";

const AGE_MIN = 18;
const AGE_MAX = 60;
const MIN_GAP = 1; // years between thumbs

export function FilterSheet({ onApply }: { onApply: () => void }) {
  const { theme } = useTheme();
  const [show, setShow] = React.useState<"man" | "woman" | "all" | null>(null);
  const [age, setAge] = React.useState<[number, number]>([23, 36]);
  const [distance, setDistance] = React.useState(7);
  const [hasBio, setHasBio] = React.useState(true);

  const toggleFloatingBadges = () => setHasBio((p) => !p);

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
            ? "bg-[#f92fa2]/10 text-primary-500 border-[#f92fa2]/40"
            : "bg-[#FFFFFF4D] border-white"
          : theme === "light"
          ? "border-neutral-200 text-neutral-1000"
          : "border-neutral-300"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Show me */}
      <div>
        <p className="mb-2 font-bold">Show me</p>
        <div className="flex gap-2">
          <Chip label="Man" value="man" />
          <Chip label="Woman" value="woman" />
          <Chip label="All" value="all" />
        </div>
      </div>

      {/* Preferred age */}
      <div>
        <div className="mb-2 flex justify-between">
          <span className="font-bold">Preferred age</span>
          <span
            className={`text-sm font-medium ${
              theme === "light" ? "text-primary-500" : "text-white"
            }`}
          >
            {age[0]}–{age[1]}
          </span>
        </div>

        <div className="px-1 py-3">
          <Range
            min={AGE_MIN}
            max={AGE_MAX}
            step={1}
            values={age}
            onChange={(values) => {
              let [lo, hi] = values as [number, number];

              // Enforce a minimum gap
              if (hi - lo < MIN_GAP) {
                const movedLo = Math.abs(lo - age[0]) < Math.abs(hi - age[1]);
                if (movedLo) {
                  lo = Math.min(hi - MIN_GAP, lo);
                } else {
                  hi = Math.max(lo + MIN_GAP, hi);
                }
              }

              // Clamp to bounds
              lo = Math.max(AGE_MIN, Math.min(lo, AGE_MAX - MIN_GAP));
              hi = Math.min(AGE_MAX, Math.max(hi, AGE_MIN + MIN_GAP));

              setAge([lo, hi]);
            }}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                className="h-8 w-full flex items-center"
              >
                <div
                  ref={props.ref}
                  className="h-[2px] w-full rounded-full"
                  style={{
                    background: getTrackBackground({
                      values: age,
                      colors: [
                        theme === "light" ? "#F92FA24D" : "#F92FA24D",
                        "#F92FA2", // active segment
                        theme === "light" ? "#F92FA24D" : "#F92FA24D",
                      ],
                      min: AGE_MIN,
                      max: AGE_MAX,
                    }),
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="h-5 w-5 rounded-full shadow-md cursor-pointer outline-none"
                style={{
                  ...props.style,
                  backgroundColor: "#F92FA2",
                }}
                aria-label="Age handle"
              />
            )}
          />
        </div>
      </div>

      {/* Preferred distance */}
      <div>
        <div className="mb-2 flex justify-between">
          <span className="font-bold">Preferred distance</span>
          <span
            className={`text-sm font-medium ${
              theme === "light" ? "text-[#F92FA2]" : "text-white"
            }`}
          >
            {distance}km
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={100}
          value={distance}
          onChange={(e) => setDistance(+e.target.value)}
          className="w-full h-[2px] rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #F92FA2 ${distance}%, #F92FA24D ${distance}%)`,
            accentColor: "#F92FA2",
          }}
        />

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f92fa2;
            cursor: pointer;
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f92fa2;
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* Has bio toggle */}
      <label className="flex items-center justify-between">
        <span className="font-bold">Should have a bio</span>
        <div
          onClick={toggleFloatingBadges}
          className={`flex h-6 w-[42px] cursor-pointer items-center rounded-full border border-[#f92fa2] p-[2px] transition-all duration-300 ${
            hasBio ? "bg-[#f92fa2]" : "bg-[#f92fa2]/10"
          }`}
        >
          <div
            className={`h-[16px] w-[16px] rounded-full shadow-md transition-transform duration-300 ${
              hasBio
                ? "translate-x-[20px] bg-white"
                : "translate-x-0 bg-[#f92fa2]"
            }`}
          />
        </div>
      </label>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => {
            console.log("apply (static):", { show, age, distance, hasBio });
            onApply();
          }}
          className="w-full rounded-full bg-[#F92FA2] py-3 font-medium text-white"
        >
          Apply Filters
        </button>
        <button
          onClick={reset}
          className="w-full rounded-full bg-[#CA2CFF] py-3 font-medium text-white"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
