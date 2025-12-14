import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import crypto from "crypto";

export const runtime = "nodejs";

function fingerprintQuery(body: any) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json();

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const res = await fetch(
    "https://api.uspto.gov/api/v1/patent/applications/search",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": process.env.USPTO_API_KEY!,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "USPTO query failed" },
      { status: 500 }
    );
  }

  const data = await res.json();

  const results = Array.isArray(data?.results)
    ? data.results
    : [];

  // -------------------------------
  // NEGATIVE SPACE DETECTION
  // -------------------------------
  const noResultsFound = results.length === 0;

  const limitedScope =
    !body?.query ||
    !body?.query?.terms ||
    body.query.terms.length < 2;

  const classificationMismatchPossible =
    !body?.query?.classifications ||
    body.query.classifications.length === 0;

  // -------------------------------
  // PERSIST NEGATIVE SPACE ONLY
  // -------------------------------
  await supabase
    .from("uspto_negative_space")
    .insert({
      user_id: user.id,
      workspace_id: body.workspaceId ?? null,
      query_fingerprint: fingerprintQuery(body),
      query_terms: body.query?.terms ?? [],
      filters: body.query ?? {},
      retrieved_at: new Date().toISOString(),
      result_count: results.length,
      no_results_found: noResultsFound,
      limited_scope: limitedScope,
      classification_mismatch_possible:
        classificationMismatchPossible,
      confidence: "low",
      notes: "Scoped USPTO query; absence does not imply clearance.",
    });

  return NextResponse.json({
    ok: true,
    data,
    negativeSpace: {
      noResultsFound,
      limitedScope,
      classificationMismatchPossible,
      confidence: "low",
    },
  });
}
