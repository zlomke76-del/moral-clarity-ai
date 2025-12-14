//--------------------------------------------------------------
// USPTO AUTHORITY ADAPTER (READ-ONLY)
// Returns AuthorityContext — no interpretation
//--------------------------------------------------------------

import { NextResponse } from "next/server";
import type { AuthorityContext } from "@/app/api/chat/modules/authority.types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const timestamp = new Date().toISOString();

  try {
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
      const negative: AuthorityContext = {
        authority: "USPTO",
        scope: "PATENTABILITY",
        status: "NEGATIVE",
        confidence: "LOW",
        reason: "QUERY_FAILED",
        timestamp,
      };

      return NextResponse.json({ ok: true, authority: negative });
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.results) || data.results.length === 0) {
      const negative: AuthorityContext = {
        authority: "USPTO",
        scope: "PATENTABILITY",
        status: "NEGATIVE",
        confidence: "LOW",
        reason: "NO_RESULTS",
        data,
        timestamp,
      };

      return NextResponse.json({ ok: true, authority: negative });
    }

    const positive: AuthorityContext = {
      authority: "USPTO",
      scope: "PATENTABILITY",
      status: "POSITIVE",
      confidence: "MEDIUM",
      data,
      timestamp,
    };

    return NextResponse.json({ ok: true, authority: positive });
  } catch (err: any) {
    const indeterminate: AuthorityContext = {
      authority: "USPTO",
      scope: "PATENTABILITY",
      status: "INDETERMINATE",
      confidence: "LOW",
      reason: "QUERY_EXCEPTION",
      timestamp,
    };

    return NextResponse.json({ ok: true, authority: indeterminate });
  }
}
