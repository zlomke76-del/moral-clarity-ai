// lib/supabase/edge-user.ts
// -------------------------------------------------------------
// SAFE USER EXTRACTION FOR EDGE FUNCTIONS
// Returns: { email, id } or null
// -------------------------------------------------------------

import { createServerClient } from "@supabase/auth-helpers-remix";

export async function getEdgeUser(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // needed for edge auth introspection
      {
        request: req,
        response: new Response(),
      }
    );

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) return null;

    return {
      email: data.user.email ?? null,
      id: data.user.id ?? null,
    };
  } catch (err) {
    console.error("[edge-user] extraction failed:", err);
    return null;
  }
}
