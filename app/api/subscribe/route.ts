import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// helper to pull email from JSON, formdata, or query string
async function getEmailFromRequest(req: Request): Promise<string | null> {
  const url = new URL(req.url);

  // 1. Query string ?email= or ?nam= or ?Newsletter%20Email=
  const qsEmail =
    url.searchParams.get("email") ||
    url.searchParams.get("nam") ||
    url.searchParams.get("Newsletter Email");
  if (qsEmail) return String(qsEmail);

  // 2. JSON body
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      const email =
        body?.email ??
        body?.Email ??
        body?.nam ??
        body?.["Newsletter Email"];
      if (email) return String(email);
    } catch {
      // ignore JSON parse errors
    }
  }

  // 3. FormData (Webflow sends x-www-form-urlencoded → available as formData)
  try {
    const form = await req.formData();
    const email =
      form.get("email") ??
      form.get("Email") ??
      form.get("nam") ??
      form.get("Newsletter Email");
    if (email) return String(email);
  } catch {
    // ignore
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const email = await getEmailFromRequest(req);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Valid email required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // insert into Supabase
    const { error } = await supabase
      .from("subscribers")
      .insert([{ email }]);

    if (error) {
      // duplicate email = success (idempotent insert)
      const isDup =
        error.message?.includes("duplicate key") ||
        error.code === "23505";
      if (!isDup) {
        return NextResponse.json(
          { ok: false, message: error.message },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { ok: true, email },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err.message ?? "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
