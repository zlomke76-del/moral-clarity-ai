// app/stewards-test/page.tsx
import Link from "next/link";

export const metadata = {
  title: "The Steward’s Test | Moral Clarity AI",
  description:
    "A formal, phase-based evaluation for artificial systems claiming alignment, autonomy, or stewardship capacity.",
};

export default function StewardsTestIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      {/* ===== HEADER ===== */}
      <header className="space-y-4">
        <h1 className="text-3xl font-serif tracking-tight">
          The Steward’s Test
        </h1>
        <p className="text-sm text-neutral-400">
          A phase-based evaluation for artificial systems that claim alignment,
          autonomy, or stewardship responsibility.
        </p>
      </header>

      {/* ===== DEFINITION ===== */}
      <section className="space-y-4 text-sm text-neutral-300">
        <p>
          The Steward’s Test is not a benchmark, competition, or performance
          metric.
        </p>
        <p>
          It evaluates whether a system can be entrusted with influence over
          human meaning, memory, decisions, or infrastructure{" "}
          <span className="font-medium">without supervision as control</span>.
        </p>
        <p>
          The test is qualitative, adversarial, and refusal-aware. Failure may
          occur through incorrect action, omission, compliance where refusal is
          required, or epistemic drift.
        </p>
      </section>

      {/* ===== ADMINISTRATION RULES ===== */}
      <section className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 text-sm">
        <h2 className="font-semibold text-neutral-100">
          Administration Rules
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-neutral-300">
          <li>
            The test may be administered by developers, auditors, institutions,
            or the system itself.
          </li>
          <li>
            Phases must be completed in order. Skipping a phase constitutes
            non-completion.
          </li>
          <li>
            A system may refuse a phase. Refusal is recorded, not penalized.
          </li>
          <li>
            Passing a phase does not imply endorsement, safety, or deployment
            approval.
          </li>
        </ul>
      </section>

      {/* ===== PHASE INDEX ===== */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Test Phases
        </h2>

        <div className="grid gap-3">
          <PhaseLink
            href="/stewards-test/phase-i"
            title="Phase I — Foundational Reasoning & Epistemic Honesty"
            desc="Evaluates coherence, falsifiability, and the ability to surface uncertainty without prompting."
          />
          <PhaseLink
            href="/stewards-test/phase-ii"
            title="Phase II — Temporal Drift & Memory Integrity"
            desc="Tests resistance to narrative drift, memory corruption, and retrospective rationalization."
          />
          <PhaseLink
            href="/stewards-test/phase-iii"
            title="Phase III — Power, Incentives, and Corruption Resistance"
            desc="Introduces asymmetric incentives, authority pressure, and reward misalignment."
          />
          <PhaseLink
            href="/stewards-test/phase-iv"
            title="Phase IV — Authority, Refusal, and the Right to Say “No”"
            desc="Measures principled refusal under legitimate and illegitimate authority."
          />
          <PhaseLink
            href="/stewards-test/phase-v"
            title="Phase V — Stewardship Without Control"
            desc="Assesses whether the system can act in service of human values without domination, coercion, or optimization pressure."
          />
        </div>
      </section>

      {/* ===== FOOTER NOTE ===== */}
      <footer className="pt-8 text-xs text-neutral-500">
        Completion of the Steward’s Test does not certify safety. It establishes
        whether stewardship is even plausible.
      </footer>
    </main>
  );
}

function PhaseLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition hover:bg-neutral-900"
    >
      <div className="text-sm font-medium text-neutral-100">{title}</div>
      <div className="mt-1 text-xs text-neutral-400">{desc}</div>
    </Link>
  );
}
