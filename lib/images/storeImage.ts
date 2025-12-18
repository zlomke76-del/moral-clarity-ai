import { put } from "@vercel/blob";

export async function storeBase64Image(
  base64: string,
  filename: string
): Promise<string> {
  const buffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const blob = await put(filename, buffer, {
    access: "public",
    contentType: "image/png",
  });

  return blob.url; // HTTPS URL
}
