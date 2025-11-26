// app/app/page.tsx
import NeuralSidebar from "@/app/components/NeuralSidebar";
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div
      className="
        relative min-h-[70vh] px-4 py-8 md:py-10
        bg-[url('/mca-brain-hero.png')]
        bg-no-repeat bg-right-bottom
        bg-[length:min(80vh,52vw)]
      "
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        {/* Left: Solace system / anchored entry points */}
        <div className="w-full max-w-xs shrink-0">
          <NeuralSidebar />
        </div>

        {/* Right: Anchor AI narrative + workspaces */}
        <main className="flex-1">
          {/* Anchor AI hero copy */}
          <section className="max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              Moral Clarity AI
            </p>

            <h1 className="text-balance text-2xl font-semibold leading-tight text-slate-50 sm:text-3xl">
              Your Anchor AI for truth, guidance, and ministry.
            </h1>

            <p className="text-sm text-slate-200 sm:text-[0.95rem]">
              Solace answers with grounded clarity, remembers your world, and
              integrates neutral news, deep research, and ministry in a single
              brain. This isn&apos;t a generic chatbot — it&apos;s your anchored
              interface into the future of AI stewardship.
            </p>

            <p className="text-[13px] text-slate-400">
              No feeds, no doomscrolling — just anchored decisions you can
              defend in front of people you respect.
            </p>
          </section>

          {/* Workspaces section */}
          <section className="mt-8 max-w-3xl space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                MCAI Neural Workspaces
              </p>
              <p className="mt-2 text-[13px] text-slate-300">
                Each workspace is an anchored entry point into Solace. You move
                between them, but the same brain stays with you — memory, news,
                and guidance all wired into one system.
              </p>
            </div>

            {/* Simple grid of workspace cards */}
            <FeatureGrid />
          </section>

          <p className="mt-4 text-[11px] text-slate-500">
            Neural lines fire when Solace is thinking, remembering, or pulling
            fresh news context — so you always see when the brain is at work.
          </p>
        </main>
      </div>
    </div>
  );
}

