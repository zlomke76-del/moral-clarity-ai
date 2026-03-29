export const metadata = {
  title: "Solace Authority System Whitepaper | Moral Clarity AI",
  description:
    "A deterministic framework for admissible, authorized, and enforced execution.",
};

const sections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "the-problem", label: "The Problem" },
  { id: "system", label: "The Solace Authority System" },
  { id: "execution-model", label: "Execution Model" },
  { id: "constitutional-foundation", label: "Constitutional Foundation" },
  { id: "cryptographic-enforcement", label: "Cryptographic Enforcement" },
  { id: "key-innovation", label: "Key Innovation" },
  { id: "risk-reduction", label: "Risk Reduction Model" },
  { id: "regulatory-alignment", label: "Regulatory Alignment" },
  { id: "strategic-implications", label: "Strategic Implications" },
  { id: "limitations", label: "Limitations and Design Philosophy" },
  { id: "conclusion", label: "Conclusion" },
];

export default function SolaceWhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(66,153,225,0.18),transparent_42%),linear-gradient(180deg,#0b1628_0%,#07111f_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Moral Clarity AI Whitepaper
            </div>

            <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The Solace Authority System
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              A deterministic framework for admissible, authorized, and enforced
              execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Deterministic authority
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Fail-closed execution
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Cryptographic enforcement
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Admissibility before action
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              On this page
            </div>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="prose prose-invert prose-slate max-w-none">
          <section id="executive-summary" className="scroll-mt-24">
            <h2>Executive Summary</h2>
            <p>
              Artificial intelligence has advanced to the point where systems
              can generate, recommend, and increasingly initiate actions with
              real-world consequences. However, current governance approaches
              remain insufficient.
            </p>
            <p>Most systems:</p>
            <ul>
              <li>generate outputs</li>
              <li>apply policy checks</li>
              <li>allow execution</li>
              <li>log results after the fact</li>
            </ul>
            <p>This model is inherently reactive.</p>
            <p>It allows:</p>
            <ul>
              <li>inadmissible states to form</li>
              <li>unauthorized actions to proceed</li>
              <li>accountability to occur only after harm</li>
            </ul>
            <blockquote>
              No output is allowed to exist unless it is admissible.
              <br />
              No action is allowed to proceed unless it is authorized.
              <br />
              No execution is allowed to occur unless it is cryptographically
              enforced.
            </blockquote>
            <p>This system reframes governance from:</p>
            <ul>
              <li>policy to enforcement</li>
              <li>monitoring to prevention</li>
              <li>accountability to admissibility</li>
            </ul>
          </section>

          <section id="the-problem" className="scroll-mt-24">
            <h2>The Problem</h2>

            <h3>1. Execution Without Authority</h3>
            <p>Most AI systems allow execution based on:</p>
            <ul>
              <li>model confidence</li>
              <li>workflow approval</li>
              <li>inferred trust</li>
            </ul>
            <p>Authority is often:</p>
            <ul>
              <li>implicit</li>
              <li>non-verifiable</li>
              <li>bypassable</li>
            </ul>

            <h3>2. Reactive Governance</h3>
            <p>Governance frameworks today:</p>
            <ul>
              <li>evaluate decisions after generation</li>
              <li>detect failures after execution</li>
              <li>rely on audit trails instead of prevention</li>
            </ul>
            <p>
              This creates a structural gap: the system can act before
              governance meaningfully intervenes.
            </p>

            <h3>3. Representation vs Reality</h3>
            <p>AI systems operate on representations of state.</p>
            <p>These representations may be:</p>
            <ul>
              <li>incomplete</li>
              <li>stale</li>
              <li>inferred</li>
              <li>internally consistent but externally invalid</li>
            </ul>
            <p>Yet systems still act on them.</p>

            <h3>4. Accountability Without Control</h3>
            <p>
              Even when decisions are explainable, ownership is defined, and
              audit trails exist, systems can still produce valid-looking
              decisions and execute harmful or incorrect actions.
            </p>
            <p>
              Nothing prevents inadmissible decisions from forming or executing.
            </p>
          </section>

          <section id="system" className="scroll-mt-24">
            <h2>The Solace Authority System</h2>
            <p>
              Moral Clarity AI introduces a three-layer authority architecture.
            </p>

            <h3>1. Existence Control (Sovereign Kernel)</h3>
            <p>Determines whether an output is allowed to exist.</p>
            <ul>
              <li>Evaluates multi-model candidates</li>
              <li>
                Enforces constitutional constraints: Truth, Compassion,
                Accountability
              </li>
              <li>Eliminates inadmissible states before synthesis</li>
            </ul>
            <p>
              <strong>Outcome:</strong> Only admissible outputs are allowed into
              the decision space.
            </p>

            <h3>2. Authority Origination (Authority Console)</h3>
            <p>Defines institutional authority before runtime.</p>
            <ul>
              <li>Declares principals, scopes, and constraints</li>
              <li>Compiles canonical authority schemas</li>
              <li>
                Produces versioned, hash-bound, auditable authority artifacts
              </li>
            </ul>
            <p>
              <strong>Outcome:</strong> Authority is explicit, portable, and
              verifiable.
            </p>

            <h3>3. Execution Control (Core + Adapter + Executor)</h3>
            <p>
              Determines whether action is allowed and enforces that decision.
            </p>

            <h4>Solace Core</h4>
            <ul>
              <li>Validates authority and constraints</li>
              <li>Issues deterministic decisions: PERMIT, DENY, ESCALATE</li>
            </ul>

            <h4>Solace Adapter</h4>
            <ul>
              <li>Enforces decisions as a cryptographic boundary</li>
              <li>Blocks all execution without PERMIT</li>
              <li>Issues short-lived signed receipts</li>
            </ul>

            <h4>Executor</h4>
            <ul>
              <li>Verifies receipt integrity before action</li>
              <li>Executes only if all conditions hold</li>
            </ul>

            <p>
              <strong>Outcome:</strong> Unauthorized execution is structurally
              impossible.
            </p>
          </section>

          <section id="execution-model" className="scroll-mt-24">
            <h2>Execution Model</h2>
            <p>Every action follows a deterministic sequence:</p>

            <div className="not-prose overflow-x-auto rounded-2xl border border-white/10 bg-[#0b1628] p-5 text-sm text-slate-200">
              <pre className="whitespace-pre-wrap leading-7">
{`1. Input enters system
2. Sovereign Kernel enforces admissibility
3. Authority Schema is referenced
4. Solace Core evaluates execution intent
5. Decision issued (PERMIT / DENY / ESCALATE)
6. Decision recorded in immutable ledger
7. Adapter binds execution via cryptographic receipt
8. Executor verifies receipt and performs action`}
              </pre>
            </div>

            <p className="mt-4">
              If any step fails, execution does not occur.
            </p>
          </section>

          <section id="constitutional-foundation" className="scroll-mt-24">
            <h2>Constitutional Foundation</h2>
            <p>All admissibility is governed by three invariants:</p>

            <h3>Truth</h3>
            <ul>
              <li>Must be grounded, verifiable, and current</li>
              <li>Rejects unverifiable or weak state</li>
            </ul>

            <h3>Compassion</h3>
            <ul>
              <li>Prevents unjustified harm</li>
              <li>Restricts unsafe application</li>
            </ul>

            <h3>Accountability</h3>
            <ul>
              <li>Requires traceable, auditable decisions</li>
              <li>Produces verifiable authority records</li>
            </ul>

            <p>These constraints are enforced at runtime, non-optional, and non-learned.</p>
          </section>

          <section id="cryptographic-enforcement" className="scroll-mt-24">
            <h2>Cryptographic Enforcement</h2>
            <p>Execution is bound to:</p>
            <ul>
              <li>Ed25519 signature verification</li>
              <li>Short-lived receipt (TTL)</li>
              <li>Hash-bound payload integrity</li>
              <li>Idempotency constraints</li>
              <li>Immutable ledger recording</li>
            </ul>

            <p>This prevents:</p>
            <ul>
              <li>replay attacks</li>
              <li>payload tampering</li>
              <li>unauthorized execution</li>
              <li>bypass of enforcement layers</li>
            </ul>
          </section>

          <section id="key-innovation" className="scroll-mt-24">
            <h2>Key Innovation</h2>

            <h3>From Governance to Admissibility</h3>
            <p>Traditional systems govern decisions after they are made.</p>
            <p>Solace governs whether decisions are allowed to exist.</p>

            <h3>From Approval to Authority</h3>
            <p>Traditional systems approve actions.</p>
            <p>Solace requires explicit, verifiable authority.</p>

            <h3>From Logging to Proof</h3>
            <p>Traditional systems log behavior.</p>
            <p>Solace produces cryptographic evidence of what was allowed.</p>
          </section>

          <section id="risk-reduction" className="scroll-mt-24">
            <h2>Risk Reduction Model</h2>

            <div className="not-prose overflow-x-auto rounded-2xl border border-white/10 bg-[#0b1628]">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Failure Mode</th>
                    <th className="px-4 py-3 font-semibold">Traditional Systems</th>
                    <th className="px-4 py-3 font-semibold">Solace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-4 py-3">Invalid outputs</td>
                    <td className="px-4 py-3">Generated, then filtered</td>
                    <td className="px-4 py-3">Never admitted</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Unauthorized actions</td>
                    <td className="px-4 py-3">Possible via gaps</td>
                    <td className="px-4 py-3">Structurally impossible</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Drift accumulation</td>
                    <td className="px-4 py-3">Leads to execution</td>
                    <td className="px-4 py-3">Contained at enforcement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Replay / tampering</td>
                    <td className="px-4 py-3">Possible</td>
                    <td className="px-4 py-3">Cryptographically prevented</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Post-hoc accountability</td>
                    <td className="px-4 py-3">Required</td>
                    <td className="px-4 py-3">Supplementary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="regulatory-alignment" className="scroll-mt-24">
            <h2>Regulatory Alignment</h2>
            <p>The system directly supports:</p>
            <ul>
              <li>
                <strong>EU AI Act</strong>: high-risk system control, traceability,
                and auditability
              </li>
              <li>
                <strong>NIST AI RMF</strong>: govern, map, measure, manage
              </li>
              <li>
                <strong>Financial and Healthcare Compliance</strong>: execution
                accountability, decision traceability, prevention of
                unauthorized action
              </li>
            </ul>
          </section>

          <section id="strategic-implications" className="scroll-mt-24">
            <h2>Strategic Implications</h2>

            <h3>For Enterprises</h3>
            <ul>
              <li>Reduced liability exposure</li>
              <li>Deterministic control over AI execution</li>
              <li>Audit-ready decision infrastructure</li>
            </ul>

            <h3>For Regulators</h3>
            <ul>
              <li>Verifiable enforcement mechanisms</li>
              <li>Proof-based compliance</li>
              <li>Prevention over detection</li>
            </ul>

            <h3>For AI Systems</h3>
            <ul>
              <li>Separation of reasoning from authority</li>
              <li>Elimination of implicit trust</li>
              <li>Fail-closed operation under uncertainty</li>
            </ul>
          </section>

          <section id="limitations" className="scroll-mt-24">
            <h2>Limitations and Design Philosophy</h2>
            <p>The system does not:</p>
            <ul>
              <li>guarantee perfect knowledge of reality</li>
              <li>rely on model correctness</li>
              <li>attempt to optimize outcomes</li>
            </ul>
            <p>
              Instead, it refuses to act when sufficient truth and authority are
              not present.
            </p>
          </section>

          <section id="conclusion" className="scroll-mt-24">
            <h2>Conclusion</h2>
            <p>Moral Clarity AI introduces a structural shift:</p>
            <blockquote>
              from governing decisions
              <br />
              to governing the conditions under which decisions are allowed to
              exist and act
            </blockquote>

            <p className="mt-8 text-lg font-medium text-white">
              This system does not make AI safe. It ensures that unsafe,
              unauthorized, or inadmissible actions cannot become real.
            </p>

            <p className="mt-6 text-base text-slate-300">
              In a world where AI can act, control must exist at the level of
              reality—not just reasoning.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
