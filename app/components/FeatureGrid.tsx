// app/components/FeatureGrid.tsx
"use client";

import Link from "next/link";

const tiles = [
  { title: "Decision Brief", href: "/studio/brief", desc: "One clear page to move from overwhelm to action." },
  { title: "Red-team Check", href: "/studio/red-team", desc: "Catch blind spots before they catch you." },
  { title: "Creative Inspiration", href: "/studio/creative", desc: "Fresh, structured ideas on tap." },
  { title: "Risk Mapper", href: "/studio/risk", desc: "Surface, score, and mitigate risks." },
  { title: "Ethics Lens", href: "/studio/ethics", desc: "See trade-offs with moral clarity." },
  { title: "Meeting Synth", href: "/studio/meet", desc: "Turn meetings into decisions and actions." },
];

export default function FeatureGrid() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Start in one of these workspaces</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.title} href={t.href} className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 hover:bg-zinc-900/60 transition">
            <div className="text-lg font-medium mb-1">{t.title}</div>
            <div className="text-sm opacity-70">{t.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
