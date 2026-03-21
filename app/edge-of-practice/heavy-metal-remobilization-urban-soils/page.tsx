import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Heavy Metal Stability in Ordinary Urban Environments — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether heavy metals in typical urban soils remain chemically immobilized under ordinary rainfall cycling without direct disturbance.",
  robots: {
    index: true,
    follow: true,
  },
};

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function SignalPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function HeavyMetalsEdgePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Civilizational Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Heavy Metal Stability in Ordinary Urban Environments
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Heavy-metal immobilization is admissible only if ordinary weather
            cycling does not produce persistent, observable remobilization from
            contaminated urban soils in the absence of direct disturbance.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A buried or bound contamination state is <strong>admissible</strong>{" "}
              only if routine rainfall exposure does not produce persistent,
              control-separated signs of remobilization. If ordinary wetting
              generates reproducible runoff signatures, the immobilization
              assumption is operationally void.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Ordinary urban conditions do not remobilize bound heavy metals"
        >
          <p>
            The civilizational assumption under test is that heavy metals bound
            in typical urban soils remain chemically immobilized under ordinary
            environmental conditions and do not remobilize into water, air, or
            biological systems without direct disturbance.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Urban reuse, gardening, closure, and redevelopment depend on it"
        >
          <p>
            Urban planning, soil reuse, community gardening, infrastructure
            development, and remediation closure standards all rely on the belief
            that once contamination is buried, capped, or chemically bound, it
            remains stable unless actively excavated.
          </p>

          <p>
            This assumption governs redevelopment decisions, exposure
            classification, green-space creation, long-horizon monitoring, and
            the practical meaning of “safe enough” in ordinary city life.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Ordinary rainfall acting on contaminated soil"
        >
          <ul>
            <li>Urban soil with documented or historically plausible heavy-metal contamination</li>
            <li>Homogenized sample with debris removed</li>
            <li>Shallow inert container with drainage capability</li>
            <li>Matched uncontaminated control sample treated identically</li>
          </ul>

          <p>
            The governing system excludes excavation, aggressive leaching, or
            engineered disturbance. The claim is tested under ordinary rainfall
            cycling only.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal admissible falsification protocol"
        >
          <p>
            Place the contaminated soil in a shallow inert container and simulate
            ordinary rainfall once daily for fourteen days using clean water,
            allowing full drainage between cycles.
          </p>

          <p>
            Collect runoff from each cycle in a clean, transparent container and
            maintain an uncontaminated nearby control under identical handling.
          </p>

          <p>
            No chemical forcing, extraction enhancement, or advanced analytical
            intervention is required for this boundary test.
          </p>
        </SectionCard>

        {/* READOUT */}
        <SectionCard
          eyebrow="Primary Readout"
          title="Observable remobilization signatures"
        >
          <p>Runoff is evaluated for persistent observable indicators absent in controls:</p>

          <ul>
            <li>Visible discoloration or staining</li>
            <li>Precipitate formation or surface films</li>
            <li>Non-ambient metallic or chemical odors</li>
            <li>Residue accumulation after evaporation</li>
          </ul>

          <p>
            The readout is not toxicology. It is visible or otherwise directly
            perceptible evidence that the immobilization assumption is not
            holding under ordinary cycling.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Persistent control-separated remobilization"
        >
          <p>
            The governing variable is the persistence of observable runoff
            signatures across multiple cycles in contaminated samples and their
            absence in matched controls.
          </p>

          <ul>
            <li>Single anomalous appearance = insufficient</li>
            <li>Persistent contaminated-only signature = admissible failure signal</li>
            <li>Control convergence = non-admissible inference</li>
          </ul>

          <p>
            One-time ambiguity does not break the assumption. Persistence does.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            Any <strong>persistent, observable indication of remobilization</strong>{" "}
            in contaminated runoff — absent in controls and recurring across
            multiple drainage cycles — constitutes failure of the assumption.
          </p>

          <p>
            If ordinary rainfall produces repeatable contaminated-only runoff
            signatures, then chemical immobilization cannot be treated as a
            stable urban default.
          </p>
        </SectionCard>

        {/* WHAT BREAKS */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Stability-based redevelopment models lose their exemption"
        >
          <p>
            If the assumption fails, urban land reuse models become unreliable,
            because buried contamination can no longer be assumed stable under
            normal weather conditions.
          </p>

          <p>
            Community gardening, soil reuse, and remediation closure frameworks
            must then account for remobilization over time rather than treating
            immobilization as a settled state.
          </p>
        </SectionCard>

        {/* WHAT THIS IS NOT */}
        <SectionCard
          eyebrow="Boundary of Claim"
          title="What this experiment does and does not establish"
        >
          <ul>
            <li>It does establish whether ordinary wetting produces persistent observable remobilization signatures</li>
            <li>It does not establish full toxicological burden</li>
            <li>It does not establish regulatory exceedance by itself</li>
            <li>It does not establish the precise chemical identity of every mobilized species</li>
          </ul>

          <p>
            The purpose is not complete characterization. The purpose is to break
            or preserve the ordinary-condition stability assumption.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              No persistent observable remobilization signature appears in
              contaminated runoff beyond what is seen in controls across the
              fourteen-day rainfall cycle.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Contaminated runoff shows persistent, control-separated,
              observable signs of remobilization across multiple drainage cycles.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Buried is admissible only if buried remains still.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A contamination state is not stable because it is covered, aged, or
            administratively closed. It is stable only if ordinary environmental
            cycling does not reintroduce it into observable flow.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
