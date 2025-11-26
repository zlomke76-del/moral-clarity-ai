// app/app/newsroom/page.tsx
export const runtime = "nodejs";

export default function NewsroomCabinetPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-8 py-10">
      <h1 className="text-2xl font-semibold mb-2">Newsroom Cabinet</h1>
      <p className="text-sm text-slate-400">
        Neutral news digest, outlet cabinet, and bias telemetry will live here.
      </p>
    </main>
  );
}
