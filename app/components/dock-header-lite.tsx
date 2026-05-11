// app/components/dock-header-lite.tsx
"use client";

import React from "react";
import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  ministryOn: boolean;
  memReady: boolean;
  onToggleMinistry: () => void;
  onMinimize: () => void;
  onDragStart: (e: any) => void;
}

export default function SolaceDockHeaderLite({ memReady, onDragStart }: Props) {
  return (
    <header className="solace-workspace-header" onMouseDown={onDragStart}>
      <div className="solace-greeting">
        <div className="solace-greeting-title">
          Good evening, Tim.<span aria-hidden>•</span>
        </div>
        <div className="solace-greeting-subtitle">What would you like clarity on today?</div>
      </div>

      <div className="solace-status-pill" title={memReady ? "Memory online" : "Memory loading"}>
        <span className="solace-status-icon">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <span>
          <span className="solace-status-label">System Status</span>
          <span className="solace-status-value">Protected &amp; Governed</span>
        </span>
        <span className="solace-status-dot" />
      </div>

      <div className="solace-profile-pill">
        <span>TZ</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </header>
  );
}
