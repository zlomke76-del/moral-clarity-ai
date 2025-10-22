"use client";

import Link from "next/link";
import {
  ClipboardList,
  ShieldAlert,
  Sparkles,
  Radar,
  Scale,
  AudioLines,
  ChevronRight,
} from "lucide-react";

// Define each workspace block
const tiles = [
  {
    slug: "decision-brief",
    title: "Decision Brief",
    description: "One clear page to move from overwhelm to action.",
    icon: ClipboardList,
    accent: "from-blue-600/30 to-blue-500/0 text-blue-300",
  },
  {
    slug: "red-team",
    title: "Red-team Check",
    description: "Catch blind spots before they catch you.",
    icon: ShieldAlert,
    accent: "from-rose-600/30 to-rose-500/0 text-rose-300",
  },
  {
    slug: "creative",
    title: "Creative Inspiration",
    description: "Fresh, structured ideas on tap.",
    icon: Sparkles,
    accent: "from-fuchsia-600/30 to-fuchsia-500/0 text-fuchsia-300",
  },
  {
    slug: "risk",
    title: "Risk Mapper",
    description: "Surface, score, and mitigate risks.",
    icon: Radar,
    accent: "from-amber-600/30 to-amber-500/0 text-amber-300",
  },
  {
    slug: "ethics",
    title: "Ethics Lens",
    description: "See trade-offs with moral clarity.",
    icon: Scale,
    accent: "from-emerald-600/30 to-emerald-500/0 text-emerald-300",
  },
  {
    slug: "meeting",
    title: "Meeting Synth",
    description: "Turn meetings into decisions and actions.",
    icon: AudioLines,
    accent: "from-cyan-600/30 to-cyan-500/0 text-cyan-300",
  },
];

export default function FeatureGrid() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Start in one of these workspaces
        </h1>
        <p className="mt-2 text-zinc-400">
          Pick a mode below. You can switch modes any time.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.slug}>
              <Link
                href={`/app/${t.slug}`}
                className="group relative block rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-800/30"
              >
                {/* Accent glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${t.accent} opacity-0 group-hover:opacity-100 transition duration-300`}
                />

                {/* Tile content */}
                <div className="relative z-10 flex flex-col items-start gap-3">
                  <div className="rounded-xl bg-zinc-800/70 p-3 ring-1 ring-black/20 group-hover:scale-105 transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-white">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {t.description}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-zinc-300 self-end" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
