// app/api/chat/modules/triad-diagnostics.ts
//--------------------------------------------------------------
// TRIAD DIAGNOSTICS MODULE
// Logs persona timing, token size, and truncation warnings.
// Invisible to user. Visible only in server logs.
//--------------------------------------------------------------

export const TRIAD_DIAGNOSTICS_ENABLED = true;   // toggle ON/OFF

type TriadDiagInput = {
  stage: "optimist" | "skeptic" | "arbiter";
  prompt: string;
  output: string;
  started: number;
  finished: number;
  model: string;
};

export function logTriadDiagnostics(info: TriadDiagInput) {
  if (!TRIAD_DIAGNOSTICS_ENABLED) return;

  const durationMs = info.finished - info.started;
  const promptLen = info.prompt?.length ?? 0;
  const outputLen = info.output?.length ?? 0;
  const truncated = outputLen > 0 && info.output.endsWith("…");

  console.info("[TRIAD-DIAG]", {
    stage: info.stage,
    model: info.model,
    durationMs,
    promptChars: promptLen,
    outputChars: outputLen,
    truncated,
    ts: new Date().toISOString(),
  });
}
