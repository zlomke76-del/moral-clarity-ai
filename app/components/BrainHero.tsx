// app/components/BrainHero.tsx
import Image from "next/image";
import Link from "next/link";

export default function BrainHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-neutral-800/80 bg-[radial-gradient(circle_at_top,#1e293b_0,#020617_55%,#02030a_100%)] px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 shadow-[0_24px_80px_rgba(0,0,0,0.9)]">
      {/* Neural overlay */}
      <div className="mc-neural-overlay" aria-hidden="true" />

      {/* Triangle + anchor badge (top-right) */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 text-xs text-neutral-300">
        <div className="mc-anchor-badge">
          <div className="mc-anchor-triangle" />
          <span className="mc-anchor-icon">⚓</span>
        </div>
        <span className="hidden sm:inline text-[11px] uppercase tracking-[0.16em] text-neutral-400">
          Anchor AI • Solace
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] md:items-center md:gap-10">
        {/* Left copy / CTAs */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/90">
            Moral Clarity AI
          </p>
          <h1 className="text-balance text-2xl font-semibold leading-tight text-neutral-50 sm:text-3xl md:text-[2.1rem]">
            Your{" "}
            <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Anchor AI
            </span>{" "}
            for truth, guidance, and ministry.
          </h1>

          <p className="mt-3 max-w-xl text-sm text-neutral-300 sm:text-[0.94rem]">
            Solace answers with grounded clarity, remembers your world, and
            integrates neutral news, deep research, and ministry in a single
            brain. This is your workspace into the future of AI stewardship.
          </p>

          {/* CTAs */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_18px_40px_rgba(56,189,248,0.45)] transition hover:bg-sky-400 hover:text-neutral-900"
            >
              Open workspace
            </Link>

            <Link
              href="/auth/sign-in"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-sky-400/50 bg-sky-400/5 px-4 py-2 text-sm font-semibold text-sky-200/90 backdrop-blur-sm transition hover:border-sky-300 hover:bg-sky-300/10"
            >
              Get magic link
            </Link>

            <span className="text-[11px] text-neutral-400">
              No feeds, no doomscrolling — just anchored decisions.
            </span>
          </div>
        </div>

        {/* Brain orb / visualization */}
        <div className="relative mt-4 md:mt-0">
          {/* Halo / energy field */}
          <div className="mc-brain-orb" aria-hidden="true" />

          {/* Brain image */}
          <div className="relative mx-auto h-52 w-52 sm:h-60 sm:w-60 md:h-64 md:w-64">
            <Image
              src="/mca-brain-hero.png"
              alt="Futuristic AI brain representing Solace"
              fill
              priority
              sizes="(min-width: 1024px) 256px, 50vw"
              className="rounded-full object-contain"
            />
          </div>

          {/* Bottom caption */}
          <p className="mt-3 text-center text-xs text-neutral-400">
            Neural lines fire when Solace is thinking, remembering, or pulling
            fresh news context.
          </p>
        </div>
      </div>

      <style jsx>{`
        .mc-neural-overlay {
          position: absolute;
          inset: -40%;
          background-image:
            radial-gradient(
              circle at 10% 0%,
              rgba(56, 189, 248, 0.28),
              transparent 55%
            ),
            radial-gradient(
              circle at 90% 100%,
              rgba(168, 85, 247, 0.3),
              transparent 55%
            ),
            repeating-linear-gradient(
              120deg,
              rgba(15, 23, 42, 0.3) 0px,
              rgba(15, 23, 42, 0.3) 1px,
              transparent 1px,
              transparent 6px
            );
          mix-blend-mode: screen;
          opacity: 0.7;
          pointer-events: none;
        }

        .mc-brain-orb {
          position: absolute;
          inset: 8%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle at 50% 20%,
              rgba(248, 250, 252, 0.25),
              transparent 55%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(56, 189, 248, 0.5),
              transparent 60%
            );
          filter: blur(18px);
          opacity: 0.75;
        }

        .mc-anchor-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
        }

        .mc-anchor-triangle {
          position: absolute;
          inset: 0;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background: radial-gradient(
            circle at 50% 0%,
            rgba(248, 250, 252, 0.95),
            rgba(148, 163, 184, 0.4)
          );
          box-shadow:
            0 0 24px rgba(56, 189, 248, 0.9),
            0 18px 40px rgba(15, 23, 42, 0.9);
        }

        .mc-anchor-icon {
          position: relative;
          font-size: 0.9rem;
          color: #020617;
          text-shadow: 0 1px 2px rgba(15, 23, 42, 0.8);
        }
      `}</style>
    </section>
  );
}
