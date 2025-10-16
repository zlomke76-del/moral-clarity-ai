export type ChatRole = "user" | "assistant" | "system";
export type Mode = "guidance" | "redteam" | "news";

export async function sendChat(
  messages: { role: ChatRole; content: string }[],
  mode: Mode = "guidance"
) {
  const res = await fetch("https://www.moralclarity.ai/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

  if (!res.ok) {
    let e = "Request failed";
    try {
      const j = await res.json();
      if (j?.error) e = j.error;
    } catch {}
    throw new Error(e);
  }
  const data = await res.json();
  return data.text as string;
}
