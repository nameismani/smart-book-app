// components/Dashboard/BookmarkList.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database } from "@/types/database";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

interface BookmarkListProps {
  initialBookmarks: Bookmark[];
  userId: string;
  onEditBookmark: (bookmark: Bookmark) => void;
}

export default function BookmarkList({
  initialBookmarks,
  userId,
  onEditBookmark,
}: BookmarkListProps) {
  const supabase = createBrowserSupabaseClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [loading, setLoading] = useState(false);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((current) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as Bookmark, ...current];
            }
            if (payload.eventType === "DELETE") {
              return current.filter((b) => b.id !== (payload.old as any).id);
            }
            if (payload.eventType === "UPDATE") {
              return current.map((b) =>
                b.id === (payload.new as any).id
                  ? (payload.new as Bookmark)
                  : b,
              );
            }
            return current;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const deleteBookmark = async (id: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  // EMPTY STATE
  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-full flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-xl mb-8"
        >
          <svg
            className="w-16 h-16 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-slate-900 mb-3"
        >
          No bookmarks yet
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 mb-1"
        >
          Your collection is empty
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-500"
        >
          Click "Add Bookmark" to save your first link
        </motion.p>
      </motion.div>
    );
  }

  // BOOKMARKS LIST
  return (
    <AnimatePresence>
      {bookmarks.map((bookmark, index) => (
        <motion.div
          key={bookmark.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, delay: index * 0.03 }}
          className="group bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:-translate-y-1"
        >
          {/* LEFT: Number + Title */}
          <div className="flex items-start space-x-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl border-4 border-white"
            >
              {index + 1}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 block truncate bg-blue-50/50 px-2 py-1 rounded-lg group-hover:bg-blue-100 transition-all"
              >
                {new URL(bookmark.url).hostname}
              </a>
            </div>
          </div>

          {/* RIGHT: Date + Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
            <span className="text-xs text-slate-500 font-medium bg-slate-100/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="flex items-center gap-1.5">
              {/* EDIT */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEditBookmark(bookmark)}
                className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </motion.button>

              {/* DELETE */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteBookmark(bookmark.id)}
                disabled={loading}
                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50/80 rounded-xl transition-all duration-200 disabled:opacity-50 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
