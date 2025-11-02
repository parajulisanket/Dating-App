"use client";

export default function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-[#9CA3AF]">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[12px] font-semibold">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
