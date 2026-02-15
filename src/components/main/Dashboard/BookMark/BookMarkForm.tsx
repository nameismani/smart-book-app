"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarkFormData, bookmarkSchema } from "@/schema/bookmark.schema";
import { tBookMark } from "@/types/bookmark.type";
import { useCreateBookmark, useUpdateBookmark } from "@/hooks/useBookmarkApi";

type Props = {
  bookmark?: tBookMark | null;
  mode: "create" | "edit";
  userId: string;
  onClose: () => void;
};

const BookmarkForm = ({ bookmark, mode, userId, onClose }: Props) => {
  const isEditMode = mode === "edit";
  const createBookmark = useCreateBookmark(userId);
  const updateBookmark = useUpdateBookmark(userId);
  const isLoading = createBookmark.isPending || updateBookmark.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<BookMarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    mode: "onChange",
    defaultValues: {
      title: bookmark?.title || "",
      url: bookmark?.url || "",
    },
  });

  const onSubmit = async (data: BookMarkFormData) => {
    try {
      if (isEditMode && bookmark) {
        await updateBookmark.mutateAsync({
          id: bookmark.id,
          title: data.title.trim(),
          url: data.url,
        });
      } else {
        await createBookmark.mutateAsync({
          title: data.title.trim(),
          url: data.url,
        });
      }

      onClose();
      reset();
    } catch (error: any) {
      console.error("Bookmark operation failed:", error);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          type="text"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="e.g., React Documentation"
          autoFocus
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600 font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* URL Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          {...register("url")}
          type="url"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="https://react.dev"
          disabled={isLoading}
        />
        {errors.url && (
          <p className="mt-1.5 text-sm text-red-600 font-medium">
            {errors.url.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          className="flex-1 px-4 py-3 active:scale-[0.98] cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 px-4 py-3 active:scale-[0.98] cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>{isEditMode ? "Update" : "Create"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BookmarkForm;
