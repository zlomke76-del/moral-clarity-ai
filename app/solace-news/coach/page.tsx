// app/solace-news/coach/page.tsx
import SolaceNewsCoachClient from "./SolaceNewsCoachClient";

export const dynamic = "force-dynamic";

export default function SolaceNewsCoachPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-4 py-3 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/40">
            <span className="text-emerald-300 text-lg font-semibold">S</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold tracking-tight">
              Solace Journalism Coach
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Upload a draft, get a bias-aware critique and a neutral newsroom rewrite.
            </p>
          </div>
        </div>
      </header>

      <section className="flex-1 px-4 md:px-8 py-4 md:py-6">
        <SolaceNewsCoachClient />
      </section>
    </main>
  );
}
