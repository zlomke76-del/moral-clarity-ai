"use client";

import { useEffect, useState } from "react";

export default function LayoutDebugOverlay() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ctrl + Shift + L toggles layout diagnostics
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
        setEnabled((v) => !v);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* App shell */}
      <div className="absolute inset-0 outline outline-2 outline-red-500/70" />

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-[20vw] outline outline-2 outline-blue-500/70" />

      {/* Main content */}
      <div className="absolute left-[20vw] top-0 h-full w-[80vw] outline outline-2 outline-green-500/70" />

      {/* Label */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded">
        Layout diagnostics active (Ctrl+Shift+L)
      </div>
    </div>
  );
}
