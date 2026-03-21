import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sweat-Driven Corrosion of Device Metals — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether ordinary sweat and skin-oil exposure materially accelerates corrosion in common device metals under realistic contact cycles.",
  robots: { index: true, follow: true },
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

export default function SweatDrivenCorrosion() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Consumer Materials Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Acceleration of Device Metal Corrosion Due to Sweat and Skin Oils
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Handheld device metals are admissible as contact-stable only if
            ordinary sweat and skin-oil exposure does not materially accelerate
            corrosion relative to matched control conditions.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              A contact material is <strong>admissible</strong> only if routine
              human-use chemistry does not shift it into a measurably more
              corrosive regime. If sweat and skin-oil exposure accelerate
              degradation beyond control behavior, contact stability is
              operationally void.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Normal skin contact does not matter materially"
        >
          <p>
            The hidden assumption under test is that metals used in handheld
            devices corrode insignificantly under normal skin-contact
            conditions.
          </p>
        </SectionCard>

        {/* WHY THIS MATTERS */}
        <SectionCard
          eyebrow="Why This Matters"
          title="Consumer durability is often treated as mechanically dominated"
        >
          <p>
            Device durability discussions often center on drops, abrasion,
            coating wear, and cosmetic scratching, while routine biochemical
            contact from hands is treated as minor or background.
          </p>

          <p>
            If sweat and skin oils materially accelerate corrosion, then
            everyday use is not passive exposure. It becomes an active material
            degradation regime.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Common device metals under repeated contact chemistry cycles"
        >
          <ul>
            <li>316L stainless steel</li>
            <li>Aluminum 6061</li>
            <li>Copper</li>
            <li>Coupon size: 10 × 10 × 1 mm</li>
            <li>Synthetic sweat (ISO 3160-2)</li>
            <li>Synthetic skin-oil formulation</li>
          </ul>

          <p>
            The system isolates contact-driven corrosion using controlled
            simulants rather than uncontrolled user variability.
          </p>
        </SectionCard>

        {/* EXPOSURE */}
        <SectionCard
          eyebrow="Exposure Protocol"
          title="Repeated daily contact-and-dry cycles"
        >
          <p>
            Subject coupons to daily 8-hour exposure to sweat and skin-oil
            simulants followed by drying, repeated for 14 days under controlled
            temperature and humidity.
          </p>

          <p>
            The protocol is designed to emulate repeated real-use contact rather
            than continuous immersion or extreme chemical forcing.
          </p>
        </SectionCard>

        {/* MEASUREMENTS */}
        <SectionCard
          eyebrow="Primary Readouts"
          title="Mass loss, ion release, and electrochemical instability"
        >
          <ul>
            <li>Mass loss by analytical balance</li>
            <li>Metal ion release by ICP-MS</li>
            <li>Electrochemical impedance spectroscopy (EIS)</li>
            <li>Open-circuit potential</li>
          </ul>

          <p>
            These measurements jointly test whether ordinary contact chemistry
            changes both physical material loss and corrosion-state behavior.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Corrosion separation relative to controls"
        >
          <p>
            The governing variable is whether sweat-plus-oil exposure produces a
            statistically significant corrosion increase relative to matched
            controls.
          </p>

          <ul>
            <li>No separation from controls = contact stability holds</li>
            <li>Significant separation = contact stability fails</li>
          </ul>

          <p>
            Cosmetic appearance alone is non-admissible. The claim rises or
            falls on measurable corrosion divergence.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Binary Falsification Threshold"
          title="What breaks the assumption"
        >
          <p>
            The assumption fails if sweat-plus-oil exposure produces a
            statistically significant increase in corrosion relative to controls.
          </p>

          <p>
            A positive result does not require health or regulatory claims. It
            requires only measurable contact-driven acceleration of degradation.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure would mean"
        >
          <p>
            Failure would show that everyday skin contact cannot be treated as a
            neutral usage condition for common device metals.
          </p>

          <p>
            Material selection and durability assumptions would then need to
            account for biochemical contact exposure as a first-order design
            variable rather than a minor background effect.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Boundary of Claim"
          title="What this does and does not establish"
        >
          <ul>
            <li>It does establish whether sweat and skin oils materially accelerate corrosion under the tested protocol</li>
            <li>It does not establish medical risk</li>
            <li>It does not establish regulatory noncompliance</li>
            <li>It does not establish lifetime predictions across all device geometries or coatings</li>
          </ul>

          <p>
            The purpose is strictly to test whether routine contact chemistry is
            materially corrosive under realistic cyclic exposure.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              Sweat-plus-oil exposure does not produce a statistically
              significant corrosion increase relative to controls.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Sweat-plus-oil exposure produces a statistically significant
              increase in mass loss, ion release, or electrochemical corrosion
              signatures relative to controls.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A contact material is not stable if ordinary use chemistry degrades it.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If routine sweat and skin oils measurably accelerate corrosion, then
            human contact is not background exposure. It is part of the
            governing environment.
          </p>
        </section>
      </div>
    </main>
  );
}
