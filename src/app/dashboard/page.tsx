import { User } from "@supabase/supabase-js";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ClientDashboardContent from "@/components/Dashboard/DashBoardContent";
import { createSupabaseServerClient } from "@/lib/supabase";

interface DashboardProps {
  searchParams: { modal?: string };
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  let user: User | null = null;
  let bookmarks: any[] = [];

  // Get authenticated user
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.error("Auth error:", error);
  }

  // Fetch user's bookmarks
  if (user) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        bookmarks = data || [];
      }
    } catch (error) {
      console.error("Fetch bookmarks error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader user={user} />
      <ClientDashboardContent
        initialBookmarks={bookmarks}
        userId={user?.id || ""}
        user={user}
      />
    </div>
  );
}
