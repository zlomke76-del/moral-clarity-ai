// app/join/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Join the Moral Clarity AI waitlist",
};

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 md:py-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Join
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
            Join the Moral Clarity AI waitlist.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            We&apos;re onboarding a limited set of people and teams who care
            about neutrality, stewardship, and long-term alignment — not just
            another chatbot.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          <h2 className="text-lg font-semibold">How to join</h2>
          <p className="mt-2 text-sm text-slate-300">
            If you&apos;re already in the system, just sign in and talk to
            Solace. If you&apos;re new, start by creating an account and we&apos;ll
            follow up as seats open.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.8)] transition hover:bg-sky-400"
            >
              Sign in or create account
            </Link>
            <span className="text-xs text-slate-400">
              You&apos;ll land in the Solace workspace once you&apos;re
              approved.
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800/70 bg-slate-950/70 p-4">
              <h3 className="text-sm font-semibold text-slate-100">
                Who this is for
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• Founders and operators</li>
                <li>• Pastors, counselors, and mentors</li>
                <li>• People stewarding complex decisions</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-slate-950/70 p-4">
              <h3 className="text-sm font-semibold text-slate-100">
                What you get access to
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• Solace core chat with Ministry &amp; Guidance modes</li>
                <li>• Neutral Newsroom (digest + outlet cabinet)</li>
                <li>• Early features as we ship them</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

