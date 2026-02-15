"use client";

import { User } from "@supabase/supabase-js";
import { useMemo, useRef, useState } from "react";
import { MotionDiv } from "@/motion/framer_motion";
import BookmarkList from "./BookMark/BookmarkList";
import BookmarkDialog from "../dialog/BookmarkDialog";
import {
  useBookmarkRealtime,
  useGetBookmarks,
  useGetBookmarksPaginated,
} from "@/hooks/useBookmarkApi";
import { debounce } from "@tanstack/react-pacer";
import { Plus, Search, X } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/common";

type Props = {
  userId: string;
  user: User | null;
};

export const DashboardContent = ({ userId, user }: Props) => {
  const [search, setSearch] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  // just a dummy call to get the total count
  const paginatedData = useGetBookmarksPaginated(userId, search, 1, 9);

  const { page, totalPages, goToPage, limit, changeLimit } = usePagination(
    paginatedData.data?.count || 0,
    9,
  );

  // To register channel for real time database
  useBookmarkRealtime(userId);

  // const { data: bookmarks = [], isLoading } = useGetBookmarks(userId, search);
  const { data, isLoading } = useGetBookmarksPaginated(
    userId,
    search,
    page,
    limit,
  );

  const bookmarks = data?.data || [];
  const totalCount = data?.count || 0;

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(e.target.value);
  // };

  const handleClearSearch = () => {
    setSearch("");
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  const debouncedSetSearch = useMemo(
    () =>
      debounce(
        (term: string) => {
          setSearch(term);
          goToPage(1);
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
      <main className="max-w-7xl min-h-[89dvh] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-rows-[auto_auto_1fr_auto]">
        {/* 🔍 SEARCH BAR */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              ref={searchRef}
              placeholder="Search bookmarks by title or URL..."
              onChange={(e) => {
                debouncedSetSearch(e.target.value);
              }}
              className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute active:scale-[0.98] cursor-pointer right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
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
              {totalCount} {totalCount === 1 ? "bookmark" : "bookmarks"} saved
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <BookmarkDialog mode="create" userId={userId}>
              <button className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-[0.98]">
                <Plus size={16} />
                Add Bookmark
              </button>
            </BookmarkDialog>
          </MotionDiv>
        </div>

        {/* 📋 BOOKMARKS LIST */}
        {user ? (
          <div className="grid grid-rows-[1fr_auto]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BookmarkList
                userId={userId}
                search={search}
                page={page}
                limit={limit}
              />
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
                itemsPerPage={limit}
                onPageChange={goToPage}
                onLimitChange={changeLimit}
                // onResetSearch={handleClearSearch}
                className="mt-5"
              />
            )}
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

export default DashboardContent;
