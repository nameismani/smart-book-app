// hooks/bookmark.ts
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Database } from "@/types/database";
import { tBookMark } from "@/types/bookmark.type";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

// ================================
// GET BOOKMARKS (Main Query)
// ================================
export const useGetBookmarks = (userId: string) => {
  const supabase = createBrowserSupabaseClient();

  return useQuery({
    queryKey: ["bookmarks", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      errorTitle: "Error fetching bookmarks",
    },
  });
};

// ================================
// CREATE BOOKMARK
// ================================
export const useCreateBookmark = (userId: string) => {
  const supabase = createBrowserSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkData: { title: string; url: string }) => {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({
          ...bookmarkData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Bookmark created successfully!");
      // Invalidate ALL bookmark queries for this user
      queryClient.invalidateQueries({ queryKey: ["bookmarks", userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create bookmark");
    },
  });
};

// ================================
// UPDATE BOOKMARK
// ================================
export const useUpdateBookmark = (userId: string) => {
  const supabase = createBrowserSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      url,
    }: {
      id: string;
      title: string;
      url: string;
    }) => {
      const { error } = await supabase
        .from("bookmarks")
        .update({ title, url })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      return { id, title, url };
    },
    onSuccess: () => {
      toast.success("Bookmark updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookmarks", userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update bookmark");
    },
  });
};

// ================================
// DELETE BOOKMARK
// ================================
export const useDeleteBookmark = (userId: string) => {
  const supabase = createBrowserSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success("Bookmark deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookmarks", userId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete bookmark");
    },
  });
};
