// BEFORE
export function createClientServer(cookieHeader: string = "") { ... }

// AFTER
export function createSupabaseServerClient(cookieHeader: string = "") {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const match = cookieHeader
            .split(";")
            .map((v) => v.trim())
            .find((x) => x.startsWith(name + "="));

          return match ? match.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );
}
