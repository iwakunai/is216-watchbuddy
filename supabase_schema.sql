-- WatchBuddy Profile Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- DROP EXISTING TABLES AND INDEXES (if re-running)
-- ============================================
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS list_items CASCADE;
DROP TABLE IF EXISTS user_lists CASCADE;
DROP TABLE IF EXISTS watch_history CASCADE;
DROP TABLE IF EXISTS watchlist CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop indexes (if they exist separately)
DROP INDEX IF EXISTS idx_watchlist_user;
DROP INDEX IF EXISTS idx_watch_history_user;
DROP INDEX IF EXISTS idx_watch_history_watched_at;
DROP INDEX IF EXISTS idx_user_lists_user;
DROP INDEX IF EXISTS idx_list_items_list;
DROP INDEX IF EXISTS idx_friendships_user;
DROP INDEX IF EXISTS idx_friendships_friend;
DROP INDEX IF EXISTS idx_friendships_status;
DROP INDEX IF EXISTS idx_ratings_user;
DROP INDEX IF EXISTS idx_reviews_user;
DROP INDEX IF EXISTS idx_user_badges_user;
DROP INDEX IF EXISTS idx_activity_feed_user;
DROP INDEX IF EXISTS idx_activity_feed_created;

-- ============================================
-- 0. HELPER FUNCTION FOR RLS
-- ============================================
CREATE OR REPLACE FUNCTION set_config(name text, value text)
RETURNS void AS $$
BEGIN
  PERFORM set_config(name, value, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL, -- Clerk user ID
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. WATCHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    poster_path TEXT,
    release_year INTEGER,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tmdb_id, media_type)
);

CREATE INDEX idx_watchlist_user ON watchlist(user_id);

-- ============================================
-- 3. WATCH HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    poster_path TEXT,
    release_year INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_watch_history_user ON watch_history(user_id);
CREATE INDEX idx_watch_history_watched_at ON watch_history(watched_at DESC);

-- ============================================
-- 4. CUSTOM LISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    sort_by TEXT DEFAULT 'original-asc' CHECK (sort_by IN ('original-asc', 'original-desc', 'date-added', 'rating')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_lists_user ON user_lists(user_id);

-- ============================================
-- 5. LIST ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    poster_path TEXT,
    release_year INTEGER,
    position INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(list_id, tmdb_id, media_type)
);

CREATE INDEX idx_list_items_list ON list_items(list_id);

-- ============================================
-- 6. FRIENDS/RELATIONSHIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    friend_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- ============================================
-- 7. RATINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    poster_path TEXT,
    release_year INTEGER,
    rated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tmdb_id, media_type)
);

CREATE INDEX idx_ratings_user ON ratings(user_id);

-- ============================================
-- 8. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
    review_text TEXT NOT NULL,
    poster_path TEXT,
    release_year INTEGER,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================
-- 9. BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('moodMastery', 'genreExplorer', 'socialButterfly', 'general'))
);

-- ============================================
-- 10. USER BADGES TABLE (EARNED BADGES)
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- ============================================
-- 11. ACTIVITY FEED TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('rating', 'review', 'list', 'friend', 'badge', 'watchparty')),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    reference_id UUID, -- ID of related entity (list_id, badge_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);

-- ============================================
-- INSERT DEFAULT BADGES
-- ============================================
INSERT INTO badges (id, name, description, icon, category) VALUES
('first-watch', 'First Watch', 'Watched your first movie', '🎬', 'general'),
('social-butterfly', 'Social Butterfly', 'Added 5 friends', '🦋', 'socialButterfly'),
('binge-watcher', 'Binge Watcher', 'Watched 10 movies in a week', '📺', 'general'),
('critic', 'Critic', 'Wrote 10 reviews', '✍️', 'general'),
('party-host', 'Party Host', 'Hosted a watch party', '🎉', 'socialButterfly'),
('completionist', 'Completionist', 'Watched 100 movies', '🏆', 'general'),
('mood-happy', 'Happy Viewer', 'Watch 10 movies while happy', '😊', 'moodMastery'),
('mood-sad', 'Emotional Explorer', 'Watch 10 movies while sad', '😢', 'moodMastery'),
('mood-excited', 'Thrill Seeker', 'Watch 10 thrillers', '🤩', 'moodMastery'),
('genre-action', 'Action Hero', 'Watch 20 action movies', '💥', 'genreExplorer'),
('genre-comedy', 'Comedy Fan', 'Watch 20 comedies', '😂', 'genreExplorer'),
('genre-drama', 'Drama Enthusiast', 'Watch 20 dramas', '🎭', 'genreExplorer')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Basic - Users can CRUD their own data)
-- ============================================

-- User Profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (user_id = current_setting('app.user_id', true));
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

-- Watchlist
CREATE POLICY "Users can CRUD own watchlist" ON watchlist FOR ALL USING (user_id = current_setting('app.user_id', true));

-- Watch History
CREATE POLICY "Users can CRUD own history" ON watch_history FOR ALL USING (user_id = current_setting('app.user_id', true));

-- Lists
CREATE POLICY "Users can CRUD own lists" ON user_lists FOR ALL USING (user_id = current_setting('app.user_id', true));
CREATE POLICY "Users can view public lists" ON user_lists FOR SELECT USING (is_public = true);

-- List Items
CREATE POLICY "Users can CRUD own list items" ON list_items FOR ALL USING (
    EXISTS (SELECT 1 FROM user_lists WHERE id = list_id AND user_id = current_setting('app.user_id', true))
);

-- Friendships
CREATE POLICY "Users can CRUD own friendships" ON friendships FOR ALL USING (
    user_id = current_setting('app.user_id', true) OR friend_id = current_setting('app.user_id', true)
);

-- Ratings
CREATE POLICY "Users can CRUD own ratings" ON ratings FOR ALL USING (user_id = current_setting('app.user_id', true));
CREATE POLICY "Users can view friend ratings" ON ratings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM friendships 
        WHERE (user_id = ratings.user_id AND friend_id = current_setting('app.user_id', true) AND status = 'accepted')
        OR (friend_id = ratings.user_id AND user_id = current_setting('app.user_id', true) AND status = 'accepted')
    )
);

-- Reviews
CREATE POLICY "Users can CRUD own reviews" ON reviews FOR ALL USING (user_id = current_setting('app.user_id', true));
CREATE POLICY "Users can view all reviews" ON reviews FOR SELECT USING (true);

-- User Badges
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (user_id = current_setting('app.user_id', true));
CREATE POLICY "System can insert badges" ON user_badges FOR INSERT WITH CHECK (true);

-- Activity Feed
CREATE POLICY "Users can view own activity" ON activity_feed FOR SELECT USING (user_id = current_setting('app.user_id', true));
CREATE POLICY "Users can view friend activity" ON activity_feed FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM friendships 
        WHERE (user_id = activity_feed.user_id AND friend_id = current_setting('app.user_id', true) AND status = 'accepted')
        OR (friend_id = activity_feed.user_id AND user_id = current_setting('app.user_id', true) AND status = 'accepted')
    )
);

-- Badges (public read)
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
