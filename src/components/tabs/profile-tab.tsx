"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Wallet, 
  Award, 
  Calendar, 
  Share2, 
  ExternalLink,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useMiniApp } from "@/lib/contexts/miniapp-context";
import { sdk } from "@farcaster/miniapp-sdk";
import { formatKNTWS, getRankTitle } from "@/lib/contracts/kntws";
import { supabase } from "@/lib/supabase/client";

interface UserStats {
  kntws_balance: number;
  total_points: number;
  streak_count: number;
  tasks_completed: number;
  redemptions_count: number;
  created_at: string;
  wallet_address: string | null;
}

export function ProfileTab() {
  const { user } = useMiniApp();
  const [stats, setStats] = useState<UserStats>({
    kntws_balance: 0,
    total_points: 0,
    streak_count: 0,
    tasks_completed: 0,
    redemptions_count: 0,
    created_at: "",
    wallet_address: null,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user.fid) {
      fetchUserStats();
    }
  }, [user.fid]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("fid", user.fid)
        .single();

      if (error) throw error;

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleShare = async () => {
    try {
      await sdk.actions.composeCast({
        text: `I'm ranked on the KAINOVA Agent Grid! 🚀\n\nJoin me and earn KNTWS tokens by completing tasks.\n\n#KAINOVA #AgentGrid #KNTWS`,
        embeds: ["https://your-domain.vercel.app"],
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleViewProfile = async () => {
    if (user.fid) {
      try {
        await sdk.actions.viewProfile({ fid: user.fid });
      } catch (error) {
        console.error("Error viewing profile:", error);
      }
    }
  };

  const copyWalletAddress = () => {
    if (stats.wallet_address) {
      navigator.clipboard.writeText(stats.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rank = getRankTitle(stats.total_points);
  const joinDate = stats.created_at
    ? new Date(stats.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl text-center"
      >
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-kainova-accent/30 mx-auto">
            {user.pfpUrl ? (
              <img
                src={user.pfpUrl}
                alt={user.username || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-kainova-accent to-kainova-glow flex items-center justify-center">
                <User className="w-10 h-10 text-black" />
              </div>
            )}
          </div>
          {/* Rank Badge */}
          <div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-kainova-dark"
            style={{ backgroundColor: rank.color }}
          >
            {stats.total_points >= 10000 ? "👑" : stats.total_points >= 5000 ? "💎" : "⭐"}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-white mb-1">
          {user.displayName || user.username || "Anonymous Agent"}
        </h2>
        {user.username && (
          <p className="text-kainova-accent mb-2">@{user.username}</p>
        )}
        
        {/* Rank Title */}
        <div
          className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-4"
          style={{
            backgroundColor: `${rank.color}20`,
            color: rank.color,
            border: `1px solid ${rank.color}40`,
          }}
        >
          {rank.title}
        </div>

        {/* Join Date */}
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" />
          Agent since {joinDate}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-kainova-glow">
            {formatKNTWS(stats.kntws_balance)}
          </p>
          <p className="text-xs text-gray-400">KNTWS Balance</p>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">
            {stats.total_points.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">Total Points</p>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-orange-400">
            {stats.streak_count}
          </p>
          <p className="text-xs text-gray-400">Day Streak</p>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-400">
            {stats.tasks_completed}
          </p>
          <p className="text-xs text-gray-400">Tasks Completed</p>
        </div>
      </motion.div>

      {/* Wallet Info */}
      {stats.wallet_address && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-kainova-accent" />
            <span className="text-sm font-medium text-white">Wallet Address</span>
          </div>
          <div className="flex items-center gap-2 bg-kainova-dark/50 rounded-lg p-2">
            <code className="flex-1 text-xs text-gray-400 truncate">
              {stats.wallet_address}
            </code>
            <button
              onClick={copyWalletAddress}
              className="p-1.5 rounded-lg bg-kainova-accent/20 text-kainova-accent hover:bg-kainova-accent/30 transition-all"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-4 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-kainova-accent" />
          <span className="text-sm font-bold text-white">Achievements</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: "🚀", label: "First Task", unlocked: stats.tasks_completed > 0 },
            { icon: "🔥", label: "7 Day Streak", unlocked: stats.streak_count >= 7 },
            { icon: "💎", label: "First Redeem", unlocked: stats.redemptions_count > 0 },
            { icon: "🏆", label: "100 Points", unlocked: stats.total_points >= 100 },
            { icon: "👑", label: "Top 10", unlocked: false },
            { icon: "⭐", label: "Grid Master", unlocked: stats.total_points >= 5000 },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg text-center ${
                achievement.unlocked
                  ? "bg-kainova-accent/20"
                  : "bg-kainova-grid/30 opacity-50"
              }`}
            >
              <p className="text-2xl mb-1">{achievement.icon}</p>
              <p className="text-[10px] text-gray-400">{achievement.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <button
          onClick={handleShare}
          className="w-full glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-kainova-accent/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-kainova-accent" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Share Profile</p>
              <p className="text-xs text-gray-400">Invite friends to join</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </button>

        <button
          onClick={handleViewProfile}
          className="w-full glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-kainova-grid flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">View Farcaster</p>
              <p className="text-xs text-gray-400">Open in Farcaster app</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </button>
      </motion.div>
    </div>
  );
}
