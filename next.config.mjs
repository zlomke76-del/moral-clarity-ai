// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // NEW: react-pdf ships ESM that needs transpilation
  transpilePackages: ['react-pdf'],

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.moralclarity.ai' }],
        destination: 'https://moralclarity.ai/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    // --- CSP ---
    // We add cdnjs for the pdf.js worker and allow https: in connect-src so remote PDFs can load.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      [
        "connect-src 'self'",
        "https://moralclarity.ai",
        "https://www.moralclarity.ai",
        "https://*.supabase.co",
        "wss://*.supabase.co",
        "https://api.openai.com",
        "https://api.stripe.com",
        "https://vitals.vercel-insights.com",
        "https://cdnjs.cloudflare.com",         // <-- allow fetching worker + remote PDFs if needed
        "https:"                                // <-- allow viewing PDFs hosted offsite (optional but handy)
      ].join(' '),
      [
        "frame-ancestors 'self'",
        "https://*.webflow.io",
        "https://moral-clarity-ai-2-0.webflow.io",
        "https://studio.moralclarity.ai",
      ].join(' '),
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.supabase.co",
      "font-src 'self' data: https:",
      "media-src 'self' blob:",
      "worker-src 'self' blob: https://cdnjs.cloudflare.com", // <-- allow pdf.js worker from CDN
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },

          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://www.moralclarity.ai/api/:path*' },
    ];
  },
};

export default nextConfig;
