// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Keep any existing options you already have here
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },

  // 👇 Add this section
  async headers() {
    return [
      {
        source: "/:path*", // Apply to every route
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io;",
          },
          // Uncomment this ONLY if you previously had X-Frame-Options: DENY or SAMEORIGIN
          // { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },
};

export default nextConfig;
