/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Send people on the www subdomain to the apex (your current behavior)
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

  // Site-wide headers (you already had these)
  async headers() {
    const csp = [
      "default-src 'self'",
      "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io https://studio.moralclarity.ai",
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
        ],
      },
    ];
  },

  // 👉 This is the key: make /api on your site quietly proxy to your main backend.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://www.moralclarity.ai/api/:path*' },
    ];
  },
};

export default nextConfig;
