// app/api/files/docx/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      title = "Document",
      sections = [],
      filename = "document.docx",
    } = body;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_1,
            }),
            ...sections.flatMap((s: any) => [
              new Paragraph({
                text: s.heading || "",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph({
                children: [new TextRun(s.text || "")],
              }),
            ]),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const b64 = buffer.toString("base64");

    return NextResponse.json({
      ok: true,
      filename,
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      base64: b64,
      download_url: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${b64}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "DOCX generation failed." },
      { status: 500 }
    );
  }
}
