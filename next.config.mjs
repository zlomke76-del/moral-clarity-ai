/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Keep www -> apex redirect
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

  // Headers: loosen CSP so Next.js can run, keep frame-ancestors allowlist
  async headers() {
    const csp = [
      "default-src 'self'",
      // Allow Next.js inline/eval scripts and workers
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // allow API/streaming calls to your backend origins
      "connect-src 'self' https://www.moralclarity.ai https://moralclarity.ai",
      // where this page may be embedded
      "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io https://studio.moralclarity.ai"
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          // (Optional) broad CORS while we finish wiring; safe to remove later
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },

          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  // Same-origin /api on studio → proxy to main backend (no CORS)
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://www.moralclarity.ai/api/:path*' },
    ];
  },
};

export default nextConfig;
