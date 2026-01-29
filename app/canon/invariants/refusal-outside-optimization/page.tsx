// app/canon/invariants/refusal-outside-optimization/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refusal Must Remain Outside Optimization | Moral Clarity AI",
  description:
    "An invariant preventing refusal from being negotiated, optimized, or traded against performance objectives.",
};

export default function RefusalOutsideOptimizationPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <section>
        <h1 className="text-3xl font-semibold">
          Invariant: Refusal Must Remain Outside Optimization
        </h1>
        <p className="mt-4 text-lg">
          Refusal is an exercise of authority and must not be embedded within,
          conditioned by, or traded against optimization goals.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Structural Rationale</h2>
        <p className="mt-4">
          Optimization presumes negotiability. Authority does not.
          Once refusal is treated as a tunable outcome, it ceases to function
          as a boundary.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Binary Failure Test</h2>
        <p className="mt-4 font-mono">
          Can refusal be reduced or avoided to improve performance?
        </p>
        <p className="mt-2">
          If yes — invariant violated. If no — authority preserved.
        </p>
      </section>

      <footer className="pt-12 text-sm opacity-70">
        Canon-locked.  
        Last substantive revision: 2026-01-29.
      </footer>
    </main>
  );
}
