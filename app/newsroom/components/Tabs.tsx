// app/newsroom/components/Tabs.tsx
"use client";

import type { NewsroomTab } from "../types";

const tabs: { id: NewsroomTab; label: string }[] = [
  { id: "anchor", label: "Neutral News Anchor" },
  { id: "analyst", label: "Outlet Bias Analyst" },
  { id: "coach", label: "Journalism Coach" }
];

export default function Tabs({
  active,
  onChange
}: {
  active: NewsroomTab;
  onChange: (t: NewsroomTab) => void;
}) {
  return (
    <nav className="flex gap-6 border-b pb-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`text-sm pb-2 ${
            active === t.id
              ? "font-semibold border-b-2 border-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
