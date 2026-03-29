export const metadata = {
  title: "Solace Authority System Whitepaper | Moral Clarity AI",
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

export default function SolaceWhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* HERO */}
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%),linear-gradient(180deg,#0b1628_0%,#07111f_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Moral Clarity AI · Authority Layer
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              The Solace Authority System
            </h1>

            <p className="mt-6 text-xl text-slate-300 max-w-3xl">
              AI systems can already act in the real world.
              <br />
              None can prove those actions were valid at the moment they occurred.
            </p>

            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Solace introduces execution-time admissibility —
              where actions are not reviewed after the fact,
              but made structurally impossible unless they are valid,
              authorized, and enforced.
            </p>

            <div className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <p className="text-cyan-100">
                Every AI system today can produce outputs that look correct,
                pass validation, and still fail in reality.
              </p>
              <p className="mt-3 text-white font-medium">
                Solace eliminates this class of failure at the execution boundary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              System Structure
            </div>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <article className="prose prose-invert max-w-none">

          {/* EXEC SUMMARY */}
          <section id="executive-summary" className="scroll-mt-24">
            <h2>Executive Summary</h2>

            <p>
              Current AI systems operate on a reactive model:
            </p>

            <ul>
              <li>Decisions are generated before validation</li>
              <li>Governance is applied after the fact</li>
              <li>Execution occurs before admissibility is proven</li>
            </ul>

            <div className="not-prose mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">Traditional systems ask:</p>
              <p className="text-white font-medium mt-1">
                Was this decision correct?
              </p>

              <p className="text-sm text-slate-400 mt-4">Solace asks:</p>
              <p className="text-white font-medium mt-1">
                Was this decision allowed to exist?
              </p>
            </div>
          </section>

          {/* PROBLEM */}
          <section id="the-problem" className="scroll-mt-24">
            <h2>The Problem</h2>

            <h3>Execution Without Authority</h3>
            <p>
              Actions are permitted based on confidence, workflow, or trust —
              none of which are verifiable authority.
            </p>

            <h3>Reactive Governance</h3>
            <p>
              Systems detect and audit failures after execution,
              creating a structural gap between decision and control.
            </p>

            <h3>Representation vs Reality</h3>
            <p>
              Systems act on representations that may be incomplete,
              stale, or internally consistent but externally invalid.
            </p>

            <h3>Accountability Without Control</h3>
            <p>
              Systems can be explainable and still produce harmful outcomes.
            </p>

            <p className="mt-6 font-medium text-white">
              The failure is not model accuracy.
              <br />
              It is the absence of execution authority.
            </p>
          </section>

          {/* SYSTEM */}
          <section id="system" className="scroll-mt-24">
            <h2>Authority Architecture</h2>

            <div className="not-prose grid gap-6 md:grid-cols-3 mt-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h4 className="text-white font-semibold">Existence Control</h4>
                <p className="text-sm text-slate-300 mt-2">
                  Determines whether outputs are allowed to exist.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h4 className="text-white font-semibold">Authority Origination</h4>
                <p className="text-sm text-slate-300 mt-2">
                  Defines explicit, verifiable authority before runtime.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h4 className="text-white font-semibold">Execution Control</h4>
                <p className="text-sm text-slate-300 mt-2">
                  Enforces decisions at the boundary of action.
                </p>
              </div>
            </div>

            <p className="mt-6 text-white font-medium">
              Unauthorized execution becomes structurally impossible.
            </p>
          </section>

          {/* EXECUTION MODEL */}
          <section id="execution-model" className="scroll-mt-24">
            <h2>Execution Model</h2>

            <div className="not-prose rounded-2xl border border-white/10 bg-[#0b1628] p-5 text-sm">
              <pre>
{`1. Input enters system
2. Admissibility enforced
3. Authority referenced
4. Decision issued
5. Decision recorded
6. Execution bound
7. Action verified and performed`}
              </pre>
            </div>

            <p className="mt-4 font-medium text-white">
              This is not a workflow.
              <br />
              It is an enforced boundary.
            </p>
          </section>

          {/* CONSTITUTION */}
          <section id="constitutional-foundation" className="scroll-mt-24">
            <h2>Constitutional Foundation</h2>

            <ul>
              <li><strong>Truth</strong> — verifiable and current</li>
              <li><strong>Compassion</strong> — prevents unjustified harm</li>
              <li><strong>Accountability</strong> — ensures traceability</li>
            </ul>

            <p>These constraints are enforced at runtime and cannot be bypassed.</p>
          </section>

          {/* CRYPTO */}
          <section id="cryptographic-enforcement" className="scroll-mt-24">
            <h2>Cryptographic Enforcement</h2>

            <ul>
              <li>Signature verification</li>
              <li>Short-lived execution receipts</li>
              <li>Payload integrity binding</li>
              <li>Immutable logging</li>
            </ul>

            <p>
              Execution without verification is not possible.
            </p>
          </section>

          {/* KEY INNOVATION */}
          <section id="key-innovation" className="scroll-mt-24">
            <h2>Key Innovation</h2>

            <ul>
              <li>Governance → Admissibility</li>
              <li>Approval → Authority</li>
              <li>Logging → Proof</li>
            </ul>
          </section>

          {/* RISK */}
          <section id="risk-reduction" className="scroll-mt-24">
            <h2>Risk Model</h2>

            <p>
              Failures are not detected.
              <br />
              They are prevented from forming.
            </p>
          </section>

          {/* REGULATORY */}
          <section id="regulatory-alignment" className="scroll-mt-24">
            <h2>Regulatory Alignment</h2>

            <ul>
              <li>EU AI Act</li>
              <li>NIST AI RMF</li>
              <li>Healthcare & financial compliance</li>
            </ul>
          </section>

          {/* STRATEGIC */}
          <section id="strategic-implications" className="scroll-mt-24">
            <h2>Strategic Implications</h2>

            <ul>
              <li>Deterministic control of execution</li>
              <li>Reduced liability exposure</li>
              <li>Audit-ready infrastructure</li>
            </ul>
          </section>

          {/* LIMITATIONS */}
          <section id="limitations" className="scroll-mt-24">
            <h2>Design Philosophy</h2>

            <p>
              The system does not attempt to optimize outcomes.
              <br />
              It refuses to act without sufficient truth and authority.
            </p>
          </section>

          {/* CONCLUSION */}
          <section id="conclusion" className="scroll-mt-24">
            <h2>Conclusion</h2>

            <p>
              AI is no longer a passive tool.
              It is an active participant in real-world outcomes.
            </p>

            <p className="mt-4">
              The question is not whether a decision is correct.
              <br />
              It is whether it was ever valid to act on.
            </p>

            <blockquote className="mt-6">
              Execution without admissibility is not intelligence.
              <br />
              It is uncontrolled risk.
            </blockquote>

            <p className="mt-6 text-lg font-medium text-white">
              Solace determines whether decisions are allowed to become real.
            </p>
          </section>

        </article>
      </section>
    </main>
  );
}
