"use client";

export function NotificationSheet() {
  const notifications = [
    { id: 1, text: "Shreya reacted to your story", time: "13:05" },
    { id: 2, text: "Aarav sent you a message", time: "10:32" },
  ];

  return (
    <div className="space-y-4">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-4 p-3 hover:bg-gray-50 transition"
        >
          <div className="h-10 w-10 rounded-full bg-[#D9D9D9] flex items-center justify-center text-pink-500"></div>
          <div>
            <p className="text-[#333333] font-medium text-sm">{n.text}</p>
            <p className="text-xs text-[#777777]">{n.time}</p>
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className="text-center text-gray-500 py-10">No notifications yet</p>
      )}
    </div>
  );
}
