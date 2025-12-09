// app/components/dock-header.tsx
"use client";

import React from "react";
import { UI } from "./dock-ui";

interface Props {
  ministryOn: boolean;
  founderMode: boolean;
  modeHint: string;
  memReady: boolean;

  onToggleMinistry: () => void;
  onToggleFounder: () => void;
  onMinimize: () => void;
  setModeHint: (m: any) => void;
  onDragStart: (e: any) => void;
}

const modes = ["Create", "Red Team", "Next Steps", "Neutral"];

export default function SolaceDockHeader({
  ministryOn,
  founderMode,
  modeHint,
  memReady,
  onToggleMinistry,
  onToggleFounder,
  onMinimize,
  setModeHint,
  onDragStart,
}: Props) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderBottom: UI.edge,
        cursor: "move",
        userSelect: "none",
      }}
      onMouseDown={onDragStart}
    >
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

      <span style={{ font: "600 13px system-ui" }}>Solace</span>

      <span style={{ font: "12px system-ui", color: UI.sub }}>
        Create with moral clarity
      </span>

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

      {/* Mode chips */}
      <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setModeHint(m as any)}
            style={{
              borderRadius: 8,
              padding: "7px 10px",
              font: "600 12px system-ui",
              background: modeHint === m ? "#d1d4db" : "#0e1726",
              color: modeHint === m ? "#000" : UI.text,
              border: UI.border,
              cursor: "pointer",
            }}
          >
            {m}
          </button>
        ))}
      </div>

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
          onClick={onToggleFounder}
          style={{
            borderRadius: 8,
            padding: "7px 10px",
            font: "700 12px system-ui",
            background: founderMode ? "#9ae6b4" : "#0e1726",
            color: founderMode ? "#000" : UI.text,
            border: founderMode ? "1px solid #81e6d9" : UI.edge,
            cursor: "pointer",
          }}
        >
          Founder
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
