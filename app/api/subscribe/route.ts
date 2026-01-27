import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let email = "";

    if (ct.includes("application/json")) {
      const data = await req.json().catch(() => ({}));
      email = (data.email || data.Email || "").trim();
    } else {
      const form = await req.formData().catch(() => null);
      email = String(
        form?.get("email") ||
          form?.get("Email") ||
          form?.get("Newsletter Email") ||
          ""
      ).trim();
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Valid email required" },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.error("Missing Supabase env vars");
      return NextResponse.json(
        { ok: false, message: "Server config error" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, serviceKey);
    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) {
      const msg = String(error.message || "").toLowerCase();
      const duplicate =
        msg.includes("duplicate") ||
        msg.includes("unique") ||
        msg.includes("exists");

      if (!duplicate) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { ok: false, message: "Database insert failed" },
          { status: 500 }
        );
      }
    }

    // ✅ Success response ONLY
    return NextResponse.json({
      ok: true,
      message: "Thanks! We'll be in touch with you soon.",
    });
  } catch (err) {
    console.error("POST /api/subscribe error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ GET should NEVER redirect navigation
export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed" },
    { status: 405 }
  );
}
