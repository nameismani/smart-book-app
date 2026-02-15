import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description:
    "Never lose important links again! Smart Bookmark saves, organizes, and syncs your bookmarks with real-time updates and powerful search. Built with Next.js 16 + Supabase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
