// app/app/page.tsx
import Image from "next/image";
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div className="min-h-screen w-full flex flex-row gap-8">
      
      {/* LEFT COLUMN */}
      <div className="w-[40%] px-6 py-8 overflow-y-auto max-h-screen">
        <FeatureGrid />
      </div>

      {/* RIGHT COLUMN — HERO */}
      <div className="w-[60%] flex items-center justify-center relative">
        <Image
          src="/mca-brain-hero.png"
          alt="MCAI"
          width={900}
          height={900}
          className="object-contain opacity-95 pointer-events-none select-none"
          priority
        />
      </div>
    </div>
  );
}
