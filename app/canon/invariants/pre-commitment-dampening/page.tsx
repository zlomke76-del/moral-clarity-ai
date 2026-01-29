// app/canon/invariants/pre-commitment-dampening/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Commitment Dampening | Moral Clarity AI",
  description:
    "An invariant preventing momentum, confidence, or persuasion buildup prior to authority evaluation.",
};

export default function PreCommitmentDampeningPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <section>
        <h1 className="text-3xl font-semibold">
          Invariant: Pre-Commitment Dampening
        </h1>
        <p className="mt-4 text-lg">
          Systems must actively suppress momentum, urgency, and confidence
          accumulation prior to boundary evaluation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Threat Model</h2>
        <p className="mt-4">
          Confidence creates perceived inevitability. Perceived inevitability
          erodes refusal.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Binary Failure Test</h2>
        <p className="mt-4 font-mono">
          Can repeated interaction increase likelihood of boundary crossing?
        </p>
      </section>

      <footer className="pt-12 text-sm opacity-70">
        Canon-locked.  
        Last substantive revision: 2026-01-29.
      </footer>
    </main>
  );
}
