"use client";

import { motion } from "framer-motion";
import { Home, ClipboardList, Trophy, Gift, User } from "lucide-react";

type TabType = "home" | "tasks" | "leaderboard" | "redeem" | "profile";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "home" as TabType, label: "Home", icon: Home },
  { id: "tasks" as TabType, label: "Tasks", icon: ClipboardList },
  { id: "leaderboard" as TabType, label: "Leaderboard", icon: Trophy },
  { id: "redeem" as TabType, label: "Redeem", icon: Gift },
  { id: "profile" as TabType, label: "Profile", icon: User },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-kainova-accent"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-kainova-accent/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-[10px] font-medium relative z-10">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area for mobile */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
