export const dynamic = "force-dynamic";

export default function EthicsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Ethics Lens" blurb="See trade-offs with moral clarity." />
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
      <h2 className="mb-2 text-sm font-semibold text-zinc-300">Scenario</h2>
      <textarea
        className="h-36 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm outline-none placeholder:text-zinc-500"
        placeholder="Describe the decision and affected parties…"
      />
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
          Analyze trade-offs
        </button>
      </div>
    </div>
  );
}
