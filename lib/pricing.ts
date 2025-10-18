// Canonical mapping for both POST /api/checkout and GET /buy/[plan]

export type PlanSlug = "standard" | "family" | "ministry";

export const PLAN_TO_PRICE: Record<PlanSlug, string> = {
  standard: process.env.PRICE_STANDARD_ID!,  // $25
  family:   process.env.PRICE_FAMILY_ID!,    // $50
  ministry: process.env.PRICE_MINISTRY_ID!,  // $249
};

// What you currently store in metadata
export const PLAN_META: Record<PlanSlug, { tier: string; seats: number; memoryGB?: number }> = {
  standard: { tier: "plus",       seats: 1 },
  family:   { tier: "pro_family", seats: 4 },
  ministry: { tier: "ministry",   seats: 10 },
};

export function inferPlanFromPriceId(priceId: string): PlanSlug | null {
  const entries = Object.entries(PLAN_TO_PRICE) as [PlanSlug, string][];
  const found = entries.find(([, id]) => id === priceId);
  return found ? found[0] : null;
}
