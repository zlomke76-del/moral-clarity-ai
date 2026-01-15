// ------------------------------------------------------------
// Reflection Ledger — GOVERNANCE INSERT
// AUTHORITATIVE WRITE PATH
// ------------------------------------------------------------
//
// This file is the ONLY allowed mechanism for writing
// reflection outcomes into persistent storage.
//
// Reflection is:
// - Read-only to Solace
// - Non-authoritative
// - Influence-limited by prompt invariants
//
// ------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import { ReflectionLedgerEntry } from "../reflection/reflectionLedger.types";

// ------------------------------------------------------------
// SUPABASE ADMIN CLIENT (NO SESSION)
// ------------------------------------------------------------
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// ------------------------------------------------------------
// INSERT FUNCTION (AUTHORITATIVE)
// ------------------------------------------------------------
export async function insertReflectionLedgerEntry(
  entry: ReflectionLedgerEntry
): Promise<void> {
  if (!entry) return;

  const payload: ReflectionLedgerEntry = {
    ...entry,
    recorded_at: entry.recorded_at ?? new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .schema("governance")
    .from("reflection_ledger")
    .insert(payload);

  if (error) {
    // IMPORTANT:
    // Reflection failure must NEVER block primary execution.
    // We log loudly but do not throw.
    console.error("[REFLECTION LEDGER INSERT FAILED]", {
      error: error.message,
      entry,
    });
  }
}
