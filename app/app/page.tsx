// app/app/page.tsx
import NeuralShell from "@/app/components/NeuralShell";
import FeatureGrid from "@/app/components/FeatureGrid";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import BrainHero from "@/app/components/BrainHero";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <NeuralShell>
      {/* Hero: neural sidebar + brain center */}
      <section className="flex w-full max-w-6xl flex-col gap-6 md:mx-auto md:grid md:grid-cols-[260px,minmax(0,1fr)] md:items-stretch">
        {/* Left neural nav */}
        <NeuralSidebar />

        {/* Brain hero / Solace anchor area */}
        <BrainHero />
      </section>

      {/* Neural workspaces grid below hero */}
      <section className="mx-auto mt-12 w-full max-w-6xl pb-16">
        <FeatureGrid />
      </section>
    </NeuralShell>
  );
}
