"use client";

import { User } from "@supabase/supabase-js";
import { useMemo, useState } from "react";
import { MotionDiv } from "@/motion/framer_motion";
import BookmarkList from "./BookmarkList";
import BookmarkDialog from "../dialog/BookmarkDialog";
import { useGetBookmarks } from "@/hooks/useBookmarkApi";
import { debounce } from "@tanstack/react-pacer";
import { Plus, Search, X } from "lucide-react";

type Props = {
  userId: string;
  user: User | null;
};

export const ClientDashboardContent = ({ userId, user }: Props) => {
  const [search, setSearch] = useState<string>("");

  const { data: bookmarks = [], isLoading } = useGetBookmarks(userId, search);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const debouncedSetSearch = useMemo(
    () =>
      debounce(
        (term: string) => {
          setSearch(term);
        },
        { wait: 500 },
      ),
    [],
  );

  // if (isLoading && bookmarks.length === 0) {
  //   return <BookMarkSkeleton />;
  // }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔍 SEARCH BAR */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookmarks by title or URL..."
              onChange={(e) => {
                debouncedSetSearch(e.target.value);
              }}
              className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          {search && (
            <p className="text-sm text-slate-500 mt-2">
              Found {bookmarks.length}{" "}
              {bookmarks.length === 1 ? "bookmark" : "bookmarks"}
            </p>
          )}
        </div>

        {/* 📊 HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-y-2 md:gap-y-0">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">
              My Bookmarks
            </h1>
            <p className="text-sm md:text-lg text-slate-600">
              {bookmarks.length}{" "}
              {bookmarks.length === 1 ? "bookmark" : "bookmarks"} saved
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <BookmarkDialog mode="create" userId={userId}>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-[0.98]">
                <Plus size={16} />
                Add Bookmark
              </button>
            </BookmarkDialog>
          </MotionDiv>
        </div>

        {/* 📋 BOOKMARKS LIST */}
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookmarkList userId={userId} search={search} />
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500">
              Please sign in to view your bookmarks.
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default ClientDashboardContent;
