import { cookies } from "next/headers";
import type { CookieMethodsServer, CookieOptions } from "@/lib/cookies";

export default async function SpacesPage() {
  const cookieStore = await cookies(); // ✅ REQUIRED in Next 16

  const cookieAdapter: CookieMethodsServer = {
    get(name: string) {
      return cookieStore.get(name)?.value ?? null; // safe return
    },
    set(name: string, value: string, options?: CookieOptions) {
      cookieStore.set({ name, value, ...options });
    },
    delete(name: string) {
      cookieStore.delete({ name });
    },
  };

  // your existing logic continues here...
}
