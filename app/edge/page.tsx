// app/edge/page.tsx

import Link from "next/link";
import Image from "next/image";
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
  failure: string;
  accent: string;
  glow: string;
};

type InstrumentItem = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  accent: string;
  halo: string;
};

type SurfaceItem = {
  title: string;
  slug: string;
  kicker: string;
};

const EDGES: EdgeItem[] = [
  {
    title: "Edge of Knowledge",
    slug: "/edge-of-knowledge",
    description:
      "Defines what is known, unknown, unobservable, or falsely assumed before action begins.",
    signal: "Epistemic Boundary",
    index: "01",
    failure: "No downstream action remains admissible.",
    accent: "text-cyan-300",
    glow:
      "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_55%)]",
  },
  {
    title: "Edge of Practice",
    slug: "/edge-of-practice",
    description:
      "Ensures reality does not fail under real-world execution.",
    signal: "Operational Falsification",
    index: "02",
    failure: "Execution collapses under stress.",
    accent: "text-blue-300",
    glow:
      "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%)]",
  },
  {
    title: "Edge of Protection",
    slug: "/edge-of-protection",
    description: "Prevents structural harm before it occurs.",
    signal: "Protective Constraint",
    index: "03",
    failure: "Harm becomes admissible before intervention.",
    accent: "text-teal-300",
    glow:
      "bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_55%)]",
  },
  {
    title: "Edge of Stewardship",
    slug: "/stewardship-canon",
    description:
      "Ensures responsibility is bounded and enforceable.",
    signal: "Authority Boundary",
    index: "04",
    failure: "Accountability dissolves at execution time.",
    accent: "text-indigo-300",
    glow:
      "bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.18),transparent_55%)]",
  },
  {
    title: "Edge of Insurability",
    slug: "/edge/insurability",
    description:
      "Ensures risk is bounded, attributable, and governable.",
    signal: "Economic Accountability",
    index: "05",
    failure: "The system cannot be trusted at scale.",
    accent: "text-violet-300",
    glow:
      "bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_55%)]",
  },
];

const INSTRUMENTS: InstrumentItem[] = [
  {
    title: "Moral Clarity Governance Audit™",
    slug: "/governance-audit",
    description:
      "Identifies authority failure, accountability gaps, detection breakdown, and non-governable risk.",
    tags: ["Knowledge → Protection", "Detection", "Failure Surface"],
    accent: "text-cyan-300",
    halo:
      "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_58%)]",
  },
  {
    title: "Solace Deployment Contract",
    slug: "/governance/deployment-contract",
    description:
      "Defines what Solace may observe, produce, retain, refuse, and never do without explicit human permission.",
    tags: ["Stewardship → Protection", "Execution Boundaries"],
    accent: "text-indigo-300",
    halo:
      "bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.14),transparent_58%)]",
  },
];

const SURFACES: SurfaceItem[] = [
  {
    title: "Authority & Liability",
    slug: "/liability-and-governance",
    kicker: "Responsibility surface",
  },
  {
    title: "Execution Contract",
    slug: "/governance/deployment-contract",
    kicker: "Permitted action boundary",
  },
  {
    title: "Governance Audit",
    slug: "/governance-audit",
    kicker: "Failure detection surface",
  },
];

export default function EdgeIndexPage() {
  return (
    <main className="relative overflow-hidden bg-[#020817]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.02))]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-[#07152f]/90 px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(2,8,23,0.55)] md:px-10 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_240px]">
            <div>
              <div className="mb-6">
                <div className="mb-3 text-xs tracking-[0.22em] text-blue-400">
                  MCAI GOVERNANCE FRAMEWORK
                </div>

                <h1 className="mb-6 text-5xl text-white md:text-6xl">
                  The Edge Framework
                </h1>

                <p className="mb-4 max-w-2xl text-lg text-white/70">
                  AI is only valid when reality holds across ordered boundaries.
                </p>

                <p className="max-w-xl text-sm text-white/50">
                  This framework determines whether a decision is admissible
                  before execution begins.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_62%)] blur-2xl" />
              <div className="relative rounded-[28px] border border-white/10 bg-black/20 p-6">
                <Image
                  src="/assets/image_edge_logo_trans_01.png"
                  alt="The Edge"
                  width={180}
                  height={180}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* THESIS */}
        <section className="mt-16 text-center">
          <p className="mb-4 text-sm text-white/40">
            Evaluation is sequential. Later edges do not repair earlier failure.
          </p>

          <h2 className="mx-auto max-w-3xl text-2xl text-white md:text-3xl">
            A system is only admissible if it survives each boundary in order.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/50">
            The Edge Framework defines where validity breaks — before action,
            during execution, under protection constraints, within authority,
            and across insurable risk.
          </p>

          <div className="mx-auto mt-6 h-px w-28 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />
        </section>

        {/* FRAMEWORK LOGIC */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.25)]">
            <div className="mb-2 text-xs tracking-[0.16em] text-white/40">
              ORDERED
            </div>
            <p className="text-sm text-white">
              Each edge must be satisfied in sequence. No edge can be skipped.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.25)]">
            <div className="mb-2 text-xs tracking-[0.16em] text-white/40">
              DEPENDENT
            </div>
            <p className="text-sm text-white">
              Failure at any boundary invalidates all downstream admissibility.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.25)]">
            <div className="mb-2 text-xs tracking-[0.16em] text-white/40">
              ENFORCEABLE
            </div>
            <p className="text-sm text-white">
              These are not conceptual layers — they define executable
              constraints.
            </p>
          </div>
        </section>

        {/* EDGE STACK */}
        <section className="mt-16">
          <div className="mb-6">
            <div className="text-xs tracking-[0.18em] text-white/40">
              SEQUENTIAL VALIDATION CHAIN
            </div>
          </div>

          <div className="relative space-y-6">
            <div className="pointer-events-none absolute left-[22px] top-8 bottom-8 hidden w-px bg-gradient-to-b from-cyan-400/50 via-blue-400/40 via-teal-400/40 via-indigo-400/40 to-violet-400/50 md:block" />

            {EDGES.map((edge) => (
              <div key={edge.slug} className="relative">
                <Link
                  href={edge.slug}
                  className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:border-white/15 hover:bg-white/[0.06] hover:-translate-y-[2px] shadow-[0_18px_60px_rgba(2,8,23,0.28)]"
                >
                  <div className={`pointer-events-none absolute inset-0 ${edge.glow}`} />
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/10" />

                  <div className="relative flex items-start justify-between gap-6">
                    <div className="flex gap-5">
                      <div className="relative hidden md:flex">
                        <div className="relative z-10 mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#081121] text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                          {edge.index}
                        </div>
                      </div>

                      <div className="max-w-2xl">
                        <div
                          className={`mb-2 text-[11px] tracking-[0.16em] ${edge.accent}`}
                        >
                          EDGE {edge.index} · {edge.signal}
                        </div>

                        <h2 className="mb-2 text-2xl text-white">
                          {edge.title}
                        </h2>

                        <p className="text-sm leading-relaxed text-white/60">
                          {edge.description}
                        </p>

                        <div className="mt-4 text-sm text-red-400/90">
                          <span className="mr-2 text-white/40">
                            Failure consequence:
                          </span>
                          {edge.failure}
                        </div>

                        <div className="mt-2 text-[11px] text-white/30">
                          Status: Requires validation
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 text-xl text-white/30 transition group-hover:text-white">
                      →
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* EXECUTION LAYER */}
        <section className="relative mt-24">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-32 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.10),transparent_68%)]" />

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,21,47,0.55),rgba(2,8,23,0.35))] px-6 py-8 md:px-8 md:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

            <div className="relative">
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <div className="mb-2 text-xs tracking-[0.18em] text-blue-400">
                    APPLIED ENFORCEMENT
                  </div>
                  <h3 className="mb-2 text-2xl text-white md:text-3xl">
                    Execution Layer
                  </h3>
                  <p className="max-w-2xl text-sm text-white/50">
                    Instruments that operationalize the framework by exposing
                    authority failure, execution limits, and accountability
                    surfaces.
                  </p>
                </div>

                <div className="hidden md:block text-right">
                  <div className="text-xs tracking-[0.16em] text-white/30">
                    FRAMEWORK → OPERATION
                  </div>
                  <div className="mt-2 text-sm text-white/50">
                    Doctrine becomes executable constraint.
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {INSTRUMENTS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.slug}
                    className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-black/35 p-6 transition duration-300 hover:-translate-y-[2px] hover:border-white/15 hover:bg-white/[0.05] shadow-[0_18px_50px_rgba(2,8,23,0.28)]"
                  >
                    <div className={`pointer-events-none absolute inset-0 ${item.halo}`} />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_70%)]" />

                    <div className="relative">
                      <div className={`mb-3 text-[11px] tracking-[0.16em] ${item.accent}`}>
                        EXECUTION INSTRUMENT
                      </div>

                      <h4 className="text-xl text-white transition group-hover:text-white">
                        {item.title}
                      </h4>

                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                        {item.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/45"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-[11px] tracking-[0.16em] text-white/30">
                          OPEN SURFACE
                        </div>
                        <div className="text-white/30 transition group-hover:text-white">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ENFORCEMENT */}
        <section className="relative mt-16">
          <div className="mb-6">
            <div className="mb-2 text-xs tracking-[0.18em] text-white/35">
              ACCOUNTABILITY INTERFACE
            </div>
            <h3 className="mb-2 text-2xl text-white">
              Enforcement & Liability Surface
            </h3>

            <p className="max-w-xl text-sm text-white/50">
              Supporting surfaces where authority, execution constraints, and
              auditability remain reviewable.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {SURFACES.map((item, idx) => (
              <Link
                key={item.title}
                href={item.slug}
                className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-black/15 p-5 transition duration-300 hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-xs text-white/45">
                      0{idx + 1}
                    </div>
                    <div className="text-white/20 transition group-hover:text-white/50">
                      →
                    </div>
                  </div>

                  <div className="mb-2 text-[11px] tracking-[0.16em] text-white/30">
                    {item.kicker}
                  </div>

                  <div className="text-base text-white/70 transition group-hover:text-white">
                    {item.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PRIMARY ENGAGEMENT */}
        <section className="relative mt-20">
          <div className="pointer-events-none absolute inset-x-0 -top-8 h-24 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.10),transparent_68%)]" />

          <div className="mb-6 text-center">
            <div className="mb-2 text-xs tracking-[0.2em] text-blue-400">
              PRIMARY ENGAGEMENT
            </div>
            <h3 className="text-2xl text-white md:text-3xl">
              Apply the Framework
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/50">
              Move from doctrine into execution through the two primary
              engagement surfaces below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {INSTRUMENTS.map((item) => (
              <Link
                key={item.title}
                href={item.slug}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,21,47,0.72),rgba(2,8,23,0.52))] p-7 shadow-[0_24px_70px_rgba(2,8,23,0.34)] transition duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className={`pointer-events-none absolute inset-0 ${item.halo}`} />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)]" />

                <div className="relative">
                  <div className={`mb-3 text-[11px] tracking-[0.16em] ${item.accent}`}>
                    FEATURED ENGAGEMENT
                  </div>

                  <h4 className="text-xl text-white md:text-2xl">
                    {item.title}
                  </h4>

                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/45"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                    <div className="text-sm text-white/75 group-hover:text-white">
                      {item.title.includes("Audit")
                        ? "Open Governance Audit"
                        : "Open Deployment Contract"}
                    </div>

                    <div className="text-white/40 transition group-hover:text-white">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* INVARIANT */}
        <section className="relative mt-20 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] py-14 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_62%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative px-6">
            <div className="mb-3 text-xs tracking-[0.22em] text-white/40">
              INVARIANT
            </div>

            <p className="text-2xl text-white">
              A system cannot become valid by bypassing reality.
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-white/60">
              If an upstream Edge fails, every downstream claim is invalid.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
