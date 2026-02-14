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
-- 3. POLICIES (CLEAN VERSION)
-- ==============================

-- SELECT
CREATE POLICY "Users can view own bookmarks"
ON bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "Users can insert own bookmarks"
ON bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "Users can update own bookmarks"
ON bookmarks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- ==============================
-- 4. REALTIME CONFIG
-- ==============================

-- Enable realtime for table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- Required for UPDATE/DELETE realtime events
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
