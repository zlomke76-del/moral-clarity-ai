// app/api/files/pdf/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { html, filename } = await req.json().catch(() => ({}));

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid HTML" },
        { status: 400 }
      );
    }

    const safeName = filename || "document.pdf";

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "35px",
        bottom: "45px",
        left: "35px",
        right: "35px",
      },
    });

    await browser.close();

    const b64 = pdfBuffer.toString("base64");

    return NextResponse.json({
      ok: true,
      filename: safeName,
      mime: "application/pdf",
      base64: b64,
      download_url: `data:application/pdf;base64,${b64}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "PDF generation failed." },
      { status: 500 }
    );
  }
}
