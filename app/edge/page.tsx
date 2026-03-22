// app/edge/page.tsx
// ------------------------------------------------------------
// The Edge Framework — Canonical Index (ENFORCEMENT UPGRADE)
// App Router | Next.js 16 SAFE
// ------------------------------------------------------------

import Link from "next/link";
import Image from "next/image";
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
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                The Edge Framework
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-white/75">
                Artificial intelligence becomes admissible only when reality holds
                across ordered boundaries. If an earlier Edge fails, every
                downstream claim becomes invalid.
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative flex h-[180px] w-[180px] items-center justify-center md:h-[220px] md:w-[220px]">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22)_0%,rgba(14,165,233,0.08)_42%,transparent_72%)] blur-2xl" />
                <Image
                  src="/assets/image_edge_logo_trans_01.png"
                  alt="The Edge logo"
                  width={220}
                  height={220}
                  priority
                  className="relative h-auto w-full object-contain drop-shadow-[0_0_22px_rgba(96,165,250,0.22)]"
                />
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
              className="group rounded-[28px] border border-white/10 bg-white/[0.035] p-6 transition hover:bg-white/[0.05] hover:border-white/15"
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <div className="text-sm text-white/50">Edge {edge.index}</div>
                  <h2 className="text-2xl text-white">{edge.title}</h2>
                  <p className="mt-2 text-sm text-white/60">{edge.description}</p>
                </div>
                <div className="shrink-0 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white/85">
                  →
                </div>
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
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.06] hover:border-white/15"
              >
                <h4 className="text-xl text-white">{item.title}</h4>
                <p className="mt-2 text-sm text-white/60">{item.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white/45"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================================================== */}
        {/* ENFORCEMENT LAYER */}
        {/* ===================================================== */}
        <section className="mt-12 rounded-[30px] border border-white/10 bg-black/60 p-8">
          <h3 className="mb-6 text-3xl text-white">
            Enforcement &amp; Liability Surface
          </h3>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/liability-and-governance"
              className="rounded-xl border border-white/10 p-6 transition hover:bg-white/[0.05] hover:border-white/15"
            >
              <h4 className="text-lg text-white">Authority &amp; Liability</h4>
              <p className="mt-2 text-sm text-white/60">
                Defines where responsibility resides and why it cannot be
                transferred to systems.
              </p>
            </Link>

            <Link
              href="/governance/deployment-contract"
              className="rounded-xl border border-white/10 p-6 transition hover:bg-white/[0.05] hover:border-white/15"
            >
              <h4 className="text-lg text-white">Execution Contract</h4>
              <p className="mt-2 text-sm text-white/60">
                Defines system behavior boundaries and permission controls.
              </p>
            </Link>

            <Link
              href="/governance-audit"
              className="rounded-xl border border-white/10 p-6 transition hover:bg-white/[0.05] hover:border-white/15"
            >
              <h4 className="text-lg text-white">Governance Audit</h4>
              <p className="mt-2 text-sm text-white/60">
                Identifies where governance fails under pressure.
              </p>
            </Link>
          </div>
        </section>

        {/* ===================================================== */}
        {/* INVARIANT */}
        {/* ===================================================== */}
        <section className="mt-10 rounded-xl border border-white/10 bg-black/70 p-8">
          <h3 className="text-xl text-white">Invariant</h3>
          <p className="mt-3 text-lg text-white">
            A system cannot become valid by bypassing reality.
          </p>
          <p className="mt-2 text-white/60">
            If an upstream Edge fails, every downstream claim is invalid.
          </p>
        </section>
      </div>
    </main>
  );
}
