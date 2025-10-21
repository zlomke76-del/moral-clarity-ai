// lib/supabaseAdmin.ts
import 'server-only'; // hard guard against client bundling
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server only

// Full access, bypasses RLS. DO NOT expose to client.
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});
