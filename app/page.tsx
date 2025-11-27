// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16">
        {/* Simple header */}
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            Moral Clarity AI
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Solace • Anchored AI guidance.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            This is your clean starting point. No sidebars, no workspace tiles —
            just a simple entry into the app routes you care about.
          </p>
        </header>

        {/* Primary actions */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/app/decision-brief"
            className="rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 text-sm shadow-[0_18px_60px_rgba(15,23,42,0.9)] transition hover:border-sky-400/80 hover:bg-slate-900 hover:shadow-[0_24px_80px_rgba(8,47,73,0.95)]"
          >
            <h2 className="mb-1 text-sm font-semibold">Open Solace Workspace</h2>
            <p className="text-xs text-slate-300">
              Go straight into your Solace decision workspace.
            </p>
          </Link>

          <Link
            href="/app/newsroom"
            className="rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 text-sm shadow-[0_18px_60px_rgba(15,23,42,0.9)] transition hover:border-sky-400/80 hover:bg-slate-900 hover:shadow-[0_24px_80px_rgba(8,47,73,0.95)]"
          >
            <h2 className="mb-1 text-sm font-semibold">Neutral Newsroom</h2>
            <p className="text-xs text-slate-300">
              Jump into the Neutrality Cabinet and digest view.
            </p>
          </Link>
        </section>

        {/* Lightweight footer text */}
        <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500">
          <p>
            This layout is intentionally minimal. We removed the old Neural
            Sidebar and FeatureGrid so you can rebuild navigation on your own terms.
          </p>
        </footer>
      </div>
    </main>
  );
}
