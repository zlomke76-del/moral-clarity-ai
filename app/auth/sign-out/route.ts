import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CookieOptions } from "@/lib/cookies";

export async function GET() {
  // ⬅️ NEXT 16: MUST AWAIT
  const reqCookies = await cookies();

  // Adapter for compatibility with existing code
  const adapter = {
    cookies: {
      get(name: string) {
        const c = reqCookies.get(name);
        return c ? c.value : null;
      },

      set(name: string, value: string, options: CookieOptions) {
        // Write cookies onto the redirect response
        reqCookies.set({ name, value, ...options });
      },

      delete(name: string) {
        reqCookies.set({
          name,
          value: "",
          maxAge: 0,
        });
      },
    },
  };

  // Clear the session cookie
  adapter.cookies.delete("mcai-session");

  // Send the user back to the sign-in page
  return redirect("/auth/sign-in");
}

