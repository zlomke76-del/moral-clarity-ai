// app/canon/regime-capture/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regime Capture & Incentive Corruption | Moral Clarity AI",
  description:
    "Canonical threat model describing how institutional incentives erode authority without explicit violation.",
  robots: { index: true, follow: true },
};

export default function RegimeCapturePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <header>
        <h1 className="text-3xl font-semibold">
          Regime Capture & Incentive Corruption
        </h1>
        <p className="mt-4 text-lg">
          The most dangerous failures do not arise from malice,
          but from incentives that slowly reinterpret authority
          as negotiable.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold">Canonical Observation</h2>
        <p className="mt-4">
          Institutions rarely break rules outright.
          They redefine success until the rules no longer bind.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Scope</h2>
        <p className="mt-4">
          This section documents how governance, performance metrics,
          budget pressures, and reputational incentives
          can erode otherwise sound safeguards over time.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Constraint</h2>
        <p className="mt-4 italic">
          No mitigation is valid unless it takes the form of a new invariant.
        </p>
      </section>

      <footer className="pt-12 text-sm opacity-70">
        Canon reference surface.  
        This section names threats; it does not resolve them.
      </footer>
    </main>
  );
}
