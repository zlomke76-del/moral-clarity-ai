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
      {/* Neural backdrop hook – this is where the animated layer will live */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
      >
        {/* Dark radial fade to keep text readable on the left */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-transparent to-[#020617]" />
        {/* Right-side brain hero */}
        <div
          className="absolute inset-y-[-6%] right-[-8%] w-[56vw] min-w-[540px] bg-[url('/mca-brain-hero.png')] bg-contain bg-right bg-no-repeat mix-blend-screen opacity-90"
          style={{
            filter:
              "drop-shadow(0 0 40px rgba(59,130,246,0.75)) drop-shadow(0 0 90px rgba(56,189,248,0.55))",
          }}
        />
        {/* Subtle vertical gradient behind Solace area */}
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content grid */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row lg:items-stretch lg:gap-12">
        {/* LEFT COLUMN – Anchors + Workspaces */}
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

        {/* RIGHT COLUMN – reserved space under Solace dock */}
        <div className="relative flex-1">
          {/* This empty column just ensures the hero + Solace have space.
              The actual SolaceDock floats globally from layout.tsx. */}
          <div className="h-full min-h-[420px]" />
        </div>
      </div>
    </section>
  );
}
