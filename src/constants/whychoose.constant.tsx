import { FileText, Folder, Shield } from "lucide-react"; // ✅ Lucide icons

// ================================
// CONSTANTS
// ================================
export const WHY_CHOOSE_FEATURES = [
  {
    icon: FileText,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Save Everything",
    description:
      "Articles, videos, recipes, products - save any link with a single click and never lose track of important content.",
  },
  {
    icon: Folder,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    title: "Stay Organized",
    description:
      "Create collections, add tags, and organize bookmarks your way. Perfect for work, research, or personal use.",
  },
  {
    icon: Shield,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Secure & Private",
    description:
      "Your bookmarks are encrypted and stored securely. Only you have access to your personal library.",
  },
] as const;
