// app/components/dock-header-lite.tsx
"use client";

import React from "react";
import { UI } from "./dock-ui";

interface Props {
  ministryOn: boolean;
  memReady: boolean;
  onToggleMinistry: () => void;
  onMinimize: () => void;
  onDragStart: (e: any) => void;
}

export default function SolaceDockHeaderLite({
  ministryOn,
  memReady,
  onToggleMinistry,
  onMinimize,
  onDragStart,
}: Props) {
  return (
    <header
      onMouseDown={onDragStart}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderBottom: UI.edge,
        cursor: "move",
        userSelect: "none",
      }}
    >
      {/* Solace orb */}
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background:
            "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
          boxShadow: "0 0 38px rgba(251,191,36,.55)",
        }}
      />

      {/* Title */}
      <span style={{ font: "600 13px system-ui" }}>Solace</span>

      <span style={{ font: "12px system-ui", color: UI.sub }}>
        Create with moral clarity
      </span>

      {/* Memory ready indicator */}
      <span
        title={memReady ? "Memory ready" : "Loading memory…"}
        style={{
          marginLeft: 8,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: memReady ? "#34d399" : "#f59e0b",
          boxShadow: memReady ? "0 0 8px #34d399aa" : "none",
        }}
      />

      {/* Right controls */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <button
          onClick={onToggleMinistry}
          style={{
            borderRadius: 8,
            padding: "7px 10px",
            font: "700 12px system-ui",
            background: ministryOn ? "#f6c453" : "#0e1726",
            color: ministryOn ? "#000" : UI.text,
            border: ministryOn ? "1px solid #f4cf72" : UI.edge,
            cursor: "pointer",
          }}
        >
          Ministry
        </button>

        <button
          onClick={onMinimize}
          style={{
            borderRadius: 6,
            padding: "4px 8px",
            font: "600 12px system-ui",
            border: UI.edge,
            background: "#0e1726",
            color: UI.sub,
            cursor: "pointer",
          }}
        >
          –
        </button>
      </div>
    </header>
  );
}
