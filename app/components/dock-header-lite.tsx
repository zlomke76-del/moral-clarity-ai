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
  onMinimize,
  onDragStart,
}: Props) {
  const anchorGlow = ministryOn
    ? "0 0 28px rgba(251,191,36,.65), 0 0 6px rgba(251,191,36,.45)"
    : "0 0 10px rgba(148,163,184,.22)";

  const anchorFill = ministryOn ? "#fbbf24" : "#94a3b8";

  return (
    <header
      onMouseDown={onDragStart}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
        cursor: "move",
        userSelect: "none",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 22,
          height: 22,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(" + anchorGlow + ")",
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={anchorFill}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 L21 19 H3 Z" />
          <line x1="12" y1="8" x2="12" y2="19" />
          <path d="M8 19c1.5 2 6.5 2 8 0" />
        </svg>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span
          style={{
            font: '600 14px system-ui, -apple-system, "Segoe UI", sans-serif',
            letterSpacing: "-0.01em",
            color: UI.text,
            whiteSpace: "nowrap",
          }}
        >
          Solace
        </span>

        <span
          style={{
            font: '500 12px system-ui, -apple-system, "Segoe UI", sans-serif',
            color: UI.sub,
            whiteSpace: "nowrap",
          }}
        >
          Create with moral clarity
        </span>

        <span
          title={memReady ? "Memory ready" : "Loading memory"}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: memReady ? "#34d399" : "#f59e0b",
            boxShadow: memReady ? "0 0 10px rgba(52,211,153,0.7)" : "0 0 8px rgba(245,158,11,0.35)",
            flexShrink: 0,
          }}
        />
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <button
          onClick={onMinimize}
          style={{
            borderRadius: 8,
            padding: "4px 9px",
            font: '600 12px system-ui, -apple-system, "Segoe UI", sans-serif',
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            color: UI.sub,
            cursor: "pointer",
            transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
          }}
          aria-label="Minimize Solace"
        >
          –
        </button>
      </div>
    </header>
  );
}
