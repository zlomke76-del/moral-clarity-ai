// app/api/chat/modules/callModel.ts
//--------------------------------------------------------------
// Unified model caller for Optimist / Skeptic / Arbiter
// FULL ASCII-SAFE VERSION — Prevents ALL ByteString Errors
//--------------------------------------------------------------

function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  let out = input;

  for (const bad of Object.keys(replacements)) {
    out = out.split(bad).join(replacements[bad]);
  }

  // Replace any non-ASCII (>255)
  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

export async function callModel(model: string, payload: any) {
  try {
    //----------------------------------------------------------
    // 1. Convert payload to JSON string
    //----------------------------------------------------------
    let raw = "";

    try {
      raw = typeof payload === "string" ? payload : JSON.stringify(payload);
    } catch {
      raw = String(payload ?? "");
    }

    //----------------------------------------------------------
    // 2. SANITIZE the entire payload string
    //----------------------------------------------------------
    const safeText = sanitizeASCII(raw);

    //----------------------------------------------------------
    // 3. Build sanitized request
    //----------------------------------------------------------
    const requestBody = {
      model,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: safeText,
            },
          ],
        },
      ],
    };

    //----------------------------------------------------------
    // 4. Call OpenAI Responses API
    //----------------------------------------------------------
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      console.error(
        "[callModel] failed:",
        res.status,
        await res.text()
      );
      return "[MODEL ERROR]";
    }

    //----------------------------------------------------------
    // 5. Parse and sanitize model output
    //----------------------------------------------------------
    const json = await res.json();
    const out =
      json?.output?.[0]?.content?.[0]?.text ?? "[EMPTY MODEL OUTPUT]";

    return sanitizeASCII(out);
  } catch (err) {
    console.error("[callModel] exception:", err);
    return "[EXCEPTION]";
  }
}

