"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Target, Zap, Crown, ChevronRight, Trophy } from "lucide-react";
import { useMiniApp } from "@/lib/contexts/miniapp-context";
import { formatKNTWS, getRankTitle } from "@/lib/contracts/kntws";
import { supabase } from "@/lib/supabase/client";

interface UserStats {
  kntws_balance: number;
  total_points: number;
  streak_count: number;
  tasks_completed: number;
  last_checkin: string | null;
}

export function HomeTab() {
  const { user } = useMiniApp();
  const [stats, setStats] = useState<UserStats>({
    kntws_balance: 0,
    total_points: 0,
    streak_count: 0,
    tasks_completed: 0,
    last_checkin: null,
  });
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const rank = getRankTitle(stats.total_points);

  useEffect(() => {
    if (user.fid) {
      fetchUserStats();
    }
  }, [user.fid]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("kntws_balance, total_points, streak_count, tasks_completed, last_checkin")
        .eq("fid", user.fid)
        .single();

      if (error) throw error;

      if (data) {
        setStats({
          kntws_balance: data.kntws_balance || 0,
          total_points: data.total_points || 0,
          streak_count: data.streak_count || 0,
          tasks_completed: data.tasks_completed || 0,
          last_checkin: data.last_checkin,
        });
        
        // Check if can check in (last checkin was yesterday or earlier)
        if (data.last_checkin) {
          const lastCheckin = new Date(data.last_checkin);
          const now = new Date();
          const diffHours = (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60);
          setCanCheckIn(diffHours >= 20);
        } else {
          setCanCheckIn(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!user.fid || !canCheckIn || isCheckingIn) return;

    setIsCheckingIn(true);
    try {
      const response = await fetch("/api/tasks/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: user.fid }),
      });

      if (response.ok) {
        const result = await response.json();
        setStats((prev) => ({
          ...prev,
          kntws_balance: prev.kntws_balance + result.reward,
          streak_count: result.newStreak,
          last_checkin: new Date().toISOString(),
        }));
        setCanCheckIn(false);
      }
    } catch (error) {
      console.error("Check-in error:", error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold text-white">
              {user.displayName || user.username || "Agent"}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Rank</p>
            <p className="text-sm font-bold" style={{ color: rank.color }}>
              {rank.title}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-kainova-grid/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-kainova-accent" />
              <span className="text-xs text-gray-400">Balance</span>
            </div>
            <p className="text-2xl font-bold text-kainova-glow">
              {formatKNTWS(stats.kntws_balance)}
            </p>
            <p className="text-[10px] text-gray-500">KNTWS</p>
          </div>

          <div className="bg-kainova-grid/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Points</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.total_points.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">Total Earned</p>
          </div>
        </div>

        {/* Streak */}
        <div className="mt-3 flex items-center justify-between bg-kainova-grid/30 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-white">{stats.streak_count} Day Streak</p>
              <p className="text-[10px] text-gray-400">Keep it going!</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-6 rounded-full ${
                  i < stats.streak_count % 7
                    ? "bg-orange-500"
                    : "bg-kainova-grid"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Daily Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={handleCheckIn}
          disabled={!canCheckIn || isCheckingIn}
          className={`w-full glass-panel p-4 rounded-2xl flex items-center justify-between transition-all ${
            canCheckIn
              ? "glow-border hover:bg-kainova-accent/10 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kainova-accent to-kainova-glow flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Daily Check-in</p>
              <p className="text-xs text-gray-400">
                {canCheckIn
                  ? "Claim 10 KNTWS now!"
                  : "Come back tomorrow"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-kainova-accent" />
        </button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium text-white">Active Tasks</span>
          </div>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-[10px] text-gray-400">Available now</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-kainova-gold" />
            <span className="text-xs font-medium text-white">Your Rank</span>
          </div>
          <p className="text-2xl font-bold text-white">#42</p>
          <p className="text-[10px] text-gray-400">Global leaderboard</p>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-4 rounded-2xl"
      >
        <h3 className="text-sm font-bold text-white mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {[
            { action: "Completed Daily Check-in", reward: "+10 KNTWS", time: "2h ago" },
            { action: "Tested Alpha Agent", reward: "+50 KNTWS", time: "5h ago" },
            { action: "Shared on Farcaster", reward: "+25 KNTWS", time: "1d ago" },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div>
                <p className="text-sm text-white">{activity.action}</p>
                <p className="text-[10px] text-gray-400">{activity.time}</p>
              </div>
              <span className="text-sm font-bold text-kainova-accent">
                {activity.reward}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
