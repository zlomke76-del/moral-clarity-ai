export const metadata = {
  title: "Solace Authority System | Moral Clity AI",
  description:
    "A deterministic framework for admissible, authorized, and enforced execution.",
};

const sections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "the-problem", label: "The Problem" },
  { id: "authority-architecture", label: "Authority Architecture" },
  { id: "execution-model", label: "Execution Model" },
  { id: "constitutional-foundation", label: "Constitutional Foundation" },
  { id: "cryptographic-enforcement", label: "Cryptographic Enforcement" },
  { id: "key-innovation", label: "Key Innovation" },
  { id: "risk-model", label: "Risk Model" },
  { id: "regulatory-alignment", label: "Regulatory Alignment" },
  { id: "strategic-implications", label: "Strategic Implications" },
  { id: "design-philosophy", label: "Design Philosophy" },
  { id: "conclusion", label: "Conclusion" },
];

function SectionHeading({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-9">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300/85">
        {kicker}
      </div>
      <h2 className="max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-[1.15]">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function FeatureCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-[0_22px_70px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent opacity-70" />
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
    </div>
  );
}

function ContrastCard({
  eyebrow,
  statement,
}: {
  eyebrow: string;
  statement: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(12,23,41,0.96),rgba(9,19,34,0.9))] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {eyebrow}
      </div>
      <div className="mt-3 text-lg font-semibold leading-8 text-white">
        {statement}
      </div>
    </div>
  );
}

function SignalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-6 text-slate-300"
        >
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.65)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-sm text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      {children}
    </span>
  );
}

export default function SolaceWhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#06101d] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_74%_18%,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,#0b1628_0%,#06101d_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(6,16,29,0.4))]" />
        <div className="pointer-events-none absolute -right-24 top-10 hidden opacity-[0.07] blur-[0.4px] lg:block">
          <img
            src="/assets/logo_sas.svg"
            alt=""
            className="h-[520px] w-[520px]"
          />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-5xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Moral Clarity AI · Solace Authority System
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-2xl" />
                <img
                  src="/assets/logo_sas.svg"
                  alt="Solace Authority System"
                  className="relative h-20 w-20 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)] transition duration-500 hover:scale-[1.03] hover:drop-shadow-[0_0_28px_rgba(34,211,238,0.55)] sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                />
              </div>

              <div>
                <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  The Solace Authority System
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">
                  Deterministic authority for what is allowed to exist, act, and
                  execute.
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-200">
              AI systems can already act in the real world. What they still
              cannot do is prove that action was valid at the exact moment it
              occurred.
            </p>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
              Solace introduces execution-time admissibility: a deterministic
              authority layer that prevents outputs, decisions, and actions from
              becoming real unless they are valid, authorized, and enforced.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Pill>Admissibility before action</Pill>
              <Pill>Deterministic execution control</Pill>
              <Pill>Fail-closed enforcement</Pill>
              <Pill>Cryptographic proof boundary</Pill>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(6,50,77,0.24),rgba(6,27,42,0.16))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
                <p className="text-base leading-7 text-cyan-100">
                  Every AI system today can produce outputs that look correct,
                  pass validation, and still fail in reality.
                </p>
                <p className="mt-3 text-xl font-semibold leading-8 text-white">
                  Solace eliminates this class of failure at the execution
                  boundary.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    System claim
                  </div>
                  <div className="mt-2 text-base font-semibold leading-7 text-white">
                    No output is admitted without admissibility.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Execution claim
                  </div>
                  <div className="mt-2 text-base font-semibold leading-7 text-white">
                    No action is permitted without explicit authority and
                    enforcement.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-18">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              System Structure
            </div>
            <nav className="space-y-1.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="space-y-18">
          <section id="executive-summary" className="scroll-mt-28">
            <SectionHeading
              kicker="Executive Summary"
              title="The shift is from reviewing decisions to controlling whether decisions are allowed to exist."
              body="Most AI systems are still governed reactively. They generate outputs, apply checks after generation, and rely on logging, audit, or human cleanup after execution. Solace changes the order of operations."
            />

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
                <div className="mb-4 text-sm font-medium text-white">
                  Current systems operate on a reactive model:
                </div>
                <SignalList
                  items={[
                    "Decisions are generated before admissibility is proven.",
                    "Governance is applied after the fact instead of at the point of consequence.",
                    "Execution can proceed on confidence, workflow, or implicit trust.",
                    "Audit often arrives after real-world harm, not before it.",
                  ]}
                />
              </div>

              <div className="grid gap-4">
                <ContrastCard
                  eyebrow="Traditional systems ask"
                  statement="Was this decision correct?"
                />
                <ContrastCard
                  eyebrow="Solace asks"
                  statement="Was this decision ever allowed to exist and act?"
                />
              </div>
            </div>
          </section>

          <section id="the-problem" className="scroll-mt-28">
            <SectionHeading
              kicker="The Problem"
              title="The core failure is not intelligence. It is execution without valid authority."
              body="Systems can be accurate, explainable, compliant, and still produce outcomes that do not hold in reality. The missing layer is not more reasoning. It is admissibility at the moment of action."
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FeatureCard
                title="Execution Without Authority"
                body="Most systems permit action based on model confidence, workflow approval, or inferred trust. None of these are the same as explicit, verifiable authority."
              />
              <FeatureCard
                title="Reactive Governance"
                body="Governance frameworks frequently evaluate outcomes after generation or detect failure after execution, leaving a structural gap between decision and control."
              />
              <FeatureCard
                title="Representation vs Reality"
                body="AI systems act on representations of state that may be stale, partial, inferred, or internally coherent while externally invalid."
              />
              <FeatureCard
                title="Accountability Without Control"
                body="Explainability and audit trails do not prevent an inadmissible decision from forming or executing. They only describe what happened after it occurred."
              />
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(12,23,41,0.96),rgba(9,19,34,0.92))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
              <p className="text-xl font-semibold leading-8 text-white">
                The failure is not model accuracy. It is the absence of
                execution authority.
              </p>
            </div>
          </section>

          <section id="authority-architecture" className="scroll-mt-28">
            <SectionHeading
              kicker="Authority Architecture"
              title="A three-layer system for existence control, authority origination, and execution control."
              body="Solace is not a filter added to model output. It is an authority architecture that determines what is allowed to survive, what is authorized to act, and what can be enforced at execution."
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Existence Control"
                body="The Sovereign Kernel determines whether outputs are allowed to exist at all. Inadmissible candidates are removed before synthesis."
              />
              <FeatureCard
                title="Authority Origination"
                body="The Authority Console defines principals, scopes, and constraints before runtime, producing versioned and auditable authority artifacts."
              />
              <FeatureCard
                title="Execution Control"
                body="Core, adapter, and executor enforce decisions at the action boundary so unauthorized execution becomes structurally impossible."
              />
            </div>

            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.09),rgba(34,211,238,0.04))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <p className="text-lg font-semibold text-white">
                Unauthorized execution is not merely discouraged. It is made
                structurally impossible.
              </p>
            </div>
          </section>

          <section id="execution-model" className="scroll-mt-28">
            <SectionHeading
              kicker="Execution Model"
              title="Every action follows a deterministic boundary sequence."
              body="The sequence below is not a convenience workflow. It is the enforced order by which admissibility, authority, and execution are bound together."
            />

            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0b1628_0%,#091321_100%)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <ol className="space-y-3 text-sm leading-6 text-slate-200">
                <li>1. Input enters the system.</li>
                <li>2. Admissibility is enforced.</li>
                <li>3. Authority artifacts are referenced.</li>
                <li>4. A deterministic decision is issued.</li>
                <li>5. The decision is recorded in an immutable trail.</li>
                <li>6. Execution is cryptographically bound.</li>
                <li>7. The executor verifies the receipt and performs action.</li>
              </ol>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ContrastCard
                eyebrow="What this is"
                statement="An enforced execution boundary."
              />
              <ContrastCard
                eyebrow="What this is not"
                statement="A post-hoc workflow or policy reminder."
              />
            </div>
          </section>

          <section id="constitutional-foundation" className="scroll-mt-28">
            <SectionHeading
              kicker="Constitutional Foundation"
              title="All admissibility is governed by runtime invariants."
              body="The system is anchored by constitutional constraints that are enforced at runtime, not suggested, learned, or optionally applied."
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Truth"
                body="Requires state that is grounded, current, and sufficiently verifiable for action."
              />
              <FeatureCard
                title="Compassion"
                body="Prevents unjustified harm and restricts unsafe application even when an action appears operationally available."
              />
              <FeatureCard
                title="Accountability"
                body="Requires traceable decisions, explicit authority, and durable evidence of what was allowed."
              />
            </div>
          </section>

          <section id="cryptographic-enforcement" className="scroll-mt-28">
            <SectionHeading
              kicker="Cryptographic Enforcement"
              title="Execution is bound to proof, not trust."
              body="Solace does not rely on downstream systems to behave correctly by convention. Enforcement is carried by signed, short-lived, and integrity-bound execution receipts."
            />

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
                <div className="mb-4 text-sm font-medium text-white">
                  Core enforcement elements
                </div>
                <SignalList
                  items={[
                    "Ed25519 signature verification",
                    "Short-lived execution receipts with TTL",
                    "Hash-bound payload integrity",
                    "Idempotency constraints",
                    "Immutable ledger recording",
                  ]}
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
                <div className="mb-4 text-sm font-medium text-white">
                  What this prevents
                </div>
                <SignalList
                  items={[
                    "Replay of previously valid execution artifacts",
                    "Payload tampering after decision issuance",
                    "Unauthorized execution outside the permit boundary",
                    "Bypass of enforcement layers through assumed trust",
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="key-innovation" className="scroll-mt-28">
            <SectionHeading
              kicker="Key Innovation"
              title="The system changes the locus of governance."
              body="Traditional governance approaches evaluate decisions after they are generated. Solace governs the conditions under which decisions are allowed to enter reality."
            />

            <div className="grid gap-4 md:grid-cols-3">
              <ContrastCard
                eyebrow="Shift one"
                statement="Governance → Admissibility"
              />
              <ContrastCard
                eyebrow="Shift two"
                statement="Approval → Authority"
              />
              <ContrastCard eyebrow="Shift three" statement="Logging → Proof" />
            </div>
          </section>

          <section id="risk-model" className="scroll-mt-28">
            <SectionHeading
              kicker="Risk Model"
              title="Risk is reduced by preventing inadmissible states from forming."
              body="The system does not simply make harmful outcomes easier to investigate. It constrains the ability of those outcomes to become actionable in the first place."
            />

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0b1628_0%,#091321_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Failure Mode</th>
                    <th className="px-5 py-4 font-semibold">
                      Traditional Systems
                    </th>
                    <th className="px-5 py-4 font-semibold">Solace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-5 py-4">Invalid outputs</td>
                    <td className="px-5 py-4">Generated, then filtered</td>
                    <td className="px-5 py-4">Never admitted</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4">Unauthorized actions</td>
                    <td className="px-5 py-4">Possible via workflow gaps</td>
                    <td className="px-5 py-4">
                      Structurally blocked at execution
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4">State drift</td>
                    <td className="px-5 py-4">May propagate into action</td>
                    <td className="px-5 py-4">
                      Contained before action boundary
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4">Replay or tampering</td>
                    <td className="px-5 py-4">Possible</td>
                    <td className="px-5 py-4">Cryptographically prevented</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4">Post-hoc accountability</td>
                    <td className="px-5 py-4">Primary control mechanism</td>
                    <td className="px-5 py-4">
                      Supplementary to prevention
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="regulatory-alignment" className="scroll-mt-28">
            <SectionHeading
              kicker="Regulatory Alignment"
              title="Built for environments where evidence matters more than policy intent."
              body="Solace aligns naturally with domains that require point-in-time control, traceability, and proof of authorized execution."
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="EU AI Act"
                body="Supports high-risk system control, traceability, auditability, and the need for demonstrable operational safeguards."
              />
              <FeatureCard
                title="NIST AI RMF"
                body="Operationalizes govern, map, measure, and manage through execution-time control rather than narrative policy alone."
              />
              <FeatureCard
                title="Regulated Sectors"
                body="Supports healthcare, finance, and other high-consequence domains where unauthorized execution cannot be treated as an acceptable residual risk."
              />
            </div>
          </section>

          <section id="strategic-implications" className="scroll-mt-28">
            <SectionHeading
              kicker="Strategic Implications"
              title="This is not just safer AI. It is controllable AI."
              body="The implications extend beyond governance posture. Solace creates a basis for deterministic control, reduced liability, and auditable real-world operation."
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="For Enterprises"
                body="Reduced liability exposure, stronger execution control, and an authority layer that can be inspected rather than assumed."
              />
              <FeatureCard
                title="For Regulators"
                body="A proof-based mechanism for evaluating what was allowed, under what authority, and with what enforcement."
              />
              <FeatureCard
                title="For AI Systems"
                body="A structural separation between reasoning and authority, allowing intelligence to be useful without being sovereign."
              />
            </div>
          </section>

          <section id="design-philosophy" className="scroll-mt-28">
            <SectionHeading
              kicker="Design Philosophy"
              title="The system does not chase optimization when admissibility is uncertain."
              body="Solace is deliberately fail-closed. It does not assume perfect knowledge, rely on model correctness, or optimize toward action when the state required for action does not hold."
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FeatureCard
                title="What the system does not claim"
                body="It does not guarantee perfect knowledge of reality. It does not assume that good reasoning is sufficient for valid action."
              />
              <FeatureCard
                title="What the system does instead"
                body="It refuses to permit outputs or actions when sufficient truth, authority, and enforcement are not present."
              />
            </div>
          </section>

          <section id="conclusion" className="scroll-mt-28">
            <SectionHeading
              kicker="Conclusion"
              title="The decisive question is no longer whether AI can reason. It is whether AI is allowed to act."
              body="As AI systems move from assistance into action, the governing problem changes. Correct-seeming outputs are no longer enough. The real requirement is admissibility at the boundary where consequence begins."
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-7 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
              <div className="space-y-6">
                <p className="text-lg leading-8 text-slate-200">
                  AI is no longer a passive tool. It is becoming an active
                  participant in real-world outcomes.
                </p>

                <p className="text-lg leading-8 text-slate-300">
                  The question is not whether a decision appears correct. The
                  question is whether it was ever valid to act on.
                </p>

                <blockquote className="border-l border-cyan-300/40 pl-5 text-xl font-semibold leading-9 text-white">
                  Execution without admissibility is not intelligence.
                  <br />
                  It is uncontrolled risk.
                </blockquote>

                <p className="text-2xl font-semibold tracking-tight text-white">
                  Solace determines whether decisions are allowed to become
                  real.
                </p>
              </div>
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}
