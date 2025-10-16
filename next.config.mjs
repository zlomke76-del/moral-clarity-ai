/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Canonical redirect (force www → apex)
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

  // ✅ Global headers (CSP controls embedding; CORS headers optional)
  async headers() {
    const csp = [
      "default-src 'self'",
      // Use CSP for embedding control instead of X-Frame-Options
      "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io https://studio.moralclarity.ai",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          // You can remove these CORS headers now that we’re using a same-origin /api proxy.
          // If you still want generic CORS, keep them (but prefer a specific allowlist later).
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },

          // Security headers
          // NOTE: X-Frame-Options is deprecated/ignored when CSP frame-ancestors is present.
          // { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  // ✅ Same-origin /api → proxy to your backend to avoid CORS entirely
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://www.moralclarity.ai/api/:path*' },
    ];
  },
};

export default nextConfig;
