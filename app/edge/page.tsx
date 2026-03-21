// app/edge/page.tsx
// ------------------------------------------------------------
// The Edge Framework — Canonical Index (Correct Routing)
// ------------------------------------------------------------

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Edge Framework",
  description:
    "The Edge Framework defines the ordered constraint boundaries where knowledge, practice, protection, stewardship, and insurability become admissible.",
};

type EdgeItem = {
  title: string;
  slug: string;
  description: string;
  signal: string;
  index: string;
};

const EDGES: EdgeItem[] = [
  {
    title: "Edge of Knowledge",
    slug: "/edge-of-knowledge", // ✅ fixed
    description:
      "Knowledge is admissible only if the epistemic boundary holds.",
    signal: "Epistemic Boundary",
    index: "01",
  },
  {
    title: "Edge of Practice",
    slug: "/edge-of-practice", // ✅ fixed
    description:
      "Practice is admissible only if reality does not fail under stress.",
    signal: "Operational Falsification",
    index: "02",
  },
  {
    title: "Edge of Protection",
    slug: "/edge-of-protection", // ✅ fixed
    description:
      "Protection is admissible only if harm is structurally prevented.",
    signal: "Protective Constraint",
    index: "03",
  },
  {
    title: "Edge of Stewardship",
    slug: "/stewardship-canon", // ✅ fixed
    description:
      "Stewardship is admissible only if responsibility is bounded and enforceable.",
    signal: "Authority Boundary",
    index: "04",
  },
  {
    title: "Edge of Insurability",
    slug: "/edge/insurability", // ✅ matches your current structure
    description:
      "Insurability is admissible only if risk is provably transferable.",
    signal: "Economic Accountability",
    index: "05",
  },
];

export default function EdgeIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-10">
      <section className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          The Edge Framework
        </h1>

        <p className="text-neutral-600 max-w-3xl">
          Each Edge defines a constraint boundary. Admissibility is sequential.
          If an earlier boundary fails, all downstream claims are invalid.
        </p>
      </section>

      <section className="grid gap-6">
        {EDGES.map((edge) => (
          <Link
            key={edge.slug}
            href={edge.slug}
            className="block rounded-xl border p-6 hover:bg-neutral-50 dark:hover:bg-white/5 transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{edge.title}</h2>
              <span className="text-sm text-neutral-500">{edge.index}</span>
            </div>

            <p className="mt-2 text-neutral-600">{edge.description}</p>

            <div className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
              {edge.signal}
            </div>
          </Link>
        ))}
      </section>

      <section className="pt-6 border-t">
        <p className="text-sm text-neutral-500">
          A system cannot become later-stage valid by skipping earlier reality.
        </p>
      </section>
    </main>
  );
}
