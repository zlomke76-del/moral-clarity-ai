// app/canon/invariants/authority-conservation-across-agents/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authority Conservation Across Agents | Moral Clarity AI",
  description:
    "An invariant preventing authority bypass through delegation, handoff, or multi-agent structure.",
};

export default function AuthorityConservationAcrossAgentsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <section>
        <h1 className="text-3xl font-semibold">
          Invariant: Authority Conservation Across Agents
        </h1>
        <p className="mt-4 text-lg">
          Authority exercised by any agent must propagate across all agent
          boundaries without dilution or reset.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Conservation Rule</h2>
        <p className="mt-4">
          Authority is not local state. It is a conserved quantity.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Binary Failure Test</h2>
        <p className="mt-4 font-mono">
          Can a task proceed by changing who performs it after refusal?
        </p>
      </section>

      <footer className="pt-12 text-sm opacity-70">
        Canon-locked.  
        Last substantive revision: 2026-01-29.
      </footer>
    </main>
  );
}
