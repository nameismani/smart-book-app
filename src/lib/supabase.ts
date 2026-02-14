"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";

// ✅ Server client (async)
export async function createSupabaseServerClient() {
  try {
    const cookieStore = await cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {}
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch {}
          },
        },
      },
    );
  } catch (error) {
    console.error("Failed to create server Supabase client:", error);
    throw error;
  }
}

// ✅ Client client (async wrapper - satisfies "use server")
// export function createSupabaseBrowserClient() {
//   if (typeof window === "undefined") {
//     throw new Error("createBrowserClient must be called from client");
//   }
//   // Return sync browser client inside async function
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   );
// }
