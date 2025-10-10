// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*", // allow all routes to be framed
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
