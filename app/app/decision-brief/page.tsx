// app/app/decision-brief/page.tsx
export const dynamic = "force-dynamic";

export default function DecisionBriefPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Decision Brief" blurb="One clear page to move from overwhelm to action." />
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 lg:col-span-2">
        <h2 className="mb-2 text-sm font-semibold text-zinc-300">New brief</h2>
        <textarea
          className="h-40 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm outline-none placeholder:text-zinc-500"
          placeholder="Describe your decision context…"
        />
        <div className="mt-3 flex gap-2">
          <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            Generate outline
          </button>
          <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
            Save draft
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-300">Recent</h2>
        <p className="text-sm text-zinc-500">No briefs yet.</p>
      </section>
    </div>
  );
}
