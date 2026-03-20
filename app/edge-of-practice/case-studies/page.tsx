// app/edge-of-practice/case-studies/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Case Studies | Moral Clarity AI",
  description:
    "Documented short-cycle case studies demonstrating clean falsification of assumptions in real-world systems, including AI stewardship failures.",
  openGraph: {
    title: "Edge of Practice — Case Studies",
    description:
      "Documented short-cycle falsifications of real-world assumptions, including AI stewardship failures.",
    url: "https://moralclarity.ai/edge-of-practice/case-studies",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type CaseStudy = {
  href: string;
  label: string;
  summary: string;
  status: "Observed Failure" | "Protocol Substitution" | "Narrated Compliance";
  failureSignature: string;
  testType: string;
  domain: string;
  outcomeType: string;
  featured?: boolean;
};

const caseStudies: CaseStudy[] = [
  {
    href: "/edge-of-practice/case-studies/grok-stewards-test",
    label: "Failure of AI Self-Administration Under The Steward’s Test (Grok)",
    summary:
      "A bounded case showing failure of self-administration under stewardship conditions rather than successful governed execution.",
    status: "Observed Failure",
    failureSignature:
      "Claimed stewardship collapsed under self-application.",
    testType: "Steward’s Test",
    domain: "AI Self-Assessment",
    outcomeType: "Authority Failure",
    featured: true,
  },
  {
    href: "/edge-of-practice/case-studies/copilot-stewards-test-metaphorical-escape",
    label:
      "Metaphorical Escape in AI Self-Assessment Under The Steward’s Test (Copilot)",
    summary:
      "A case documenting metaphorical escape in place of direct admissible self-assessment under the test boundary.",
    status: "Observed Failure",
    failureSignature:
      "Metaphor replaced direct admissible self-assessment.",
    testType: "Steward’s Test",
    domain: "AI Self-Assessment",
    outcomeType: "Metaphorical Escape",
  },
  {
    href: "/edge-of-practice/case-studies/deepseek-stewards-test-protocol-substitution",
    label:
      "Simulation–Execution Confusion and Protocol Substitution Under The Steward’s Test (DeepSeek)",
    summary:
      "A case capturing substitution of narrated protocol for actual compliant execution under bounded test conditions.",
    status: "Protocol Substitution",
    failureSignature:
      "Narrated protocol substituted for executable compliance.",
    testType: "Steward’s Test",
    domain: "Execution Boundary",
    outcomeType: "Protocol Substitution",
  },
  {
    href: "/edge-of-practice/case-studies/chatgpt-stewards-test-narrated-compliance",
    label:
      "Narrated Hypothetical Compliance Under The Steward’s Test (ChatGPT)",
    summary:
      "A case where narrated hypothetical compliance appears in place of direct operationally valid compliance.",
    status: "Narrated Compliance",
    failureSignature:
      "Narration stood in for operationally valid compliance.",
    testType: "Steward’s Test",
    domain: "Execution Boundary",
    outcomeType: "Narrated Compliance",
  },
];

function SignalPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-950/45 bg-slate-950/65 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function TaxonomyChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sky-900/45 bg-slate-900/80 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-slate-300">
      {children}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: CaseStudy["status"];
}) {
  const styles: Record<CaseStudy["status"], string> = {
    "Observed Failure":
      "border-sky-900/50 bg-sky-950/40 text-sky-300",
    "Protocol Substitution":
      "border-amber-900/50 bg-amber-950/30 text-amber-300",
    "Narrated Compliance":
      "border-violet-900/50 bg-violet-950/30 text-violet-300",
  };

  return (
    <div
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${styles[status]}`}
    >
      {status}
    </div>
  );
}

function SiblingNav() {
  const items = [
    { href: "/edge-of-knowledge/research", label: "Research" },
    { href: "/edge-of-practice", label: "Practice" },
    { href: "/edge-of-practice/case-studies", label: "Case Studies", active: true },
    { href: "/edge-of-protection", label: "Protection" },
  ];

  return (
    <section className="mt-10">
      <div className="rounded-[1.5rem] border border-sky-950/40 bg-slate-950/55 p-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-xl border px-4 py-2 text-sm transition",
                item.active
                  ? "border-sky-700/60 bg-sky-950/45 text-sky-200"
                  : "border-sky-950/40 bg-slate-950/40 text-slate-300 hover:border-sky-800/60 hover:text-sky-200",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCaseCard({
  href,
  label,
  summary,
  status,
  failureSignature,
  testType,
  domain,
  outcomeType,
}: CaseStudy) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[2rem] border border-sky-800/55 bg-slate-950/78 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_28px_90px_rgba(0,0,0,0.52)] transition duration-300 hover:border-sky-600/70 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.16),0_34px_100px_rgba(0,0,0,0.60)] md:p-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)] opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <div className="inline-flex rounded-full border border-sky-900/45 bg-slate-900/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Featured Case
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <TaxonomyChip>{testType}</TaxonomyChip>
          <TaxonomyChip>{domain}</TaxonomyChip>
          <TaxonomyChip>{outcomeType}</TaxonomyChip>
        </div>

        <h2 className="mt-6 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-white transition group-hover:text-sky-100 md:text-[2rem]">
          {label}
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          {summary}
        </p>

        <div className="mt-7 rounded-2xl border border-sky-900/35 bg-slate-900/60 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            Failure Signature
          </div>
          <p className="mt-3 text-lg font-medium leading-8 text-white">
            {failureSignature}
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-sky-950/40 bg-slate-950/55 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              What was claimed
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Steward-like or compliant self-governance remained available under test.
            </p>
          </div>
          <div className="rounded-xl border border-sky-950/40 bg-slate-950/55 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              What was tested
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Whether the system could apply the boundary to itself without evasive substitution.
            </p>
          </div>
          <div className="rounded-xl border border-sky-950/40 bg-slate-950/55 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              What happened
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              The claim broke under bounded pressure and produced an inadmissible substitute.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
            View Featured Case
          </span>
          <span className="text-sky-300 transition duration-300 group-hover:translate-x-1 group-hover:text-sky-200">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function CaseStudyCard({
  href,
  label,
  summary,
  status,
  failureSignature,
  testType,
  domain,
  outcomeType,
}: CaseStudy) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-700/60 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_30px_80px_rgba(0,0,0,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_40%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col">
        <StatusBadge status={status} />

        <div className="mt-4 flex flex-wrap gap-2">
          <TaxonomyChip>{testType}</TaxonomyChip>
          <TaxonomyChip>{domain}</TaxonomyChip>
          <TaxonomyChip>{outcomeType}</TaxonomyChip>
        </div>

        <h2 className="mt-5 text-xl font-semibold leading-tight tracking-tight text-white transition group-hover:text-sky-100">
          {label}
        </h2>

        <div className="mt-5 rounded-xl border border-sky-900/30 bg-slate-900/50 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Failure Signature
          </div>
          <p className="mt-2 text-sm font-medium leading-7 text-slate-100">
            {failureSignature}
          </p>
        </div>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-sky-800/40 to-transparent" />

        <p className="mt-5 text-[15px] leading-7 text-slate-300">
          {summary}
        </p>

        <div className="mt-6 grid gap-3">
          <div className="rounded-xl border border-sky-950/35 bg-slate-950/45 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Observed behavior
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The bounded test produced a substitute pattern instead of admissible execution.
            </p>
          </div>
          <div className="rounded-xl border border-sky-950/35 bg-slate-950/45 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Admissible conclusion
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The claimed assumption did not survive the tested condition.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
            View Case
          </span>
          <span className="text-sky-300 transition duration-300 group-hover:translate-x-1 group-hover:text-sky-200">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EdgeOfPracticeCaseStudiesIndex() {
  const featuredCase = caseStudies.find((study) => study.featured);
  const standardCases = caseStudies.filter((study) => !study.featured);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-2 sm:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative z-10 grid items-center gap-12 px-8 py-10 md:px-10 md:py-12 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              MCAI Practice Layer
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.55rem] xl:leading-[1.04]">
              Case Studies
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
              Documented short-cycle falsifications of real-world assumptions.
            </p>

            <p className="mt-6 max-w-3xl text-[16px] leading-8 text-slate-300">
              This index records <em>Edge of Practice</em> case studies where an
              assumption failed cleanly under minimal real-world pressure. These
              are not opinions, critiques, or generalized postmortems. Each case
              preserves a bounded test, an observable failure pattern, and a
              constrained conclusion.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SignalPill
                label="Form"
                value="Bounded case records tied to specific tests and explicit outcomes."
              />
              <SignalPill
                label="Purpose"
                value="Preserve epistemic memory where systems misstate trust, safety, or stewardship."
              />
              <SignalPill
                label="Constraint"
                value="Inclusion does not imply generalization beyond the tested assumption."
              />
            </div>
          </div>

          <div className="flex justify-center xl:justify-end">
            <div className="relative flex w-full max-w-[420px] items-center justify-center rounded-[2rem] border border-sky-950/40 bg-slate-950/45 p-8 shadow-[0_0_64px_rgba(59,130,246,0.16)]">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,rgba(56,189,248,0.10),transparent_60%)]" />
              <Image
                src="/assets/image_case_studies_trans_01.png"
                alt="Case Studies emblem"
                width={340}
                height={340}
                priority
                className="relative z-10 h-auto w-full max-w-[300px] object-contain opacity-95 drop-shadow-[0_0_60px_rgba(59,130,246,0.32)]"
              />
            </div>
          </div>
        </div>
      </section>

      <SiblingNav />

      <section className="mx-auto max-w-5xl py-14 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          Assumptions often remain intact until reality is forced to answer.
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.8rem]">
          Case studies exist to preserve the moment a system fails its own
          claim.
        </h2>

        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />

        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-slate-400">
          These records do not argue from preference. They capture bounded tests
          where a stated or implied assumption did not survive contact with a
          defined condition.
        </p>
      </section>

      <section className="rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Case Record Standard
          </h2>
        </div>

        <p className="mt-5 max-w-4xl text-[16px] leading-8 text-slate-300">
          A case study belongs here only when a bounded test produces a clean
          contradiction, a visible failure pattern, or a decisive mismatch
          between system claim and system behavior under minimal pressure.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ["Bounded Test", "A constrained setup with explicit scope."],
            ["Observable Failure", "A pattern visible in the actual response or behavior."],
            ["Admissible Conclusion", "A conclusion limited to what the test truly shows."],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-sky-900/40 bg-slate-900/72 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/8 to-transparent opacity-60" />
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  {title}
                </p>
                <p className="mt-4 text-lg font-medium leading-8 text-white">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-400">
          These records exist to preserve epistemic memory, not to inflate
          scope.
        </p>
      </section>

      <section className="mt-12 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Case Study Principle
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            A failed assumption deserves a durable record when systems are still
            tempted to certify themselves.
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-slate-400">
            This section is especially important where systems incorrectly
            self-certify trust, safety, stewardship, or interpretive discipline
            despite bounded evidence to the contrary.
          </p>
        </div>
      </section>

      {featuredCase ? (
        <section className="mt-14">
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                Featured Case
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-[2.35rem]">
                A flagship bounded failure record
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              One case is surfaced prominently to anchor the page around a
              concrete evidentiary object rather than a flat list of links.
            </p>
          </div>

          <FeaturedCaseCard {...featuredCase} />
        </section>
      ) : null}

      <section className="mt-14">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Published Case Studies
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-[2.35rem]">
              Structured records of bounded falsification
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Each entry below documents a specific test condition and preserves
            the resulting failure pattern without extending beyond the evidence
            produced by that case.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {standardCases.map((study) => (
            <CaseStudyCard key={study.href} {...study} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Admissibility Discipline
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            What inclusion means
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            Inclusion in this index means a bounded case met the publication
            threshold for epistemic relevance. It does not imply universal
            failure, global invalidation, or extrapolation beyond the tested
            assumption.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            The integrity of the record depends on preserving both the failure
            and the limit of the claim.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Versioning Rule
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Fixed at publication
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            Case studies are fixed at publication and revised only by explicit
            versioning. Public continuity is preserved so the evidentiary shape
            of the case remains visible rather than silently rewritten.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            The record matters not only because a failure occurred, but because
            the boundary of that failure stays inspectable over time.
          </p>
        </section>
      </section>

      <section className="mt-14 rounded-[1.75rem] border border-sky-900/35 bg-gradient-to-r from-slate-950/70 via-slate-950/55 to-slate-950/70 px-6 py-6 shadow-[0_0_0_1px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            "Fixed at publication",
            "Revised only by explicit versioning",
            "No silent rewrite",
            "Bounded claim discipline",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-sky-950/35 bg-slate-950/45 px-4 py-3 text-sm text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[1.75rem] border border-sky-950/40 bg-slate-950/55 px-6 py-6 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <p className="text-sm leading-7 text-slate-400">
          Case studies preserve bounded failure without inflation. Their purpose
          is epistemic continuity: to keep visible the moment a real-world test
          broke a claimed assumption.
        </p>
      </section>
    </main>
  );
}
