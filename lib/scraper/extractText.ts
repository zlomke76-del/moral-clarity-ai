// lib/scraper/extractText.ts
import { JSDOM } from "jsdom";

/**
 * Extracts visible, human-readable text from an HTML document.
 * Strips obvious noise like <script>, <style>, <noscript>, <svg>, etc.
 */
export function extractVisibleText(html: string): string {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Remove heavy noise
    ["script", "style", "noscript", "svg"].forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el: Element) => el.remove());
    });

    let text = doc.body?.textContent || "";

    // Collapse whitespace and trim
    text = text.replace(/\s+/g, " ").trim();

    return text;
  } catch {
    // On parse failure, fail soft
    return "";
  }
}
