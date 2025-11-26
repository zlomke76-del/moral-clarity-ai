// app/app/journey/page.tsx
export const runtime = "nodejs";

export default function JourneyPlannerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-8 py-10">
      <h1 className="text-2xl font-semibold mb-2">Journey Planner</h1>
      <p className="text-sm text-slate-400">
        This will become the MCAI workspace for mapping paths, owners, and timelines.
        For now it’s a placeholder so routing works from the app home.
      </p>
    </main>
  );
}
