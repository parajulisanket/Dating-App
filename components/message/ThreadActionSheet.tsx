"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const content = (
    <SheetContent
      side="bottom"
      className="
        fixed bottom-0
        !left-1/2 -translate-x-1/2
        w-full max-w-[425px]          
        rounded-t-[32px] p-0 pb-6
        [&>button.absolute.right-4.top-4]:hidden  
      "
    >
      <SheetHeader className="sr-only">
        <SheetTitle>Thread actions</SheetTitle>
      </SheetHeader>

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
    </SheetContent>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* If we have a container, portal into the phone frame; otherwise render normally */}
      {portalRoot ? createPortal(content, portalRoot) : content}
    </Sheet>
  );
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
      <span
        className={`text-[16px] font-bold ${
          destructive ? "" : "text-gray-900"
        }`}
      >
        {label}
      </span>
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors
    ${
      checked
        ? "bg-[#F92FA2] border-[#F92FA2]"
        : "bg-[#feeaf6] border-[#F92FA2]"
    }
    `}
    >
      <span
        className={`pointer-events-none absolute left-0 h-5 w-5 rounded-full transition-transform
      ${checked ? "translate-x-5 bg-white" : "translate-x-1 bg-[#F92FA2]"}`}
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
      <span className="text-[16px] text-gray-900 font-bold">{label}</span>
      <div className="ml-auto">
        <Toggle checked={checked} onChange={onCheckedChange} />
      </div>
    </div>
  );
}
