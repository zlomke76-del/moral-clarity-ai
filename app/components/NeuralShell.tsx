// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 * - mca-backdrop.png = full-screen circuit background
 * - Triangle-Anchor.png = fixed overlay, hard-centered at the top
 * - Both are fixed to the viewport (no dependency on sidebar width)
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* 1) CIRCUIT BACKDROP — full viewport */}
      <div
        className="pointer-events-none fixed inset-0 -z-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/mca-backdrop.png")' }}
        aria-hidden="true"
      />

      {/* 2) TRIANGLE OVERLAY — true top-center, independent of layout */}
      <div
        className="pointer-events-none fixed inset-0 -z-30 flex items-start justify-center"
        aria-hidden="true"
      >
        <div className="mt-16 relative">
          <img
            src="/Triangle-Anchor.png"
            alt="Moral Clarity Anchor Symbol"
            className="block max-h-[min(70vh,72vw)] w-auto select-none drop-shadow-[0_0_32px_rgba(56,189,248,0.75)]"
          />
        </div>
      </div>

      {/* 3) SOFT GLOW / DARKEN LAYER */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 70%, rgba(15,23,42,0.5), transparent 65%)",
        }}
      />

      {/* 4) CONTENT — Solace + sidebar */}
      <div className="relative z-10 flex min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}

