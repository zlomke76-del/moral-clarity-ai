// ------------------------------------------------------------
// GOVERNANCE — INSERT REFLECTION LEDGER ENTRY (AUTHORITATIVE)
// ------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import { ReflectionLedgerEntry } from "@/services/reflection/reflectionLedger.types";

// ------------------------------------------------------------
// ADMIN CLIENT
// ------------------------------------------------------------
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

// ------------------------------------------------------------
// INSERT (IMMUTABLE WRITE)
// ------------------------------------------------------------
export async function insertReflectionLedgerEntry(
  entry: ReflectionLedgerEntry
): Promise<void> {
  // ----------------------------------------------------------
  // CANONICAL PAYLOAD
  // ----------------------------------------------------------
  const payload: ReflectionLedgerEntry = {
    ...entry,

    // AUTHORITATIVE TIMESTAMP
    timestamp: entry.timestamp ?? new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .schema("governance")
    .from("reflection_ledger")
    .insert(payload);

  if (error) {
    throw new Error(
      `Reflection ledger insert failed: ${error.message}`
    );
  }
}
