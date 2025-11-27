"use client";

import React from "react";

/**
 * NeuralShell
 * Clean + corrected layering:
 * - PNG fully visible
 * - Fade overlay above PNG, below UI
 * - Triangle badge restored and not interfering with sidebar
 */
export default function NeuralShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">

      {/* BACKDROP — circuit PNG (fully visible) */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: `url("/mca-backdrop.png")`,
        }}
      />

      {/* FADE — above PNG, below UI */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.25) 18%, rgba(2,6,23,0.00) 36%, rgba(2,6,23,0.00) 64%, rgba(2,6,23,0.20) 90%, rgba(2,6,23,0.55) 100%)",
        }}
      />

      {/* ANCHOR TRIANGLE — fixed z-index + no pointer issues */}
      <div className="hidden lg:flex neural-anchor-badge pointer-events-none z-10">
        <div className="neural-anchor-badge__glow" />
        <img
          src="/Triangle-Anchor.png"
          alt="Moral Clarity Anchor Symbol"
          className="neural-anchor-badge__icon"
        />
      </div>

      {/* CHILDREN */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
