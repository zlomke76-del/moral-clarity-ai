// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",                   // allow ALL routes to be framed for now
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
