import "./globals.css";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";

export const metadata = {
  title: "Moral Clarity Studio",
  description: "Solace Workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseSessionProvider>
          {children}
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
