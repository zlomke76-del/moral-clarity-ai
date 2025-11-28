// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 * - Circuit-board PNG as full-screen background
 * - Soft side fade for legibility
 * - Triangle overlay at top center (behind content, no pointer bleed)
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* BACKGROUND — circuit PNG */}
      <div
        className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/mca-backdrop.png")',
        }}
        aria-hidden="true"
      />

      {/* FADE OVERLAY — improves left-sidebar legibility */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(to right, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.3) 18%, rgba(2,6,23,0.0) 36%, rgba(2,6,23,0.0) 64%, rgba(2,6,23,0.25) 88%, rgba(2,6,23,0.65) 100%)",
        }}
        aria-hidden="true"
      />

      {/* TRIANGLE ANCHOR — top center, behind UI, no pointer capture */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="absolute h-20 w-20 rounded-2xl border border-blue-400/50 shadow-[0_0_40px_rgba(56,189,248,0.65)] opacity-70" />
        <img
          src="/Triangle-Anchor.png"
          alt=""
          className="relative h-16 w-16 select-none"
        />
      </div>

      {/* CONTENT — sits above everything */}
      <div className="relative z-0 flex min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
