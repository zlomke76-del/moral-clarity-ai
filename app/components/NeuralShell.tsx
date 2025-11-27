// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 * Clean minimal background using the Triangle-Anchor hero image.
 * No sidebars, no clutter — Solace front and center.
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Triangle Anchor hero */}
      <div className="mca-anchor-layer pointer-events-none" aria-hidden="true" />

      {/* Soft glow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, rgba(56,189,248,0.20) 0, transparent 60%)",
          opacity: 0.5,
        }}
      />

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-10">
        {children}
      </div>

      {/* Background styles */}
      <style jsx global>{`
        .mca-anchor-layer {
          position: fixed;
          inset: 0;
          background-image: url("/Triangle-Anchor.png");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain; /* No stretch */
          opacity: 0.85;
          filter: drop-shadow(0 0 35px rgba(56, 189, 248, 0.45));
          z-index: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          /* No animations to reduce motion */
        }
      `}</style>
    </div>
  );
}
