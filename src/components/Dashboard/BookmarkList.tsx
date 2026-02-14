"use client";

import { useEffect, useState } from "react";
import { Database } from "@/types/database";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import BookmarkDialog from "../dialog/BookmarkDialog";
import { MotionAnimatePresence, MotionDiv } from "@/motion/framer_motion";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

type Props = {
  initialBookmarks: Bookmark[];
  userId: string;
};

const BookmarkList = ({ initialBookmarks, userId }: Props) => {
  const supabase = createBrowserSupabaseClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("realtime:bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime event:", payload);

          setBookmarks((current) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as Bookmark, ...current];

              case "DELETE":
                return current.filter(
                  (b) => b.id !== (payload.old as Bookmark).id,
                );

              case "UPDATE":
                return current.map((b) =>
                  b.id === (payload.new as Bookmark).id
                    ? (payload.new as Bookmark)
                    : b,
                );

              default:
                return current;
            }
          });
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

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

  if (bookmarks.length === 0) {
    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-full flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg
            className="w-12 h-12 text-blue-600"
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
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          No bookmarks yet
        </h3>
        <p className="text-slate-600 max-w-sm">
          Start building your collection! Click "Add Bookmark" to save your
          first link.
        </p>
      </MotionDiv>
    );
  }

  return (
    <MotionAnimatePresence mode="popLayout">
      {bookmarks.map((bookmark, index) => (
        <MotionDiv
          key={bookmark.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-slate-200 transition-all duration-300"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-tight">
              {bookmark.title}
            </h3>

            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span className="truncate line max-w-75">
                {new URL(bookmark.url).hostname}
              </span>
            </a>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <div className="flex items-center gap-2">
                <BookmarkDialog
                  mode="edit"
                  bookmark={{
                    id: bookmark.id,
                    title: bookmark.title ?? "",
                    url: bookmark.url,
                  }}
                >
                  <button
                    className="p-2 text-slate-400 active:scale-[0.98] cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                </BookmarkDialog>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  disabled={loading}
                  className="p-2 text-slate-400 active:scale-[0.98] cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
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
                </button>
              </div>
            </div>
          </div>
        </MotionDiv>
      ))}
    </MotionAnimatePresence>
  );
};

export default BookmarkList;
