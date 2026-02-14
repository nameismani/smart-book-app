"use client";

import { MotionAnimatePresence, MotionDiv } from "@/motion/framer_motion";
import BookmarkDialog from "../dialog/BookmarkDialog";
import { useGetBookmarks, useDeleteBookmark } from "@/hooks/useBookmarkApi";
import Link from "next/link";
import { EditIcon, ExternalLink, Trash2 } from "lucide-react";
import EmptyBookmarkIcon from "@/assets/EmptyBookmarkIcon";
import { BookMarkSkeleton, EmptyBookmark } from "./BookMarkAddon";
import { useRef } from "react";
import ConfirmationModal, {
  ConfirmationModalRef,
} from "../dialog/ConfirmationModal";
import { tBookMark } from "@/types/bookmark.type";

type Props = {
  userId: string;
  search: string;
};

const BookmarkList = ({ userId, search }: Props) => {
  const { data: bookmarks = [], isLoading } = useGetBookmarks(userId, search);
  const { mutateAsync: deleteBookmark, isPending: isDeleting } =
    useDeleteBookmark(userId);

  const deleteModalRef = useRef<ConfirmationModalRef>(null);

  const handleDelete = (bookmark: tBookMark) => {
    deleteModalRef.current?.open({
      title: "Delete Bookmark?",
      message: bookmark?.title,
      type: "danger",
      confirmLabel: "Delete Forever",
      onConfirm: () => deleteBookmark(bookmark?.id).then(() => void 0),
    });
  };

  if (isLoading && bookmarks.length === 0) {
    return <BookMarkSkeleton />;
  }

  if (bookmarks.length === 0) {
    return <EmptyBookmark />;
  }

  return (
    <MotionAnimatePresence mode="popLayout">
      <ConfirmationModal ref={deleteModalRef} />
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

            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
            >
              <ExternalLink size={14} />
              <span className="truncate max-w-75">
                {new URL(bookmark.url).hostname}
              </span>
            </Link>

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
                  userId={userId}
                >
                  <button
                    className="p-2 text-slate-400 active:scale-[0.98] cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <EditIcon size={16} />
                  </button>
                </BookmarkDialog>

                <button
                  onClick={() => handleDelete(bookmark)}
                  disabled={isDeleting}
                  className="p-2 text-slate-400 active:scale-[0.98] cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
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
