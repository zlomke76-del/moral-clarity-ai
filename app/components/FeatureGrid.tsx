// app/components/FeatureGrid.tsx
"use client";

import Link from "next/link";
// removed: import { cn } from "@/lib/ui";
import {
  ClipboardList,
  ShieldAlert,
  Sparkles,
  Radar,
  Scale,
  AudioLines,
  ChevronRight,
} from "lucide-react";

type Tile = {
  slug: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const tiles: Tile[] = [
  {
    slug: "decision-brief",
    title: "Decision Brief",
    description: "One clear page to move from overwhelm to action.",
    icon: ClipboardList,
    accent: "from-blue-500/20 to-blue-500/0 text-blue-300",
  },
  {
    slug: "red-team",
    title: "Red-team Check",
    description: "Catch blind spots before they catch you.",
    icon: ShieldAlert,
    accent: "from-red-500/20 to-red-500/0 text-red-300",
  },
  {
    slug: "creative",
    title: "Creative Inspiration",
    description: "Fresh, structured ideas on tap.",
    icon: Sparkles,
    accent: "from-fuchsia-500/20 to-fuchsia-500/0 text-fuchsia-300",
  },
  {
    slug: "risk",
    title: "Risk Mapper",
    description: "Surface, score, and mitigate risks.",
    icon: Radar,
    accent: "from-amber-500/20 to-amber-500/0 text-amber-300",
  },
  {
    slug: "ethics",
    title: "Ethics Lens",
    description: "See trade-offs with moral clarity.",
    icon: Scale,
    accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-300",
  },
  {
    slug: "meeting",
    title: "Meeting Synth",
    description: "Turn meetings into decisions and actions.",
    icon: AudioLines,
    accent: "from-cyan-500/20 to-cyan-500/0 text-cyan-300",
  },
];

export default function FeatureGrid() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Start in one of these workspaces
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Pick a mode below. You can switch modes any time.
          </p>
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/app/${t.slug}`}
              className={cn(
                "group relative block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 transition",
                "hover:border-zinc-700 hover:bg-zinc-900"
              )}
            >
              {/* soft accent glow */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-b",
                  t.accent
                )}
              />
              <div className="relative z-10 flex items-start gap-3">
                <div
                  className={cn(
                    "rounded-xl bg-zinc-800/80 p-2 ring-1 ring-inset ring-black/20",
                    "group-hover:scale-105 transition"
                  )}
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium leading-tight">{t.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {t.description}
                  </p>
                </div>
                <ChevronRight
                  className="ml-auto mt-1 h-5 w-5 shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-zinc-300"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** tiny classnames helper */
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
