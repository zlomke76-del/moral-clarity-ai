// app/components/NeuralShell.tsx
"use client";

import React from "react";

/**
 * NeuralShell
 * Final clean version:
 * - Circuit PNG is fully visible
 * - One (1) controlled fade layer on top of PNG
 * - Triangle badge floats on the right without interfering
 * - No sidebar hover bleed
 * - All legacy systems removed
 */
export default function NeuralShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      {/* BACKDROP — Circuit PNG */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: `url("/mca-backdrop.png")`,
        }}
      />

      {/* FADE OVERLAY — improves left-sidebar legibility */}
      <div
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background:
            "linear-gradient(to right, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.25) 18%, rgba(2,6,23,0.00) 36%, rgba(2,6,23,0.00) 64%, rgba(2,6,23,0.20) 90%, rgba(2,6,23,0.55) 100%)",
        }}
      />

      {/* ANCHOR TRIANGLE (desktop only) */}
      <div className="hidden lg:flex items-center justify-center absolute top-10 right-12 z-30 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border border-blue-400/50 shadow-[0_0_40px_rgba(56,189,248,0.65)] opacity-70 animate-pulse" />
        <img
          src="/Triangle-Anchor.png"
          alt="Moral Clarity Anchor Symbol"
          className="relative w-20 h-20 select-none"
        />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-40">{children}</div>
    </div>
  );
}
