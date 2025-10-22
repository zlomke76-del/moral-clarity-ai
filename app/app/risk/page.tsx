export const dynamic = "force-dynamic";

export default function RiskPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Risk Mapper" blurb="Surface, score, and mitigate risks." />
      <Scaffold />
    </main>
  );
}

function Header({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-zinc-400">{blurb}</p>
    </div>
  );
}

function Scaffold() {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Risk</h2>
          <input className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-sm" placeholder="Name…" />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Likelihood</h2>
          <input className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-sm" placeholder="1–5" />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">Impact</h2>
          <input className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-sm" placeholder="1–5" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500">
          Add risk
        </button>
        <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
          Export CSV
        </button>
      </div>
    </div>
  );
}
