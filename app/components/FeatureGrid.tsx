// app/components/FeatureGrid.tsx
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

type Tile = {
  slug: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  stepLabel: string;
};

// Human Clarity Loop – 6 blocks, natural flow
const tiles: Tile[] = [
  {
    slug: "decision-brief",
    title: "Clarify the Decision",
    description:
      "Capture the situation, constraints, and what “good” would look like on one clear page.",
    icon: ClipboardList,
    accent: "from-blue-600/30 to-blue-500/0 text-blue-300",
    stepLabel: "Step 1 • Signal & Define",
  },
  {
    slug: "creative",
    title: "Design Options",
    description:
      "Generate grounded options, angles, and next moves without losing sight of reality.",
    icon: Sparkles,
    accent: "from-fuchsia-600/30 to-fuchsia-500/0 text-fuchsia-300",
    stepLabel: "Step 2 • Explore Moves",
  },
  {
    slug: "risk",
    title: "Map Risks",
    description:
      "Surface what could go wrong, how likely it is, and where you need safeguards.",
    icon: Radar,
    accent: "from-amber-600/30 to-amber-500/0 text-amber-300",
    stepLabel: "Step 3 • Expose Fragility",
  },
  {
    slug: "ethics",
    title: "Check Trade-offs",
    description:
      "See who is affected, where values are in tension, and what “moral clarity” looks like here.",
    icon: Scale,
    accent: "from-emerald-600/30 to-emerald-500/0 text-emerald-300",
    stepLabel: "Step 4 • Weigh Impacts",
  },
  {
    slug: "red-team",
    title: "Red-team the Plan",
    description:
      "Invite an honest challenge before you commit. Probe blind spots, incentives, and failure modes.",
    icon: ShieldAlert,
    accent: "from-rose-600/30 to-rose-500/0 text-rose-300",
    stepLabel: "Step 5 • Challenge Assumptions",
  },
  {
    slug: "meeting",
    title: "Turn It Into Action",
    description:
      "Turn notes and conversations into decisions, owners, and next steps you’ll actually follow through on.",
    icon: AudioLines,
    accent: "from-cyan-600/30 to-cyan-500/0 text-cyan-300",
    stepLabel: "Step 6 • Steward the Outcome",
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
          Follow the loop from signal to stewardship — or jump in where you are.
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
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b ${t.accent} opacity-0 group-hover:opacity-100 transition duration-300`}
                />

                {/* Tile content */}
                <div className="relative z-10 flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    <span className="rounded-full border border-zinc-700/80 bg-zinc-900/70 px-2 py-0.5">
                      {t.stepLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-zinc-800/70 p-3 ring-1 ring-black/20 group-hover:scale-105 transition">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-lg text-white">
                      {t.title}
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-zinc-400">
                    {t.description}
                  </p>

                  <div className="mt-2 flex w-full justify-end">
                    <ChevronRight className="h-5 w-5 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
