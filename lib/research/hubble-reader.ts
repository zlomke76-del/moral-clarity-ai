// ------------------------------------------------------------
// Hubble Research Reader
// READ-ONLY, SERVER-SAFE
// Provides researchContext entries for Solace
// NEXT 16 SAFE — NO ASYNC COOKIES
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type HubbleResearchEvent = {
  event_id: string;
  timestamp_utc: string;
  instrument_mode: string;
  payload_ref: string;
  calibration_version?: string;
};

export type ResearchContextItem = {
  source: "hubble";
  event_id: string;
  timestamp_utc: string;
  summary: string;
  payload_ref: string;
};

// ------------------------------------------------------------
// Diagnostics
// ------------------------------------------------------------
function diag(label: string, payload: any) {
  console.log(`[DIAG-HUBBLE] ${label}`, payload);
}

// ------------------------------------------------------------
// PUBLIC API — EXPECTED BY assembleContext
// ------------------------------------------------------------
export async function readHubbleResearchContext(
  limit = 10
): Promise<ResearchContextItem[]> {
  try {
    // ✅ CORRECT: cookies() is synchronous
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    diag("query start", { limit });

    const { data, error } = await supabase
      .schema("research")
      .from("hubble_events")
      .select(
        "event_id, timestamp_utc, instrument_mode, payload_ref, calibration_version"
      )
      .order("timestamp_utc", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("[HUBBLE] read error", error.message);
      return [];
    }

    diag("query result", {
      count: data?.length ?? 0,
      sample: data?.[0]?.event_id ?? null,
    });

    return (data ?? []).map((e: HubbleResearchEvent) => ({
      source: "hubble",
      event_id: e.event_id,
      timestamp_utc: e.timestamp_utc,
      payload_ref: e.payload_ref,
      summary: `Hubble observation via ${e.instrument_mode}`,
    }));
  } catch (err: any) {
    console.error("[HUBBLE] fatal read error", err?.message);
    return [];
  }
}
