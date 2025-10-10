// next.config.mjs
import { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,

  // ✅ Add this section
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://moral-clarity-ai-2-0.webflow.io", // 👈 your Webflow site
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            // 👇 critical line — allow your app to be framed by Webflow
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://moral-clarity-ai-2-0.webflow.io;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
