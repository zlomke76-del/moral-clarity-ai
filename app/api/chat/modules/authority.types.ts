//--------------------------------------------------------------
// AUTHORITY CONTEXT — CANONICAL TYPE
// Read-only, session-scoped, Arbiter-visible only
//--------------------------------------------------------------

export type AuthorityStatus =
  | "POSITIVE"
  | "NEGATIVE"
  | "INDETERMINATE";

export type AuthorityConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type AuthorityContext = {
  authority: string;        // "USPTO", "FDA", "ISO"
  scope: string;            // "PATENTABILITY", "DEVICE_CLASSIFICATION"
  status: AuthorityStatus;
  confidence: AuthorityConfidence;
  reason?: string;          // "NO_RESULTS", "QUERY_EXCEPTION", "OUT_OF_SCOPE"
  data?: any;               // RAW PAYLOAD (read-only)
  timestamp: string;
};
