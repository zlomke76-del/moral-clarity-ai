// app/whitepapers/page.tsx
// ============================================================
// WHITE PAPERS INDEX
// Registry-driven index with auto-grouping by section
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import {
  CONSTRAINT_TYPE_META,
  LIBRARY_SECTION_META,
  getAllWhitePapers,
  getConstraintTypeCounts,
  getPapersBySection,
  getStatusCounts,
  type ConstraintType,
  type WhitePaperRegistryItem,
} from "./_data/registry";

export const metadata: Metadata = {
  title: "White Papers | Moral Clarity AI",
  description:
    "A curated research library from Moral Clarity AI examining physical, ethical, and epistemic boundaries across materials, harm reduction, constraint design, and accountable systems.",
  openGraph: {
    title: "White Papers | Moral Clarity AI",
    description:
      "A structured library of public white papers spanning conceptual research, core constrained polymer systems, extended PET architectures, and frontier material behaviors.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function getStatusClasses(status: WhitePaperRegistryItem["status"]) {
  switch (status) {
    case "NO-GO":
      return {
        pill: "border-red-500/25 bg-red-500/10 text-red-300",
      };
    case "PASS":
      return {
        pill: "border-green-500/25 bg-green-500/10 text-green-300",
      };
    case "FAIL":
      return {
        pill: "border-red-500/25 bg-red-500/10 text-red-300",
      };
    case "CONDITIONAL":
    default:
      return {
        pill: "border-yellow-400/25 bg-yellow-400/10 text-yellow-300",
      };
  }
}

function getConstraintTypeBadgeClasses(type: ConstraintType) {
  switch (type) {
    case "NO_GO":
      return "border-red-500/20 bg-red-500/10 text-red-200";
    case "CLAIM":
      return "border-sky-400/20 bg-sky-400/10 text-sky-100";
    case "OWNERSHIP":
      return "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100";
    case "MULTI_DOMAIN":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";
    default:
      return "border-white/12 bg-black/30 text-white/58";
  }
}

function PaperCard({ paper }: { paper: WhitePaperRegistryItem }) {
  const statusClasses = getStatusClasses(paper.status);
  const constraintLabel = CONSTRAINT_TYPE_META[paper.constraintType].label;

  return (
    <Link
      href={`/whitepapers/${paper.slug}`}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.20)] transition duration-200 hover:border-cyan-300/25 hover:bg-white/[0.055] md:p-7"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-transparent opacity-80" />

      <div className="relative space-y-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={[
              "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em]",
              getConstraintTypeBadgeClasses(paper.constraintType),
            ].join(" ")}
          >
            {constraintLabel}
          </span>

          <span
            className={[
              "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em]",
              statusClasses.pill,
            ].join(" ")}
          >
            {paper.status}
          </span>

          <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
            White Paper
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-white transition group-hover:text-cyan-100 md:text-2xl">
            {paper.title}
          </h3>
          <p className="text-sm leading-7 text-white/66 md:text-base">
            {paper.subtitle}
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/76 transition group-hover:border-cyan-300/30 group-hover:text-cyan-100">
          Open paper
          <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}

function SectionBlock({
  eyebrow,
  title,
  description,
  papers,
}: {
  eyebrow: string;
  title: string;
  description: string;
  papers: WhitePaperRegistryItem[];
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-white/42">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-white/64 md:text-base">
          {description}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {papers.map((paper) => (
          <PaperCard key={paper.slug} paper={paper} />
        ))}
      </div>
    </section>
  );
}

export default function WhitePapersIndexPage() {
  const allPapers = getAllWhitePapers();
  const papersBySection = getPapersBySection();
  const constraintTypeCounts = getConstraintTypeCounts();
  const statusCounts = getStatusCounts();

  const orderedSections = Object.entries(LIBRARY_SECTION_META)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, meta]) => ({
      key,
      ...meta,
      papers: papersBySection[key as keyof typeof papersBySection],
    }));

  return (
    <main className="relative overflow-hidden bg-[#020817]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl space-y-12 px-6 py-16 md:px-8 lg:px-10 lg:py-20">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#081427]/95 via-[#0b1220]/92 to-black/92 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/85">
                  White Papers
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Public Research Library
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Constraint Indexed
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  White Papers
                </h1>
                <p className="max-w-4xl text-lg leading-8 text-white/82">
                  A structured research library from Moral Clarity AI examining
                  physical limits, ethical boundaries, epistemic failure, and
                  constrained material systems.
                </p>
                <p className="max-w-4xl text-base leading-8 text-white/66 md:text-lg">
                  This library is no longer just grouped by topic. It is now
                  indexed by constraint logic, failure class, and determination status.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Library Size
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  {allPapers.length} public papers across{" "}
                  {orderedSections.length} research layers.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Determination Mix
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  {statusCounts.conditional} conditional · {statusCounts.noGo} no-go
                  {statusCounts.pass ? ` · ${statusCounts.pass} pass` : ""}
                  {statusCounts.fail ? ` · ${statusCounts.fail} fail` : ""}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Standard
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Inclusion indicates research relevance, not readiness,
                  certification, or deployment maturity.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONSTRAINT INDEX */}
        <section className="space-y-5">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Constraint Index
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Failure classes and admissibility surfaces
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/64 md:text-base">
              These papers can now be scanned not only by subject area, but by the
              type of constraint they test and the class of failure they expose.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {constraintTypeCounts.map((item) => (
              <div
                key={item.type}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)]"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Constraint Type
                </div>
                <div className="mt-3 text-lg font-semibold tracking-tight text-white">
                  {item.label}
                </div>
                <div className="mt-2 text-sm leading-6 text-white/64">
                  {item.count} paper{item.count === 1 ? "" : "s"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIBRARY POSITION */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Library Position
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This collection brings together public research across conceptual
              papers, core PET systems, extended PET architectures, and frontier
              behavior classes. The grouping is now registry-driven rather than
              manually duplicated across the page.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              The purpose is not volume. The purpose is structured signal:
              papers that clarify where physical behavior, institutional reality,
              and survivable claims do or do not hold.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Reading Standard
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              These papers are bounded by design.
            </p>
            <p className="mt-4 text-base leading-8 text-white/66">
              They are intentionally limited, regime-specific, and survivability-gated.
              Inclusion does not imply readiness, universal applicability,
              or commercial deployment status.
            </p>
          </div>
        </section>

        {/* AUTO-GROUPED SECTIONS */}
        {orderedSections.map((section) => (
          <SectionBlock
            key={section.key}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            papers={section.papers}
          />
        ))}

        {/* FOOTER INVARIANT */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Final Note
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This library remains useful only when boundary conditions,
              regime limits, and non-claims stay explicit.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              Public availability does not convert a bounded paper into a broad
              claim. It remains what it is: a structured research document under
              defined constraints.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/72 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Invariant
            </div>
            <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
              Inclusion in the library is not proof of readiness.
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              These papers are regime-bounded, survivability-gated, and
              intentionally limited. Signal matters more than breadth.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
