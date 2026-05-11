// app/components/dock-header-lite.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

interface Props {
  ministryOn: boolean;
  memReady: boolean;
  onToggleMinistry: () => void;
  onMinimize: () => void;
  onDragStart: (e: any) => void;
}

function getGreetingForLocalTime(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}

function readDisplayName() {
  if (typeof window === "undefined") return "";

  const keys = [
    "solace:user:name",
    "solace:displayName",
    "moralclarity:user:name",
    "mc:user:name",
    "displayName",
  ];

  for (const key of keys) {
    const value = window.localStorage.getItem(key)?.trim();
    if (value) return value;
  }

  return "";
}

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || "";
}

function getInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "AI";
}

export default function SolaceDockHeaderLite({ memReady, onDragStart }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setNow(new Date());
    setDisplayName(readDisplayName());

    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const greeting = useMemo(() => getGreetingForLocalTime(now ?? new Date()), [now]);
  const firstName = getFirstName(displayName);
  const initials = getInitials(displayName);

  return (
    <header className="solace-workspace-header" onMouseDown={onDragStart}>
      <div className="solace-greeting">
        <div className="solace-greeting-title">
          {greeting}{firstName ? `, ${firstName}` : ""}.<span aria-hidden>•</span>
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
        <span>{initials}</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </header>
  );
}
