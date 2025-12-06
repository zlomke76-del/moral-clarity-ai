// app/api/chat/modules/context.ts

/**
 * Lightweight, timeout-proof context builder for Solace.
 *
 * This file intentionally avoids:
 *  - Tavily external search
 *  - Supabase-heavy aggregations
 *  - Any slow I/O calls
 *
 * The goal is to keep /api/chat FAST & RELIABLE while
 * we stabilize the new Responses API architecture.
 */

export type SolaceContext = {
  persona: string;
  memoryPack: any;
  newsDigest: any;
  researchContext: any;
};

/**
 * SAFE, FAST IMPLEMENTATION
 * -------------------------
 * This returns the correct shape for downstream modules,
 * but does NOT call external services. This prevents
 * 504 FUNCTION_INVOCATION_TIMEOUT errors on Vercel Edge.
 */
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  message: string
): Promise<SolaceContext> {
  // Persona stays stable for now
  const persona = "Solace";

  // Disabled heavy modules — will be rebuilt modularly later
  const memoryPack = null;
  const newsDigest = null;
  const researchContext = null;

  return {
    persona,
    memoryPack,
    newsDigest,
    researchContext,
  };
}
