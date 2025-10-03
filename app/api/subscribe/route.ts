// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Be defensive: if body isn't JSON, show useful message
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Expected JSON body" },
        { status: 400, headers: corsHeaders }
      );
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Valid email required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { error } = await supabase.from("subscribers").insert({
      email: parsed.data.email,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Human-friendly HTML when visiting in a browser
export async function GET(_req: Request) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Thanks!</title>
  <meta http-equiv="refresh" content="3; url=https://www.moralclarityai.com/" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
           display: grid; place-items: center; height: 100vh; margin: 0;
           background: #0b1220; color: #fff; }
    .card { background: #121b2e; padding: 24px 28px; border-radius: 12px; max-width: 560px;
            box-shadow: 0 8px 30px rgba(0,0,0,.3); text-align: center; }
    h1 { margin: 0 0 8px; font-size: 20px; }
    p  { margin: 0; color: #b9c4d1; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Thanks — we’ll be in touch soon.</h1>
    <p>You’re being redirected back to Moral Clarity AI…</p>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
