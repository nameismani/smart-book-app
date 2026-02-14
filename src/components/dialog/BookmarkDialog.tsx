// components/dialog/BookmarkDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { tBookMark } from "@/types/bookmark.type";
import BookmarkForm from "../Dashboard/BookMarkForm";

type Props = {
  children: React.ReactNode;
  bookmark?: tBookMark | null;
  mode: "create" | "edit";
  userId: string;
};

const BookmarkDialog = ({ children, bookmark, mode, userId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "edit" ? "Edit Bookmark" : "Add New Bookmark"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your bookmark details below"
              : "Save a new link to your collection"}
          </DialogDescription>
        </DialogHeader>

        <BookmarkForm
          bookmark={bookmark}
          mode={mode}
          userId={userId}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkDialog;
