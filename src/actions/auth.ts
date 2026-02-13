"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  // ✅ No try/catch needed - let redirect happen naturally
  if (error) {
    console.error("OAuth error:", error);
    redirect("/");
  }

  if (data?.url) {
    redirect(data.url); // ✅ This works - ignore NEXT_REDIRECT log
  } else {
    console.error("No OAuth URL returned");
    redirect("/");
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/"); // ✅ This also works
}
