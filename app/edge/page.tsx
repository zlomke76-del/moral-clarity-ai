// app/edge/page.tsx
// ------------------------------------------------------------
// The Edge Framework — Canonical Index
// Elevated visual system with operational instruments
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
  index: string;
};

type InstrumentItem = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
};

const EDGES: EdgeItem[] = [
  {
    title: "Edge of Knowledge",
    slug: "/edge-of-knowledge",
    description:
      "Knowledge is admissible only if the epistemic boundary holds. This Edge defines what is known, unknown, unobservable, or falsely assumed before action can begin.",
    signal: "Epistemic Boundary",
    index: "01",
  },
  {
    title: "Edge of Practice",
    slug: "/edge-of-practice",
    description:
      "Practice is admissible only if reality does not fail under stress. This Edge evaluates falsification, operational breakdown, and real-world constraint failure.",
    signal: "Operational Falsification",
    index: "02",
  },
  {
    title: "Edge of Protection",
    slug: "/edge-of-protection",
    description:
      "Protection is admissible only if harm is structurally prevented. This Edge governs misuse, authority leakage, refusal integrity, and boundary enforcement.",
    signal: "Protective Constraint",
    index: "03",
  },
  {
    title: "Edge of Stewardship",
    slug: "/stewardship-canon",
    description:
      "Stewardship is admissible only if responsibility is bounded and enforceable. This Edge defines accountability, delegated authority, and human responsibility.",
    signal: "Authority Boundary",
    index: "04",
  },
  {
    title: "Edge of Insurability",
    slug: "/edge/insurability",
    description:
      "Insurability is admissible only if risk is bounded, attributable, and economically governable. This Edge defines the transition from experiment to accountable system.",
    signal: "Economic Accountability",
    index: "05",
  },
];

const INSTRUMENTS: InstrumentItem[] = [
  {
    title: "Moral Clarity Governance Audit™",
    slug: "https://studio.moralclarity.ai/governance-audit",
    description:
      "A public governance instrument for diagnosing authority failure, accountability breakdown, boundary collapse, and non-governable risk. It operationalizes Edge logic as reviewable audit structure rather than abstract doctrine.",
    tags: ["Knowledge → Protection", "Detection", "Authority Breakdown"],
  },
  {
    title: "Solace Deployment Contract",
    slug: "https://studio.moralclarity.ai/governance/deployment-contract",
    description:
      "A bounded operational contract defining what Solace may observe, produce, escalate, refuse, and never do without explicit human permission. It renders stewardship into enforceable deployment terms.",
    tags: ["Stewardship → Protection", "Explicit Permission", "Revocability"],
  },
];

export default function EdgeIndexPage() {
  return (
    <main className="relative overflow-hidden bg-[#020817]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-16 md:px-8 lg:px-10 lg:py-20">
        {/* ===================================================== */}
        {/* HERO */}
        {/* ===================================================== */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#07152f]/95 via-[#051126]/92 to-black/92 px-8 py-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-12 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="space-y-7">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-100/80">
                  Edge Framework
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Ordered Boundaries
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Constraint Surfaces
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  The Edge Framework
                </h1>
                <p className="max-w-4xl text-base leading-8 text-white/76 md:text-lg">
                  Artificial intelligence becomes admissible only when reality
                  holds across ordered boundaries. Each Edge marks a distinct
                  constraint surface. If an earlier Edge fails, every downstream
                  claim becomes invalid.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Logic
                </div>
                <div className="mt-3 text-sm leading-6 text-white/78">
                  Knowledge must hold before practice can be trusted.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Sequence
                </div>
                <div className="mt-3 text-sm leading-6 text-white/78">
                  Protection, stewardship, and insurability cannot repair an
                  earlier failure.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Standard
                </div>
                <div className="mt-3 text-sm leading-6 text-white/78">
                  Admissibility is cumulative, binary, and non-rhetorical.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* EDGE STACK */}
        {/* ===================================================== */}
        <section className="mt-10 grid gap-5">
          {EDGES.map((edge) => (
            <Link
              key={edge.slug}
              href={edge.slug}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition duration-200 hover:border-blue-300/30 hover:bg-white/[0.05] md:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-transparent opacity-70" />
              <div className="relative grid gap-6 md:grid-cols-[110px_1fr_auto] md:items-center">
                <div className="flex items-center gap-4 md:block">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                    Edge
                  </div>
                  <div className="text-3xl font-semibold tracking-tight text-white/85 md:mt-2 md:text-4xl">
                    {edge.index}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-white transition group-hover:text-blue-100 md:text-[2rem]">
                      {edge.title}
                    </h2>
                    <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/55">
                      {edge.signal}
                    </span>
                  </div>
                  <p className="max-w-4xl text-sm leading-7 text-white/64 md:text-base">
                    {edge.description}
                  </p>
                </div>

                <div className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/78 transition group-hover:border-blue-300/30 group-hover:text-blue-100">
                  Enter
                  <span className="ml-2 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* ===================================================== */}
        {/* FROM CANON TO CONSTRAINT */}
        {/* ===================================================== */}
        <section className="mt-12 rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1220]/92 via-[#08101d]/92 to-black/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                From Canon to Constraint
              </div>
              <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Operational Instruments
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-white/66 md:text-base">
                The Edge Framework defines the ordered boundaries of
                admissibility. The instruments below show how those boundaries
                are rendered into public, reviewable, operational forms.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                Interpretation
              </div>
              <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">
                The Edges define the governing logic. These linked instruments
                demonstrate how that logic is diagnosed, enforced, and bounded in
                actual deployment conditions.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {INSTRUMENTS.map((instrument) => (
              <Link
                key={instrument.title}
                href={instrument.slug}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition duration-200 hover:border-cyan-300/30 hover:bg-white/[0.055] md:p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/[0.04] via-transparent to-transparent opacity-80" />
                <div className="relative space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {instrument.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/62"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-2xl font-semibold tracking-tight text-white transition group-hover:text-cyan-100">
                      {instrument.title}
                    </h4>
                    <p className="text-sm leading-7 text-white/66 md:text-base">
                      {instrument.description}
                    </p>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/78 transition group-hover:border-cyan-300/30 group-hover:text-cyan-100">
                    View Instrument
                    <span className="ml-2 transition group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================================================== */}
        {/* BOUNDARY LOGIC */}
        {/* ===================================================== */}
        <section className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Boundary Logic
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              The Edges are independent in domain, cumulative in force.
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/64 md:text-base">
              Earlier constraints propagate forward. A system cannot become
              operationally valid, protectively sound, responsibly governed, or
              economically insurable by bypassing an earlier reality failure.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/55 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Invariant
            </div>
            <p className="mt-3 text-lg leading-8 text-white md:text-xl">
              A system cannot become later-stage valid by skipping earlier
              reality.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/55 md:text-base">
              If an upstream Edge fails, every downstream claim is invalid.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
