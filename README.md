# 🚀 Smart Bookmark App

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%2B%20Auth-purple.svg)](https://supabase.com)
[![React Query](https://img.shields.io/badge/TanStack%20Query-v5-orange.svg)](https://tanstack.com/query)

A modern, full-stack **Smart Bookmark Manager** built with Next.js 16. Manage your bookmarks with real-time sync, search, pagination, and beautiful animations.

## ✨ **Features**

- 🔐 **Google OAuth** via Supabase Auth
- 📱 **Real-time Updates** (Insert/Update/Delete sync across tabs)
- 🔍 **Smart Search** with debounced input
- 📄 **Pagination** with dynamic limits (6/9/12/18 per page)
- 🎨 **Smooth Animations** with Framer Motion
- ✅ **Form Validation** with React Hook Form + Zod
- 📊 **Protected Routes** with Next.js 16 Proxy
- 🎨 **Beautiful UI** with shadcn/ui + Tailwind CSS
- 📱 **Responsive Design** for all devices

## 🛠️ **Tech Stack**

| **Category**      | **Technologies**                 |
| ----------------- | -------------------------------- |
| **Framework**     | Next.js 16 (App Router)          |
| **Database/Auth** | Supabase (PostgreSQL + Realtime) |
| **State/Data**    | TanStack React Query (v5)        |
| **Animations**    | Framer Motion                    |
| **Forms**         | React Hook Form + Zod            |
| **UI**            | shadcn/ui + Tailwind CSS         |
| **Icons**         | Lucide React + React Icons       |
| **TypeScript**    | Full type safety                 |

## 📱 **App Flow**

Home Page (Marketing + Google Login)
↓
Supabase Auth (Google OAuth)
↓
Dashboard (Bookmarks CRUD + Real-time)
↓
Protected Routes (Next.js Proxy)

## 🗄️ **Database Schema**

```sql
-- ==============================
-- 1. CREATE TABLE
-- ==============================
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================
-- 2. ENABLE RLS
-- ==============================
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- ==============================
-- 3. POLICIES
-- ==============================
CREATE POLICY "Users can view own bookmarks" ON bookmarks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON bookmarks
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
FOR DELETE USING (auth.uid() = user_id);

-- ==============================
-- 4. REALTIME CONFIG
-- ==============================
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
```

📂 Project Structure

src/
├── actions/
│ └── auth.ts # Login/Logout actions
├── components/
│ ├── AuthUI.tsx # Google Login UI
│ └── ui/ # shadcn/ui components
├── hooks/
│ └── useBookmarkApi.ts # All bookmark hooks + realtime
├── lib/
│ ├── supabase.ts # Server-side Supabase
│ └── supabase-client.ts # Client-side Supabase
└── app/
├── page.tsx # Home page (Marketing)
└── dashboard/
└── page.tsx # Protected dashboard

🎯 Key Implementation Details

Authentication Flow

Home Page → AuthUI.tsx → supabase-client.ts → auth.ts actions

Dashboard Features
useBookmarkApi.ts: All CRUD + Realtime hooks

Real-time Safety: Window focus refetch backup

Search: Debounced input (500ms)

Pagination: Dynamic limits + smart page numbers

UI/Animations
shadcn/ui + Tailwind CSS + Framer Motion

- Smooth list animations
- Responsive grid (1-3 columns)
- Skeleton loaders
- Pagination controls

🔒 Security Features
RLS Policies: Users see only their data [web:304]

Supabase Auth: Secure Google OAuth

Next.js Proxy: Route protection

Zod Validation: Form safety
