import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client for browser (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface User {
  fid: number;
  username: string;
  display_name: string | null;
  pfp_url: string | null;
  wallet_address: string | null;
  total_points: number;
  kntws_balance: number;
  created_at: string;
  updated_at: string;
  streak_count: number;
  last_checkin: string | null;
  rank_title: string | null;
}

export interface Task {
  id: string;
  type: "daily" | "agent" | "social" | "special";
  title: string;
  description: string;
  kntws_reward: number;
  points_reward: number;
  requirements: Record<string, any>;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  max_completions: number | null;
  cooldown_hours: number | null;
}

export interface UserTask {
  id: string;
  user_fid: number;
  task_id: string;
  status: "pending" | "completed" | "claimed";
  completed_at: string | null;
  claimed_at: string | null;
  proof_data: Record<string, any> | null;
  created_at: string;
}

export interface Redemption {
  id: string;
  user_fid: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  kntws_cost: number;
  reward_type: string;
  reward_data: Record<string, any>;
  redeemed_at: string;
  transaction_hash: string | null;
  status: "pending" | "completed" | "failed";
}

export interface LeaderboardEntry {
  user_fid: number;
  username: string;
  display_name: string | null;
  pfp_url: string | null;
  weekly_points: number;
  total_points: number;
  rank: number;
  week_start: string;
  tasks_completed: number;
  streak_count: number;
}
