// app/app/page.tsx
import Link from "next/link";
import Image from "next/image";

export const runtime = "nodejs";

const WORKSPACES = [
  {
    id: "decision-brief",
    title: "Decision Brief",
    href: "/app/decision-brief",
    status: "Live",
    description:
      "One clear page to move from overwhelm to action. Capture signal, constraints, and what “good” looks like.",
  },
  {
    id: "journey-planner",
    title: "Journey Planner",
    href: "/app/journey",
    status: "Live",
    description:
      "Map the path ahead with grounded next moves, owners, and time horizons that align with your values.",
  },
  {
    id: "newsroom",
    title: "Newsroom Cabinet",
    href: "/app/newsroom",
    status: "Live",
    description:
      "Neutral news digest, outlet cabinet, and bias telemetry — all anchored through Solace.",
  },
  {
    id: "memory-studio",
    title: "Memory Studio",
    href: "/app/memories",
    status: "Beta",
    description:
      "Review, rewrite, and curate your stored memories from Supabase. Full edit controls coming soon.",
  },
];

export default function AppHome() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* TOP BAR – MCAI + Workspaces + Get magic key */}
      <header className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-slate-800/70 bg-gradient-to-b from-slate-950/90 to-slate-950/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.6)]">
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 shadow-inner shadow-slate-900" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold tracking-[0.25em] text-cyan-300/80 uppercase">
              Moral Clarity AI
            </span>
            <span className="text-sm font-medium text-slate-200">
              MCAI Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
            Workspaces
          </span>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 hover:bg-cyan-400/20 hover:border-cyan-300 transition-colors"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            Get magic key
          </Link>
        </div>
      </header>

      {/* MAIN GRID: LEFT WORKSPACES / RIGHT MCAI BRAIN HERO */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-10 pt-6 lg:flex-row lg:gap-10 lg:pt-8">
        {/* LEFT COLUMN – WORKSPACE LIST */}
        <section className="w-full max-w-md shrink-0 space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-slate-50">
              Start in one of these workspaces
            </h1>
            <p className="text-xs text-slate-400">
              Follow the loop from signal to stewardship — or jump in where you
              are. Each workspace is wired directly into Solace.
            </p>
          </div>

          <div className="relative mt-4 space-y-3">
            {/* subtle “wiring” spine */}
            <div className="pointer-events-none absolute inset-y-2 left-4 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-300/10 to-transparent" />
            {WORKSPACES.map((ws, index) => (
              <Link
                key={ws.id}
                href={ws.href}
                className="group relative flex gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 pl-8 shadow-[0_18px_40px_rgba(0,0,0,0.55)] ring-0 transition hover:border-cyan-400/70 hover:bg-slate-900/90 hover:shadow-[0_0_40px_rgba(34,211,238,0.40)]"
              >
                {/* “node” on the wire */}
                <span className="absolute left-3 top-4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] group-hover:h-3 group-hover:w-3 group-hover:bg-cyan-200 transition-all" />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {ws.title}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        ws.status === "Live"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/60"
                          : "bg-amber-500/10 text-amber-200 border border-amber-400/60"
                      }`}
                    >
                      {ws.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{ws.description}</p>
                </div>

                <div className="flex items-center">
                  <span className="text-[11px] font-semibold text-cyan-200 opacity-80 group-hover:opacity-100">
                    Open
                  </span>
                </div>

                {/* animated “signal” line into the hero brain */}
                <div
                  className="pointer-events-none absolute right-[-18px] top-1/2 hidden h-px w-6 translate-y-[-50%] bg-gradient-to-r from-cyan-400/70 via-cyan-200/70 to-transparent lg:block"
                  style={{ opacity: 0.9 - index * 0.12 }}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN – MCAI BRAIN HERO */}
        <section className="relative flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_28px_80px_rgba(0,0,0,0.85)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.20),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),_transparent_55%)] pointer-events-none" />
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/mca-brain-hero.png"
                alt="MCAI neural brain wired into moral clarity circuits"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* MCAI label + subtle status strip */}
            <div className="relative flex items-center justify-between border-t border-slate-800/70 bg-slate-950/90 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                  MCAI
                </span>
                <span className="text-[11px] text-slate-400">
                  Brain, news, and memory all routed through Solace.
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                <span>Founder lane • Live</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
