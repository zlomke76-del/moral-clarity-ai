import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();

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
  return NextResponse.json({ ok: true, data });
}
