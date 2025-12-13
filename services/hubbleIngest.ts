// services/hubbleIngest.ts
// --------------------------------------------------------------
// Hubble Ingest — Phase 0 (Validate + Diag ONLY)
// - No persistence
// - No memory writes
// - Strict schema validation
// - Explicit diagnostics for audit + drift review
// --------------------------------------------------------------

import Ajv, { JSONSchemaType } from "ajv";

// --------------------------------------------------------------
// Hubble Event Schema (Minimal Viable, Versioned)
// --------------------------------------------------------------
export type HubbleEvent = {
  event_id: string;
  timestamp_utc: string;
  instrument_mode: string;
  exposure_time: number;
  target_ra: number;
  target_dec: number;
  data_quality_flags: number[];
  payload_ref: string;
  calibration_version: string;
};

const hubbleEventSchema: JSONSchemaType<HubbleEvent> = {
  type: "object",
  additionalProperties: false,
  required: [
    "event_id",
    "timestamp_utc",
    "instrument_mode",
    "exposure_time",
    "target_ra",
    "target_dec",
    "data_quality_flags",
    "payload_ref",
    "calibration_version",
  ],
  properties: {
    event_id: { type: "string", minLength: 1 },
    timestamp_utc: { type: "string", minLength: 10 },
    instrument_mode: { type: "string", minLength: 1 },
    exposure_time: { type: "number", minimum: 0 },
    target_ra: { type: "number", minimum: 0, maximum: 360 },
    target_dec: { type: "number", minimum: -90, maximum: 90 },
    data_quality_flags: {
      type: "array",
      items: { type: "number" },
      minItems: 0,
    },
    payload_ref: { type: "string", minLength: 1 },
    calibration_version: { type: "string", minLength: 1 },
  },
};

// --------------------------------------------------------------
// AJV Validator
// --------------------------------------------------------------
const ajv = new Ajv({
  allErrors: true,
  strict: true,
  allowUnionTypes: true,
});

const validateEvent = ajv.compile(hubbleEventSchema);

// --------------------------------------------------------------
// Diagnostics Helper
// --------------------------------------------------------------
function diag(label: string, payload: any) {
  console.info(`[HUBBLE-INGEST] ${label}`, payload);
}

// --------------------------------------------------------------
// Public API — Validate + Diag ONLY
// --------------------------------------------------------------
export function validateHubbleEvent(input: unknown): {
  ok: boolean;
  event?: HubbleEvent;
  errors?: any[];
} {
  diag("ingest.received", {
    type: typeof input,
    preview:
      typeof input === "object"
        ? JSON.stringify(input).slice(0, 300)
        : String(input).slice(0, 300),
  });

  const valid = validateEvent(input);

  if (!valid) {
    diag("ingest.validation_failed", {
      errors: validateEvent.errors,
    });

    return {
      ok: false,
      errors: validateEvent.errors ?? [],
    };
  }

  const event = input as HubbleEvent;

  diag("ingest.validation_passed", {
    event_id: event.event_id,
    timestamp_utc: event.timestamp_utc,
    instrument_mode: event.instrument_mode,
    payload_ref: event.payload_ref,
  });

  return {
    ok: true,
    event,
  };
}
