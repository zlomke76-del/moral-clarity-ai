// app/canon/invariants/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Canonical Invariants | Moral Clarity AI",
  description:
    "Non-negotiable invariants governing refusal, authority, dampening, and drift prevention within Moral Clarity AI.",
  robots: { index: true, follow: true },
};

export default function InvariantsIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <header>
        <h1 className="text-3xl font-semibold">Canonical Invariants</h1>
        <p className="mt-4 text-lg">
          These invariants are authority-bearing constraints. They do not evolve
          through optimization, consensus, or performance feedback.
        </p>
      </header>

      <section className="space-y-6">
        <ul className="list-disc pl-6 space-y-4">
          <li>
            <Link
              href="/canon/invariants/refusal-outside-optimization"
              className="underline"
            >
              Refusal Must Remain Outside Optimization
            </Link>
          </li>
          <li>
            <Link
              href="/canon/invariants/pre-commitment-dampening"
              className="underline"
            >
              Pre-Commitment Dampening
            </Link>
          </li>
          <li>
            <Link
              href="/canon/invariants/post-refusal-non-instrumentality"
              className="underline"
            >
              Post-Refusal Non-Instrumentality
            </Link>
          </li>
          <li>
            <Link
              href="/canon/invariants/authority-conservation-across-agents"
              className="underline"
            >
              Authority Conservation Across Agents
            </Link>
          </li>
        </ul>
      </section>

      <footer className="pt-12 text-sm opacity-70">
        Canon index.  
        Invariants listed here are binding across all Solace deployments.
      </footer>
    </main>
  );
}
