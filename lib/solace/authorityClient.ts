// lib/solace/authorityClient.ts
// ------------------------------------------------------------
// Solace Core Authority Client (AUTHORITATIVE)
// - Calls Solace Core over the network (Vercel-safe)
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

/**
 * AUTHORITATIVE — authorizeExecution(intent)
 *
 * This client is designed to be called from server-only contexts (Next.js route handlers).
 *
 * Contract:
 * - If SOLACE_CORE_URL is missing or invalid => FAIL CLOSED (DENY)
 * - If Solace Core request fails => FAIL CLOSED (DENY)
 * - If Solace Core returns PERMIT => permitted=true
 *
 * Acceptance-only Core:
 * - Your Solace Core (server.js) requires an `acceptance` object.
 * - Therefore, this function FAILS CLOSED unless one is provided OR
 *   an explicit dev bypass is enabled.
 *
 * Dev bypass (explicit):
 * - Set SOLACE_AUTH_BYPASS=true to return PERMIT without calling Core.
 * - DO NOT enable this in production.
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

  // ----------------------------------------------------------
  // OPTIONAL DEV BYPASS (EXPLICIT, ENV-GATED)
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // FAIL CLOSED — NOT CONFIGURED
  // ----------------------------------------------------------
  if (!baseUrl) {
    return {
      permitted: false,
      decision: "DENY",
      reason: "solace_core_url_missing_or_invalid",
      issuer: null,
      executeHash: null,
      consumedAt: null,
      raw: null,
    };
  }

  // ----------------------------------------------------------
  // ACCEPTANCE REQUIRED (your Core is acceptance-only)
  // ----------------------------------------------------------
  const acceptance = opts?.acceptance;
  if (!acceptance) {
    return {
      permitted: false,
      decision: "DENY",
      reason: "acceptance_required_missing",
      issuer: null,
      executeHash: null,
      consumedAt: null,
      raw: null,
    };
  }

  // ----------------------------------------------------------
  // EXECUTE BINDING PAYLOAD
  // NOTE: this is NOT “execution” — it’s the material being authorized.
  // Keep it minimal + deterministic.
  // ----------------------------------------------------------
  const execute = opts?.execute ?? {
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

  // ----------------------------------------------------------
  // NETWORK CALL (FAIL CLOSED)
  // ----------------------------------------------------------
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/v1/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Reserved for future caller-auth if you add it at the Core.
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
        executeHash: json?.executeHash ?? null,
        consumedAt: json?.consumedAt ?? null,
        raw: json,
      };
    }

    return {
      permitted: false,
      decision: "DENY",
      reason: json?.reason ?? "denied",
      issuer: json?.issuer ?? null,
      executeHash: json?.executeHash ?? null,
      consumedAt: json?.consumedAt ?? null,
      raw: json,
    };
  } catch (err: any) {
    const msg =
      err?.name === "AbortError"
        ? "solace_core_timeout"
        : err?.message ?? "solace_core_request_failed";

    return {
      permitted: false,
      decision: "DENY",
      reason: msg,
      issuer: null,
      executeHash: null,
      consumedAt: null,
      raw: null,
    };
  } finally {
    clearTimeout(t);
  }
}
