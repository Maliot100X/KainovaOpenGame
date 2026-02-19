// Type definitions for KAINOVA Mini-App

// Farcaster User Context
export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string | null;
  pfpUrl: string | null;
  custodyAddress?: string;
}

// Farcaster Context from SDK
export interface FrameContext {
  user: FarcasterUser;
  client: {
    clientFid: number;
    added: boolean;
    notificationDetails?: {
      url: string;
      token: string;
    };
  };
}

// Task Types
export type TaskType = "daily" | "agent" | "social" | "special";

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  kntwsReward: number;
  pointsReward: number;
  requirements: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
  maxCompletions: number | null;
  cooldownHours: number | null;
}

// User Task Status
export type TaskStatus = "pending" | "completed" | "claimed";

export interface UserTask {
  id: string;
  userFid: number;
  taskId: string;
  status: TaskStatus;
  completedAt: string | null;
  claimedAt: string | null;
  proofData: Record<string, any> | null;
  createdAt: string;
}

// Redemption Tier
export type RedemptionTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface RedemptionTierData {
  name: string;
  cost: number;
  color: string;
  icon: string;
  description: string;
  multiplier: number;
}

export interface Redemption {
  id: string;
  userFid: number;
  tier: RedemptionTier;
  kntwsCost: number;
  rewardType: string;
  rewardData: {
    multiplier: number;
    durationHours: number;
    badge: string;
  };
  redeemedAt: string;
  transactionHash: string | null;
  status: "pending" | "completed" | "failed";
}

// User Stats
export interface UserStats {
  fid: number;
  username: string;
  displayName: string | null;
  pfpUrl: string | null;
  walletAddress: string | null;
  totalPoints: number;
  kntwsBalance: number;
  streakCount: number;
  lastCheckin: string | null;
  tasksCompleted: number;
  redemptionsCount: number;
  activeMultiplier: number;
  multiplierExpiresAt: string | null;
  rankTitle: string | null;
  createdAt: string;
  updatedAt: string;
}

// Leaderboard
export interface LeaderboardEntry {
  userFid: number;
  username: string;
  displayName: string | null;
  pfpUrl: string | null;
  weeklyPoints: number;
  totalPoints: number;
  rank: number;
  weekStart: string;
  tasksCompleted: number;
  streakCount: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Checkin Response
export interface CheckinResponse {
  reward: number;
  newStreak: number;
  message: string;
}

// Task Completion Response
export interface TaskCompletionResponse {
  message: string;
  rewards: {
    kntws: number;
    points: number;
  };
}

// Redemption Response
export interface RedemptionResponse {
  id: string;
  tier: RedemptionTier;
  cost: number;
  multiplier: number;
  expiresAt: string;
}

// Webhook Payloads
export interface WebhookPayload {
  event: "miniapp_added" | "miniapp_removed" | "notifications_enabled" | "notifications_disabled";
  data: {
    fid: number;
    notificationDetails?: {
      url: string;
      token: string;
    };
  };
}

// Farcaster Manifest
export interface FarcasterManifest {
  accountAssociation: {
    header: string;
    payload: string;
    signature: string;
  };
  miniapp: {
    version: string;
    name: string;
    subtitle: string;
    description: string;
    iconUrl: string;
    homeUrl: string;
    imageUrl: string;
    buttonTitle: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    webhookUrl: string;
    primaryCategory: string;
    tags: string[];
    heroImageUrl: string;
    tagline: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
    screenshotUrls: string[];
    noindex: boolean;
  };
}

// Mini App Embed
export interface MiniAppEmbed {
  version: string;
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: "launch_frame" | "view_token";
      name: string;
      url?: string;
      splashImageUrl?: string;
      splashBackgroundColor?: string;
    };
  };
}

// Notification
export interface NotificationPayload {
  token: string;
  title: string;
  body: string;
  targetUrl?: string;
}

// Rank Title
export interface RankTitle {
  threshold: number;
  title: string;
  color: string;
}

// Achievement
export interface Achievement {
  id: string;
  icon: string;
  label: string;
  description: string;
  requirement: number;
  unlocked: boolean;
}
