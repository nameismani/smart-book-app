import { createSupabaseServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const requestUrl = new URL(request.url);

    // Handle PKCE hash tokens (your case)
    const hash = requestUrl.hash.slice(1);
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      //   console.log("Processing PKCE tokens:", {
      //     hasAccessToken: !!accessToken,
      //     hasRefreshToken: !!refreshToken,
      //   });

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("setSession error:", error);
        } else {
          console.log("✅ Session set from PKCE tokens");
        }
      }
    }

    // Fallback: Handle code exchange
    const code = requestUrl.searchParams.get("code");
    if (code) {
      //   console.log("Processing code exchange:", code);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("exchangeCodeForSession error:", error);
      } else {
        console.log("✅ Session exchanged from code");
      }
    }

    // Clean redirect without hash/query
    const cleanUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(cleanUrl);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
