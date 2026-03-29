export const metadata = {
  title: "Solace Authority System | Moral Clality AI",
  description:
    "A deterministic authority interface for admissible, authorized, and enforced execution.",
};

const sections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "authority-console", label: "Authority Console" },
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
      <h2 className="max-w-5xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.2rem] lg:leading-[1.12]">
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
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:border-cyan-400/25 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.03))] hover:shadow-[0_22px_70px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent opacity-70" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-24 bg-cyan-300/5 blur-2xl" />
      </div>
      <h3 className="relative text-base font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-6 text-slate-300">{body}</p>
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

function InvariantChip({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-400/[0.09]">
      <div className="text-sm text-slate-100">{title}</div>
      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a1627]/95 p-4 text-xs leading-5 text-slate-300 shadow-[0_20px_70px_rgba(0,0,0,0.4)] group-hover:block">
        {detail}
      </div>
    </div>
  );
}

function DiagramNode({
  title,
  subtitle,
  dim = false,
}: {
  title: string;
  subtitle: string;
  dim?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 transition duration-500 ${
        dim
          ? "border-white/10 bg-white/[0.03] text-slate-400"
          : "border-cyan-400/20 bg-cyan-400/[0.06] text-white shadow-[0_0_30px_rgba(34,211,238,0.08)]"
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</div>
    </div>
  );
}

function ConsolePanel({
  label,
  title,
  body,
  footer,
}: {
  label: string;
  title: string;
  body: string;
  footer: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
      <div className="mt-5 rounded-2xl border border-white/10 bg-[#08111e]/80 px-4 py-3 text-xs uppercase tracking-[0.18em] text-cyan-200">
        {footer}
      </div>
    </div>
  );
}

function SystemMap() {
  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(7,26,44,0.96),rgba(5,15,28,0.98))] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.38)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300/80">
            Live Authority Diagram
          </div>
          <div className="mt-2 text-lg font-semibold text-white">
            Proposal → Adjudication → Admitted Reality
          </div>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-400/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
          Execution Boundary
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_0.2fr_1.1fr_0.2fr_0.9fr] lg:items-center">
        <div className="space-y-3">
          <DiagramNode
            title="Candidate A"
            subtitle="High confidence · insufficient state"
            dim
          />
          <DiagramNode
            title="Candidate B"
            subtitle="Aligned reasoning · scope mismatch"
            dim
          />
          <DiagramNode
            title="Candidate C"
            subtitle="Grounded proposal · admissible path"
          />
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="h-px w-full bg-gradient-to-r from-cyan-300/0 via-cyan-300/45 to-cyan-300/0" />
        </div>

        <div className="relative overflow-hidden rounded-[1.8rem] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(20,61,90,0.28),rgba(9,26,42,0.5))] p-6 shadow-[0_0_50px_rgba(34,211,238,0.08)]">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/0 via-cyan-300/20 to-cyan-300/0" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-cyan-300/0 via-cyan-300/20 to-cyan-300/0" />
          </div>
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300/80">
              Sovereign Kernel
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Adjudication Boundary
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Admissibility, authority, and enforcement are resolved here before
              anything is allowed to cross into consequence.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-slate-300">
                Admissibility
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-slate-300">
                Authority
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-slate-300">
                Enforcement
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="h-px w-full bg-gradient-to-r from-cyan-300/0 via-cyan-300/45 to-cyan-300/0" />
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.65rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.1),rgba(34,211,238,0.04))] p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Admitted Output
            </div>
            <div className="mt-3 text-lg font-semibold text-white">
              Decision bound to current state, valid scope, and active proof.
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div>State: Grounded</div>
              <div>Authority: In scope</div>
              <div>Receipt: Signed and active</div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Proof boundary
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-300">
              Every admitted action is replayable, auditable, and bound to the
              exact state in which it was authorized.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionDemoCard() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(8,21,36,0.98),rgba(5,14,24,0.98))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/85">
            Governed Decision Demo
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Can this decision exist?
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This interface demonstrates the core Solace determination: a
            decision may appear correct, useful, or even authorized, yet still
            fail admissibility if the state it depends on does not hold.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Proposed decision
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Approve payment
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                State quality
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Grounded
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                Authority status
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Present and in scope
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200">
                Enforcement receipt
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Valid and unexpired
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.02))] p-5 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Governed determination
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Executable
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This decision is admissible and executable. State is sufficient,
            authority is valid, payload integrity holds, and execution is bound
            to active proof.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "State is grounded and current enough for action.",
              "Authority exists and the requested action is inside scope.",
              "The execution receipt is signed, short-lived, and valid.",
              "Payload integrity has been preserved across the decision boundary.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-200"
              >
                <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-[#071726] px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Failure branch
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-300">
              If the state were stale, the decision would be denied even with
              valid authority. Correctness alone is not admissibility.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FailureCard({
  title,
  body,
  response,
}: {
  title: string;
  body: string;
  response: string;
}) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
      <div className="text-base font-semibold text-white">{title}</div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
      <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3 text-sm leading-6 text-cyan-100">
        {response}
      </div>
    </div>
  );
}

function ExecutionRailStep({
  index,
  title,
  body,
  active = false,
}: {
  index: string;
  title: string;
  body: string;
  active?: boolean;
}) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-white">
        {index}
      </div>
      <div className="absolute left-[15px] top-8 h-[calc(100%+1rem)] w-px bg-gradient-to-b from-cyan-300/30 to-transparent last:hidden" />
      <div
        className={`rounded-[1.55rem] border p-5 ${
          active
            ? "border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.02))]"
            : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
        }`}
      >
        <div className="text-base font-semibold text-white">{title}</div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
      </div>
    </div>
  );
}

export default function SolaceWhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#06101d] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.16),transparent_22%),linear-gradient(180deg,#0a1526_0%,#06101d_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(6,16,29,0.42))]" />
        <div className="pointer-events-none absolute -right-24 top-10 hidden opacity-[0.07] blur-[0.4px] lg:block">
          <img
            src="/assets/logo_sas.svg"
            alt=""
            className="h-[560px] w-[560px]"
          />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-6xl">
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
                <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                  Models propose. Governance decides. Only what survives is
                  allowed to exist.
                </div>
                <h1 className="mt-4 max-w-6xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  The Solace Authority System
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">
                  Deterministic authority for what is allowed to exist, act, and
                  execute.
                </p>
              </div>
            </div>

            <div className="mt-10 max-w-4xl">
              <p className="text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[3.35rem] lg:leading-[1.05]">
                AI can act.
                <br />
                It cannot prove that its actions were valid when they occurred.
              </p>

              <p className="mt-5 text-lg font-medium leading-8 text-cyan-100">
                That gap is the execution boundary.
              </p>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Solace enforces admissibility at the moment of execution.
                Outputs, decisions, and actions do not become real unless they
                are valid, authorized, and provably enforced against current
                state.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <InvariantChip
                title="Admissibility is required"
                detail="A decision does not become real because it appears correct. It must survive admissibility before consequence begins."
              />
              <InvariantChip
                title="Deterministic or denied"
                detail="The same explicit boundary state must resolve to the same authority outcome. Ambiguity does not silently pass."
              />
              <InvariantChip
                title="Fail-closed by default"
                detail="If truth, authority, or enforcement are insufficient, the system denies or defers execution rather than optimizing toward action."
              />
              <InvariantChip
                title="Provable authority only"
                detail="Execution is not trusted into existence. It is bound to explicit authority artifacts and active verification."
              />
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(6,50,77,0.24),rgba(6,27,42,0.16))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
                <p className="text-lg leading-8 text-cyan-100">
                  A system can be correct, validated, and fully compliant… and
                  still fail in reality.
                </p>
                <p className="mt-4 text-2xl font-semibold leading-9 text-white">
                  Because it acted on a state that did not hold.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Solace removes that failure at the only place it can be
                  structurally resolved: the execution boundary.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    System claim
                  </div>
                  <div className="mt-2 text-base font-semibold leading-7 text-white">
                    No output exists without admissibility.
                  </div>
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Execution claim
                  </div>
                  <div className="mt-2 text-base font-semibold leading-7 text-white">
                    No action executes without explicit, provable authority.
                  </div>
                </div>
                <div className="rounded-[1.8rem] border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                    Proof boundary
                  </div>
                  <div className="mt-2 text-base leading-7 text-slate-200">
                    Every admitted action is replayable, auditable, and bound to
                    the exact state in which it was authorized.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200">
              <span className="text-cyan-200">— Execution Boundary —</span>{" "}
              Nothing crosses this line without admissibility.
            </div>

            <div className="mt-12">
              <SystemMap />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8 lg:py-18">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              Authority Map
            </div>
            <nav className="space-y-1.5">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold ${
                      index < 3
                        ? "border-cyan-300/25 bg-cyan-400/[0.08] text-cyan-200"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>{section.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="space-y-18">
          <section id="executive-summary" className="scroll-mt-28">
            <SectionHeading
              kicker="Executive Summary"
              title="Governance has historically reviewed decisions after they are made. Solace determines whether decisions are allowed to exist at all."
              body="Most AI systems still operate reactively. They generate outputs, apply checks after generation, and rely on logging, audit, or human intervention after execution. Solace changes the order of operations by turning governance into an execution boundary."
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
                <div className="mb-4 text-sm font-medium text-white">
                  Reactive governance
                </div>
                <SignalList
                  items={[
                    "Outputs are generated before admissibility is proven.",
                    "Governance is applied after the fact instead of at the point of consequence.",
                    "Execution can proceed on confidence, workflow, or implicit trust.",
                    "Audit often arrives after harm, not before it.",
                  ]}
                />
              </div>

              <div className="hidden w-20 items-center justify-center lg:flex">
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="h-10 w-px bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" />
                  <div className="rotate-180 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80 [writing-mode:vertical-rl]">
                    Boundary Shift
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" />
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
                <div className="mb-4 text-sm font-medium text-white">
                  Execution-time authority
                </div>
                <SignalList
                  items={[
                    "Admissibility is resolved before action can form.",
                    "Authority is verified before any consequence is permitted.",
                    "State validity matters independently of output quality.",
                    "Proof, not trust, carries execution across the boundary.",
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ContrastCard
                eyebrow="Traditional systems ask"
                statement="Was this decision correct?"
              />
              <ContrastCard
                eyebrow="Solace asks"
                statement="Was this decision ever admissible to exist and act?"
              />
            </div>
          </section>

          <section id="authority-console" className="scroll-mt-28">
            <SectionHeading
              kicker="Authority Console"
              title="The system resolves four questions before anything is admitted."
              body="The purpose of the interface is not to summarize governance. It is to surface the actual operating dimensions that determine whether an output can become real."
            />

            <div className="grid gap-5 xl:grid-cols-4">
              <ConsolePanel
                label="State"
                title="State Validity"
                body="Admissibility is resolved against the state available to the system. Grounded, fresh, and sufficiently verifiable state can support action. Stale, partial, or inferred state cannot silently authorize it."
                footer="Grounded · Current · Sufficient"
              />
              <ConsolePanel
                label="Authority"
                title="Authority Scope"
                body="Authority is defined before runtime through principals, scopes, constraints, and revocation paths. Presence of authority is not enough. The requested act must be inside current scope."
                footer="Principal · Scope · Constraint"
              />
              <ConsolePanel
                label="Enforcement"
                title="Execution Enforcement"
                body="Execution is carried by signed receipts, short-lived time bounds, payload integrity, and replay resistance. The downstream system does not receive trust. It receives proof."
                footer="Signed · TTL · Hash-bound"
              />
              <ConsolePanel
                label="Outcome"
                title="Admitted Result"
                body="Outputs resolve into denied, deferred, or executable states. A result does not become real because it is useful. It becomes real only after all governing conditions hold."
                footer="Denied · Deferred · Executable"
              />
            </div>

            <div className="mt-6">
              <DecisionDemoCard />
            </div>
          </section>

          <section id="the-problem" className="scroll-mt-28">
            <SectionHeading
              kicker="The Problem"
              title="The core failure is not intelligence. It is execution without valid authority."
              body="Systems can be accurate, explainable, compliant, and still produce outcomes that do not hold in reality. The missing layer is not more reasoning. It is admissibility at the moment of action."
            />

            <div className="grid gap-5 xl:grid-cols-3">
              <FailureCard
                title="Correct but invalid"
                body="A decision can appear coherent, pass process review, and still fail because the state it relies on is stale, partial, or inferred."
                response="Solace blocks it by resolving admissibility against state, not confidence."
              />
              <FailureCard
                title="Authorized but inadmissible"
                body="A principal may exist and a workflow may appear approved, yet the specific act can still be outside scope or unsupported by current conditions."
                response="Solace requires explicit scope alignment before execution becomes possible."
              />
              <FailureCard
                title="Logged but uncontrolled"
                body="Many systems can explain what happened after consequence occurred, but they cannot prevent inadmissible decisions from becoming real."
                response="Solace changes accountability from post-hoc description to pre-execution control."
              />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <FeatureCard
                title="Execution Without Authority"
                body="Most systems permit action based on confidence, workflow approval, or inferred trust. None of these are the same as explicit, verifiable authority."
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

            <div className="mt-8 rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,23,41,0.96),rgba(9,19,34,0.92))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
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

            <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
              <ContrastCard
                eyebrow="Layer one"
                statement="Sovereign Kernel controls existence."
              />
              <ContrastCard
                eyebrow="Layer two"
                statement="Authority Console originates valid scope."
              />
              <ContrastCard
                eyebrow="Layer three"
                statement="Executor admits consequence only with proof."
              />
            </div>

            <div className="mt-8 rounded-[1.9rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.09),rgba(34,211,238,0.04))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
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
              body="This is not a convenience workflow. It is the enforced order by which state, admissibility, authority, proof, and execution are bound together."
            />

            <div className="space-y-4">
              <ExecutionRailStep
                index="1"
                title="Input enters the system"
                body="A proposed act, output, or decision arrives at the boundary."
              />
              <ExecutionRailStep
                index="2"
                title="State is evaluated"
                body="The system resolves whether the available state is grounded, current, and sufficient for action."
                active
              />
              <ExecutionRailStep
                index="3"
                title="Admissibility is resolved"
                body="The proposed decision is tested against constitutional and operational constraints."
              />
              <ExecutionRailStep
                index="4"
                title="Authority is verified"
                body="Principals, scope, revocation, and action class are checked before any path to execution survives."
              />
              <ExecutionRailStep
                index="5"
                title="A deterministic decision is issued"
                body="The system renders a governed determination: denied, deferred, or executable."
              />
              <ExecutionRailStep
                index="6"
                title="Proof is bound to execution"
                body="The decision is carried by signed, short-lived, integrity-bound receipts."
              />
              <ExecutionRailStep
                index="7"
                title="Action proceeds only if verification holds"
                body="The executor verifies the proof boundary and performs the action only if all conditions still hold."
              />
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
              <div className="text-sm font-semibold text-white">
                If any condition fails, execution does not occur.
              </div>
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
                body="Requires grounded state, temporal validity, and sufficient verification for action. Correct-seeming reasoning is not enough if the required state does not hold."
              />
              <FeatureCard
                title="Compassion"
                body="Restricts unjustified harm and denies unsafe application even when an action appears operationally available."
              />
              <FeatureCard
                title="Accountability"
                body="Requires attributable decisions, explicit authority, and durable evidence of what was allowed, under what conditions, and why."
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
              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
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

              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
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

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <ContrastCard eyebrow="Step one" statement="Decision issued" />
              <ContrastCard eyebrow="Step two" statement="Payload hashed" />
              <ContrastCard eyebrow="Step three" statement="Receipt signed" />
              <ContrastCard eyebrow="Step four" statement="Executor verifies" />
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

            <div className="overflow-hidden rounded-[1.95rem] border border-white/10 bg-[linear-gradient(180deg,#0b1628_0%,#091321_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
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
                body="Can the system demonstrate control at the point of consequence? Solace is aligned because it governs whether consequence is permitted in the first place."
              />
              <FeatureCard
                title="NIST AI RMF"
                body="Are governance claims operationalized as executable constraints? Solace translates governance from documentation into runtime control."
              />
              <FeatureCard
                title="Regulated Sectors"
                body="Can action be denied when state, authority, or proof are insufficient? Solace is built for domains where unauthorized execution cannot be treated as an acceptable residual risk."
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
                body="Reduced liability surface, inspectable execution control, and narrower trust assumptions around real-world action."
              />
              <FeatureCard
                title="For Regulators"
                body="Point-in-time evidence, durable proof trails, and classifiable accountability tied to what was allowed under actual conditions."
              />
              <FeatureCard
                title="For AI Systems"
                body="A structural separation between reasoning and authority, allowing intelligence to be useful without becoming sovereign."
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
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                  Final governing question
                </div>

                <p className="text-3xl font-semibold leading-[1.15] tracking-tight text-white">
                  Was this system allowed to act?
                </p>

                <p className="text-lg leading-8 text-slate-300">
                  Solace determines that before consequence begins.
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
