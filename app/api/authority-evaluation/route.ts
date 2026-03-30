import { NextResponse } from "next/server";

type AuthorityEvaluationPayload = {
  fullName?: string;
  workEmail?: string;
  organization?: string;
  role?: string;
  environment?: string;
  decisionSurface?: string;
  riskLevel?: string;
  scenarioSummary?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: AuthorityEvaluationPayload;

  try {
    payload = (await request.json()) as AuthorityEvaluationPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const requiredFields: Array<keyof AuthorityEvaluationPayload> = [
    "fullName",
    "workEmail",
    "organization",
    "role",
    "environment",
    "decisionSurface",
    "scenarioSummary",
  ];

  for (const field of requiredFields) {
    const value = payload[field];
    if (!value || !String(value).trim()) {
      return NextResponse.json(
        { ok: false, message: `Missing required field: ${field}.` },
        { status: 400 }
      );
    }
  }

  if (!isValidEmail(String(payload.workEmail))) {
    return NextResponse.json(
      { ok: false, message: "Please provide a valid work email." },
      { status: 400 }
    );
  }

  const referenceId = `AE-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    ok: true,
    message: "Authority evaluation request received.",
    referenceId,
  });
}
