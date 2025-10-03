import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Init Supabase client (env vars from Vercel)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// -----------------------------
// POST  (called by your Webflow form)
// -----------------------------
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, message: "Valid email required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email }]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ ok: false, message: "Database insert failed" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks! We'll be in touch with you soon."
    });
  } catch (err) {
    console.error("POST /subscribe error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// -----------------------------
// GET  (direct browser visit)
// -----------------------------
export async function GET() {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Subscribed • Moral Clarity AI</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0; min-height: 100dvh;
      display: grid; place-items: center;
      font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif;
      background: #0a1220; color: #f6f7fb;
    }
    .card {
      max-width: 640px; padding: 2.5rem 2rem; margin: 2rem;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px; text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    h1 { margin: 0 0 .25rem; font-size: 1.6rem; font-weight: 650; }
    p { margin: .35rem 0; opacity: .9; }
    a.btn {
      display: inline-block; margin-top: 1rem; padding: .7rem 1rem;
      border-radius: 10px; text-decoration: none; font-weight: 600;
      background: #ffd15c; color: #1b1f2a;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>Thanks — you’re on the list!</h1>
    <p>We’ll be in touch soon with updates from <strong>Moral Clarity AI</strong>.</p>
    <p>If this wasn’t you, you can safely ignore this message.</p>
    <a class="btn" href="https://www.moralclarityai.com/">Back to site</a>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
