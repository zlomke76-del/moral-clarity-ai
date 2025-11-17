/* lib/news/extract.ts */

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN || '';

export type ExtractedArticle = {
  success: boolean;
  url: string;
  outlet: string;
  title: string;
  authors: string[];
  published_at: string | null;
  full_text: string;
  clean_text: string;
  raw_html?: string;
  source: 'browserless' | 'tavily' | 'fetch' | 'none';
  error?: string;
};

function deriveOutlet(url: string): string {
  if (!url) return 'unknown';
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    return host.startsWith('www.') ? host.slice(4) : host;
  } catch {
    return 'unknown';
  }
}

function stripHtml(html: string): string {
  if (!html) return '';
  // Remove scripts/styles
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Strip tags
  text = text.replace(/<\/?[^>]+>/g, ' ');
  // Decode a few common entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
  // Collapse whitespace
  return text.replace(/\s+/g, ' ').trim();
}

function clamp(text: string, max = 20_000): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n[...truncated...]';
}

/**
 * Try Browserless (Balanced Extraction – JS enabled, no heavy assets),
 * then fall back to:
 *  - Tavily content (if provided)
 *  - Direct fetch + HTML strip
 */
export async function extractArticle(opts: {
  url: string;
  tavilyContent?: string;
  tavilyTitle?: string;
}): Promise<ExtractedArticle> {
  const { url, tavilyContent, tavilyTitle } = opts;
  const outlet = deriveOutlet(url);

  // If URL missing, just fall back to Tavily or "none".
  if (!url) {
    const text = (tavilyContent || '').trim();
    return {
      success: !!text,
      url,
      outlet,
      title: tavilyTitle || '',
      authors: [],
      published_at: null,
      full_text: clamp(text),
      clean_text: text,
      source: text ? 'tavily' : 'none',
      error: text ? undefined : 'No URL or content provided.',
    };
  }

  // 1) Browserless (preferred)
  if (BROWSERLESS_TOKEN) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s

      const resp = await fetch(
        `https://chrome.browserless.io/content?token=${encodeURIComponent(
          BROWSERLESS_TOKEN
        )}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            options: {
              // Balanced mode: JS enabled, but we avoid extras
              addHeaders: { 'User-Agent': 'MoralClarity-NewsBot/1.0' },
            },
          }),
        }
      );

      clearTimeout(timeout);

      if (resp.ok) {
        const raw = await resp.text();

        // Browserless may return JSON or HTML depending on config.
        let html = raw;
        try {
          const maybeJson = JSON.parse(raw);
          if (typeof maybeJson?.data === 'string') {
            html = maybeJson.data;
          }
        } catch {
          // not JSON: assume HTML string
        }

        const text = stripHtml(html);
        if (text && text.length > 200) {
          return {
            success: true,
            url,
            outlet,
            title: tavilyTitle || '',
            authors: [],
            published_at: null,
            full_text: clamp(text),
            clean_text: text,
            raw_html: clamp(html, 30_000),
            source: 'browserless',
          };
        }
      }
    } catch (err) {
      console.error('[news/extract] Browserless extraction failed', { url, err });
    }
  }

  // 2) Tavily content fallback
  if (tavilyContent && tavilyContent.trim().length > 0) {
    const clean = tavilyContent.trim();
    return {
      success: true,
      url,
      outlet,
      title: tavilyTitle || '',
      authors: [],
      published_at: null,
      full_text: clamp(clean),
      clean_text: clean,
      source: 'tavily',
    };
  }

  // 3) Direct fetch + HTML strip fallback
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s

    const resp = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'MoralClarity-NewsBot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    clearTimeout(timeout);

    if (resp.ok) {
      const html = await resp.text();
      const text = stripHtml(html);
      return {
        success: !!text,
        url,
        outlet,
        title: tavilyTitle || '',
        authors: [],
        published_at: null,
        full_text: clamp(text),
        clean_text: text,
        raw_html: clamp(html, 30_000),
        source: 'fetch',
      };
    }
  } catch (err) {
    console.error('[news/extract] fetch fallback failed', { url, err });
  }

  // 4) Final fallback: nothing
  return {
    success: false,
    url,
    outlet,
    title: tavilyTitle || '',
    authors: [],
    published_at: null,
    full_text: '',
    clean_text: '',
    source: 'none',
    error: 'All extraction methods failed.',
  };
}
