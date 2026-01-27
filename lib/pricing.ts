// lib/pricing.ts

/**
 * Canonical internal billing slugs
 * These MUST align with Stripe price IDs and persisted billing data.
 */
export type PlanSlug =
  | "standard"       // legacy / intro
  | "professional"   // individual, accountable
  | "team"           // team / program (self-serve)
  | "family"
  | "ministry";

/**
 * Normalize any inbound plan identifier to a canonical PlanSlug.
 * Returns null if the plan is invalid.
 *
 * NOTE:
 * - Professional and Team are now first-class plans.
 * - No aliasing or silent remapping.
 */
export function normalizePlanSlug(input?: string | null): PlanSlug | null {
  if (!input) return null;

  const key = input.toLowerCase();

  if (
    key === "standard" ||
    key === "professional" ||
    key === "team" ||
    key === "family" ||
    key === "ministry"
  ) {
    return key;
  }

  return null;
}

/**
 * Stripe Price IDs come from env vars so we don't hardcode live IDs in git.
 * Set these in Vercel → Project → Settings → Environment Variables.
 */
export const PLAN_TO_PRICE: Record<PlanSlug, string> = {
  standard:     process.env.PRICE_STANDARD_ID!,      // $25 (legacy / intro)
  professional: process.env.PRICE_PROFESSIONAL_ID!,  // $75
  team:         process.env.PRICE_TEAM_ID!,          // $300
  family:       process.env.PRICE_FAMILY_ID!,        // $50
  ministry:     process.env.PRICE_MINISTRY_ID!,      // $249
};

/**
 * Metadata carried through Checkout for provisioning & governance.
 */
export const PLAN_META: Record<
  PlanSlug,
  { tier: string; seats: number; memoryGB?: number }
> = {
  standard:     { tier: "plus",         seats: 1 },
  professional: { tier: "professional", seats: 1 },
  team:         { tier: "team",         seats: 5 },
  family:       { tier: "pro_family",   seats: 4 },
  ministry:     { tier: "ministry",     seats: 10 },
};

/**
 * Reverse lookup used for webhooks and reconciliation.
 */
export function inferPlanFromPriceId(priceId: string): PlanSlug | null {
  const entries = Object.entries(PLAN_TO_PRICE) as [PlanSlug, string][];
  const found = entries.find(([, id]) => id === priceId);
  return found ? found[0] : null;
}
