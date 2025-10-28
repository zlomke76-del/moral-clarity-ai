// server/supabase-clients.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Public envs (safe for server or client – but we only use on server here)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// If you need service-level ops elsewhere, import SERVICE below instead:
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Standard client typed to the PUBLIC schema */
export const supaPublic = createClient<Database>(url, anonKey);

/** Client *bound* to the MCA schema (no .schema() needed) */
export const supaMca = createClient<Database, "mca">(url, anonKey);

/** Service-role client (PUBLIC) — use sparingly, server-only */
export const supaServicePublic = createClient<Database>(url, serviceKey);

/** Service-role client (MCA) — use sparingly, server-only */
export const supaServiceMca = createClient<Database, "mca">(url, serviceKey);
