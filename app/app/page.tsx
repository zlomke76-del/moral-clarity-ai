// app/app/page.tsx
import NeuralShell from "@/app/components/NeuralShell";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import BrainHero from "@/app/components/BrainHero";
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <NeuralShell>
      {/* Hero: neural sidebar + brain center */}
      <section className="flex w-full flex-col gap-6 md:grid md:grid-cols-[260px,minmax(0,1fr)] md:items-stretch">
        {/* Left neural nav */}
        <NeuralSidebar />

        {/* Brain hero / Solace anchor area */}
        <BrainHero />
      </section>

      {/* Workspaces grid below hero */}
      <section className="mt-10 md:mt-12">
        <FeatureGrid />
      </section>
    </NeuralShell>
  );
}
