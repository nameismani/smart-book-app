"use client";

import { useState, useCallback } from "react";

export const usePagination = (totalCount: number, itemsPerPage: number = 9) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(itemsPerPage);

  const totalPages = Math.ceil(totalCount / limit);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages],
  );

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);
  const reset = () => setPage(1);

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1
  };

  return {
    page,
    totalPages,
    limit,
    itemsPerPage: limit,
    goToPage,
    nextPage,
    prevPage,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    reset,
    changeLimit,
  };
};
