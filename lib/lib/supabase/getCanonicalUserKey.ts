// lib/supabase/getCanonicalUserKey.ts
// -------------------------------------------------------------
// Returns the canonical user identity for ALL memory operations.
// Email is the single source of truth.
// Falls back safely for unauthenticated sessions (guest mode).
// -------------------------------------------------------------

export type CanonicalUser = {
  canonicalKey: string;   // always an email or "guest"
  email: string | null;
  userId: string | null;
};

export async function getCanonicalUserKey(): Promise<CanonicalUser> {
  try {
    // Browser environment — Supabase auth client handles session
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return {
        canonicalKey: "guest",
        email: null,
        userId: null,
      };
    }

    const email = data.user.email;

    return {
      canonicalKey: email || "guest",
      email,
      userId: data.user.id,
    };
  } catch (err) {
    console.error("[getCanonicalUserKey] FAILED:", err);
    return {
      canonicalKey: "guest",
      email: null,
      userId: null,
    };
  }
}
