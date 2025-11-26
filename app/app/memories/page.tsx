// app/app/memories/page.tsx
export const runtime = "nodejs";

export default function MemoryStudioPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-8 py-10">
      <h1 className="text-2xl font-semibold mb-2">Memory Studio</h1>
      <p className="text-sm text-slate-400">
        Future home of your editable Supabase memories & manual curation tools.
      </p>
    </main>
  );
}
