// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 *  - Animated MCAI "neural grid" + brain hero background.
 *  - Scoped to the /app experience only (does not affect other routes).
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-[60vh] overflow-hidden bg-[#020617]">
      {/* Brain hero layer */}
      <div className="mca-brain-layer pointer-events-none" aria-hidden="true" />

      {/* Animated neural grid layer */}
      <div className="mca-neural-layer pointer-events-none" aria-hidden="true" />

      {/* Soft vignette / glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 70% 80%, rgba(56,189,248,0.30) 0, transparent 42%), radial-gradient(circle at 0% 0%, rgba(15,23,42,0.9) 0, rgba(15,23,42,0.98) 65%)",
          mixBlendMode: "screen",
          opacity: 0.6,
        }}
      />

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-10">
        {children}
      </div>

      {/* Global animation + layers */}
      <style jsx global>{`
        .mca-brain-layer {
          position: fixed;
          inset: 0;
          background-image: url("/mca-brain-hero.png");
          background-repeat: no-repeat;
          background-position: right bottom;
          background-size: min(80vh, 60vw);
          opacity: 0.85;
          mix-blend-mode: screen;
          filter: drop-shadow(0 0 35px rgba(56, 189, 248, 0.45));
          z-index: 0;
        }

        .mca-neural-layer {
          position: fixed;
          inset: -40%;
          background-image:
            /* horizontal traces */
            repeating-linear-gradient(
              0deg,
              rgba(56, 189, 248, 0.16) 0px,
              rgba(56, 189, 248, 0.16) 1px,
              transparent 1px,
              transparent 6px
            ),
            /* vertical traces */
            repeating-linear-gradient(
              90deg,
              rgba(129, 140, 248, 0.12) 0px,
              rgba(129, 140, 248, 0.12) 1px,
              transparent 1px,
              transparent 10px
            ),
            /* random pulse sparks */
            radial-gradient(
              circle at 10% 20%,
              rgba(56, 189, 248, 0.35),
              transparent 55%
            ),
            radial-gradient(
              circle at 70% 10%,
              rgba(59, 130, 246, 0.38),
              transparent 55%
            ),
            radial-gradient(
              circle at 85% 75%,
              rgba(56, 189, 248, 0.4),
              transparent 55%
            );
          opacity: 0.45;
          mix-blend-mode: screen;
          animation: mcaNeuralSweep 26s linear infinite;
          z-index: 0;
        }

        @keyframes mcaNeuralSweep {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.4;
          }
          30% {
            opacity: 0.55;
          }
          60% {
            opacity: 0.7;
          }
          100% {
            transform: translate3d(-160px, -120px, 0);
            opacity: 0.4;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mca-neural-layer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
