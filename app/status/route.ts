// app/status/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // optional, faster + no serverless cold starts

const ORIGIN_LIST = [
  "https://moralclarity.ai",
  "https://www.moralclarity.ai",
  "https://studio.moralclarity.ai",
  // helpful for testing:
  "http://localhost:3000",
  // optional: your vercel preview domain pattern
  // add specific preview URLs here if you fetch from them
];

function corsHeaders(origin: string | null) {
  const allowed = !!origin && ORIGIN_LIST.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "https://studio.moralclarity.ai",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  return NextResponse.json(
    {
      status: "ok",
      message: "Moral Clarity AI backend responding correctly.",
      allowedOrigin: headers["Access-Control-Allow-Origin"],
      timestamp: new Date().toISOString(),
    },
    { headers }
  );
}
