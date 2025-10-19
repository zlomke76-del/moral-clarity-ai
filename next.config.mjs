/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // www → apex
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

  // Security & CSP
  async headers() {
    // NOTE: keep this list tight; add/remove origins as your app needs
    const csp = [
      "default-src 'self'",
      // Allow Next inline style and runtime JS (needed for Next 14 app router)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "style-src 'self' 'unsafe-inline'",
      //
