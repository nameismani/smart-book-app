import { createSupabaseServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, redirect_uri } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    // Exchange code for session (sets HTTP-only cookies!)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get user profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return NextResponse.json({
      success: true,
      //   user: {
      //     id: user?.id,
      //     email: user?.email,
      //     full_name: user?.user_metadata?.full_name || user?.email?.split("@")[0],
      //     role: "user", // Your logic here
      //     is_onboarded: true,
      //   },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
