import pdfParse from "pdf-parse";
import { unzip } from "fflate";

export async function extractTextFromBuffer(
  buf: Buffer,
  filename: string
): Promise<string> {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const data = await pdfParse(buf);
    return data.text || "";
  }

  if (lower.endsWith(".docx")) {
    return extractDocx(buf);
  }

  return "";
}

async function extractDocx(buffer: Buffer): Promise<string> {
  return new Promise((resolve) => {
    unzip(new Uint8Array(buffer), (err, files) => {
      if (err) return resolve("");

      const doc = files["word/document.xml"];
      if (!doc) return resolve("");

      const xml = new TextDecoder("utf-8").decode(doc);
      const text = xml
        .replace(/<w:p[^>]*>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .trim();
      resolve(text);
    });
  });
}
