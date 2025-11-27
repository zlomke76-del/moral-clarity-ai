// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 * - mca-backdrop.png as full-page circuit background
 * - Triangle-Anchor.png perfectly centered as an overlay
 * - Solace workspace on top
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* 1) CIRCUIT BACKGROUND */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/mca-backdrop.png")',
        }}
      />

      {/* 2) CENTERED TRIANGLE OVERLAY */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 flex items-center justify-center"
      >
        <img
          src="/Triangle-Anchor.png"
          alt="Moral Clarity Anchor Symbol"
          className="w-[60vw] max-w-[640px] opacity-90 drop-shadow-[0_0_45px_rgba(56,189,248,0.75)]"
        />
      </div>

      {/* 3) CONTENT LAYER (Solace + sidebar) */}
      <div className="relative z-10 flex min-h-screen">
        {children}
      </div>
    </div>
  );
}
