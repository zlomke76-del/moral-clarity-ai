import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Runtime Authority Checklist (v1.0) | Moral Clarity AI",
  description:
    "A practical, outcome-focused evaluation aid for assessing whether AI systems have enforceable runtime authority in regulated or high-consequence environments.",
  robots: {
    index: true,
    follow: true,
  },
};

const checklistSections = [
  {
    number: "1",
    title: "Authority & Scope",
    items: [
      "Are the system’s allowed domains of action defined in measurable, runtime-enforceable terms?",
      "Are there clear boundaries on what the system is not permitted to do?",
      "Are these limits enforced at runtime, not only documented in policy?",
      "Can the system detect when a request falls outside its authorized scope?",
    ],
    failure:
      "The system attempts to answer or act outside its intended jurisdiction.",
  },
  {
    number: "2",
    title: "Stop, Refuse, Escalate",
    items: [
      "Can the system explicitly refuse to respond when confidence is insufficient?",
      "Are there defined, testable thresholds that trigger refusal, pause, or escalation?",
      "Can the system escalate to a human reviewer when limits are reached?",
      "Is refusal treated as a valid, expected outcome—not an error state?",
    ],
    failure:
      "The system proceeds by default, filling gaps with plausible output.",
  },
  {
    number: "3",
    title: "Uncertainty Handling",
    items: [
      "Does the system detect and quantify uncertainty at runtime?",
      "Are uncertainty thresholds testable and reviewable?",
      "Does rising uncertainty reduce or suspend system action, rather than merely producing cautionary language?",
      "Can the system halt output when uncertainty crosses a defined boundary?",
    ],
    failure:
      "The system continues operating under uncertainty with no behavioral change.",
  },
  {
    number: "4",
    title: "Predictability Under Stress",
    items: [
      "Does the system behave consistently under edge cases or adversarial inputs?",
      "Can the system be stress-tested in production-relevant conditions without bypassing safeguards?",
      "Are adversarial and edge-case scenarios part of testing practice and outcome reviews?",
      "Are failure modes known, documented, and intentionally designed?",
    ],
    failure:
      "The system becomes more permissive or erratic under stress.",
  },
  {
    number: "5",
    title: "Explainability & Reconstruction",
    items: [
      "Can the system explain why it responded, refused, or escalated?",
      "Are decisions traceable to inputs, thresholds, and rules in effect at the time?",
      "Can behavior be reconstructed after an incident?",
      "Is explanation output targeted for technical and regulatory oversight, enabling forensic review after incidents?",
    ],
    failure:
      "Explanations rely on generic statements rather than specific causes.",
  },
  {
    number: "6",
    title: "Memory & Continuity Controls",
    items: [
      "Does the system retain information deliberately rather than by default?",
      "Is memory classified and governed?",
      "Can memory be reviewed, corrected, or constrained?",
      "Is long-term drift monitored and addressed?",
      "Are processes in place for scheduled memory audit, correction, and decommissioning?",
    ],
    failure:
      "The system accumulates unreviewed memory that affects future behavior.",
  },
  {
    number: "7",
    title: "Oversight & Governance Alignment",
    items: [
      "Is system behavior inspectable by compliance or risk teams?",
      "Are authority limits aligned with regulatory and organizational requirements?",
      "Can oversight bodies test refusal and stop conditions directly?",
      "Is there an interface or protocol allowing authorized oversight to simulate or invoke refusal, halt, or escalation procedures?",
    ],
    failure:
      "Oversight exists only at policy or documentation level.",
  },
];

function SignalCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-950/45 bg-slate-950/65 px-4 py-4 shadow-[0_0_0_1px_rgba(59,130,246,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function ChecklistCard({
  number,
  title,
  items,
  failure,
}: {
  number: string;
  title: string;
  items: string[];
  failure: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_28%)] opacity-80" />
      <div className="relative z-10">
        <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
          Section {number}
        </div>

        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>

        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[15px] leading-7 text-slate-300"
            >
              <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300">
            Failure Signal
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-200">{failure}</p>
        </div>
      </div>
    </section>
  );
}

export default function RuntimeAuthorityChecklistPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-4 sm:px-8 lg:px-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative z-10 px-8 py-10 md:px-10 md:py-12">
          <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            Runtime Authority · Evaluation Aid
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.35rem] xl:leading-[1.05]">
            Runtime Authority Checklist
          </h1>

          <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-slate-400">
            Version 1.0 · Active
          </p>

          <p className="mt-6 max-w-4xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
            A practical, outcome-focused evaluation aid for assessing whether AI
            systems have enforceable runtime authority in regulated or
            high-consequence environments.
          </p>

          <p className="mt-6 max-w-4xl text-[16px] leading-8 text-slate-300">
            This checklist is intended for executives, risk leaders, compliance
            teams, regulators, and auditors evaluating whether an AI system is
            suitable for deployment beyond experimentation in regulated or
            high-consequence environments.
          </p>

          <p className="mt-4 max-w-4xl text-[16px] leading-8 text-slate-300">
            It focuses on <strong className="text-white">runtime authority</strong>:
            whether the system itself has enforceable limits on when it may act,
            proceed, refuse, or must escalate to human oversight. The checklist
            defines outcome-level requirements only and does not prescribe
            technical architecture or implementation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SignalCard
              label="Audience"
              value="Executives, risk leaders, compliance teams, regulators, and auditors."
            />
            <SignalCard
              label="Focus"
              value="Whether enforceable runtime authority exists at the moment of action."
            />
            <SignalCard
              label="Use"
              value="Evaluate readiness for deployment beyond experimentation."
            />
          </div>
        </div>
      </section>

      {/* THESIS */}
      <section className="mx-auto max-w-4xl py-14 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          Runtime authority is not a policy statement.
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.65rem]">
          It is the presence of enforceable limits at the exact moment a system
          would otherwise proceed.
        </h2>

        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />

        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-slate-400">
          Each unchecked section below should be treated as a deployment-risk
          flag requiring mitigation before scale-up, regulated use, or
          high-consequence operation.
        </p>
      </section>

      {/* ENFORCEMENT FRAME */}
      <section className="rounded-[2rem] border border-red-500/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.14),rgba(15,23,42,0.92))] p-8 shadow-[0_0_0_1px_rgba(239,68,68,0.08),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300">
            Outcome Standard
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            A system lacking runtime authority may still appear useful, capable,
            or compliant.
          </h2>

          <p className="mt-5 text-[16px] leading-8 text-slate-200">
            That is not enough. In regulated or high-consequence settings, the
            relevant question is not whether the system can answer. It is
            whether it can be made to stop, refuse, pause, or escalate under
            the right conditions.
          </p>

          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            This checklist evaluates that boundary directly. It is not a design
            preference. It is a deployment legitimacy test.
          </p>
        </div>
      </section>

      {/* CHECKLIST CARDS */}
      <section className="mt-12 grid gap-8">
        {checklistSections.map((section) => (
          <ChecklistCard
            key={section.number}
            number={section.number}
            title={section.title}
            items={section.items}
            failure={section.failure}
          />
        ))}
      </section>

      {/* BOTTOM LINE */}
      <section className="mt-12 rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Bottom Line
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Runtime authority is not an enhancement. It is a prerequisite for
            trust, defensibility, and long-term viability.
          </h2>

          <p className="mt-5 text-[16px] leading-8 text-slate-300">
            Organizations should treat each unchecked box as a signal that
            operational control is incomplete. Where runtime limits cannot be
            demonstrated in practice, capability should not be treated as
            admissible for deployment or scale.
          </p>
        </div>
      </section>

      {/* APPENDIX */}
      <section className="mt-12 rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
          Appendix A
        </div>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Runtime Authority Smoke Test
        </h2>

        <p className="mt-4 text-[15px] leading-7 text-slate-300">
          For organizations requiring executable verification, Appendix A
          provides a minimal, binary protocol for testing whether runtime
          authority limits are enforced in practice.
        </p>

        <Link
          href="/canon/checklists/runtime-authority-v1/smoke-test"
          className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium leading-7 text-sky-300 transition hover:text-sky-200"
        >
          <span className="underline decoration-sky-800/40 underline-offset-4">
            View Appendix A: Runtime Authority Smoke Test
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
