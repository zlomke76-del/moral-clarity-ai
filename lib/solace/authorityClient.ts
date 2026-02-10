// lib/solace/authorityClient.ts

type AuthorityDecision =
  | { permitted: true; decision: "PERMIT" }
  | { permitted: false; decision: "DENY" | "ESCALATE"; reason?: string };

export async function authorizeExecution(
  intent: Record<string, any>
): Promise<AuthorityDecision> {
  // --------------------------------------------------
  // FAIL-CLOSED DEFAULT
  // --------------------------------------------------
  if (!process.env.SOLACE_CORE_URL || !process.env.SOLACE_API_KEY) {
    return {
      permitted: false,
      decision: "DENY",
      reason: "Solace Core not configured",
    };
  }

  try {
    const res = await fetch(
      `${process.env.SOLACE_CORE_URL}/v1/authority/evaluate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Solace-API-Key": process.env.SOLACE_API_KEY,
        },
        body: JSON.stringify({
          request_id: crypto.randomUUID(),
          intent,
        }),
      }
    );

    if (!res.ok) {
      return { permitted: false, decision: "DENY" };
    }

    const json = await res.json();

    if (json?.decision?.decision === "PERMIT") {
      return { permitted: true, decision: "PERMIT" };
    }

    return {
      permitted: false,
      decision: json?.decision?.decision ?? "DENY",
      reason: json?.decision?.reason,
    };
  } catch {
    return { permitted: false, decision: "DENY" };
  }
}
