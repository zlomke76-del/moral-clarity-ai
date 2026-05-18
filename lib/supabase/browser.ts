// lib/supabase/browser.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use the Supabase SSR browser client so client components and API calls read
// the same cookie-backed session that /auth/callback creates on the server.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
