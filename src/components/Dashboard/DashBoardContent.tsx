"use client";

import { User } from "@supabase/supabase-js";
import BookmarkList from "./BookmarkList";
import BookmarkDialog from "../dialog/BookmarkDialog";
import { MotionDiv } from "@/motion/framer_motion";

type Props = {
  initialBookmarks: any[];
  userId: string;
  user: User | null;
};

export const ClientDashboardContent = ({
  initialBookmarks,
  userId,
  user,
}: Props) => {
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TOP BAR: Count Left, Button Right */}
        <div className="flex items-center justify-between mb-8">
          {/* LEFT: Count */}
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
              My Bookmarks
            </h1>
            <p className="text-lg text-slate-600">
              {initialBookmarks.length}{" "}
              {initialBookmarks.length === 1 ? "bookmark" : "bookmarks"} saved
            </p>
          </MotionDiv>

          {/* RIGHT: Add Button */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <BookmarkDialog mode="create">
              <button className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-[0.98]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Bookmark
              </button>
            </BookmarkDialog>
          </MotionDiv>
        </div>

        {/* BOOKMARKS LIST */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkList initialBookmarks={initialBookmarks} userId={userId} />
          </div>
        )}
      </main>
    </>
  );
};

export default ClientDashboardContent;
