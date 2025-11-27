"use client";

import type { ReactNode } from "react";

export default function NeuralShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">

      {/* BACKDROP — Circuit PNG (full visibility) */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("/mca-backdrop.png")`,
        }}
      />

      {/* TRIANGLE ANCHOR — centered top, always visible on desktop/tablet */}
      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 z-30">
        <img
          src="/Triangle-Anchor.png"
          alt="Moral Clarity Anchor Symbol"
          className="w-24 h-24 select-none opacity-[0.88]"
        />
      </div>

      {/* CONTENT (Solace Dock + Sidebar) */}
      <div className="relative z-40">
        {children}
      </div>
    </div>
  );
}
