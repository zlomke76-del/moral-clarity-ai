"use client";

import { useEffect } from "react";
import TrendChart from "./TrendChart"; // Ensure this import is correct
import type { OutletTrendPoint } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trends: OutletTrendPoint[] | null;
};

export default function OutletDetailModal({
  open,
  onOpenChange,
  trends,
}: Props) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-3 py-6">
      <div
        className="relative z-10 max-h-full w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-100">Outlet Trends</h2>
          <div className="mt-6">
            {trends ? (
              <TrendChart points={trends} loading={false} />
            ) : (
              <TrendChart points={null} loading={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
