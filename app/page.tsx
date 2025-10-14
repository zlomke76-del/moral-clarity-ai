export default function Page() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold">Anchored answers.</h1>
      <p className="max-w-2xl text-zinc-400">
        Practical clarity without drift. Three modes: Neutral • Guidance • Ministry.
      </p>
      <div className="flex gap-3">
        <a href="/app" className="rounded-lg bg-blue-600 px-4 py-2">Open the app</a>
        <a href="/subscribe" className="rounded-lg border border-zinc-700 px-4 py-2">Pricing</a>
      </div>
    </section>
  );
}
