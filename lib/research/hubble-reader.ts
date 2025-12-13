import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function readHubbleEvents(limit = 10) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
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
    console.error("[HUBBLE READ ERROR]", error);
    return [];
  }

  return data ?? [];
}
