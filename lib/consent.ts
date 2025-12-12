// lib/consent.ts
// Canonical Consent Gate — Phase 4
// Rule: No named consent, no action.

import "server-only";
import { createClient } from "@supabase/supabase-js";

export type ConsentTier =
  | "observe"
  | "acknowledge"
  | "suggest"
  | "prepare"
  | "execute";

export type ConsentCheckParams = {
  user_id: string;
  workspace_id?: string | null;
  scope: string;     // e.g. "reminder.create"
  domain: string;    // memory | relationship | agent | external
  tier: ConsentTier;
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/**
 * Runtime consent check (authoritative).
 * This function is ALWAYS called immediately before action.
 */
export async function checkConsent({
  user_id,
  workspace_id = null,
  scope,
  domain,
  tier,
}: ConsentCheckParams): Promise<{
  allowed: boolean;
  reason?: string;
  consent_id?: string;
}> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("consent_registry")
    .select("*")
    .eq("user_id", user_id)
    .eq("scope", scope)
    .eq("domain", domain)
    .eq("tier", tier)
    .eq("granted", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      allowed: false,
      reason: "consent_query_failed",
    };
  }

  if (!data) {
    return {
      allowed: false,
      reason: "no_matching_consent",
    };
  }

  return {
    allowed: true,
    consent_id: data.id,
  };
}
