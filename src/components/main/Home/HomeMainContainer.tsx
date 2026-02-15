"use client";

import AuthUI from "@/components/AuthUI";
import { HomeMarketing, HomeWhyChoose } from "@/components/main/Home";
import { useAuthUser } from "@/hooks/useBookmarkApi";
import { User } from "@supabase/supabase-js";

const HomeMainContainer = () => {
  const { data: user = null, isLoading } = useAuthUser();
  const isAuthenticated = !!user;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - SAME */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <HomeMarketing />
            <div className="flex justify-center lg:justify-end">
              <AuthUI user={user as User} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </div>

      <HomeWhyChoose />

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-600">
            <p>
              © {new Date().getFullYear()} BookmarkHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomeMainContainer;
