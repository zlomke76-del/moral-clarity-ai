import { JSDOM } from "jsdom";

export function extractVisibleText(html: string): string {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Remove heavy noise
    ["script", "style", "noscript", "svg"].forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    let text = doc.body?.textContent || "";
    text = text.replace(/\s+/g, " ").trim();

    // Clip to ~8k chars to protect token budget
    return text.slice(0, 8000);
  } catch (err) {
    console.error("Text extraction failed:", err);
    return "";
  }
}
