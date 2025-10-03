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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle multiple possible field names from Webflow
    const email =
      body.email ||
      body.Email ||
      body.nam || // Webflow fallback
      body["Newsletter Email"];

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString())) {
      return NextResponse.json(
        { ok: false, message: "Valid email required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) {
      // Handle duplicate email gracefully
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
      { ok: false, message: err.message || "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
