// ------------------------------------------------------------
// The Edge Framework — Canonical Index
// Upgraded to Constraint-Bound Admissibility Framework
// App Router | Next.js 16 SAFE
// ------------------------------------------------------------

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Edge Framework",
  description:
    "The Edge Framework defines the ordered constraint boundaries where knowledge, practice, protection, stewardship, and insurability become admissible.",
  openGraph: {
    title: "The Edge Framework",
    description:
      "A structured constraint framework defining the ordered boundaries of accountable, governed, and insurable AI systems.",
    type: "website",
  },
};

type EdgeItem = {
  title: string;
  slug: string;
  description: string;
  signal: string;
};

const EDGES: EdgeItem[] = [
  {
    title: "Edge of Knowledge",
    slug: "/edge/knowledge",
    description:
      "Knowledge is admissible only if the epistemic boundary holds. This Edge defines what is known, unknown, unobservable, or falsely assumed before action can begin.",
    signal: "Epistemic Boundary",
  },
  {
    title: "Edge of Practice",
    slug: "/edge/practice",
    description:
      "Practice is admissible only if reality does not fail under stress. This Edge evaluates falsification, operational breakdown, and real-world constraint failure.",
    signal: "Operational Falsification",
  },
  {
    title: "Edge of Protection",
    slug: "/edge/protection",
    description:
      "Protection is admissible only if harm is structurally prevented. This Edge governs misuse, authority leakage, refusal integrity, and boundary enforcement.",
    signal: "Protective Constraint",
  },
  {
    title: "Edge of Stewardship",
    slug: "/edge/stewardship",
    description:
      "Stewardship is admissible only if responsibility is bounded and enforceable. This Edge defines accountability, delegated authority, and human responsibility.",
    signal: "Authority Boundary",
  },
  {
    title: "Edge of Insurability",
    slug: "/edge/insurability",
    description:
      "Insurability is admissible only if risk is bounded, attributable, and economically governable. This Edge defines the transition from experiment to accountable system.",
    signal: "Economic Accountability",
  },
];

export default function EdgeIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            The Edge Framework
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              Constraint Framework
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              Ordered Boundaries
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              Admissibility Logic
            </span>
          </div>

          <p className="max-w-4xl text-neutral-300">
            The Edge Framework defines the ordered boundaries where artificial
            intelligence systems move from theory to reality. Each Edge is a
            constraint surface. If an earlier Edge fails, later claims are
            invalid. Admissibility propagates forward only when prior boundaries
            hold.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-lg leading-relaxed text-white">
          Systems are admissible only if each Edge holds in sequence.
        </p>
        <p className="mt-4 text-neutral-400">
          Failure at an earlier boundary invalidates every downstream claim.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION / WHY THIS MATTERS */}
      {/* ===================================================== */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Tested Assumption</h2>
          <p className="mt-2 text-neutral-600">
            AI systems can move from knowledge to deployment only when each
            constraint boundary is satisfied in order.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Why This Matters</h2>
          <p className="mt-2 text-neutral-600">
            Most systems fail by advancing capability before earlier boundaries
            are proven. The result is proxy success without admissible reality.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">System Definition</h2>
        <p className="text-neutral-600">
          The Edge Framework is an ordered admissibility stack composed of five
          cumulative boundaries: Knowledge, Practice, Protection, Stewardship,
          and Insurability.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Governing Variable</h2>
        <p className="text-neutral-600">
          Sequential boundary integrity across the full stack. A later Edge is
          valid only if all prior Edges remain satisfied.
        </p>
      </section>

      {/* ===================================================== */}
      {/* EXPERIMENTAL / BOUNDARY SETUP */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-6">
        <h2 className="text-lg font-semibold">Experimental / Boundary Setup</h2>

        <div className="grid gap-4">
          {EDGES.map((edge) => (
            <Link
              key={edge.slug}
              href={edge.slug}
              className="rounded-2xl border p-6 transition hover:bg-neutral-50 dark:hover:bg-white/5"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold">{edge.title}</h3>
                  <span className="rounded-full border px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300">
                    {edge.signal}
                  </span>
                </div>
                <p className="max-w-4xl text-sm leading-relaxed text-neutral-600">
                  {edge.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* BINARY FALSIFICATION THRESHOLD */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Binary Falsification Threshold</h2>
        <p className="text-neutral-600">
          The framework fails if any downstream claim is made after an upstream
          Edge has not been satisfied.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL INTERPRETATION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Operational Interpretation</h2>
        <p className="text-neutral-600">
          The Edges are independent in domain but cumulative in force.
          Knowledge must hold before practice. Practice must hold before
          protection. Protection must hold before stewardship. Stewardship must
          hold before insurability.
        </p>
        <p className="text-neutral-600">
          No later Edge can repair failure at an earlier one.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This index defines structural ordering only. It does not substitute
          for the individual constraint logic contained within each Edge.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="mt-2 text-neutral-600">
            Each Edge is satisfied in sequence, and no downstream claim exceeds
            the last validated boundary.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="mt-2 text-neutral-600">
            Any downstream claim is made after an earlier Edge has failed,
            remained unproven, or been bypassed.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-lg text-white">
          A system cannot become later-stage valid by skipping earlier reality.
        </p>
        <p className="mt-4 text-neutral-400">
          If an earlier Edge fails, every later claim is invalid. Admissibility
          is cumulative, not rhetorical.
        </p>
      </section>
    </main>
  );
}
