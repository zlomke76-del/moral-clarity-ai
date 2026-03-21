import type { ConstraintPageData, ConstraintStatus } from "./constraint-types";

function getStatusClasses(status: ConstraintStatus) {
  switch (status) {
    case "NO-GO":
    case "FAIL":
      return {
        pillBorder: "border-red-500/30",
        pillText: "text-red-300",
        heroBorder: "border-red-500/20",
        determinationBorder: "border-red-500/30",
        determinationBg: "bg-red-500/10",
        determinationGlow: "shadow-[0_0_80px_rgba(248,113,113,0.18)]",
      };
    case "PASS":
      return {
        pillBorder: "border-green-500/30",
        pillText: "text-green-300",
        heroBorder: "border-green-500/20",
        determinationBorder: "border-green-500/30",
        determinationBg: "bg-green-500/10",
        determinationGlow: "shadow-[0_0_80px_rgba(34,197,94,0.16)]",
      };
    case "CONDITIONAL":
    default:
      return {
        pillBorder: "border-yellow-400/30",
        pillText: "text-yellow-300",
        heroBorder: "border-white/10",
        determinationBorder: "border-white/10",
        determinationBg: "bg-white/[0.04]",
        determinationGlow: "shadow-[0_0_60px_rgba(255,255,255,0.04)]",
      };
  }
}

function BodyBlock({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={`${title}-${index}`} className="leading-8 text-white/70">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export default function ConstraintPage({
  data,
}: {
  data: ConstraintPageData;
}) {
  const statusClasses = getStatusClasses(data.hero.status);

  return (
    <main className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      {/* HERO */}
      <section
        className={[
          "rounded-[32px] border bg-black p-12 shadow-[0_40px_140px_rgba(0,0,0,0.5)]",
          "bg-gradient-to-br from-[#0b1220] via-[#0a0f1a] to-black",
          statusClasses.heroBorder,
        ].join(" ")}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              {data.hero.eyebrow ?? "White Paper"}
            </span>

            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              Constraint Assessment
            </span>

            <span
              className={[
                "rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] border",
                statusClasses.pillBorder,
                statusClasses.pillText,
              ].join(" ")}
            >
              {data.hero.status === "NO-GO" || data.hero.status === "PASS" || data.hero.status === "FAIL"
                ? `FINAL: ${data.hero.status}`
                : `STATUS: ${data.hero.status}`}
            </span>
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-white">
            {data.hero.title}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-white/70">
            {data.hero.description}
          </p>
        </div>
      </section>

      {/* SYSTEM CONSTRAINT */}
      <section className="rounded-[36px] border border-white/10 bg-black p-14 text-center">
        <h2 className="mb-6 text-xs uppercase tracking-[0.25em] text-white/40">
          System Constraint
        </h2>

        <p className="mx-auto max-w-3xl text-3xl leading-[1.5] text-white">
          {data.systemConstraint.statement}
        </p>

        <p className="mt-6 text-white/50">{data.systemConstraint.substatement}</p>
      </section>

      {/* CORE BLOCKS */}
      <BodyBlock title={data.context.title} paragraphs={data.context.body} />
      <BodyBlock
        title={data.construction.title}
        paragraphs={data.construction.body}
      />

      {/* FAILURE CONDITION */}
      <section className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.05] p-8">
        <h2 className="text-xl font-semibold text-white">
          {data.failureCondition.title ?? "Failure Condition"}
        </h2>

        <div className="mt-3 space-y-4">
          {data.failureCondition.body.map((paragraph, index) => (
            <p key={`failure-${index}`} className="leading-8 text-white/80">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ADMISSIBILITY TEST */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold text-white">
          {data.admissibilityTest.title ?? "Admissibility Test"}
        </h2>

        <p className="leading-8 text-white/70">
          {data.admissibilityTest.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="font-semibold text-green-300">
              {data.admissibilityTest.passLabel ?? "PASS"}
            </h3>
            <p className="mt-2 text-green-200/80">
              {data.admissibilityTest.passText}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="font-semibold text-red-300">
              {data.admissibilityTest.failLabel ?? "FAIL"}
            </h3>
            <p className="mt-2 text-red-200/80">
              {data.admissibilityTest.failText}
            </p>
          </div>
        </div>
      </section>

      {/* SYSTEM DETERMINATION */}
      <section className="space-y-4 text-center">
        <div className="mx-auto h-px w-24 bg-white/10" />

        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          System Determination
        </p>

        <p className="mx-auto max-w-2xl text-white/70">{data.determination}</p>
      </section>

      {/* FINAL DOCTRINE */}
      <section
        className={[
          "rounded-[36px] border p-16 text-center",
          statusClasses.determinationBorder,
          statusClasses.determinationBg,
          statusClasses.determinationGlow,
        ].join(" ")}
      >
        <div className="mx-auto max-w-2xl">
          <p className="text-3xl leading-[1.5] text-white">
            {data.doctrine.statement}
          </p>

          {data.doctrine.emphasisTop ? (
            <p className="mt-6 text-white/60">{data.doctrine.emphasisTop}</p>
          ) : null}

          {data.doctrine.emphasisBottom ? (
            <p className="mt-2 text-white/40">{data.doctrine.emphasisBottom}</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
