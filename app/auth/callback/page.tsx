// app/auth/callback/page.tsx
'use client';

export default function AuthCallbackPage() {
  // The real work is done in app/auth/callback/route.ts
  // This page is only here to show something briefly if the browser
  // ever renders the route directly.
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Finishing sign-in…</p>
    </div>
  );
}
