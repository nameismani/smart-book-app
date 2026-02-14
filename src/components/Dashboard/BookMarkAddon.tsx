"use client";

import EmptyBookmarkIcon from "@/assets/EmptyBookmarkIcon";
import { MotionDiv } from "@/motion/framer_motion";

export const EmptyBookmark = () => {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <EmptyBookmarkIcon />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        No bookmarks yet
      </h3>
      <p className="text-slate-600 max-w-sm">
        Start building your collection! Click "Add Bookmark" to save your first
        link.
      </p>
    </MotionDiv>
  );
};

export const BookMarkSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <MotionDiv
          key={`loader-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 animate-pulse"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="h-6 bg-slate-200 rounded-lg w-4/5"></div>
              <div className="h-5 bg-slate-200 rounded-lg w-3/5"></div>
            </div>
            <div className="h-11 bg-slate-200/70 rounded-lg flex items-center gap-2 px-3 py-2">
              <div className="w-4 h-4 bg-slate-300 rounded"></div>
              <div className="h-4 bg-slate-300 rounded w-24"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-28"></div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </MotionDiv>
      ))}
    </>
  );
};
