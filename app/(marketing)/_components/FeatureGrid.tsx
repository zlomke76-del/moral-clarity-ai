// app/(marketing)/_components/FeatureGrid.tsx
"use client";

import Link from "next/link";

type Feature = {
  slug: string; // href target
  tag: "Create" | "Guidance" | "Ministry" | "Ops" | "Research" | "Review";
  title: string;
  blurb: string;
};

const FEATURES: Feature[] = [
  {
    slug: "/brief",
    tag: "Create",
    title: "Decision Brief",
    blurb: "Turn overwhelm into action in one clear page.",
  },
  {
    slug: "/red-team",
    tag: "Guidance",
    title: "Red-team Check",
    blurb: "Catch blind spots before they catch you.",
  },
  {
    slug: "/itinerary",
    tag: "Guidance",
    title: "AI-Guided Itinerary",
    blurb: "Plan smart with constraints, must-dos, and backups.",
  },
  {
    slug: "/ministry",
    tag: "Ministry",
    title: "Ministry Mode",
    blurb: "Compassionate, faith-aware guidance when you ask for it.",
  },
  {
    slug: "/research-deck",
    tag: "Research",
    title: "Research Deck",
    blurb: "Synthesize sources into a crisp POV with citations.",
  },
  {
    slug: "/postmortem",
    tag: "Review",
    title: "After-Action Review",
    blurb: "What worked, what didn’t, and how to improve next time.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10 md:py-14">
      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        {FEATURES.map((f) => (
          <Link
            key={f.slug}
            href={f.slug}
            className="group rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 md:p-6 hover:bg-zinc-900/70 transition"
          >
            <div className="text-xs uppercase tracking-wide text-zinc-400">
              {f.tag} mode
            </div>
            <h3 className="mt-2 text-xl font-semibold text-zinc-100 group-hover:text-white">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400">{f.blurb}</p>
            <div className="mt-4 text-sm text-sky-400 group-hover:text-sky-300">
              Open →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
