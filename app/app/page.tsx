// app/app/page.tsx
import NeuralSidebar from "@/app/components/NeuralSidebar";
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div className="min-h-screen bg-slate-950/95 py-8 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 lg:grid lg:grid-cols-[260px,minmax(0,1fr)] lg:items-start">
        {/* Left: Solace System / anchored entry points */}
        <NeuralSidebar />

        {/* Right: Anchor AI hero + workspaces grid */}
        <FeatureGrid />
      </div>
    </div>
  );
}
