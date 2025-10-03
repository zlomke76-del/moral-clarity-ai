// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Health / CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Utility: pull an email value from either JSON or form-encoded bodies
async function getEmailFromRequest(req: Request): Promise<string | null> {
  const contentType = req.headers.get("content-type") || "";

  // 1) Try JSON (if client sent application/json)
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      const email =
        body?.email ??
        body?.Email ??
        body?.nam ?? // your Webflow “nam” fallback
        body?.["Newsletter Email"];
      return email ? String(email) : null;
    } catch {
      // fall through to form parsing
    }
  }

  // 2) Handle URL-encoded / multipart forms (Webflow default)
  try {
    const form = await req.formData();
    const email =
      form.get("email") ??
      form.get("Email") ??
      form.get("nam") ??
      form.get("Newsletter Email");
    return email ? String(email) : null;
  } catch {
    // nothing else to parse
  }

  return null;
}

// Basic email format check
function isEmail(str: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export async function POST(req: Request) {
  try {
    const email = await getEmailFromRequest(req);

    if (!email || !isEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Valid email required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) {
      // duplicate key (unique constraint) is OK – already subscribed
      if (error.code === "23505") {
        return NextResponse.json(
          { ok: true, message: "Already subscribed" },
          { headers: corsHeaders }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { ok: true, message: "Thanks! You’re on the list." },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
