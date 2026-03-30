import { NextResponse } from "next/server";
import { Resend } from "resend";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
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

  try {
    const resendApiKey = requireEnv("RESEND_API_KEY");
    const authorityEvalTo = requireEnv("AUTHORITY_EVAL_TO");
    const authorityEvalFrom = requireEnv("AUTHORITY_EVAL_FROM");

    const resend = new Resend(resendApiKey);

    const fullName = String(payload.fullName).trim();
    const workEmail = String(payload.workEmail).trim();
    const organization = String(payload.organization).trim();
    const role = String(payload.role).trim();
    const environment = String(payload.environment).trim();
    const decisionSurface = String(payload.decisionSurface).trim();
    const riskLevel = String(payload.riskLevel || "Not specified").trim();
    const scenarioSummary = String(payload.scenarioSummary).trim();

    const html = `
      <div style="background:#06101d;padding:32px;font-family:Inter,Arial,sans-serif;color:#e2e8f0;">
        <div style="max-width:760px;margin:0 auto;border:1px solid rgba(34,211,238,0.18);border-radius:20px;overflow:hidden;background:linear-gradient(180deg,rgba(7,18,33,0.98),rgba(5,14,24,0.98));box-shadow:0 24px 80px rgba(0,0,0,0.35);">
          <div style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.08);background:linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.01));">
            <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#67e8f9;font-weight:700;">
              Authority Access
            </div>
            <h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;color:#ffffff;">
              New Authority Evaluation Request
            </h1>
            <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#94a3b8;">
              Controlled intake received from the Solace Authority System.
            </p>
          </div>

          <div style="padding:24px;">
            <div style="margin-bottom:18px;padding:14px 16px;border:1px solid rgba(34,211,238,0.18);border-radius:14px;background:#071320;color:#cffafe;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;">
              Reference ${escapeHtml(referenceId)}
            </div>

            <table style="width:100%;border-collapse:collapse;">
              <tbody>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;width:220px;">Full name</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(fullName)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Work email</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(workEmail)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Organization</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(organization)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Role</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(role)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Environment</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(environment)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Decision surface</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(decisionSurface)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Risk level</td>
                  <td style="padding:10px 0;color:#e2e8f0;">${escapeHtml(riskLevel)}</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top:20px;">
              <div style="margin-bottom:8px;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">
                Scenario summary
              </div>
              <div style="padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:16px;background:rgba(255,255,255,0.03);color:#e2e8f0;white-space:pre-wrap;line-height:1.7;">
                ${escapeHtml(scenarioSummary)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const text = [
      "New Authority Evaluation Request",
      `Reference: ${referenceId}`,
      "",
      `Full name: ${fullName}`,
      `Work email: ${workEmail}`,
      `Organization: ${organization}`,
      `Role: ${role}`,
      `Environment: ${environment}`,
      `Decision surface: ${decisionSurface}`,
      `Risk level: ${riskLevel}`,
      "",
      "Scenario summary:",
      scenarioSummary,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: authorityEvalFrom,
      to: [authorityEvalTo],
      replyTo: workEmail,
      subject: `Authority Evaluation Request · ${organization} · ${referenceId}`,
      html,
      text,
    });

    if (error) {
      console.error("Authority evaluation email send failed:", error);

      return NextResponse.json(
        {
          ok: false,
          message: "Request received, but email delivery failed.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Authority evaluation request received.",
      referenceId,
    });
  } catch (error) {
    console.error("Authority evaluation route failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "The intake route is not fully configured.",
      },
      { status: 500 }
    );
  }
}
