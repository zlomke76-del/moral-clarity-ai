// app/api/research/website/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

const TAVILY_URL = 'https://api.tavily.com/search';
const TAVILY_KEY = process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY || '';

type WebsiteResearchBody = {
  url?: string;
  query?: string;
};

function normalizeUrl(input: string | undefined | null): string | null {
  if (!input) return null;
  const t = input.trim();
  if (!t) return null;
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  return `https://${t}`;
}

export async function POST(req: NextRequest) {
  if (!TAVILY_KEY) {
    return NextResponse.json(
      { error: 'TAVILY_API_KEY not configured' },
      { status: 500 }
    );
  }

  let body: WebsiteResearchBody;
  try {
    body = (await req.json()) ?? {};
  } catch {
    body = {};
  }

  const url = normalizeUrl(body.url || body.query);
  if (!url) {
    return NextResponse.json(
      { error: 'Missing url or query in request body' },
      { status: 400 }
    );
  }

  // Tavily: ask specifically about this site
  const tavilyPayload: any = {
    api_key: TAVILY_KEY,
    query: `Evaluate the website at ${url} and extract structure, navigation, headings, calls-to-action, promos, pricing, and key text.`,
    search_depth: 'basic',
    max_results: 5,
    include_raw_content: true,
    include_images: false,
  };

  const r = await fetch(TAVILY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tavilyPayload),
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return NextResponse.json(
      { error: 'Tavily request failed', status: r.status, body: text },
      { status: 502 }
    );
  }

  const data = (await r.json()) as any;

  const first = Array.isArray(data.results) && data.results.length > 0 ? data.results[0] : null;
  const title = first?.title || '';
  const rawContent = first?.raw_content || first?.content || '';

  // crude section extraction; this can be improved later
  const headings: string[] = [];
  const callsToAction: string[] = [];
  const navigation: string[] = [];
  const promoContent: string[] = [];

  if (rawContent) {
    const lines = rawContent.split('\n').map((l: string) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (line.length <= 80 && /^(book|reserve|call|contact|schedule|join|sign up|buy)/i.test(line)) {
        callsToAction.push(line);
      } else if (line.length <= 80 && /^(home|about|pricing|faq|contact|book|events|leagues|parties)/i.test(lower)) {
        navigation.push(line);
      } else if (/special|deal|discount|offer|promo|league|event/i.test(lower)) {
        promoContent.push(line);
      } else if (line.length <= 90) {
        headings.push(line);
      }
    }
  }

  const snapshot = {
    url,
    title,
    sections: {
      headings,
      bodyText: rawContent,
      callsToAction,
      navigation,
      promoContent,
    },
    raw: data,
  };

  return NextResponse.json({ research: snapshot });
}
