"use client";

import { signOut } from "@/actions/auth";
import { useAuthUser } from "@/hooks/useBookmarkApi";
import { MotionButton, MotionDiv, MotionHeader } from "@/motion/framer_motion";
import { User } from "@supabase/supabase-js";
import { useTransition } from "react";

type Props = {
  user: User | null;
};

const DashboardHeader = () => {
  const { data: user } = useAuthUser();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  if (!user) return null;

  return (
    <MotionHeader
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg border-b border-slate-200/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-2 md:gap-y-0">
          {/* Logo */}
          <MotionDiv
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              BookmarkHub
            </span>
          </MotionDiv>

          {/* User Menu */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase()}
              </div>
              <span className="font-medium truncate max-w-[150px]">
                {user?.user_metadata?.full_name}
              </span>
            </div>

            <MotionButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              disabled={isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign Out"
              )}
            </MotionButton>
          </MotionDiv>
        </div>
      </div>
    </MotionHeader>
  );
};

export default DashboardHeader;
