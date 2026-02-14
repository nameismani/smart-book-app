"use client";

import { User } from "@supabase/supabase-js";
import { MotionDiv } from "@/motion/framer_motion";
import BookmarkList from "./BookmarkList";
import BookmarkDialog from "../dialog/BookmarkDialog";
import { useGetBookmarks } from "@/hooks/useBookmarkApi";
import { Plus } from "lucide-react";
import { BookMarkSkeleton } from "./BookMarkAddon";

type Props = {
  userId: string;
  user: User | null;
};

export const ClientDashboardContent = ({ userId, user }: Props) => {
  const { data: bookmarks = [], isLoading } = useGetBookmarks(userId);

  if (isLoading && bookmarks.length === 0) {
    return <BookMarkSkeleton />;
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {bookmarks.length}{" "}
              {bookmarks.length === 1 ? "bookmark" : "bookmarks"} saved
            </p>
          </MotionDiv>

          {/* RIGHT: Add Button */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <BookmarkDialog mode="create" userId={userId}>
              <button className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2  active:scale-[0.98]">
                <Plus size={16} />
                Add Bookmark
              </button>
            </BookmarkDialog>
          </MotionDiv>
        </div>

        {/* BOOKMARKS LIST */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkList userId={userId} />
          </div>
        )}
      </main>
    </>
  );
};

export default ClientDashboardContent;
