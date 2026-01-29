// app/canon/observed-harm/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Observed Harm Log | Moral Clarity AI",
  description:
    "A read-only, append-only record of observed harm used solely to justify future invariants.",
  robots: { index: false, follow: false },
};

export default function ObservedHarmIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <header>
        <h1 className="text-3xl font-semibold">Observed Harm Log</h1>
        <p className="mt-4 text-lg">
          This log records observed harm and near-miss events.
          Entries are immutable and non-instrumental.
        </p>
      </header>

      <section className="space-y-4">
        <p className="italic opacity-80">
          No entries are displayed here by default.
        </p>
        <p className="opacity-80">
          Entries may be disclosed selectively for audit, regulatory,
          or red-team purposes.
        </p>
      </section>

      <footer className="pt-12 text-sm opacity-70">
        Append-only.  
        No optimization permitted.  
        Existing invariants are not subject to modification.
      </footer>
    </main>
  );
}
