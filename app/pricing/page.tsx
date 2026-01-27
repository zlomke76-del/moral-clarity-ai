// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Institutional pricing for governed AI use. Designed for accountability, not experimentation.",
};

type Plan = {
  id: "professional" | "team" | "institutional" | "enterprise";
  name: string;
  tagline: string;
  price: string;
  seats: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  ctaLabel: string;
  href: string;
  fine: string;
};

const PLANS: Plan[] = [
  {
    id: "professional",
    name: "Professional",
    tagline: "Individual use with full reasoning transparency.",
    price: "$75",
    seats: "1 user",
    features: [
      "Advisory-only outputs (no autonomous execution)",
      "Session-scoped reasoning & memory",
      "Neutral + domain reasoning modes",
      "Explicit refusal & boundary signaling",
    ],
    ctaLabel: "Start professional access",
    href: "https://staging.moralclarity.ai/buy/professional",
    fine: "For individual professionals • No institutional delegation",
  },
  {
    id: "team",
    name: "Team / Program",
    tagline: "Shared clarity for teams operating under review.",
    price: "$300",
    seats: "Up to 5 users",
    highlight: true,
    badge: "Most adopted",
    features: [
      "Everything in Professional",
      "Shared workspace & session logs",
      "Human-in-the-loop review workflows",
      "Named team owner & permission boundaries",
    ],
    ctaLabel: "Enable team access",
    href: "https://staging.moralclarity.ai/buy/team",
    fine: "Internal use only • No external authority delegation",
  },
  {
    id: "institutional",
    name: "Institutional",
    tagline: "Governed deployment for regulated or public-facing work.",
    price: "$1,500+",
    seats: "Custom",
    features: [
      "Execution-boundary enforcement",
      "Authority, refusal, and escalation modeling",
      "Audit-ready reasoning & provenance",
      "Deployment contract & governance review",
      "Priority support & onboarding",
    ],
    ctaLabel: "Request institutional access",
    href: "/contact?type=institutional",
    fine: "Requires review • No instant activation",
  },
  {
    id: "enterprise",
    name: "Enterprise / Public Sector",
    tagline: "Mission-critical deployment with contractual safeguards.",
    price: "Contracted",
    seats: "Organization-wide",
    features: [
      "Custom deployment contracts",
      "Execution-time authority controls",
      "Regulatory alignment (health, finance, government)",
      "Dedicated environment & support channel",
      "Joint governance & escalation design",
    ],
    ctaLabel: "Contact for enterprise deployment",
    href: "/contact?type=enterprise",
    fine: "Contract required • No self-serve access",
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Institutional pricing
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Solace is priced according to responsibility, not usage. Higher tiers
          reflect governance, accountability, and operational risk — not feature
          unlocks.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={[
              "relative rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6",
              plan.highlight ? "ring-1 ring-blue-500/40" : "",
            ].join(" ")}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow">
                {plan.badge}
              </span>
            )}

            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-white">
                {plan.price}
              </span>
              {plan.price !== "Contracted" && (
                <span className="text-sm text-zinc-400">/month</span>
              )}
            </div>

            <p className="mt-1 text-xs text-zinc-500">{plan.seats}</p>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA — now a true button-style control */}
            <Link
              href={plan.href}
              aria-label={plan.ctaLabel}
              className={[
                "mt-6 inline-flex w-full items-center justify-center gap-2",
                "rounded-lg px-4 py-2.5 text-sm font-semibold",
                "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                plan.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700"
                  : "bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-600",
              ].join(" ")}
            >
              {plan.ctaLabel}
            </Link>

            <p className="mt-2 text-xs text-zinc-500">{plan.fine}</p>
          </article>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-zinc-500">
        Solace is not optimized for experimentation at scale. Institutional
        deployments require explicit governance and acceptance of responsibility.
      </p>
    </section>
  );
}
