// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow Webflow to embed + call your app
  async headers() {
    // If you prefer, put your Webflow domain in an env var and read it here.
    const webflow = "https://moral-clarity-ai-2-0.webflow.io";

    return [
      {
        // apply to everything
        source: "/:path*",
        headers: [
          // CORS for XHR/fetch from the embedded page
          { key: "Access-Control-Allow-Origin", value: webflow },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },

          // Allow framing by your Webflow site
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.webflow.io https://moral-clarity-ai-2-0.webflow.io;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
