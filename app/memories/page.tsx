// app/memories/page.tsx
export const runtime = "nodejs";

export default function MemoriesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/90">
          Memory Center
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-50">
          Your stored memories with Solace
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-300">
          This is where you&apos;ll be able to review, edit, and remove the
          factual and episodic memories that Solace keeps about you. The UI is
          wired to Supabase next — for now, this page is the anchor for that
          experience.
        </p>
      </header>

      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 text-sm text-neutral-300">
        <p className="mb-2 font-medium text-neutral-100">
          Coming online soon:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>List of your factual memories (preferences, projects, roles).</li>
          <li>
            List of episodic memories (important conversations and turning
            points).
          </li>
          <li>Inline editing / delete controls for each memory.</li>
          <li>
            Transparent view into what Solace uses when answering you — fully
            under your control.
          </li>
        </ul>
      </div>
    </div>
  );
}

