-- KAINOVA Mini-App Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  fid BIGINT PRIMARY KEY,
  username TEXT,
  display_name TEXT,
  pfp_url TEXT,
  wallet_address TEXT,
  total_points INTEGER DEFAULT 0,
  kntws_balance DECIMAL(20, 8) DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_checkin TIMESTAMP WITH TIME ZONE,
  tasks_completed INTEGER DEFAULT 0,
  redemptions_count INTEGER DEFAULT 0,
  active_multiplier DECIMAL(3, 1) DEFAULT 1.0,
  multiplier_expires_at TIMESTAMP WITH TIME ZONE,
  rank_title TEXT,
  notification_token TEXT,
  notification_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('daily', 'agent', 'social', 'special')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  kntws_reward INTEGER NOT NULL DEFAULT 0,
  points_reward INTEGER NOT NULL DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  max_completions INTEGER,
  cooldown_hours INTEGER
);

-- User tasks table (tracks task completion)
CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'claimed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  proof_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_fid, task_id, completed_at)
);

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  kntws_cost INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_data JSONB DEFAULT '{}',
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_hash TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_fid BIGINT REFERENCES users(fid) ON DELETE CASCADE,
  streak_count INTEGER NOT NULL,
  reward INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard view (materialized for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT 
  u.fid AS user_fid,
  u.username,
  u.display_name,
  u.pfp_url,
  COALESCE(w.weekly_points, 0) AS weekly_points,
  u.total_points,
  ROW_NUMBER() OVER (ORDER BY u.total_points DESC) AS rank,
  DATE_TRUNC('week', NOW())::date AS week_start,
  u.tasks_completed,
  u.streak_count
FROM users u
LEFT JOIN (
  SELECT 
    user_fid,
    SUM(points_reward) AS weekly_points
  FROM user_tasks ut
  JOIN tasks t ON ut.task_id = t.id
  WHERE ut.completed_at >= DATE_TRUNC('week', NOW())
  GROUP BY user_fid
) w ON u.fid = w.user_fid
ORDER BY u.total_points DESC;

-- Create index on leaderboard
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_user_fid ON leaderboard(user_fid);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user ON user_tasks(user_fid);
CREATE INDEX IF NOT EXISTS idx_user_tasks_task ON user_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_status ON user_tasks(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON redemptions(user_fid);
CREATE INDEX IF NOT EXISTS idx_checkins_user ON checkins(user_fid);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Function to update user stats after task completion
CREATE OR REPLACE FUNCTION update_user_stats_after_task()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'claimed' AND OLD.status != 'claimed' THEN
    UPDATE users
    SET 
      total_points = total_points + (SELECT points_reward FROM tasks WHERE id = NEW.task_id),
      kntws_balance = kntws_balance + (SELECT kntws_reward FROM tasks WHERE id = NEW.task_id),
      tasks_completed = tasks_completed + 1,
      updated_at = NOW()
    WHERE fid = NEW.user_fid;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user stats update
DROP TRIGGER IF EXISTS update_user_stats ON user_tasks;
CREATE TRIGGER update_user_stats
  AFTER UPDATE ON user_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_after_task();

-- Insert default tasks
INSERT INTO tasks (type, title, description, kntws_reward, points_reward, is_active, max_completions, cooldown_hours) VALUES
  ('daily', 'Daily Check-in', 'Check in daily to maintain your streak and earn rewards', 10, 5, true, 1, 20),
  ('agent', 'Test Alpha Agent', 'Test the Alpha agent and provide feedback on its performance', 50, 25, true, NULL, 24),
  ('agent', 'Test Beta Agent', 'Test the Beta agent and report any issues found', 75, 35, true, NULL, 24),
  ('agent', 'Grid Validator', 'Validate 5 agent grid submissions for accuracy', 30, 15, true, NULL, 12),
  ('social', 'Share on Farcaster', 'Share your KAINOVA progress on Farcaster', 25, 10, true, 3, 24),
  ('social', 'Invite a Friend', 'Invite a friend using your referral link', 100, 50, true, NULL, NULL),
  ('social', 'Like & Recast', 'Like and recast KAINOVA announcements', 15, 5, true, 5, 6),
  ('special', 'Void Driller Challenge', 'Complete the advanced Void Driller protocol', 500, 250, true, 1, 168),
  ('special', 'Weekend Warrior', 'Complete all daily tasks during the weekend', 200, 100, true, 1, 168),
  ('special', 'Grid Master', 'Reach 5000 points in a single week', 1000, 500, true, 1, NULL)
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read own tasks" ON user_tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read own redemptions" ON redemptions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
