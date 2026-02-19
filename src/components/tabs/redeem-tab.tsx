"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  Sparkles, 
  Crown, 
  Diamond, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock
} from "lucide-react";
import { useMiniApp } from "@/lib/contexts/miniapp-context";
import { REWARD_TIERS, formatKNTWS } from "@/lib/contracts/kntws";
import { supabase } from "@/lib/supabase/client";

type TierKey = "bronze" | "silver" | "gold" | "platinum" | "diamond";

interface RedemptionHistory {
  id: string;
  tier: TierKey;
  kntws_cost: number;
  redeemed_at: string;
  status: string;
}

export function RedeemTab() {
  const { user } = useMiniApp();
  const [balance, setBalance] = useState(0);
  const [redemptions, setRedemptions] = useState<RedemptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingTier, setRedeemingTier] = useState<TierKey | null>(null);
  const [showSuccess, setShowSuccess] = useState<TierKey | null>(null);

  useEffect(() => {
    if (user.fid) {
      fetchData();
    }
  }, [user.fid]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Get user balance
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("kntws_balance")
        .eq("fid", user.fid)
        .single();

      if (userError) throw userError;
      setBalance(userData?.kntws_balance || 0);

      // Get redemption history
      const { data: redemptionData, error: redemptionError } = await supabase
        .from("redemptions")
        .select("*")
        .eq("user_fid", user.fid)
        .order("redeemed_at", { ascending: false });

      if (redemptionError) throw redemptionError;
      setRedemptions(redemptionData || []);
    } catch (error) {
      console.error("Error fetching redeem data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (tier: TierKey) => {
    if (!user.fid || balance < REWARD_TIERS[tier].cost || redeemingTier) return;

    setRedeemingTier(tier);
    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: user.fid, tier }),
      });

      if (response.ok) {
        const result = await response.json();
        setBalance((prev) => prev - REWARD_TIERS[tier].cost);
        setShowSuccess(tier);
        setTimeout(() => setShowSuccess(null), 3000);
        await fetchData();
      }
    } catch (error) {
      console.error("Redemption error:", error);
    } finally {
      setRedeemingTier(null);
    }
  };

  const tiers: { key: TierKey; icon: typeof Gift }[] = [
    { key: "bronze", icon: Gift },
    { key: "silver", icon: Sparkles },
    { key: "gold", icon: Crown },
    { key: "platinum", icon: Diamond },
    { key: "diamond", icon: Crown },
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Redemption Center</h2>
            <p className="text-sm text-gray-400">Spend KNTWS for epic rewards</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Your Balance</p>
            <p className="text-2xl font-bold text-kainova-glow">
              {formatKNTWS(balance)}
            </p>
            <p className="text-[10px] text-gray-500">KNTWS</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-kainova-grid rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-kainova-accent to-kainova-glow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((balance / 10000) * 100, 100)}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">
          Progress to Diamond Tier
        </p>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel p-4 rounded-2xl bg-green-500/20 border-green-500/50"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <div>
                <p className="font-bold text-white">Redemption Successful!</p>
                <p className="text-sm text-gray-300">
                  You redeemed a {REWARD_TIERS[showSuccess].name} reward!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tier Cards */}
      <div className="space-y-3">
        {tiers.map((tier, index) => {
          const tierData = REWARD_TIERS[tier.key];
          const Icon = tier.icon;
          const canAfford = balance >= tierData.cost;
          const isRedeeming = redeemingTier === tier.key;

          return (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel rounded-2xl overflow-hidden transition-all ${
                canAfford ? "hover:scale-[1.02]" : "opacity-60"
              }`}
              style={{
                borderLeft: `4px solid ${tierData.color}`,
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${tierData.color}30, ${tierData.color}10)`,
                        boxShadow: `0 0 20px ${tierData.color}30`,
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: tierData.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {tierData.icon} {tierData.name} Tier
                      </h3>
                      <p className="text-xs text-gray-400">{tierData.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: tierData.color }}>
                      {tierData.cost.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">KNTWS</p>
                  </div>
                </div>

                {/* Rewards List */}
                <div className="bg-kainova-dark/50 rounded-xl p-3 mb-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                    Includes
                  </p>
                  <ul className="space-y-1">
                    <li className="text-xs text-gray-300 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-kainova-accent" />
                      {tierData.multiplier}x Points Multiplier ({tierData.multiplier * 24}h)
                    </li>
                    <li className="text-xs text-gray-300 flex items-center gap-2">
                      <Crown className="w-3 h-3 text-kainova-accent" />
                      Exclusive {tierData.name} Badge
                    </li>
                    {tier.key !== "bronze" && (
                      <li className="text-xs text-gray-300 flex items-center gap-2">
                        <Gift className="w-3 h-3 text-kainova-accent" />
                        Bonus Task Rewards
                      </li>
                    )}
                  </ul>
                </div>

                {/* Redeem Button */}
                <button
                  onClick={() => handleRedeem(tier.key)}
                  disabled={!canAfford || isRedeeming}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    canAfford
                      ? "bg-gradient-to-r hover:opacity-90 text-black"
                      : "bg-kainova-grid text-gray-500 cursor-not-allowed"
                  }`}
                  style={{
                    background: canAfford
                      ? `linear-gradient(135deg, ${tierData.color}, ${tierData.color}dd)`
                      : undefined,
                  }}
                >
                  {isRedeeming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : !canAfford ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Need {formatKNTWS(tierData.cost - balance)} more
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Redeem Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Redemption History */}
      {redemptions.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-3">Your Redemptions</h3>
          <div className="space-y-2">
            {redemptions.slice(0, 5).map((redemption) => {
              const tierData = REWARD_TIERS[redemption.tier];
              return (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: tierData.color }}>{tierData.icon}</span>
                    <span className="text-sm text-white">{tierData.name} Reward</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(redemption.redeemed_at).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-kainova-accent">
                      -{redemption.kntws_cost} KNTWS
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
