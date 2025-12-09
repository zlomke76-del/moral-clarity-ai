// app/api/chat/modules/callModel.ts
//--------------------------------------------------------------
// Unified model caller for Optimist / Skeptic / Arbiter
//--------------------------------------------------------------

export async function callModel(model: string, payload: any) {
  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: typeof payload === "string"
                  ? payload
                  : JSON.stringify(payload),
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[callModel] failed:", res.status, await res.text());
      return "[MODEL ERROR]";
    }

    const json = await res.json();
    return json?.output?.[0]?.content?.[0]?.text ?? "[EMPTY MODEL OUTPUT]";
  } catch (err) {
    console.error("[callModel] exception:", err);
    return "[EXCEPTION]";
  }
}
