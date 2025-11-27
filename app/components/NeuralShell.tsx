"use client";

import React from "react";

/**
 * NeuralShell
 * Wraps the entire /app workspace with:
 * - Circuit-board PNG background
 * - Triangle badge (desktop only)
 * - Soft gradient fades for sidebar visibility
 */
export default function NeuralShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">

      {/* BACKDROP LAYER (mca-backdrop.png) */}
      <div
        className="absolute inset-0 -z-[10] bg-cover bg-center bg-no-repeat opacity-[1]"
        style={{
          backgroundImage: `url("/mca-backdrop.png")`,
        }}
      />

      {/* SIDEBAR LEGIBILITY FADE */}
      <div
        className="absolute inset-0 pointer-events-none -z-[20]"
        style={{
          background:
            "linear-gradient(to right, rgba(2,6,23,0.45) 0%, rgba(2,6,23,0.20) 18%, rgba(2,6,23,0.00) 36%, rgba(2,6,23,0.00) 64%, rgba(2,6,23,0.15) 90%, rgba(2,6,23,0.45) 100%)",
        }}
      />

      {/* TRIANGLE ANCHOR BADGE (top-right) */}
      <div className="lg:flex neural-anchor-badge pointer-events-none">
        <div className="neural-anchor-badge__glow" />
        <img
          src="/Triangle-Anchor.png"
          alt="Moral Clarity Anchor Symbol"
          className="neural-anchor-badge__icon"
        />
      </div>

      {/* CHILDREN (Sidebar + SolaceDock) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
