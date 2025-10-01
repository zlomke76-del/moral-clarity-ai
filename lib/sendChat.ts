export type ChatRole = "user" | "assistant" | "system";
export type Mode = "guidance" | "redteam" | "news";

/**
 * Sends chat history to our Next.js API route and returns the assistant's text.
 * Expects only user/assistant turns; we prepend a blank system turn here.
 */
export default async function sendChat(
  history: { role: "user" | "assistant"; content: string }[],
  mode: Mode = "guidance"
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system" as const, content: "" }, // system prompt added server-side too; harmless here
        ...history,
      ] as { role: ChatRole; content: string }[],
      mode,
    }),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  return (data?.text as string) ?? "";
}
