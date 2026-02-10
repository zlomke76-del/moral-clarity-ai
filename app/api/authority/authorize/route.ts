import { NextRequest, NextResponse } from "next/server";
import { authorizeIntent } from "@/lib/solace/authorityClient";

export async function POST(req: NextRequest) {
  try {
    const intent = await req.json();

    const decision = await authorizeIntent(intent);

    return NextResponse.json(decision, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        permitted: false,
        decision: "DENY",
        reason: err?.message ?? "authority_route_error",
      },
      { status: 500 }
    );
  }
}
