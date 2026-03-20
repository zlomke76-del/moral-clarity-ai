// app/edge-of-knowledge/research/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Knowledge — Research Index | Moral Clarity AI",
  description:
    "A public research index exploring failure, uncertainty, and responsible action where optimization and certainty break down.",
};

type ResearchLink = {
  href: string;
  label: string;
};

type ResearchDomain = {
  numeral: string;
  title: string;
  description: string;
  items: ResearchLink[];
};

const domains: ResearchDomain[] = [/* KEEP YOUR EXISTING ARRAY EXACTLY AS IS */];

// ─────────────────────────────────────────────
// DOMAIN CARD
// ─────────────────────────────────────────────
function DomainCard({ numeral, title, description, items }: ResearchDomain) {
  return (
    <section className="group rounded-3xl border border-sky-950/40 bg-slate-950/70 p-6 backdrop-blur-sm transition hover:border-sky-700/60 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_30px_80px_rgba(0,0,0,0.6)]">
      <div className="flex gap-4">
        <div className="text-sky-300 text-xs font-semibold tracking-[0.2em]">
          {numeral}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block text-sky-300 hover:text-sky-200 transition text-[15px]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function EdgeOfKnowledgeIndexPage() {
  return (
    <main className="w-full space-y-16">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="relative rounded-[2rem] border border-sky-950/40 bg-slate-950/70 p-10 backdrop-blur-sm">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-sky-300">
              MCAI Research Layer
            </div>

            <h1 className="mt-4 text-5xl font-semibold text-white leading-tight">
              Edge of Knowledge
            </h1>

            <p className="mt-6 text-lg text-slate-200 max-w-2xl">
              Research on failure, uncertainty, and responsible action where
              optimization breaks.
            </p>

            <p className="mt-6 text-[15px] text-slate-400 max-w-2xl leading-7">
              This is not product design. Not policy. Not speculation.  
              These are governed analyses of what happens when systems remain
              coherent while becoming wrong.
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/assets/image_research_trans_01.png"
              alt="MCAI Research"
              width={260}
              height={260}
              className="opacity-90"
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE THESIS */}
      {/* ===================================================== */}
      <section className="text-center max-w-4xl mx-auto">
        <p className="text-xl text-slate-200 leading-9">
          Systems rarely fail by collapse.
        </p>

        <p className="mt-4 text-2xl font-semibold text-white leading-10">
          They become internally consistent and externally wrong.
        </p>

        <p className="mt-6 text-slate-400 leading-8">
          Edge of Knowledge exists to detect epistemic decoupling before
          consequence becomes irreversible.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING SYSTEM */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          ["Research", "Defines the boundary"],
          ["Instrumentation", "Detects violation"],
          ["Constraint", "Intervenes before lock-in"],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-sky-900/40 bg-slate-900/70 p-6 text-center"
          >
            <p className="text-xs tracking-[0.2em] text-sky-300 uppercase">
              {title}
            </p>
            <p className="mt-3 text-white text-lg">{desc}</p>
          </div>
        ))}
      </section>

      {/* ===================================================== */}
      {/* FEATURED DOCTRINE (ANCHOR) */}
      {/* ===================================================== */}
      <section className="rounded-3xl border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8">
        <h2 className="text-2xl text-white font-semibold">
          Foundational Doctrine
        </h2>

        <p className="mt-4 text-slate-400 max-w-2xl">
          Governing action when certainty, optimization, and standard logic
          no longer apply.
        </p>

        <div className="mt-6">
          <Link
            href="/edge-of-knowledge"
            className="text-sky-300 text-lg hover:text-sky-200"
          >
            Governing Action at the Edge of Knowledge →
          </Link>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DOMAINS */}
      {/* ===================================================== */}
      <section>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">
            Research Domains
          </p>
          <h2 className="text-3xl text-white font-semibold mt-2">
            Structured by governing function
          </h2>
        </div>

        <div className="grid 2xl:grid-cols-2 gap-6">
          {domains.map((d) => (
            <DomainCard key={d.title} {...d} />
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}
      <section className="text-center text-sm text-slate-500">
        Documents are regime-bounded and updated only through explicit revision.
      </section>
    </main>
  );
}
