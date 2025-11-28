// app/layout.tsx
import "./globals.css";
import { SupabaseProvider } from "./providers/supabase-provider";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Moral Clarity AI Studio",
  description: "Solace Workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
