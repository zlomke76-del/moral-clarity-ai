// app/components/dock-header.tsx
"use client";

import React from "react";
import { UI } from "./dock-ui";

interface Props {
  ministryOn: boolean;
  memReady: boolean;

  // Optional / passive controls
  founderMode?: boolean;
  modeHint?: string;

  onToggleMinistry: () => void;
  onMinimize: () => void;
  onDragStart: (e: any) => void;

  // Optional callbacks (safe no-ops if absent)
  onToggleFounder?: () => void;
  setModeHint?: (m: any) => void;
}

export default function SolaceDockHeader({
  ministryOn,
  memReady,
  founderMode,
  modeHint,
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

      <span style={{ font: "600 13px system-ui" }}>Solace</span>

      <span style={{ font:
