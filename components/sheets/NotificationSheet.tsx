"use client";

import { useTheme } from "next-themes";

export function NotificationSheet() {
  const { theme } = useTheme()
  const notifications = [
    { id: 1, text: "Shreya reacted to your story", time: "13:05" },
    { id: 2, text: "Aarav sent you a message", time: "10:32" },
  ];

  return (
    <div className="space-y-4">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-4 p-3 "
        >
          <div className="h-10 w-10 rounded-full bg-[#D9D9D9] flex items-center justify-center text-pink-500"></div>
          <div>
            <p className=" font-medium text-sm">{n.text}</p>
            <p className={`text-xs ${theme === 'light' ? 'text-neutral-700' : 'text-neutral-500'}`}>{n.time}</p>
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className="text-center text-gray-500 py-10">No notifications yet</p>
      )}
    </div>
  );
}
