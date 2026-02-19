"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Globe, Clock, Medal, Crown, Loader2 } from "lucide-react";
import { useMiniApp } from "@/lib/contexts/miniapp-context";
import { supabase, LeaderboardEntry } from "@/lib/supabase/client";
import { getRankTitle } from "@/lib/contracts/kntws";

type LeaderboardType = "global" | "friends" | "weekly";

export function LeaderboardTab() {
  const { user } = useMiniApp();
  const [activeType, setActiveType] = useState<LeaderboardType>("global");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeType, user.fid]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from("leaderboard")
        .select("*")
        .order("rank", { ascending: true })
        .limit(100);

      if (activeType === "weekly") {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        query = query.eq("week_start", weekStart.toISOString().split("T")[0]);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLeaderboard(data || []);

      // Get user's rank
      if (user.fid) {
        const { data: userData, error: userError } = await supabase
          .from("leaderboard")
          .select("*")
          .eq("user_fid", user.fid)
          .single();

        if (!userError && userData) {
          setUserRank(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">{rank}</span>;
    }
  };

  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-400";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-transparent border-l-4 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-transparent border-l-4 border-amber-600";
      default:
        return "";
    }
  };

  const types = [
    { id: "global" as LeaderboardType, label: "Global", icon: Globe },
    { id: "friends" as LeaderboardType, label: "Friends", icon: Users },
    { id: "weekly" as LeaderboardType, label: "Weekly", icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-kainova-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kainova-accent to-kainova-glow flex items-center justify-center">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Leaderboard</h2>
            <p className="text-xs text-gray-400">Top agents ranked by points</p>
          </div>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 mt-4">
          {types.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeType === type.id
                    ? "bg-kainova-accent text-black"
                    : "bg-kainova-grid/50 text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-3 h-3" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* User's Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 rounded-2xl glow-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-kainova-accent">
              {userRank.pfp_url ? (
                <img
                  src={userRank.pfp_url}
                  alt={userRank.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-kainova-grid flex items-center justify-center text-lg font-bold">
                  {userRank.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Your Position</p>
              <p className="text-xs text-gray-400">Rank #{userRank.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-kainova-accent">
                {userRank.total_points.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">points</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((entry, index) => {
            const rank = entry.rank || index + 1;
            const rankInfo = getRankTitle(entry.total_points);
            const isCurrentUser = entry.user_fid === user.fid;

            return (
              <motion.div
                key={entry.user_fid}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className={`glass-panel p-3 rounded-xl flex items-center gap-3 ${
                  getRowStyle(rank)
                } ${isCurrentUser ? "glow-border" : ""}`}
              >
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getMedalIcon(rank)}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  {entry.pfp_url ? (
                    <img
                      src={entry.pfp_url}
                      alt={entry.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-kainova-grid flex items-center justify-center text-sm font-bold text-gray-400">
                      {entry.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {entry.display_name || entry.username}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] text-kainova-accent">(You)</span>
                    )}
                  </p>
                  <p className="text-[10px]" style={{ color: rankInfo.color }}>
                    {rankInfo.title}
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {entry.total_points.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {entry.tasks_completed} tasks
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {leaderboard.length === 0 && (
          <div className="text-center py-10">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No rankings available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
