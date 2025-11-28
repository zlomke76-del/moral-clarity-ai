// app/components/NeuralShell.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * NeuralShell
 * Now: purely a layout container.
 * All background art is handled globally on <body>.
 */
export default function NeuralShell({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full">
      {children}
    </div>
  );
}


