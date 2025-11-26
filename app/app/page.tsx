// app/app/page.tsx
import FeatureGrid from "@/app/components/FeatureGrid";
import NeuralShell from "@/app/components/NeuralShell";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <NeuralShell>
      <FeatureGrid />
      {/* Chat is mounted once globally via <SolaceDock /> in app/layout.tsx */}
    </NeuralShell>
  );
}
