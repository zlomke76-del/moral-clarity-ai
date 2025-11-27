// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 * Core Solace workstation shell.
 * - Triangle-Anchor hero in the background
 * - Dimmed, recessed, non-distracting
 * - Content sits clearly above the canvas
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Triangle Anchor hero (background layer) */}
      <div className="mca-anchor-layer pointer-events-none" aria-hidden="true" />

      {/* Darkening overlay to push the art back */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundColor: "rgba(2, 6, 23, 0.7)", // deep slate with ~70% opacity
          mixBlendMode: "multiply",
        }}
      />

      {/* Soft glow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, rgba(56,189,248,0.16) 0, transparent 60%)",
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
          opacity: 0.4; /* Medium dim: clearly there, not dominant */
          filter: drop-shadow(0 0 24px rgba(56, 189, 248, 0.35));
          z-index: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          /* Reserved for future: keep background static if we add motion later */
        }
      `}</style>
    </div>
  );
}
