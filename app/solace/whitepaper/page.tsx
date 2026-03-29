export const metadata = {
  title: "Solace Authority System | Moral Clarity AI",
  description:
    "A deterministic framework for admissible, authorized, and enforced execution.",
};

const sections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "the-problem", label: "The Problem" },
  { id: "system", label: "Authority Architecture" },
  { id: "execution-model", label: "Execution Model" },
  { id: "constitutional-foundation", label: "Constitutional Foundation" },
  { id: "cryptographic-enforcement", label: "Cryptographic Enforcement" },
  { id: "key-innovation", label: "Key Innovation" },
  { id: "risk-reduction", label: "Risk Model" },
  { id: "regulatory-alignment", label: "Regulatory Alignment" },
  { id: "strategic-implications", label: "Strategic Implications" },
  { id: "limitations", label: "Design Philosophy" },
  { id: "conclusion", label: "Conclusion" },
];

const architectureCards = [
  {
    eyebrow: "Layer 1",
    title: "Existence Control",
    body:
      "Determines whether candidate outputs are allowed to exist inside the governed decision space.",
  },
  {
    eyebrow: "Layer 2",
    title: "Authority Origination",
    body:
      "Defines explicit, portable, and verifiable institutional authority before runtime.",
  },
  {
    eyebrow: "Layer 3",
    title: "Execution Control",
    body:
      "Binds action to a deterministic permit boundary so unauthorized execution cannot occur.",
  },
];

const executionSteps = [
  "Input enters system",
  "Sovereign Kernel enforces admissibility",
  "Authority artifact is referenced",
  "Execution intent is evaluated",
  "Decision is issued: PERMIT, DENY, or ESCALATE",
  "Decision is recorded in immutable audit state",
  "Execution is bound to a short-lived cryptographic receipt",
  "Executor verifies the receipt and performs action only if conditions still hold",
];

const riskRows = [
  {
    failure: "Invalid outputs",
    traditional: "Generated first, evaluated later",
    solace: "Never admitted into the decision space",
  },
  {
    failure: "Unauthorized actions",
    traditional: "Possible through trust, workflow, or gaps",
    solace: "Structurally blocked without explicit permit",
  },
  {
    failure: "State drift",
    traditional: "Can accumulate until action occurs",
    solace: "Contained at the execution boundary",
  },
  {
    failure: "Replay or tampering",
    traditional: "Requires downstream controls",
    solace: "Cryptographically prevented",
  },
  {
    failure: "Post-hoc accountability",
    traditional: "Primary line of defense",
    solace: "Supplementary to prevention",
  },
];

function SectionShell({
  id,
  kicker,
  title,
  intro,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8"
    >
      <div className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
          {kicker}
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        {intro ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-[17px]">
            {intro}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
          <span className="text-sm leading-7 text-slate-200 sm:text-base">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SolaceWhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#06101d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_75%_15%,rgba(59,130,246,0.14),transparent_24%),linear-gradient(180deg,#0b1830_0%,#07111f_52%,#06101d_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Moral Clarity AI · Authority Layer
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The Solace Authority System
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-[22px] sm:leading-9">
              AI systems can already generate, recommend, and increasingly
              initiate actions with real-world consequences. What they still
              cannot prove is whether those actions were valid at the moment
              they occurred.
            </p>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              Solace introduces execution-time admissibility: a deterministic
              authority model in which outputs are not merely reviewed after the
              fact, but prevented from becoming real unless they are admissible,
              authorized, and enforced.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                "Deterministic authority",
                "Fail-closed execution",
                "Cryptographic enforcement",
                "Admissibility before action",
              ].map((pill) => (
                <div
                  key={pill}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200"
                >
                  {pill}
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(34,211,238,0.03))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-7">
              <p className="max-w-3xl text-base leading-7 text-cyan-50 sm:text-lg">
                Every AI system today can produce outputs that look correct,
                pass validation, and still fail in reality.
              </p>
              <p className="mt-3 text-base font-semibold leading-7 text-white sm:text-lg">
                Solace eliminates this class of failure at the execution
                boundary.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.22)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              System Structure
            </div>

            <nav className="mt-5 space-y-1.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-8">
          <SectionShell
            id="executive-summary"
            kicker="Executive Summary"
            title="Current governance is reactive. Solace is preventative."
            intro="Most AI systems still follow a sequence in which decisions are generated first, checked second, and executed before admissibility is truly proven. That structure is insufficient for systems that affect real-world outcomes."
          >
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-white/10 bg-[#0b1830]/70 p-6">
                <div className="text-sm font-semibold text-white">
                  Current systems typically:
                </div>
                <div className="mt-4">
                  <BulletList
                    items={[
                      "Generate decisions before validating whether they should exist",
                      "Apply policy checks after the decision has already formed",
                      "Rely on workflow approvals or trust instead of verifiable authority",
                      "Permit execution before proving admissibility at the boundary of action",
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm text-slate-400">
                  Traditional systems ask:
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Was this decision correct?
                </div>

                <div className="mt-6 text-sm text-slate-400">
                  Solace asks:
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Was this decision allowed to exist at all?
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4 text-sm leading-7 text-slate-200">
                  Governance shifts from policy to enforcement, from monitoring
                  to prevention, and from after-the-fact accountability to
                  admissibility before action.
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="the-problem"
            kicker="The Problem"
            title="The structural gap is not intelligence. It is authority."
            intro="The failure pattern in today’s systems is not simply bad models or weak monitoring. It is the absence of a deterministic authority layer at the exact point where outputs become actions."
          >
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  title: "Execution Without Authority",
                  body:
                    "Most systems still allow action on the basis of confidence, workflow, trust, or implied approval. None of these constitute explicit, verifiable authority.",
                },
                {
                  title: "Reactive Governance",
                  body:
                    "Governance frameworks frequently evaluate decisions after generation, detect failures after execution, and rely on audit trails instead of prevention.",
                },
                {
                  title: "Representation vs Reality",
                  body:
                    "AI systems operate on representations of state that may be incomplete, stale, inferred, or internally coherent while externally invalid.",
                },
                {
                  title: "Accountability Without Control",
                  body:
                    "A system can be explainable, documented, and fully logged while still producing harmful actions that were never admissible to begin with.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1830]/70 p-6">
              <p className="text-lg font-semibold tracking-tight text-white">
                The failure is not model accuracy.
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-cyan-100">
                It is the absence of execution authority.
              </p>
            </div>
          </SectionShell>

          <SectionShell
            id="system"
            kicker="Authority Architecture"
            title="Three layers govern what may exist, what may act, and what may become real."
            intro="The Solace Authority System separates reasoning from authority. Models may propose. Governance decides. Only what survives is allowed to exist and act."
          >
            <div className="grid gap-5 xl:grid-cols-3">
              {architectureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.035] p-6"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {card.eyebrow}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5 text-base font-semibold leading-7 text-white">
              Unauthorized execution becomes structurally impossible.
            </div>
          </SectionShell>

          <SectionShell
            id="execution-model"
            kicker="Execution Model"
            title="This is not a workflow. It is an enforced boundary."
            intro="Every action follows a deterministic sequence. If any step fails, execution does not occur."
          >
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1830]/80">
              <div className="border-b border-white/10 px-6 py-4 text-sm font-semibold text-white">
                Deterministic sequence
              </div>
              <div className="px-6 py-5">
                <ol className="space-y-3">
                  {executionSteps.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 text-sm font-semibold text-cyan-100">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-sm leading-7 text-slate-200 sm:text-base">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="constitutional-foundation"
            kicker="Constitutional Foundation"
            title="All admissibility is constrained by runtime invariants."
            intro="The system does not rely on optional guidance or learned preferences. It enforces non-negotiable constraints at runtime."
          >
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Truth",
                  body:
                    "Requires state to be grounded, current, and sufficiently verifiable. Weak or unverifiable state is rejected.",
                },
                {
                  title: "Compassion",
                  body:
                    "Prevents unjustified harm, restricts unsafe application, and constrains action under uncertainty.",
                },
                {
                  title: "Accountability",
                  body:
                    "Requires decisions to be attributable, auditable, and supported by verifiable authority records.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell
            id="cryptographic-enforcement"
            kicker="Cryptographic Enforcement"
            title="Execution is bound to proof, not trust."
            intro="The permit boundary is not conceptual. It is enforced through cryptographic verification and bounded execution artifacts."
          >
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm font-semibold text-white">
                  Core enforcement mechanisms
                </div>
                <div className="mt-4">
                  <BulletList
                    items={[
                      "Ed25519 signature verification",
                      "Short-lived execution receipts with TTL",
                      "Hash-bound payload integrity",
                      "Idempotency constraints",
                      "Immutable decision recording",
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1830]/70 p-6">
                <div className="text-sm font-semibold text-white">
                  What this prevents
                </div>
                <div className="mt-4">
                  <BulletList
                    items={[
                      "Replay attacks",
                      "Payload tampering",
                      "Unauthorized execution",
                      "Bypass of enforcement layers",
                      "Execution on stale or detached authority state",
                    ]}
                  />
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="key-innovation"
            kicker="Key Innovation"
            title="Solace changes the object of governance."
            intro="Traditional systems govern decisions after they are made. Solace governs whether those decisions are allowed to exist and act in the first place."
          >
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  from: "Governance",
                  to: "Admissibility",
                  body:
                    "The question shifts from how to review behavior to whether behavior is allowed to form.",
                },
                {
                  from: "Approval",
                  to: "Authority",
                  body:
                    "Permission is no longer implicit or workflow-based. It must be explicit, scoped, and verifiable.",
                },
                {
                  from: "Logging",
                  to: "Proof",
                  body:
                    "The system does not merely record what happened. It produces evidence of what was allowed.",
                },
              ].map((item) => (
                <div
                  key={`${item.from}-${item.to}`}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="text-sm text-slate-400">{item.from}</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    {item.to}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell
            id="risk-reduction"
            kicker="Risk Model"
            title="Failures are not merely detected. They are prevented from forming."
            intro="The system does not depend on perfect prediction. It reduces risk by refusing to admit or execute inadmissible states."
          >
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
              <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.03]">
                <div className="px-4 py-3 text-sm font-semibold text-white">
                  Failure Mode
                </div>
                <div className="px-4 py-3 text-sm font-semibold text-white">
                  Traditional Systems
                </div>
                <div className="px-4 py-3 text-sm font-semibold text-white">
                  Solace
                </div>
              </div>

              {riskRows.map((row) => (
                <div
                  key={row.failure}
                  className="grid grid-cols-3 border-b border-white/10 last:border-b-0"
                >
                  <div className="px-4 py-4 text-sm leading-7 text-slate-200">
                    {row.failure}
                  </div>
                  <div className="px-4 py-4 text-sm leading-7 text-slate-300">
                    {row.traditional}
                  </div>
                  <div className="px-4 py-4 text-sm leading-7 text-cyan-50">
                    {row.solace}
                  </div>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell
            id="regulatory-alignment"
            kicker="Regulatory Alignment"
            title="Built for environments
