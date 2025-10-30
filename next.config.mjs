/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Needed for react-pdf/pdfjs (it’s ESM and bundles worker)
  transpilePackages: ['react-pdf', 'pdfjs-dist'],

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
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
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
      // Allow pdfjs worker from CDN; also blob: for inline worker
      "worker-src 'self' blob: https://cdnjs.cloudflare.com",
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
    return [{ source: '/api/:path*', destination: 'https://www.moralclarity.ai/api/:path*' }];
  },
};

export default nextConfig;
