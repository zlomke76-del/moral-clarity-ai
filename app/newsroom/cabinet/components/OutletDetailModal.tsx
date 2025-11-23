"use client";

import { useEffect } from "react";
import TrendChart from "./TrendChart"; // Ensure this import is correct
import type { OutletTrendPoint, OutletDetailData } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void; // This prop is for opening/closing the modal
  trends: OutletTrendPoint[] | null;
  outlet: OutletDetailData | null; // Ensure this is included
  onClose: () => void; // Add this line
};

export default function OutletDetailModal({
  open,
  onOpenChange,
  trends,
  outlet, // Ensure this is included
  onClose, // Add this line
}: Props) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose(); // Use onClose instead of onOpenChange
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
          {outlet && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-neutral-200">{outlet.display_name}</h3>
              <p className="text-sm text-neutral-400">{outlet.canonical_outlet}</p>
            </div>
          )}
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
