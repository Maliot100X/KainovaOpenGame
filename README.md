# 🚀 KAINOVA Agent Grid Mini-App

A cutting-edge Farcaster Mini-App built on Base that gamifies AI agent interactions with real KNTWS token rewards.

[![Farcaster Mini App](https://img.shields.io/badge/Farcaster-Mini%20App-855DCD)](https://warpcast.com)
[![Base](https://img.shields.io/badge/Base-Chain-0052FF)](https://base.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- **🎯 Task System**: Complete daily, agent, social, and special tasks
- **💎 KNTWS Rewards**: Earn real tokens for completing activities
- **🏆 Leaderboards**: Compete globally, with friends, or weekly
- **🎁 Epic Redemption**: Spend KNTWS for multipliers and exclusive rewards
- **📊 Real-time Stats**: Track your progress and achievements
- **🔔 Notifications**: Get updates on task completion and rewards
- **⚡ Built on Base**: Fast, cheap transactions on Base L2

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **SDKs**: 
  - `@farcaster/miniapp-sdk` - Farcaster integration
  - `@coinbase/onchainkit` - Base wallet & transactions
- **Database**: Supabase (PostgreSQL)
- **Token**: KNTWS on Base (`0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07`)

## 🚀 Quick Start

### Prerequisites

- Node.js 22.11.0 or higher
- npm, pnpm, or yarn
- Farcaster account with Developer Mode enabled
- Supabase account
- Base OnchainKit API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Maliot100X/KainovaOpenGame.git
cd KainovaOpenGame
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEYNAR_API_KEY=your_neynar_key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
```

4. **Set up Supabase database**
   - Go to your Supabase dashboard
   - Open SQL Editor
   - Run the contents of `supabase/schema.sql`

5. **Run the development server**
```bash
npm run dev
```

6. **Test in Farcaster**
   - Use ngrok to expose your local server
   - Test at: `https://farcaster.xyz/~/developers/mini-apps/preview`

## 📱 App Structure

```
/fullmanus
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── tabs/        # Home, Tasks, Leaderboard, Redeem, Profile
│   │   ├── navigation/  # Tab navigation
│   │   └── ui/          # UI components
│   ├── lib/
│   │   ├── contexts/    # Farcaster context
│   │   ├── contracts/   # KNTWS token integration
│   │   ├── supabase/    # Database client
│   │   └── utils/       # Utilities
│   └── styles/          # Global styles
├── supabase/            # Database schema
├── public/              # Static assets
└── .env.example         # Environment template
```

## 🎮 Task Categories

| Category | Description | Rewards |
|----------|-------------|---------|
| **Daily** | Check-ins, daily activities | 10-50 KNTWS |
| **Agent** | Test AI agents, provide feedback | 50-200 KNTWS |
| **Social** | Share, invite, engage on Farcaster | 25-100 KNTWS |
| **Special** | Challenges, limited-time events | 200-1000 KNTWS |

## 🎁 Redemption Tiers

| Tier | Cost | Multiplier | Rewards |
|------|------|------------|---------|
| 🥉 Bronze | 100 | 1x | Basic rewards |
| 🥈 Silver | 500 | 1.5x | Enhanced rewards |
| 🥇 Gold | 1,000 | 2x | Premium rewards |
| 💎 Platinum | 5,000 | 3x | Elite rewards |
| 👑 Diamond | 10,000 | 5x | Legendary rewards |

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_URL` | App URL | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | Yes |
| `NEYNAR_API_KEY` | Neynar API access | Optional |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Base OnchainKit | Yes |
| `KNTWS_CONTRACT_ADDRESS` | Token contract | Auto |

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Domain Configuration

1. Set up custom domain in Vercel
2. Update `NEXT_PUBLIC_URL`
3. Sign manifest at: `https://farcaster.xyz/~/developers/mini-apps/manifest`
4. Copy `accountAssociation` to `src/app/.well-known/farcaster.json`
5. Redeploy

## 📋 Publishing Checklist

- [ ] All environment variables set
- [ ] Supabase schema deployed
- [ ] Farcaster manifest signed
- [ ] Images optimized (icon, splash, screenshots)
- [ ] Webhook endpoint configured
- [ ] Tested in Farcaster preview
- [ ] Deployed to production domain
- [ ] Posted to Base app

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Farcaster](https://farcaster.xyz) - Decentralized social protocol
- [Base](https://base.org) - Ethereum L2 by Coinbase
- [Clanker](https://clanker.world) - Token deployment platform
- [Supabase](https://supabase.com) - Open source Firebase alternative

## 📞 Support

- Farcaster: @your-username
- GitHub Issues: [Create an issue](https://github.com/Maliot100X/KainovaOpenGame/issues)

---

Built with ⚡ by the KAINOVA team
