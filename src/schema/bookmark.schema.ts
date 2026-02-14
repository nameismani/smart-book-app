import { z } from "zod";

export const bookmarkSchema = z.object({
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

export type BookMarkFormData = z.infer<typeof bookmarkSchema>;
