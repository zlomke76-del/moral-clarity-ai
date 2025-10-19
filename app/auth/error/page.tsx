// app/auth/error/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string };
}) {
  const err = searchParams.error ?? "unknown_error";
  const desc = searchParams.error_description ?? "Something went wrong during sign-in.";
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-2">Sign-in Error</h1>
      <p className="text-sm text-gray-600 mb-4">
        {desc} ({err})
      </p>
      <a className="underline" href="/auth/sign-in">
        Try again
      </a>
    </main>
  );
}
