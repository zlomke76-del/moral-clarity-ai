// app/components/NeuralShell.tsx
"use client";

import React, { type ReactNode } from "react";

/**
 * NeuralShell
 *
 * - Provides the full-screen MCA backdrop (mca-backdrop.png).
 * - Adds neural ambient effects (brain hero, sweeps, pulses, anchor badge).
 * - Wraps the /app workspace content.
 *
 * Very intentional:
 * - The PNG is the true background layer.
 * - We do NOT override SolaceDock positioning.
 * - No extra gradients that would hide the circuits.
 */
export default function NeuralShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-slate-50">
      {/* Base backdrop: full-screen PNG with circuits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 bg-[url('/mca-backdrop.png')] bg-cover bg-center"
      />

      {/* Neural ambient layer (brain, lines, pulses, anchor badge) */}
      <div
        aria-hidden="true"
        className="neural-ambient absolute inset-0 -z-20"
      >
        {/* NOTE: we intentionally omit the .neural-ambient__fade here
            so the PNG backdrop stays visible and crisp. */}

        {/* Brain hero on the right */}
        <div className="neural-ambient__brain" />

        {/* Sweeping neural lines */}
        <div className="neural-ambient__line neural-ambient__line--slow" />
        <div className="neural-ambient__line neural-ambient__line--fast" />

        {/* Pulsing nodes */}
        <div className="neural-ambient__pulse neural-ambient__pulse--tl" />
        <div className="neural-ambient__pulse neural-ambient__pulse--br" />

        {/* Anchor badge in the top-right */}
        <div className="neural-anchor-badge">
          <div className="neural-anchor-badge__glow" />
          <img
            className="neural-anchor-badge__icon"
            src="/Triangle-Anchor.png"
            alt="Moral Clarity anchor emblem"
          />
        </div>
      </div>

      {/* Foreground content: sidebar + SolaceDock workspace */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl px-4 py-8">
        {children}
      </div>
    </div>
  );
}


