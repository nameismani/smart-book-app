// components/modal/BookmarkModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";

const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title too long")
    .trim(),
  url: z
    .string()
    .url("Enter valid URL")
    .refine(
      (val) => val.startsWith("http"),
      "Must start with http:// or https://",
    ),
});

type FormData = z.infer<typeof bookmarkSchema>;

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark?: { id: string; title: string; url: string } | null;
}

export default function BookmarkModal({
  isOpen,
  onClose,
  bookmark,
}: BookmarkModalProps) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!bookmark;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(bookmarkSchema),
    mode: "onChange",
  });

  // Set edit data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (bookmark) {
        setValue("title", bookmark.title);
        setValue("url", bookmark.url);
      } else {
        reset();
      }
    }
  }, [bookmark, isOpen, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isEditMode && bookmark) {
        // EDIT
        const { error } = await supabase
          .from("bookmarks")
          .update({ title: data.title.trim(), url: data.url })
          .eq("id", bookmark.id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // ADD
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

      onClose();
      router.refresh();
    } catch (error: any) {
      setSubmitError(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                {isEditMode ? "Edit Bookmark" : "Add New Bookmark"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 text-3xl font-bold p-1"
              >
                ×
              </motion.button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Title
                </label>
                <input
                  {...register("title")}
                  className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                    errors.title
                      ? "border-red-300 bg-red-50/50 text-red-900 placeholder-red-300"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                  placeholder="Enter bookmark title..."
                />
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 text-sm text-red-600 font-medium"
                  >
                    {errors.title.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  URL
                </label>
                <input
                  {...register("url")}
                  className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.url
                      ? "border-red-300 bg-red-50/50 text-red-900 placeholder-red-300"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                  placeholder="https://example.com"
                />
                {errors.url && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 text-sm text-red-600 font-medium"
                  >
                    {errors.url.message}
                  </motion.p>
                )}
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 text-sm font-medium"
                >
                  {submitError}
                </motion.div>
              )}

              <div className="flex gap-4 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-8 py-4 text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isValid || isSubmitting}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {isEditMode ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        )}
                      </svg>
                      <span>
                        {isEditMode ? "Update Bookmark" : "Add Bookmark"}
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
