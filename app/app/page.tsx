// app/app/page.tsx
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div className="min-h-[60vh]">
      <FeatureGrid />
      {/* Chat is mounted once globally via <ChatDock /> in app/layout.tsx */}
    </div>
  );
}
