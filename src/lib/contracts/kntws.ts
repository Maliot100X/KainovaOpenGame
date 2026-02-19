import { ethers } from "ethers";

export const KNTWS_CONTRACT = process.env.NEXT_PUBLIC_KNTWS_CONTRACT || "0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";

export const KNTWS_ABI = [
  // ERC20 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 amount)",
];

export async function getKNTWSBalance(
  provider: ethers.Provider,
  address: string
): Promise<string> {
  try {
    const contract = new ethers.Contract(KNTWS_CONTRACT, KNTWS_ABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error fetching KNTWS balance:", error);
    return "0";
  }
}

export async function transferKNTWS(
  signer: ethers.Signer,
  to: string,
  amount: string
): Promise<ethers.TransactionResponse> {
  const contract = new ethers.Contract(KNTWS_CONTRACT, KNTWS_ABI, signer);
  const decimals = await contract.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);
  return await contract.transfer(to, parsedAmount);
}

export function formatKNTWS(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toFixed(2);
}

// Reward tiers
export const REWARD_TIERS = {
  bronze: {
    name: "Bronze",
    cost: 100,
    color: "#cd7f32",
    icon: "🥉",
    description: "Basic reward tier",
    multiplier: 1,
  },
  silver: {
    name: "Silver",
    cost: 500,
    color: "#c0c0c0",
    icon: "🥈",
    description: "Enhanced rewards",
    multiplier: 1.5,
  },
  gold: {
    name: "Gold",
    cost: 1000,
    color: "#ffd700",
    icon: "🥇",
    description: "Premium rewards",
    multiplier: 2,
  },
  platinum: {
    name: "Platinum",
    cost: 5000,
    color: "#e5e4e2",
    icon: "💎",
    description: "Elite rewards",
    multiplier: 3,
  },
  diamond: {
    name: "Diamond",
    cost: 10000,
    color: "#b9f2ff",
    icon: "👑",
    description: "Legendary rewards",
    multiplier: 5,
  },
};

// Rank titles
export const RANK_TITLES = [
  { threshold: 0, title: "Grid Rookie", color: "#666" },
  { threshold: 100, title: "Grid Walker", color: "#888" },
  { threshold: 500, title: "Grid Runner", color: "#00d4ff" },
  { threshold: 1000, title: "Grid Climber", color: "#00f0ff" },
  { threshold: 5000, title: "Grid Master", color: "#ffd700" },
  { threshold: 10000, title: "Grid Legend", color: "#ff6b35" },
  { threshold: 50000, title: "Grid God", color: "#ff006e" },
];

export function getRankTitle(points: number): { title: string; color: string } {
  for (let i = RANK_TITLES.length - 1; i >= 0; i--) {
    if (points >= RANK_TITLES[i].threshold) {
      return {
        title: RANK_TITLES[i].title,
        color: RANK_TITLES[i].color,
      };
    }
  }
  return { title: "Grid Rookie", color: "#666" };
}
