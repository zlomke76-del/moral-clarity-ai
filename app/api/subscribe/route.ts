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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let email: string | null = null;

    if (contentType.includes("application/json")) {
      // JSON body
      const body = await req.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, message: "Valid email required" },
          { status: 400, headers: corsHeaders }
        );
      }
      email = parsed.data.email;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Classic form post (Webflow default)
      const text = await req.text();
      const params = new URLSearchParams(text);

      // Try common field names
      email =
        params.get("email") ||
        params.get("Email") ||
        params.get("Newsletter Email") ||
        params.get("newsletter-email") ||
        null;

      // Validate
      const parsed = schema.safeParse({ email });
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, message: "Valid email required" },
          { status: 400, headers: corsHeaders }
        );
      }
      email = parsed.data.email;
    } else if (contentType.includes("multipart/form-data")) {
      // In case Webflow or another client sends multipart
      const form = await req.formData();
      const raw = (form.get("email") ||
        form.get("Email") ||
        form.get("Newsletter Email") ||
        form.get("newsletter-email")) as string | null;

      const parsed = schema.safeParse({ email: raw ?? null });
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, message: "Valid email required" },
          { status: 400, headers: corsHeaders }
        );
      }
      email = parsed.data.email;
    } else {
      // Unknown content-type; you can choose to reject or try to parse anyway
      return NextResponse.json(
        { ok: false, message: "Unsupported Content-Type" },
        { status: 415, headers: corsHeaders }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) {
      // If duplicate, treat as success
      if (error.message && /duplicate key/i.test(error.message)) {
        return NextResponse.json({ ok: true }, { headers: corsHeaders });
      }
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
