// lib/solace/authorityClient.ts
// ------------------------------------------------------------
// Solace Core Authority Client (AUTHORITATIVE)
// - Server-only helper for Solace → Core calls
// - Supports BOTH authority surfaces:
//     1) /v1/authorize  (advisory, no acceptance)
//     2) /v1/execute    (binding, acceptance-required)
// - Fail-closed by default
// - Optional explicit bypass for local/dev only (env-gated)
// ------------------------------------------------------------

export type SolaceDecision = {
  permitted: boolean;
  decision: "PERMIT" | "DENY" | "ESCALATE";
  reason?: string;
  issuer?: string | null;
  executeHash?: string | null;
  consumedAt?: string | null;
  raw?: any;
};

export type SolaceAcceptance = {
  issuer: string;
  actorId: string;
  intent: string;
  issuedAt: string;
  expiresAt: string;
  signature: string; // base64
};

export type SolaceExecuteRequest = {
  intent: any;
  execute: any;
  acceptance: SolaceAcceptance;
};

function isTruthyEnv(v?: string | null): boolean {
  if (!v) return false;
  const s = String(v).trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function normalizeBaseUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

function safeJson(v: any): string {
  try {
    return JSON.stringify(v);
  } catch {
    return "{}";
  }
}

function failClosed(reason: string): SolaceDecision {
  return {
    permitted: false,
    decision: "DENY",
    reason,
    issuer: null,
    executeHash: null,
    consumedAt: null,
    raw: null,
  };
}

/**
 * ------------------------------------------------------------
 * AUTHORIZE-ONLY — authorizeIntent(intent)
 *
 * Calls Solace Core /v1/authorize
 * - Advisory surface
 * - No acceptance required
 * - Writes ledger evidence in Core
 * - Used by Solace UI / browser-mediated flows
 * ------------------------------------------------------------
 */
export async function authorizeIntent(
  intent: any,
  opts?: { timeoutMs?: number }
): Promise<SolaceDecision> {
  const baseUrl = normalizeBaseUrl(process.env.SOLACE_CORE_URL);
  const bypass = isTruthyEnv(process.env.SOLACE_AUTH_BYPASS);
  const timeoutMs = Math.max(250, Math.min(opts?.timeoutMs ?? 3000, 15000));

  if (bypass) {
    return {
      permitted: true,
      decision: "PERMIT",
      reason: "solace_auth_bypass_enabled",
      issuer: "bypass",
      executeHash: null,
      consumedAt: new Date().toISOString(),
      raw: null,
    };
  }

  if (!baseUrl) {
    return failClosed("solace_core_url_missing_or_invalid");
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/v1/authorize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SOLACE_API_KEY
          ? { "x-solace-api-key": process.env.SOLACE_API_KEY }
          : {}),
      },
      body: safeJson(intent),
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));
    const decision = String(json?.decision ?? "DENY").toUpperCase();

    if (decision === "PERMIT") {
      return {
        permitted: true,
        decision: "PERMIT",
        reason: json?.reason,
        raw: json,
      };
    }

    if (decision === "ESCALATE") {
      return {
        permitted: false,
        decision: "ESCALATE",
        reason: json?.reason ?? "escalated",
        raw: json,
      };
    }

    return {
      permitted: false,
      decision: "DENY",
      reason: json?.reason ?? "denied",
      raw: json,
    };
  } catch (err: any) {
    const msg =
      err?.name === "AbortError"
        ? "solace_core_timeout"
        : err?.message ?? "solace_core_request_failed";

    return failClosed(msg);
  } finally {
    clearTimeout(t);
  }
}

/**
 * ------------------------------------------------------------
 * EXECUTION GATE — authorizeExecution(intent, acceptance)
 *
 * Calls Solace Core /v1/execute
 * - Acceptance REQUIRED
 * - Binding authority gate
 * - FAIL CLOSED if anything is missing or invalid
 * - Used ONLY for real execution paths
 * ------------------------------------------------------------
 */
export async function authorizeExecution(
  intent: any,
  opts?: {
    acceptance?: SolaceAcceptance;
    execute?: any;
    timeoutMs?: number;
  }
): Promise<SolaceDecision> {
  const baseUrl = normalizeBaseUrl(process.env.SOLACE_CORE_URL);
  const bypass = isTruthyEnv(process.env.SOLACE_AUTH_BYPASS);
  const timeoutMs = Math.max(250, Math.min(opts?.timeoutMs ?? 3000, 15000));

  if (bypass) {
    return {
      permitted: true,
      decision: "PERMIT",
      reason: "solace_auth_bypass_enabled",
      issuer: "bypass",
      executeHash: null,
      consumedAt: new Date().toISOString(),
      raw: null,
    };
  }

  if (!baseUrl) {
    return failClosed("solace_core_url_missing_or_invalid");
  }

  const acceptance = opts?.acceptance;
  if (!acceptance) {
    return failClosed("acceptance_required_missing");
  }

  const execute =
    opts?.execute ?? {
      type: "authorize_only",
      intent_id: intent?.intent_id ?? null,
      action: intent?.action ?? null,
      parameters: intent?.parameters ?? null,
    };

  const payload: SolaceExecuteRequest = {
    intent,
    execute,
    acceptance,
  };

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/v1/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SOLACE_API_KEY
          ? { "x-solace-api-key": process.env.SOLACE_API_KEY }
          : {}),
      },
      body: safeJson(payload),
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));
    const decision = String(json?.decision ?? "DENY").toUpperCase();

    if (decision === "PERMIT") {
      return {
        permitted: true,
        decision: "PERMIT",
        reason: json?.reason,
        issuer: json?.issuer ?? null,
        executeHash: json?.executeHash ?? null,
        consumedAt: json?.consumedAt ?? null,
        raw: json,
      };
    }

    if (decision === "ESCALATE") {
      return {
        permitted: false,
        decision: "ESCALATE",
        reason: json?.reason ?? "escalated",
        issuer: json?.issuer ?? null,
        raw: json,
      };
    }

    return {
      permitted: false,
      decision: "DENY",
      reason: json?.reason ?? "denied",
      issuer: json?.issuer ?? null,
      raw: json,
    };
  } catch (err: any) {
    const msg =
      err?.name === "AbortError"
        ? "solace_core_timeout"
        : err?.message ?? "solace_core_request_failed";

    return failClosed(msg);
  } finally {
    clearTimeout(t);
  }
}
