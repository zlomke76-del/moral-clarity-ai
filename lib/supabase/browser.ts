// lib/supabase/browser.ts
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function createClient() {
  return createClientComponentClient();
}
