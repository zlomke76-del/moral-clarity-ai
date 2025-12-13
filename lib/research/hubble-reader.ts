import { createServerClient } from "@supabase/ssr";

export async function readHubbleEvents(
  cookieHeader: string,
  limit = 10
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const match = cookieHeader
            .split(";")
            .map(c => c.trim())
            .find(c => c.startsWith(name + "="));
          return match ? match.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data, error } = await supabase
    .schema("research")
    .from("hubble_ingest_v1")
    .select("*")
    .order("timestamp_utc", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[HUBBLE READER ERROR]", error);
    return [];
  }

  return data ?? [];
}
