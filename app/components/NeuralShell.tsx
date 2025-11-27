"use client";

import React from "react";

/**
 * NeuralShell
 * -----------
 * Wraps the entire /app workspace. Provides:
 * - Full-screen animated neural backdrop (mca-backdrop.png)
 * - Anchor triangle badge (Triangle-Anchor.png)
 * - Optional brain-hero overlay on the right
 * - Fade overlays to keep the left sidebar readable
 */
export default function NeuralShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* --- BACKDROP LAYER (your new PNG) --- */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.92]"
        style={{
          backgroundImage: `url("/mca-backdrop.png")`,
        }}
      />

      {/* --- OPTIONAL FADE TO IMPROVE LEFT SIDEBAR LEGIBILITY --- */}
      <div
        className="absolute inset-0 pointer-events-none -z-[5]"
        style={{
          background:
            "linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.45) 22%, rgba(2,6,23,0.0) 38%, rgba(2,6,23,0.0) 60%, rgba(2,6,23,0.35) 92%, rgba(2,6,23,0.85) 100%)",
        }}
      />

      {/* --- ANCHOR TRIANGLE BADGE (top-right corner) --- */}
      <div className="hidden lg:flex neural-anchor-badge">
        <div className="neural-anchor-badge__glow" />
        <img
          src="/Triangle-Anchor.png"
          alt="Moral Clarity Anchor Symbol"
          className="neural-anchor-badge__icon"
        />
      </div>

      {/* --- CHILDREN (Sidebar + SolaceDock) --- */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

