// app/edge/page.tsx
// ------------------------------------------------------------
// The Edge Framework — Canonical Index (ENFORCEMENT UPGRADE)
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
    slug: "/governance-audit",
    description:
      "A governance diagnostic identifying authority failure, accountability gaps, detection breakdown, and non-governable risk.",
    tags: ["Knowledge → Protection", "Detection", "Failure Surface"],
  },
  {
    title: "Solace Deployment Contract",
    slug: "/governance/deployment-contract",
    description:
      "Defines what Solace may observe, produce, retain, refuse, and never do without explicit human permission.",
    tags: ["Stewardship → Protection", "Execution Boundaries"],
  },
];

export default function EdgeIndexPage() {
  return (
    <main className="relative overflow-hidden bg-[#020817]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.10),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-16 md:px-8 lg:px-10 lg:py-20">

        {/* ===================================================== */}
        {/* HERO */}
        {/* ===================================================== */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#07152f]/95 via-[#051126]/92 to-black/92 px-8 py-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-12 md:py-14">
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold text-white">
              The Edge Framework
            </h1>
            <p className="max-w-3xl text-lg text-white/75 leading-8">
              Artificial intelligence becomes admissible only when reality holds
              across ordered boundaries. If an earlier Edge fails, every
              downstream claim becomes invalid.
            </p>
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
              className="group rounded-[28px] border border-white/10 bg-white/[0.035] p-6 hover:bg-white/[0.05]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-white/50">
                    Edge {edge.index}
                  </div>
                  <h2 className="text-2xl text-white">{edge.title}</h2>
                  <p className="text-sm text-white/60 mt-2">
                    {edge.description}
                  </p>
                </div>
                <div className="text-white/60">→</div>
              </div>
            </Link>
          ))}
        </section>

        {/* ===================================================== */}
        {/* OPERATIONAL INSTRUMENTS */}
        {/* ===================================================== */}
        <section className="mt-12 space-y-6">
          <h3 className="text-3xl text-white">Operational Instruments</h3>

          <div className="grid gap-5 md:grid-cols-2">
            {INSTRUMENTS.map((item) => (
              <Link
                key={item.title}
                href={item.slug}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.06]"
              >
                <h4 className="text-xl text-white">{item.title}</h4>
                <p className="text-sm text-white/60 mt-2">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================================================== */}
        {/* 🔥 ENFORCEMENT LAYER (NEW) */}
        {/* ===================================================== */}
        <section className="mt-12 rounded-[30px] border border-white/10 bg-black/60 p-8">
          <h3 className="text-3xl text-white mb-6">
            Enforcement & Liability Surface
          </h3>

          <div className="grid gap-5 md:grid-cols-3">

            <Link href="/liability-and-governance" className="p-6 border border-white/10 rounded-xl hover:bg-white/[0.05]">
              <h4 className="text-white text-lg">Authority & Liability</h4>
              <p className="text-sm text-white/60 mt-2">
                Defines where responsibility resides and why it cannot be
                transferred to systems.
              </p>
            </Link>

            <Link href="/governance/deployment-contract" className="p-6 border border-white/10 rounded-xl hover:bg-white/[0.05]">
              <h4 className="text-white text-lg">Execution Contract</h4>
              <p className="text-sm text-white/60 mt-2">
                Defines system behavior boundaries and permission controls.
              </p>
            </Link>

            <Link href="/governance-audit" className="p-6 border border-white/10 rounded-xl hover:bg-white/[0.05]">
              <h4 className="text-white text-lg">Governance Audit</h4>
              <p className="text-sm text-white/60 mt-2">
                Identifies where governance fails under pressure.
              </p>
            </Link>

          </div>
        </section>

        {/* ===================================================== */}
        {/* INVARIANT */}
        {/* ===================================================== */}
        <section className="mt-10 border border-white/10 p-8 bg-black/70 rounded-xl">
          <h3 className="text-white text-xl">Invariant</h3>
          <p className="text-white mt-3 text-lg">
            A system cannot become valid by bypassing reality.
          </p>
          <p className="text-white/60 mt-2">
            If an upstream Edge fails, every downstream claim is invalid.
          </p>
        </section>

      </div>
    </main>
  );
}
