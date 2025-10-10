// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Keep any of your existing Next.js config above here if needed
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },

  // ✅ Allow embedding from Webflow for /embed or /subscribe pages
  async headers() {
    return [
      {
        source: "/(embed|subscribe)", // applies to both /embed and /subscribe
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
