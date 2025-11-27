// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col justify-center gap-8 px-4 py-16 md:py-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-400/80">
            Solace
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            Anchored AI guidance.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            A clean starting point. No sidebars, no workspace tiles — just direct
            entry into the Solace routes you actually use.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/decision-brief"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.55)] transition hover:bg-sky-400"
          >
            Open Solace workspace
          </Link>

          <Link
            href="/app/newsroom"
            className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-100 transition hover:border-sky-400 hover:text-sky-100"
          >
            Neutral Newsroom
          </Link>
        </div>
      </div>
    </div>
  );
}

