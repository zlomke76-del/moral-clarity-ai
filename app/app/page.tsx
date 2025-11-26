// app/app/page.tsx
import FeatureGrid from "@/app/components/FeatureGrid";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import BrainHero from "@/app/components/BrainHero";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div className="min-h-[70vh] py-8 md:py-10">
      {/* Hero: neural sidebar + brain center */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:grid md:grid-cols-[260px,minmax(0,1fr)] md:items-stretch">
        {/* Left neural nav */}
        <NeuralSidebar />

        {/* Brain hero / Solace anchor area */}
        <BrainHero />
      </section>

      {/* Existing feature grid moved below hero */}
      <section className="mx-auto mt-12 w-full max-w-6xl">
        <FeatureGrid />
      </section>
    </div>
  );
}
