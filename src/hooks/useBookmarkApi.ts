"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { useEffect } from "react";

// ================================
// GET BOOKMARKS (Main Query)
// ================================
export const useGetBookmarks = (userId: string, search: string = "") => {
  const supabase = createBrowserSupabaseClient();
  // const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["bookmarks", userId, search],
    queryFn: async () => {
      if (!userId) return [];

      let query = supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (search.trim()) {
        const searchQuery = `%${search.trim()}%`;
        query = query.or(`title.ilike.${searchQuery},url.ilike.${searchQuery}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    meta: { errorTitle: "Error fetching bookmarks" },
  });
};

export const useGetBookmarksPaginated = (
  userId: string,
  search: string = "",
  page: number = 1,
  limit: number = 9,
) => {
  const supabase = createBrowserSupabaseClient();

  return useQuery({
    queryKey: [
      "bookmarks-paginated",
      userId,
      search,
      "page",
      page,
      "limit",
      limit,
    ],
    queryFn: async () => {
      if (!userId) return { data: [], count: 0 };

      // First get total count
      let countQuery = supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (search.trim()) {
        const searchQuery = `%${search.trim()}%`;
        countQuery = countQuery.or(
          `title.ilike.${searchQuery},url.ilike.${searchQuery}`,
        );
      }

      const { count } = await countQuery;

      // Then get paginated data
      let dataQuery = supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (search.trim()) {
        const searchQuery = `%${search.trim()}%`;
        dataQuery = dataQuery.or(
          `title.ilike.${searchQuery},url.ilike.${searchQuery}`,
        );
      }

      const { data, error } = await dataQuery;
      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
      };
    },
    enabled: !!userId,
    // staleTime: 5 * 60 * 1000,
  });
};
// Realtime subscription hook (separate)
export const useBookmarkRealtime = (userId: string) => {
  const queryClient = useQueryClient();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!userId) return;
    // Subscribe to ALL changes on user's bookmarks
    const channel = supabase
      .channel(`bookmarks-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Just invalidate - React Query handles the rest
          // console.log("Live trigger");
          queryClient.invalidateQueries({
            queryKey: ["bookmarks", userId],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: ["bookmarks-paginated", userId],
            exact: false,
          });
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
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
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", userId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks-paginated", userId],
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", userId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks-paginated", userId],
        exact: false,
      });
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
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", userId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarks-paginated", userId],
        exact: false,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete bookmark");
    },
  });
};

export const useAuthUser = () => {
  const supabase = createBrowserSupabaseClient();

  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: 5 * 60 * 1000,
  });
};
