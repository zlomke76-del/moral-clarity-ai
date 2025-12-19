"use client";

import { useSearchParams } from "next/navigation";

export default function LayoutDebugOverlay() {
  const params = useSearchParams();
  const enabled = params.get("debug") === "layout";

  if (!enabled) return null;

  return (
    <>
      {/* App shell outline */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "20vw",
            border: "2px dashed #22c55e",
            boxSizing: "border-box",
          }}
        >
          <Label text="NEURAL SIDEBAR" />
        </div>

        {/* Main */}
        <div
          style={{
            position: "absolute",
            left: "20vw",
            right: 0,
            top: 0,
            bottom: 0,
            border: "2px dashed #3b82f6",
            boxSizing: "border-box",
          }}
        >
          <Label text="APP MAIN" />
        </div>
      </div>
    </>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        fontSize: 11,
        padding: "2px 6px",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        borderRadius: 4,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}
