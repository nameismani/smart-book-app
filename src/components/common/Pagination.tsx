"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  itemsPerPage: number;
  onLimitChange?: (limit: number) => void;
  className?: string;
};

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  itemsPerPage,
  onLimitChange,
  className,
}: Props) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 sm:flex-row sm:justify-between ${className || ""}`}
    >
      {/* Count Info */}
      <div className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-900">
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}-
          {Math.min(currentPage * itemsPerPage, totalCount)}
        </span>{" "}
        of <span className="font-medium">{totalCount}</span> bookmarks
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Limit Selector */}
        {onLimitChange && (
          <div className="flex items-center gap-2 pl-1 bg-white border border-slate-200 rounded-lg shadow-sm">
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Show:
            </span>
            <Select
              defaultValue={itemsPerPage.toString()}
              onValueChange={(value) => onLimitChange?.(parseInt(value))}
            >
              <SelectTrigger className="w-14 h-9 p-2 border-0 shadow-none hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="6" className="cursor-pointer">
                  6
                </SelectItem>
                <SelectItem value="9" className="cursor-pointer">
                  9
                </SelectItem>
                <SelectItem value="12" className="cursor-pointer">
                  12
                </SelectItem>
                <SelectItem value="18" className="cursor-pointer">
                  18
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 w-9 p-0 -ml-1 active:scale-[0.98] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getVisiblePages().map((pageNum, index) => (
            <Button
              key={index}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() =>
                typeof pageNum === "number" && onPageChange(pageNum)
              }
              disabled={pageNum === "..."}
              className="h-9 w-9 p-0 active:scale-[0.98] cursor-pointer"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 w-9 p-0 -mr-1 active:scale-[0.98] cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
