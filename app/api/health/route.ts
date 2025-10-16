import { NextResponse } from "next/server";

const ORIGIN_LIST = [
  "https://moralclarity.ai",
  "https://www.moralclarity.ai",
  "https://studio.moralclarity.ai",
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ORIGIN_LIST.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "null",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
