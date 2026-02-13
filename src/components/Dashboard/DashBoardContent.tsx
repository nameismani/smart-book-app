"use client";

import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useState } from "react";
import BookmarkList from "./BookmarkList";
import BookmarkModal from "@/components/modal/BookmarkModal";

interface ClientDashboardContentProps {
  initialBookmarks: any[];
  userId: string;
  user: User | null;
}

export default function ClientDashboardContent({
  initialBookmarks,
  userId,
  user,
}: ClientDashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<any>(null);

  const handleOpenAddModal = () => {
    setSelectedBookmark(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bookmark: any) => {
    setSelectedBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookmark(null);
  };

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* TOP: Count + Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-100 hover:border-slate-200 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* LEFT: Count */}
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Your Bookmarks
                </h1>
                <p className="text-xl text-slate-600">
                  {initialBookmarks.length === 1
                    ? "1 bookmark"
                    : `${initialBookmarks.length} bookmarks`}{" "}
                  saved
                </p>
              </div>

              {/* RIGHT: Add Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenAddModal}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-3 whitespace-nowrap"
              >
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
              </motion.button>
            </div>
          </motion.div>

          {/* Bookmarks List OR Empty State */}
          {user && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              <BookmarkList
                initialBookmarks={initialBookmarks}
                userId={userId}
                onEditBookmark={handleOpenEditModal}
              />
            </div>
          )}
        </div>
      </main>

      {/* FULL SCREEN MODAL */}
      <BookmarkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bookmark={selectedBookmark}
      />
    </>
  );
}
