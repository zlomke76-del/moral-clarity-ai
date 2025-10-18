export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-10 pb-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
          Moral Clarity AI
        </h1>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          AI guidance grounded in truth, neutrality, and moral clarity.
        </p>
      </section>

      {/* Cards */}
      <section className="grid gap-6 sm:grid-cols-2">
        <a
          href="/app"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
            Create Mode
          </div>
          <h3 className="text-xl font-semibold mb-2">Decision Brief</h3>
          <p className="text-zinc-300">
            Turn overwhelm into action in one clear page.
          </p>
        </a>

        <a
          href="/app"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
          <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
            Guidance Mode
          </div>
          <h3 className="text-xl font-semibold mb-2">Red-team Check</h3>
          <p className="text-zinc-300">
            Catch blind spots before they catch you.
          </p>
        </a>
      </section>
    </>
  );
}
