import { createClient } from "@supabase/supabase-js";
import { ReflectionLedgerEntry } from "@/services/reflection/reflectionLedger.types";

type InsertReflectionArgs = {
  entry: ReflectionLedgerEntry;
  userId: string;
  workspaceId: string | null;
};

export async function insertReflectionLedgerEntry(
  args: InsertReflectionArgs
): Promise<void> {
  const { entry, userId, workspaceId } = args;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const payload = {
    ...entry,
    user_id: userId,
    workspace_id: workspaceId,
  };

  const { error } = await supabaseAdmin
    .schema("governance")
    .from("reflection_ledger")
    .insert(payload);

  if (error) {
    throw new Error(`Reflection ledger insert failed: ${error.message}`);
  }
}
