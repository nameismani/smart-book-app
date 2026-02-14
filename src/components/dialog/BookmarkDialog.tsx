"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookMarkFormData, bookmarkSchema } from "@/schema/bookmark.schema";
import { tBookMark } from "@/types/bookmark.type";

type Props = {
  children: React.ReactNode;
  bookmark?: tBookMark | null;
  mode: "create" | "edit";
};

const BookmarkDialog = ({ children, bookmark, mode }: Props) => {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<BookMarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      if (bookmark && isEditMode) {
        setValue("title", bookmark.title);
        setValue("url", bookmark.url);
      } else {
        reset();
      }
    }
  }, [bookmark, isOpen, setValue, reset, isEditMode]);

  const onSubmit = async (data: BookMarkFormData) => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isEditMode && bookmark) {
        const { error } = await supabase
          .from("bookmarks")
          .update({ title: data.title.trim(), url: data.url })
          .eq("id", bookmark.id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({
            title: data.title.trim(),
            url: data.url,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
      }

      reset();
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Operation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode ? "Edit Bookmark" : "Add New Bookmark"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your bookmark details below"
              : "Save a new link to your collection"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
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
              <p className="mt-1.5 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              {...register("url")}
              type="url"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="https://example.com"
              disabled={isLoading}
            />
            {errors.url && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.url.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 active:scale-[0.98] cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
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
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkDialog;
