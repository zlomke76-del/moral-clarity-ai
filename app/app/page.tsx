// app/app/page.tsx
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div className="mca-shell">
      {/* Neural background layers */}
      <div className="mca-neural-layer" aria-hidden="true" />
      <div className="mca-brain-layer" aria-hidden="true" />

      {/* Foreground content */}
      <div className="mca-shell-inner relative z-10">
        <div className="mx-auto flex w-full max-w-6xl px-4 py-10 gap-10">
          {/* LEFT: Workspaces column (compressed like a sidebar) */}
          <section className="w-full max-w-xl shrink-0">
            <FeatureGrid />
          </section>

          {/* RIGHT: Open canvas for Solace dock + future stuff */}
          <section className="hidden lg:block flex-1" />
        </div>
      </div>
    </div>
  );
}
