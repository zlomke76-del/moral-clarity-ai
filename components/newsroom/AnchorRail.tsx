// components/newsroom/AnchorRail.tsx
"use client";

import { useOutletData } from "@/lib/newsroom/useOutletData";
import OutletCard from "./OutletCard";

export default function AnchorRail() {
  const { goldenAnchor } = useOutletData();

  return (
    <section>
      <h2 className="mb-4 text-center text-sm font-semibold tracking-wide text-amber-300">
        Golden Anchor
      </h2>

      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4">
          {goldenAnchor.map((outlet) => (
            <OutletCard
              key={outlet.domain}
              outlet={outlet}
              emphasis="anchor"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
