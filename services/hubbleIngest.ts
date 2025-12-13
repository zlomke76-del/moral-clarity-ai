// services/hubbleIngest.ts
import fetch from "node-fetch";
import Ajv from "ajv";
import schema from "./hubble-event.schema.json";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const MAST_ENDPOINT = "https://mast.stsci.edu/api/v0/invoke";

type MastRow = any;

export async function ingestHubbleEvents() {
  const retrievedAt = new Date().toISOString();

  const query = {
    service: "Mast.Caom.Filtered",
    params: {
      filters: [
        { paramName: "obs_collection", values: ["HST"] },
        { paramName: "calib_level", values: [2, 3] } // calibrated only
      ],
      columns: [
        "obsid",
        "t_min",
        "instrument_name",
        "s_ra",
        "s_dec",
        "t_exptime",
        "dataURL",
        "calib_level"
      ],
      page: 1,
      pagesize: 50
    }
  };

  const res = await fetch(MAST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Solace-Hubble-Ingest/1.0"
    },
    body: JSON.stringify(query)
  });

  if (!res.ok) {
    throw new Error(`MAST error ${res.status}`);
  }

  const json = await res.json();
  const rows: MastRow[] = json?.data ?? [];

  const events = [];

  for (const r of rows) {
    const event = {
      schema_version: "v1",
      event_id: String(r.obsid),
      timestamp_utc: new Date(r.t_min * 86400 * 1000).toISOString(),
      instrument_mode: String(r.instrument_name),
      exposure_time: Number(r.t_exptime ?? 0),
      target_ra: Number(r.s_ra),
      target_dec: Number(r.s_dec),
      data_quality_flags: [],
      payload_ref: String(r.dataURL),
      calibration_version: `calib_level_${r.calib_level}`,
      source_provenance: {
        origin: "MAST",
        dataset_id: String(r.obsid),
        citation:
          "NASA/ESA Hubble Space Telescope via MAST (STScI)",
        license: "NASA-open",
        retrieved_at_utc: retrievedAt
      }
    };

    if (!validate(event)) {
      console.error("[HUBBLE INGEST] schema reject", {
        event_id: event.event_id,
        errors: validate.errors
      });
      continue;
    }

    // ⛔ DO NOT STORE HERE
    // ⛔ DO NOT MUTATE EXISTING EVENTS
    // ⛔ EMIT ONLY

    events.push(event);
  }

  return events;
}
