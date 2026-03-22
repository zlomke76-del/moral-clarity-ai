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
      "Defines what is known, unknown, unobservable, or falsely assumed before action begins.",
    signal: "Epistemic Boundary",
    index: "01",
    failure: "If this fails, nothing downstream is admissible.",
  },
  {
    title: "Edge of Practice",
    slug: "/edge-of-practice",
    description:
      "Ensures reality does not fail under real-world execution.",
    signal: "Operational Falsification",
    index: "02",
    failure: "If this fails, execution collapses under stress.",
  },
  {
    title: "Edge of Protection",
    slug: "/edge-of-protection",
    description:
      "Prevents structural harm before it occurs.",
    signal: "Protective Constraint",
    index: "03",
    failure: "If this fails, harm is allowed.",
  },
  {
    title: "Edge of Stewardship",
    slug: "/stewardship-canon",
    description:
      "Ensures responsibility is bounded and enforceable.",
    signal: "Authority Boundary",
    index: "04",
    failure: "If this fails, accountability dissolves.",
  },
  {
    title: "Edge of Insurability",
    slug: "/edge/insurability",
    description:
      "Ensures risk is bounded, attributable, and governable.",
    signal: "Economic Accountability",
    index: "05",
    failure: "If this fails, the system cannot be trusted at scale.",
  },
];

const INSTRUMENTS: InstrumentItem[] = [
  {
    title: "Moral Clarity Governance Audit™",
    slug: "/governance-audit",
    description:
      "Identifies authority failure, accountability gaps, detection breakdown, and non-governable risk.",
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">

        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-[#07152f]/90 px-10 py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_240px]">

            <div>
              <h1 className="text-5xl text-white mb-4">
                The Edge Framework
              </h1>

              <p className="text-white/70 mb-4">
                AI is only valid when reality holds across ordered boundaries.
              </p>

              <p className="text-white/50 text-sm">
                This framework determines whether an AI decision is allowed to exist.
              </p>
            </div>

            <Image
              src="/assets/image_edge_logo_trans_01.png"
              alt="The Edge"
              width={180}
              height={180}
              className="mx-auto"
            />
          </div>
        </section>

        {/* EDGE STACK */}
        <section className="mt-10 space-y-5">
          {EDGES.map((edge) => (
            <Link
              key={edge.slug}
              href={edge.slug}
              className="block rounded-[24px] border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.06]"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-xs text-blue-400 mb-1">
                    Edge {edge.index}
                  </div>

                  <h2 className="text-xl text-white">
                    {edge.title}
                  </h2>

                  <p className="text-white/60 text-sm mt-2">
                    {edge.description}
                  </p>

                  <p className="text-red-400/80 text-xs mt-3">
                    {edge.failure}
                  </p>

                  <div className="text-[11px] text-white/40 mt-2">
                    Status: Requires validation
                  </div>
                </div>

                <div className="text-white/50">→</div>
              </div>
            </Link>
          ))}
        </section>

        {/* EXECUTION LAYER */}
        <section className="mt-14">
          <h3 className="text-2xl text-white mb-6">
            Execution Layer
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {INSTRUMENTS.map((item) => (
              <Link
                key={item.title}
                href={item.slug}
                className="rounded-[20px] border border-white/10 bg-black/40 p-6 hover:bg-white/[0.05]"
              >
                <h4 className="text-white text-lg">
                  {item.title}
                </h4>

                <p className="text-white/60 text-sm mt-2">
                  {item.description}
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] border border-white/10 px-2 py-1 rounded-full text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ENFORCEMENT */}
        <section className="mt-14">
          <h3 className="text-2xl text-white mb-6">
            Enforcement & Liability Surface
          </h3>

          <div className="grid md:grid-cols-3 gap-5">
            <Link href="/liability-and-governance" className="p-5 border border-white/10 rounded-xl text-white/60">
              Authority & Liability
            </Link>

            <Link href="/governance/deployment-contract" className="p-5 border border-white/10 rounded-xl text-white/60">
              Execution Contract
            </Link>

            <Link href="/governance-audit" className="p-5 border border-white/10 rounded-xl text-white/60">
              Governance Audit
            </Link>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="mt-14 text-center border-t border-b border-white/10 py-10">
          <div className="text-xs text-white/40 tracking-widest mb-3">
            INVARIANT
          </div>

          <p className="text-xl text-white">
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
