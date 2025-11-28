// app/memory/page.tsx

import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function MemoryPage() {
  return (
    <div className="flex min-h-screen w-full">
      <NeuralSidebar />

      <main className="relative flex flex-1 items-center justify-center px-8 py-10">
        <section className="max-w-2xl w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          <header className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Memory
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-50">
              Supabase Memory Console (Foundations)
            </h1>
          </header>

          <p className="text-sm text-slate-300/90">
            This page will evolve into your{" "}
            <span className="font-medium">Solace memory control room</span>:
          </p>

          <ul className="mt-3 space-y-1.5 text-sm text-slate-300/85">
            <li>• Inspect episodic and factual memories for your account</li>
            <li>• Search and filter by bucket (working, long-term, parked)</li>
            <li>• Manually prune, pin, or export memories</li>
            <li>• View drift-protection and retention metrics</li>
          </ul>

          <p className="mt-4 text-xs text-slate-400">
            Right now this is a structural placeholder. Next step is to plug it
            into your existing Supabase RPCs (e.g.{" "}
            <code className="font-mono text-[0.7rem]">match_episodic_memories</code>
            ) and render a paginated table / inspector here.
          </p>
        </section>
      </main>
    </div>
  );
}
