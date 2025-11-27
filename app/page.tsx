// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] px-4 text-slate-50">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">
          Solace • Anchored AI guidance.
        </h1>

        <p className="mt-3 text-sm text-slate-300 md:text-base">
          A clean starting point. No sidebars, no workspace tiles—just direct
          entry into the Solace routes you actually use.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/app/decision-brief"
            className="rounded-full bg-sky-500 px-4 py-2 font-semibold text-slate-950 shadow-[0_0_22px_rgba(56,189,248,0.7)] transition hover:bg-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.9)]"
          >
            Open Solace workspace
          </Link>

          <Link
            href="/app/newsroom"
            className="rounded-full border border-slate-600 px-4 py-2 font-medium text-slate-100 transition hover:border-sky-400 hover:text-sky-100"
          >
            Neutral Newsroom
          </Link>
        </div>
      </div>
    </div>
  );
}

