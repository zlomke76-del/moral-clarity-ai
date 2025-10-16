/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Canonical redirect (force www → root)
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

  // ✅ Global headers for CORS + embedding
  async headers() {
    const allowedOrigins = [
      'https://moralclarity.ai',
      'https://studio.moralclarity.ai',
      'https://moral-clarity-ai-2-0.webflow.io',
    ];

    const csp = [
      "default-src 'self'",
      "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io https://studio.moralclarity.ai",
    ].join('; ');

    // Apply headers to all routes
    return [
      {
        source: '/:path*',
        headers: [
          // Dynamic CORS allowlist (Vercel doesn’t support inline functions, so use wildcard headers here)
          { key: 'Access-Control-Allow-Origin', value: '*' }, // You can replace * with your specific list once stable
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },

          // Security headers
          { key: 'X-Frame-Options', value: 'ALLOW-FROM https://moral-clarity-ai-2-0.webflow.io' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;
