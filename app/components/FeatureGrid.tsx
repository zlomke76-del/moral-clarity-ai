// app/components/FeatureGrid.tsx
import Link from "next/link";

type AnchorLink = {
  label: string;
  description: string;
  href: string;
};

type WorkspaceLink = {
  label: string;
  tagline: string;
  href: string;
};

const ANCHORS: AnchorLink[] = [
  {
    label: "Workspace Live",
    description: "Your anchored conversations with Solace.",
    href: "/app",
  },
  {
    label: "Newsroom Cabinet",
    description: "Neutral digest, outlet scores, and ledgers.",
    href: "/app/newsroom",
  },
  {
    label: "Memory Center",
    description: "Review and edit your stored memories.",
    href: "/app/memories",
  },
  {
    label: "Attachments",
    description: "Files, exports, and reference packs.",
    href: "/app/attachments",
  },
  {
    label: "Guidance Modes",
    description: "Neutral • Guidance • Ministry lenses.",
    href: "/app/modes",
  },
];

const WORKSPACES: WorkspaceLink[] = [
  {
    label: "Decision Brief",
    tagline: "One clear page to move from signal to action.",
    href: "/app/decision-brief",
  },
  {
    label: "Journey Planner",
    tagline: "Next moves, owners, and aligned timelines.",
    href: "/app/journey",
  },
  {
    label: "Newsroom Cabinet",
    tagline: "Anchored news, outlet cabinet, and bias telemetry.",
    href: "/app/newsroom",
  },
  {
    label: "Memory Studio",
    tagline: "Rewrite, curate, and steward stored memories.",
    href: "/app/memories",
  },
  {
    label: "Founder Lane",
    tagline: "Brain, news, and memory routed through Solace.",
    href: "/app/founder-lane",
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden">
      {/* =========================================================
          NEURAL BACKDROP LAYER (image + animation + triangle slot)
         ========================================================= */}
      <div aria-hidden className="neural-ambient">
        {/* Soft dark fade so text stays readable on the left */}
        <div className="neural-ambient__fade" />

        {/* MCAI brain hero on the right */}
        <div className="neural-ambient__brain" />

        {/* Animated circuit sweeps */}
        <div className="neural-ambient__line neural-ambient__line--slow" />
        <div className="neural-ambient__line neural-ambient__line--fast" />

        {/* Pulsing neural nodes */}
        <div className="neural-ambient__pulse neural-ambient__pulse--tl" />
        <div className="neural-ambient__pulse neural-ambient__pulse--br" />

        {/* Triangle / anchor badge slot (visual only for now) */}
        <div className="neural-anchor-badge">
          <div className="neural-anchor-badge__glow" />
          <svg
            viewBox="0 0 64 64"
            className="neural-anchor-badge__icon"
            aria-hidden="true"
          >
            {/* Triangle */}
            <path
              d="M32 6 L10 52 H54 Z"
              fill="none"
              stroke="rgba(148, 197, 253, 0.9)"
              strokeWidth="1.5"
            />
            {/* Inner anchor */}
            <path
              d="M32 16c-1.9 0-3.4 1.5-3.4 3.4 0 1.7 1.2 3.1 2.8 3.4v10.1l-4.6-3.1m4.6 3.1 4.6-3.1M24 36.8c0 4.4 3.6 8 8 8s8-3.6 8-8"
              fill="none"
              stroke="rgba(191, 219, 254, 0.96)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="32"
              cy="19.4"
              r="1.6"
              fill="rgba(191, 219, 254, 1)"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================
          CONTENT GRID
         ========================================================= */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row lg:items-stretch lg:gap-12">
        {/* LEFT COLUMN – Solace system + anchors + workspaces */}
        <div className="w-full max-w-md shrink-0 space-y-8">
          {/* Solace system label */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/80">
              Solace System
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-sky-50">
              MCAI Neural Workspaces
            </h1>
            <p className="text-sm text-[var(--mc-muted)]">
              The MCAI brain wired into moral clarity circuits. Each workspace
              is an anchored entry point into Solace.
            </p>
          </div>

          {/* Anchored entry points */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              Anchored entry points
            </h2>
            <div className="flex flex-col gap-2">
              {ANCHORS.map((anchor) => (
                <Link
                  key={anchor.label}
                  href={anchor.href}
                  className="group rounded-xl border border-sky-900/60 bg-sky-950/40 px-3 py-2.5 text-sm transition hover:border-sky-400/70 hover:bg-sky-900/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.35)]"
                  prefetch={false}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sky-50">
                      {anchor.label}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/80 group-hover:text-sky-100">
                      Open
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-sky-100/70">
                    {anchor.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Neural workspaces list */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              Workspaces
            </h2>
            <div className="flex flex-col gap-2">
              {WORKSPACES.map((ws) => (
                <Link
                  key={ws.label}
                  href={ws.href}
                  className="group rounded-xl border border-slate-800/70 bg-slate-950/50 px-3 py-2.5 text-sm transition hover:border-sky-400/70 hover:bg-slate-900/70 hover:shadow-[0_0_26px_rgba(59,130,246,0.35)]"
                  prefetch={false}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-50">
                      {ws.label}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300/80 group-hover:text-sky-100">
                      Live
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-300/75">
                    {ws.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Magic key CTA */}
          <div className="pt-2 text-xs text-[var(--mc-muted)]">
            <p>
              <span className="font-semibold text-sky-300">Get magic key</span>{" "}
              to anchor Solace to your world. No feeds, no doomscrolling — just
              grounded decisions.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN – reserved vertical lane under Solace */}
        <div className="relative flex-1">
          {/* This just reserves breathing room so the dock doesn’t crowd the left. */}
          <div className="h-full min-h-[420px]" />
        </div>
      </div>
    </section>
  );
}
