// lib/solace/validators/eppe.ts

import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";

import eppe01Schema from "../schemas/eppe-01.schema.json";

export type EPPEValidationResult = {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
  }> | null;
};

// Singleton Ajv instance (important for performance + consistency)
const ajv = new Ajv({
  allErrors: true,
  strict: true,
  allowUnionTypes: false,
});

addFormats(ajv);

// Compile once, fail fast if schema is invalid
const validateEPPE01 = ajv.compile(eppe01Schema);

/**
 * Validates an object against EPPE-01.
 * No mutation. No coercion. No inference.
 */
export function validateEPPE(
  data: unknown
): EPPEValidationResult {
  const valid = validateEPPE01(data);

  if (valid) {
    return {
      valid: true,
      errors: null,
    };
  }

  return {
    valid: false,
    errors: normalizeErrors(validateEPPE01.errors),
  };
}

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */

function normalizeErrors(
  errors: ErrorObject[] | null | undefined
): Array<{ path: string; message: string }> {
  if (!errors) return [];

  return errors.map((err) => ({
    path: err.instancePath || "(root)",
    message: err.message ?? "Schema validation error",
  }));
}
