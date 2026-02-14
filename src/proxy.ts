import { NextResponse, NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Only protect /dashboard route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // No user → redirect to home
      if (!user) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Pass user ID to server components
      response.headers.set("x-user-id", user.id);
    } catch (error) {
      console.error("Proxy auth error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
