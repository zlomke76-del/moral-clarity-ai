export async function fetchSnapshot(url: string): Promise<string | null> {
  try {
    const BL_API = process.env.BROWSERLESS_TOKEN;
    if (!BL_API) return null;

    const resp = await fetch(
      `https://chrome.browserless.io/content?token=${BL_API}&url=${encodeURIComponent(url)}`
    );

    if (!resp.ok) return null;

    const html = await resp.text();
    return html;
  } catch (err) {
    console.error("Browserless error:", err);
    return null;
  }
}
