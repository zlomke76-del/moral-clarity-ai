// app/edge-of-knowledge/boundary-of-meaning-vs-authority/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Boundary of Meaning vs Authority | Moral Clarity AI",
  description:
    "A structural boundary where interpretive meaning collides with institutional authority and enforcement.",
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

function FailureBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-400 leading-6">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Collision Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Boundary of Meaning vs Authority
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Where interpretation resists enforcement.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="System A" value="Meaning (Interpretation)" />
          <Signal label="System B" value="Authority (Enforcement)" />
          <Signal label="Outcome" value="Structural Tension" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Regime-bounded · Non-actionable · No prescriptive resolution
        </div>
      </section>

      {/* CORE DEFINITION */}
      <Section title="Core Boundary">
        <p>
          Meaning emerges through context, use, and shared interpretation.
          Authority attempts to fix, constrain, and enforce meaning through
          institutional power.
        </p>
        <p>
          The boundary is reached when these two systems cannot be reconciled.
        </p>
      </Section>

      {/* SYSTEM DYNAMICS */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          System Dynamics
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FailureBlock title="Meaning">
            Fluid, contextual, adaptive, and resistant to closure.
          </FailureBlock>

          <FailureBlock title="Authority">
            Fixed, enforceable, and oriented toward stability and control.
          </FailureBlock>

          <FailureBlock title="Conflict">
            Meaning exposes contradictions; authority suppresses or redefines.
          </FailureBlock>

          <FailureBlock title="Response">
            Enforcement escalates as interpretive plurality increases.
          </FailureBlock>
        </div>
      </section>

      {/* CONDITIONS */}
      <Section title="Boundary Conditions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Institutional attempts to fix meaning</li>
          <li>Competing interpretive communities</li>
          <li>Contextual or cultural shifts</li>
          <li>Legitimacy disputes over who defines meaning</li>
        </ul>
      </Section>

      {/* CONSEQUENCES */}
      <Section title="System Consequences">
        <ul className="list-disc pl-6 space-y-2">
          <li>Authority loses legitimacy when meaning escapes control</li>
          <li>Interpretation becomes contested and negotiated</li>
          <li>Stability decreases as enforcement intensifies</li>
          <li>Plurality increases both resilience and instability</li>
        </ul>
      </Section>

      {/* LIMITS */}
      <Section title="Non-Negotiable Limits">
        <ul className="list-disc pl-6 space-y-2">
          <li>Authority cannot permanently fix meaning</li>
          <li>Meaning cannot exist outside power structures</li>
          <li>No final resolution exists between the two systems</li>
          <li>Enforcement cannot eliminate interpretive plurality</li>
        </ul>
      </Section>

      {/* RELATION */}
      <Section title="Canonical Placement">
        <p>
          This entry belongs to the{" "}
          <Link href="/edge-of-knowledge" className="text-sky-300 underline">
            Edge of Knowledge
          </Link>{" "}
          series.
        </p>
        <p>
          Authority enforcement and response beyond this boundary are governed
          by{" "}
          <Link href="/edge-of-protection" className="text-sky-300 underline">
            Edge of Protection
          </Link>
          .
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Meaning cannot be fully contained by authority, and authority cannot
          function without imposing limits on meaning. The system remains in
          permanent tension.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Regime-bounded · Versioned · Non-actionable
      </div>
    </main>
  );
}
