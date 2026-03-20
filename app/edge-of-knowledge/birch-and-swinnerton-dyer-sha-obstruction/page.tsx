// app/edge-of-knowledge/birch-and-swinnerton-dyer-sha-obstruction/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Birch and Swinnerton-Dyer — The Sha Obstruction | Moral Clarity AI",
  description:
    "A structural reduction identifying the Shafarevich–Tate group as the decisive epistemic barrier in the full BSD conjecture.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8 shadow-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300 leading-7">
        {children}
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-widest text-sky-300">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Structural Obstruction
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Birch and Swinnerton-Dyer:
          <br />
          The Shafarevich–Tate Obstruction
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          The conjecture does not close without control of Sha(E).
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Epistemic Barrier" />
          <Signal label="Dependency" value="Sha(E)" />
          <Signal label="Status" value="Unresolved / Blocking" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Regime-bounded · Non-actionable · No constructive claims
        </div>
      </section>

      {/* CORE STATEMENT */}
      <Section title="Core Statement">
        <p>
          The full Birch and Swinnerton-Dyer conjecture reduces to a dependency
          on the Shafarevich–Tate group.
        </p>
        <p>
          Without establishing finiteness and arithmetic control of Sha(E),
          the leading-term identity cannot be completed.
        </p>
      </Section>

      {/* FORMULA */}
      <Section title="Leading-Term Identity">
        <pre className="text-sm text-slate-200 bg-black/40 p-4 rounded-lg overflow-x-auto">
{`lim_{s→1} L(E,s)/(s−1)^r
= ( |Sha(E)| · Ω_E · Reg_E · ∏ c_p ) / |E(ℚ)_tors|²`}
        </pre>
        <p>
          Sha(E) is not auxiliary. It is structurally embedded in the identity.
        </p>
      </Section>

      {/* HIDDEN ASSUMPTION */}
      <Section title="Hidden Dependency">
        <p>All known approaches assume:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Finiteness of Sha(E)</li>
          <li>Non-obstructive arithmetic structure</li>
        </ul>
        <p>This assumption is unproven and non-removable.</p>
      </Section>

      {/* OBSTRUCTION */}
      <Section title="Obstruction Mechanism">
        <p>
          Outside controlled regimes, there is no framework to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Compute |Sha(E)|</li>
          <li>Bound its behavior</li>
          <li>Guarantee non-obstructive structure</li>
        </ul>
        <p>
          Therefore, the conjecture may be true but remains structurally
          inaccessible.
        </p>
      </Section>

      {/* FALSIFIABLE */}
      <Section title="Falsifiable Constraint">
        <p>Any valid resolution must address Sha(E) explicitly:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Prove finiteness and control</li>
          <li>Neutralize its effect</li>
          <li>Or exhibit obstruction</li>
        </ul>
      </Section>

      {/* NON CONCLUSIONS */}
      <Section title="Invalid Conclusions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Rank equality does not resolve BSD</li>
          <li>Partial results do not generalize</li>
          <li>Computation does not remove obstruction</li>
        </ul>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Structural Judgment
        </h2>
        <p className="mt-4 text-red-200">
          BSD is blocked at Sha(E). Without resolving this dependency,
          the conjecture cannot close.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Regime-bounded · Versioned · Non-actionable
      </div>
    </main>
  );
}
