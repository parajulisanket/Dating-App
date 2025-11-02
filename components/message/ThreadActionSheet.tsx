"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type ThreadActionSheetProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  portalRoot?: HTMLElement | null;
  onViewProfile?: () => void;
  onSearch?: () => void;
  onImages?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  readReceipts?: boolean;
  notifications?: boolean;
  onToggleReadReceipts?: (v: boolean) => void;
  onToggleNotifications?: (v: boolean) => void;
};

export default function ThreadActionSheet({
  open,
  onOpenChange,
  portalRoot,
  onViewProfile,
  onSearch,
  onImages,
  onDelete,
  onReport,
  onBlock,
  readReceipts = true,
  notifications = true,
  onToggleReadReceipts,
  onToggleNotifications,
}: ThreadActionSheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sheetContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed  inset-0 z-50 bg-black/40 animate-in fade-in-0 duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet Content */}
      <div className="absolute max-md:fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="rounded-t-[32px] bg-background p-0 pb-6 shadow-lg">
          <div className="sr-only">
            <h2>Thread actions</h2>
          </div>

          <div className="mt-2">
            <ActionItem
              icon="/icons/UserCircleStroke.svg"
              label="View profile"
              onClick={onViewProfile}
            />
            <ActionItem
              icon="/icons/MagnifyingGlass.svg"
              label="Search conversation"
              onClick={onSearch}
            />
            <ActionItem
              icon="/icons/ImagesSquare.svg"
              label="Images"
              onClick={onImages}
            />

            <ToggleItem
              icon="/icons/Eye.svg"
              label="Read receipts"
              checked={readReceipts}
              onCheckedChange={onToggleReadReceipts}
            />
            <ToggleItem
              icon="/icons/BellSimpleRinging.svg"
              label="Notifications"
              checked={notifications}
              onCheckedChange={onToggleNotifications}
            />

            <ActionItem
              icon="/icons/delete.svg"
              label="Delete conversations"
              destructive
              onClick={onDelete}
            />
            <ActionItem
              icon="/icons/WarningDiamond.svg"
              label="Report"
              onClick={onReport}
            />
            <ActionItem
              icon="/icons/block.svg"
              label="Block user"
              onClick={onBlock}
            />
          </div>
        </div>
      </div>
    </>
  );

  // If portalRoot is provided, render within that container
  // Otherwise, render normally (fallback to document.body)
  return portalRoot ? createPortal(sheetContent, portalRoot) : sheetContent;
}

function ActionItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 px-6 py-4 text-left active:bg-gray-50"
    >
      <img src={icon} alt="" className="h-6 w-6 shrink-0" />
      <span className="text-[16px] font-bold">{label}</span>
    </button>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`flex items-center h-6 w-[42px] rounded-full p-[2px] cursor-pointer border border-[#f92fa2] transition-all duration-300
        ${checked ? "bg-[#f92fa2]" : "bg-[#f92fa2]/10"}
      `}
    >
      <div
        className={`h-[16px] w-[16px] rounded-full shadow-md transition-transform duration-300
          ${
            checked
              ? "translate-x-[20px] bg-white"
              : "translate-x-0 bg-[#f92fa2]"
          }
        `}
      />
    </button>
  );
}

function ToggleItem({
  icon,
  label,
  checked,
  onCheckedChange,
}: {
  icon: string;
  label: string;
  checked: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center gap-4 px-6 py-4">
      <img src={icon} alt="" className="h-6 w-6 shrink-0" />
      <span className="text-[16px] font-bold">{label}</span>
      <div className="ml-auto">
        <Toggle checked={checked} onChange={onCheckedChange} />
      </div>
    </div>
  );
}
