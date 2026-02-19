"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMiniApp } from "@/lib/contexts/miniapp-context";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { HomeTab } from "@/components/tabs/home-tab";
import { TasksTab } from "@/components/tabs/tasks-tab";
import { LeaderboardTab } from "@/components/tabs/leaderboard-tab";
import { RedeemTab } from "@/components/tabs/redeem-tab";
import { ProfileTab } from "@/components/tabs/profile-tab";
import { LoadingScreen } from "@/components/ui/loading-screen";

type TabType = "home" | "tasks" | "leaderboard" | "redeem" | "profile";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const { isLoading, user } = useMiniApp();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-kainova-accent/20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kainova-accent to-kainova-glow flex items-center justify-center text-black font-bold text-sm">
              K
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">KAINOVA</h1>
              <p className="text-xs text-kainova-accent">Agent Grid</p>
            </div>
          </div>
          
          {user.username && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">@{user.username}</span>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-kainova-accent/30">
                {user.pfpUrl ? (
                  <img
                    src={user.pfpUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-kainova-grid flex items-center justify-center text-xs">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home" && <HomeTab />}
            {activeTab === "tasks" && <TasksTab />}
            {activeTab === "leaderboard" && <LeaderboardTab />}
            {activeTab === "redeem" && <RedeemTab />}
            {activeTab === "profile" && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
